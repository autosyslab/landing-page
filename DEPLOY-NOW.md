# 🚀 DEPLOY VAPI INTEGRATION - STEP BY STEP

**Status:** ✅ All code changes complete
**Build:** ✅ Verified working
**Next:** Add env vars to Netlify and deploy

---

## 🎯 STEP 1: ADD ENVIRONMENT VARIABLES TO NETLIFY

### **Go to Netlify Dashboard:**
1. Open: https://app.netlify.com
2. Select your site: **AutoSys Lab**
3. Click: **Site Settings** (in top nav)
4. Click: **Environment Variables** (left sidebar)
5. Click: **Add a variable** button

### **Add Variable #1: Public Key**
```
Key:   VITE_VAPI_PUBLIC_KEY
Value: 656929cb-b805-4d2c-abde-5c99e02d71aa
```
- Click **Create variable**

### **Add Variable #2: Assistant ID**
```
Key:   VITE_VAPI_ASSISTANT_ID
Value: 895bfd75-95b3-49f8-a0a6-bbb60a53ef45
```
- Click **Create variable**

### **Verify Both Variables Are Set:**
You should now see:
```
VITE_VAPI_PUBLIC_KEY = 656929cb-b805-4d2c-abde-5c99e02d71aa
VITE_VAPI_ASSISTANT_ID = 895bfd75-95b3-49f8-a0a6-bbb60a53ef45
```

---

## 🎯 STEP 2: DEPLOY TO NETLIFY

### **Option A: Git Push (Recommended)**
```bash
# From your project directory
git add .
git commit -m "fix: Add VAPI Web SDK integration with correct credentials

- Use PUBLIC KEY directly (client-safe)
- Add assistant ID to environment
- Remove unnecessary serverless functions
- Fix CSP to allow Daily.co and Sentry
- Following official VAPI Web SDK patterns"

git push origin main
```

### **Option B: Manual Deploy in Netlify**
1. Go to: **Deploys** tab
2. Click: **Trigger deploy**
3. Select: **Deploy site**

---

## 🎯 STEP 3: WAIT FOR DEPLOY

### **Monitor Deployment:**
1. Watch the deploy log in Netlify
2. Wait for: **"Site is live"** message
3. Should take 2-3 minutes

### **You'll See:**
```
Build started
Installing dependencies
Running build command: npm run build
Build succeeded
Deploying to CDN
Site is live ✅
```

---

## 🎯 STEP 4: TEST THE INTEGRATION

### **Open Your Site:**
```
https://autosyslab.netlify.app
```

### **Hard Refresh:**
- **Windows/Linux:** Ctrl + Shift + R
- **Mac:** Cmd + Shift + R

### **Clear Browser Data:**
1. Right-click anywhere on page
2. Click **Inspect**
3. Go to **Application** tab
4. Click **Clear site data**
5. Refresh page

### **Test Voice Call:**
1. Click **"Meet Your AI Employee"** button
2. Browser asks for microphone permission
3. Click **Allow**
4. Call should start!
5. You should see timer counting down
6. Speak to test the voice AI

---

## 🎯 EXPECTED BEHAVIOR

### **✅ Success Indicators:**
- Button changes to show "Call in Progress"
- Timer appears showing 2:24
- Timer counts down
- You can speak and hear responses
- "End Call" button appears

### **❌ If It Fails:**
Check console for errors:
1. Right-click → Inspect → Console tab
2. Look for errors

**Common Issues:**
- Microphone permission denied → Allow it
- CSP errors → Should be fixed now
- "Assistant ID not configured" → Check Netlify env vars
- "Public key not configured" → Check Netlify env vars

---

## 🔍 TROUBLESHOOTING

### **Issue: "Voice features not configured"**
**Solution:**
- Environment variables not set in Netlify
- Go back to Step 1 and add them

### **Issue: CSP blocks Daily.co**
**Solution:**
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- The fix is in your _headers file

### **Issue: "Failed to start call"**
**Solution:**
- Check VAPI dashboard: https://dashboard.vapi.ai
- Verify assistant is active
- Check if you have VAPI credits

### **Issue: Build fails**
**Solution:**
- Check Netlify build log
- Verify both env vars are set correctly
- No typos in variable names

---

## 📋 POST-DEPLOYMENT CHECKLIST

After successful deployment:

- [ ] Site loads without errors
- [ ] No console errors (check dev tools)
- [ ] Button appears: "Meet Your AI Employee"
- [ ] Clicking button requests microphone
- [ ] After allowing mic, call starts
- [ ] Timer appears and counts down
- [ ] Can hear voice assistant
- [ ] Can end call successfully
- [ ] Cooldown message appears after call

---

## 🎉 SUCCESS!

If all the above works, your VAPI integration is:
- ✅ **Fully functional**
- ✅ **Securely configured**
- ✅ **Following best practices**
- ✅ **Production ready**

---

## 📞 VAPI DASHBOARD

Monitor your calls at:
```
https://dashboard.vapi.ai
```

You can see:
- Active calls
- Call history
- Usage statistics
- Credits remaining
- Logs and errors

---

## 🔐 SECURITY REMINDER

**What's Exposed (Safe):**
- ✅ Public Key (designed for client use)
- ✅ Assistant ID (meant to be public)

**What's Protected:**
- 🔒 Private API Key (not used in client)
- 🔒 .env file (in .gitignore)

**Your implementation is secure!** ✅

---

## 🚀 DEPLOYMENT COMMAND (Quick Reference)

```bash
# Add env vars to Netlify first, then:
git add .
git commit -m "fix: Complete VAPI Web SDK integration"
git push origin main

# Wait 2-3 minutes for deploy
# Hard refresh browser (Ctrl+Shift+R)
# Test voice call
```

---

**Ready to deploy? Let's go!** 🎉
