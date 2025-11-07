import React, { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, AlertTriangle, Wifi, WifiOff, Clock } from 'lucide-react';

interface VapiWidgetProps {
  assistantId: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
}

// Browser and device detection utilities
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isChrome = /Chrome/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isEdge = /Edg/.test(ua);
  
  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isFirefox,
    isEdge,
    isMobile: isIOS || isAndroid,
    isDesktop: !isIOS && !isAndroid
  };
};

// Audio context and permissions utilities
const checkAudioSupport = async (): Promise<boolean> => {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }

    // Check if AudioContext is supported
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Audio support check failed:', error);
    return false;
  }
};

const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
    
    // Stop the stream immediately - we just wanted to check permissions
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.warn('Microphone permission denied or unavailable:', error);
    return false;
  }
};

const VapiWidget: React.FC<VapiWidgetProps> = ({
  assistantId,
  onCallStart,
  onCallEnd
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [browserInfo] = useState(getBrowserInfo());
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [demoTimeRemaining, setDemoTimeRemaining] = useState(144); // 2:24 in seconds
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);

  const vapiRef = useRef<Vapi | null>(null);
  const isConnectedRef = useRef(false);
  const initAttempts = useRef(0);
  const maxInitAttempts = 3;
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check audio support on component mount (but NOT permissions)
  useEffect(() => {
    const initAudioCheck = async () => {
      const supported = await checkAudioSupport();
      setAudioSupported(supported);
      // Do NOT request microphone permission here - only check support
      // Permission will be requested when user clicks "Start Conversation"
    };

    initAudioCheck();
  }, []);

  // Check cooldown status on mount and periodically
  useEffect(() => {
    checkCooldown();
    const interval = setInterval(() => {
      checkCooldown();
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Demo timer countdown
  useEffect(() => {
    if (!isConnected) {
      setDemoTimeRemaining(144);
      if (demoTimerRef.current) {
        clearInterval(demoTimerRef.current);
        demoTimerRef.current = null;
      }
      return;
    }

    demoTimerRef.current = setInterval(() => {
      setDemoTimeRemaining((prev) => {
        if (prev <= 1) {
          if (demoTimerRef.current) {
            clearInterval(demoTimerRef.current);
            demoTimerRef.current = null;
          }
          // End call when timer reaches 0
          endCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (demoTimerRef.current) {
        clearInterval(demoTimerRef.current);
        demoTimerRef.current = null;
      }
    };
  }, [isConnected]);

  // Initialize VAPI with retry logic and error handling
  const initializeVapi = useCallback(async () => {
    if (initAttempts.current >= maxInitAttempts) {
      setConnectionError('Failed to initialize voice system after multiple attempts');
      return;
    }

    try {
      setConnectionError(null);

      // Check if we're in development mode
      const isDevelopment = window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1';

      let apiKey: string;

      if (isDevelopment) {
        // Development mode: Use environment variable directly or show friendly message
        console.warn('⚠️ Running in development mode. VAPI functions may not be available.');

        // For development, you can either:
        // 1. Set VITE_VAPI_API_KEY in your .env file, OR
        // 2. The widget will show a "development mode" message
        const devApiKey = import.meta.env.VITE_VAPI_API_KEY;

        if (!devApiKey) {
          setConnectionError('Voice features unavailable in development mode. Deploy to Netlify to test.');
          return;
        }

        apiKey = devApiKey;
      } else {
        // Production mode: Fetch from serverless function
        const tokenResponse = await fetch('/.netlify/functions/get-vapi-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Token fetch failed:', errorText);
          throw new Error('Failed to retrieve API credentials');
        }

        const responseData = await tokenResponse.json();
        apiKey = responseData.apiKey;
      }

      const vapiInstance = new Vapi(apiKey);
      setVapi(vapiInstance);
      vapiRef.current = vapiInstance;
      initAttempts.current++;

      // Enhanced event handlers with platform-specific considerations
      vapiInstance.on('call-start', () => {
        console.log('🔥 CALL STARTED');
        setIsConnected(true);
        isConnectedRef.current = true;
        setIsLoading(false);
        setConnectionError(null);

        onCallStart?.();

        // iOS-specific: Resume audio context if suspended
        if (browserInfo.isIOS) {
          resumeAudioContextIfNeeded();
        }
      });

      vapiInstance.on('call-end', () => {
        console.log('📞 CALL ENDED NORMALLY');
        handleCallEnd();
        onCallEnd?.();
      });

      vapiInstance.on('error', (error) => {
        console.log('📞 Call ended:', error);
        handleCallEnd();
      });

      // Connection status monitoring
      vapiInstance.on('speech-start', () => {
        console.log('🎤 Speech detected');
      });

      vapiInstance.on('speech-end', () => {
        console.log('🔇 Speech ended');
      });

    } catch (error) {
      console.error('Failed to initialize VAPI:', error);
      setConnectionError('Failed to initialize voice system');
      
      // Retry initialization with exponential backoff
      if (initAttempts.current < maxInitAttempts) {
        const retryDelay = Math.pow(2, initAttempts.current) * 1000;
        setTimeout(initializeVapi, retryDelay);
      }
    }
  }, [onCallStart, onCallEnd, browserInfo]);

  // Check cooldown status
  const checkCooldown = useCallback((): boolean => {
    const lastCall = localStorage.getItem('lastVapiCallTimestamp');
    if (!lastCall) {
      setCooldownRemaining(null);
      return true;
    }

    const lastCallTime = parseInt(lastCall);
    const now = Date.now();
    const cooldownPeriod = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const elapsed = now - lastCallTime;

    if (elapsed < cooldownPeriod) {
      const remaining = cooldownPeriod - elapsed;
      setCooldownRemaining(remaining);
      return false;
    }

    setCooldownRemaining(null);
    return true;
  }, []);

  // iOS-specific audio context handling
  const resumeAudioContextIfNeeded = useCallback(async () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log('Audio context resumed for iOS');
      }
    } catch (error) {
      console.warn('Failed to resume audio context:', error);
    }
  }, []);

  // Initialize VAPI when audio support is confirmed
  // No longer dependent on permissionGranted since we request it on button click
  useEffect(() => {
    if (audioSupported === true) {
      initializeVapi();
    }
  }, [audioSupported, initializeVapi]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      vapiRef.current?.stop();
      isConnectedRef.current = false;
    };
  }, []);

  const handleCallEnd = () => {
    setIsConnected(false);
    setIsLoading(false);
    isConnectedRef.current = false;
  };

  const startCall = async () => {
    if (!vapi || isConnected || isLoading) return;

    // Check cooldown first
    if (!checkCooldown()) {
      const minutes = Math.ceil((cooldownRemaining || 0) / 60000);
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;
      const timeStr = hours > 0
        ? `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMins} minute${remainingMins !== 1 ? 's' : ''}`
        : `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      setConnectionError(`Please wait ${timeStr} before starting another demo`);
      return;
    }

    // Start loading and clear any previous errors
    setIsLoading(true);
    setConnectionError(null);

    try {
      // Request microphone permission WHEN user clicks the button
      // This will trigger the browser's permission prompt
      const hasPermission = await requestMicrophonePermission();

      if (!hasPermission) {
        setConnectionError('Microphone permission denied. Please allow microphone access and try again.');
        setPermissionGranted(false);
        setIsLoading(false);
        return;
      }

      setPermissionGranted(true);

      // iOS requires user interaction to start audio
      if (browserInfo.isIOS) {
        await resumeAudioContextIfNeeded();
      }

      // Start the VAPI call
      vapi.start(assistantId, {
        maxDurationSeconds: 144
      });

      // Store timestamp when call starts
      localStorage.setItem('lastVapiCallTimestamp', Date.now().toString());

    } catch (error) {
      console.error('Failed to start call:', error);
      setConnectionError('Failed to start voice call. Please try again.');
      setIsLoading(false);
    }
  };

  const endCall = () => {
    if (!isConnectedRef.current || !vapiRef.current) {
      return;
    }

    try {
      // Store timestamp when user manually ends call to apply cooldown
      localStorage.setItem('lastVapiCallTimestamp', Date.now().toString());
      vapiRef.current.stop();
    } catch (error) {
      console.error('Error stopping call:', error);
    }
  };

  // Platform-specific styling classes
  const getButtonClasses = (isEndCall = false) => {
    const baseClasses = "inline-flex items-center rounded-2xl px-8 py-4 font-bold text-lg transform transition-all duration-200 focus:outline-none";
    const desktopClasses = "hover:scale-105";
    const mobileClasses = browserInfo.isMobile ? "active:scale-95 touch-manipulation" : "";
    const colorClasses = isEndCall
      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_35px_rgba(239,68,68,0.5)] ring-1 ring-white/50 focus-visible:ring-2 focus-visible:ring-red-300"
      : "bg-gradient-to-r from-[#59def2] to-[#6ee7f5] hover:from-[#6ee7f5] hover:to-[#7debf7] text-slate-900 shadow-[0_10px_30px_rgba(89,222,242,0.4)] hover:shadow-[0_15px_35px_rgba(89,222,242,0.5)] ring-1 ring-white/50 focus-visible:ring-2 focus-visible:ring-white/80";
    
    return `${baseClasses} ${browserInfo.isDesktop ? desktopClasses : mobileClasses} ${colorClasses}`;
  };

  // Render error states for unsupported browsers/devices
  if (audioSupported === false) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-2xl">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold text-red-800 mb-2">Audio Not Supported</h3>
        <p className="text-red-600 text-sm">
          Your browser doesn't support voice functionality. Please use a modern browser like Chrome, Firefox, Safari, or Edge.
        </p>
      </div>
    );
  }

  // Only show permission error if user explicitly denied it (not on initial render)
  // This prevents showing the error before user even tries to start a call

  if (connectionError && !cooldownRemaining) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-2xl">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold text-red-800 mb-2">Connection Error</h3>
        <p className="text-red-600 text-sm mb-4">{connectionError}</p>
        <button
          onClick={initializeVapi}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }


  return (
    <>
      {/* Main Widget UI */}
      <div>
        {!isConnected ? (
          <div>
            {/* Cooldown Warning */}
            {cooldownRemaining && (
              <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                {/* Animated background effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.1),transparent_40%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08),transparent_40%)]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />

                {/* Pulse animation circles */}
                <div className="absolute top-1/2 left-8 -translate-y-1/2 w-32 h-32 rounded-full bg-cyan-500/5 blur-2xl animate-pulse" />
                <div className="absolute top-1/2 right-8 -translate-y-1/2 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    {/* Left side - Icon and text */}
                    <div className="flex items-start gap-5">
                      <div className="relative">
                        {/* Glowing ring animation */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 blur-md animate-pulse" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                          <Clock className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-black text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 tracking-tight">
                          Recharge Protocol Started ⚡
                        </h3>
                        <p className="text-slate-300 text-base leading-relaxed">
                          Our digital agent's on a quick cooldown — back with fresh energy soon.
                        </p>
                      </div>
                    </div>

                    {/* Right side - Timer display */}
                    <div className="flex flex-col items-center sm:items-end">
                      <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
                        Available In
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-xl" />
                        <div className="relative px-8 py-4 rounded-2xl bg-slate-950/80 backdrop-blur-sm border border-cyan-500/30 shadow-xl">
                          <div className="text-5xl font-black bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent tabular-nums tracking-tight">
                            {Math.ceil(cooldownRemaining / 60000)}
                          </div>
                          <div className="text-center text-xs uppercase tracking-wider text-slate-400 font-bold mt-1">
                            Minutes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Connection Error */}
            {connectionError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-800">Unable to Start</span>
                </div>
                <p className="text-sm text-red-700">{connectionError}</p>
              </div>
            )}

            {/* Only show button when no cooldown is active */}
            {!cooldownRemaining && (
              <button
                onClick={startCall}
                disabled={isLoading || !vapi || audioSupported !== true}
                aria-label="Start voice call with AI employee"
                aria-busy={isLoading}
                className={`${getButtonClasses()} disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mr-3" aria-hidden="true" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-3" aria-hidden="true" />
                    Meet Your AI Employee Now →
                  </>
                )}
              </button>
            )}

            {/* Platform indicator for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-500">
                {browserInfo.isIOS && '📱 iOS'}
                {browserInfo.isAndroid && '🤖 Android'}
                {browserInfo.isDesktop && '💻 Desktop'}
                {browserInfo.isSafari && ' Safari'}
                {browserInfo.isChrome && ' Chrome'}
                {browserInfo.isFirefox && ' Firefox'}
                {browserInfo.isEdge && ' Edge'}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {/* Connection status indicator */}
            <div
              className="flex items-center gap-2 text-sm text-white/90"
              role="status"
              aria-label="Voice call connected"
            >
              <Wifi className="w-5 h-5 text-green-400 animate-pulse" aria-hidden="true" />
              <span className="font-medium">Call in Progress</span>
            </div>

            {/* Compact Timer Display */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300" />

              {/* Timer container */}
              <div className={`relative flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-md border shadow-lg transition-all duration-300 ${
                demoTimeRemaining <= 30
                  ? 'bg-red-500/90 border-red-400/50 animate-pulse'
                  : demoTimeRemaining <= 60
                  ? 'bg-orange-500/90 border-orange-400/50'
                  : 'bg-slate-800/90 border-slate-700/50'
              }`}>
                <Clock className={`w-5 h-5 ${
                  demoTimeRemaining <= 60 ? 'text-white' : 'text-cyan-400'
                }`} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white/80 uppercase tracking-wide">
                    {demoTimeRemaining <= 60 ? 'Time Remaining' : 'Demo Time'}
                  </span>
                  <span className="text-2xl font-black text-white tabular-nums tracking-tight">
                    {Math.floor(demoTimeRemaining / 60)}:{(demoTimeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* End Call Button */}
            <button
              onClick={endCall}
              aria-label="End voice call"
              className={getButtonClasses(true)}
            >
              <PhoneOff className="w-5 h-5 mr-3" aria-hidden="true" />
              End Call
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default VapiWidget;