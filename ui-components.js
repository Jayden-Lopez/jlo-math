// UI Components Module for Jordan's Math Practice
// This file contains reusable UI components to keep the main app.js cleaner

// Scratch Pad Component
const ScratchPad = {
    isVisible: false,
    
    // Create the scratch pad button (starts hidden)
    createButton: function() {
        return `
            <button id="scratchPadOpenBtn" onclick="ScratchPad.show()" 
                    style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); 
                           color: #92400e; border: none; 
                           padding: 10px 20px; border-radius: 15px; cursor: pointer; 
                           font-weight: bold; margin-bottom: 15px;
                           box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                           transition: transform 0.2s;">
                ✏️ Need Scratch Paper?
            </button>
            <div id="scratchPadContainer" style="display: none; background: #fffbf0; 
                 border: 2px dashed #fbbf24; border-radius: 15px; padding: 15px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="color: #92400e; font-weight: bold;">✏️ Scratch Pad</label>
                    <div>
                        <button onclick="ScratchPad.undo()" style="background: #60a5fa; color: white; border: none; 
                                padding: 5px 12px; border-radius: 10px; cursor: pointer; font-weight: bold; margin-right: 5px;"
                                title="Undo last line">
                            ↶ Undo
                        </button>
                        <button onclick="ScratchPad.eraseLast()" style="background: #fb923c; color: white; border: none; 
                                padding: 5px 12px; border-radius: 10px; cursor: pointer; font-weight: bold; margin-right: 5px;"
                                title="Erase last line">
                            ⌫ Erase Line
                        </button>
                        <button onclick="ScratchPad.clear()" style="background: #fbbf24; color: #92400e; border: none; 
                                padding: 5px 12px; border-radius: 10px; cursor: pointer; font-weight: bold; margin-right: 5px;"
                                title="Clear everything">
                            🧹 Clear All
                        </button>
                        <button onclick="ScratchPad.hide()" style="background: #f59e0b; color: white; border: none; 
                                padding: 5px 12px; border-radius: 10px; cursor: pointer; font-weight: bold;"
                                title="Hide scratch pad">
                            ✕ Close
                        </button>
                    </div>
                </div>
                <textarea id="scratchPad" style="width: 100%; height: 150px; padding: 10px; border: 1px solid #fcd34d; 
                          border-radius: 10px; font-size: 1.2em; font-family: 'Comic Sans MS', cursive; 
                          background: white; resize: vertical;"
                          placeholder="Work out the problem here... 
Press Enter for a new line.
Click 'Erase Line' to remove the last line.
Click 'Undo' to undo your last action."></textarea>
                <div style="margin-top: 10px; font-size: 0.9em; color: #92400e;">
                    💡 Tip: Press Enter after each step to keep your work organized!
                </div>
            </div>
        `;
    },
    
    // Show the scratch pad
    show: function() {
        const container = document.getElementById('scratchPadContainer');
        const button = document.getElementById('scratchPadOpenBtn');
        if (container && button) {
            container.style.display = 'block';
            button.style.display = 'none';
            this.isVisible = true;
            // Focus on the textarea
            const scratchPad = document.getElementById('scratchPad');
            if (scratchPad) scratchPad.focus();
        }
    },
    
    // Hide the scratch pad
    hide: function() {
        const container = document.getElementById('scratchPadContainer');
        const button = document.getElementById('scratchPadOpenBtn');
        if (container && button) {
            container.style.display = 'none';
            button.style.display = 'block';
            this.isVisible = false;
        }
    },
    
    // Clear all content
    clear: function() {
        const scratchPad = document.getElementById('scratchPad');
        if (scratchPad) {
            // Save to history for undo
            this.saveToHistory();
            scratchPad.value = '';
            scratchPad.focus();
        }
    },
    
    // Erase the last line
    eraseLast: function() {
        const scratchPad = document.getElementById('scratchPad');
        if (scratchPad) {
            // Save to history for undo
            this.saveToHistory();
            
            const lines = scratchPad.value.split('\n');
            // Remove the last non-empty line
            for (let i = lines.length - 1; i >= 0; i--) {
                if (lines[i].trim() !== '') {
                    lines.splice(i, 1);
                    break;
                }
            }
            scratchPad.value = lines.join('\n');
            scratchPad.focus();
        }
    },
    
    // History for undo functionality
    history: [],
    maxHistory: 10,
    
    // Save current state to history
    saveToHistory: function() {
        const scratchPad = document.getElementById('scratchPad');
        if (scratchPad) {
            this.history.push(scratchPad.value);
            // Keep only last 10 states
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }
        }
    },
    
    // Undo last action
    undo: function() {
        if (this.history.length > 0) {
            const scratchPad = document.getElementById('scratchPad');
            if (scratchPad) {
                scratchPad.value = this.history.pop();
                scratchPad.focus();
            }
        }
    },
    
    // Get current content
    getContent: function() {
        const scratchPad = document.getElementById('scratchPad');
        return scratchPad ? scratchPad.value : '';
    },
    
    // Reset for new question
    reset: function() {
        this.history = [];
        this.hide();
        const scratchPad = document.getElementById('scratchPad');
        if (scratchPad) {
            scratchPad.value = '';
        }
    }
};

// Progress Bar Component
const ProgressBar = {
    create: function(current, total, color = '#667eea') {
        const percentage = Math.min((current / total) * 100, 100);
        return `
            <div style="background: #e2e8f0; height: 10px; border-radius: 5px; margin: 10px 0;">
                <div style="background: ${color}; width: ${percentage}%; height: 100%; 
                            border-radius: 5px; transition: width 0.5s;"></div>
            </div>
        `;
    },
    
    createWithLabel: function(current, total, label, color = '#667eea') {
        const percentage = Math.min((current / total) * 100, 100);
        return `
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-size: 0.9em; color: #666;">${label}</span>
                    <span style="font-size: 0.9em; color: #666;">${current}/${total}</span>
                </div>
                <div style="background: #e2e8f0; height: 10px; border-radius: 5px;">
                    <div style="background: ${color}; width: ${percentage}%; height: 100%; 
                                border-radius: 5px; transition: width 0.5s;"></div>
                </div>
            </div>
        `;
    }
};

// Feedback Messages Component
const FeedbackMessages = {
    correct: [
        "🎉 Fantastic! You got it!",
        "⭐ Excellent work!",
        "🚀 You're on fire!",
        "💪 Great job!",
        "🌟 Perfect!",
        "🏆 Outstanding!",
        "💯 Brilliant!",
        "🎯 Right on target!",
        "👏 Well done!",
        "✨ Amazing work!"
    ],
    
    incorrect: [
        "Not quite right, but good try!",
        "Keep trying, you're learning!",
        "Almost there!",
        "Good effort!",
        "Let's learn from this!"
    ],
    
    getCorrectMessage: function() {
        return this.correct[Math.floor(Math.random() * this.correct.length)];
    },
    
    getIncorrectMessage: function() {
        return this.incorrect[Math.floor(Math.random() * this.incorrect.length)];
    }
};

// Stage Card Component
const StageCard = {
    create: function(stage, stageNum, currentStage, userData) {
        const isCurrentStage = stageNum === currentStage;
        const isCompleted = stageNum < currentStage || isStageCompleted(stageNum);
        const isLocked = stageNum > currentStage && !isStageCompleted(currentStage);
        
        return `
            <div style="background: ${isCurrentStage ? '#f0f8ff' : isCompleted ? '#e8f5e9' : '#f5f5f5'}; 
                        padding: 15px; border-radius: 10px; margin-bottom: 10px;
                        border: ${isCurrentStage ? '2px solid #667eea' : '1px solid #ddd'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Stage ${stageNum}: ${stage.name}</strong> 
                        ${isCompleted ? '✅' : isCurrentStage ? '📍' : isLocked ? '🔒' : ''}
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                            ${stage.description}
                        </div>
                    </div>
                    <div style="font-size: 0.9em; color: #666;">
                        ${stage.topics.map(t => {
                            const prog = userData.topicProgress[t.key] || { completed: 0 };
                            return `${t.name}: ${prog.completed}/${t.required}`;
                        }).join(' | ')}
                    </div>
                </div>
            </div>
        `;
    }
};

// Topic Card Component  
const TopicCard = {
    create: function(key, topic, progress, stageInfo, isLocked, isAvailable, isRecommended, currentStage, pathMode) {
        const card = document.createElement('div');
        card.className = 'topic-card';
        
        if (isLocked) {
            card.className += ' locked';
        } else if (isRecommended) {
            card.className += ' recommended';
            card.style.border = '3px solid #667eea';
            card.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
        } else if (!isAvailable) {
            card.className += ' locked';
            card.style.opacity = '0.5';
        } else if (progress.completed >= 10) {
            card.className += ' completed';
        } else if (progress.completed > 0) {
            card.className += ' in-progress';
        }
        
        const accuracy = progress.attempts > 0 ? Math.round((progress.completed / progress.attempts) * 100) : 0;
        
        card.innerHTML = `
            ${isRecommended ? '<div style="position: absolute; top: -10px; right: -10px; background: #667eea; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em;">NEXT</div>' : ''}
            <div class="topic-name">${topic.icon} ${topic.name} ${isLocked ? '🔒' : !isAvailable ? '🔒' : ''}</div>
            <div class="topic-progress">Completed: ${progress.completed}${stageInfo ? `/${stageInfo.required}` : ''}</div>
            <div class="topic-accuracy">Accuracy: ${accuracy}%</div>
            ${stageInfo && pathMode ? `<div style="font-size: 0.8em; margin-top: 5px; opacity: 0.7;">Stage ${stageInfo.stage}</div>` : ''}
        `;
        
        // Set click handlers
        if (!isLocked && isAvailable) {
            card.onclick = () => startTopic(key);
        } else if (isLocked) {
            card.onclick = () => alert("This topic is locked by parent controls");
        } else {
            card.onclick = () => alert(`Complete Stage ${currentStage} to unlock this topic`);
        }
        
        return card;
    }
};

// Answer Input Component
const AnswerInput = {
    createTextInput: function() {
        return `
            <div class="input-group">
                <input type="text" class="answer-input" id="answerInput" 
                       placeholder="Type your answer here..." 
                       onkeypress="if(event.key==='Enter') checkAnswer()">
            </div>
        `;
    },
    
    createMultipleChoice: function(options) {
        let html = '<div class="mc-options" id="mcOptions">';
        options.forEach((option, index) => {
            html += `
                <div class="mc-option" onclick="selectMCOption(${index})" data-index="${index}">
                    ${option}
                </div>
            `;
        });
        html += '</div>';
        return html;
    }
};

// Timer Display Component
const TimerDisplay = {
    format: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    create: function() {
        return '<div class="timer" id="timer">0:00</div>';
    }
};

// Make components available globally
window.UIComponents = {
    ScratchPad,
    ProgressBar,
    FeedbackMessages,
    StageCard,
    TopicCard,
    AnswerInput,
    TimerDisplay
};
