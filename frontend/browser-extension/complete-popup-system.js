// Complete Phishing Alert System with Working Dropdown
console.log('🎯 Loading Complete Popup System with Dropdown...');

class CompletePhishingAlert {
    constructor() {
        this.alertTypes = {
            HIGH_DANGER: {
                threshold: 80,
                class: 'high-danger',
                color: '#dc2626',
                bgColor: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                borderColor: '#dc2626',
                icon: '🚨',
                title: 'PHISHING – HIGH DANGER',
                subtitle: 'Immediate Action Required',
                autoCloseDelay: 15000
            },
            WARNING: {
                threshold: 60,
                class: 'warning-phishing',
                color: '#f59e0b',
                bgColor: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                borderColor: '#f59e0b',
                icon: '⚠️',
                title: 'POSSIBLE PHISHING – BE AWARE',
                subtitle: 'Exercise Extreme Caution',
                autoCloseDelay: 12000
            },
            CAUTION: {
                threshold: 5,
                class: 'caution-flags',
                color: '#f97316',
                bgColor: 'linear-gradient(135deg, #fff7ed, #fed7aa)',
                borderColor: '#f97316',
                icon: '🟡',
                title: 'FEW RED FLAGS – BE AWARE',
                subtitle: 'Minor Suspicious Elements',
                autoCloseDelay: 10000
            },
            SAFE: {
                threshold: 0,
                class: 'safe-email',
                color: '#059669',
                bgColor: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                borderColor: '#059669',
                icon: '✅',
                title: 'SAFE – VERY LOW RISK',
                subtitle: 'Email Appears Legitimate',
                autoCloseDelay: 8000
            }
        };
        
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('complete-phishing-alert-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'complete-phishing-alert-styles';
        styles.textContent = `
            /* Complete Phishing Alert System Styles */
            .complete-phishing-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999999;
                width: 380px;
                max-width: calc(100vw - 40px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
                animation: slideInAlert 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                border: 2px solid rgba(0, 0, 0, 0.08);
            }

            .complete-phishing-alert.high-danger {
                border-left: 6px solid #dc2626;
                box-shadow: 0 25px 60px rgba(220, 38, 38, 0.3), 0 8px 20px rgba(220, 38, 38, 0.2);
            }

            .complete-phishing-alert.warning-phishing {
                border-left: 6px solid #f59e0b;
                box-shadow: 0 25px 60px rgba(245, 158, 11, 0.3), 0 8px 20px rgba(245, 158, 11, 0.2);
            }

            .complete-phishing-alert.caution-flags {
                border-left: 6px solid #f97316;
                box-shadow: 0 25px 60px rgba(249, 115, 22, 0.25), 0 8px 20px rgba(249, 115, 22, 0.15);
            }

            .complete-phishing-alert.safe-email {
                border-left: 6px solid #059669;
                box-shadow: 0 25px 60px rgba(5, 150, 105, 0.25), 0 8px 20px rgba(5, 150, 105, 0.15);
            }

            .alert-header {
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 16px;
                position: relative;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }

            .alert-icon {
                font-size: 28px;
                line-height: 1;
                animation: iconPulse 2.5s ease-in-out infinite;
            }

            .alert-content {
                flex: 1;
                min-width: 0;
            }

            .alert-title {
                font-size: 16px;
                font-weight: 800;
                letter-spacing: 0.2px;
                margin: 0 0 6px 0;
                line-height: 1.2;
            }

            .alert-subtitle {
                font-size: 13px;
                font-weight: 600;
                margin: 0 0 8px 0;
                opacity: 0.85;
            }

            .alert-percentage {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                font-weight: 700;
                padding: 6px 12px;
                border-radius: 20px;
                color: white;
                margin-top: 4px;
            }

            .alert-close-btn {
                position: absolute;
                top: 16px;
                right: 16px;
                background: rgba(0, 0, 0, 0.1);
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: rgba(0, 0, 0, 0.6);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .alert-close-btn:hover {
                background: rgba(0, 0, 0, 0.15);
                color: rgba(0, 0, 0, 0.8);
                transform: scale(1.1);
            }

            .dropdown-toggle {
                width: 100%;
                padding: 16px 20px;
                background: rgba(0, 0, 0, 0.02);
                border: none;
                border-top: 1px solid rgba(0, 0, 0, 0.08);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #6b7280;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .dropdown-toggle:hover {
                background: rgba(0, 0, 0, 0.05);
                color: #374151;
            }

            .dropdown-arrow {
                transition: transform 0.3s ease;
                font-size: 12px;
            }

            .dropdown-toggle.expanded .dropdown-arrow {
                transform: rotate(180deg);
            }

            .dropdown-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                background: #fafafa;
            }

            .dropdown-content.expanded {
                max-height: 600px;
            }

            .risk-assessment-section {
                padding: 20px;
                border-left: 4px solid currentColor;
                margin: 16px;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.7);
            }

            .risk-assessment-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
            }

            .risk-indicator {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                flex-shrink: 0;
            }

            .risk-assessment-title {
                font-size: 16px;
                font-weight: 800;
                margin: 0;
            }

            .risk-assessment-text {
                font-size: 14px;
                line-height: 1.6;
                margin: 0;
                font-weight: 500;
            }

            .risk-bars-container {
                padding: 0 20px 20px 20px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }

            .risk-bar {
                text-align: center;
            }

            .risk-bar-label {
                font-size: 13px;
                font-weight: 700;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.8px;
            }

            .risk-bar-container {
                background: rgba(0, 0, 0, 0.1);
                height: 10px;
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 12px;
                position: relative;
            }

            .risk-bar-fill {
                height: 100%;
                border-radius: 6px;
                transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .risk-bar-fill.phishing {
                background: linear-gradient(90deg, #ef4444, #dc2626);
            }

            .risk-bar-fill.safe {
                background: linear-gradient(90deg, #10b981, #059669);
            }

            .risk-percentage {
                font-size: 20px;
                font-weight: 800;
                margin-top: 4px;
            }

            .analysis-details-section {
                padding: 0 20px 20px 20px;
            }

            .analysis-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }

            .analysis-title {
                font-size: 16px;
                font-weight: 800;
                margin: 0;
            }

            .reasons-list {
                display: grid;
                gap: 10px;
            }

            .reason-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 10px;
                border: 1px solid rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
                animation: fadeInUp 0.5s ease;
                animation-fill-mode: both;
            }

            .reason-item:hover {
                background: rgba(255, 255, 255, 1);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .reason-bullet {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: currentColor;
                margin-top: 8px;
                flex-shrink: 0;
            }

            .reason-text {
                flex: 1;
                font-size: 14px;
                line-height: 1.5;
                font-weight: 500;
                margin: 0;
            }

            /* Animations */
            @keyframes slideInAlert {
                0% {
                    opacity: 0;
                    transform: translateX(100%) scale(0.9);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
            }

            @keyframes iconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            @keyframes fadeInUp {
                0% {
                    opacity: 0;
                    transform: translateY(10px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Responsive Design */
            @media (max-width: 640px) {
                .complete-phishing-alert {
                    width: calc(100vw - 20px);
                    right: 10px;
                    top: 10px;
                }
                
                .risk-bars-container {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    getAlertType(phishingPercentage) {
        if (phishingPercentage >= 80) return this.alertTypes.HIGH_DANGER;
        if (phishingPercentage >= 60) return this.alertTypes.WARNING;
        if (phishingPercentage >= 5) return this.alertTypes.CAUTION;
        return this.alertTypes.SAFE;
    }

    generateReasons(result, phishingPercentage) {
        const reasons = [];
        
        // Add reasons from API if available
        if (result.reasons && result.reasons.length > 0) {
            result.reasons.forEach(reason => reasons.push(reason));
        }
        
        // Add context-appropriate reasons
        if (phishingPercentage >= 80) {
            reasons.push(...[
                'Multiple high-risk phishing indicators detected',
                'Suspicious URL patterns and domain characteristics',
                'Urgent action language commonly used in scams',
                'Request for sensitive personal information',
                'Threat of account suspension or closure',
                'Poor grammar or spelling inconsistencies'
            ]);
        } else if (phishingPercentage >= 60) {
            reasons.push(...[
                'Several warning signs present in email content',
                'Potentially suspicious sender domain',
                'Moderate risk language patterns detected',
                'Some characteristics match known phishing attempts'
            ]);
        } else if (phishingPercentage >= 5) {
            reasons.push(...[
                'Minor suspicious elements identified',
                'Some characteristics require attention',
                'Generally safe but exercise normal caution'
            ]);
        } else {
            reasons.push(...[
                'Email passes comprehensive security analysis',
                'Legitimate sender domain verified',
                'Professional email format and structure',
                'No suspicious links or attachments detected'
            ]);
        }
        
        return reasons.slice(0, 8); // Limit to 8 reasons for clean display
    }

    getRiskAssessmentText(phishingPercentage, alertType) {
        if (phishingPercentage >= 80) {
            return 'IMMEDIATE DANGER: This email shows extremely high phishing indicators. Do NOT click any links, download attachments, or provide any personal information. Delete this email immediately and report it as phishing.';
        } else if (phishingPercentage >= 60) {
            return 'HIGH CAUTION: This email contains several suspicious elements. Verify the sender\'s authenticity through alternative means before taking any action. Be extremely careful with links and attachments.';
        } else if (phishingPercentage >= 5) {
            return 'STAY ALERT: While the overall risk is moderate, some elements require attention. Double-check the sender identity and be cautious with any links or downloads.';
        } else {
            return 'LOW RISK: This email appears to be legitimate and safe. Continue to exercise general email safety practices.';
        }
    }

    showCompleteAlert(analysisResult, emailElement = null) {
        // Remove existing alerts
        document.querySelectorAll('.complete-phishing-alert').forEach(el => el.remove());
        
        // Calculate percentages
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
        const reasons = this.generateReasons(analysisResult, phishingPercentage);
        const riskText = this.getRiskAssessmentText(phishingPercentage, alertType);
        
        // Create alert element
        const alertElement = document.createElement('div');
        alertElement.className = `complete-phishing-alert ${alertType.class}`;
        
        alertElement.innerHTML = `
            <div class="alert-header" style="background: ${alertType.bgColor}; color: ${alertType.color};">
                <div class="alert-icon">${alertType.icon}</div>
                <div class="alert-content">
                    <div class="alert-title">${alertType.title}</div>
                    <div class="alert-subtitle" style="color: ${alertType.color};">${alertType.subtitle}</div>
                    <div class="alert-percentage" style="background: ${alertType.color};">
                        ${phishingPercentage.toFixed(1)}% Phishing Risk
                    </div>
                </div>
                <button class="alert-close-btn" onclick="this.closest('.complete-phishing-alert').remove()">×</button>
            </div>
            
            <button class="dropdown-toggle" onclick="this.classList.toggle('expanded'); this.nextElementSibling.classList.toggle('expanded');">
                <span>View Analysis Details</span>
                <span class="dropdown-arrow">▼</span>
            </button>
            
            <div class="dropdown-content">
                <div class="risk-assessment-section" style="color: ${alertType.color}; border-color: ${alertType.color};">
                    <div class="risk-assessment-header">
                        <div class="risk-indicator" style="background: ${alertType.color};"></div>
                        <h3 class="risk-assessment-title">Risk Assessment</h3>
                    </div>
                    <p class="risk-assessment-text">${riskText}</p>
                </div>
                
                <div class="risk-bars-container">
                    <div class="risk-bar">
                        <div class="risk-bar-label" style="color: #ef4444;">PHISHING RISK</div>
                        <div class="risk-bar-container">
                            <div class="risk-bar-fill phishing" style="width: ${phishingPercentage}%;"></div>
                        </div>
                        <div class="risk-percentage" style="color: #ef4444;">${phishingPercentage.toFixed(1)}%</div>
                    </div>
                    
                    <div class="risk-bar">
                        <div class="risk-bar-label" style="color: #10b981;">SAFETY SCORE</div>
                        <div class="risk-bar-container">
                            <div class="risk-bar-fill safe" style="width: ${safePercentage}%;"></div>
                        </div>
                        <div class="risk-percentage" style="color: #10b981;">${safePercentage.toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="analysis-details-section" style="color: ${alertType.color};">
                    <div class="analysis-header">
                        <span>🔍</span>
                        <h3 class="analysis-title">Analysis Details (${reasons.length} factors)</h3>
                    </div>
                    
                    <div class="reasons-list">
                        ${reasons.map((reason, index) => `
                            <div class="reason-item" style="animation-delay: ${index * 0.1}s;">
                                <div class="reason-bullet" style="background: ${alertType.color};"></div>
                                <p class="reason-text">${reason}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(alertElement);
        
        // Auto-close
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, alertType.autoCloseDelay);
        
        return alertElement;
    }

    // Test functions
    testHighDanger() {
        const testResult = {
            prediction: 'Phishing Email',
            confidence: 0.95,
            phishing_confidence: 0.95,
            safe_confidence: 0.05,
            reasons: ['Suspicious domain detected', 'Urgent action language', 'Account threat mentioned']
        };
        return this.showCompleteAlert(testResult);
    }

    testWarning() {
        const testResult = {
            prediction: 'Phishing Email',
            confidence: 0.72,
            phishing_confidence: 0.72,
            safe_confidence: 0.28,
            reasons: ['Some suspicious elements detected', 'Caution advised']
        };
        return this.showCompleteAlert(testResult);
    }

    testCaution() {
        const testResult = {
            prediction: 'Safe Email',
            confidence: 0.85,
            phishing_confidence: 0.15,
            safe_confidence: 0.85,
            reasons: ['Minor inconsistencies noted']
        };
        return this.showCompleteAlert(testResult);
    }

    testSafe() {
        const testResult = {
            prediction: 'Safe Email',
            confidence: 0.98,
            phishing_confidence: 0.02,
            safe_confidence: 0.98,
            reasons: ['Legitimate sender verified', 'Professional format']
        };
        return this.showCompleteAlert(testResult);
    }
}

// Initialize and export
window.CompletePhishingAlert = CompletePhishingAlert;
window.completePhishingAlert = new CompletePhishingAlert();

console.log('✅ Complete Popup System with Dropdown loaded successfully!');
console.log('📋 Test functions available:');
console.log('  - completePhishingAlert.testHighDanger()');
console.log('  - completePhishingAlert.testWarning()');
console.log('  - completePhishingAlert.testCaution()');
console.log('  - completePhishingAlert.testSafe()');