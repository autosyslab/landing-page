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
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);
    vapiRef.current = vapiInstance;

    vapiInstance.on('call-start', () => {
      console.log('✅ Call started - starting 60 second countdown');
      setIsConnected(true);
      setIsLoading(false);
      setTimeRemaining(60);
      startCountdown();
      onCallStart?.();
    });

    vapiInstance.on('call-end', () => {
      console.log('✅ Call ended - cleaning up');
      setIsConnected(false);
      setIsLoading(false);
      setTimeRemaining(60);
      clearTimer();
      onCallEnd?.();
    });

    vapiInstance.on('error', (error) => {
      console.error('❌ Vapi error:', error);
      setIsLoading(false);
      clearTimer();
    });

    return () => {
      vapiInstance?.stop();
      clearTimer();
    };
  }, [apiKey, onCallStart, onCallEnd]);

  const startCountdown = () => {
    // Clear any existing timer
    clearTimer();
    
    console.log('🕒 Starting countdown from 60 seconds');
    
    // Start countdown that decreases every second
    const interval = setInterval(() => {
      setTimeRemaining(prevTime => {
        const newTime = prevTime - 1;
        console.log(`⏰ Timer: ${newTime} seconds remaining`);
        
        // When timer hits 0, end the call immediately
        if (newTime <= 0) {
          console.log('🔚 Timer reached 0 - ending call now');
          clearTimer();
          
          // End the call immediately
          if (vapiRef.current && isConnected) {
            console.log('📞 Executing call termination');
            vapiRef.current.stop();
          }
          
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    timerRef.current = interval;
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log('🧹 Timer cleared');
    }
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
    if (vapi && isConnected) {
      clearTimer();
      vapi.stop();
    }
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