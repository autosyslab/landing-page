/**
 * Comprehensive device and browser detection utilities
 * for cross-platform VAPI widget compatibility
 */

export interface BrowserInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  version: string;
  supportsWebRTC: boolean;
  supportsAudio: boolean;
}

export interface DeviceCapabilities {
  hasTouch: boolean;
  screenSize: 'small' | 'medium' | 'large';
  pixelDensity: number;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
}

/**
 * Detects browser type and version with high accuracy
 */
export const getBrowserInfo = (): BrowserInfo => {
  const ua = navigator.userAgent;
  
  // iOS Detection
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  
  // Android Detection
  const isAndroid = /Android/.test(ua);
  
  // Browser Detection
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isEdge = /Edg/.test(ua);
  
  // Device Type
  const isMobile = isIOS || isAndroid || /Mobile/.test(ua);
  const isDesktop = !isMobile;
  
  // Version Detection
  let version = 'unknown';
  if (isChrome) {
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (isFirefox) {
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (isSafari && !isChrome) {
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (isEdge) {
    const match = ua.match(/Edg\/(\d+)/);
    version = match ? match[1] : 'unknown';
  }
  
  // Feature Detection
  const supportsWebRTC = !!(
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia &&
    window.RTCPeerConnection
  );
  
  const supportsAudio = !!(
    window.AudioContext || (window as any).webkitAudioContext
  );
  
  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isFirefox,
    isEdge,
    isMobile,
    isDesktop,
    version,
    supportsWebRTC,
    supportsAudio
  };
};

/**
 * Detects device capabilities for optimal UX
 */
export const getDeviceCapabilities = (): DeviceCapabilities => {
  // Touch Detection
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Screen Size Detection
  const screenWidth = window.innerWidth;
  let screenSize: 'small' | 'medium' | 'large';
  if (screenWidth < 768) {
    screenSize = 'small';
  } else if (screenWidth < 1024) {
    screenSize = 'medium';
  } else {
    screenSize = 'large';
  }
  
  // Pixel Density
  const pixelDensity = window.devicePixelRatio || 1;
  
  // User Preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
  
  return {
    hasTouch,
    screenSize,
    pixelDensity,
    prefersReducedMotion,
    prefersHighContrast
  };
};

/**
 * Checks if the current browser/device combination supports VAPI functionality
 */
export const isVAPISupported = (): { supported: boolean; reason?: string } => {
  const browser = getBrowserInfo();
  
  // Check WebRTC support
  if (!browser.supportsWebRTC) {
    return {
      supported: false,
      reason: 'WebRTC is not supported in this browser'
    };
  }
  
  // Check Audio support
  if (!browser.supportsAudio) {
    return {
      supported: false,
      reason: 'Web Audio API is not supported in this browser'
    };
  }
  
  // Check minimum browser versions
  const minVersions = {
    chrome: 90,
    firefox: 88,
    safari: 14,
    edge: 90
  };
  
  const version = parseInt(browser.version);
  if (browser.isChrome && version < minVersions.chrome) {
    return {
      supported: false,
      reason: `Chrome ${minVersions.chrome}+ is required (current: ${version})`
    };
  }
  
  if (browser.isFirefox && version < minVersions.firefox) {
    return {
      supported: false,
      reason: `Firefox ${minVersions.firefox}+ is required (current: ${version})`
    };
  }
  
  if (browser.isSafari && version < minVersions.safari) {
    return {
      supported: false,
      reason: `Safari ${minVersions.safari}+ is required (current: ${version})`
    };
  }
  
  if (browser.isEdge && version < minVersions.edge) {
    return {
      supported: false,
      reason: `Edge ${minVersions.edge}+ is required (current: ${version})`
    };
  }
  
  return { supported: true };
};

/**
 * Gets platform-specific configuration for optimal VAPI performance
 */
export const getPlatformConfig = () => {
  const browser = getBrowserInfo();
  const device = getDeviceCapabilities();
  
  return {
    // iOS-specific configurations
    ios: {
      requiresUserInteraction: browser.isIOS,
      audioContextSuspended: browser.isIOS && browser.isSafari,
      touchOptimized: true,
      autoplayRestricted: true
    },
    
    // Android-specific configurations
    android: {
      requiresUserInteraction: false,
      audioContextSuspended: false,
      touchOptimized: true,
      autoplayRestricted: false
    },
    
    // Desktop-specific configurations
    desktop: {
      requiresUserInteraction: false,
      audioContextSuspended: false,
      touchOptimized: false,
      autoplayRestricted: browser.isSafari, // Safari on desktop also has restrictions
      enhancedHoverEffects: true
    },
    
    // Current platform config
    current: {
      hasTouch: device.hasTouch,
      screenSize: device.screenSize,
      pixelDensity: device.pixelDensity,
      prefersReducedMotion: device.prefersReducedMotion,
      prefersHighContrast: device.prefersHighContrast,
      ...(browser.isIOS ? {
        requiresUserInteraction: true,
        audioContextSuspended: browser.isSafari,
        touchOptimized: true,
        autoplayRestricted: true
      } : browser.isAndroid ? {
        requiresUserInteraction: false,
        audioContextSuspended: false,
        touchOptimized: true,
        autoplayRestricted: false
      } : {
        requiresUserInteraction: false,
        audioContextSuspended: browser.isSafari,
        touchOptimized: false,
        autoplayRestricted: browser.isSafari,
        enhancedHoverEffects: true
      })
    }
  };
};

/**
 * Monitors browser/device changes for responsive updates
 */
export const createPlatformMonitor = (callback: (config: any) => void) => {
  const mediaQueries = [
    window.matchMedia('(max-width: 767px)'), // Mobile
    window.matchMedia('(prefers-reduced-motion: reduce)'), // Motion preference
    window.matchMedia('(prefers-contrast: high)'), // Contrast preference
    window.matchMedia('(orientation: portrait)'), // Orientation
  ];
  
  const handleChange = () => {
    callback(getPlatformConfig());
  };
  
  // Add listeners
  mediaQueries.forEach(mq => {
    mq.addEventListener('change', handleChange);
  });
  
  // Cleanup function
  return () => {
    mediaQueries.forEach(mq => {
      mq.removeEventListener('change', handleChange);
    });
  };
};