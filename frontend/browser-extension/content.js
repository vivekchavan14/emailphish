// Content script for PhishMail Guard
class PhishMailGuard {
  constructor() {
    this.processedEmails = new Set();
    this.phishingCount = 0;
    this.isEnabled = true;
    this.realTimeAnalysis = true;
    this.observer = null;
    this.emailProvider = this.detectEmailProvider();
    
    this.init();
  }

  async init() {
    console.log('PhishMail Guard starting initialization...');
    
    // Load settings
    await this.loadSettings();
    
    console.log('Settings loaded. Enabled:', this.isEnabled);
    
    if (!this.isEnabled) {
      console.log('Extension disabled, exiting');
      return;
    }
    
    // Start monitoring emails
    this.startEmailMonitoring();
    
    console.log('PhishMail Guard initialized for', this.emailProvider);
  }

  async loadSettings() {
    try {
      const settings = await chrome.storage.sync.get([
        'enabled',
        'realTimeAnalysis',
        'showNotifications',
        'confidenceThreshold'
      ]);
      
      this.isEnabled = settings.enabled !== false;
      this.realTimeAnalysis = settings.realTimeAnalysis !== false;
      this.showNotifications = settings.showNotifications !== false;
      this.confidenceThreshold = settings.confidenceThreshold || 0.7;
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  detectEmailProvider() {
    const hostname = window.location.hostname;
    if (hostname.includes('mail.google.com')) return 'gmail';
    if (hostname.includes('outlook.live.com') || hostname.includes('outlook.office.com')) return 'outlook';
    if (hostname.includes('mail.yahoo.com')) return 'yahoo';
    return 'unknown';
  }

  startEmailMonitoring() {
    console.log('Starting email monitoring...');
    
    // Initial scan with delay to ensure DOM is ready
    setTimeout(() => {
      this.scanExistingEmails();
    }, 1000);
    
    // Set up mutation observer for real-time monitoring
    this.observer = new MutationObserver((mutations) => {
      if (!this.realTimeAnalysis) return;
      
      let shouldProcess = false;
      
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node contains email content
            if (this.containsEmailContent(node)) {
              shouldProcess = true;
            }
          }
        });
      });
      
      // Debounce processing to avoid excessive API calls
      if (shouldProcess) {
        clearTimeout(this.processingTimeout);
        this.processingTimeout = setTimeout(() => {
          console.log('Processing new emails detected by mutation observer');
          this.scanExistingEmails(); // Rescan all to catch any new emails
        }, 500);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    // Periodic scan as backup
    this.periodicScanInterval = setInterval(() => {
      if (this.realTimeAnalysis) {
        console.log('Periodic email scan...');
        this.scanExistingEmails();
      }
    }, 30000); // Every 30 seconds
  }

  containsEmailContent(node) {
    // Check if the node or its children contain email-related selectors
    const emailSelectors = [
      '[data-message-id]', '.a3s', '[data-convid]', '[data-test-id*="message"]',
      '.message-content', '.rps_', '[data-automation-id*="message"]'
    ];
    
    return emailSelectors.some(selector => {
      return node.matches && node.matches(selector) || node.querySelector && node.querySelector(selector);
    });
  }

  scanExistingEmails() {
    console.log('Scanning existing emails...');
    const emails = this.findEmails();
    console.log(`Found ${emails.length} emails to process`);
    
    emails.forEach((email, index) => {
      setTimeout(() => {
        this.processEmail(email);
      }, index * 100); // Stagger processing to avoid overwhelming the API
    });
  }

  processNewEmails(node) {
    const emails = this.findEmails(node);
    emails.forEach(email => this.processEmail(email));
  }

  findEmails(container = document) {
    let emails = [];
    
    switch (this.emailProvider) {
      case 'gmail':
        // Gmail email selectors - updated for 2024
        emails = Array.from(container.querySelectorAll([
          '[data-message-id]',
          '.ii.gt .a3s.aiL',
          '.adn.ads .a3s.aiL',
          '.a3s[data-body]',
          '[data-thread-id] .a3s',
          '.gs .ii .a3s',
          '.hP .a3s'
        ].join(',')));
        break;
        
      case 'outlook':
        // Outlook email selectors - updated
        emails = Array.from(container.querySelectorAll([
          '[data-convid]',
          '.rps_2bc8',
          '.rps_1f43',
          '[data-automation-id="messageBody"]',
          '.rps_c071',
          '.UnreadMarkerContainer',
          '[role="main"] [data-automation-id]'
        ].join(',')));
        break;
        
      case 'yahoo':
        // Yahoo Mail email selectors - updated
        emails = Array.from(container.querySelectorAll([
          '[data-test-id="message-view-body"]',
          '.message-content',
          '[data-test-id="message-content"]',
          '.D_F.ek9p7qsU',
          '.message-body'
        ].join(',')));
        break;
    }
    
    // Filter out duplicates and empty content
    const validEmails = emails.filter(email => {
      if (!email || !email.textContent) return false;
      const content = email.textContent.trim();
      return content.length > 50 && !email.querySelector('.phishguard-badge');
    });
    
    // Remove duplicates based on content hash
    const seen = new Set();
    return validEmails.filter(email => {
      const contentHash = email.textContent.substring(0, 200);
      if (seen.has(contentHash)) return false;
      seen.add(contentHash);
      return true;
    });
  }

  async processEmail(emailElement) {
    if (!emailElement || !this.isEnabled) return;
    
    // Check if already has a badge to prevent duplicates
    if (emailElement.querySelector('.phishguard-badge')) return;
    
    const emailId = this.getEmailId(emailElement);
    if (!emailId || this.processedEmails.has(emailId)) return;
    
    this.processedEmails.add(emailId);
    
    const emailContent = this.extractEmailContent(emailElement);
    if (!emailContent || emailContent.length < 50) return;
    
    // Add loading indicator
    this.addLoadingIndicator(emailElement);
    
    try {
      const result = await this.analyzeEmail(emailContent);
      this.displayResult(emailElement, result);
      
      // Send analysis result to popup
      this.sendAnalysisToPopup(result);
      
      if (result.prediction === 'Phishing Email') {
        this.phishingCount++;
        this.updateBadge();
        
        // Show warning for phishing emails - use phishing confidence
        const phishingConfidence = result.phishing_confidence || result.confidence || 0;
        if (this.showNotifications && phishingConfidence > this.confidenceThreshold) {
          console.log(`Showing phishing warning - phishing confidence: ${phishingConfidence}, threshold: ${this.confidenceThreshold}`);
          this.showPhishingWarning(emailElement, result);
        } else {
          console.log(`Phishing warning suppressed - notifications: ${this.showNotifications}, confidence: ${phishingConfidence}, threshold: ${this.confidenceThreshold}`);
        }
      }
    } catch (error) {
      console.error('Error processing email:', error);
      this.removeLoadingIndicator(emailElement);
    }
  }

  getEmailId(emailElement) {
    // Try to get unique identifier for the email
    return emailElement.getAttribute('data-message-id') ||
           emailElement.getAttribute('data-convid') ||
           emailElement.getAttribute('data-test-id') ||
           emailElement.textContent.substring(0, 100).replace(/\s/g, '');
  }

  extractEmailContent(emailElement) {
    // Extract text content, clean up formatting
    let content = emailElement.textContent || emailElement.innerText || '';
    
    // Remove excessive whitespace and newlines
    content = content.replace(/\s+/g, ' ').trim();
    
    // Limit content length for API efficiency
    if (content.length > 2000) {
      content = content.substring(0, 2000);
    }
    
    return content;
  }

  async analyzeEmail(emailContent) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'analyzeEmail',
        emailContent: emailContent
      }, (response) => {
        resolve(response);
      });
    });
  }

  addLoadingIndicator(emailElement) {
    const indicator = document.createElement('div');
    indicator.className = 'phishguard-loading';
    indicator.innerHTML = `
      <div class="phishguard-spinner"></div>
      <span>Analyzing...</span>
    `;
    
    emailElement.insertBefore(indicator, emailElement.firstChild);
  }

  removeLoadingIndicator(emailElement) {
    const indicator = emailElement.querySelector('.phishguard-loading');
    if (indicator) indicator.remove();
  }

  displayResult(emailElement, result) {
    this.removeLoadingIndicator(emailElement);
    
    // Remove any existing badges to prevent duplicates
    const existingBadges = emailElement.querySelectorAll('.phishguard-badge');
    existingBadges.forEach(badge => badge.remove());
    
    const isPhishing = result.prediction === 'Phishing Email';
    const confidence = result.confidence || 0;
    
    // Create compact result badge with correct confidence display
    const badge = document.createElement('div');
    badge.className = `phishguard-badge ${isPhishing ? 'phishguard-danger' : 'phishguard-safe'}`;
    
    // Use the correct confidence values
    const displayConfidence = isPhishing ? 
      (result.phishing_confidence || result.confidence || 0) : 
      (result.safe_confidence || result.confidence || 0);
    
    badge.innerHTML = `
      <span class="phishguard-icon">${isPhishing ? '🚨' : '✓'}</span>
      <span class="phishguard-status">${isPhishing ? 'Phishing' : 'Safe'}</span>
      <span class="phishguard-confidence">${(displayConfidence * 100).toFixed(0)}%</span>
    `;
    
    // Add click handler to show details
    badge.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showDetailedResults(result);
    });
    
    // Create wrapper to prevent layout disruption
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative; clear: both;';
    wrapper.appendChild(badge);
    
    // Insert badge wrapper at the top of email
    emailElement.insertBefore(wrapper, emailElement.firstChild);
    
    // Add subtle border highlighting
    emailElement.classList.add(isPhishing ? 'phishguard-email-danger' : 'phishguard-email-safe');
  }

  showPhishingWarning(emailElement, result) {
    // Remove any existing warnings
    const existingWarnings = emailElement.querySelectorAll('.phishguard-warning-overlay');
    existingWarnings.forEach(w => w.remove());
    
    // Create prominent warning overlay
    const warning = document.createElement('div');
    warning.className = 'phishguard-warning-overlay';
    warning.innerHTML = `
      <div class="phishguard-warning-content">
        <div class="phishguard-warning-icon">🚨</div>
        <div class="phishguard-warning-text">
          <h3>PHISHING EMAIL DETECTED</h3>
          <p>This email has been flagged as a potential phishing attempt with ${((result.phishing_confidence || result.confidence || 0) * 100).toFixed(1)}% confidence.</p>
          <p><strong>Do not click any links or download attachments.</strong></p>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="phishguard-dismiss-btn">I Understand</button>
            <button class="phishguard-dismiss-btn" style="background: #6b7280;" onclick="this.parentElement.parentElement.parentElement.parentElement.remove();">Hide Warning</button>
          </div>
        </div>
      </div>
    `;
    
    // Add dismiss functionality
    warning.querySelector('.phishguard-dismiss-btn').addEventListener('click', () => {
      warning.style.display = 'none';
    });
    
    // Insert warning prominently
    emailElement.insertBefore(warning, emailElement.firstChild);
    
    // Also show a browser notification if possible
    this.showBrowserNotification(result);
  }

  sendAnalysisToPopup(result) {
    // Send analysis result to popup for display
    try {
      chrome.runtime.sendMessage({
        action: 'analysisComplete',
        result: result
      });
    } catch (error) {
      console.log('Could not send analysis to popup (popup may be closed):', error);
    }
  }

  showBrowserNotification(result) {
    // Send message to background script to show notification
    const confidence = result.phishing_confidence || result.confidence || 0;
    chrome.runtime.sendMessage({
      action: 'showNotification',
      title: 'Phishing Email Detected',
      message: `A phishing email has been detected with ${(confidence * 100).toFixed(1)}% confidence.`,
      confidence: confidence
    });
  }

  showDetailedResults(result) {
    // Create detailed popup with analysis results
    const popup = document.createElement('div');
    popup.className = 'phishguard-popup-overlay';
    popup.innerHTML = `
      <div class="phishguard-popup">
        <div class="phishguard-popup-header">
          <h3>Email Analysis Results</h3>
          <button class="phishguard-close-btn">×</button>
        </div>
        <div class="phishguard-popup-content">
          <div class="phishguard-result-item">
            <label>Prediction:</label>
            <span class="${result.prediction === 'Phishing Email' ? 'danger' : 'safe'}">
              ${result.prediction}
            </span>
          </div>
          <div class="phishguard-result-item">
            <label>Confidence:</label>
            <span>${(result.confidence * 100).toFixed(1)}%</span>
          </div>
          ${result.error ? `
            <div class="phishguard-result-item error">
              <label>Error:</label>
              <span>${result.message}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    popup.querySelector('.phishguard-close-btn').addEventListener('click', () => {
      popup.remove();
    });
    
    popup.addEventListener('click', (e) => {
      if (e.target === popup) popup.remove();
    });
    
    document.body.appendChild(popup);
  }

  updateBadge() {
    chrome.runtime.sendMessage({
      action: 'updateBadge',
      phishingCount: this.phishingCount
    });
  }

  destroy() {
    console.log('Destroying PhishMail Guard...');
    
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Clear timeouts and intervals
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
    }
    
    if (this.periodicScanInterval) {
      clearInterval(this.periodicScanInterval);
    }
    
    // Clean up elements
    document.querySelectorAll('.phishguard-badge, .phishguard-loading, .phishguard-warning-overlay').forEach(el => {
      el.remove();
    });
    
    // Remove classes
    document.querySelectorAll('.phishguard-email-danger, .phishguard-email-safe').forEach(el => {
      el.classList.remove('phishguard-email-danger', 'phishguard-email-safe');
    });
  }
}

// Initialize extension
let phishGuard = null;

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      phishGuard = new PhishMailGuard();
    }, 2000); // Wait for email client to load
  });
} else {
  setTimeout(() => {
    phishGuard = new PhishMailGuard();
  }, 2000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'manualScan' && phishGuard) {
    console.log('Manual scan requested');
    phishGuard.scanExistingEmails();
    sendResponse({ success: true });
    return true;
  }
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && phishGuard) {
    phishGuard.loadSettings();
  }
});

// Clean up on unload
window.addEventListener('beforeunload', () => {
  if (phishGuard) {
    phishGuard.destroy();
  }
});