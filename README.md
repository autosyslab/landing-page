# AutoSys Lab Landing Page

## Vapi Assistant Configuration

### Layer 1: Assistant Configuration
Configure your Vapi assistant with these exact settings in the Vapi Dashboard:

```json
{
  "name": "Website Demo Agent", 
  "maxDurationSeconds": 185,
  "endCallPhrases": [
    "Thanks for trying the demo. Ending the call now.",
    "UPS, looks like I gotta go. It has been a real pleasure. Talk soon."
  ],
  "customer": {
    "speech": {
      "timeout": {
        "noInputWarningSeconds": 20,
        "noInputHangupSeconds": 30
      }
    }
  }
}
```

### Call Duration Protection System
This project implements a 3-layer protection system to ensure calls don't exceed 3 minutes:

1. **Assistant Configuration**: `maxDurationSeconds: 180` provides server-side enforcement
2. **Agent Warning System**: Configurable warning delivered to agent before call termination
2. **Silence Timeouts**: Handle unresponsive users (20s warning, 30s hangup)  
3. **Client-Side Hard Kill Timer**: Failsafe timer that terminates calls via Vapi API after exactly 3 minutes
4. **Inactivity Detection**: Automatically ends calls after 20 seconds of no speech activity

### Features
- **Dynamic countdown timer** showing remaining demo time (3:00 → 0:00)
- **Agent warning system** with configurable timing and message
- **Visual indicators** for time warnings and call status
- Automatic call termination at 3-minute mark
- Graceful call endings with agent notification
- Inactivity detection with 20-second timeout
- Multiple warning states (time warning, inactivity warning)
- Call duration tracking and display
- Graceful fallbacks if API calls fail
