// Enhanced Content Script with Dropdown Phishing Alert UI
// This script integrates the dropdown UI with your existing phishing detection system

// Load the dropdown phishing alert UI first
(function() {
    'use strict';
    
    // Check if we're on a supported email provider
    const isEmailProvider = () => {
        const hostname = window.location.hostname;
        return hostname.includes('mail.google.com') || 
               hostname.includes('outlook.live.com') || 
               hostname.includes('outlook.office.com') ||
               hostname.includes('mail.yahoo.com');
    };
    
    if (!isEmailProvider()) {
        console.log('PhishMail Guard: Not on supported email provider');
        return;
    }
    
    // Load the dropdown UI script
    const dropdownScript = document.createElement('script');
    dropdownScript.src = chrome.runtime.getURL('phishing-alert-dropdown.js');
    dropdownScript.onload = function() {
        console.log('Dropdown Phishing Alert UI loaded');
        initializePhishingDetection();
    };
    document.head.appendChild(dropdownScript);
    
    // Enhanced phishing detection with dropdown alerts
    function initializePhishingDetection() {
        console.log('PhishMail Guard: Initializing with dropdown alerts...');
        
        // Email detection and analysis function
        async function analyzeEmail(emailElement) {
            const emailText = extractEmailText(emailElement);
            
            if (!emailText || emailText.trim().length < 50) {
                return null;
            }
            
            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email_text: emailText })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('Analysis result:', result);
                
                // Mark element as analyzed
                emailElement.setAttribute('data-phishguard-analyzed', 'true');
                emailElement.setAttribute('data-phishguard-result', JSON.stringify(result));
                
                // Show dropdown alert
                if (window.phishingAlertDropdownUI) {
                    window.phishingAlertDropdownUI.showPhishingAlert(result, emailElement);
                }
                
                // Send message to popup about analysis completion
                chrome.runtime.sendMessage({
                    action: 'analysisComplete',
                    result: result,
                    emailText: emailText.substring(0, 200) + '...'
                }).catch(() => {
                    // Ignore errors if popup is not open
                });
                
                return result;
                
            } catch (error) {
                console.error('Error analyzing email:', error);
                return null;
            }
        }
        
        // Extract email text from element
        function extractEmailText(element) {
            // Create a clone to avoid modifying the original
            const clone = element.cloneNode(true);
            
            // Remove scripts and styles
            clone.querySelectorAll('script, style, noscript').forEach(el => el.remove());
            
            // Get text content
            const text = clone.textContent || clone.innerText || '';
            return text.replace(/\s+/g, ' ').trim();
        }
        
        // Enhanced email detection for different providers
        function detectEmailElements() {
            let emails = [];
            
            if (window.location.hostname.includes('mail.google.com')) {
                // Gmail specific selectors
                emails = Array.from(document.querySelectorAll('[role="main"] [data-message-id], .ii.gt div[dir="ltr"]')).filter(el => {
                    return el.textContent && el.textContent.trim().length > 50 && !el.hasAttribute('data-phishguard-analyzed');
                });
            } else if (window.location.hostname.includes('outlook')) {
                // Outlook specific selectors
                emails = Array.from(document.querySelectorAll('[role="main"] [aria-label*="message"], .rps_dd8e .allowTextSelection')).filter(el => {
                    return el.textContent && el.textContent.trim().length > 50 && !el.hasAttribute('data-phishguard-analyzed');
                });
            } else if (window.location.hostname.includes('mail.yahoo.com')) {
                // Yahoo Mail specific selectors
                emails = Array.from(document.querySelectorAll('[data-test-id="message-view-body-content"], .message-body')).filter(el => {
                    return el.textContent && el.textContent.trim().length > 50 && !el.hasAttribute('data-phishguard-analyzed');
                });
            }
            
            return emails.slice(0, 3); // Limit to 3 emails at a time
        }
        
        // Analyze detected emails
        async function analyzeDetectedEmails() {
            const emailElements = detectEmailElements();
            
            if (emailElements.length > 0) {
                console.log(`Found ${emailElements.length} new email(s) to analyze`);
                
                for (const emailElement of emailElements) {
                    await analyzeEmail(emailElement);
                    // Add small delay between analyses
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        }
        
        // Set up observers and periodic checks
        let analysisTimeout;
        
        function scheduleAnalysis() {
            clearTimeout(analysisTimeout);
            analysisTimeout = setTimeout(analyzeDetectedEmails, 1000);
        }
        
        // Listen for DOM changes
        const observer = new MutationObserver((mutations) => {
            let shouldAnalyze = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldAnalyze = true;
                }
            });
            
            if (shouldAnalyze) {
                scheduleAnalysis();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Initial analysis
        scheduleAnalysis();
        
        // Listen for manual scan requests from popup
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'manualScan') {
                console.log('Manual scan requested');
                analyzeDetectedEmails().then(() => {
                    sendResponse({ success: true });
                }).catch(error => {
                    console.error('Manual scan failed:', error);
                    sendResponse({ success: false, error: error.message });
                });
                return true; // Will respond asynchronously
            }
        });
        
        console.log('PhishMail Guard: Dropdown alert system ready');
        
        // Test function (remove in production)
        window.testDropdownAlert = function() {
            if (window.phishingAlertDropdownUI) {
                window.phishingAlertDropdownUI.testDropdownAlert();
            }
        };
    }
    
})();