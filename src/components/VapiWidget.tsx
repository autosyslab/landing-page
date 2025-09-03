import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ 
  apiKey, 
  assistantId, 
  onCallStart,
  onCallEnd 
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [killTimer, setKillTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(240); // 4 minutes in seconds
  const [transcript, setTranscript] = useState<Array<{role: string, text: string}>>([]);

  // Hard cap timer - 4 minutes (240 seconds)
  const HARD_CAP_MS = 240_000;
  const HARD_CAP_SECONDS = 240;

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsConnected(true);
      setIsLoading(false);
      setTimeRemaining(HARD_CAP_SECONDS);
      onCallStart?.();
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsConnected(false);
      setIsSpeaking(false);
      setIsLoading(false);
      setCurrentCallId(null);
      setTimeRemaining(HARD_CAP_SECONDS);
      
      // Clear kill timer if call ended naturally
      if (killTimer) {
        clearTimeout(killTimer);
        setKillTimer(null);
      }
      
      onCallEnd?.();
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setIsSpeaking(false);
    });

    // Listen for call-start event to get call ID and start protection timer
    vapiInstance.on('message', (message) => {
      if (message.type === 'call-start') {
        const callId = message.call?.id;
        if (callId) {
          setCurrentCallId(callId);
          startHardKillTimer(callId);
        }
      }
      if (message.type === 'transcript') {
        setTranscript(prev => [...prev, {
          role: message.role,
          text: message.transcript
        }]);
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsLoading(false);
      
      // Clear timer on error
      if (killTimer) {
        clearTimeout(killTimer);
        setKillTimer(null);
      }
    });

    return () => {
      vapiInstance?.stop();
      if (killTimer) {
        clearTimeout(killTimer);
      }
    };
  }, [apiKey, onCallStart, onCallEnd]);

  // Layer 3: Client-side hard kill timer with countdown
  const startHardKillTimer = (callId: string) => {
    console.log(`Starting 4-minute protection timer for call: ${callId}`);
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Set hard kill timer
    const timer = setTimeout(async () => {
      console.log('Hard kill timer triggered - ending call');
      clearInterval(countdownInterval);
      
      try {
        // Direct API call to Vapi's hangup endpoint
        await fetch(`https://api.vapi.ai/call/${callId}/hangup`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Call terminated via API');
      } catch (error) {
        console.error('Failed to terminate call via API:', error);
        // Fallback: force stop the vapi instance
        vapi?.stop();
      }
      
      setKillTimer(null);
    }, HARD_CAP_MS);
    
    setKillTimer(timer);
  };

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    if (vapi && !isConnected && !isLoading) {
      setIsLoading(true);
      setTranscript([]);
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    if (vapi && isConnected) {
      // Clear timer when manually ending call
      if (killTimer) {
        clearTimeout(killTimer);
        setKillTimer(null);
      }
      vapi.stop();
    }
  };

  return (
    <>
      {/* Main Call Button */}
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
          {/* Time Remaining Indicator */}
          <div className="text-center">
            <div className="text-sm text-white/70 mb-1">Demo Time Remaining</div>
            <div className="text-2xl font-bold text-white bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm">
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