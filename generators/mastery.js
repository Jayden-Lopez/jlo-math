window.MasteryTracker = {
    checkMastery: function(topicKey, userData) {
        const progress = userData.topicProgress[topicKey] || { completed: 0, attempts: 0 };
        const accuracy = progress.attempts > 0 ? (progress.completed / progress.attempts) * 100 : 0;
        
        const mastered = progress.completed >= 20 && accuracy >= 85;
        
        return {
            mastered: mastered,
            progress: {
                completed: progress.completed,
                accuracy: Math.round(accuracy),
                needed: Math.max(0, 20 - progress.completed),
                message: mastered ? 
                    "🏆 Topic Mastered! Great job!" : 
                    `Keep going! ${Math.max(0, 20 - progress.completed)} more correct answers needed`
            }
        };
    }
};
