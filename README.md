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
    "Thanks for trying the demo. Ending the call now.",
    "UPS, looks like I gotta go. It has been a real pleasure. Talk soon.",
    "goodbye",
    "bye",
    "see you later"
  ],
  "backgroundSound": "office",
  "recordingEnabled": false,
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "keywords": ["goodbye", "bye", "end call"]
  },
  "customer": {
    "speech": {
      "timeout": {
        "noInputWarningSeconds": 15,
        "noInputHangupSeconds": 25,
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
   - No input warning: 15 seconds
   - No input hangup: 25 seconds
   - Max call duration: 60 seconds
5. **Save Configuration** and test the setup

### Call Duration Protection System
This project implements a 4-layer protection system to ensure calls don't exceed 1 minute:

1. **VAPI Server-Side Enforcement**: `maxDurationSeconds: 60` provides platform-level call termination
2. **Agent Warning System**: Configurable warning delivered to agent before call termination  
3. **End Call Phrase Detection**: VAPI automatically hangs up when specific phrases are detected
4. **Client-Side Failsafe Timer**: Backup timer that terminates calls via API after exactly 1 minute
5. **Inactivity Detection**: Automatically ends calls after 20 seconds of no speech activity

### Testing Procedures:

1. **Timer Countdown Test**:
   - Start a call and verify timer counts down from 1:00 → 0:59 → 0:58... → 0:00
   - Confirm call automatically ends at 0:00

2. **Agent Warning Test**:
   - Let call run to 30 seconds remaining
   - Verify agent receives warning message
   - Confirm call ends gracefully after warning

3. **VAPI Server-Side Test**:
   - Disable client-side timer temporarily
   - Verify VAPI server terminates call at 60 seconds

4. **End Phrase Test**:
   - Say "goodbye" or "bye" during call
   - Verify VAPI immediately terminates call

5. **Inactivity Test**:
   - Start call and remain silent for 25 seconds
   - Verify automatic termination due to inactivity

### Features
- **Dynamic countdown timer** showing remaining demo time (1:00 → 0:00)
- **Agent warning system** with configurable timing and message
- **Visual indicators** for time warnings and call status
- Automatic call termination at 1-minute mark
- Graceful call endings with agent notification
- Inactivity detection with 20-second timeout
- Multiple warning states (time warning, inactivity warning)
- Call duration tracking and display
- Graceful fallbacks if API calls fail
