# PhishMail Guard - Complete Testing Guide

## ✅ Backend Status: WORKING
Your backend server is running correctly and responding to requests!

---

## 🔧 How to Test the Extension

### **Step 1: Reload the Extension**
After the recent fix, you need to reload:
1. Go to `chrome://extensions/`
2. Find "PhishMail Guard" 
3. Click the **refresh/reload button** 🔄
4. This loads the updated content script

### **Step 2: Test Extension Popup**
1. **Click the PhishMail Guard icon** in your browser toolbar
2. **Check the status indicators:**
   - Should show "Protection Active" 
   - Should show "Backend server online"
   - Statistics should be visible

### **Step 3: Test on Gmail (Recommended)**
1. **Open a new tab and go to:** `https://mail.google.com`
2. **Sign in to your Gmail account**
3. **Click on any email** to open it
4. **Wait 2-3 seconds** for the extension to analyze
5. **Look for a colored badge** at the top of the email:
   - 🟢 **Green badge**: Safe email
   - 🔴 **Red badge**: Potential phishing

### **Step 4: Test Manual Scan Button**
1. **While on Gmail with an email open**
2. **Click the extension icon** (PhishMail Guard)
3. **Click "Scan Current Page"** button
4. **Should show "Scanning..."** then "Scan Complete"
5. **Check the email again** for badges

---

## 🎯 What Should Happen

### **Automatic Analysis:**
- Extension analyzes emails automatically when you open them
- Shows a brief "Analyzing..." indicator
- Displays colored badges with confidence percentage
- Updates statistics in the extension popup

### **Visual Indicators:**
```
📧 Email Content
┌─────────────────────────────────────┐
│ ✅ Safe Email - 85.2% confidence    │  ← Green badge for safe
│ Click for details                   │
├─────────────────────────────────────┤
│ Email content here...               │
└─────────────────────────────────────┘

OR

┌─────────────────────────────────────┐
│ ⚠️ Phishing Email - 78.9% confidence│  ← Red badge for phishing
│ Click for details                   │
├─────────────────────────────────────┤
│ Email content here...               │
└─────────────────────────────────────┘
```

### **Extension Badge:**
- Shows number of phishing emails detected on current page
- Updates in real-time as you browse emails

---

## 🚨 Troubleshooting

### **"Scan Current Page" Button Not Working:**
✅ **Fixed!** - Content script now has manual scan listener

### **No Badges Appearing on Emails:**
1. **Check supported providers:** Only works on Gmail, Outlook, Yahoo Mail
2. **Verify extension is enabled:** Check popup shows "Protection Active"
3. **Try manual scan:** Click "Scan Current Page" button
4. **Check console:** Press F12, look for errors in Console tab

### **Backend Connection Issues:**
1. **Verify backend is running:**
   ```bash
   python app.py  # In backend folder
   ```
2. **Check extension popup:** Should show "Backend server online"
3. **Test backend manually:**
   ```bash
   python -c "import requests; print(requests.post('http://127.0.0.1:8000/predict', json={'email': 'test'}).json())"
   ```

### **Extension Not Loading:**
1. **Reload extension:** Go to chrome://extensions/ and click refresh
2. **Check for errors:** Look for red error messages
3. **Verify files:** Make sure all files exist in browser-extension folder

---

## 📊 Testing Different Email Types

### **Test with Safe Emails:**
- Normal newsletters
- Personal emails from friends
- Bank statements from legitimate banks
- Should show **green badges**

### **Test with Suspicious Content:**
- Emails asking for passwords
- Urgent payment requests
- Suspicious links or attachments
- Should show **red badges** with warnings

### **Create Test Email Content:**
You can copy these into Gmail drafts to test:

**Safe Email Example:**
```
Hi there,
Thanks for your recent purchase. Your order #12345 has been shipped.
You can track it here: https://legitimate-store.com/tracking
Best regards,
Customer Service
```

**Suspicious Email Example:**
```
URGENT: Your account will be suspended!
Click here immediately to verify: http://fake-bank.com/verify
Send your password and SSN to prevent closure.
Act now or lose access forever!
```

---

## 🎮 Interactive Testing

### **Quick Test Checklist:**
- [ ] Extension icon visible in toolbar
- [ ] Popup opens and shows "Protection Active"  
- [ ] Backend status shows "online"
- [ ] Gmail emails show colored badges automatically
- [ ] Manual scan button works
- [ ] Statistics update correctly
- [ ] Settings can be changed
- [ ] Console shows no errors

### **Advanced Testing:**
1. **Test multiple emails:** Open 5-10 different emails
2. **Check statistics:** Should count total scanned emails
3. **Test settings:** Try disabling/enabling features
4. **Test confidence threshold:** Adjust and see if warnings change

---

## 📋 Expected Results

### **Your Backend Test Result:**
✅ **Status Code:** 200  
✅ **Prediction:** "Phishing Email" (for test content)  
✅ **Confidence:** 65.4%  
✅ **Model:** Advanced ML  

This confirms your backend is working perfectly!

### **Extension Should:**
- Analyze emails in 1-3 seconds
- Show appropriate colored badges
- Update statistics in popup
- Display confidence percentages
- Work on Gmail, Outlook, Yahoo Mail

---

## 🆘 If Still Not Working

### **Debug Steps:**
1. **Open Developer Tools:** Press F12 in Gmail
2. **Check Console tab:** Look for PhishMail Guard messages
3. **Check Network tab:** Look for requests to localhost:8000
4. **Try different email:** Test with multiple emails

### **Common Console Messages:**
- `"PhishMail Guard initialized for gmail"` ✅ Good
- `"Manual scan requested"` ✅ Good  
- `"Error analyzing email"` ❌ Check backend
- `"No emails found"` ℹ️ Try opening an email first

---

## 🎉 Success Indicators

**You'll know it's working when:**
- Emails automatically show colored badges
- Extension popup shows email counts
- Backend status is online
- No error messages in console
- Manual scan button responds

**Try it now on Gmail and you should see the magic happen!** ✨