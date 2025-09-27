// PhishMail Guard Extension Debugger and Test Tool
// Inject this script into Gmail console to test the extension

console.log('🔧 PhishMail Guard Extension Debugger Loading...');

window.PhishGuardDebugger = {
    tests: [],
    results: {},
    
    // Main debugging function
    async runFullDiagnostic() {
        console.log('🚀 Starting Full PhishMail Guard Diagnostic...');
        
        const results = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            tests: {}
        };
        
        // Test 1: Extension Installation
        results.tests.extensionInstalled = await this.testExtensionInstalled();
        
        // Test 2: Content Script Loaded
        results.tests.contentScriptLoaded = await this.testContentScriptLoaded();
        
        // Test 3: Alert UI System
        results.tests.alertUILoaded = await this.testAlertUILoaded();
        
        // Test 4: Backend Connection
        results.tests.backendConnected = await this.testBackendConnection();
        
        // Test 5: Email Detection
        results.tests.emailDetection = await this.testEmailDetection();
        
        // Test 6: Email Analysis
        results.tests.emailAnalysis = await this.testEmailAnalysis();
        
        // Test 7: Alert Display
        results.tests.alertDisplay = await this.testAlertDisplay();
        
        // Generate report
        this.generateReport(results);
        
        return results;
    },
    
    async testExtensionInstalled() {
        console.log('🧪 Testing Extension Installation...');
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
                const manifest = chrome.runtime.getManifest();
                console.log('✅ Extension installed:', manifest.name, 'v' + manifest.version);
                return { passed: true, message: `Extension installed: ${manifest.name} v${manifest.version}` };
            } else {
                console.log('❌ Extension not installed or not accessible');
                return { passed: false, message: 'Extension not installed or not accessible' };
            }
        } catch (error) {
            console.log('❌ Extension check failed:', error);
            return { passed: false, message: 'Extension check failed: ' + error.message };
        }
    },
    
    async testContentScriptLoaded() {
        console.log('🧪 Testing Content Script...');
        try {
            if (typeof PhishMailGuard !== 'undefined' && window.phishGuard) {
                console.log('✅ Content script loaded and initialized');
                return { passed: true, message: 'Content script loaded and PhishMailGuard instance found' };
            } else if (typeof PhishMailGuard !== 'undefined') {
                console.log('⚠️ Content script loaded but not initialized');
                return { passed: false, message: 'Content script loaded but PhishMailGuard not initialized' };
            } else {
                console.log('❌ Content script not loaded');
                return { passed: false, message: 'Content script not loaded' };
            }
        } catch (error) {
            console.log('❌ Content script test failed:', error);
            return { passed: false, message: 'Content script test failed: ' + error.message };
        }
    },
    
    async testAlertUILoaded() {
        console.log('🧪 Testing Alert UI System...');
        try {
            if (window.phishingAlertUI && typeof window.phishingAlertUI.showPhishingAlert === 'function') {
                console.log('✅ Alert UI system loaded');
                return { passed: true, message: 'PhishingAlertUI loaded and functional' };
            } else {
                console.log('❌ Alert UI system not loaded');
                return { passed: false, message: 'PhishingAlertUI not found or not functional' };
            }
        } catch (error) {
            console.log('❌ Alert UI test failed:', error);
            return { passed: false, message: 'Alert UI test failed: ' + error.message };
        }
    },
    
    async testBackendConnection() {
        console.log('🧪 Testing Backend Connection...');
        try {
            const response = await fetch('http://127.0.0.1:8000/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Backend connected:', data);
                return { passed: true, message: `Backend connected: ${data.status}` };
            } else {
                console.log('❌ Backend responded with error:', response.status);
                return { passed: false, message: `Backend error: HTTP ${response.status}` };
            }
        } catch (error) {
            console.log('❌ Backend connection failed:', error);
            return { passed: false, message: 'Backend connection failed: ' + error.message };
        }
    },
    
    async testEmailDetection() {
        console.log('🧪 Testing Email Detection...');
        try {
            const gmailSelectors = [
                '[data-message-id]', '.ii.gt .a3s.aiL', '.adn.ads .a3s.aiL',
                '.a3s[data-body]', '[data-thread-id] .a3s', '.gs .ii .a3s'
            ];
            
            let emailCount = 0;
            gmailSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                emailCount += elements.length;
            });
            
            if (emailCount > 0) {
                console.log(`✅ Found ${emailCount} email elements`);
                return { passed: true, message: `Found ${emailCount} email elements` };
            } else {
                console.log('❌ No email elements found');
                return { passed: false, message: 'No email elements found - may not be on Gmail or emails not loaded' };
            }
        } catch (error) {
            console.log('❌ Email detection test failed:', error);
            return { passed: false, message: 'Email detection test failed: ' + error.message };
        }
    },
    
    async testEmailAnalysis() {
        console.log('🧪 Testing Email Analysis...');
        try {
            const testEmail = "Dear Customer, Your PayPal account has been temporarily restricted due to suspicious activity. Click here to verify your account immediately: http://paypal-secure-verify.suspicious-domain.com/verify";
            
            const result = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    action: 'analyzeEmail',
                    emailContent: testEmail
                }, (response) => {
                    if (response) {
                        resolve(response);
                    } else {
                        reject(new Error('No response from background script'));
                    }
                });
            });
            
            if (result && !result.error) {
                console.log('✅ Email analysis successful:', result);
                return { passed: true, message: `Analysis successful: ${result.prediction}` };
            } else {
                console.log('❌ Email analysis failed:', result);
                return { passed: false, message: `Analysis failed: ${result?.message || 'Unknown error'}` };
            }
        } catch (error) {
            console.log('❌ Email analysis test failed:', error);
            return { passed: false, message: 'Email analysis test failed: ' + error.message };
        }
    },
    
    async testAlertDisplay() {
        console.log('🧪 Testing Alert Display...');
        try {
            if (!window.phishingAlertUI) {
                return { passed: false, message: 'Alert UI not available' };
            }
            
            // Test alert with mock data
            const mockResult = {
                prediction: 'Phishing Email',
                confidence: 0.95,
                phishing_confidence: 0.95,
                safe_confidence: 0.05,
                reasons: ['Test alert display', 'Debugging mode active']
            };
            
            window.phishingAlertUI.showPhishingAlert(mockResult);
            
            // Check if alert was created
            setTimeout(() => {
                const alertExists = document.querySelector('.phishing-alert-card');
                if (alertExists) {
                    console.log('✅ Alert displayed successfully');
                    // Clean up test alert
                    setTimeout(() => alertExists.remove(), 2000);
                } else {
                    console.log('❌ Alert not displayed');
                }
            }, 500);
            
            return { passed: true, message: 'Alert display test initiated - check for red alert popup' };
        } catch (error) {
            console.log('❌ Alert display test failed:', error);
            return { passed: false, message: 'Alert display test failed: ' + error.message };
        }
    },
    
    generateReport(results) {
        console.log('\n📋 PhishMail Guard Diagnostic Report');
        console.log('=====================================');
        console.log('🕐 Timestamp:', results.timestamp);
        console.log('🌐 URL:', results.url);
        console.log('\n📊 Test Results:');
        
        let passedTests = 0;
        let totalTests = 0;
        
        Object.entries(results.tests).forEach(([testName, result]) => {
            totalTests++;
            const status = result.passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${status} ${testName}: ${result.message}`);
            if (result.passed) passedTests++;
        });
        
        console.log('\n📈 Summary:');
        console.log(`Passed: ${passedTests}/${totalTests} tests`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Extension should be working correctly.');
        } else {
            console.log('⚠️  Some tests failed. Check the issues above.');
            this.generateTroubleshootingAdvice(results.tests);
        }
        
        window.PhishGuardDiagnosticResults = results;
    },
    
    generateTroubleshootingAdvice(tests) {
        console.log('\n🔧 Troubleshooting Advice:');
        
        if (!tests.extensionInstalled.passed) {
            console.log('• Extension not installed: Load the extension in Chrome extensions page');
        }
        
        if (!tests.contentScriptLoaded.passed) {
            console.log('• Content script issue: Reload the extension and refresh this page');
        }
        
        if (!tests.alertUILoaded.passed) {
            console.log('• Alert UI missing: Check if phishing-alert-ui.js is loaded in manifest');
        }
        
        if (!tests.backendConnected.passed) {
            console.log('• Backend issue: Start the backend server on http://127.0.0.1:8000');
        }
        
        if (!tests.emailDetection.passed) {
            console.log('• Email detection issue: Make sure you\'re on Gmail with emails loaded');
        }
        
        if (!tests.emailAnalysis.passed) {
            console.log('• Analysis issue: Check backend connection and logs');
        }
    },
    
    // Quick test functions
    testAlert() {
        console.log('🧪 Testing alert display...');
        if (window.phishingAlertUI) {
            window.phishingAlertUI.showPhishingAlert({
                prediction: 'Phishing Email',
                confidence: 0.9,
                phishing_confidence: 0.9,
                safe_confidence: 0.1,
                reasons: ['Test alert', 'Manual trigger from debugger']
            });
            console.log('✅ Test alert triggered');
        } else {
            console.log('❌ Alert UI not available');
        }
    },
    
    async testBackend() {
        console.log('🧪 Testing backend connection...');
        try {
            const response = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'Test email for PhishMail Guard debugging'
                })
            });
            
            const result = await response.json();
            console.log('✅ Backend test result:', result);
            return result;
        } catch (error) {
            console.log('❌ Backend test failed:', error);
            return null;
        }
    },
    
    forceEmailScan() {
        console.log('🧪 Forcing email scan...');
        if (window.phishGuard && typeof window.phishGuard.scanExistingEmails === 'function') {
            window.phishGuard.scanExistingEmails();
            console.log('✅ Email scan triggered');
        } else {
            console.log('❌ PhishGuard not available or scan function missing');
        }
    },
    
    showExtensionStatus() {
        console.log('📊 PhishMail Guard Status:');
        console.log('Extension installed:', typeof chrome !== 'undefined' && !!chrome.runtime);
        console.log('Content script loaded:', typeof PhishMailGuard !== 'undefined');
        console.log('PhishGuard instance:', !!window.phishGuard);
        console.log('Alert UI loaded:', !!window.phishingAlertUI);
        console.log('Current URL:', window.location.href);
        
        if (window.phishGuard) {
            console.log('PhishGuard enabled:', window.phishGuard.isEnabled);
            console.log('Notifications enabled:', window.phishGuard.showNotifications);
            console.log('Email provider:', window.phishGuard.emailProvider);
            console.log('Processed emails:', window.phishGuard.processedEmails.size);
        }
    }
};

// Quick access functions
window.debugExtension = () => window.PhishGuardDebugger.runFullDiagnostic();
window.testAlert = () => window.PhishGuardDebugger.testAlert();
window.testBackend = () => window.PhishGuardDebugger.testBackend();
window.scanEmails = () => window.PhishGuardDebugger.forceEmailScan();
window.extensionStatus = () => window.PhishGuardDebugger.showExtensionStatus();

console.log('✅ PhishMail Guard Debugger Loaded!');
console.log('📋 Available commands:');
console.log('  • debugExtension() - Run full diagnostic');
console.log('  • testAlert() - Test alert display');
console.log('  • testBackend() - Test backend connection');
console.log('  • scanEmails() - Force email scan');
console.log('  • extensionStatus() - Show current status');

// Auto-run basic status check
setTimeout(() => {
    console.log('\n🔍 Auto-running basic status check...');
    window.PhishGuardDebugger.showExtensionStatus();
}, 1000);