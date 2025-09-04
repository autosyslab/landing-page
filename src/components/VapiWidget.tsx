import React, { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  warningSeconds?: number;
  warningMessage?: string;
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
  apiKey, 
  assistantId, 
  onCallStart,
  onCallEnd
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [browserInfo] = useState(getBrowserInfo());
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const isConnectedRef = useRef(false);
  const initAttempts = useRef(0);
  const maxInitAttempts = 3;

  // Check audio support and permissions on component mount
  useEffect(() => {
    const initAudioCheck = async () => {
      const supported = await checkAudioSupport();
      setAudioSupported(supported);
      
      if (supported) {
        // Pre-request permissions on user interaction for better UX
        // This helps especially on iOS where permissions are strict
        const hasPermission = await requestMicrophonePermission();
        setPermissionGranted(hasPermission);
      }
    };

    initAudioCheck();
  }, []);

  // Initialize VAPI with retry logic and error handling
  const initializeVapi = useCallback(async () => {
    if (initAttempts.current >= maxInitAttempts) {
      setConnectionError('Failed to initialize voice system after multiple attempts');
      return;
    }

    try {
      setConnectionError(null);
      const vapiInstance = new Vapi(apiKey);
      setVapi(vapiInstance);
      vapiRef.current = vapiInstance;
      initAttempts.current++;

      // Enhanced event handlers with platform-specific considerations
      vapiInstance.on('call-start', () => {
        console.log('🔥 CALL STARTED - Starting countdown timer');
        setIsConnected(true);
        isConnectedRef.current = true;
        setIsLoading(false);
        setTimeRemaining(60);
        setConnectionError(null);
        
        startCountdownTimer();
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
  }, [apiKey, onCallStart, onCallEnd, browserInfo]);

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
  useEffect(() => {
    if (audioSupported === true && permissionGranted === true) {
      initializeVapi();
    }
  }, [audioSupported, permissionGranted, initializeVapi]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      vapiRef.current?.stop();
      cleanupTimers();
    };
  }, []);

  const startCountdownTimer = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    console.log('⏰ Starting 60-second countdown timer');
    
    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          console.log('🛑 TIMER REACHED ZERO - ENDING CALL NOW!');
          terminateCall();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
  };

  const terminateCall = () => {
    console.log('🔚 TERMINATING CALL');
    
    if (!isConnectedRef.current) {
      return;
    }
    
    cleanupTimers();
    
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
      } catch (error) {
        console.error('❌ Error calling vapi.stop():', error);
      }
    }
  };

  const cleanupTimers = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    isConnectedRef.current = false;
  };

  const handleCallEnd = () => {
    setIsConnected(false);
    setIsLoading(false);
    setTimeRemaining(60);
    cleanupTimers();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!vapi || isConnected || isLoading) return;

    // iOS requires user interaction to start audio
    if (browserInfo.isIOS) {
      await resumeAudioContextIfNeeded();
    }

    // Final permission check before starting call
    if (!permissionGranted) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setConnectionError('Microphone permission is required for voice calls');
        return;
      }
      setPermissionGranted(true);
    }

    setIsLoading(true);
    setConnectionError(null);
    
    try {
      vapi.start(assistantId);
    } catch (error) {
      console.error('Failed to start call:', error);
      setConnectionError('Failed to start voice call');
      setIsLoading(false);
    }
  };

  const endCall = () => {
    terminateCall();
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

  if (permissionGranted === false && audioSupported === true) {
    return (
      <div className="text-center p-6 bg-orange-50 border border-orange-200 rounded-2xl">
        <WifiOff className="w-8 h-8 text-orange-500 mx-auto mb-2" />
        <h3 className="font-bold text-orange-800 mb-2">Microphone Permission Required</h3>
        <p className="text-orange-600 text-sm mb-4">
          Voice calls require microphone access. Please enable permissions and refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (connectionError) {
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
      {!isConnected ? (
        <div>
          <button
            onClick={startCall}
            disabled={isLoading || !vapi || audioSupported !== true}
            className={`${getButtonClasses()} disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mr-3" />
                Connecting...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 mr-3" />
                Meet Your AI Employee Now →
              </>
            )}
          </button>
          
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
        <div className="flex flex-col items-center gap-3">
          {/* Connection status indicator */}
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Wifi className="w-4 h-4 text-green-400" />
            <span>Connected</span>
          </div>
          
          {/* Countdown Timer Display */}
          <div className="text-center">
            <div className="text-sm text-white/70 mb-1">Demo Time Remaining</div>
            <div className={`
              text-2xl font-bold px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300
              ${timeRemaining <= 10 ? 'text-red-300 bg-red-900/50 animate-pulse ring-2 ring-red-400/50' : 
                timeRemaining <= 30 ? 'text-yellow-300 bg-yellow-900/40' : 
                'text-white bg-black/20'}
            `}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          {/* End Call Button */}
          <button
            onClick={endCall}
            className={getButtonClasses(true)}
          >
            <PhoneOff className="w-5 h-5 mr-3" />
            End Call
          </button>
        </div>
      )}
    </>
  );
};

export default VapiWidget;