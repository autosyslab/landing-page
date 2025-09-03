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
  onCallEnd
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 1 minute
  const [lastSpeechTime, setLastSpeechTime] = useState<number>(Date.now());
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  
  // Refs to access current values in intervals
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const lastSpeechRef = useRef<number>(Date.now());

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);
    vapiRef.current = vapiInstance;

    // VAPI Event Handlers
    vapiInstance.on('call-start', () => {
      console.log('✅ Call started - initializing timers');
      setIsConnected(true);
      setIsLoading(false);
      setTimeRemaining(60);
      setShowInactivityWarning(false);
      
      const now = Date.now();
      setLastSpeechTime(now);
      lastSpeechRef.current = now;
      
      startTimers();
      onCallStart?.();
    });

    vapiInstance.on('call-end', () => {
      console.log('✅ Call ended - cleaning up timers');
      setIsConnected(false);
      setIsLoading(false);
      setTimeRemaining(60);
      setShowInactivityWarning(false);
      cleanupTimers();
      onCallEnd?.();
    });

    // Speech Activity Detection
    vapiInstance.on('speech-start', () => {
      const now = Date.now();
      setLastSpeechTime(now);
      lastSpeechRef.current = now;
      setShowInactivityWarning(false);
      console.log('🗣️ Speech detected - resetting inactivity timer');
    });

    vapiInstance.on('speech-end', () => {
      const now = Date.now();
      setLastSpeechTime(now);
      lastSpeechRef.current = now;
      console.log('🤐 Speech ended - monitoring for inactivity');
    });

    vapiInstance.on('error', (error) => {
      console.error('❌ VAPI error:', error);
      setIsLoading(false);
      cleanupTimers();
    });

    return () => {
      vapiInstance?.stop();
      cleanupTimers();
    };
  }, [apiKey, onCallStart, onCallEnd]);

  // Start both timers when call begins
  const startTimers = () => {
    cleanupTimers(); // Clear any existing timers
    
    console.log('🚀 Starting countdown and inactivity timers');
    
    // 1. COUNTDOWN TIMER: 60 seconds → 0
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        console.log(`⏰ Timer: ${newTime} seconds remaining`);
        
        // AUTO-HANGUP: When timer hits 0, end call immediately
        if (newTime <= 0) {
          console.log('🔚 Timer reached 0 - ending call NOW');
          terminateCall('timer_expired');
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    // 2. INACTIVITY MONITOR: Check every second for silence
    inactivityTimerRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastSpeech = (now - lastSpeechRef.current) / 1000;
      
      // Warning at 5 seconds of inactivity
      if (timeSinceLastSpeech >= 5 && timeSinceLastSpeech < 6 && !showInactivityWarning) {
        console.log('⚠️ 5 seconds of inactivity - showing warning');
        setShowInactivityWarning(true);
        
        // Send warning to agent via VAPI
        if (vapiRef.current) {
          vapiRef.current.send({
            type: 'add-message',
            message: {
              role: 'system',
              content: 'Warning: Call will end in 5 seconds due to inactivity. Please continue speaking to maintain the connection.'
            }
          });
        }
      }
      
      // Auto-hangup at 10 seconds of inactivity
      if (timeSinceLastSpeech >= 10) {
        console.log('🔚 10 seconds of inactivity - ending call');
        terminateCall('inactivity_timeout');
      }
    }, 1000);
  };

  // Unified call termination function
  const terminateCall = (reason: 'timer_expired' | 'inactivity_timeout' | 'user_request') => {
    console.log(`📞 Terminating call - Reason: ${reason}`);
    
    cleanupTimers();
    
    if (vapiRef.current && isConnected) {
      try {
        // VAPI will handle this gracefully with proper hangup sequence
        vapiRef.current.stop();
      } catch (error) {
        console.error('❌ Error ending call:', error);
      }
    }
  };

  // Clean up all timers
  const cleanupTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    console.log('🧹 All timers cleaned up');
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
      setLastSpeechTime(now);
      lastSpeechRef.current = now;
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