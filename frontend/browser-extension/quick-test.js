// Quick Test Script for PhishMail Guard
// Copy and paste this into Gmail console (F12)

console.log('🧪 PhishMail Guard Quick Test Starting...');

setTimeout(async () => {
    console.log('='.repeat(50));
    console.log('📊 EXTENSION STATUS CHECK');
    console.log('='.repeat(50));
    
    // 1. Check Extension API
    const hasChrome = typeof chrome !== 'undefined' && chrome.runtime;
    console.log('✅ Chrome Extension API:', hasChrome ? '✅ Available' : '❌ Not Available');
    
    // 2. Check Content Script
    const hasContentScript = typeof PhishMailGuard !== 'undefined';
    console.log('✅ Content Script Loaded:', hasContentScript ? '✅ Yes' : '❌ No');
    
    // 3. Check PhishGuard Instance
    const hasInstance = !!window.phishGuard;
    console.log('✅ PhishGuard Instance:', hasInstance ? '✅ Active' : '❌ Not Active');
    
    // 4. Check Alert UI
    const hasAlertUI = !!window.phishingAlertUI;
    console.log('✅ Alert UI System:', hasAlertUI ? '✅ Loaded' : '❌ Not Loaded');
    
    // 5. Test Backend Connection
    try {
        const response = await fetch('http://127.0.0.1:8000/');
        const data = await response.json();
        console.log('✅ Backend Connection:', '✅ Connected -', data.status);
    } catch (error) {
        console.log('✅ Backend Connection:', '❌ Failed -', error.message);
    }
    
    // 6. Count Emails on Page
    const emailSelectors = [
        '[data-message-id]',
        '.ii.gt .a3s.aiL', 
        '.adn.ads .a3s.aiL',
        '.a3s[data-body]'
    ];
    
    let totalEmails = 0;
    emailSelectors.forEach(selector => {
        const count = document.querySelectorAll(selector).length;
        totalEmails += count;
        if (count > 0) {
            console.log(`✅ Found ${count} emails with selector: ${selector}`);
        }
    });
    
    console.log('✅ Total Email Elements:', totalEmails);
    
    console.log('='.repeat(50));
    console.log('🎯 RUNNING TESTS');
    console.log('='.repeat(50));
    
    // Test 1: Basic Alert (Fallback)
    console.log('🧪 Test 1: Basic Alert Display');
    if (window.phishGuard) {
        window.phishGuard.showBasicNotification({
            prediction: 'Phishing Email',
            confidence: 0.9,
            phishing_confidence: 0.9,
            reasons: ['TEST: Basic alert working!']
        });
        console.log('✅ Basic alert should appear in top-right corner');
    } else {
        console.log('❌ PhishGuard instance not available');
    }
    
    // Wait 3 seconds then test advanced UI
    setTimeout(() => {
        console.log('🧪 Test 2: Advanced Alert UI');
        if (window.phishingAlertUI) {
            window.phishingAlertUI.showPhishingAlert({
                prediction: 'Phishing Email',
                confidence: 0.95,
                phishing_confidence: 0.95,
                safe_confidence: 0.05,
                reasons: [
                    'TEST: Advanced UI working!',
                    'Multiple suspicious indicators detected',
                    'High-risk phishing patterns found',
                    'Urgent action language detected'
                ]
            });
            console.log('✅ Advanced alert should appear with red color and 95% risk');
        } else {
            console.log('❌ Advanced Alert UI not available');
        }
    }, 3000);
    
    // Test 3: Force Email Scan
    setTimeout(() => {
        console.log('🧪 Test 3: Force Email Scan');
        if (window.phishGuard && typeof window.phishGuard.scanExistingEmails === 'function') {
            console.log('🔍 Triggering email scan...');
            window.phishGuard.scanExistingEmails();
            console.log('✅ Email scan triggered - watch for processing messages');
        } else {
            console.log('❌ Email scan function not available');
        }
    }, 6000);
    
    // Final Summary
    setTimeout(() => {
        console.log('='.repeat(50));
        console.log('📋 TEST SUMMARY');
        console.log('='.repeat(50));
        
        const score = [
            hasChrome,
            hasContentScript, 
            hasInstance,
            hasAlertUI,
            totalEmails > 0
        ].filter(Boolean).length;
        
        console.log(`Score: ${score}/5 tests passed`);
        
        if (score === 5) {
            console.log('🎉 ALL SYSTEMS GO! Extension should be working perfectly.');
            console.log('📧 Try opening some emails to see automatic analysis.');
        } else {
            console.log('⚠️ Some issues detected. Check the failed items above.');
        }
        
        console.log('\n📝 Quick Commands:');
        console.log('• window.phishGuard.scanExistingEmails() - Force scan');
        console.log('• window.phishingAlertUI.testAllAlerts() - Test all alert types');
        
    }, 10000);
    
}, 1000);

console.log('⏳ Test will complete in 10 seconds...');