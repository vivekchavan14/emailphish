// Final Test Script - Improved Smaller UI with Detailed Extension Popup
// Copy and paste this into Gmail console (F12)

console.log('🎨 Testing Improved PhishMail Guard UI...');

setTimeout(() => {
    // Test 1: Compact High-Risk Alert
    console.log('🧪 Test 1: Compact High-Risk Alert (95% phishing)');
    if (window.phishingAlertUI) {
        window.phishingAlertUI.showPhishingAlert({
            prediction: 'Phishing Email',
            confidence: 0.95,
            phishing_confidence: 0.95,
            safe_confidence: 0.05,
            reasons: [
                'Suspicious domain detected linking to known phishing sites',
                'Urgent action language typical of scam emails',
                'Request for sensitive personal and financial information',
                'Poor grammar and spelling mistakes throughout content',
                'Mismatched sender information and claimed organization',
                'Threat of immediate account suspension or closure'
            ]
        });
        console.log('✅ Compact red alert should appear - smaller size, fewer reasons shown');
    }
    
    // Test 2: Medium Risk Alert
    setTimeout(() => {
        console.log('🧪 Test 2: Compact Warning Alert (70% phishing)');
        if (window.phishingAlertUI) {
            window.phishingAlertUI.showPhishingAlert({
                prediction: 'Phishing Email',
                confidence: 0.70,
                phishing_confidence: 0.70,
                safe_confidence: 0.30,
                reasons: [
                    'Several suspicious elements detected in email content',
                    'Email formatting differs from legitimate communications',
                    'Some characteristics match known phishing patterns',
                    'Caution advised with links and attachments'
                ]
            });
            console.log('✅ Compact yellow alert should appear');
        }
    }, 4000);
    
    // Test 3: Low Risk Alert  
    setTimeout(() => {
        console.log('🧪 Test 3: Compact Caution Alert (15% phishing)');
        if (window.phishingAlertUI) {
            window.phishingAlertUI.showPhishingAlert({
                prediction: 'Safe Email',
                confidence: 0.85,
                phishing_confidence: 0.15,
                safe_confidence: 0.85,
                reasons: [
                    'Minor inconsistencies in email header information detected',
                    'Generally safe but exercise normal email caution practices'
                ]
            });
            console.log('✅ Compact orange alert should appear');
        }
    }, 8000);
    
    // Test 4: Safe Email Alert
    setTimeout(() => {
        console.log('🧪 Test 4: Compact Safe Alert (2% phishing)');
        if (window.phishingAlertUI) {
            window.phishingAlertUI.showPhishingAlert({
                prediction: 'Safe Email',
                confidence: 0.98,
                phishing_confidence: 0.02,
                safe_confidence: 0.98,
                reasons: [
                    'Email passes comprehensive security analysis checks',
                    'Legitimate sender domain verified and authenticated',
                    'Professional email format and structure confirmed'
                ]
            });
            console.log('✅ Compact green alert should appear');
        }
    }, 12000);
    
    console.log('📝 UI IMPROVEMENTS:');
    console.log('• Smaller popup size (320px vs 420px)');
    console.log('• Fewer reasons in popup (2 vs 3)');
    console.log('• More compact styling and padding');
    console.log('• All detailed reasons available in extension popup');
    console.log('• Click extension icon to see full analysis');
    
}, 1000);

console.log('⏳ Testing all 4 alert types over 15 seconds...');
console.log('🔍 Click the PhishMail Guard extension icon to see detailed analysis!');