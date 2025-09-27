// PhishMail Guard Debug Script
// Run this in browser console to debug extension issues

console.log('🔍 PhishMail Guard Debug Script Started');

// Debug object to store all debug information
window.PhishGuardDebug = {
    checks: [],
    results: {},
    log: function(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] 🛠️ ${message}`, data || '');
        this.checks.push({ timestamp, message, data });
    }
};

const debug = window.PhishGuardDebug;

// Check 1: Extension Content Script Detection
debug.log('Checking if content script is loaded...');
setTimeout(() => {
    if (typeof PhishMailGuard !== 'undefined') {
        debug.log('✅ PhishMailGuard class found');
        debug.results.contentScript = true;
    } else {
        debug.log('❌ PhishMailGuard class NOT found');
        debug.results.contentScript = false;
    }
    
    if (window.phishGuard) {
        debug.log('✅ phishGuard instance found');
        debug.results.instance = true;
    } else {
        debug.log('❌ phishGuard instance NOT found');
        debug.results.instance = false;
    }
}, 1000);

// Check 2: Extension Manifest and Permissions
debug.log('Checking extension manifest...');
if (typeof chrome !== 'undefined' && chrome.runtime) {
    debug.log('✅ Chrome extension API available');
    debug.results.chromeAPI = true;
    
    try {
        const manifest = chrome.runtime.getManifest();
        debug.log('✅ Extension manifest loaded', manifest.name + ' v' + manifest.version);
        debug.results.manifest = true;
    } catch (error) {
        debug.log('❌ Failed to get manifest', error);
        debug.results.manifest = false;
    }
} else {
    debug.log('❌ Chrome extension API NOT available');
    debug.results.chromeAPI = false;
}

// Check 3: Backend Connectivity
debug.log('Checking backend connectivity...');
fetch('http://127.0.0.1:8000/')
    .then(response => response.json())
    .then(data => {
        debug.log('✅ Backend is accessible', data);
        debug.results.backend = true;
    })
    .catch(error => {
        debug.log('❌ Backend NOT accessible', error);
        debug.results.backend = false;
    });

// Check 4: Email Elements Detection
debug.log('Checking for email elements...');
const gmailSelectors = [
    '[data-message-id]',
    '.ii.gt .a3s.aiL',
    '.adn.ads .a3s.aiL',
    '.a3s[data-body]',
    '[data-thread-id] .a3s',
    '.gs .ii .a3s',
    '.hP .a3s'
];

const outlookSelectors = [
    '[data-convid]',
    '.rps_2bc8',
    '.rps_1f43',
    '[data-automation-id="messageBody"]',
    '.rps_c071',
    '.UnreadMarkerContainer',
    '[role="main"] [data-automation-id]'
];

const yahooSelectors = [
    '[data-test-id="message-view-body"]',
    '.message-content',
    '[data-test-id="message-content"]',
    '.D_F.ek9p7qsU',
    '.message-body'
];

let totalEmails = 0;
gmailSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        debug.log(`✅ Found ${elements.length} Gmail elements with selector: ${selector}`);
        totalEmails += elements.length;
    }
});

outlookSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        debug.log(`✅ Found ${elements.length} Outlook elements with selector: ${selector}`);
        totalEmails += elements.length;
    }
});

yahooSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        debug.log(`✅ Found ${elements.length} Yahoo elements with selector: ${selector}`);
        totalEmails += elements.length;
    }
});

debug.results.emailElements = totalEmails;
debug.log(`📧 Total email elements found: ${totalEmails}`);

// Check 5: Extension Settings
debug.log('Checking extension settings...');
if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get([
        'enabled',
        'realTimeAnalysis',
        'showNotifications',
        'confidenceThreshold'
    ], (settings) => {
        debug.log('⚙️ Extension settings:', settings);
        debug.results.settings = settings;
        
        if (settings.enabled === false) {
            debug.log('⚠️ Extension is DISABLED in settings');
        }
        if (settings.showNotifications === false) {
            debug.log('⚠️ Notifications are DISABLED in settings');
        }
    });
}

// Check 6: Test Email Analysis
debug.log('Testing email analysis...');
const testEmailContent = `
Dear Customer,
Your PayPal account has been temporarily restricted due to suspicious activity. 
To restore full access to your account, you must verify your identity immediately.
Click here to verify your account: http://paypal-secure-verify.suspicious-domain.com/verify
Failure to verify within 24 hours will result in permanent account closure.
Warning: Do not share this email with anyone. This is a confidential security matter.
Best regards, PayPal Security Team
`;

if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage({
        action: 'analyzeEmail',
        emailContent: testEmailContent
    }, (response) => {
        if (response) {
            debug.log('✅ Email analysis test successful', response);
            debug.results.analysis = response;
            
            // Test the alert UI
            if (window.phishGuard && typeof window.phishGuard.showEmailAnalysisPopup === 'function') {
                debug.log('🎯 Testing alert UI...');
                setTimeout(() => {
                    window.phishGuard.showEmailAnalysisPopup(response, document.body);
                }, 1000);
            }
        } else {
            debug.log('❌ Email analysis test failed - no response');
            debug.results.analysis = null;
        }
    });
} else {
    debug.log('❌ Cannot test email analysis - Chrome API not available');
}

// Check 7: CSS Styles Loading
debug.log('Checking CSS styles...');
const testElement = document.createElement('div');
testElement.className = 'phishguard-alert-card high-danger';
testElement.style.display = 'none';
document.body.appendChild(testElement);

setTimeout(() => {
    const styles = window.getComputedStyle(testElement);
    if (styles.borderLeftColor && styles.borderLeftColor !== 'rgba(0, 0, 0, 0)') {
        debug.log('✅ CSS styles are loaded correctly');
        debug.results.cssLoaded = true;
    } else {
        debug.log('❌ CSS styles are NOT loaded');
        debug.results.cssLoaded = false;
    }
    document.body.removeChild(testElement);
}, 500);

// Check 8: Manual Test Functions
debug.log('Creating manual test functions...');

window.testPhishingAlert = function() {
    debug.log('🧪 Manual phishing alert test');
    
    const mockResult = {
        prediction: 'Phishing Email',
        confidence: 0.95,
        phishing_confidence: 0.95,
        safe_confidence: 0.05,
        reasons: [
            'Suspicious domain detected',
            'Urgent action required language',
            'Threat of account closure',
            'Request for sensitive information'
        ]
    };
    
    if (window.phishGuard && typeof window.phishGuard.showEmailAnalysisPopup === 'function') {
        debug.log('🎯 Showing mock phishing alert...');
        window.phishGuard.showEmailAnalysisPopup(mockResult, document.body);
    } else {
        debug.log('❌ Cannot show alert - phishGuard not available');
        
        // Create alert manually for testing
        debug.createTestAlert(mockResult);
    }
};

window.testSafeAlert = function() {
    debug.log('🧪 Manual safe email alert test');
    
    const mockResult = {
        prediction: 'Safe Email',
        confidence: 0.95,
        phishing_confidence: 0.02,
        safe_confidence: 0.98,
        reasons: [
            'Legitimate sender domain',
            'No suspicious links detected',
            'Professional email format'
        ]
    };
    
    if (window.phishGuard && typeof window.phishGuard.showEmailAnalysisPopup === 'function') {
        debug.log('🎯 Showing mock safe alert...');
        window.phishGuard.showEmailAnalysisPopup(mockResult, document.body);
    } else {
        debug.log('❌ Cannot show alert - phishGuard not available');
        debug.createTestAlert(mockResult);
    }
};

// Fallback alert creation for testing
debug.createTestAlert = function(result) {
    const isPhishing = result.prediction === 'Phishing Email';
    const phishingPercentage = isPhishing ? (result.phishing_confidence * 100) : ((1 - result.safe_confidence) * 100);
    
    const alertCard = document.createElement('div');
    alertCard.className = `phishguard-alert-card ${phishingPercentage >= 80 ? 'high-danger' : (phishingPercentage >= 60 ? 'possible-phishing' : (phishingPercentage >= 5 ? 'few-red-flags' : 'safe'))}`;
    alertCard.innerHTML = `
        <div class="phishguard-alert-header">
            <div class="phishguard-alert-icon">${isPhishing ? '⚠️' : '✅'}</div>
            <div class="phishguard-alert-content">
                <div class="phishguard-alert-title">${isPhishing ? 'Phishing Email Detected' : 'Email is Safe'}</div>
                <div class="phishguard-alert-percentage">${phishingPercentage.toFixed(1)}% Phishing Risk</div>
            </div>
            <button class="phishguard-alert-close">×</button>
        </div>
        <div class="phishguard-alert-summary">
            ${result.reasons ? result.reasons[0] : 'Analysis complete'}
        </div>
    `;
    
    alertCard.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        z-index: 999999;
        width: 350px;
        max-width: calc(100vw - 40px);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: phishguard-alert-slide-in 0.4s ease;
    `;
    
    alertCard.querySelector('.phishguard-alert-close').addEventListener('click', () => {
        alertCard.remove();
    });
    
    document.body.appendChild(alertCard);
    
    setTimeout(() => {
        if (alertCard.parentNode) alertCard.remove();
    }, 5000);
    
    debug.log('✅ Test alert created manually');
};

// Check 9: Generate Summary Report
setTimeout(() => {
    debug.log('📊 Generating debug summary report...');
    
    const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        results: debug.results,
        checks: debug.checks.length,
        recommendation: []
    };
    
    // Generate recommendations
    if (!report.results.contentScript) {
        report.recommendation.push('❌ Content script not loaded. Check extension installation.');
    }
    if (!report.results.chromeAPI) {
        report.recommendation.push('❌ Chrome API not available. Extension may not be running.');
    }
    if (!report.results.backend) {
        report.recommendation.push('❌ Backend not accessible. Start the backend server.');
    }
    if (report.results.emailElements === 0) {
        report.recommendation.push('⚠️ No email elements found. Try a different email provider page.');
    }
    if (!report.results.cssLoaded) {
        report.recommendation.push('❌ CSS styles not loaded. Check content.css file.');
    }
    
    if (report.recommendation.length === 0) {
        report.recommendation.push('✅ All checks passed! Extension should be working.');
    }
    
    console.log('📋 DEBUG REPORT:', report);
    window.PhishGuardDebugReport = report;
    
    debug.log('✅ Debug completed. Run testPhishingAlert() or testSafeAlert() to test alerts manually.');
    
}, 3000);

// Instructions for user
console.log(`
🎯 PhishMail Guard Debug Instructions:
1. Wait 3 seconds for all checks to complete
2. Check the debug report: PhishGuardDebugReport
3. Run manual tests:
   - testPhishingAlert() - Test phishing alert
   - testSafeAlert() - Test safe email alert
4. Check browser console for any errors
5. Ensure backend is running on http://127.0.0.1:8000
`);