# AutoSys Lab Landing Page

## Vapi Assistant Configuration

### Layer 1: Assistant Configuration
Configure your Vapi assistant with these exact settings in the Vapi Dashboard:

```json
{
  "name": "Website Demo Agent", 
  "maxDurationSeconds": 240,
  "endCallPhrases": ["Thanks for trying the demo. Ending the call now."],
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
This project implements a 3-layer protection system to ensure calls don't exceed 4 minutes:

1. **Assistant Configuration**: `maxDurationSeconds: 240` provides server-side enforcement
2. **Silence Timeouts**: Handle unresponsive users (20s warning, 30s hangup)  
3. **Client-Side Hard Kill Timer**: Failsafe timer that terminates calls via Vapi API after exactly 4 minutes

### Features
- Real-time countdown timer showing remaining demo time
- Automatic call termination at 4-minute mark
- Graceful fallbacks if API calls fail
- Clean timer cleanup on manual call ending
