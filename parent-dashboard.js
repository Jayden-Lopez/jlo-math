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
        
        // Build chapter statistics
        let chapterStats = '';
        const chapters = window.learningPath || [];
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            const chapterNum = i + 1;
            const isLocked = parentSettings.lockedChapters && parentSettings.lockedChapters.includes(chapterNum);

            // Check if chapter is accessible based on mastery
            const unlockStatus = window.MasteryTracker ?
                window.MasteryTracker.isChapterUnlocked(chapterNum, userData, chapters) :
                { unlocked: true, reason: "Mastery tracking disabled" };

            const isManuallyUnlocked = parentSettings.manuallyUnlockedChapters &&
                                      parentSettings.manuallyUnlockedChapters.includes(chapterNum);

            // Check chapter mastery
            const chapterMastery = window.MasteryTracker ?
                window.MasteryTracker.checkChapterMastery(chapterNum, userData, chapters) :
                { mastered: false };

            // Calculate chapter progress
            let totalCompleted = 0;
            let totalAttempts = 0;
            for (const topicInfo of chapter.topics) {
                const progress = userData.topicProgress?.[topicInfo.key] || { completed: 0, attempts: 0 };
                totalCompleted += progress.completed;
                totalAttempts += progress.attempts;
            }
            const chapterAccuracy = totalAttempts > 0 ? Math.round((totalCompleted / totalAttempts) * 100) : 0;

            // Status badges
            let statusBadge = '';
            if (chapterMastery.mastered) {
                statusBadge = '<span style="background: #48bb78; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.85em; margin-left: 10px;">✓ Mastered</span>';
            } else if (isManuallyUnlocked) {
                statusBadge = '<span style="background: #ed8936; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.85em; margin-left: 10px;">⚠ Force Unlocked</span>';
            } else if (!unlockStatus.unlocked) {
                statusBadge = '<span style="background: #e53e3e; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.85em; margin-left: 10px;">🔒 Locked</span>';
            } else {
                statusBadge = '<span style="background: #667eea; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.85em; margin-left: 10px;">📖 Available</span>';
            }

            chapterStats += `
                <div style="margin: 10px 0; padding: 15px; background: ${isLocked ? '#ffe6e6' : '#f0f0f0'};
                            border-radius: 10px; border-left: 4px solid ${isLocked ? '#e53e3e' : chapterMastery.mastered ? '#48bb78' : '#667eea'};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <div>
                                <strong style="font-size: 1.1em;">${chapter.name} ${isLocked ? '🔒' : ''}</strong>
                                ${statusBadge}
                            </div>
                            <span style="font-size: 0.9em; color: #666; display: block; margin-top: 5px;">
                                ${chapter.description}
                            </span>
                            ${!unlockStatus.unlocked && !isManuallyUnlocked ?
                                `<span style="font-size: 0.85em; color: #e53e3e; display: block; margin-top: 5px; font-weight: bold;">
                                    ⚠ ${unlockStatus.reason}
                                </span>` : ''}
                            <span style="font-size: 0.85em; color: #888; display: block; margin-top: 5px;">
                                Topics: ${chapter.topics.map(t => topics[t.key]?.name || t.name).join(', ')}
                            </span>
                            <div style="background: #e2e8f0; height: 10px; border-radius: 5px; margin-top: 8px;">
                                <div style="background: linear-gradient(90deg, #667eea, #764ba2);
                                            width: ${Math.min(chapterAccuracy, 100)}%; height: 100%;
                                            border-radius: 5px; transition: width 0.3s;"></div>
                            </div>
                            <span style="font-size: 0.85em; color: #666; margin-top: 3px; display: block;">
                                ${totalCompleted} completed | ${totalAttempts} attempts | ${chapterAccuracy}% accuracy
                            </span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-left: 20px;">
                            ${!unlockStatus.unlocked && !isManuallyUnlocked ? `
                                <button class="btn btn-small"
                                        onclick="ParentDashboard.forceUnlockChapter(${chapterNum})"
                                        style="padding: 8px 15px; font-size: 0.9em; background: #ed8936; white-space: nowrap;">
                                    ⚡ Force Unlock
                                </button>
                            ` : isManuallyUnlocked ? `
                                <button class="btn btn-small"
                                        onclick="ParentDashboard.removeForcedUnlock(${chapterNum})"
                                        style="padding: 8px 15px; font-size: 0.9em; background: #718096; white-space: nowrap;">
                                    ↩ Remove Force
                                </button>
                            ` : ''}
                            <button class="btn btn-small ${isLocked ? 'btn-unlock' : 'btn-lock'}"
                                    onclick="ParentDashboard.toggleChapterLock(${chapterNum})"
                                    style="padding: 8px 15px; font-size: 0.9em; ${isLocked ? 'background: #48bb78;' : ''} white-space: nowrap;">
                                ${isLocked ? '🔓 Unlock Access' : '🔒 Lock Access'}
                            </button>
                        </div>
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

            <div style="background: #e8f4fd; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>📖 Chapter Controls</h3>
                <div style="font-size: 0.9em; color: #666; margin-bottom: 15px; background: white; padding: 12px; border-radius: 8px;">
                    <strong>Two types of chapter controls:</strong><br>
                    • <strong>⚡ Force Unlock:</strong> Override mastery requirements to give access to locked chapters (useful when teacher assigns specific topics)<br>
                    • <strong>🔒 Lock Access:</strong> Completely block access to a chapter regardless of mastery
                </div>
                ${chapterStats}
            </div>

            <div style="background: #fef5e7; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>🎯 Practice Settings</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Questions per Session:</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="number" id="questionsPerSession" value="${parentSettings.questionsPerSession || 10}" min="5" max="25"
                                   style="width: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
                            <button class="btn btn-small" onclick="ParentDashboard.updateQuestionsPerSession()"
                                    style="padding: 8px 15px; background: #667eea;">Save</button>
                        </div>
                        <span style="font-size: 0.85em; color: #666; margin-top: 5px; display: block;">How many questions in each practice round</span>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Daily Goal:</label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="number" id="dailyGoal" value="${userData.dailyGoal}" min="5" max="100"
                                   style="width: 80px; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
                            <button class="btn btn-small" onclick="ParentDashboard.updateDailyGoal()"
                                    style="padding: 8px 15px; background: #48bb78;">Save</button>
                        </div>
                        <span style="font-size: 0.85em; color: #666; margin-top: 5px; display: block;">Today: ${userData.completedToday}/${userData.dailyGoal} completed</span>
                    </div>
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

            <div style="background: #fff9e6; border-radius: 10px; padding: 15px; margin: 15px 0;">
                <h3>📝 Detailed Activity Log</h3>
                <p style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
                    See exactly what Jordan worked on, what he got right/wrong, and when he used hints
                </p>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button class="btn btn-small" onclick="ParentDashboard.showActivityLog('today')"
                            style="padding: 8px 15px; background: #48bb78;">Today</button>
                    <button class="btn btn-small" onclick="ParentDashboard.showActivityLog('week')"
                            style="padding: 8px 15px; background: #667eea;">This Week</button>
                    <button class="btn btn-small" onclick="ParentDashboard.showActivityLog('all')"
                            style="padding: 8px 15px; background: #9ca3af;">All Time</button>
                </div>
                <div id="activityLogContent" style="max-height: 500px; overflow-y: auto;">
                    <p style="color: #999; font-style: italic;">Click a button above to view activity</p>
                </div>
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

    // Toggle chapter lock
    toggleChapterLock: function(chapterNum) {
        const parentSettings = window.parentSettings;
        if (!parentSettings.lockedChapters) {
            parentSettings.lockedChapters = [];
        }

        const index = parentSettings.lockedChapters.indexOf(chapterNum);
        if (index > -1) {
            parentSettings.lockedChapters.splice(index, 1);
            alert(`Chapter ${chapterNum} access has been unlocked!`);
        } else {
            parentSettings.lockedChapters.push(chapterNum);
            alert(`Chapter ${chapterNum} access has been locked!`);
        }

        window.saveParentSettings();
        window.showParentControls();
    },

    // Force unlock a chapter (bypass mastery requirements)
    forceUnlockChapter: function(chapterNum) {
        const chapterName = window.learningPath[chapterNum - 1]?.name || `Chapter ${chapterNum}`;

        if (confirm(`⚡ Force unlock ${chapterName}?\n\nThis will allow your son to access this chapter even though he hasn't mastered the previous chapter.\n\nThis is useful if he needs to work on specific topics that his teacher assigned.`)) {
            const parentSettings = window.parentSettings;
            if (!parentSettings.manuallyUnlockedChapters) {
                parentSettings.manuallyUnlockedChapters = [];
            }

            if (!parentSettings.manuallyUnlockedChapters.includes(chapterNum)) {
                parentSettings.manuallyUnlockedChapters.push(chapterNum);
                window.saveParentSettings();
                alert(`✓ ${chapterName} has been force unlocked!\n\nYour son can now access this chapter.`);
                window.showParentControls();
            }
        }
    },

    // Remove forced unlock (return to normal mastery-based progression)
    removeForcedUnlock: function(chapterNum) {
        const chapterName = window.learningPath[chapterNum - 1]?.name || `Chapter ${chapterNum}`;

        if (confirm(`Remove force unlock for ${chapterName}?\n\nThe chapter will only be accessible if the previous chapter has been mastered.`)) {
            const parentSettings = window.parentSettings;
            if (parentSettings.manuallyUnlockedChapters) {
                const index = parentSettings.manuallyUnlockedChapters.indexOf(chapterNum);
                if (index > -1) {
                    parentSettings.manuallyUnlockedChapters.splice(index, 1);
                    window.saveParentSettings();
                    alert(`✓ Force unlock removed for ${chapterName}.\n\nNormal mastery progression will apply.`);
                    window.showParentControls();
                }
            }
        }
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

    // Update questions per session
    updateQuestionsPerSession: function() {
        const newValue = parseInt(document.getElementById('questionsPerSession').value);
        if (newValue >= 5 && newValue <= 25) {
            window.parentSettings.questionsPerSession = newValue;
            window.questionsPerSession = newValue;
            window.saveParentSettings();
            alert(`Questions per session updated to ${newValue}!`);
        } else {
            alert("Questions per session must be between 5 and 25.");
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
    },

    // Show activity log filtered by time period
    showActivityLog: function(period) {
        const userData = window.userData;
        const activityLog = userData.activityLog || [];
        const contentDiv = document.getElementById('activityLogContent');

        if (activityLog.length === 0) {
            contentDiv.innerHTML = '<p style="color: #999; font-style: italic;">No activity recorded yet</p>';
            return;
        }

        // Filter by time period
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        let filteredLog = activityLog.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            if (period === 'today') {
                return entryDate >= today;
            } else if (period === 'week') {
                return entryDate >= weekAgo;
            } else {
                return true; // all
            }
        });

        // Sort by timestamp, newest first
        filteredLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (filteredLog.length === 0) {
            contentDiv.innerHTML = `<p style="color: #999; font-style: italic;">No activity in this time period</p>`;
            return;
        }

        // Group by date
        const groupedByDate = {};
        filteredLog.forEach(entry => {
            const date = new Date(entry.timestamp).toLocaleDateString();
            if (!groupedByDate[date]) {
                groupedByDate[date] = [];
            }
            groupedByDate[date].push(entry);
        });

        // Build HTML
        let html = '';
        Object.keys(groupedByDate).forEach(date => {
            const entries = groupedByDate[date];
            const correctCount = entries.filter(e => e.isCorrect).length;
            const incorrectCount = entries.length - correctCount;
            const hintCount = entries.filter(e => e.hintUsed).length;

            html += `
                <div style="margin-bottom: 20px;">
                    <div style="background: #667eea; color: white; padding: 10px; border-radius: 8px 8px 0 0;
                                display: flex; justify-content: space-between; align-items: center;">
                        <strong style="font-size: 1.1em;">📅 ${date}</strong>
                        <span style="font-size: 0.9em;">
                            ✅ ${correctCount} | ❌ ${incorrectCount} | 💡 ${hintCount} hints
                        </span>
                    </div>
                    <div style="background: white; padding: 10px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            `;

            entries.forEach(entry => {
                const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const statusIcon = entry.isCorrect ? '✅' : '❌';
                const statusColor = entry.isCorrect ? '#48bb78' : '#e53e3e';

                html += `
                    <div style="margin: 10px 0; padding: 12px; background: ${entry.isCorrect ? '#f0fff4' : '#fff5f5'};
                                border-left: 4px solid ${statusColor}; border-radius: 5px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                            <div style="flex: 1;">
                                <strong style="color: ${statusColor};">${statusIcon} ${entry.topicName}</strong>
                                <span style="font-size: 0.85em; color: #666; margin-left: 10px;">
                                    ${time} • ${entry.timeSpent}s
                                    ${entry.hintUsed ? ' • 💡 Used hint' : ''}
                                </span>
                            </div>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>Question:</strong> ${entry.question}
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em;">
                            <div>
                                <strong>Jordan's Answer:</strong>
                                <span style="color: ${statusColor}; font-weight: bold;">${entry.userAnswer}</span>
                            </div>
                            ${!entry.isCorrect ? `
                                <div>
                                    <strong>Correct Answer:</strong>
                                    <span style="color: #48bb78; font-weight: bold;">${entry.correctAnswer}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        contentDiv.innerHTML = html;
    }
};
