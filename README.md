# AutoSys Lab Landing Page

## Vapi Assistant Configuration

### Layer 1: Assistant Configuration
Configure your Vapi assistant with these exact settings in the Vapi Dashboard:

```json
{
  "name": "Website Demo Agent",
  "maxDurationSeconds": 60,
  "hangupDelay": 1,
  "serverTimeoutSeconds": 60,
  "endCallPhrases": [
    "goodbye",
    "bye",
    "see you later",
    "end call",
    "hang up"
  ],
  "backgroundSound": "office",
  "recordingEnabled": false,
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "keywords": ["goodbye", "bye", "end call", "hang up"]
  },
  "customer": {
    "speech": {
      "timeout": {
        "noInputWarningSeconds": 5,
        "noInputHangupSeconds": 10,
        "maxCallDurationSeconds": 60
      }
    }
  }
}
```

### VAPI Dashboard Configuration Steps:

1. **Navigate to your VAPI Dashboard** → Assistants → Select your assistant
2. **Set Call Limits** in the "Call Settings" section:
   - `Max Duration`: 60 seconds
   - `Hangup Delay`: 1 second
   - `Auto Hangup`: Enabled
3. **Configure End Call Detection** in "Conversation" section:
   - Add all the `endCallPhrases` listed above
   - Enable "End call on phrase detection"
4. **Set Customer Timeouts** in "Customer Settings":
   - No input warning: 5 seconds
   - No input hangup: 10 seconds
   - Max call duration: 60 seconds
5. **Save Configuration** and test the setup

### Dual Auto-Termination System
This project implements a comprehensive protection system with two independent termination triggers:

#### Timer-Based Termination:
1. **Client-Side Countdown**: 60-second countdown timer (1:00 → 0:59 → ... → 0:00)
2. **Automatic Hangup**: Call terminates immediately when timer reaches 0:00
3. **VAPI Server Backup**: `maxDurationSeconds: 60` provides platform-level enforcement
4. **Visual Feedback**: Real-time countdown display with color warnings

#### Inactivity-Based Termination:
1. **Speech Activity Monitoring**: Tracks speech events via VAPI transcriber
2. **5-Second Warning**: Warning message displayed after 5 seconds of silence
3. **10-Second Hangup**: Automatic call termination after 10 seconds of inactivity
4. **VAPI Server Integration**: Uses `noInputHangupSeconds: 10` for server-side enforcement

### Testing Procedures:

#### Timer-Based Tests:
1. **Countdown Functionality**:
   - Start a call and verify timer counts down from 1:00 → 0:59 → 0:58... → 0:00
   - Confirm call automatically ends at 0:00

2. **VAPI Server Backup**:
   - Disable client-side timer temporarily
   - Verify VAPI server terminates call at 60 seconds

#### Inactivity-Based Tests:
3. **Inactivity Warning**:
   - Start call and remain silent for 5 seconds
   - Verify warning message appears: "Keep talking to continue..."
   - Resume speaking and verify warning disappears

4. **Inactivity Termination**:
   - Start call and remain silent for 10 seconds
   - Verify automatic call termination due to inactivity

#### Additional Tests:
5. **End Phrase Detection**:
   - Say "goodbye" or "bye" during call
   - Verify VAPI immediately terminates call

6. **Speech Activity Reset**:
   - Let call go silent for 4 seconds
   - Speak before 5-second warning
   - Verify inactivity timer resets properly

