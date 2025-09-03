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
  const [timeRemaining, setTimeRemaining] = useState(60);
  
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);
    vapiRef.current = vapiInstance;

    // VAPI Event Handlers
    vapiInstance.on('call-start', () => {
      console.log('🔥 CALL STARTED - Starting countdown timer');
      setIsConnected(true);
      isConnectedRef.current = true;
      setIsLoading(false);
      setTimeRemaining(60);
      
      // Start countdown timer
      startCountdownTimer();
      
      onCallStart?.();
    });

    vapiInstance.on('call-end', () => {
      console.log('📞 CALL ENDED');
      handleCallEnd();
      onCallEnd?.();
    });

    vapiInstance.on('error', (error) => {
      // Handle expected server-side call terminations vs actual errors
      if (error?.error?.type === 'ejected' || error?.type === 'ejected') {
        console.log('⏰ Call ended by server timeout (expected)', error);
      } else {
        console.error('❌ VAPI error:', error);
      }
      handleCallEnd();
    });

    return () => {
      vapiInstance?.stop();
      cleanupTimers();
    };
  }, [apiKey, onCallStart, onCallEnd]);

  // Timer-based hangup - 60 second countdown
  const startCountdownTimer = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    console.log('⏰ Starting 60-second countdown timer');
    
    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        console.log(`⏰ Timer: ${newTime} seconds remaining`);
        
        // Auto-hangup when timer reaches 0
        if (newTime <= 0) {
          console.log('🛑 TIMER REACHED ZERO - ENDING CALL NOW!');
          terminateCall();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
  };

  // Simplified termination function
  const terminateCall = () => {
    console.log('🔚 TERMINATING CALL');
    
    // Prevent multiple termination attempts
    if (!isConnectedRef.current) {
      console.log('⚠️ Call already terminated, skipping');
      return;
    }
    
    cleanupTimers();
    
    // Terminate call via VAPI
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
        console.log('✅ VAPI stop() called successfully');
      } catch (error) {
        console.error('❌ Error calling vapi.stop():', error);
      }
    }
  };

  // Clean up timers and reset state
  const cleanupTimers = () => {
    console.log('🧹 Cleaning up timers and state');
    
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

  const startCall = () => {
    if (vapi && !isConnected && !isLoading) {
      setIsLoading(true);
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    terminateCall();
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