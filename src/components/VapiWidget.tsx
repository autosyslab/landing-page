import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff } from 'lucide-react';

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  warningSeconds?: number;
  warningMessage?: string;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ 
  apiKey, 
  assistantId, 
  onCallStart,
  onCallEnd,
  warningSeconds = 30,
  warningMessage = "UPS, looks like I gotta go. It has been a real pleasure. Talk soon."
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  
  // Refs to persist values across re-renders and timer callbacks
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const isConnectedRef = useRef(false);
  const lastSpeechTimeRef = useRef<number>(0);
  const warningShownRef = useRef(false);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);
    vapiRef.current = vapiInstance;

    // VAPI Event Handlers
    vapiInstance.on('call-start', () => {
      console.log('🔥 CALL STARTED - Initializing both timers');
      setIsConnected(true);
      isConnectedRef.current = true;
      setIsLoading(false);
      setTimeRemaining(60);
      setShowInactivityWarning(false);
      warningShownRef.current = false;
      
      // Reset speech tracking
      const now = Date.now();
      lastSpeechTimeRef.current = now;
      
      // Start both timer systems
      startCountdownTimer();
      startInactivityMonitoring();
      
      onCallStart?.();
    });

    vapiInstance.on('call-end', () => {
      console.log('📞 CALL ENDED - Cleaning up all timers');
      handleCallEnd();
      onCallEnd?.();
    });

    // CRITICAL: Speech activity detection for inactivity monitoring
    vapiInstance.on('speech-start', () => {
      const now = Date.now();
      lastSpeechTimeRef.current = now;
      setShowInactivityWarning(false);
      console.log('🗣️ Speech detected - resetting inactivity timer');
    });

    vapiInstance.on('speech-end', () => {
      const now = Date.now();
      lastSpeechTimeRef.current = now;
      console.log('🤐 Speech ended - monitoring inactivity from now');
    });

    vapiInstance.on('error', (error) => {
      console.error('❌ VAPI error:', error);
      handleCallEnd();
    });

    return () => {
      vapiInstance?.stop();
      cleanup();
    };
  }, [apiKey, onCallStart, onCallEnd, warningSeconds]);

  // FIX 1: TIMER-BASED HANGUP - Simple, reliable countdown
  const startCountdownTimer = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    console.log('⏰ Starting 60-second countdown timer');
    
    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        console.log(`⏰ Timer: ${newTime} seconds remaining`);
        
        // CRITICAL FIX: Auto-hangup when timer reaches 0
        if (newTime <= 0) {
          console.log('🛑 TIMER REACHED ZERO - ENDING CALL NOW!');
          terminateCall('timer_expired');
          return 0;
        }

        // Agent warning at specified time (default 30 seconds)
        if (newTime === warningSeconds && !warningShownRef.current && vapiRef.current) {
          console.log(`⚠️ Sending ${warningSeconds}s warning to agent`);
          warningShownRef.current = true;
          vapiRef.current.send({
            type: 'add-message',
            message: {
              role: 'system',
              content: warningMessage
            }
          });
        }
        
        return newTime;
      });
    }, 1000);
  };

  // FIX 2: INACTIVITY-BASED HANGUP - Monitor speech and enforce timeouts
  const startInactivityMonitoring = () => {
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
    }
    
    console.log('👂 Starting inactivity monitoring (10s limit)');
    
    inactivityTimerRef.current = setInterval(() => {
      if (!isConnectedRef.current) return;
      
      const now = Date.now();
      const timeSinceLastSpeech = (now - lastSpeechTimeRef.current) / 1000;
      
      console.log(`👂 Inactivity check: ${timeSinceLastSpeech.toFixed(1)}s since last speech`);
      
      // Show warning at 5 seconds of inactivity
      if (timeSinceLastSpeech >= 5 && timeSinceLastSpeech < 6) {
        console.log('⚠️ 5 seconds of inactivity - showing warning');
        setShowInactivityWarning(true);
      }
      
      // CRITICAL FIX: Auto-hangup at 10 seconds of inactivity
      if (timeSinceLastSpeech >= 10) {
        console.log('🛑 10 SECONDS OF INACTIVITY - ENDING CALL NOW!');
        terminateCall('inactivity_timeout');
      }
    }, 1000);
  };

  // UNIFIED TERMINATION FUNCTION - Handles all call ending scenarios
  const terminateCall = (reason: 'timer_expired' | 'inactivity_timeout' | 'user_request') => {
    console.log(`🔚 TERMINATING CALL - Reason: ${reason}`);
    
    // Prevent multiple termination attempts
    if (!isConnectedRef.current) {
      console.log('⚠️ Call already terminated, skipping');
      return;
    }
    
    cleanup();
    
    // Direct VAPI termination - most reliable method
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
        console.log('✅ VAPI stop() called successfully');
      } catch (error) {
        console.error('❌ Error calling vapi.stop():', error);
      }
    }
  };

  // Clean up all timers and reset state
  const cleanup = () => {
    console.log('🧹 Cleaning up all timers and state');
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    
    isConnectedRef.current = false;
    warningShownRef.current = false;
  };

  const handleCallEnd = () => {
    setIsConnected(false);
    setIsLoading(false);
    setTimeRemaining(60);
    setShowInactivityWarning(false);
    cleanup();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    if (vapi && !isConnected && !isLoading) {
      setIsLoading(true);
      const now = Date.now();
      lastSpeechTimeRef.current = now;
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    terminateCall('user_request');
  };

  return (
    <>
      {!isConnected ? (
        <button
          onClick={startCall}
          disabled={isLoading}
          className="
            inline-flex items-center rounded-2xl px-8 py-4
            font-bold text-slate-900 text-lg
            bg-gradient-to-r from-[#59def2] to-[#6ee7f5] hover:from-[#6ee7f5] hover:to-[#7debf7]
            shadow-[0_10px_30px_rgba(89,222,242,0.4)] hover:shadow-[0_15px_35px_rgba(89,222,242,0.5)]
            transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
            ring-1 ring-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
          "
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
      ) : (
        <div className="flex flex-col items-center gap-3">
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
            
            {/* Inactivity Warning */}
            {showInactivityWarning && (
              <div className="mt-2 text-sm text-orange-300 bg-orange-900/50 px-3 py-1 rounded-lg animate-pulse">
                Keep talking to continue...
              </div>
            )}
          </div>
          
          {/* End Call Button */}
          <button
            onClick={endCall}
            className="
              inline-flex items-center rounded-2xl px-8 py-4
              font-bold text-white text-lg
              bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
              shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_35px_rgba(239,68,68,0.5)]
              transform hover:scale-105 transition-all duration-200
              ring-1 ring-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
            "
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