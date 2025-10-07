// Enhanced PhishMail Guard with Advanced Alert UI Integration
class PhishMailGuard {
  constructor() {
    this.processedEmails = new Set();
    this.phishingCount = 0;
    this.isEnabled = true;
    this.realTimeAnalysis = true;
    this.showNotifications = true;
    this.observer = null;
    this.emailProvider = this.detectEmailProvider();
    this.alertUI = null;
    
    this.init();
  }

  async init() {
    console.log('🛡️ PhishMail Guard starting initialization...');
    
    // Wait for Alert UI to be available
    await this.waitForAlertUI();
    
    // Load settings
    await this.loadSettings();
    
    console.log('✅ Settings loaded. Enabled:', this.isEnabled);
    
    if (!this.isEnabled) {
      console.log('❌ Extension disabled, exiting');
      return;
    }
    
    // Start monitoring emails
    this.startEmailMonitoring();
    
    console.log('🚀 PhishMail Guard initialized for', this.emailProvider);
  }
  
  async waitForAlertUI() {
    return new Promise((resolve) => {
      const checkForUI = () => {
        if (window.phishingAlertUI) {
          this.alertUI = window.phishingAlertUI;
          console.log('✅ Alert UI system loaded');
          resolve();
        } else {
          setTimeout(checkForUI, 100);
        }
      };
      checkForUI();
    });
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
    
    // Filter out duplicates and empty content (no badge checking needed)
    const validEmails = emails.filter(email => {
      if (!email || !email.textContent) return false;
      const content = email.textContent.trim();
      return content.length > 50 && !email.getAttribute('data-phishguard-analyzed');
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
    if (!emailElement || !this.isEnabled) {
      console.log('🙅 Skipping email processing - disabled or no element');
      return;
    }
    
    // Check if already analyzed to prevent duplicates
    if (emailElement.getAttribute('data-phishguard-analyzed') === 'true') {
      console.log('🔁 Email already analyzed, skipping');
      return;
    }
    
    const emailId = this.getEmailId(emailElement);
    if (!emailId || this.processedEmails.has(emailId)) {
      console.log('🔁 Email ID already processed, skipping');
      return;
    }
    
    this.processedEmails.add(emailId);
    
    const emailContent = this.extractEmailContent(emailElement);
    if (!emailContent || emailContent.length < 50) {
      console.log('⚠️ Email content too short or empty, skipping');
      return;
    }
    
    console.log('🔍 Processing email:', {
      emailId: emailId.substring(0, 20) + '...',
      contentLength: emailContent.length,
      provider: this.emailProvider
    });
    
    try {
      const result = await this.analyzeEmail(emailContent);
      
      if (result && !result.error) {
        console.log('✅ Email analysis successful:', result.prediction);
        this.displayResult(emailElement, result);
        
        // Send analysis result to popup
        this.sendAnalysisToPopup(result);
      } else {
        console.error('❌ Email analysis failed:', result?.message || 'Unknown error');
        // Show error notification
        this.showErrorNotification(result?.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('🚨 Error processing email:', error);
      this.showErrorNotification('Failed to analyze email: ' + error.message);
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

  removeAllVisualElements(emailElement) {
    // Remove any and all visual elements that might exist
    const elementsToRemove = emailElement.querySelectorAll('.phishguard-badge, .phishguard-loading, .phishguard-warning-overlay');
    elementsToRemove.forEach(el => el.remove());
    
    // Remove any classes that might add visual styling
    emailElement.classList.remove('phishguard-email-danger', 'phishguard-email-safe');
    
    // Remove any style attributes we might have added
    const styledElements = emailElement.querySelectorAll('[style*="phishguard"]');
    styledElements.forEach(el => {
      el.style.removeProperty('border-left');
      el.style.removeProperty('background');
    });
  }

  getAlertLevel(phishingPercentage) {
    if (phishingPercentage >= 80) {
      return {
        class: 'high-danger',
        icon: '⚠️',
        title: 'Phishing – High Danger',
        defaultReason: 'Multiple suspicious indicators detected'
      };
    } else if (phishingPercentage >= 60) {
      return {
        class: 'possible-phishing',
        icon: '⚠️',
        title: 'Possible Phishing – Be Aware',
        defaultReason: 'Several warning signs present'
      };
    } else if (phishingPercentage >= 5) {
      return {
        class: 'few-red-flags',
        icon: '🟡',
        title: 'Few Red Flags – Be Aware',
        defaultReason: 'Minor suspicious elements found'
      };
    } else {
      return {
        class: 'safe',
        icon: '✅',
        title: 'Safe – Very Low Risk of Phishing',
        defaultReason: 'No significant threats detected'
      };
    }
  }

  addEmailClickListener(emailElement, result) {
    // Add click listener to show analysis popup when email is clicked
    const clickHandler = (e) => {
      console.log('Email clicked, showing analysis popup');
      // Small delay to ensure email is opened/focused
      setTimeout(() => {
        this.showEmailAnalysisPopup(result, emailElement);
      }, 300);
    };
    
    // Find the best clickable element based on email provider
    let clickableElement = emailElement;
    
    switch (this.emailProvider) {
      case 'gmail':
        // For Gmail, find the message container or thread
        const gmailContainer = emailElement.closest('[data-message-id], .ii.gt, .adn.ads');
        if (gmailContainer) clickableElement = gmailContainer;
        break;
        
      case 'outlook':
        // For Outlook, find the conversation or message container
        const outlookContainer = emailElement.closest('[data-convid], [data-automation-id="messageBody"], .rps_');
        if (outlookContainer) clickableElement = outlookContainer;
        break;
        
      case 'yahoo':
        // For Yahoo, find the message container
        const yahooContainer = emailElement.closest('[data-test-id*="message"], .message');
        if (yahooContainer) clickableElement = yahooContainer;
        break;
    }
    
    // Add click listener with single-use flag to prevent multiple popups
    if (!clickableElement.hasAttribute('data-phishguard-click-listener')) {
      clickableElement.setAttribute('data-phishguard-click-listener', 'true');
      clickableElement.addEventListener('click', clickHandler, { capture: true });
      
      // Also add to the original email element as fallback
      if (clickableElement !== emailElement) {
        emailElement.addEventListener('click', clickHandler, { capture: true });
      }
    }
  }

  showEmailAnalysisPopup(result, emailElement) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.phishguard-alert-card');
    if (existingNotification) existingNotification.remove();
    
    // Only show notifications if enabled in settings
    if (!this.showNotifications) {
      console.log('Notifications disabled, skipping popup');
      return;
    }
    
    // Calculate phishing percentage (convert confidence to phishing risk %)
    const isPhishing = result.prediction === 'Phishing Email';
    let phishingPercentage;
    
    if (isPhishing) {
      // For phishing emails, use the phishing confidence
      phishingPercentage = (result.phishing_confidence || result.confidence || 0) * 100;
    } else {
      // For safe emails, use inverse of safe confidence as phishing risk
      const safeConfidence = result.safe_confidence || result.confidence || 0;
      phishingPercentage = (1 - safeConfidence) * 100;
    }
    
    // Determine alert level based on phishing percentage
    const alertLevel = this.getAlertLevel(phishingPercentage);
    
    // Create main alert card
    const alertCard = document.createElement('div');
    alertCard.className = `phishguard-alert-card ${alertLevel.class}`;
    alertCard.innerHTML = `
      <div class="phishguard-alert-header">
        <div class="phishguard-alert-icon">${alertLevel.icon}</div>
        <div class="phishguard-alert-content">
          <div class="phishguard-alert-title">${alertLevel.title}</div>
          <div class="phishguard-alert-percentage">${phishingPercentage.toFixed(1)}% Phishing Risk</div>
        </div>
        <button class="phishguard-alert-close">×</button>
      </div>
      <div class="phishguard-alert-summary">
        ${result.reasons && result.reasons.length > 0 
          ? result.reasons[0] 
          : alertLevel.defaultReason
        }
        ${result.reasons && result.reasons.length > 1 ? ` (+${result.reasons.length - 1} more details)` : ''}
      </div>
      <button class="phishguard-alert-expand">View Details ▼</button>
    `;
    
    // Store data for detailed popup
    alertCard.dataset.result = JSON.stringify(result);
    alertCard.dataset.phishingPercentage = phishingPercentage.toFixed(1);
    
    // Add alert card styles
    alertCard.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1);
      z-index: 999999;
      width: 380px;
      max-width: calc(100vw - 40px);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: phishguard-alert-slide-in 0.4s ease;
      overflow: hidden;
    `;
    
    // Add close functionality
    alertCard.querySelector('.phishguard-alert-close').addEventListener('click', () => {
      alertCard.style.animation = 'phishguard-alert-slide-out 0.3s ease';
      setTimeout(() => {
        if (alertCard.parentNode) alertCard.remove();
      }, 300);
    });
    
    // Add expand functionality for detailed popup
    alertCard.querySelector('.phishguard-alert-expand').addEventListener('click', () => {
      this.showDetailedPhishingPopup(result, phishingPercentage, alertLevel);
    });
    
    // Auto-close timing based on risk level
    const autoCloseDelay = phishingPercentage >= 60 ? 10000 : (phishingPercentage >= 5 ? 6000 : 4000);
    
    setTimeout(() => {
      if (alertCard.parentNode) {
        alertCard.style.animation = 'phishguard-alert-slide-out 0.3s ease';
        setTimeout(() => {
          if (alertCard.parentNode) alertCard.remove();
        }, 300);
      }
    }, autoCloseDelay);
    
    // Add to page
    document.body.appendChild(alertCard);
    
    // Also send browser system notification for high-risk phishing
    if (phishingPercentage >= 60) {
      this.showBrowserNotification(result);
    }
  }
    
    // Add notification styles with enhanced visibility for phishing
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 10px;
      box-shadow: ${isPhishing ? '0 15px 35px rgba(239, 68, 68, 0.3), 0 8px 15px rgba(0, 0, 0, 0.2)' : '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)'};
      z-index: 999999;
      width: 350px;
      max-width: calc(100vw - 40px);
      border-left: ${isPhishing ? '6px' : '4px'} solid ${isPhishing ? '#ef4444' : '#10b981'};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: ${isPhishing ? 'phishguard-notification-slide-in-urgent 0.5s ease' : 'phishguard-notification-slide-in 0.4s ease'};
      ${isPhishing ? 'border: 2px solid #ef4444;' : ''}
    `;
    
    // Add close functionality
    notification.querySelector('.phishguard-notification-close').addEventListener('click', () => {
      notification.style.animation = 'phishguard-notification-slide-out 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) notification.remove();
      }, 300);
    });
    
    // Auto-close timing: longer for phishing emails, shorter for safe emails
    const autoCloseDelay = isPhishing ? 8000 : 4000; // 8 seconds for phishing, 4 for safe
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'phishguard-notification-slide-out 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) notification.remove();
        }, 300);
      }
    }, autoCloseDelay);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Also send browser system notification for phishing emails
    if (isPhishing) {
      this.showBrowserNotification(result);
    }
  }

  displayResult(emailElement, result) {
    // Store result data invisibly for future reference
    emailElement.setAttribute('data-phishguard-result', JSON.stringify(result));
    emailElement.setAttribute('data-phishguard-analyzed', 'true');
    
    // Show advanced alert using new UI system
    if (this.alertUI && this.showNotifications) {
      console.log('🎨 Showing advanced phishing alert...');
      this.alertUI.showPhishingAlert(result, emailElement);
    } else if (this.showNotifications) {
      // Fallback to basic notification
      console.log('🔔 Showing fallback notification...');
      this.showBasicNotification(result);
    }
    
    // Update extension badge
    if (result.prediction === 'Phishing Email') {
      this.phishingCount++;
      this.updateBadge();
    }
    
    // Log result for debugging
    console.log('🛡️ PhishMail Guard analysis complete:', {
      prediction: result.prediction,
      confidence: result.confidence || result.phishing_confidence || 0,
      emailProvider: this.emailProvider
    });
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

  showDetailedPhishingPopup(result, phishingPercentage, alertLevel) {
    // Remove any existing detailed popup
    const existingPopup = document.querySelector('.phishguard-detailed-popup');
    if (existingPopup) existingPopup.remove();
    
    const safePercentage = 100 - phishingPercentage;
    
    // Create detailed popup overlay
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'phishguard-detailed-popup';
    popupOverlay.innerHTML = `
      <div class="phishguard-popup-backdrop"></div>
      <div class="phishguard-popup-container">
        <div class="phishguard-popup-header ${alertLevel.class}">
          <div class="phishguard-popup-icon">${alertLevel.icon}</div>
          <div class="phishguard-popup-title">
            <h3>${alertLevel.title}</h3>
            <p>Detailed Risk Analysis</p>
          </div>
          <button class="phishguard-popup-close">×</button>
        </div>
        
        <div class="phishguard-popup-body">
          <div class="phishguard-risk-chart">
            <h4>Risk Assessment</h4>
            <div class="phishguard-risk-bars">
              <div class="phishguard-risk-bar">
                <label>Phishing Risk</label>
                <div class="phishguard-progress-container">
                  <div class="phishguard-progress-bar phishing" style="width: ${phishingPercentage}%"></div>
                  <span class="phishguard-progress-text">${phishingPercentage.toFixed(1)}%</span>
                </div>
              </div>
              <div class="phishguard-risk-bar">
                <label>Safety Score</label>
                <div class="phishguard-progress-container">
                  <div class="phishguard-progress-bar safe" style="width: ${safePercentage}%"></div>
                  <span class="phishguard-progress-text">${safePercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="phishguard-reasons-section">
            <h4>Detection Reasons</h4>
            <ul class="phishguard-detailed-reasons">
              ${this.generateDetailedReasons(result, phishingPercentage)}
            </ul>
          </div>
          
          <div class="phishguard-recommendations">
            <h4>Recommendations</h4>
            <div class="phishguard-recommendation-text">
              ${this.getRecommendationText(phishingPercentage)}
            </div>
          </div>
        </div>
        
        <div class="phishguard-popup-actions">
          <button class="phishguard-action-btn ignore">Ignore</button>
          <button class="phishguard-action-btn report">Report</button>
          <button class="phishguard-action-btn block">Block</button>
        </div>
      </div>
    `;
    
    // Add popup styles
    popupOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: phishguard-popup-fade-in 0.3s ease;
    `;
    
    // Add event listeners
    popupOverlay.querySelector('.phishguard-popup-close').addEventListener('click', () => {
      popupOverlay.remove();
    });
    
    popupOverlay.querySelector('.phishguard-popup-backdrop').addEventListener('click', () => {
      popupOverlay.remove();
    });
    
    // Action button handlers
    popupOverlay.querySelector('.ignore').addEventListener('click', () => {
      console.log('User ignored the phishing alert');
      popupOverlay.remove();
    });
    
    popupOverlay.querySelector('.report').addEventListener('click', () => {
      console.log('User reported the phishing attempt');
      // Here you could send report to backend
      alert('Thank you for reporting this phishing attempt!');
      popupOverlay.remove();
    });
    
    popupOverlay.querySelector('.block').addEventListener('click', () => {
      console.log('User chose to block this email');
      // Here you could add blocking functionality
      alert('This email has been marked as blocked.');
      popupOverlay.remove();
    });
    
    document.body.appendChild(popupOverlay);
  }
  
  generateDetailedReasons(result, phishingPercentage) {
    const reasons = [];
    
    // Add reasons based on the result data
    if (result.reasons && result.reasons.length > 0) {
      result.reasons.forEach(reason => {
        reasons.push(`<li><strong>Suspicious Content:</strong> ${reason}</li>`);
      });
    }
    
    // Add additional detailed reasons based on phishing percentage
    if (phishingPercentage >= 80) {
      reasons.push(`<li><strong>High Risk Indicators:</strong> Multiple severe phishing patterns detected</li>`);
      reasons.push(`<li><strong>Confidence Level:</strong> Very high certainty of phishing attempt</li>`);
    } else if (phishingPercentage >= 60) {
      reasons.push(`<li><strong>Warning Signs:</strong> Several suspicious elements identified</li>`);
      reasons.push(`<li><strong>Caution Advised:</strong> Moderate risk of phishing activity</li>`);
    } else if (phishingPercentage >= 5) {
      reasons.push(`<li><strong>Minor Flags:</strong> Some potentially suspicious characteristics</li>`);
      reasons.push(`<li><strong>Low Risk:</strong> Minimal threat indicators present</li>`);
    } else {
      reasons.push(`<li><strong>Clean Analysis:</strong> No significant suspicious patterns detected</li>`);
      reasons.push(`<li><strong>Low Risk:</strong> Email appears legitimate and safe</li>`);
    }
    
    return reasons.join('');
  }
  
  getRecommendationText(phishingPercentage) {
    if (phishingPercentage >= 80) {
      return `<strong style="color: #dc2626;">HIGH DANGER:</strong> Do not click any links or download attachments. This email shows strong indicators of a phishing attempt. Consider deleting immediately.`;
    } else if (phishingPercentage >= 60) {
      return `<strong style="color: #f59e0b;">BE CAUTIOUS:</strong> Exercise extreme caution with this email. Verify sender authenticity before taking any action. Avoid clicking suspicious links.`;
    } else if (phishingPercentage >= 5) {
      return `<strong style="color: #f59e0b;">STAY ALERT:</strong> While risk is lower, remain vigilant. Double-check sender identity and be cautious with links or attachments.`;
    } else {
      return `<strong style="color: #059669;">LOW RISK:</strong> This email appears safe, but always exercise general email safety practices.`;
    }
  }

  showBasicNotification(result) {
    const isPhishing = result.prediction === 'Phishing Email';
    const confidence = result.phishing_confidence || result.confidence || 0;
    const phishingPercentage = isPhishing ? (confidence * 100) : ((1 - confidence) * 100);
    
    // Create simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999999;
      background: ${isPhishing ? '#fef2f2' : '#f0fdf4'};
      border: 2px solid ${isPhishing ? '#dc2626' : '#059669'};
      border-radius: 12px;
      padding: 16px;
      max-width: 350px;
      font-family: system-ui;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        <div style="font-size: 24px;">${isPhishing ? '⚠️' : '✅'}</div>
        <div>
          <div style="font-weight: bold; color: ${isPhishing ? '#dc2626' : '#059669'};">
            ${isPhishing ? 'Phishing Email Detected' : 'Email is Safe'}
          </div>
          <div style="font-size: 13px; color: #666;">
            ${phishingPercentage.toFixed(1)}% Phishing Risk
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; font-size: 18px; cursor: pointer; margin-left: auto;">
          ×
        </button>
      </div>
      <div style="font-size: 13px; color: #555;">
        ${result.reasons && result.reasons[0] ? result.reasons[0] : 'Analysis complete'}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, isPhishing ? 8000 : 4000);
  }
  
  showErrorNotification(message) {
    console.log('🚨 Showing error notification:', message);
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999999;
      background: #fef2f2;
      border: 2px solid #ef4444;
      border-radius: 12px;
      padding: 16px;
      max-width: 350px;
      font-family: system-ui;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        <div style="font-size: 24px;">🚨</div>
        <div>
          <div style="font-weight: bold; color: #ef4444;">
            PhishMail Guard Error
          </div>
          <div style="font-size: 13px; color: #666;">
            Scan Failed
          </div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; font-size: 18px; cursor: pointer; margin-left: auto;">
          ×
        </button>
      </div>
      <div style="font-size: 13px; color: #555;">
        ${message}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 6000);
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
    document.querySelectorAll('.phishguard-badge, .phishguard-loading, .phishguard-warning-overlay, .phishguard-email-popup, .phishguard-notification').forEach(el => {
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