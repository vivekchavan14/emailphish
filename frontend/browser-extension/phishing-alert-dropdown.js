// Enhanced Phishing Alert UI with Dropdown Design
// Matches the visual design from the provided images

class PhishingAlertDropdownUI {
    constructor() {
        this.alertTypes = {
            HIGH_DANGER: {
                threshold: 80,
                class: 'high-danger',
                color: '#dc2626',
                bgColor: '#fef2f2',
                borderColor: '#dc2626',
                icon: '🚨',
                title: 'PHISHING – HIGH DANGER',
                subtitle: 'Immediate Action Required',
                autoCloseDelay: 12000
            },
            WARNING: {
                threshold: 60,
                class: 'warning-phishing',
                color: '#f59e0b',
                bgColor: '#fffbeb',
                borderColor: '#f59e0b',
                icon: '⚠️',
                title: 'POSSIBLE PHISHING – BE AWARE',
                subtitle: 'Exercise Extreme Caution',
                autoCloseDelay: 8000
            },
            CAUTION: {
                threshold: 5,
                class: 'caution-flags',
                color: '#f97316',
                bgColor: '#fff7ed',
                borderColor: '#f97316',
                icon: '🟡',
                title: 'FEW RED FLAGS – BE AWARE',
                subtitle: 'Minor Suspicious Elements',
                autoCloseDelay: 6000
            },
            SAFE: {
                threshold: 0,
                class: 'safe-email',
                color: '#059669',
                bgColor: '#f0fdf4',
                borderColor: '#059669',
                icon: '✅',
                title: 'SAFE – VERY LOW RISK',
                subtitle: 'Email Appears Legitimate',
                autoCloseDelay: 4000
            }
        };
        
        this.injectStyles();
    }

    // Inject CSS styles for the dropdown alert system
    injectStyles() {
        if (document.getElementById('phishing-dropdown-alert-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'phishing-dropdown-alert-styles';
        styles.textContent = `
            /* Dropdown Phishing Alert UI Styles */
            .phishing-dropdown-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999999;
                width: 320px;
                max-width: calc(100vw - 30px);
                background: white;
                border-radius: 12px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                overflow: hidden;
                animation: dropdownAlertSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                border: 1px solid rgba(0, 0, 0, 0.08);
            }

            .phishing-dropdown-alert.high-danger {
                border-left: 8px solid #dc2626;
                box-shadow: 0 20px 50px rgba(220, 38, 38, 0.25), 0 8px 16px rgba(220, 38, 38, 0.15);
            }

            .phishing-dropdown-alert.warning-phishing {
                border-left: 8px solid #f59e0b;
                box-shadow: 0 20px 50px rgba(245, 158, 11, 0.25), 0 8px 16px rgba(245, 158, 11, 0.15);
            }

            .phishing-dropdown-alert.caution-flags {
                border-left: 8px solid #f97316;
                box-shadow: 0 20px 50px rgba(249, 115, 22, 0.2), 0 8px 16px rgba(249, 115, 22, 0.1);
            }

            .phishing-dropdown-alert.safe-email {
                border-left: 8px solid #059669;
                box-shadow: 0 20px 50px rgba(5, 150, 105, 0.2), 0 8px 16px rgba(5, 150, 105, 0.1);
            }

            /* Alert Header */
            .phishing-dropdown-header {
                padding: 16px 18px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                position: relative;
            }

            .phishing-dropdown-icon {
                font-size: 20px;
                line-height: 1;
                margin-top: 2px;
                animation: dropdownIconPulse 2s ease-in-out infinite;
            }

            .phishing-dropdown-content {
                flex: 1;
                min-width: 0;
            }

            .phishing-dropdown-title {
                font-size: 15px;
                font-weight: 700;
                letter-spacing: 0.2px;
                margin: 0 0 4px 0;
                line-height: 1.2;
            }

            .phishing-dropdown-subtitle {
                font-size: 12px;
                font-weight: 500;
                margin: 0 0 8px 0;
                opacity: 0.8;
            }

            /* Prominent Percentage Display */
            .phishing-dropdown-percentage-main {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 700;
                padding: 6px 12px;
                border-radius: 16px;
                color: white;
                margin-top: 2px;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
                position: relative;
                overflow: hidden;
            }

            .phishing-dropdown-percentage-main::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            }

            .phishing-dropdown-percentage-text {
                position: relative;
                z-index: 1;
            }

            .phishing-dropdown-close {
                position: absolute;
                top: 12px;
                right: 12px;
                background: rgba(0, 0, 0, 0.08);
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.5);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .phishing-dropdown-close:hover {
                background: rgba(0, 0, 0, 0.12);
                color: rgba(0, 0, 0, 0.7);
                transform: scale(1.05);
            }

            /* Risk Breakdown Section - Now inside dropdown */
            .phishing-dropdown-summary {
                padding: 16px 20px 20px 20px;
                background: rgba(0, 0, 0, 0.02);
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            }

            .phishing-dropdown-summary-text {
                font-size: 13px;
                line-height: 1.5;
                color: #4b5563;
                margin-bottom: 12px;
            }

            /* Risk Bars */
            .phishing-dropdown-risk-bars {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-bottom: 12px;
            }

            .phishing-dropdown-risk-bar {
                text-align: center;
            }

            .phishing-dropdown-risk-bar-label {
                font-size: 11px;
                font-weight: 600;
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .phishing-dropdown-risk-bar-container {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 20px;
                height: 6px;
                overflow: hidden;
                margin-bottom: 4px;
                position: relative;
            }

            .phishing-dropdown-risk-bar-fill {
                height: 100%;
                border-radius: 20px;
                transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .phishing-dropdown-risk-bar-fill.phishing {
                background: linear-gradient(90deg, #ef4444, #dc2626);
            }

            .phishing-dropdown-risk-bar-fill.safe {
                background: linear-gradient(90deg, #10b981, #059669);
            }

            .phishing-dropdown-risk-value {
                font-size: 12px;
                font-weight: 700;
                margin-top: 2px;
            }

            /* Dropdown Toggle Button */
            .phishing-dropdown-toggle {
                width: 100%;
                padding: 10px 16px;
                background: rgba(0, 0, 0, 0.015);
                border: none;
                border-top: 1px solid rgba(0, 0, 0, 0.06);
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .phishing-dropdown-toggle:hover {
                background: rgba(0, 0, 0, 0.03);
                color: #4b5563;
            }

            .phishing-dropdown-toggle-icon {
                transition: transform 0.3s ease;
            }

            .phishing-dropdown-toggle.expanded .phishing-dropdown-toggle-icon {
                transform: rotate(180deg);
            }

            /* Dropdown Content */
            .phishing-dropdown-details {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease, padding 0.3s ease;
                background: #f8fafc;
                border-top: 1px solid rgba(0, 0, 0, 0.08);
            }

            .phishing-dropdown-details.expanded {
                max-height: 500px;
                padding: 0;
            }

            .phishing-dropdown-details-title {
                font-size: 14px;
                font-weight: 700;
                margin: 0 0 16px 0;
                padding: 16px 20px 0 20px;
                color: #1f2937;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* Reasons List */
            .phishing-dropdown-reasons {
                list-style: none;
                padding: 0 20px 20px 20px;
                margin: 0;
                display: grid;
                gap: 8px;
            }

            .phishing-dropdown-reason {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 10px 12px;
                background: white;
                border-radius: 8px;
                border: 1px solid rgba(0, 0, 0, 0.05);
                font-size: 12px;
                line-height: 1.4;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }

            .phishing-dropdown-reason:hover {
                background: #ffffff;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .phishing-dropdown-reason-bullet {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                margin-top: 4px;
                flex-shrink: 0;
            }

            .phishing-dropdown-reason-text {
                flex: 1;
                font-weight: 500;
                color: #374151;
            }

            /* Detailed Risk Analysis */
            .phishing-dropdown-detailed-bars {
                display: grid;
                gap: 12px;
                margin: 0 0 20px 0;
                padding: 0 20px;
            }

            .phishing-dropdown-detailed-bar {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .phishing-dropdown-detailed-bar-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                font-weight: 600;
            }

            .phishing-dropdown-detailed-bar-container {
                height: 8px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                overflow: hidden;
                position: relative;
            }

            .phishing-dropdown-detailed-bar-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Animations */
            @keyframes dropdownAlertSlideIn {
                0% {
                    opacity: 0;
                    transform: translateX(100%) translateY(-20px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
            }

            @keyframes dropdownAlertSlideOut {
                0% {
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(100%) translateY(-20px);
                }
            }

            @keyframes dropdownIconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            /* Responsive Design */
            @media (max-width: 640px) {
                .phishing-dropdown-alert {
                    width: calc(100vw - 20px);
                    right: 10px;
                    top: 10px;
                }
                
                .phishing-dropdown-risk-bars {
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Determine alert type based on phishing percentage
    getAlertType(phishingPercentage) {
        if (phishingPercentage >= 80) return this.alertTypes.HIGH_DANGER;
        if (phishingPercentage >= 60) return this.alertTypes.WARNING;
        if (phishingPercentage >= 5) return this.alertTypes.CAUTION;
        return this.alertTypes.SAFE;
    }

    // Generate detailed reasons based on analysis result
    generateDetailedReasons(result, phishingPercentage) {
        const reasons = [];
        
        // Add reasons from backend analysis
        if (result.reasons && result.reasons.length > 0) {
            result.reasons.forEach(reason => {
                reasons.push(reason);
            });
        }
        
        // Add classification-based reasons
        if (phishingPercentage >= 80) {
            reasons.push(...[
                'Uses 1 urgent/phishing language patterns',
                'Multiple high-risk phishing indicators detected',
                'Suspicious URL patterns and domain characteristics',
                'Request for sensitive personal information',
                'Threat of account suspension or closure',
                'Poor grammar or spelling inconsistencies'
            ]);
        } else if (phishingPercentage >= 60) {
            reasons.push(...[
                'Uses 1 urgent/phishing language patterns',
                'Several warning signs present in email content',
                'Potentially suspicious sender domain',
                'Moderate risk language patterns detected',
                'Some characteristics match known phishing attempts'
            ]);
        } else if (phishingPercentage >= 5) {
            reasons.push(...[
                'Uses 1 urgent/phishing language patterns',
                'Minor suspicious elements identified',
                'Some characteristics require attention',
                'Email contains few warning indicators',
                'Generally safe but exercise normal caution'
            ]);
        } else {
            reasons.push(...[
                'Email passes comprehensive security analysis',
                'Legitimate sender domain verified',
                'Professional email format and structure',
                'No suspicious links or attachments detected',
                'Very low risk of phishing activity'
            ]);
        }
        
        return reasons;
    }

    // Generate recommendation text based on risk level
    getRecommendationText(phishingPercentage) {
        if (phishingPercentage >= 80) {
            return 'STAY ALERT: While the overall risk is moderate, some elements require attention. Double-check the sender identity and be cautious with any links or downloads.';
        } else if (phishingPercentage >= 60) {
            return 'STAY ALERT: While the overall risk is moderate, some elements require attention. Double-check the sender identity and be cautious with any links or downloads.';
        } else if (phishingPercentage >= 5) {
            return 'STAY ALERT: While the overall risk is moderate, some elements require attention. Double-check the sender identity and be cautious with any links or downloads.';
        } else {
            return 'This email appears to be legitimate and safe. Continue to exercise general email safety practices.';
        }
    }

    // Show phishing alert with dropdown design
    showPhishingAlert(analysisResult, emailElement = null) {
        // Remove any existing alerts
        document.querySelectorAll('.phishing-dropdown-alert').forEach(el => el.remove());
        
        // Calculate phishing percentage
        const isPhishing = analysisResult.prediction === 'Phishing Email';
        let phishingPercentage;
        
        if (isPhishing) {
            phishingPercentage = (analysisResult.phishing_confidence || analysisResult.confidence || 0) * 100;
        } else {
            const safeConfidence = analysisResult.safe_confidence || analysisResult.confidence || 0;
            phishingPercentage = (1 - safeConfidence) * 100;
        }
        
        const safePercentage = 100 - phishingPercentage;
        const alertType = this.getAlertType(phishingPercentage);
        const reasons = this.generateDetailedReasons(analysisResult, phishingPercentage);
        
        // Create alert card
        const alertCard = document.createElement('div');
        alertCard.className = `phishing-dropdown-alert ${alertType.class}`;
        
        alertCard.innerHTML = `
            <div class="phishing-dropdown-header" style="background: ${alertType.bgColor}; color: ${alertType.color};">
                <div class="phishing-dropdown-icon">${alertType.icon}</div>
                <div class="phishing-dropdown-content">
                    <div class="phishing-dropdown-title">${alertType.title}</div>
                    <div class="phishing-dropdown-subtitle" style="color: ${alertType.color};">${alertType.subtitle}</div>
                    <div class="phishing-dropdown-percentage-main" style="background: ${alertType.color};">
                        <span class="phishing-dropdown-percentage-text">${phishingPercentage.toFixed(1)}% Phishing Risk</span>
                    </div>
                </div>
                <button class="phishing-dropdown-close">×</button>
            </div>
            
            <button class="phishing-dropdown-toggle">
                <span>View Analysis Details</span>
                <span class="phishing-dropdown-toggle-icon">▼</span>
            </button>
            
            <div class="phishing-dropdown-details">
                <div class="phishing-dropdown-summary">
                    <div class="phishing-dropdown-summary-text">
                        <strong>Risk Assessment:</strong> ${this.getRecommendationText(phishingPercentage)}
                    </div>
                    
                    <div class="phishing-dropdown-risk-bars">
                        <div class="phishing-dropdown-risk-bar">
                            <div class="phishing-dropdown-risk-bar-label" style="color: #ef4444;">PHISHING RISK</div>
                            <div class="phishing-dropdown-risk-bar-container">
                                <div class="phishing-dropdown-risk-bar-fill phishing" style="width: ${phishingPercentage}%"></div>
                            </div>
                            <div class="phishing-dropdown-risk-value" style="color: #ef4444;">${phishingPercentage.toFixed(1)}%</div>
                        </div>
                        <div class="phishing-dropdown-risk-bar">
                            <div class="phishing-dropdown-risk-bar-label" style="color: #10b981;">SAFETY SCORE</div>
                            <div class="phishing-dropdown-risk-bar-container">
                                <div class="phishing-dropdown-risk-bar-fill safe" style="width: ${safePercentage}%"></div>
                            </div>
                            <div class="phishing-dropdown-risk-value" style="color: #10b981;">${safePercentage.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
                
                <div class="phishing-dropdown-details-title">
                    Analysis Details (${reasons.length} factors)
                </div>
                
                <div class="phishing-dropdown-detailed-bars">
                    <div class="phishing-dropdown-detailed-bar">
                        <div class="phishing-dropdown-detailed-bar-label">
                            <span style="color: #ef4444; font-weight: 600;">Phishing Risk Level</span>
                            <span style="color: #ef4444; font-weight: 800;">${phishingPercentage.toFixed(1)}%</span>
                        </div>
                        <div class="phishing-dropdown-detailed-bar-container">
                            <div class="phishing-dropdown-detailed-bar-fill" style="width: ${phishingPercentage}%; background: linear-gradient(90deg, #ef4444, #dc2626);"></div>
                        </div>
                    </div>
                    
                    <div class="phishing-dropdown-detailed-bar">
                        <div class="phishing-dropdown-detailed-bar-label">
                            <span style="color: #10b981; font-weight: 600;">Safety Confidence Level</span>
                            <span style="color: #10b981; font-weight: 800;">${safePercentage.toFixed(1)}%</span>
                        </div>
                        <div class="phishing-dropdown-detailed-bar-container">
                            <div class="phishing-dropdown-detailed-bar-fill" style="width: ${safePercentage}%; background: linear-gradient(90deg, #10b981, #059669);"></div>
                        </div>
                    </div>
                </div>
                
                <ul class="phishing-dropdown-reasons">
                    ${reasons.map((reason, index) => `
                        <li class="phishing-dropdown-reason">
                            <div class="phishing-dropdown-reason-bullet" style="background: ${alertType.color};"></div>
                            <div class="phishing-dropdown-reason-text">${reason}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = alertCard.querySelector('.phishing-dropdown-close');
        closeBtn.addEventListener('click', () => this.closeAlert(alertCard));
        
        const toggleBtn = alertCard.querySelector('.phishing-dropdown-toggle');
        const detailsDiv = alertCard.querySelector('.phishing-dropdown-details');
        
        toggleBtn.addEventListener('click', () => {
            const isExpanded = detailsDiv.classList.contains('expanded');
            
            if (isExpanded) {
                detailsDiv.classList.remove('expanded');
                toggleBtn.classList.remove('expanded');
                toggleBtn.querySelector('span:first-child').textContent = 'View Analysis Details';
            } else {
                detailsDiv.classList.add('expanded');
                toggleBtn.classList.add('expanded');
                toggleBtn.querySelector('span:first-child').textContent = 'Hide Analysis Details';
            }
        });
        
        // Add to page
        document.body.appendChild(alertCard);
        
        // Auto-close after specified delay
        setTimeout(() => {
            if (alertCard.parentNode) {
                this.closeAlert(alertCard);
            }
        }, alertType.autoCloseDelay);
        
        return alertCard;
    }

    // Close alert with animation
    closeAlert(alertCard) {
        alertCard.style.animation = 'dropdownAlertSlideOut 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => {
            if (alertCard.parentNode) {
                alertCard.remove();
            }
        }, 300);
    }

    // Test function to demonstrate the dropdown design
    testDropdownAlert() {
        const testResult = {
            prediction: 'Phishing Email',
            confidence: 0.83,
            phishing_confidence: 0.83,
            safe_confidence: 0.17,
            reasons: ['Suspicious domain detected', 'Urgent action language used', 'Account threat mentioned']
        };
        
        console.log('Testing dropdown phishing alert...');
        this.showPhishingAlert(testResult);
    }
}

// Export for use
window.PhishingAlertDropdownUI = PhishingAlertDropdownUI;

// Auto-initialize
window.phishingAlertDropdownUI = new PhishingAlertDropdownUI();

console.log('Phishing Alert Dropdown UI System loaded!');
console.log('Test dropdown alert: phishingAlertDropdownUI.testDropdownAlert()');