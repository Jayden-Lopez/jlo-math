// mastery-tracker.js - Track mastery for math topics
// Ensures Jordan masters each chapter before advancing

window.MasteryTracker = (function() {
    'use strict';
    
    // Mastery requirements for each topic
    const MASTERY_REQUIREMENTS = {
        ratios: { minCorrect: 20, minAccuracy: 80, name: "Ratios & Rates" },
        decimals: { minCorrect: 20, minAccuracy: 80, name: "Decimals & Percents" },
        operations: { minCorrect: 25, minAccuracy: 80, name: "Multi-Digit Operations" },
        fractions: { minCorrect: 20, minAccuracy: 80, name: "Fraction Operations" },
        mixedNumbers: { minCorrect: 15, minAccuracy: 80, name: "Mixed Numbers" },
        integers: { minCorrect: 20, minAccuracy: 80, name: "Integer Operations" },
        expressions: { minCorrect: 15, minAccuracy: 80, name: "Algebraic Expressions" },
        algebra: { minCorrect: 20, minAccuracy: 80, name: "Solving Equations" },
        geometry: { minCorrect: 20, minAccuracy: 80, name: "Area & Volume" },
        measurement: { minCorrect: 15, minAccuracy: 80, name: "Measurement" },
        wordProblems: { minCorrect: 15, minAccuracy: 80, name: "Word Problems" }
    };
    
    /**
     * Check if a topic has been mastered
     * @param {string} topicKey - The topic identifier
     * @param {object} userData - User's progress data
     * @returns {object} Mastery status with details
     */
    function checkMastery(topicKey, userData) {
        const requirements = MASTERY_REQUIREMENTS[topicKey];
        if (!requirements) {
            return { mastered: false, progress: { message: "No requirements set" } };
        }
        
        const progress = userData.topicProgress?.[topicKey] || { completed: 0, attempts: 0, accuracy: 0 };
        const accuracy = progress.attempts > 0 ? Math.round((progress.completed / progress.attempts) * 100) : 0;
        
        const correctMet = progress.completed >= requirements.minCorrect;
        const accuracyMet = accuracy >= requirements.minAccuracy;
        const mastered = correctMet && accuracyMet;
        
        let message = '';
        if (mastered) {
            message = '✅ Mastered!';
        } else {
            const needed = [];
            if (!correctMet) {
                const remaining = requirements.minCorrect - progress.completed;
                needed.push(`${remaining} more correct answer${remaining !== 1 ? 's' : ''}`);
            }
            if (!accuracyMet) {
                needed.push(`${requirements.minAccuracy}% accuracy (currently ${accuracy}%)`);
            }
            message = `Need: ${needed.join(' and ')}`;
        }
        
        return {
            mastered,
            progress: {
                completed: progress.completed,
                required: requirements.minCorrect,
                accuracy,
                requiredAccuracy: requirements.minAccuracy,
                message
            }
        };
    }
    
    /**
     * Check if an entire chapter (stage) has been mastered
     * @param {number} stageNum - The chapter/stage number (1-based)
     * @param {object} userData - User's progress data
     * @param {array} learningPath - The learning path configuration
     * @returns {object} Chapter mastery status
     */
    function checkChapterMastery(stageNum, userData, learningPath) {
        const stage = learningPath[stageNum - 1];
        if (!stage) {
            return { mastered: false, topicsMastered: [], topicsNeeded: [] };
        }
        
        const topicsMastered = [];
        const topicsNeeded = [];
        
        stage.topics.forEach(topic => {
            const mastery = checkMastery(topic.key, userData);
            if (mastery.mastered) {
                topicsMastered.push(topic.name);
            } else {
                topicsNeeded.push({
                    name: topic.name,
                    status: mastery.progress.message
                });
            }
        });
        
        const allMastered = topicsNeeded.length === 0;
        
        return {
            mastered: allMastered,
            chapterName: stage.name,
            topicsMastered,
            topicsNeeded,
            totalTopics: stage.topics.length,
            completedTopics: topicsMastered.length
        };
    }
    
    /**
     * Check if a chapter should be unlocked for the student
     * @param {number} chapterNum - The chapter to check
     * @param {object} userData - User's progress data
     * @param {array} learningPath - The learning path configuration
     * @returns {object} Lock status with reasoning
     */
    function isChapterUnlocked(chapterNum, userData, learningPath) {
        // Chapter 1 is always unlocked
        if (chapterNum === 1) {
            return { 
                unlocked: true, 
                reason: "First chapter - always available" 
            };
        }
        
        // Current chapter is always unlocked (teacher may assign it)
        if (chapterNum === userData.currentChapter) {
            return { 
                unlocked: true, 
                reason: "Current chapter assignment" 
            };
        }
        
        // Check if previous chapter is mastered
        const previousChapter = chapterNum - 1;
        const previousMastery = checkChapterMastery(previousChapter, userData, learningPath);
        
        if (previousMastery.mastered) {
            return { 
                unlocked: true, 
                reason: "Previous chapter mastered" 
            };
        }
        
        // Check if this is an earlier chapter (allow review)
        if (chapterNum < userData.currentChapter) {
            return { 
                unlocked: true, 
                reason: "Earlier chapter - available for review" 
            };
        }
        
        // Lock future chapters until previous is mastered
        return { 
            unlocked: false, 
            reason: `Complete Chapter ${previousChapter} first`,
            blockingChapter: previousChapter,
            stillNeeded: previousMastery.topicsNeeded
        };
    }
    
    /**
     * Get a progress summary for parent dashboard
     * @param {object} userData - User's progress data
     * @param {array} learningPath - The learning path configuration
     * @returns {array} Summary of all chapters
     */
    function getProgressSummary(userData, learningPath) {
        return learningPath.map((stage, index) => {
            const chapterNum = index + 1;
            const mastery = checkChapterMastery(chapterNum, userData, learningPath);
            const unlockStatus = isChapterUnlocked(chapterNum, userData, learningPath);
            
            return {
                chapter: chapterNum,
                name: stage.name,
                unlocked: unlockStatus.unlocked,
                mastered: mastery.mastered,
                progress: `${mastery.completedTopics}/${mastery.totalTopics}`,
                topicsNeeded: mastery.topicsNeeded,
                isCurrent: chapterNum === userData.currentChapter
            };
        });
    }
    
    /**
     * Suggest what Jordan should practice next
     * @param {object} userData - User's progress data
     * @param {array} learningPath - The learning path configuration
     * @returns {object} Recommendation for next practice
     */
    function getRecommendation(userData, learningPath) {
        const currentChapter = userData.currentChapter || 1;
        const mastery = checkChapterMastery(currentChapter, userData, learningPath);
        
        if (mastery.topicsNeeded.length > 0) {
            // Find the topic with lowest progress
            const stage = learningPath[currentChapter - 1];
            let needsMostPractice = null;
            let lowestProgress = Infinity;
            
            mastery.topicsNeeded.forEach(needed => {
                const topicData = stage.topics.find(t => t.name === needed.name);
                if (topicData) {
                    const progress = userData.topicProgress?.[topicData.key] || { completed: 0 };
                    if (progress.completed < lowestProgress) {
                        lowestProgress = progress.completed;
                        needsMostPractice = {
                            key: topicData.key,
                            name: needed.name,
                            status: needed.status
                        };
                    }
                }
            });
            
            return {
                type: 'focus',
                topic: needsMostPractice,
                message: `Focus on ${needsMostPractice.name} - ${needsMostPractice.status}`
            };
        } else if (mastery.mastered) {
            return {
                type: 'advance',
                message: `🎉 Chapter ${currentChapter} mastered! Ready for Chapter ${currentChapter + 1}`,
                nextChapter: currentChapter + 1
            };
        } else {
            return {
                type: 'continue',
                message: `Keep practicing Chapter ${currentChapter}!`
            };
        }
    }
    
    // Public API
    return {
        checkMastery,
        checkChapterMastery,
        isChapterUnlocked,
        getProgressSummary,
        getRecommendation,
        MASTERY_REQUIREMENTS
    };
})();
