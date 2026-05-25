# AutoSys Lab Landing Page

## Vapi Assistant Configuration

### Layer 1: Assistant Configuration
Configure your Vapi assistant with these exact settings in the Vapi Dashboard:

```json
{
  "name": "Website Demo Agent",
  "maxDurationSeconds": 144,
  "hangupDelay": 1,
  "serverTimeoutSeconds": 144,
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
  }
}
```

### VAPI Dashboard Configuration Steps:

1. **Navigate to your VAPI Dashboard** → Assistants → Select your assistant
2. **Set Call Limits** in the "Call Settings" section:
   - `Max Duration`: 144 seconds (2 minutes 24 seconds)
   - `Hangup Delay`: 1 second
   - `Auto Hangup`: Enabled
3. **Configure End Call Detection** in "Conversation" section (optional):
   - Add all the `endCallPhrases` listed above
   - Enable "End call on phrase detection"
4. **Save Configuration** and test the setup

### Timer-Based Auto-Termination System
This project implements a timer-based protection system with inactivity warnings:

#### Timer-Based Termination:
1. **Client-Side Countdown**: 144-second countdown timer (2:24 → 2:23 → ... → 0:00)
2. **Automatic Hangup**: Call terminates immediately when timer reaches 0:00
3. **VAPI Server Backup**: `maxDurationSeconds: 144` provides platform-level enforcement
4. **Visual Feedback**: Real-time countdown display with color warnings

#### Inactivity Warning System:
1. **Speech Activity Monitoring**: Tracks speech events to detect user silence
2. **5-Second Warning**: "Keep talking to continue..." appears after 5 seconds of user silence
3. **Smart Detection**: Only counts user silence, not assistant speech
4. **Visual Feedback**: Warning disappears when user resumes speaking

### Testing Procedures:

#### Timer-Based Tests:
1. **Countdown Functionality**:
   - Start a call and verify timer counts down from 2:24 → 2:23 → 2:22... → 0:00
   - Confirm call automatically ends at 0:00

2. **VAPI Server Backup**:
   - Disable client-side timer temporarily
   - Verify VAPI server terminates call at 144 seconds (2:24)

#### Inactivity Warning Tests:
3. **Warning Display**:
   - Start call and remain silent for 5 seconds
   - Verify warning message appears: "Keep talking to continue..."
   - Resume speaking and verify warning disappears
4. **Assistant Speech Handling**:
   - Let call go silent for 4 seconds

