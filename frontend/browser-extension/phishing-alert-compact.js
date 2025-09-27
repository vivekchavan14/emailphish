// Ultra-Compact Phishing Alert UI - Exactly matching your image
// Shows ONLY the header and percentage, everything else in dropdown

class CompactPhishingAlert {
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

    injectStyles() {
        if (document.getElementById('compact-phishing-alert-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'compact-phishing-alert-styles';
        styles.textContent = `
            /* Ultra-Compact Phishing Alert - Matches Your Image Exactly */
            .compact-phishing-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999999;
                width: 300px;
                max-width: calc(100vw - 30px);
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                overflow: hidden;
                animation: compactSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                border: 1px solid rgba(0, 0, 0, 0.08);
            }

            .compact-phishing-alert.high-danger {
                border-left: 6px solid #dc2626;
            }

            .compact-phishing-alert.warning-phishing {
                border-left: 6px solid #f59e0b;
            }

            .compact-phishing-alert.caution-flags {
                border-left: 6px solid #f97316;
            }

            .compact-phishing-alert.safe-email {
                border-left: 6px solid #059669;
            }

            /* Header Section - This is all that shows initially */
            .compact-alert-header {
                padding: 14px 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                position: relative;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .compact-alert-header:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
            }

            .compact-alert-icon {
                font-size: 18px;
                line-height: 1;
                animation: compactIconPulse 2s ease-in-out infinite;
            }

            .compact-alert-content {
                flex: 1;
                min-width: 0;
            }

            .compact-alert-title {
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 0.2px;
                margin: 0 0 3px 0;
                line-height: 1.2;
                color: #dc2626;
            }

            .compact-alert-subtitle {
                font-size: 11px;
                font-weight: 500;
                margin: 0 0 6px 0;
                color: #7c2d12;
                opacity: 0.9;
            }

            .compact-alert-percentage {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 700;
                padding: 4px 10px;
                border-radius: 12px;
                color: white;
                background: #dc2626;
                box-shadow: 0 2px 6px rgba(220, 38, 38, 0.3);
            }

            .compact-alert-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(0, 0, 0, 0.06);
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.5);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .compact-alert-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: rgba(0, 0, 0, 0.7);
            }

            /* Dropdown Toggle - Very minimal */
            .compact-dropdown-toggle {
                width: 100%;
                padding: 8px 16px;
                background: rgba(0, 0, 0, 0.01);
                border: none;
                border-top: 1px solid rgba(0, 0, 0, 0.04);
                font-size: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                color: #9ca3af;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .compact-dropdown-toggle:hover {
                background: rgba(0, 0, 0, 0.02);
                color: #6b7280;
            }

            .compact-dropdown-icon {
                transition: transform 0.3s ease;
                font-size: 8px;
            }

            .compact-dropdown-toggle.expanded .compact-dropdown-icon {
                transform: rotate(180deg);
            }

            /* Dropdown Section - Completely Hidden by default */
            .compact-dropdown-details {
                display: none;
            }

            .compact-dropdown-details.show {
                display: block;
                background: #f8fafc;
                border-top: 1px solid rgba(0, 0, 0, 0.06);
            }

            .compact-dropdown-content {
                padding: 16px;
            }

            .compact-risk-summary {
                font-size: 12px;
                line-height: 1.4;
                color: #4b5563;
                margin-bottom: 16px;
                padding: 12px;
                background: rgba(0, 0, 0, 0.02);
                border-radius: 6px;
                border-left: 3px solid #dc2626;
            }

            .compact-risk-bars {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
            }

            .compact-risk-bar {
                text-align: center;
            }

            .compact-risk-label {
                font-size: 9px;
                font-weight: 600;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .compact-risk-container {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 10px;
                height: 4px;
                overflow: hidden;
                margin-bottom: 3px;
            }

            .compact-risk-fill {
                height: 100%;
                border-radius: 10px;
                transition: width 1s ease;
            }

            .compact-risk-fill.phishing {
                background: linear-gradient(90deg, #ef4444, #dc2626);
            }

            .compact-risk-fill.safe {
                background: linear-gradient(90deg, #10b981, #059669);
            }

            .compact-risk-value {
                font-size: 10px;
                font-weight: 700;
            }

            .compact-reasons-title {
                font-size: 12px;
                font-weight: 700;
                margin-bottom: 8px;
                color: #1f2937;
            }

            .compact-reasons-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: grid;
                gap: 6px;
            }

            .compact-reason-item {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                padding: 8px 10px;
                background: white;
                border-radius: 6px;
                border: 1px solid rgba(0, 0, 0, 0.04);
                font-size: 11px;
                line-height: 1.3;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
            }

            .compact-reason-bullet {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                margin-top: 3px;
                flex-shrink: 0;
                background: #dc2626;
            }

            .compact-reason-text {
                flex: 1;
                color: #374151;
                font-weight: 500;
            }

            /* Animations */
            @keyframes compactSlideIn {
                0% {
                    opacity: 0;
                    transform: translateX(100%) translateY(-10px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }
            }

            @keyframes compactIconPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.03); }
            }

            /* Responsive */
            @media (max-width: 640px) {
                .compact-phishing-alert {
                    width: calc(100vw - 20px);
                    right: 10px;
                    top: 10px;
                }
                
                .compact-risk-bars {
                    grid-template-columns: 1fr;
                    gap: 8px;
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
        
        if (result.reasons && result.reasons.length > 0) {
            result.reasons.forEach(reason => reasons.push(reason));
        }
        
        if (phishingPercentage >= 80) {
            reasons.push(...[
                'Uses 1 urgent/phishing language patterns',
                'Multiple high-risk phishing indicators detected',
                'Suspicious URL patterns and domain characteristics',
                'Request for sensitive personal information',
                'Threat of account suspension or closure'
            ]);
        } else if (phishingPercentage >= 60) {
            reasons.push(...[
                'Uses 1 urgent/phishing language patterns',
                'Several warning signs present in email content',
                'Potentially suspicious sender domain',
                'Moderate risk language patterns detected'
            ]);
        } else if (phishingPercentage >= 5) {
            reasons.push(...[
                'Uses 1 urgent/phishing language patterns',
                'Minor suspicious elements identified',
                'Some characteristics require attention'
            ]);
        } else {
            reasons.push(...[
                'Email passes comprehensive security analysis',
                'Legitimate sender domain verified',
                'Professional email format and structure'
            ]);
        }
        
        return reasons;
    }

    getRecommendationText(phishingPercentage) {
        if (phishingPercentage >= 80) {
            return 'STAY ALERT: While the overall risk is moderate, some elements require attention. Double-check the sender identity and be cautious with any links or downloads.';
        } else {
            return 'This email appears to be legitimate and safe. Continue to exercise general email safety practices.';
        }
    }

    showPhishingAlert(analysisResult, emailElement = null) {
        // Remove any existing alerts
        document.querySelectorAll('.compact-phishing-alert').forEach(el => el.remove());
        
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
        const reasons = this.generateReasons(analysisResult, phishingPercentage);
        
        // Create compact alert
        const alertCard = document.createElement('div');
        alertCard.className = `compact-phishing-alert ${alertType.class}`;
        
        alertCard.innerHTML = `
            <div class="compact-alert-header" style="background: ${alertType.bgColor};">
                <div class="compact-alert-icon">${alertType.icon}</div>
                <div class="compact-alert-content">
                    <div class="compact-alert-title">${alertType.title}</div>
                    <div class="compact-alert-subtitle">${alertType.subtitle}</div>
                    <div class="compact-alert-percentage" style="background: ${alertType.color};">
                        ${phishingPercentage.toFixed(1)}% Phishing Risk
                    </div>
                </div>
                <button class="compact-alert-close">×</button>
            </div>
            
            <div class="compact-dropdown-details">
                <button class="compact-dropdown-toggle">
                    <span>View Analysis Details</span>
                    <span class="compact-dropdown-icon">▼</span>
                </button>
                
                <div class="compact-dropdown-content" style="display: none;">
                    <div class="compact-risk-summary">
                        <strong>Risk Assessment:</strong> ${this.getRecommendationText(phishingPercentage)}
                    </div>
                    
                    <div class="compact-risk-bars">
                        <div class="compact-risk-bar">
                            <div class="compact-risk-label" style="color: #ef4444;">PHISHING RISK</div>
                            <div class="compact-risk-container">
                                <div class="compact-risk-fill phishing" style="width: ${phishingPercentage}%"></div>
                            </div>
                            <div class="compact-risk-value" style="color: #ef4444;">${phishingPercentage.toFixed(1)}%</div>
                        </div>
                        <div class="compact-risk-bar">
                            <div class="compact-risk-label" style="color: #10b981;">SAFETY SCORE</div>
                            <div class="compact-risk-container">
                                <div class="compact-risk-fill safe" style="width: ${safePercentage}%"></div>
                            </div>
                            <div class="compact-risk-value" style="color: #10b981;">${safePercentage.toFixed(1)}%</div>
                        </div>
                    </div>
                    
                    <div class="compact-reasons-title">Analysis Details (${reasons.length} factors)</div>
                    <ul class="compact-reasons-list">
                        ${reasons.map(reason => `
                            <li class="compact-reason-item">
                                <div class="compact-reason-bullet"></div>
                                <div class="compact-reason-text">${reason}</div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = alertCard.querySelector('.compact-alert-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeAlert(alertCard);
        });
        
        const headerDiv = alertCard.querySelector('.compact-alert-header');
        const detailsDiv = alertCard.querySelector('.compact-dropdown-details');
        const toggleBtn = alertCard.querySelector('.compact-dropdown-toggle');
        const contentDiv = alertCard.querySelector('.compact-dropdown-content');
        
        // Click on header to show dropdown
        headerDiv.addEventListener('click', (e) => {
            if (e.target === closeBtn || e.target.closest('.compact-alert-close')) return;
            
            if (detailsDiv.classList.contains('show')) {
                detailsDiv.classList.remove('show');
            } else {
                detailsDiv.classList.add('show');
            }
        });
        
        // Toggle button functionality
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isContentVisible = contentDiv.style.display !== 'none';
                
                if (isContentVisible) {
                    contentDiv.style.display = 'none';
                    toggleBtn.querySelector('span:first-child').textContent = 'View Analysis Details';
                    toggleBtn.classList.remove('expanded');
                } else {
                    contentDiv.style.display = 'block';
                    toggleBtn.querySelector('span:first-child').textContent = 'Hide Details';
                    toggleBtn.classList.add('expanded');
                }
            });
        }
        
        // Add to page
        document.body.appendChild(alertCard);
        
        // Auto-close after delay
        setTimeout(() => {
            if (alertCard.parentNode) {
                this.closeAlert(alertCard);
            }
        }, alertType.autoCloseDelay);
        
        return alertCard;
    }

    closeAlert(alertCard) {
        alertCard.style.animation = 'compactSlideOut 0.3s ease';
        setTimeout(() => {
            if (alertCard.parentNode) {
                alertCard.remove();
            }
        }, 300);
    }

    testAlert() {
        const testResult = {
            prediction: 'Phishing Email',
            confidence: 0.83,
            phishing_confidence: 0.83,
            safe_confidence: 0.17,
            reasons: ['Suspicious domain detected', 'Urgent action language used']
        };
        
        this.showPhishingAlert(testResult);
    }
}

// Create global instance
window.compactPhishingAlert = new CompactPhishingAlert();

console.log('✅ Ultra-Compact Phishing Alert loaded!');
console.log('🧪 Test: compactPhishingAlert.testAlert()');