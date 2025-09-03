import React, { useState, useEffect, useRef } from 'react';
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
  
  // Timer states - simplified to just countdown
  const [timeRemaining, setTimeRemaining] = useState<number>(60); // 1 minute
  
  // Refs to avoid stale closure issues
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTriggeredRef = useRef(false);
  const timeRemainingRef = useRef(60);
  
  // Inactivity tracking
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [inactivityWarning, setInactivityWarning] = useState(false);

  const CALL_DURATION = 60; // 1 minute in seconds
  const INACTIVITY_TIMEOUT = 20_000; // 20 seconds

  // Keep timeRemainingRef in sync with timeRemaining state
  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started - initializing timer');
      setIsConnected(true);
      setIsLoading(false);
      setLastActivity(Date.now());
      setInactivityWarning(false);
      warningTriggeredRef.current = false;
      
      // Reset timer and start countdown
      setTimeRemaining(CALL_DURATION);
      timeRemainingRef.current = CALL_DURATION;
      startCountdownTimer();
      startInactivityMonitoring();
      
      onCallStart?.();
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended - cleaning up');
      setIsConnected(false);
      setIsSpeaking(false);
      setIsLoading(false);
      setCurrentCallId(null);
      setInactivityWarning(false);
      warningTriggeredRef.current = false;
      
      // Reset timer
      setTimeRemaining(CALL_DURATION);
      timeRemainingRef.current = CALL_DURATION;
      
      // Clear all timers
      clearAllTimers();
      
      onCallEnd?.();
    });

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true);
      setLastActivity(Date.now());
      setInactivityWarning(false);
    });

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false);
      setLastActivity(Date.now());
    });

    // Listen for call messages to get call ID
    vapiInstance.on('message', (message) => {
      if (message.type === 'call-start') {
        const callId = message.call?.id;
        if (callId) {
          console.log('Got call ID:', callId);
          setCurrentCallId(callId);
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
      clearAllTimers();
    });

    return () => {
      vapiInstance?.stop();
      clearAllTimers();
    };
  }, [apiKey, onCallStart, onCallEnd]);

  // Clear all active timers
  const clearAllTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (inactivityTimer) {
      clearInterval(inactivityTimer);
      setInactivityTimer(null);
    }
  };

  // Main countdown timer - simplified and reliable
  const startCountdownTimer = () => {
    console.log('Starting countdown timer from', CALL_DURATION, 'seconds');
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Create new countdown interval that updates every second
    const interval = setInterval(() => {
      const currentTime = timeRemainingRef.current;
      const newTime = Math.max(0, currentTime - 1);
      
      console.log(`Timer: ${currentTime} → ${newTime} seconds remaining`);
      
      // Update state
      setTimeRemaining(newTime);
      timeRemainingRef.current = newTime;
      
      // Send warning to agent when time is running low
      if (newTime === warningSeconds && !warningTriggeredRef.current) {
        console.log('Triggering agent warning at', newTime, 'seconds');
        warningTriggeredRef.current = true;
        sendWarningToAgent();
      }
      
      // End call when timer reaches 0
      if (newTime <= 0) {
        console.log('Timer reached 0 - ending call');
        clearInterval(interval);
        timerRef.current = null;
        
        // End the call via API with slight delay for warning delivery
        if (currentCallId) {
          setTimeout(() => endCallViaAPI(currentCallId), 1000);
        }
      }
    }, 1000); // Update exactly every 1000ms (1 second)
    
    timerRef.current = interval;
  };

  // Start inactivity monitoring
  const startInactivityMonitoring = () => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
        console.log('Inactivity timeout - ending call');
        if (currentCallId) {
          endCallViaAPI(currentCallId);
        }
        return;
      }
      
      if (timeSinceActivity >= INACTIVITY_TIMEOUT - 5000) { // 5 seconds before timeout
        setInactivityWarning(true);
      } else {
        setInactivityWarning(false);
      }
    };
    
    // Check inactivity every 2 seconds
    const timer = setInterval(checkInactivity, 2000);
    setInactivityTimer(timer);
  };

  // Send warning message to agent
  const sendWarningToAgent = () => {
    if (vapi && currentCallId) {
      console.log('Sending warning to agent:', warningMessage);
      
      // Send message to the agent through Vapi
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

  // Centralized call termination function
  const endCallViaAPI = async (callId: string) => {
    try {
      console.log('Terminating call via API:', callId);
      await fetch(`https://api.vapi.ai/call/${callId}/hangup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Call terminated successfully');
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
      warningTriggeredRef.current = false;
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    if (vapi && isConnected) {
      clearAllTimers();
      if (currentCallId) {
        endCallViaAPI(currentCallId);
      } else {
        vapi.stop();
      }
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
          {/* Time Remaining Display - Main Timer Box */}
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