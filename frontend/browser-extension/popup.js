// PhishMail Guard Popup Script
class PopupManager {
  constructor() {
    this.settings = {};
    this.stats = {
      emailsScanned: 0,
      safeEmails: 0,
      phishingEmails: 0
    };
    this.isBackendOnline = false;
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadStats();
    await this.checkCurrentTab();
    await this.checkBackendStatus();
    
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'enabled',
        'realTimeAnalysis',
        'showNotifications',
        'confidenceThreshold'
      ]);
      
      this.settings = {
        enabled: result.enabled !== false,
        realTimeAnalysis: result.realTimeAnalysis !== false,
        showNotifications: result.showNotifications !== false,
        confidenceThreshold: result.confidenceThreshold || 0.7
      };
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async loadStats() {
    try {
      const result = await chrome.storage.local.get([
        'emailsScanned',
        'safeEmails',
        'phishingEmails'
      ]);
      
      this.stats = {
        emailsScanned: result.emailsScanned || 0,
        safeEmails: result.safeEmails || 0,
        phishingEmails: result.phishingEmails || 0
      };
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set(this.settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async saveStats() {
    try {
      await chrome.storage.local.set(this.stats);
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }

  async checkCurrentTab() {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      if (currentTab && currentTab.url) {
        const url = currentTab.url;
        let provider = 'Not on supported email provider';
        let isSupported = false;
        
        if (url.includes('mail.google.com')) {
          provider = 'Gmail';
          isSupported = true;
        } else if (url.includes('outlook.live.com') || url.includes('outlook.office.com')) {
          provider = 'Outlook';
          isSupported = true;
        } else if (url.includes('mail.yahoo.com')) {
          provider = 'Yahoo Mail';
          isSupported = true;
        }
        
        document.getElementById('tab-name').textContent = provider;
        
        if (isSupported) {
          // Get current tab's phishing count from badge
          const badge = await chrome.action.getBadgeText({ tabId: currentTab.id });
          const phishingCount = badge ? parseInt(badge) || 0 : 0;
          
          if (phishingCount > 0) {
            document.getElementById('phishing-count').style.display = 'flex';
            document.getElementById('count-badge').textContent = phishingCount;
          }
        }
        
        // Enable/disable scan button based on provider support
        const scanButton = document.getElementById('scan-page');
        scanButton.disabled = !isSupported;
        
        if (!isSupported) {
          scanButton.textContent = 'Not supported on this page';
        }
        
      }
    } catch (error) {
      console.error('Error checking current tab:', error);
    }
  }

  async checkBackendStatus() {
    const indicator = document.getElementById('backend-indicator');
    const text = document.getElementById('backend-text');
    
    indicator.className = 'backend-indicator checking';
    text.textContent = 'Checking backend...';
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test' }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok || response.status === 422) { // 422 is expected for test data
        this.isBackendOnline = true;
        indicator.className = 'backend-indicator';
        text.textContent = 'Backend server online';
      } else {
        throw new Error('Backend not responding correctly');
      }
    } catch (error) {
      this.isBackendOnline = false;
      indicator.className = 'backend-indicator offline';
      text.textContent = 'Backend server offline';
    }
  }

  setupEventListeners() {
    // Settings toggles
    document.getElementById('extension-enabled').addEventListener('change', (e) => {
      this.settings.enabled = e.target.checked;
      this.saveSettings();
      this.updateStatus();
    });

    document.getElementById('realtime-analysis').addEventListener('change', (e) => {
      this.settings.realTimeAnalysis = e.target.checked;
      this.saveSettings();
    });

    document.getElementById('show-notifications').addEventListener('change', (e) => {
      this.settings.showNotifications = e.target.checked;
      this.saveSettings();
    });

    // Confidence threshold slider
    const thresholdSlider = document.getElementById('confidence-threshold');
    const thresholdValue = document.getElementById('threshold-value');
    
    thresholdSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.settings.confidenceThreshold = value;
      thresholdValue.textContent = `${Math.round(value * 100)}%`;
      this.saveSettings();
    });

    // Action buttons
    document.getElementById('scan-page').addEventListener('click', () => {
      this.scanCurrentPage();
    });

    document.getElementById('clear-stats').addEventListener('click', () => {
      this.clearStats();
    });

    // Help and feedback links
    document.getElementById('help-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.showHelp();
    });

    document.getElementById('feedback-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.showFeedback();
    });
  }

  updateUI() {
    // Update settings UI
    document.getElementById('extension-enabled').checked = this.settings.enabled;
    document.getElementById('realtime-analysis').checked = this.settings.realTimeAnalysis;
    document.getElementById('show-notifications').checked = this.settings.showNotifications;
    document.getElementById('confidence-threshold').value = this.settings.confidenceThreshold;
    document.getElementById('threshold-value').textContent = `${Math.round(this.settings.confidenceThreshold * 100)}%`;

    // Update stats UI
    document.getElementById('emails-scanned').textContent = this.stats.emailsScanned;
    document.getElementById('safe-emails').textContent = this.stats.safeEmails;
    document.getElementById('phishing-emails').textContent = this.stats.phishingEmails;

    // Update status
    this.updateStatus();
  }

  updateStatus() {
    const indicator = document.getElementById('status-indicator');
    const text = document.getElementById('status-text');
    
    if (this.settings.enabled) {
      indicator.className = 'status-indicator';
      text.textContent = 'Protection Active';
    } else {
      indicator.className = 'status-indicator offline';
      text.textContent = 'Protection Disabled';
    }
  }

  async scanCurrentPage() {
    const button = document.getElementById('scan-page');
    const originalText = button.textContent;
    
    button.disabled = true;
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9,12 2,2 4,-4"/>
      </svg>
      Scanning...
    `;

    try {
      // Send message to content script to trigger manual scan
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      await chrome.tabs.sendMessage(currentTab.id, {
        action: 'manualScan'
      });

      // Show success message
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        Scan Complete
      `;
      
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
      }, 2000);

    } catch (error) {
      console.error('Error scanning page:', error);
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        Scan Failed
      `;
      
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
      }, 2000);
    }
  }

  async clearStats() {
    if (confirm('Are you sure you want to clear all statistics?')) {
      this.stats = {
        emailsScanned: 0,
        safeEmails: 0,
        phishingEmails: 0
      };
      
      await this.saveStats();
      this.updateUI();
      
      // Show success message
      const button = document.getElementById('clear-stats');
      const originalText = button.textContent;
      
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        Cleared
      `;
      
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1500);
    }
  }

  showHelp() {
    alert(`PhishMail Guard Help

How to use:
1. Navigate to Gmail, Outlook, or Yahoo Mail
2. The extension will automatically scan emails
3. Look for colored badges on emails:
   • Green: Safe email
   • Red: Potential phishing

Settings:
• Enable Protection: Turn extension on/off
• Real-time Analysis: Scan new emails automatically
• Show Warnings: Display phishing alerts
• Confidence Threshold: Minimum confidence for warnings

The extension badge shows the number of phishing emails detected on the current page.`);
  }

  showFeedback() {
    const email = 'mailto:support@phishmailguard.com?subject=PhishMail Guard Feedback';
    chrome.tabs.create({ url: email });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});