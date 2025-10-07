# PhishMail Guard - Browser Extension

A real-time phishing email detection browser extension that works with Gmail, Outlook, and Yahoo Mail.

## Features

- **Real-time Email Analysis**: Automatically scans emails as you read them
- **Visual Indicators**: Color-coded badges showing safety status
- **Phishing Warnings**: Prominent alerts for potential phishing emails
- **Multi-provider Support**: Works with Gmail, Outlook, and Yahoo Mail
- **Configurable Settings**: Customize confidence thresholds and notifications
- **Statistics Tracking**: Monitor emails scanned and threats detected
- **Offline Detection**: Shows backend server status

## Installation

### Prerequisites

1. Make sure your backend server is running on `http://127.0.0.1:8000`
2. Test the backend by running: `curl -X POST http://127.0.0.1:8000/predict -H "Content-Type: application/json" -d '{"email":"test"}'`

### Extension Installation

1. **Create Icons** (Required):
   You need to create PNG icons in the following sizes and place them in the `icons/` directory:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels) 
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
   
   Use a shield with a checkmark design to represent email protection.

2. **Load Extension in Chrome/Edge**:
   - Open Chrome/Edge and go to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `browser-extension` folder
   - The extension should now appear in your extensions list

3. **Pin the Extension**:
   - Click the extensions puzzle icon in your browser toolbar
   - Find "PhishMail Guard" and click the pin icon
   - The extension icon should now be visible in your toolbar

## Usage

### Automatic Scanning
1. Navigate to Gmail, Outlook, or Yahoo Mail
2. Open any email
3. The extension will automatically analyze the email content
4. Look for colored badges at the top of emails:
   - 🟢 **Green Badge**: Safe email
   - 🔴 **Red Badge**: Potential phishing email

### Manual Scanning
1. Click the PhishMail Guard icon in your browser toolbar
2. Click "Scan Current Page" button
3. All visible emails on the page will be re-analyzed

### Settings Configuration
Click the extension icon to access settings:
- **Enable Protection**: Turn the extension on/off
- **Real-time Analysis**: Automatically scan new emails
- **Show Warnings**: Display prominent phishing warnings
- **Confidence Threshold**: Set minimum confidence level for warnings (70% default)

## How It Works

1. **Content Script**: Monitors email content on supported providers
2. **Email Detection**: Identifies email elements using provider-specific selectors
3. **Content Extraction**: Extracts email text content for analysis
4. **API Communication**: Sends email content to your local ML backend
5. **Visual Feedback**: Displays results with color-coded badges and warnings
6. **Real-time Updates**: Uses mutation observers to detect new emails

## Supported Email Providers

- **Gmail** (`mail.google.com`)
- **Outlook** (`outlook.live.com`, `outlook.office.com`)
- **Yahoo Mail** (`mail.yahoo.com`)

## File Structure

```
browser-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content.js            # Content script for email detection
├── content.css           # Styles for email indicators
├── popup.html            # Extension popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── icons/                # Extension icons (you need to create these)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## Troubleshooting

### Extension Not Working
1. Check if your backend server is running on port 8000
2. Verify you're on a supported email provider
3. Check browser console for error messages
4. Try disabling and re-enabling the extension

### Backend Connection Issues
1. Ensure your backend server is running: `python app.py` in the backend directory
2. Test the API endpoint manually
3. Check firewall settings if connection fails

### Email Detection Issues
1. Try refreshing the email page
2. Click "Scan Current Page" button manually
3. Check if email content is actually visible on the page

## Security Notes

- Extension only works with your local backend server
- No email content is sent to external servers
- All analysis happens locally on your machine
- Extension requires specific permissions only for supported email providers

## Development

To modify the extension:
1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the PhishMail Guard extension
4. Test your changes

## Icon Creation Guide

Create 4 PNG icons with these specifications:
- **Design**: Shield with checkmark or similar security symbol
- **Colors**: Blue/green for security, red accent for alerts
- **Background**: Transparent or white
- **Style**: Clean, professional, recognizable at small sizes

You can use tools like:
- Canva (online design tool)
- GIMP (free image editor)  
- Adobe Illustrator/Photoshop
- Online icon generators

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your backend server is running
3. Test on supported email providers only
4. Check extension permissions in browser settings