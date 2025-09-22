// Simplified PhishMail Guard Popup Script
class SimplePopupManager {
  constructor() {
    this.settings = {
      enabled: true,
      showWarnings: true
    };
    this.latestAnalysis = null;
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.checkCurrentTab();
    this.setupEventListeners();
    this.updateUI();
    
    // Listen for analysis updates from content script
    this.setupMessageListener();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['enabled', 'showNotifications']);
      this.settings.enabled = result.enabled !== false;
      this.settings.showWarnings = result.showNotifications !== false;
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({
        enabled: this.settings.enabled,
        showNotifications: this.settings.showWarnings
      });
    } catch (error) {
      console.error('Error saving settings:', error);
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
        
        document.getElementById('provider-name').textContent = provider;
        document.getElementById('scan-status').textContent = isSupported ? 'Ready to scan' : 'Not supported';
        
        const scanButton = document.getElementById('scan-button');
        scanButton.disabled = !isSupported;
        
        if (!isSupported) {
          scanButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Not Supported
          `;
        }
        
        // Try to get latest analysis from storage
        if (isSupported) {
          await this.loadLatestAnalysis();
        }
      }
    } catch (error) {
      console.error('Error checking current tab:', error);
    }
  }

  async loadLatestAnalysis() {
    try {
      const result = await chrome.storage.local.get(['latestAnalysis']);
      if (result.latestAnalysis) {
        this.latestAnalysis = result.latestAnalysis;
        this.displayAnalysis(this.latestAnalysis);
      }
    } catch (error) {
      console.error('Error loading latest analysis:', error);
    }
  }

  async saveLatestAnalysis(analysis) {
    try {
      await chrome.storage.local.set({ latestAnalysis: analysis });
    } catch (error) {
      console.error('Error saving latest analysis:', error);
    }
  }

  setupMessageListener() {
    // Listen for messages from content script about new analysis
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'analysisComplete') {
        this.latestAnalysis = message.result;
        this.displayAnalysis(message.result);
        this.saveLatestAnalysis(message.result);
      }
    });
  }

  displayAnalysis(result) {
    const analysisSection = document.getElementById('latest-analysis');
    const confidenceCircle = document.getElementById('confidence-circle');
    const confidencePercentage = document.getElementById('confidence-percentage');
    const confidenceLabel = document.getElementById('confidence-label');
    const reasonsList = document.getElementById('reasons-list');

    // Show the analysis section
    analysisSection.style.display = 'block';

    // Determine if it's phishing or safe
    const isPhishing = result.prediction === 'Phishing Email';
    const confidence = Math.round((result.confidence || 0) * 100);
    
    // Update confidence display
    confidencePercentage.textContent = `${confidence}%`;
    
    if (isPhishing) {
      confidenceLabel.textContent = 'Phishing Risk';
      confidenceCircle.classList.add('danger');
      confidenceCircle.classList.remove('safe');
    } else {
      confidenceLabel.textContent = 'Safe';
      confidenceCircle.classList.remove('danger');
      confidenceCircle.classList.add('safe');
    }

    // Update reasons
    reasonsList.innerHTML = '';
    if (result.reasons && result.reasons.length > 0) {
      result.reasons.forEach(reason => {
        const li = document.createElement('li');
        li.textContent = reason;
        reasonsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No specific reasons available';
      reasonsList.appendChild(li);
    }

    // Update scan status
    document.getElementById('scan-status').textContent = `Last scan: ${new Date().toLocaleTimeString()}`;
  }

  setupEventListeners() {
    // Settings toggles
    document.getElementById('extension-enabled').addEventListener('change', (e) => {
      this.settings.enabled = e.target.checked;
      this.saveSettings();
      this.updateStatus();
    });

    document.getElementById('show-warnings').addEventListener('change', (e) => {
      this.settings.showWarnings = e.target.checked;
      this.saveSettings();
    });

    // Scan button
    document.getElementById('scan-button').addEventListener('click', () => {
      this.scanCurrentPage();
    });
  }

  updateUI() {
    // Update settings UI
    document.getElementById('extension-enabled').checked = this.settings.enabled;
    document.getElementById('show-warnings').checked = this.settings.showWarnings;
  }

  updateStatus() {
    const scanStatus = document.getElementById('scan-status');
    if (this.settings.enabled) {
      scanStatus.textContent = 'Ready to scan';
    } else {
      scanStatus.textContent = 'Protection disabled';
    }
  }

  async scanCurrentPage() {
    const button = document.getElementById('scan-button');
    const originalContent = button.innerHTML;
    
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

      // Show success state
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        Scan Complete
      `;
      
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalContent;
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
        button.innerHTML = originalContent;
      }, 2000);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SimplePopupManager();
});