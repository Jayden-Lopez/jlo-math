// app.js - Jordan's Math Practice App
// Version 1.1.0 - With progress protection and modular parent dashboard

const APP_VERSION = '1.1.0';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYpd-RQ3G7fiAZvT8Crx3lU5gVjbvLjHU",
    authDomain: "jordan-math-practice.firebaseapp.com",
    projectId: "jordan-math-practice",
    storageBucket: "jordan-math-practice.appspot.com",
    messagingSenderId: "482301964012",
    appId: "1:482301964012:web:7e2b3f89e0da431e2b8c9e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Global Variables
let currentTopic = '';
let currentQuestion = null;
let currentQuestionIndex = 0;
let questionsPerSession = 5;
let sessionQuestions = [];
let startTime = null;
let timerInterval = null;
let currentStreak = 0;
let parentAccessAttempts = 0;
let lockoutTime = null;

// User Progress Data with defaults
let userData = {
    completedProblems: {},
    totalAttempts: 0,
    correctCount: 0,
    topicProgress: {},
    lastActivity: new Date().toISOString(),
    dailyGoal: 20,
    completedToday: 0,
    lastResetDate: null,
    ixlHistory: [],
    startDate: new Date().toISOString(),
    levelHistory: [],
    currentStage: 1,
    pathMode: true,
    version: APP_VERSION
};

// Parent Settings
let parentSettings = {
    pinHash: null,
    initialized: false,
    lockedTopics: [],
    difficultySettings: {},
    lastPinChange: null
};

// Topic Configuration
const topics = {
    fractions: { name: "Fractions", icon: "🍕", generator: window.FractionsGenerator },
    operations: { name: "Operations", icon: "➕", generator: window.OperationsGenerator },
    algebra: { name: "Algebra", icon: "🔤", generator: window.AlgebraGenerator },
    wordProblems: { name: "Word Problems", icon: "📖", generator: window.WordProblemsGenerator },
    geometry: { name: "Geometry", icon: "📐", generator: window.GeometryGenerator },
    measurement: { name: "Measurement", icon: "📏", generator: window.MeasurementGenerator },
    ratios: { name: "Ratios", icon: "⚖️", generator: window.RatiosGenerator },
    integers: { name: "Integers", icon: "❄️", generator: window.IntegersGenerator },
    expressions: { name: "Expressions", icon: "🧮", generator: window.ExpressionsGenerator }
};

// Learning Path Configuration
const learningPath = [
    {
        stage: 1,
        name: "Number Foundations",
        description: "Master basic operations and number sense",
        topics: [
            { key: 'operations', required: 10, name: 'Basic Operations' },
            { key: 'integers', required: 10, name: 'Positive & Negative Numbers' }
        ]
    },
    {
        stage: 2,
        name: "Fractions & Decimals",
        description: "Work with parts of numbers",
        topics: [{ key: 'fractions', required: 15, name: 'Fraction Operations' }]
    },
    {
        stage: 3,
        name: "Algebraic Thinking",
        description: "Introduction to variables and expressions",
        topics: [
            { key: 'expressions', required: 10, name: 'Evaluating Expressions' },
            { key: 'algebra', required: 15, name: 'Solving Equations' }
        ]
    },
    {
        stage: 4,
        name: "Ratios & Proportions",
        description: "Understanding relationships between numbers",
        topics: [{ key: 'ratios', required: 12, name: 'Ratios & Percentages' }]
    },
    {
        stage: 5,
        name: "Geometry & Measurement",
        description: "Shapes, space, and units",
        topics: [
            { key: 'geometry', required: 12, name: 'Area, Perimeter & Volume' },
            { key: 'measurement', required: 10, name: 'Converting Units' }
        ]
    },
    {
        stage: 6,
        name: "Problem Solving",
        description: "Apply all skills to word problems",
        topics: [{ key: 'wordProblems', required: 20, name: 'Multi-Step Word Problems' }]
    }
];

// Make learning path available globally for parent dashboard
window.learningPath = learningPath;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadParentSettings();
    initializeTopics();
    showTopicSelection();
    checkDailyReset();
});

// ENHANCED: Load user data with progress protection
async function loadUserData() {
    try {
        const doc = await db.collection('users').doc('jordan').get();
        if (doc.exists) {
            const data = doc.data();
            // Preserve existing data while allowing new fields
            userData = { 
                ...userData,  // Default values for new fields
                ...data,      // Override with saved data
                version: APP_VERSION  // Update version
            };
            updateStats();
            updateLevel();
        } else {
            await saveUserData();
        }
    } catch (error) {
        console.error("Error loading data:", error);
        // Try loading from localStorage backup
        const localBackup = localStorage.getItem('jordanMathBackup');
        if (localBackup) {
            try {
                userData = { ...userData, ...JSON.parse(localBackup) };
                updateStats();
                updateLevel();
            } catch (e) {
                console.error("Error loading backup:", e);
            }
        }
    }
}

// Load parent settings with protection
async function loadParentSettings() {
    // First check localStorage
    const localBackup = localStorage.getItem('parentSettingsBackup');
    if (localBackup) {
        try {
            parentSettings = JSON.parse(localBackup);
        } catch (e) {
            console.error("Error parsing local settings:", e);
        }
    }
    
    // Then try Firebase (might override local if more recent)
    try {
        const doc = await db.collection('settings').doc('parent').get();
        if (doc.exists) {
            parentSettings = doc.data();
            // Update localStorage with Firebase data
            localStorage.setItem('parentSettingsBackup', JSON.stringify(parentSettings));
        } else if (!parentSettings.pinHash) {
            // Only set defaults if no settings exist anywhere
            parentSettings.pinHash = hashPIN('1234');
            parentSettings.initialized = false;
            await saveParentSettings();
        }
    } catch (error) {
        console.error("Error loading parent settings from Firebase:", error);
        // Continue with localStorage settings
        if (!parentSettings.pinHash) {
            parentSettings.pinHash = hashPIN('1234');
            parentSettings.initialized = false;
            localStorage.setItem('parentSettingsBackup', JSON.stringify(parentSettings));
        }
    }
}

// ENHANCED: Save user data with backup
async function saveUserData() {
    try {
        userData.lastActivity = new Date().toISOString();
        await db.collection('users').doc('jordan').set(userData);
        // Backup to localStorage
        localStorage.setItem('jordanMathBackup', JSON.stringify(userData));
    } catch (error) {
        console.error("Error saving data:", error);
        // Save to localStorage if Firebase fails
        localStorage.setItem('jordanMathBackup', JSON.stringify(userData));
    }
}

// Save parent settings with backup
async function saveParentSettings() {
    try {
        // Always save to localStorage first
        localStorage.setItem('parentSettingsBackup', JSON.stringify(parentSettings));
        
        // Then try Firebase
        await db.collection('settings').doc('parent').set(parentSettings);
    } catch (error) {
        console.error("Error saving parent settings:", error);
        // Already saved to localStorage, so settings will persist
    }
}

// Utility Functions
function hashPIN(pin) {
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
        hash = ((hash << 5) - hash) + pin.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString();
}

function checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = userData.lastResetDate ? new Date(userData.lastResetDate).toDateString() : '';
    
    if (today !== lastReset) {
        userData.completedToday = 0;
        userData.lastResetDate = new Date().toISOString();
        saveUserData();
    }
}

// Learning Path Functions
function getCurrentStage() {
    return userData.currentStage || 1;
}

function isStageCompleted(stageNum) {
    const stage = learningPath[stageNum - 1];
    if (!stage) return false;
    
    return stage.topics.every(topic => {
        const progress = userData.topicProgress[topic.key] || { completed: 0 };
        return progress.completed >= topic.required;
    });
}

function getRecommendedTopic() {
    const currentStage = getCurrentStage();
    const stage = learningPath[currentStage - 1];
    
    if (!stage) return null;
    
    for (const topic of stage.topics) {
        const progress = userData.topicProgress[topic.key] || { completed: 0 };
        if (progress.completed < topic.required) {
            return {
                key: topic.key,
                name: topic.name,
                completed: progress.completed,
                required: topic.required,
                stage: stage.name
            };
        }
    }
    
    // Move to next stage if current is complete
    if (currentStage < learningPath.length) {
        userData.currentStage = currentStage + 1;
        saveUserData();
        return getRecommendedTopic();
    }
    
    return null;
}

// Initialize topics with mastery display
function initializeTopics() {
    const topicSelection = document.getElementById('topicSelection');
    if (!topicSelection) return;
    
    // Build UI based on path mode
    if (userData.pathMode) {
        buildPathModeUI(topicSelection);
    } else {
        buildFreeModeUI(topicSelection);
    }
    
    // Create topic cards
    createTopicCards();
    updateDailyProgress();
}

function buildPathModeUI(container) {
    const currentStage = getCurrentStage();
    const stage = learningPath[currentStage - 1];
    const recommended = getRecommendedTopic();
    
    let html = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
            <h3>🎯 Learning Path - Stage ${currentStage} of ${learningPath.length}</h3>
            <h2>${stage ? stage.name : 'Complete!'}</h2>
            <p>${stage ? stage.description : 'You\'ve completed all stages!'}</p>
            
            <div style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; margin: 15px 0;">
                <div style="background: white; width: ${(currentStage - 1) / learningPath.length * 100}%; 
                            height: 100%; border-radius: 5px; transition: width 0.5s;"></div>
            </div>
            
            ${recommended ? `
                <div style="background: rgba(255,255,255,0.3); padding: 10px; border-radius: 10px; margin-top: 10px;">
                    <strong>Next Up:</strong> ${recommended.name} 
                    (${recommended.completed}/${recommended.required} completed)
                </div>
            ` : '<div style="padding: 10px;">🏆 All stages completed! Practice any topic to strengthen skills.</div>'}
        </div>
    `;
    
    // Add stages overview
    html += '<div style="margin-bottom: 20px;">';
    learningPath.forEach((pathStage, index) => {
        const stageNum = index + 1;
        const isCurrentStage = stageNum === currentStage;
        const isCompleted = stageNum < currentStage || isStageCompleted(stageNum);
        const isLocked = stageNum > currentStage && !isStageCompleted(currentStage);
        
        html += `
            <div style="background: ${isCurrentStage ? '#f0f8ff' : isCompleted ? '#e8f5e9' : '#f5f5f5'}; 
                        padding: 15px; border-radius: 10px; margin-bottom: 10px;
                        border: ${isCurrentStage ? '2px solid #667eea' : '1px solid #ddd'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Stage ${stageNum}: ${pathStage.name}</strong> 
                        ${isCompleted ? '✅' : isCurrentStage ? '📍' : isLocked ? '🔒' : ''}
                        <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                            ${pathStage.description}
                        </div>
                    </div>
                    <div style="font-size: 0.9em; color: #666;">
                        ${pathStage.topics.map(t => {
                            const prog = userData.topicProgress[t.key] || { completed: 0 };
                            return `${t.name}: ${prog.completed}/${t.required}`;
                        }).join(' | ')}
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    // Add mode toggle
    html += `
        <div style="text-align: center; margin-bottom: 20px;">
            <button class="btn btn-primary" onclick="togglePathMode()" 
                    style="background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);">
                Switch to Free Practice Mode
            </button>
        </div>
        <h3 style="text-align: center; margin: 20px 0;">Select a Topic to Practice:</h3>
        <div class="topic-grid" id="topicGrid"></div>
    `;
    
    container.innerHTML = html;
}

function buildFreeModeUI(container) {
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #5a67d8;">Free Practice Mode</h2>
            <p>Choose any topic you want to practice!</p>
            <button class="btn btn-primary" onclick="togglePathMode()">
                Switch to Guided Learning Path
            </button>
        </div>
        <div class="topic-grid" id="topicGrid"></div>
    `;
}

// Create topic cards with mastery display
function createTopicCards() {
    const topicGrid = document.getElementById('topicGrid');
    if (!topicGrid) return;
    
    topicGrid.innerHTML = '';
    const currentStage = getCurrentStage();
    const recommended = getRecommendedTopic();
    
    for (const [key, topic] of Object.entries(topics)) {
        const progress = userData.topicProgress[key] || { completed: 0, attempts: 0, accuracy: 0 };
        const card = createTopicCard(key, topic, progress, currentStage, recommended);
        topicGrid.appendChild(card);
    }
}

function createTopicCard(key, topic, progress, currentStage, recommended) {
    const card = document.createElement('div');
    card.className = 'topic-card';
    
    const isLocked = parentSettings.lockedTopics && parentSettings.lockedTopics.includes(key);
    const accuracy = progress.attempts > 0 ? Math.round((progress.completed / progress.attempts) * 100) : 0;
    
    // Check mastery using MasteryTracker if available
    let masteryHTML = '';
    if (window.MasteryTracker) {
        const mastery = window.MasteryTracker.checkMastery(key, userData);
        if (mastery.mastered) {
            masteryHTML = '<div style="background: gold; color: #333; padding: 5px; border-radius: 10px; margin-top: 5px; font-weight: bold;">🏆 MASTERED!</div>';
            card.className += ' mastered';
        } else {
            masteryHTML = `<div style="font-size: 0.8em; color: #fff; margin-top: 5px; opacity: 0.9;">${mastery.progress.message}</div>`;
        }
    }
    
    // Determine availability and styling
    let isAvailable = !userData.pathMode;
    let isRecommended = false;
    let stageInfo = null;
    
    if (userData.pathMode) {
        for (let i = 0; i < learningPath.length; i++) {
            const checkStage = learningPath[i];
            const topicInStage = checkStage.topics.find(t => t.key === key);
            if (topicInStage) {
                stageInfo = {
                    stage: i + 1,
                    required: topicInStage.required
                };
                isAvailable = (i + 1) <= currentStage;
                isRecommended = recommended && recommended.key === key;
                break;
            }
        }
    }
    
    // Apply styling
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
    
    // Build card content
    card.innerHTML = `
        ${isRecommended ? '<div style="position: absolute; top: -10px; right: -10px; background: #667eea; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em;">NEXT</div>' : ''}
        <div class="topic-name">${topic.icon} ${topic.name} ${isLocked ? '🔒' : !isAvailable ? '🔒' : ''}</div>
        <div class="topic-progress">Completed: ${progress.completed}${stageInfo ? `/${stageInfo.required}` : ''}</div>
        <div class="topic-accuracy">Accuracy: ${accuracy}%</div>
        ${stageInfo && userData.pathMode ? `<div style="font-size: 0.8em; margin-top: 5px; opacity: 0.7;">Stage ${stageInfo.stage}</div>` : ''}
        ${masteryHTML}
    `;
    
    // Set click handler
    if (!isLocked && isAvailable) {
        card.onclick = () => startTopic(key);
    } else if (isLocked) {
        card.onclick = () => alert("This topic is locked by parent controls");
    } else {
        card.onclick = () => alert(`Complete Stage ${currentStage} to unlock this topic`);
    }
    
    return card;
}

// Session Management
function startTopic(topicKey) {
    currentTopic = topicKey;
    currentQuestionIndex = 0;
    sessionQuestions = [];
    
    const generator = topics[topicKey].generator;
    if (generator && generator.generate) {
        for (let i = 0; i < questionsPerSession; i++) {
            sessionQuestions.push(generator.generate());
        }
    } else {
        console.error(`No generator found for ${topicKey}`);
        return;
    }
    
    document.getElementById('topicSelection').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= sessionQuestions.length) {
        endSession();
        return;
    }
    
    currentQuestion = sessionQuestions[currentQuestionIndex];
    
    document.getElementById('questionNumber').textContent = 
        `Question ${currentQuestionIndex + 1} of ${questionsPerSession}`;
    
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    document.getElementById('feedbackArea').innerHTML = '';
    
    const answerSection = document.getElementById('answerSection');
    
    // Get scratch pad HTML if available
    const scratchPadHTML = window.scratchPad ? window.scratchPad.getHTML() : '';
    
    if (currentQuestion.options) {
        answerSection.innerHTML = scratchPadHTML + '<div class="mc-options" id="mcOptions"></div>';
        const mcContainer = document.getElementById('mcOptions');
        
        currentQuestion.options.forEach((option, index) => {
            const optionBtn = document.createElement('div');
            optionBtn.className = 'mc-option';
            optionBtn.textContent = option;
            optionBtn.onclick = () => selectMCOption(index);
            optionBtn.dataset.index = index;
            mcContainer.appendChild(optionBtn);
        });
    } else {
        answerSection.innerHTML = scratchPadHTML + `
            <div class="input-group">
                <input type="text" class="answer-input" id="answerInput" 
                       placeholder="Type your answer here..." 
                       onkeypress="if(event.key==='Enter') checkAnswer()">
            </div>
        `;
    }
    
    startTimer();
}

function selectMCOption(index) {
    const options = document.querySelectorAll('.mc-option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
}

function checkAnswer() {
    let isCorrect = false;
    
    if (currentQuestion.options) {
        const selected = document.querySelector('.mc-option.selected');
        if (!selected) {
            alert("Please select an answer!");
            return;
        }
        const selectedIndex = parseInt(selected.dataset.index);
        isCorrect = (selectedIndex === currentQuestion.correct);
    } else {
        const input = document.getElementById('answerInput');
        const userAnswer = input.value.trim();
        
        if (!userAnswer) {
            alert("Please enter an answer!");
            return;
        }
        
        const numericAnswer = parseFloat(userAnswer.replace(/[^\d.-]/g, ''));
        const correctAnswer = parseFloat(currentQuestion.answer);
        
        isCorrect = Math.abs(numericAnswer - correctAnswer) < 0.01;
    }
    
    // Update statistics
    userData.totalAttempts++;
    
    if (!userData.topicProgress[currentTopic]) {
        userData.topicProgress[currentTopic] = { completed: 0, attempts: 0, accuracy: 0 };
    }
    userData.topicProgress[currentTopic].attempts++;
    
    if (isCorrect) {
        userData.correctCount++;
        userData.topicProgress[currentTopic].completed++;
        userData.completedToday++;
        currentStreak++;
    } else {
        currentStreak = 0;
    }
    
    userData.topicProgress[currentTopic].accuracy = Math.round(
        (userData.topicProgress[currentTopic].completed / userData.topicProgress[currentTopic].attempts) * 100
    );
    
    // Check for mastery
    if (window.MasteryTracker && isCorrect) {
        const mastery = window.MasteryTracker.checkMastery(currentTopic, userData);
        if (mastery.mastered && !userData.masteredTopics?.includes(currentTopic)) {
            if (!userData.masteredTopics) userData.masteredTopics = [];
            userData.masteredTopics.push(currentTopic);
            setTimeout(() => {
                alert(`🎉🏆 AMAZING! You've mastered ${topics[currentTopic].name}! 🏆🎉`);
            }, 1000);
        }
    }
    
    // Check stage completion
    if (userData.pathMode && isStageCompleted(getCurrentStage())) {
        const nextStage = getCurrentStage() + 1;
        if (nextStage <= learningPath.length) {
            userData.currentStage = nextStage;
        }
    }
    
    trackIXLProgress();
    saveUserData();
    updateStats();
    updateDailyProgress();
    
    clearInterval(timerInterval);
    
    // Disable inputs
    document.getElementById('submitBtn').disabled = true;
    const answerInput = document.getElementById('answerInput');
    if (answerInput) answerInput.disabled = true;
    const options = document.querySelectorAll('.mc-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    showFeedback(isCorrect);
}

function showFeedback(isCorrect) {
    const feedbackArea = document.getElementById('feedbackArea');
    
    if (isCorrect) {
        const messages = [
            "🎉 Fantastic! You got it!",
            "⭐ Excellent work!",
            "🚀 You're on fire!",
            "💪 Great job!",
            "🌟 Perfect!"
        ];
        feedbackArea.innerHTML = `
            <div class="feedback correct">
                ${messages[Math.floor(Math.random() * messages.length)]}
            </div>
            <button class="btn btn-primary" onclick="nextQuestion()" style="margin-top: 15px;">
                Next Question →
            </button>
        `;
    } else {
        feedbackArea.innerHTML = `
            <div class="feedback incorrect">
                Not quite right. The correct answer is ${currentQuestion.answer}
            </div>
            <div class="explanation-box">
                <strong>Here's how to solve it:</strong><br>
                ${currentQuestion.explanation}
            </div>
            <button class="btn btn-primary" onclick="nextQuestion()" style="margin-top: 15px;">
                Next Question →
            </button>
        `;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
    document.getElementById('submitBtn').disabled = false;
}

function showHint() {
    const feedbackArea = document.getElementById('feedbackArea');
    const existingHint = document.querySelector('.hint-box');
    
    if (!existingHint && currentQuestion.hint) {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'hint-box';
        hintDiv.innerHTML = `<strong>💡 Hint:</strong><br>${currentQuestion.hint.replace(/\n/g, '<br>')}`;
        feedbackArea.appendChild(hintDiv);
    }
}

function endSession() {
    clearInterval(timerInterval);
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('topicSelection').style.display = 'block';
    initializeTopics();
}

function backToTopics() {
    if (confirm("Are you sure you want to go back? Your current progress will be saved.")) {
        endSession();
    }
}

// Timer Functions
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Statistics Functions
function updateStats() {
    const totalProblems = userData.totalAttempts;
    const accuracy = totalProblems > 0 ? 
        Math.round((userData.correctCount / totalProblems) * 100) : 0;
    
    document.getElementById('problemCount').textContent = userData.correctCount;
    document.getElementById('accuracyRate').textContent = `${accuracy}%`;
    document.getElementById('streakCount').textContent = `${currentStreak} 🔥`;
}

function updateLevel() {
    const level = calculateLevel();
    const previousLevel = userData.levelHistory.length > 0 ? 
        userData.levelHistory[userData.levelHistory.length - 1].level : "Beginner";
    
    document.getElementById('levelDisplay').textContent = `Level: ${level}`;
    
    if (level !== previousLevel) {
        userData.levelHistory.push({
            level: level,
            date: new Date().toISOString(),
            problemsCompleted: userData.correctCount
        });
        saveUserData();
    }
}

function calculateLevel() {
    const c = userData.correctCount;
    if (c < 10) return "Beginner";
    if (c < 25) return "Learning";
    if (c < 50) return "Practicing";
    if (c < 100) return "Improving";
    if (c < 200) return "Advanced";
    if (c < 500) return "Expert";
    return "Math Master 🏆";
}

function trackIXLProgress() {
    if (!userData.ixlHistory) userData.ixlHistory = [];
    
    userData.ixlHistory.push({
        date: new Date().toISOString(),
        topic: currentTopic,
        totalCompleted: userData.correctCount,
        accuracy: userData.totalAttempts > 0 ? 
            Math.round((userData.correctCount / userData.totalAttempts) * 100) : 0,
        level: calculateLevel()
    });
    
    if (userData.ixlHistory.length > 100) {
        userData.ixlHistory = userData.ixlHistory.slice(-100);
    }
}

function updateDailyProgress() {
    const progressBar = document.getElementById('dailyProgress');
    if (progressBar) {
        const percentage = Math.min((userData.completedToday / userData.dailyGoal) * 100, 100);
        progressBar.innerHTML = `
            <div style="background: linear-gradient(90deg, #48bb78 ${percentage}%, #e2e8f0 ${percentage}%); 
                        height: 30px; border-radius: 15px; display: flex; align-items: center; 
                        justify-content: center; font-weight: bold;">
                Daily Goal: ${userData.completedToday}/${userData.dailyGoal} problems
            </div>
        `;
    }
}

// Utility Functions
function togglePathMode() {
    userData.pathMode = !userData.pathMode;
    saveUserData();
    initializeTopics();
}

function showTopicSelection() {
    document.getElementById('topicSelection').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'none';
}

// Parent Dashboard Functions (core functions stay in app.js)
function showParentDashboard() {
    if (!parentSettings.pinHash) {
        parentSettings.pinHash = hashPIN('1234');
        parentSettings.initialized = false;
    }
    
    if (lockoutTime && new Date() < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - new Date()) / 1000);
        alert(`Too many incorrect attempts. Please wait ${remainingTime} seconds.`);
        return;
    }
    
    const modal = document.getElementById('parentModal');
    const modalContent = document.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <span class="close" onclick="closeParentDashboard()">&times;</span>
        <h2>🔐 Parent Access</h2>
        <div style="text-align: center; padding: 20px;">
            ${!parentSettings.initialized ? 
                '<p style="color: #e53e3e; font-weight: bold;">First Time Setup: Default PIN is 1234. Please change it!</p>' : 
                '<p>Enter your 4-digit PIN to access parent controls</p>'}
            <input type="password" id="parentPIN" maxlength="4" pattern="[0-9]*" inputmode="numeric"
                   style="font-size: 24px; padding: 10px; width: 150px; text-align: center; border: 2px solid #667eea; border-radius: 10px;"
                   onkeypress="if(event.key==='Enter') verifyParentAccess()">
            <br><br>
            <button class="btn btn-primary" onclick="verifyParentAccess()">Submit</button>
            <div id="pinError" style="color: red; margin-top: 10px;"></div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.getElementById('parentPIN').focus();
}

function verifyParentAccess() {
    const enteredPIN = document.getElementById('parentPIN').value;
    const errorDiv = document.getElementById('pinError');
    
    if (enteredPIN.length !== 4) {
        errorDiv.textContent = 'PIN must be 4 digits';
        return;
    }
    
    if (hashPIN(enteredPIN) === parentSettings.pinHash) {
        parentAccessAttempts = 0;
        showParentControls();
    } else {
        parentAccessAttempts++;
        if (parentAccessAttempts >= 3) {
            lockoutTime = new Date(Date.now() + 5 * 60 * 1000);
            errorDiv.textContent = 'Too many attempts. Locked for 5 minutes.';
            setTimeout(() => closeParentDashboard(), 2000);
        } else {
            errorDiv.textContent = `Incorrect PIN. ${3 - parentAccessAttempts} attempts remaining.`;
            document.getElementById('parentPIN').value = '';
        }
    }
}

// Main function to show parent controls - delegates to module
function showParentControls() {
    const modalContent = document.querySelector('.modal-content');
    
    // Use the ParentDashboard module if available
    if (window.ParentDashboard) {
        window.ParentDashboard.showControls(userData, parentSettings, topics, modalContent);
    } else {
        // Fallback error message if module not loaded
        console.error('ParentDashboard module not loaded');
        modalContent.innerHTML = `
            <span class="close" onclick="closeParentDashboard()">&times;</span>
            <h2>Error</h2>
            <p>Parent Dashboard module failed to load. Please refresh the page and try again.</p>
        `;
    }
}

function closeParentDashboard() {
    document.getElementById('parentModal').style.display = 'none';
}

// Modal close handler
window.onclick = function(event) {
    const modal = document.getElementById('parentModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Make necessary functions and data globally available for modules
window.userData = userData;
window.parentSettings = parentSettings;
window.topics = topics;
window.currentStreak = currentStreak;
window.saveUserData = saveUserData;
window.saveParentSettings = saveParentSettings;
window.hashPIN = hashPIN;
window.calculateLevel = calculateLevel;
window.updateStats = updateStats;
window.updateLevel = updateLevel;
window.updateDailyProgress = updateDailyProgress;
window.initializeTopics = initializeTopics;
window.showParentControls = showParentControls;
window.togglePathMode = togglePathMode;
window.APP_VERSION = APP_VERSION;

// Export functions for parent dashboard
window.closeParentDashboard = closeParentDashboard;
window.verifyParentAccess = verifyParentAccess;
window.showParentDashboard = showParentDashboard;

// Export functions for question handling
window.checkAnswer = checkAnswer;
window.showHint = showHint;
window.nextQuestion = nextQuestion;
window.backToTopics = backToTopics;
window.selectMCOption = selectMCOption;
window.startTopic = startTopic;
