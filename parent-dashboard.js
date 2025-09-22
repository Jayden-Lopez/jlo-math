// parent-dashboard.js - Complete Parent Dashboard Functionality
// This module handles all parent control features

window.ParentDashboard = {
    // Show the main parent controls with all features
    showControls: function(userData, parentSettings, topics, modalContent) {
        const accuracy = userData.totalAttempts > 0 ? 
            Math.round((userData.correctCount / userData.totalAttempts) * 100) : 0;
        
        const startDate = new Date(userData.startDate || userData.ixlHistory?.[0]?.date || new Date());
        const daysActive = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const problemsPerDay = daysActive > 0 ? Math.round(userData.correctCount / daysActive) : 0;
        
        const initialLevel = userData.levelHistory?.[0]?.level || "Beginner";
        const currentLevel = this.calculateLevel(userData.correctCount);
        const levelProgress = this.getLevelProgress(userData.correctCount);
        
        // Build progress chart
        let progressChart = '';
        if (userData.ixlHistory && userData.ixlHistory.length > 0) {
            const recentHistory = userData.ixlHistory.slice(-30);
            const maxProblems = Math.max(...recentHistory.map(h => h.totalCompleted));
            
            progressChart = `
                <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin-top: 10px;">
                    <h4>Progress Timeline (Last 30 Sessions)</h4>
                    <div style="display: flex; align-items: flex-end; height: 150px; gap: 2px; margin-top: 15px;">
                        ${recentHistory.map(entry => {
                            const height = maxProblems > 0 ? (entry.totalCompleted / maxProblems) * 100 : 5;
                            const date = new Date(entry.date);
                            return `
                                <div style="flex: 1; background: linear-gradient(to top, #667eea, #764ba2); 
                                            height: ${height}%; min-height: 5px; border-radius: 2px 2px 0 0;"
                                     title="${date.toLocaleDateString()}: ${entry.totalCompleted} problems (${entry.accuracy}% accuracy)">
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.8em; color: #666;">
                        <span>Start</span>
                        <span>Recent Sessions</span>
                        <span>Now</span>
                    </div>
                </div>
            `;
        }
        
        // Build topic statistics
        let topicStats = '';
        for (const [key, topic] of Object.entries(topics)) {
            const progress = userData.topicProgress?.[key] || { completed: 0, attempts: 0, accuracy: 0 };
            const topicAccuracy = progress.attempts > 0 ? 
                Math.round((progress.completed / progress.attempts) * 100) : 0;
            const isLocked = parentSettings.lockedTopics && parentSettings.lockedTopics.includes(key);
            
            let skillLevel = '';
            if (progress.completed === 0) skillLevel = '⚪ Not Started';
            else if (progress.completed < 5) skillLevel = '🔵 Beginning';
            else if (progress.completed < 10) skillLevel = '🟢 Developing';
            else if (progress.completed < 20) skillLevel = '🟡 Proficient';
            else skillLevel = '🟣 Mastered';
            
            topicStats += `
                <div style="margin: 10px 0; padding: 15px; background: #f0f0f0; border-radius: 10px; 
                            display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <strong>${topic.icon} ${topic.name} ${isLocked ? '🔒' : ''}</strong><br>
                        <span style="font-size: 0.9em; color: #666;">
                            ${skillLevel} | ${progress.completed} completed | ${progress.attempts} attempts | ${topicAccuracy}% accuracy
                        </span>
                        <div style="background: #e2e8f0; height: 8px; border-radius: 4px; margin-top: 5px;">
                            <div style="background: linear-gradient(90deg, #667eea, #764ba2); 
                                        width: ${Math.min(topicAccuracy, 100)}%; height: 100%; 
                                        border-radius: 4px; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-small ${isLocked ? 'btn-unlock' : 'btn-lock'}" 
                                onclick="ParentDashboard.toggleTopicLock('${key}')" 
                                style="padding: 5px 10px; font-size: 0.9em;">
                            ${isLocked ? 'Unlock' : 'Lock'}
                        </button>
                        <button class="btn btn-small btn-reset" onclick="ParentDashboard.resetTopic('${key}')" 
                                style="padding: 5px 10px; font-size: 0.9em; background: #f56565;">
                            Reset
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Learning path status
        const currentStage = userData.currentStage || 1;
        const pathStatus = `
            <div style="background: #f0fff4; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>🎯 Learning Path Progress</h3>
                <p>Current Stage: <strong>${currentStage} of ${window.learningPath ? window.learningPath.length : 6}</strong> - ${window.learningPath?.[currentStage - 1]?.name || 'Complete!'}</p>
                <button class="btn btn-small" onclick="togglePathMode()" 
                        style="padding: 5px 15px; background: #9ca3af; margin-top: 10px;">
                    ${userData.pathMode ? 'Disable' : 'Enable'} Learning Path
                </button>
            </div>
        `;
        
        // Build complete dashboard HTML
        modalContent.innerHTML = `
            <span class="close" onclick="closeParentDashboard()">&times;</span>
            <h2>👨‍👩‍👦 Parent Dashboard</h2>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; border-radius: 10px; padding: 20px; margin: 15px 0;">
                <h3>📈 IXL-Style Progress Report</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 0.9em; opacity: 0.9;">Starting Level</div>
                        <div style="font-size: 1.8em; font-weight: bold;">${initialLevel}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 0.9em; opacity: 0.9;">Current Level</div>
                        <div style="font-size: 1.8em; font-weight: bold;">${currentLevel}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 0.9em; opacity: 0.9;">Days Active</div>
                        <div style="font-size: 1.8em; font-weight: bold;">${daysActive}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 0.9em; opacity: 0.9;">Avg Per Day</div>
                        <div style="font-size: 1.8em; font-weight: bold;">${problemsPerDay}</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <div style="font-size: 0.9em; opacity: 0.9; margin-bottom: 5px;">Progress to Next Level: ${levelProgress.current}/${levelProgress.needed}</div>
                    <div style="background: rgba(255,255,255,0.3); height: 20px; border-radius: 10px;">
                        <div style="background: white; width: ${levelProgress.percentage}%; height: 100%; 
                                    border-radius: 10px; transition: width 0.5s;"></div>
                    </div>
                </div>
                
                ${progressChart}
            </div>
            
            <div style="background: #e6fffa; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>📊 Overall Statistics</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div style="text-align: center; background: white; padding: 10px; border-radius: 8px;">
                        <div style="font-size: 0.9em; color: #666;">Problems Completed</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #667eea;">${userData.correctCount}</div>
                    </div>
                    <div style="text-align: center; background: white; padding: 10px; border-radius: 8px;">
                        <div style="font-size: 0.9em; color: #666;">Total Attempts</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #667eea;">${userData.totalAttempts}</div>
                    </div>
                    <div style="text-align: center; background: white; padding: 10px; border-radius: 8px;">
                        <div style="font-size: 0.9em; color: #666;">Accuracy</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #667eea;">${accuracy}%</div>
                    </div>
                    <div style="text-align: center; background: white; padding: 10px; border-radius: 8px;">
                        <div style="font-size: 0.9em; color: #666;">Current Streak</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #667eea;">${window.currentStreak || 0} 🔥</div>
                    </div>
                </div>
            </div>
            
            ${pathStatus}
            
            <div style="background: #fef5e7; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>🎯 Daily Goal</h3>
                <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px;">
                    <label>Problems per day:</label>
                    <input type="number" id="dailyGoal" value="${userData.dailyGoal}" min="5" max="100" 
                           style="width: 80px; padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
                    <button class="btn btn-small" onclick="ParentDashboard.updateDailyGoal()" 
                            style="padding: 5px 15px; background: #48bb78;">Update</button>
                    <span style="margin-left: auto;">Today's Progress: ${userData.completedToday}/${userData.dailyGoal}</span>
                </div>
            </div>
            
            <div style="background: #fff; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>📚 Topic Progress & Controls</h3>
                ${topicStats}
            </div>
            
            <div style="background: #fee; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>⚙️ Reset Options</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;">
                    <button class="btn btn-warning" onclick="ParentDashboard.resetLowPerformance()" 
                            style="background: #ed8936;">Reset Topics Below 70%</button>
                    <button class="btn btn-danger" onclick="ParentDashboard.resetAllProgress()" 
                            style="background: #e53e3e;">Reset All Progress</button>
                </div>
            </div>
            
            <div style="background: #f0f0ff; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>🔐 Security Settings</h3>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
                    <button class="btn btn-primary" onclick="ParentDashboard.showChangePIN()">Change PIN</button>
                    <span style="font-size: 0.9em; color: #666;">
                        Last changed: ${parentSettings.lastPinChange ? 
                            new Date(parentSettings.lastPinChange).toLocaleDateString() : 'Never'}
                    </span>
                </div>
            </div>
            
            <div style="background: #f5f5f5; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>📅 Activity History</h3>
                <p style="font-size: 0.9em; color: #666;">
                    Started: ${new Date(userData.startDate || userData.ixlHistory?.[0]?.date || new Date()).toLocaleDateString()}<br>
                    Last Active: ${new Date(userData.lastActivity).toLocaleString()}<br>
                    Total Days: ${daysActive} days<br>
                    Session Started: ${parentSettings.initialized ? 'Yes' : 'First Time - Please Change PIN!'}
                </p>
            </div>
        `;
        
        // Mark as initialized
        if (!parentSettings.initialized) {
            parentSettings.initialized = true;
            window.saveParentSettings();
        }
    },

    // Calculate level based on correct answers
    calculateLevel: function(correctAnswers) {
        if (correctAnswers < 10) return "Beginner";
        if (correctAnswers < 25) return "Learning";
        if (correctAnswers < 50) return "Practicing";
        if (correctAnswers < 100) return "Improving";
        if (correctAnswers < 200) return "Advanced";
        if (correctAnswers < 500) return "Expert";
        return "Math Master 🏆";
    },

    // Get level progress details
    getLevelProgress: function(correctAnswers) {
        let needed, nextLevel;
        
        if (correctAnswers < 10) { needed = 10; nextLevel = "Learning"; }
        else if (correctAnswers < 25) { needed = 25; nextLevel = "Practicing"; }
        else if (correctAnswers < 50) { needed = 50; nextLevel = "Improving"; }
        else if (correctAnswers < 100) { needed = 100; nextLevel = "Advanced"; }
        else if (correctAnswers < 200) { needed = 200; nextLevel = "Expert"; }
        else if (correctAnswers < 500) { needed = 500; nextLevel = "Math Master"; }
        else { needed = 1000; nextLevel = "Legendary"; }
        
        const previousThreshold = correctAnswers < 10 ? 0 :
                                 correctAnswers < 25 ? 10 :
                                 correctAnswers < 50 ? 25 :
                                 correctAnswers < 100 ? 50 :
                                 correctAnswers < 200 ? 100 :
                                 correctAnswers < 500 ? 200 : 500;
        
        const progressInLevel = correctAnswers - previousThreshold;
        const neededInLevel = needed - previousThreshold;
        const percentage = Math.round((progressInLevel / neededInLevel) * 100);
        
        return {
            current: correctAnswers,
            needed: needed,
            nextLevel: nextLevel,
            percentage: percentage
        };
    },

    // Toggle topic lock
    toggleTopicLock: function(topicKey) {
        const parentSettings = window.parentSettings;
        if (!parentSettings.lockedTopics) {
            parentSettings.lockedTopics = [];
        }
        
        const index = parentSettings.lockedTopics.indexOf(topicKey);
        if (index > -1) {
            parentSettings.lockedTopics.splice(index, 1);
        } else {
            parentSettings.lockedTopics.push(topicKey);
        }
        
        window.saveParentSettings();
        window.showParentControls();
    },

    // Reset specific topic
    resetTopic: function(topicKey) {
        const topicName = window.topics[topicKey].name;
        if (confirm(`Are you sure you want to reset progress for ${topicName}? This cannot be undone.`)) {
            window.userData.topicProgress[topicKey] = { completed: 0, attempts: 0, accuracy: 0 };
            window.saveUserData();
            window.showParentControls();
            alert(`${topicName} has been reset!`);
        }
    },

    // Reset low performance topics
    resetLowPerformance: function() {
        let topicsReset = [];
        const userData = window.userData;
        const topics = window.topics;
        
        for (const [key, topic] of Object.entries(topics)) {
            const progress = userData.topicProgress?.[key];
            if (progress && progress.attempts > 0) {
                const accuracy = (progress.completed / progress.attempts) * 100;
                if (accuracy < 70) {
                    topicsReset.push(topic.name);
                    userData.topicProgress[key] = { completed: 0, attempts: 0, accuracy: 0 };
                }
            }
        }
        
        if (topicsReset.length > 0) {
            if (confirm(`Reset the following topics with accuracy below 70%?\n\n${topicsReset.join(', ')}`)) {
                window.saveUserData();
                window.showParentControls();
                alert(`Reset ${topicsReset.length} topics!`);
            }
        } else {
            alert("No topics have accuracy below 70%!");
        }
    },

    // Reset all progress
    resetAllProgress: function() {
        if (confirm("⚠️ WARNING: This will reset ALL progress!\n\nAre you absolutely sure?")) {
            if (confirm("This action cannot be undone. Final confirmation to reset everything?")) {
                const userData = window.userData;
                // Preserve daily goal and other settings
                const preservedGoal = userData.dailyGoal || 20;
                
                // Reset userData
                window.userData = {
                    completedProblems: {},
                    totalAttempts: 0,
                    correctCount: 0,
                    topicProgress: {},
                    lastActivity: new Date().toISOString(),
                    dailyGoal: preservedGoal,
                    completedToday: 0,
                    lastResetDate: new Date().toISOString(),
                    ixlHistory: [],
                    startDate: new Date().toISOString(),
                    levelHistory: [],
                    currentStage: 1,
                    pathMode: true,
                    version: window.APP_VERSION || '1.1.0'
                };
                
                window.currentStreak = 0;
                window.saveUserData();
                window.updateStats();
                window.updateLevel();
                window.initializeTopics();
                window.showParentControls();
                alert("All progress has been reset!");
            }
        }
    },

    // Update daily goal
    updateDailyGoal: function() {
        const newGoal = parseInt(document.getElementById('dailyGoal').value);
        if (newGoal >= 5 && newGoal <= 100) {
            window.userData.dailyGoal = newGoal;
            window.saveUserData();
            window.updateDailyProgress();
            alert(`Daily goal updated to ${newGoal} problems!`);
        } else {
            alert("Daily goal must be between 5 and 100 problems.");
        }
    },

    // Show change PIN interface
    showChangePIN: function() {
        const modalContent = document.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <span class="close" onclick="showParentControls()">&times;</span>
            <h2>🔐 Change PIN</h2>
            <div style="padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;">Current PIN:</label>
                    <input type="password" id="currentPIN" maxlength="4" pattern="[0-9]*" inputmode="numeric"
                           style="width: 150px; padding: 10px; font-size: 18px; border: 2px solid #cbd5e0; border-radius: 10px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;">New PIN:</label>
                    <input type="password" id="newPIN" maxlength="4" pattern="[0-9]*" inputmode="numeric"
                           style="width: 150px; padding: 10px; font-size: 18px; border: 2px solid #cbd5e0; border-radius: 10px;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;">Confirm New PIN:</label>
                    <input type="password" id="confirmPIN" maxlength="4" pattern="[0-9]*" inputmode="numeric"
                           style="width: 150px; padding: 10px; font-size: 18px; border: 2px solid #cbd5e0; border-radius: 10px;">
                </div>
                <button class="btn btn-primary" onclick="ParentDashboard.changePIN()">Change PIN</button>
                <button class="btn btn-back" onclick="showParentControls()" style="margin-left: 10px;">Cancel</button>
                <div id="pinChangeError" style="color: red; margin-top: 10px;"></div>
            </div>
        `;
    },

    // Change PIN
    changePIN: function() {
        const currentPIN = document.getElementById('currentPIN').value;
        const newPIN = document.getElementById('newPIN').value;
        const confirmPIN = document.getElementById('confirmPIN').value;
        const errorDiv = document.getElementById('pinChangeError');
        
        if (currentPIN.length !== 4 || newPIN.length !== 4 || confirmPIN.length !== 4) {
            errorDiv.textContent = 'All PINs must be 4 digits';
            return;
        }
        
        if (window.hashPIN(currentPIN) !== window.parentSettings.pinHash) {
            errorDiv.textContent = 'Current PIN is incorrect';
            return;
        }
        
        if (newPIN !== confirmPIN) {
            errorDiv.textContent = 'New PINs do not match';
            return;
        }
        
        if (newPIN === currentPIN) {
            errorDiv.textContent = 'New PIN must be different from current PIN';
            return;
        }
        
        window.parentSettings.pinHash = window.hashPIN(newPIN);
        window.parentSettings.lastPinChange = new Date().toISOString();
        window.saveParentSettings();
        
        alert('PIN changed successfully!');
        window.showParentControls();
    }
};
