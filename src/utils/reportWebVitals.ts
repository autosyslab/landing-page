import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

const reportMetric = (metric: Metric) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // Send to analytics in production
  if (import.meta.env.PROD) {
    // Option 1: Send to Google Analytics (if available)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Option 2: Send to custom analytics endpoint (Supabase)
    // Uncomment and configure if needed
    /*
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch((error) => {
      console.error('Failed to send web vitals:', error);
    });
    */
  }

  // Performance thresholds and warnings
  const thresholds = {
    LCP: { good: 2500, needsImprovement: 4000 },
    INP: { good: 200, needsImprovement: 500 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FCP: { good: 1800, needsImprovement: 3000 },
    TTFB: { good: 800, needsImprovement: 1800 },
  };

  const threshold = thresholds[metric.name as keyof typeof thresholds];
  if (threshold && metric.value > threshold.needsImprovement) {
    console.warn(
      `⚠️ ${metric.name} needs improvement:`,
      `${metric.value.toFixed(2)} (threshold: ${threshold.needsImprovement})`
    );
  }
};

export const initWebVitals = () => {
  try {
    onCLS(reportMetric);
    onINP(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);

    console.log('✅ Web Vitals monitoring initialized');
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error);
  }
};

// Helper to get all metrics at once (useful for testing)
export const getWebVitals = (): Promise<Record<string, number>> => {
  return new Promise((resolve) => {
    const metrics: Record<string, number> = {};
    let count = 0;
    const total = 5;

    const collector = (metric: Metric) => {
      metrics[metric.name] = metric.value;
      count++;
      if (count === total) {
        resolve(metrics);
      }
    };

    onCLS(collector);
    onINP(collector);
    onFCP(collector);
    onLCP(collector);
    onTTFB(collector);

    // Timeout after 10 seconds
    setTimeout(() => {
      if (count < total) {
        resolve(metrics);
      }
    }, 10000);
  });
};
