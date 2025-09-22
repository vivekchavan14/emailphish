# PhishMail Guard Extension - Installation Guide

## 🎉 Your extension is ready to install!

The extension files have been created and placeholder icons have been generated. Your backend server should be running on port 8000.

---

## Step-by-Step Installation

### Step 1: Verify Backend is Running
✅ Your backend server is running on `http://127.0.0.1:8000`

### Step 2: Install the Browser Extension

#### For Google Chrome:
1. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Type `chrome://extensions/` in the address bar and press Enter
   - OR click the three dots menu → More tools → Extensions

2. **Enable Developer Mode**
   - Look for the "Developer mode" toggle in the top-right corner
   - Turn it ON (it should be blue/green when enabled)

3. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to this folder: 
     ```
     C:\Users\DELL\emailphish\Phishing-Email-Detection-System\frontend\browser-extension
     ```
   - Select this folder and click "Select Folder"

4. **Pin the Extension**
   - Look for the puzzle piece icon (Extensions) in Chrome's toolbar
   - Find "PhishMail Guard - Real-time Email Protection"
   - Click the pin icon next to it to pin it to your toolbar

#### For Microsoft Edge:
1. **Open Edge Extensions Page**
   - Open Microsoft Edge
   - Type `edge://extensions/` in the address bar and press Enter

2. **Enable Developer Mode**
   - Turn on "Developer mode" toggle on the left sidebar

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the browser-extension folder (same path as above)

---

## Step 3: Test the Extension

### Quick Test:
1. **Check Extension Status**
   - Click the PhishMail Guard icon in your browser toolbar
   - You should see "Protection Active" and "Backend server online"

2. **Test on Gmail**
   - Go to `https://mail.google.com`
   - Open any email
   - You should see the extension automatically analyze emails with colored badges

### What to Look For:
- **Green badges**: Safe emails ✅
- **Red badges**: Potential phishing emails ⚠️
- **Loading indicators**: While analyzing 🔄
- **Extension badge**: Shows count of phishing emails detected

---

## Extension Features

### Real-time Analysis
- Automatically scans emails as you open them
- Works on Gmail, Outlook, and Yahoo Mail
- Shows results with color-coded badges

### Settings (Click extension icon)
- **Enable Protection**: Turn on/off
- **Real-time Analysis**: Auto-scan new emails  
- **Show Warnings**: Display phishing alerts
- **Confidence Threshold**: Adjust sensitivity (70% default)

### Statistics
- Track emails scanned
- Count safe vs phishing emails
- Monitor your email security

---

## Troubleshooting

### Extension Not Loading
- Make sure "Developer mode" is enabled
- Check that you selected the correct folder
- Refresh the extensions page and try again

### Extension Not Working on Emails
- Verify your backend is running (check extension popup)
- Make sure you're on a supported email provider
- Try clicking "Scan Current Page" manually

### Backend Connection Issues
- Restart your backend server: `python app.py` in the backend folder
- Check Windows Firewall isn't blocking port 8000
- Verify the extension popup shows "Backend server online"

---

## Usage Instructions

### On Gmail:
1. Go to `https://mail.google.com`
2. Open any email
3. Look for colored badges at the top of emails
4. Click badges for detailed analysis results

### On Outlook:
1. Go to `https://outlook.live.com` or `https://outlook.office.com`
2. Open emails to see automatic analysis

### On Yahoo Mail:
1. Go to `https://mail.yahoo.com`
2. Extension will work similarly to Gmail

---

## What's Next?

1. **Test with Different Emails**: Try opening various emails to see the analysis
2. **Check Statistics**: Click the extension icon to see your email security stats
3. **Customize Settings**: Adjust confidence thresholds and notifications
4. **Share Feedback**: Monitor how well it detects phishing attempts

---

## File Structure (Reference)
```
browser-extension/
├── manifest.json         # Extension configuration ✅
├── background.js         # API communication ✅
├── content.js           # Email monitoring ✅  
├── content.css          # Visual styling ✅
├── popup.html           # Settings interface ✅
├── popup.css            # Popup styling ✅
├── popup.js             # Popup functionality ✅
├── icons/               # Extension icons ✅
│   ├── icon16.png       ✅
│   ├── icon32.png       ✅
│   ├── icon48.png       ✅
│   └── icon128.png      ✅
└── README.md            # Documentation ✅
```

**All files are ready! 🚀**

---

## Support

If you encounter any issues:
1. Check the browser console for error messages (F12)
2. Verify backend server is running
3. Make sure you're using supported email providers
4. Try refreshing the email page

**Your PhishMail Guard extension is ready to protect you from phishing emails in real-time!** 🛡️