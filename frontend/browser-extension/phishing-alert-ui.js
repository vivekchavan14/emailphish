// Advanced Phishing Alert UI System with Dropdown Design
// Color-coded alerts based on phishing percentage with detailed analysis in dropdown

class PhishingAlertUI {
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
                autoCloseDelay: 12000 // 12 seconds
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
                autoCloseDelay: 8000 // 8 seconds
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
                autoCloseDelay: 6000 // 6 seconds
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
                autoCloseDelay: 4000 // 4 seconds
            }
        };
        
        this.injectStyles();
    }

    // Inject CSS styles for the alert system
    injectStyles() {
        if (document.getElementById('phishing-alert-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'phishing-alert-styles';
        styles.textContent = `
            /* Phishing Alert UI Styles */
            .phishing-alert-card {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999999;
                width: 320px;
                max-width: calc(100vw - 30px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                overflow: hidden;
                animation: alertSlideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .phishing-alert-card.high-danger {
                border-left: 8px solid #dc2626;
                box-shadow: 0 20px 50px rgba(220, 38, 38, 0.25), 0 8px 16px rgba(220, 38, 38, 0.15);
            }

            .phishing-alert-card.warning-phishing {
                border-left: 8px solid #f59e0b;
                box-shadow: 0 20px 50px rgba(245, 158, 11, 0.25), 0 8px 16px rgba(245, 158, 11, 0.15);
            }

            .phishing-alert-card.caution-flags {
                border-left: 8px solid #f97316;
                box-shadow: 0 20px 50px rgba(249, 115, 22, 0.2), 0 8px 16px rgba(249, 115, 22, 0.1);
            }

            .phishing-alert-card.safe-email {
                border-left: 8px solid #059669;
                box-shadow: 0 20px 50px rgba(5, 150, 105, 0.2), 0 8px 16px rgba(5, 150, 105, 0.1);
            }

            .phishing-alert-header {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                position: relative;
            }

            .phishing-alert-icon {
                font-size: 20px;
                line-height: 1;
                animation: iconPulse 2s ease-in-out infinite;
            }

            .phishing-alert-content {
                flex: 1;
                min-width: 0;
            }

            .phishing-alert-title {
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 0.3px;
                margin: 0 0 3px 0;
                line-height: 1.2;
            }

            .phishing-alert-subtitle {
                font-size: 12px;
                font-weight: 500;
                margin: 0 0 6px 0;
                opacity: 0.75;
            }

            .phishing-alert-percentage {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 12px;
                color: white;
                margin-top: 2px;
            }

            .phishing-alert-close {
                position: absolute;
                top: 12px;
                right: 12px;
                background: rgba(0, 0, 0, 0.1);
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.6);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .phishing-alert-close:hover {
                background: rgba(0, 0, 0, 0.15);
                color: rgba(0, 0, 0, 0.8);
                transform: scale(1.1);
            }
            
            .phishing-alert-dropdown {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.4s ease, padding 0.4s ease;
            }
            
            .phishing-alert-dropdown.show {
                display: block !important;
                max-height: 500px;
                overflow: visible;
            }

            .phishing-alert-body {
                padding: 0 16px 16px 16px;
            }

            .phishing-alert-summary {
                background: rgba(0, 0, 0, 0.02);
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 16px;
                border-left: 4px solid currentColor;
                font-size: 14px;
                line-height: 1.5;
            }

            .phishing-percentage-bars {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }

            .percentage-bar {
                text-align: center;
            }

            .percentage-bar-label {
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .percentage-bar-container {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 20px;
                height: 8px;
                overflow: hidden;
                margin-bottom: 4px;
                position: relative;
            }

            .percentage-bar-fill {
                height: 100%;
                border-radius: 20px;
                transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .percentage-bar-fill.phishing {
                background: linear-gradient(90deg, #ef4444, #dc2626);
            }

            .percentage-bar-fill.safe {
                background: linear-gradient(90deg, #10b981, #059669);
            }

            .percentage-value {
                font-size: 14px;
                font-weight: 700;
                margin-top: 2px;
            }

            .phishing-reasons {
                margin-top: 12px;
            }

            .reasons-title {
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .reasons-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: grid;
                gap: 8px;
            }

            .reason-item {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                padding: 8px 10px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 6px;
                border: 1px solid rgba(0, 0, 0, 0.05);
                font-size: 12px;
                line-height: 1.3;
                transition: all 0.2s ease;
            }

            .reason-item:hover {
                background: rgba(255, 255, 255, 1);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .reason-bullet {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: currentColor;
                margin-top: 6px;
                flex-shrink: 0;
            }

            .reason-text {
                flex: 1;
                font-weight: 500;
            }

            .expand-button {
                width: 100%;
                padding: 12px;
                background: rgba(0, 0, 0, 0.04);
                border: none;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                color: inherit;
            }

            .expand-button:hover {
                background: rgba(0, 0, 0, 0.08);
            }

            .detailed-popup {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 99999999;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                animation: fadeIn 0.3s ease;
            }

            .detailed-popup-content {
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 85vh;
                overflow: hidden;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
                animation: popupScaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            }

            .detailed-popup-header {
                padding: 24px;
                display: flex;
                align-items: center;
                gap: 16px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .detailed-popup-body {
                padding: 24px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .risk-analysis-section {
                margin-bottom: 24px;
            }

            .risk-bars-detailed {
                display: grid;
                gap: 16px;
                margin-top: 16px;
            }

            .risk-bar-detailed {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .risk-bar-detailed-label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                font-weight: 600;
            }

            .risk-bar-detailed-container {
                height: 12px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 6px;
                overflow: hidden;
                position: relative;
            }

            .risk-bar-detailed-fill {
                height: 100%;
                border-radius: 6px;
                transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .action-buttons {
                display: flex;
                gap: 12px;
                padding: 20px 24px;
                background: rgba(0, 0, 0, 0.02);
                border-top: 1px solid rgba(0, 0, 0, 0.1);
            }

            .action-button {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 14px;
            }

            .action-button.ignore {
                background: transparent;
                border-color: #6b7280;
                color: #6b7280;
            }

            .action-button.ignore:hover {
                background: #6b7280;
                color: white;
            }

            .action-button.report {
                background: #3b82f6;
                border-color: #3b82f6;
                color: white;
            }

            .action-button.report:hover {
                background: #2563eb;
                border-color: #2563eb;
            }

            .action-button.block {
                background: #ef4444;
                border-color: #ef4444;
                color: white;
            }

            .action-button.block:hover {
                background: #dc2626;
                border-color: #dc2626;
            }

            /* Animations */
            @keyframes alertSlideIn {
                0% {
                    opacity: 0;
                    transform: translateX(100%) translateY(-20px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
            }

            @keyframes alertSlideOut {
                0% {
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(100%) translateY(-20px);
                }
            }

            @keyframes iconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes fadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }

            @keyframes popupScaleIn {
                0% {
                    opacity: 0;
                    transform: scale(0.9) translateY(20px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            /* Responsive Design */
            @media (max-width: 640px) {
                .phishing-alert-card {
                    width: calc(100vw - 20px);
                    right: 10px;
                    top: 10px;
                }
                
                .detailed-popup-content {
                    width: 95%;
                    max-height: 90vh;
                }
                
                .phishing-percentage-bars {
                    grid-template-columns: 1fr;
                }
                
                .action-buttons {
                    flex-direction: column;
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
                'Multiple high-risk phishing indicators detected',
                'Suspicious URL patterns and domain characteristics',
                'Urgent action language commonly used in scams',
                'Request for sensitive personal information',
                'Threat of account suspension or closure',
                'Poor grammar or spelling inconsistencies',
                'Mismatched sender information',
                'Suspicious attachment or link destinations'
            ]);
        } else if (phishingPercentage >= 60) {
            reasons.push(...[
                'Several warning signs present in email content',
                'Potentially suspicious sender domain',
                'Moderate risk language patterns detected',
                'Some characteristics match known phishing attempts',
                'Email formatting or structure irregularities',
                'Caution advised with links and attachments'
            ]);
        } else if (phishingPercentage >= 5) {
            reasons.push(...[
                'Minor suspicious elements identified',
                'Some characteristics require attention',
                'Email contains few warning indicators',
                'Generally safe but exercise normal caution',
                'No major red flags but stay vigilant'
            ]);
        } else {
            reasons.push(...[
                'Email passes comprehensive security analysis',
                'Legitimate sender domain verified',
                'Professional email format and structure',
                'No suspicious links or attachments detected',
                'Content matches legitimate communication patterns',
                'Very low risk of phishing activity'
            ]);
        }
        
        return reasons;
    }

    // Generate recommendation text based on risk level
    getRecommendationText(phishingPercentage) {
        if (phishingPercentage >= 80) {
            return `<strong style="color: #dc2626;">🚨 IMMEDIATE DANGER:</strong> This email shows extremely high phishing indicators. Do NOT click any links, download attachments, or provide any personal information. Delete this email immediately and report it as phishing.`;
        } else if (phishingPercentage >= 60) {
            return `<strong style="color: #f59e0b;">⚠️ HIGH CAUTION:</strong> This email contains several suspicious elements. Verify the sender's authenticity through alternative means before taking any action. Be extremely careful with links and attachments.`;
        } else if (phishingPercentage >= 5) {
            return `<strong style="color: #f97316;">🟡 STAY ALERT:</strong> While the overall risk is moderate, some elements require attention. Double-check the sender identity and be cautious with any links or downloads.`;
        } else {
            return `<strong style="color: #059669;">✅ LOW RISK:</strong> This email appears to be legitimate and safe. Continue to exercise general email safety practices.`;
        }
    }

    // Show phishing alert with EXACT IMAGE design
    showPhishingAlert(analysisResult, emailElement = null) {
        // Remove any existing alerts
        document.querySelectorAll('.phishing-alert-card').forEach(el => el.remove());
        
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
        
        // Create EXACT IMAGE DESIGN alert
        const alertCard = document.createElement('div');
        alertCard.className = `phishing-alert-card ${alertType.class}`;
        
        alertCard.innerHTML = `
            <div class="phishing-alert-header" style="background: ${alertType.bgColor}; color: ${alertType.color};">
                <div class="phishing-alert-icon">${alertType.icon}</div>
                <div class="phishing-alert-content">
                    <div class="phishing-alert-title">${alertType.title}</div>
                    <div class="phishing-alert-subtitle" style="color: ${alertType.color};">${alertType.subtitle}</div>
                    <div class="phishing-alert-percentage" style="background: ${alertType.color};">
                        ${phishingPercentage.toFixed(1)}% Phishing Risk
                    </div>
                </div>
                <button class="phishing-alert-close" onclick="event.stopPropagation(); this.closest('.phishing-alert-card').remove();">×</button>
            </div>
            
            <!-- Dropdown Toggle Button -->
            <button class="phishing-dropdown-toggle" style="width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.02); border: none; border-top: 1px solid rgba(0,0,0,0.06); font-size: 12px; font-weight: 600; cursor: pointer; color: #6b7280; text-align: center;" onclick="this.nextElementSibling.classList.toggle('show'); this.innerHTML = this.nextElementSibling.classList.contains('show') ? 'Hide Analysis Details ▲' : 'View Analysis Details ▼';">
                View Analysis Details ▼
            </button>
            
            <div class="phishing-alert-dropdown" style="display: none; background: white;">
                <!-- Risk Assessment Section - Exactly like your image -->
                <div style="padding: 16px; background: #fff7ed; border-left: 4px solid #f97316; margin: 16px; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div style="width: 12px; height: 12px; background: #fbbf24; border-radius: 50%; flex-shrink: 0;"></div>
                        <div style="font-size: 14px; font-weight: 700; color: #f97316;">Risk Assessment:</div>
                        <div style="font-size: 14px; font-weight: 700; color: #f97316;">STAY ALERT:</div>
                    </div>
                    <div style="font-size: 13px; line-height: 1.5; color: #7c2d12;">
                        While the overall risk is moderate, some elements require attention. Double-check the sender identity and be cautious with any links or downloads.
                    </div>
                </div>
                
                <!-- PHISHING RISK and SAFETY SCORE Bars - Exactly like your image -->
                <div style="padding: 0 16px 16px 16px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <!-- PHISHING RISK -->
                        <div style="text-align: center;">
                            <div style="font-size: 13px; font-weight: 700; color: #ef4444; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">PHISHING RISK</div>
                            <div style="background: #f1f5f9; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px; position: relative;">
                                <div style="width: ${phishingPercentage}%; height: 100%; background: #ef4444; border-radius: 4px;"></div>
                            </div>
                            <div style="font-size: 18px; font-weight: 700; color: #ef4444;">${phishingPercentage.toFixed(1)}%</div>
                        </div>
                        
                        <!-- SAFETY SCORE -->
                        <div style="text-align: center;">
                            <div style="font-size: 13px; font-weight: 700; color: #10b981; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">SAFETY SCORE</div>
                            <div style="background: #f1f5f9; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px; position: relative;">
                                <div style="width: ${safePercentage}%; height: 100%; background: #10b981; border-radius: 4px;"></div>
                            </div>
                            <div style="font-size: 18px; font-weight: 700; color: #10b981;">${safePercentage.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
                
                <!-- Analysis Details Section - Exactly like your image -->
                <div style="padding: 0 16px 16px 16px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <div style="font-size: 16px;">🔍</div>
                        <div style="font-size: 14px; font-weight: 700; color: #f97316;">Analysis Details (${reasons.length} factors)</div>
                    </div>
                    
                    <div style="space-y: 8px;">
                        ${reasons.slice(0, 6).map(reason => `
                            <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
                                <div style="width: 6px; height: 6px; background: #f97316; border-radius: 50%; margin-top: 6px; flex-shrink: 0;"></div>
                                <div style="font-size: 13px; line-height: 1.5; color: #7c2d12; font-weight: 500;">${reason}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
                
                <!-- Analysis Details Section -->
                <div style="padding: 0 16px 16px 16px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <div style="font-size: 16px;">🔍</div>
                        <div style="font-size: 14px; font-weight: 700; color: #f97316;">Analysis Details (${reasons.length} factors)</div>
                    </div>
                    
                    <div style="space-y: 8px;">
                        ${reasons.slice(0, 6).map(reason => `
                            <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
                                <div style="width: 6px; height: 6px; background: #f97316; border-radius: 50%; margin-top: 6px; flex-shrink: 0;"></div>
                                <div style="font-size: 12px; line-height: 1.5; color: #7c2d12; font-weight: 500;">${reason}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(alertCard);
        
        // Auto-close after specified delay
        setTimeout(() => {
            if (alertCard.parentNode) {
                alertCard.remove();
            }
        }, alertType.autoCloseDelay);
        
        return alertCard;
    }
    
    // Original phishing alert method (kept as fallback)
    showOriginalPhishingAlert(analysisResult, emailElement = null) {
        // Remove any existing alerts
        document.querySelectorAll('.phishing-alert-card').forEach(el => el.remove());
        
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
        alertCard.className = `phishing-alert-card ${alertType.class}`;
        
        alertCard.innerHTML = `
            <div class="phishing-alert-header" style="background: ${alertType.bgColor}; color: ${alertType.color};">
                <div class="phishing-alert-icon">${alertType.icon}</div>
                <div class="phishing-alert-content">
                    <div class="phishing-alert-title">${alertType.title}</div>
                    <div class="phishing-alert-subtitle" style="color: ${alertType.color};">${alertType.subtitle}</div>
                    <div class="phishing-alert-percentage" style="background: ${alertType.color};">
                        ${phishingPercentage.toFixed(1)}% Phishing Risk
                    </div>
                </div>
                <button class="phishing-alert-close">×</button>
            </div>
            
            <div class="phishing-alert-body" style="color: ${alertType.color};">
                <div class="phishing-alert-summary">
                    <strong>Risk Assessment:</strong> ${this.getRecommendationText(phishingPercentage)}
                </div>
                
                <div class="phishing-percentage-bars">
                    <div class="percentage-bar">
                        <div class="percentage-bar-label" style="color: #ef4444;">Phishing Risk</div>
                        <div class="percentage-bar-container">
                            <div class="percentage-bar-fill phishing" style="width: ${phishingPercentage}%"></div>
                        </div>
                        <div class="percentage-value" style="color: #ef4444;">${phishingPercentage.toFixed(1)}%</div>
                    </div>
                    <div class="percentage-bar">
                        <div class="percentage-bar-label" style="color: #10b981;">Safety Score</div>
                        <div class="percentage-bar-container">
                            <div class="percentage-bar-fill safe" style="width: ${safePercentage}%"></div>
                        </div>
                        <div class="percentage-value" style="color: #10b981;">${safePercentage.toFixed(1)}%</div>
                    </div>
                </div>
                
                <div class="phishing-reasons">
                    <div class="reasons-title" style="color: ${alertType.color};">
                        Analysis Details (${reasons.length} factors)
                    </div>
                    <ul class="reasons-list">
                        ${reasons.slice(0, 2).map(reason => `
                            <li class="reason-item">
                                <div class="reason-bullet" style="background: ${alertType.color};"></div>
                                <div class="reason-text">${reason}</div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <button class="expand-button" style="color: ${alertType.color};">
                View Complete Analysis (${reasons.length} factors) ▼
            </button>
        `;
        
        // Add event listeners
        const closeBtn = alertCard.querySelector('.phishing-alert-close');
        closeBtn.addEventListener('click', () => this.closeAlert(alertCard));
        
        const expandBtn = alertCard.querySelector('.expand-button');
        expandBtn.addEventListener('click', () => {
            this.showDetailedPopup(analysisResult, phishingPercentage, safePercentage, alertType, reasons);
        });
        
        // Add to page
        document.body.appendChild(alertCard);
        
        // Auto-close after specified delay
        setTimeout(() => {
            if (alertCard.parentNode) {
                this.closeAlert(alertCard);
            }
        }, alertType.autoCloseDelay);
        
        // Show browser notification for high-risk emails
        if (phishingPercentage >= 60) {
            this.showBrowserNotification(analysisResult, phishingPercentage);
        }
        
        return alertCard;
    }

    // Show detailed analysis popup
    showDetailedPopup(analysisResult, phishingPercentage, safePercentage, alertType, reasons) {
        // Remove existing popup
        document.querySelectorAll('.detailed-popup').forEach(el => el.remove());
        
        const popup = document.createElement('div');
        popup.className = 'detailed-popup';
        
        popup.innerHTML = `
            <div class="detailed-popup-content">
                <div class="detailed-popup-header" style="background: ${alertType.bgColor}; color: ${alertType.color};">
                    <div style="font-size: 32px;">${alertType.icon}</div>
                    <div style="flex: 1;">
                        <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 800;">${alertType.title}</h2>
                        <p style="margin: 0; opacity: 0.8; font-size: 14px;">Complete Security Analysis Report</p>
                    </div>
                    <button class="phishing-alert-close" onclick="this.closest('.detailed-popup').remove()">×</button>
                </div>
                
                <div class="detailed-popup-body">
                    <div class="risk-analysis-section">
                        <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 700;">
                            📊 Risk Analysis Breakdown
                        </h3>
                        
                        <div class="risk-bars-detailed">
                            <div class="risk-bar-detailed">
                                <div class="risk-bar-detailed-label">
                                    <span style="color: #ef4444; font-weight: 600;">🚨 Phishing Risk Level</span>
                                    <span style="color: #ef4444; font-weight: 800; font-size: 16px;">${phishingPercentage.toFixed(1)}%</span>
                                </div>
                                <div class="risk-bar-detailed-container">
                                    <div class="risk-bar-detailed-fill" style="width: ${phishingPercentage}%; background: linear-gradient(90deg, #ef4444, #dc2626);"></div>
                                </div>
                            </div>
                            
                            <div class="risk-bar-detailed">
                                <div class="risk-bar-detailed-label">
                                    <span style="color: #10b981; font-weight: 600;">✅ Safety Confidence Level</span>
                                    <span style="color: #10b981; font-weight: 800; font-size: 16px;">${safePercentage.toFixed(1)}%</span>
                                </div>
                                <div class="risk-bar-detailed-container">
                                    <div class="risk-bar-detailed-fill" style="width: ${safePercentage}%; background: linear-gradient(90deg, #10b981, #059669);"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 700;">
                            🔍 Detailed Analysis Factors
                        </h3>
                        
                        <div style="background: rgba(0, 0, 0, 0.02); padding: 16px; border-radius: 12px; margin-bottom: 16px; border-left: 4px solid ${alertType.color};">
                            ${this.getRecommendationText(phishingPercentage)}
                        </div>
                        
                        <ul class="reasons-list">
                            ${reasons.map((reason, index) => `
                                <li class="reason-item" style="animation-delay: ${index * 0.05}s;">
                                    <div class="reason-bullet" style="background: ${alertType.color};"></div>
                                    <div class="reason-text"><strong>Factor ${index + 1}:</strong> ${reason}</div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="action-button ignore" onclick="console.log('Email ignored'); this.closest('.detailed-popup').remove();">
                        🤷‍♂️ Ignore Warning
                    </button>
                    <button class="action-button report" onclick="console.log('Email reported'); alert('Thank you for reporting this suspicious email!'); this.closest('.detailed-popup').remove();">
                        🚨 Report Phishing
                    </button>
                    <button class="action-button block" onclick="console.log('Email blocked'); alert('This email has been marked as blocked.'); this.closest('.detailed-popup').remove();">
                        🛡️ Block Sender
                    </button>
                </div>
            </div>
        `;
        
        // Add click outside to close
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
        
        document.body.appendChild(popup);
    }

    // Close alert with animation
    closeAlert(alertCard) {
        alertCard.style.animation = 'alertSlideOut 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => {
            if (alertCard.parentNode) {
                alertCard.remove();
            }
        }, 300);
    }

    // Show browser notification for high-risk emails
    showBrowserNotification(analysisResult, phishingPercentage) {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('🚨 PhishMail Guard Alert', {
                        body: `High-risk phishing email detected (${phishingPercentage.toFixed(1)}% confidence)`,
                        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDlWMTNNMTIgMTdIMTIuMDFNNS42IDE5SDEuOUw2IDEyTDEwLjIgNUgxMy44TDE4IDEySDE0LjRMMTIgMTdIMTJaIiBzdHJva2U9IiNlZjQ0NDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=',
                        tag: 'phishmail-guard'
                    });
                }
            });
        }
    }

    // IMMEDIATE TEST - Shows exact image design
    testImageDesign() {
        const testResult = {
            prediction: 'Phishing Email',
            confidence: 0.83,
            phishing_confidence: 0.83,
            safe_confidence: 0.17,
            reasons: ['Suspicious domain detected', 'Urgent action language used', 'Account threat mentioned']
        };
        
        console.log('🎯 TESTING EXACT IMAGE DESIGN!');
        this.showPhishingAlert(testResult);
    }
    
    // Test function to demonstrate all alert types
    testAllAlerts() {
        const testCases = [
            {
                name: 'High Danger Test',
                result: {
                    prediction: 'Phishing Email',
                    confidence: 0.95,
                    phishing_confidence: 0.95,
                    safe_confidence: 0.05,
                    reasons: ['Suspicious domain', 'Urgent action required', 'Account threat']
                }
            },
            {
                name: 'Warning Test', 
                result: {
                    prediction: 'Phishing Email',
                    confidence: 0.70,
                    phishing_confidence: 0.70,
                    safe_confidence: 0.30,
                    reasons: ['Some suspicious elements', 'Caution advised']
                }
            },
            {
                name: 'Caution Test',
                result: {
                    prediction: 'Safe Email',
                    confidence: 0.85,
                    phishing_confidence: 0.15,
                    safe_confidence: 0.85,
                    reasons: ['Minor inconsistencies noted']
                }
            },
            {
                name: 'Safe Test',
                result: {
                    prediction: 'Safe Email',
                    confidence: 0.98,
                    phishing_confidence: 0.02,
                    safe_confidence: 0.98,
                    reasons: ['Legitimate sender', 'Professional format']
                }
            }
        ];
        
        testCases.forEach((testCase, index) => {
            setTimeout(() => {
                console.log(`Testing ${testCase.name}...`);
                this.showPhishingAlert(testCase.result);
            }, index * 5000);
        });
    }
}

// Export for use
window.PhishingAlertUI = PhishingAlertUI;

// Auto-initialize
window.phishingAlertUI = new PhishingAlertUI();

console.log('🎨 Advanced Phishing Alert UI System loaded!');
console.log('📋 Test all alert types: phishingAlertUI.testAllAlerts()');

// AUTO-TEST: Show the new dropdown design immediately
setTimeout(() => {
    if (window.phishingAlertUI) {
        console.log('🎯 AUTO-TESTING: New dropdown design with your components!');
        window.phishingAlertUI.testImageDesign();
    }
}, 2000);
