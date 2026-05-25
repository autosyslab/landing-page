/**
 * Error Reporter Utility
 * Sends error reports to n8n webhook for team notification
 */

const WEBHOOK_URL = 'https://n8n-twi3.onrender.com/webhook/812dabb9-0f45-48f0-a216-0bc321d7d500';
const RATE_LIMIT_KEY = 'error_report_history';
const MAX_REPORTS = 3;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes

interface ErrorReport {
  errorType: string;
  errorMessage: string;
  errorCode?: string;
  stackTrace?: string;
  componentStack?: string;
}

interface BrowserInfo {
  userAgent: string;
  language: string;
  platform: string;
  screenSize: string;
  viewport: string;
  browser: string;
  os: string;
  device: string;
}

interface PageContext {
  url: string;
  path: string;
  referrer: string;
  title: string;
}

/**
 * Get detailed browser and device information
 */
const getBrowserInfo = (): BrowserInfo => {
  const ua = navigator.userAgent;

  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  // OS detection
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  // Device type
  let device = 'Desktop';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device = /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Mobile';
  }

  return {
    userAgent: ua,
    language: navigator.language,
    platform: navigator.platform,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    browser,
    os,
    device,
  };
};

/**
 * Get current page context information
 */
const getPageContext = (): PageContext => {
  return {
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer || 'Direct',
    title: document.title,
  };
};

/**
 * Check if user has exceeded rate limit for error reports
 */
const checkRateLimit = (): { allowed: boolean; remainingTime?: number } => {
  try {
    const historyJson = localStorage.getItem(RATE_LIMIT_KEY);
    if (!historyJson) {
      return { allowed: true };
    }

    const history: number[] = JSON.parse(historyJson);
    const now = Date.now();

    // Filter out old reports outside the window
    const recentReports = history.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentReports.length >= MAX_REPORTS) {
      // Calculate when they can report again
      const oldestReport = Math.min(...recentReports);
      const remainingTime = RATE_LIMIT_WINDOW - (now - oldestReport);
      return { allowed: false, remainingTime };
    }

    return { allowed: true };
  } catch (error) {
    console.warn('Rate limit check failed:', error);
    return { allowed: true }; // Allow on error
  }
};

/**
 * Record that a report was sent
 */
const recordReport = (): void => {
  try {
    const historyJson = localStorage.getItem(RATE_LIMIT_KEY);
    const history: number[] = historyJson ? JSON.parse(historyJson) : [];
    const now = Date.now();

    // Add current timestamp
    history.push(now);

    // Keep only recent reports
    const recentReports = history.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentReports));
  } catch (error) {
    console.warn('Failed to record report:', error);
  }
};

/**
 * Generate a session ID for tracking related errors
 */
const getSessionId = (): string => {
  const SESSION_KEY = 'error_session_id';
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

/**
 * Send error report to n8n webhook
 */
export const reportError = async (errorReport: ErrorReport): Promise<{ success: boolean; message: string }> => {
  // Check rate limit first
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    const minutes = Math.ceil((rateLimitCheck.remainingTime || 0) / 60000);
    return {
      success: false,
      message: `You've already reported several issues. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before reporting again.`,
    };
  }

  try {
    const browserInfo = getBrowserInfo();
    const pageContext = getPageContext();
    const sessionId = getSessionId();
    const timestamp = new Date().toISOString();

    // Prepare data payload
    const payload = {
      data: {
        // Error Information
        errorType: errorReport.errorType,
        errorMessage: errorReport.errorMessage,
        errorCode: errorReport.errorCode || 'N/A',
        stackTrace: errorReport.stackTrace || 'Not available',
        componentStack: errorReport.componentStack || 'Not available',

        // Timestamp
        timestamp,

        // Page Context
        pageUrl: pageContext.url,
        pagePath: pageContext.path,
        pageTitle: pageContext.title,
        referrer: pageContext.referrer,

        // Browser & Device Info
        browser: browserInfo.browser,
        os: browserInfo.os,
        device: browserInfo.device,
        userAgent: browserInfo.userAgent,
        language: browserInfo.language,
        platform: browserInfo.platform,
        screenSize: browserInfo.screenSize,
        viewport: browserInfo.viewport,

        // Session Information
        sessionId,
      },
    };

    // Send to webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    // Record successful report
    recordReport();

    return {
      success: true,
      message: 'Thanks for letting us know! We\'ll look into it.',
    };
  } catch (error) {
    console.error('Failed to send error report:', error);
    return {
      success: false,
      message: 'Unable to send report. Please try again later.',
    };
  }
};

/**
 * Helper function to report VAPI errors
 */
export const reportVapiError = async (error: Error | string): Promise<{ success: boolean; message: string }> => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const stackTrace = typeof error === 'string' ? undefined : error.stack;

  return reportError({
    errorType: 'VAPI_ERROR',
    errorMessage,
    errorCode: 'VAPI_001',
    stackTrace,
  });
};

/**
 * Helper function to report React component errors (from ErrorBoundary)
 */
export const reportComponentError = async (
  error: Error,
  componentStack?: string
): Promise<{ success: boolean; message: string }> => {
  return reportError({
    errorType: 'COMPONENT_ERROR',
    errorMessage: error.message,
    errorCode: 'REACT_001',
    stackTrace: error.stack,
    componentStack,
  });
};

/**
 * Helper function to report general errors
 */
export const reportGeneralError = async (
  errorType: string,
  errorMessage: string,
  errorCode?: string
): Promise<{ success: boolean; message: string }> => {
  return reportError({
    errorType,
    errorMessage,
    errorCode,
  });
};
