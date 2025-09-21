// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYpd-RQ3G7fiAZvT8Crx3lU5gVjbvLjHU",
    authDomain: "jordan-math-buddy.firebaseapp.com",
    projectId: "jordan-math-buddy",
    storageBucket: "jordan-math-buddy.appspot.com",
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

// User Progress Data
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
    pathMode: true
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
    fractions: {
        name: "Fractions",
        icon: "🍕",
        generator: window.FractionsGenerator
    },
    operations: {
        name: "Operations",
        icon: "➕",
        generator: window.OperationsGenerator
    },
    algebra: {
        name: "Algebra",
        icon: "🔤",
        generator: window.AlgebraGenerator
    },
    wordProblems: {
        name: "Word Problems",
        icon: "📖",
        generator: window.WordProblemsGenerator
    },
    geometry: {
        name: "Geometry",
        icon: "📐",
        generator: window.GeometryGenerator
    },
    measurement: {
        name: "Measurement",
        icon: "📏",
        generator: window.MeasurementGenerator
    },
    ratios: {
        name: "Ratios",
        icon: "⚖️",
        generator: window.RatiosGenerator
    },
    integers: {
        name: "Integers",
        icon: "❄️",
        generator: window.IntegersGenerator
    },
    expressions: {
        name: "Expressions",
        icon: "🧮",
        generator: window.ExpressionsGenerator
    }
};

// Learning Path Configuration - Based on IXL Grade 5-6 Standards
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
        topics: [
            { key: 'fractions', required: 15, name: 'Fraction Operations' }
        ]
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
        topics: [
            { key: 'ratios', required: 12, name: 'Ratios & Percentages' }
        ]
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
        topics: [
            { key: 'wordProblems', required: 20, name: 'Multi-Step Word Problems' }
        ]
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadParentSettings();
    initializeTopics();
    showTopicSelection();
    checkDailyReset();
});

// Load user data from Firebase
async function loadUserData() {
    try {
        const doc = await db.collection('users').doc('jordan').get();
        if (doc.exists) {
            const data = doc.data();
            // Merge with defaults to ensure all properties exist
            userData = { ...userData, ...data };
            updateStats();
            updateLevel();
        } else {
            await saveUserData();
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load parent settings from Firebase
async function loadParentSettings() {
    try {
        const doc = await db.collection('settings').doc('parent').get();
        if (doc.exists) {
            parentSettings = doc.data();
        } else {
            // Initialize with default PIN (1234)
            parentSettings.pinHash = hashPIN('1234');
            parentSettings.initialized = false;
            await saveParentSettings();
        }
    } catch (error) {
        console.error("Error loading parent settings:", error);
        // Set default PIN if Firebase fails
        if (!parentSettings.pinHash) {
            parentSettings.pinHash = hashPIN('1234');
            parentSettings.initialized = false;
        }
    }
}

// Save user data to Firebase
async function saveUserData() {
    try {
        userData.lastActivity = new Date().toISOString();
        await db.collection('users').doc('jordan').set(userData);
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Save parent settings to Firebase
async function saveParentSettings() {
    try {
        await db.collection('settings').doc('parent').set(parentSettings);
    } catch (error) {
        console.error("Error saving parent settings:", error);
    }
}

// Hash PIN for security
function hashPIN(pin) {
    // Simple hash function for PIN
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
        hash = ((hash << 5) - hash) + pin.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString();
}

// Check daily reset
function checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = userData.lastResetDate ? new Date(userData.lastResetDate).toDateString() : '';
    
    if (today !== lastReset) {
        userData.completedToday = 0;
        userData.lastResetDate = new Date().toISOString();
        saveUserData();
    }
}

// Get current stage
function getCurrentStage() {
    if (!userData.currentStage) {
        userData.currentStage = 1;
    }
    return userData.currentStage;
}

// Check if a stage is completed
function isStageCompleted(stageNum) {
    const stage = learningPath[stageNum - 1];
    if (!stage) return false;
    
    for (const topic of stage.topics) {
        const progress = userData.topicProgress[topic.key] || { completed: 0 };
        if (progress.completed < topic.required) {
            return false;
        }
    }
    return true;
}

// Get next recommended topic
function getRecommendedTopic() {
    const currentStage = getCurrentStage();
    const stage = learningPath[currentStage - 1];
    
    if (!stage) return null;
    
    // Find the first incomplete topic in current stage
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
    
    // If stage completed, move to next
    if (currentStage < learningPath.length) {
        userData.currentStage = currentStage + 1;
        saveUserData();
        return getRecommendedTopic();
    }
    
    return null;
}

// Initialize topic cards
function initializeTopics() {
    const topicSelection = document.getElementById('topicSelection');
    if (!topicSelection) return;
    
    // Show learning path if enabled
    if (userData.pathMode) {
        const currentStage = getCurrentStage();
        const stage = learningPath[currentStage - 1];
        const recommended = getRecommendedTopic();
        
        // Build path progress header
        let pathProgressHTML = `
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
        
        // Show stages overview
        let stagesHTML = '<div style="margin-bottom: 20px;">';
        learningPath.forEach((pathStage, index) => {
            const stageNum = index + 1;
            const isCurrentStage = stageNum === currentStage;
            const isCompleted = stageNum < currentStage || isStageCompleted(stageNum);
            const isLocked = stageNum > currentStage && !isStageCompleted(currentStage);
            
            stagesHTML += `
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
        stagesHTML += '</div>';
        
        // Add toggle for free practice mode
        const modeToggle = `
            <div style="text-align: center; margin-bottom: 20px;">
                <button class="btn btn-primary" onclick="togglePathMode()" 
                        style="background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);">
                    Switch to Free Practice Mode
                </button>
            </div>
        `;
        
        topicSelection.innerHTML = pathProgressHTML + stagesHTML + modeToggle + 
                                   '<h3 style="text-align: center; margin: 20px 0;">Select a Topic to Practice:</h3>' +
                                   '<div class="topic-grid" id="topicGrid"></div>';
    } else {
        // Free practice mode header
        const freeModeHeader = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #5a67d8;">Free Practice Mode</h2>
                <p>Choose any topic you want to practice!</p>
                <button class="btn btn-primary" onclick="togglePathMode()">
                    Switch to Guided Learning Path
                </button>
            </div>
        `;
        topicSelection.innerHTML = freeModeHeader + '<div class="topic-grid" id="topicGrid"></div>';
    }
    
    // Rebuild topic grid
    const topicGrid = document.getElementById('topicGrid');
    topicGrid.innerHTML = '';
    
    const currentStage = getCurrentStage();
    const recommended = getRecommendedTopic();
    
    for (const [key, topic] of Object.entries(topics)) {
        const progress = userData.topicProgress[key] || { completed: 0, attempts: 0, accuracy: 0 };
        const isLocked = parentSettings.lockedTopics && parentSettings.lockedTopics.includes(key);
        
        // Check if topic is in current stage or earlier
        let stageInfo = null;
        let isAvailable = !userData.pathMode; // All available in free mode
        let isRecommended = false;
        
        if (userData.pathMode) {
            // Find which stage this topic belongs to
            for (let i = 0; i < learningPath.length; i++) {
                const checkStage = learningPath[i];
                const topicInStage = checkStage.topics.find(t => t.key === key);
                if (topicInStage) {
                    stageInfo = {
                        stage: i + 1,
                        required: topicInStage.required,
                        stageName: checkStage.name
                    };
                    isAvailable = (i + 1) <= currentStage;
                    isRecommended = recommended && recommended.key === key;
                    break;
                }
            }
        }
        
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
            ${stageInfo && userData.pathMode ? `<div style="font-size: 0.8em; margin-top: 5px; opacity: 0.7;">Stage ${stageInfo.stage}</div>` : ''}
        `;
        
        if (!isLocked && isAvailable) {
            card.onclick = () => startTopic(key);
        } else if (isLocked) {
            card.onclick = () => alert("This topic is locked by parent controls");
        } else {
            card.onclick = () => alert(`Complete Stage ${currentStage} to unlock this topic`);
        }
        
        topicGrid.appendChild(card);
    }
    
    // Add daily goal progress
    updateDailyProgress();
}

// Toggle between path mode and free practice
function togglePathMode() {
    userData.pathMode = !userData.pathMode;
    saveUserData();
    initializeTopics();
}

// Update daily progress display
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

// Start a topic session
function startTopic(topicKey) {
    currentTopic = topicKey;
    currentQuestionIndex = 0;
    sessionQuestions = [];
    
    // Generate questions for this session
    const generator = topics[topicKey].generator;
    if (generator && generator.generate) {
        for (let i = 0; i < questionsPerSession; i++) {
            sessionQuestions.push(generator.generate());
        }
    } else {
        console.error(`No generator found for ${topicKey}`);
        return;
    }
    
    // Hide topic selection, show question container
    document.getElementById('topicSelection').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    
    // Start first question
    showQuestion();
}

// Display current question
function showQuestion() {
    if (currentQuestionIndex >= sessionQuestions.length) {
        endSession();
        return;
    }
    
    currentQuestion = sessionQuestions[currentQuestionIndex];
    
    // Update question number
    document.getElementById('questionNumber').textContent = 
        `Question ${currentQuestionIndex + 1} of ${questionsPerSession}`;
    
    // Display question
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    // Clear previous feedback
    document.getElementById('feedbackArea').innerHTML = '';
    
    // Setup answer input based on question type
    const answerSection = document.getElementById('answerSection');
    
    if (currentQuestion.options) {
        // Multiple choice question
        answerSection.innerHTML = '<div class="mc-options" id="mcOptions"></div>';
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
        // Text input question
        answerSection.innerHTML = `
            <div class="input-group">
                <input type="text" class="answer-input" id="answerInput" 
                       placeholder="Type your answer here..." 
                       onkeypress="if(event.key==='Enter') checkAnswer()">
            </div>
        `;
    }
    
    // Start timer
    startTimer();
}

// Select multiple choice option
function selectMCOption(index) {
    const options = document.querySelectorAll('.mc-option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
}

// Check answer
function checkAnswer() {
    let userAnswer;
    let isCorrect = false;
    
    if (currentQuestion.options) {
        // Multiple choice
        const selected = document.querySelector('.mc-option.selected');
        if (!selected) {
            alert("Please select an answer!");
            return;
        }
        const selectedIndex = parseInt(selected.dataset.index);
        isCorrect = (selectedIndex === currentQuestion.correct);
        userAnswer = currentQuestion.options[selectedIndex];
    } else {
        // Text input
        const input = document.getElementById('answerInput');
        userAnswer = input.value.trim();
        
        if (!userAnswer) {
            alert("Please enter an answer!");
            return;
        }
        
        // Parse answer for comparison
        const numericAnswer = parseFloat(userAnswer.replace(/[^\d.-]/g, ''));
        const correctAnswer = parseFloat(currentQuestion.answer);
        
        // Check if answer is close enough (within 0.01 for decimals)
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
        userData.completedToday++; // Only increment daily count for correct answers
        currentStreak++;
        showFeedback(true);
    } else {
        currentStreak = 0;
        showFeedback(false);
    }
    
    // Update accuracy
    userData.topicProgress[currentTopic].accuracy = Math.round(
        (userData.topicProgress[currentTopic].completed / userData.topicProgress[currentTopic].attempts) * 100
    );
    
    // Track IXL-style progress
    trackIXLProgress();
    
    // Check if stage completed
    if (userData.pathMode && isStageCompleted(getCurrentStage())) {
        const nextStage = getCurrentStage() + 1;
        if (nextStage <= learningPath.length) {
            userData.currentStage = nextStage;
        }
    }
    
    // Save progress
    saveUserData();
    updateStats();
    updateDailyProgress();
    
    // Stop timer
    clearInterval(timerInterval);
    
    // Disable submit button and answer inputs
    document.getElementById('submitBtn').disabled = true;
    if (document.getElementById('answerInput')) {
        document.getElementById('answerInput').disabled = true;
    }
    const options = document.querySelectorAll('.mc-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');
}

// Show feedback
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

// Function to move to next question
function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
    document.getElementById('submitBtn').disabled = false;
}

// Show hint
function showHint() {
    const feedbackArea = document.getElementById('feedbackArea');
    const existingHint = document.querySelector('.hint-box');
    
    if (!existingHint && currentQuestion.hint) {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'hint-box';
        hintDiv.innerHTML = `<strong>💡 Hint:</strong> ${currentQuestion.hint}`;
        feedbackArea.appendChild(hintDiv);
    }
}

// Timer functions
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

// Update statistics display
function updateStats() {
    const totalProblems = userData.totalAttempts;
    const accuracy = totalProblems > 0 ? 
        Math.round((userData.correctCount / totalProblems) * 100) : 0;
    
    document.getElementById('problemCount').textContent = userData.correctCount;
    document.getElementById('accuracyRate').textContent = `${accuracy}%`;
    document.getElementById('streakCount').textContent = `${currentStreak} 🔥`;
}

// Calculate and update level
function updateLevel() {
    const level = calculateLevel();
    const previousLevel = userData.levelHistory.length > 0 ? 
        userData.levelHistory[userData.levelHistory.length - 1].level : "Beginner";
    
    document.getElementById('levelDisplay').textContent = `Level: ${level}`;
    
    // Track level changes
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
    const correctAnswers = userData.correctCount;
    
    if (correctAnswers < 10) return "Beginner";
    else if (correctAnswers < 25) return "Learning";
    else if (correctAnswers < 50) return "Practicing";
    else if (correctAnswers < 100) return "Improving";
    else if (correctAnswers < 200) return "Advanced";
    else if (correctAnswers < 500) return "Expert";
    else return "Math Master 🏆";
}

// Track IXL-style progress
function trackIXLProgress() {
    // Initialize IXL history if needed
    if (!userData.ixlHistory) {
        userData.ixlHistory = [];
    }
    
    // Add progress entry (limit to last 100 for performance)
    userData.ixlHistory.push({
        date: new Date().toISOString(),
        topic: currentTopic,
        totalCompleted: userData.correctCount,
        accuracy: userData.totalAttempts > 0 ? 
            Math.round((userData.correctCount / userData.totalAttempts) * 100) : 0,
        level: calculateLevel()
    });
    
    // Keep only last 100 entries
    if (userData.ixlHistory.length > 100) {
        userData.ixlHistory = userData.ixlHistory.slice(-100);
    }
}

// End session and return to topics
function endSession() {
    clearInterval(timerInterval);
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('topicSelection').style.display = 'block';
    initializeTopics();
    showTopicSelection();
}

// Back to topics
function backToTopics() {
    if (confirm("Are you sure you want to go back? Your current progress will be saved.")) {
        endSession();
    }
}

// Show topic selection
function showTopicSelection() {
    document.getElementById('topicSelection').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'none';
}

// Parent Dashboard Functions
function showParentDashboard() {
    // Initialize PIN if not set
    if (!parentSettings.pinHash) {
        parentSettings.pinHash = hashPIN('1234');
        parentSettings.initialized = false;
    }
    
    // Check for lockout
    if (lockoutTime && new Date() < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - new Date()) / 1000);
        alert(`Too many incorrect attempts. Please wait ${remainingTime} seconds.`);
        return;
    }
    
    const modal = document.getElementById('parentModal');
    const modalContent = document.querySelector('.modal-content');
    
    // Show PIN entry first
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
            lockoutTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minute lockout
            errorDiv.textContent = 'Too many attempts. Locked for 5 minutes.';
            setTimeout(() => closeParentDashboard(), 2000);
        } else {
            errorDiv.textContent = `Incorrect PIN. ${3 - parentAccessAttempts} attempts remaining.`;
            document.getElementById('parentPIN').value = '';
        }
    }
}

function showParentControls() {
    const modalContent = document.querySelector('.modal-content');
    const accuracy = userData.totalAttempts > 0 ? 
        Math.round((userData.correctCount / userData.totalAttempts) * 100) : 0;
    
    // Calculate IXL-style progress metrics
    const startDate = new Date(userData.startDate || userData.ixlHistory[0]?.date || new Date());
    const daysActive = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const problemsPerDay = daysActive > 0 ? Math.round(userData.correctCount / daysActive) : 0;
    
    // Get initial stats for comparison
    const initialLevel = userData.levelHistory[0]?.level || "Beginner";
    const currentLevel = calculateLevel();
    const levelProgress = getLevelProgress();
    
    // Build IXL progress chart
    let progressChart = '';
    if (userData.ixlHistory && userData.ixlHistory.length > 0) {
        const recentHistory = userData.ixlHistory.slice(-30); // Last 30 entries
        const maxProblems = Math.max(...recentHistory.map(h => h.totalCompleted));
        
        progressChart = `
            <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin-top: 10px;">
                <h4>Progress Timeline (Last 30 Sessions)</h4>
                <div style="display: flex; align-items: flex-end; height: 150px; gap: 2px; margin-top: 15px;">
                    ${recentHistory.map(entry => {
                        const height = (entry.totalCompleted / maxProblems) * 100;
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
    
    // Build topic statistics HTML with IXL-style skill levels
    let topicStats = '';
    for (const [key, topic] of Object.entries(topics)) {
        const progress = userData.topicProgress[key] || { completed: 0, attempts: 0, accuracy: 0 };
        const topicAccuracy = progress.attempts > 0 ? 
            Math.round((progress.completed / progress.attempts) * 100) : 0;
        const isLocked = parentSettings.lockedTopics && parentSettings.lockedTopics.includes(key);
        
        // IXL-style skill level for topic
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
                            onclick="toggleTopicLock('${key}')" style="padding: 5px 10px; font-size: 0.9em;">
                        ${isLocked ? 'Unlock' : 'Lock'}
                    </button>
                    <button class="btn btn-small btn-reset" onclick="resetTopic('${key}')" 
                            style="padding: 5px 10px; font-size: 0.9em; background: #f56565;">
                        Reset
                    </button>
                </div>
            </div>
        `;
    }
    
    // Add learning path status
    const currentStage = getCurrentStage();
    const pathStatus = `
        <div style="background: #f0fff4; border-radius: 10px; padding: 15px; margin: 15px 0;">
            <h3>🎯 Learning Path Progress</h3>
            <p>Current Stage: <strong>${currentStage} of ${learningPath.length}</strong> - ${learningPath[currentStage - 1]?.name || 'Complete!'}</p>
            <button class="btn btn-small" onclick="togglePathMode()" 
                    style="padding: 5px 15px; background: #9ca3af; margin-top: 10px;">
                ${userData.pathMode ? 'Disable' : 'Enable'} Learning Path
            </button>
        </div>
    `;
    
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
                    <div style="font-size: 1.5em; font-weight: bold; color: #667eea;">${currentStreak} 🔥</div>
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
                <button class="btn btn-small" onclick="updateDailyGoal()" 
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
                <button class="btn btn-warning" onclick="resetLowPerformance()" 
                        style="background: #ed8936;">Reset Topics Below 70%</button>
                <button class="btn btn-danger" onclick="resetAllProgress()" 
                        style="background: #e53e3e;">Reset All Progress</button>
            </div>
        </div>
        
        <div style="background: #f0f0ff; border-radius: 10px; padding: 15px; margin: 15px 0;">
            <h3>🔐 Security Settings</h3>
            <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
                <button class="btn btn-primary" onclick="showChangePIN()">Change PIN</button>
                <span style="font-size: 0.9em; color: #666;">
                    Last changed: ${parentSettings.lastPinChange ? 
                        new Date(parentSettings.lastPinChange).toLocaleDateString() : 'Never'}
                </span>
            </div>
        </div>
        
        <div style="background: #f5f5f5; border-radius: 10px; padding: 15px; margin: 15px 0;">
            <h3>📅 Activity History</h3>
            <p style="font-size: 0.9em; color: #666;">
                Started: ${new Date(userData.startDate || userData.ixlHistory[0]?.date || new Date()).toLocaleDateString()}<br>
                Last Active: ${new Date(userData.lastActivity).toLocaleString()}<br>
                Total Days: ${daysActive} days<br>
                Session Started: ${parentSettings.initialized ? 'Yes' : 'First Time - Please Change PIN!'}
            </p>
        </div>
    `;
    
    // Mark as initialized after first successful login
    if (!parentSettings.initialized) {
        parentSettings.initialized = true;
        saveParentSettings();
    }
}

// Get level progress details
function getLevelProgress() {
    const correctAnswers = userData.correctCount;
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
}

function toggleTopicLock(topicKey) {
    if (!parentSettings.lockedTopics) {
        parentSettings.lockedTopics = [];
    }
    
    const index = parentSettings.lockedTopics.indexOf(topicKey);
    if (index > -1) {
        parentSettings.lockedTopics.splice(index, 1);
    } else {
        parentSettings.lockedTopics.push(topicKey);
    }
    
    saveParentSettings();
    showParentControls(); // Refresh display
}

function resetTopic(topicKey) {
    const topicName = topics[topicKey].name;
    if (confirm(`Are you sure you want to reset progress for ${topicName}? This cannot be undone.`)) {
        userData.topicProgress[topicKey] = { completed: 0, attempts: 0, accuracy: 0 };
        saveUserData();
        showParentControls(); // Refresh display
        alert(`${topicName} has been reset!`);
    }
}

function resetLowPerformance() {
    let topicsReset = [];
    
    for (const [key, topic] of Object.entries(topics)) {
        const progress = userData.topicProgress[key];
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
            saveUserData();
            showParentControls();
            alert(`Reset ${topicsReset.length} topics!`);
        }
    } else {
        alert("No topics have accuracy below 70%!");
    }
}

function resetAllProgress() {
    if (confirm("⚠️ WARNING: This will reset ALL progress!\n\nAre you absolutely sure?")) {
        if (confirm("This action cannot be undone. Final confirmation to reset everything?")) {
            userData = {
                completedProblems: {},
                totalAttempts: 0,
                correctCount: 0,
                topicProgress: {},
                lastActivity: new Date().toISOString(),
                dailyGoal: userData.dailyGoal || 20,
                completedToday: 0,
                lastResetDate: new Date().toISOString(),
                ixlHistory: [],
                startDate: new Date().toISOString(),
                levelHistory: [],
                currentStage: 1,
                pathMode: true
            };
            currentStreak = 0;
            saveUserData();
            updateStats();
            updateLevel();
            initializeTopics();
            showParentControls();
            alert("All progress has been reset!");
        }
    }
}

function updateDailyGoal() {
    const newGoal = parseInt(document.getElementById('dailyGoal').value);
    if (newGoal >= 5 && newGoal <= 100) {
        userData.dailyGoal = newGoal;
        saveUserData();
        updateDailyProgress();
        alert(`Daily goal updated to ${newGoal} problems!`);
    } else {
        alert("Daily goal must be between 5 and 100 problems.");
    }
}

function showChangePIN() {
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
            <button class="btn btn-primary" onclick="changePIN()">Change PIN</button>
            <button class="btn btn-back" onclick="showParentControls()" style="margin-left: 10px;">Cancel</button>
            <div id="pinChangeError" style="color: red; margin-top: 10px;"></div>
        </div>
    `;
}

function changePIN() {
    const currentPIN = document.getElementById('currentPIN').value;
    const newPIN = document.getElementById('newPIN').value;
    const confirmPIN = document.getElementById('confirmPIN').value;
    const errorDiv = document.getElementById('pinChangeError');
    
    if (currentPIN.length !== 4 || newPIN.length !== 4 || confirmPIN.length !== 4) {
        errorDiv.textContent = 'All PINs must be 4 digits';
        return;
    }
    
    if (hashPIN(currentPIN) !== parentSettings.pinHash) {
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
    
    parentSettings.pinHash = hashPIN(newPIN);
    parentSettings.lastPinChange = new Date().toISOString();
    saveParentSettings();
    
    alert('PIN changed successfully!');
    showParentControls();
}

function closeParentDashboard() {
    document.getElementById('parentModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('parentModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
