import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isLowPowerMode: boolean;
  isTablet: boolean;
  connectionType: string;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isLowPowerMode: false,
    isTablet: false,
    connectionType: 'unknown',
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    const checkMobile = /iPhone|iPod|Android/i.test(ua) && !/iPad/.test(ua);
    const checkTablet = /iPad|Android/i.test(ua) && !/Mobile/.test(ua);

    let isLowPower = false;
    let connType = 'unknown';

    // Check for low power mode or slow connection
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      connType = conn?.effectiveType || 'unknown';
      isLowPower =
        conn?.saveData ||
        conn?.effectiveType === 'slow-2g' ||
        conn?.effectiveType === '2g';
    }

    setDeviceInfo({
      isMobile: checkMobile,
      isLowPowerMode: isLowPower,
      isTablet: checkTablet,
      connectionType: connType,
    });
  }, []);

  return deviceInfo;
};
