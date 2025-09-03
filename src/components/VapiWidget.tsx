import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  warningSeconds?: number; // Configurable warning time (default: 30 seconds)
  warningMessage?: string; // Configurable warning message
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [killTimer, setKillTimer] = useState<NodeJS.Timeout | null>(null);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(180);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [warningTriggered, setWarningTriggered] = useState(false);

  // Hard cap timer - 3 minutes (180 seconds)
  const HARD_CAP_SECONDS = 180;
  const INACTIVITY_TIMEOUT = 20_000; // 20 seconds
  const INACTIVITY_WARNING_TIME = 15_000; // Show warning after 15 seconds

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsConnected(true);
      setIsLoading(false);
      setLastActivity(Date.now());
      setInactivityWarning(false);
      setWarningTriggered(false);
      onCallStart?.();
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsConnected(false);
      setIsSpeaking(false);
      setIsLoading(false);
      setCurrentCallId(null);
      setTimeRemaining(HARD_CAP_SECONDS);
      setInactivityWarning(false);
      setLastActivity(Date.now());
      setWarningTriggered(false);
      
      // Clear kill timer if call ended naturally
      if (killTimer) {
        clearTimeout(killTimer);
        setKillTimer(null);
      }
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
      }
      
      onCallEnd?.();
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
      setLastActivity(Date.now());
      setInactivityWarning(false);
    });

    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setIsSpeaking(false);
      setLastActivity(Date.now());
    });

    // Listen for various message types
    vapiInstance.on('message', (message) => {
      if (message.type === 'call-start') {
        const callId = message.call?.id;
        if (callId) {
          setCurrentCallId(callId);
          // Start the timers immediately
          console.log('Starting call timers for call:', callId);
          setTimeRemaining(HARD_CAP_SECONDS); // Reset to 3 minutes
          startCountdownTimer(callId);
          startKillTimer(callId);
          startInactivityTimer(callId);
        }
      }
      
      // Track user activity on any message
      if (message.type === 'transcript' || message.type === 'user-started-speaking' || message.type === 'user-stopped-speaking') {
        setLastActivity(Date.now());
        setInactivityWarning(false);
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsLoading(false);
      
      // Clear all timers on error
      if (killTimer) {
        clearTimeout(killTimer);
        setKillTimer(null);
      }
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
      }
    });

    return () => {
      vapiInstance?.stop();
      if (killTimer) {
        clearTimeout(killTimer);
      }
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [apiKey, onCallStart, onCallEnd]);

  // Send warning message to agent
  const sendWarningToAgent = () => {
    if (vapi && !warningTriggered) {
      setWarningTriggered(true);
      console.log('Sending warning to agent:', warningMessage);
      
      // Send message to the agent through Vapi
      // This will make the AI assistant say the warning message
      vapi.send({
        type: 'add-message',
        message: {
          type: 'request-response-delayed',
          content: warningMessage,
          delaySeconds: 0
        }
      });
    }
  };

  // Start the countdown timer
  const startCountdownTimer = (callId: string) => {
    console.log('Starting countdown timer');
    
    // Clear any existing interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    
    const interval = setInterval(() => {
      setTimeRemaining(currentTime => {
        console.log('Countdown tick:', currentTime);
        const newTime = currentTime - 1;
        
        // Trigger warning at configured time before end
        if (newTime === warningSeconds && !warningTriggered) {
          console.log('Triggering warning at', newTime, 'seconds');
          sendWarningToAgent();
        }
        
        // Auto-end call when timer reaches 0
        if (newTime <= 0) {
          console.log('Timer reached 0, ending call');
          clearInterval(interval);
          setCountdownInterval(null);
          setTimeout(() => endCallViaAPI(callId), 1000); // Small delay after warning
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    setCountdownInterval(interval);
  };
  
  // Start the kill timer as backup
  const startKillTimer = (callId: string) => {
    console.log('Starting kill timer');
    
    // Set hard kill timer as backup (3 minutes + small buffer)
    const timer = setTimeout(async () => {
      console.log('Hard kill timer triggered - ending call');
      endCallViaAPI(callId);
      setKillTimer(null);
    }, (HARD_CAP_SECONDS + 5) * 1000); // 5 second buffer
    setKillTimer(timer);
  };

  // Monitor inactivity and auto-end calls
  const startInactivityTimer = (callId: string) => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
        console.log('Inactivity timeout - ending call');
        endCallViaAPI(callId);
        return;
      }
      
      if (timeSinceActivity >= INACTIVITY_WARNING_TIME) {
        setInactivityWarning(true);
      } else {
        setInactivityWarning(false);
      }
    };
    
    // Check inactivity every 2 seconds
    const timer = setInterval(checkInactivity, 2000);
    setInactivityTimer(timer);
  };

  // Centralized call termination function
  const endCallViaAPI = async (callId: string) => {
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
      setLastActivity(Date.now());
      setInactivityWarning(false);
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    if (vapi && isConnected) {
      // Clear all timers when manually ending call
      if (killTimer) {
        clearTimeout(killTimer);
        setKillTimer(null);
      }
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
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
            <div className={`text-2xl font-bold px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
              timeRemaining <= warningSeconds ? 'text-red-300 bg-red-900/50 animate-pulse ring-2 ring-red-400/50' : 
              timeRemaining <= 60 ? 'text-yellow-300 bg-yellow-900/40' : 
              inactivityWarning ? 'text-yellow-300 bg-yellow-900/40' : 
              'text-white bg-black/20'
            }`}>
              {formatTime(timeRemaining)}
            </div>
            
            {/* Warning Indicators */}
            {timeRemaining <= warningSeconds && timeRemaining > 0 && (
              <div className="text-sm text-red-300 mt-2 animate-pulse font-medium">
                ⚠ Agent will receive closing notice
              </div>
            )}
            {inactivityWarning && (
              <div className="text-sm text-yellow-300 mt-1 animate-pulse">
                🔇 Inactive - Call will end soon
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