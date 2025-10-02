// app.js - Jordan's Math Practice App
// Version 2.0.0 - Glencoe Math Course 1 Aligned

const APP_VERSION = '2.0.0';

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
    currentStage: 2, // Start at Chapter 2 (where Jordan's class likely is)
    currentChapter: 2, // Track current textbook chapter
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

// Topic Configuration - Aligned with Glencoe chapters
const topics = {
    ratios: { name: "Ch 1: Ratios & Rates", icon: "⚖️", generator: window.RatiosGenerator },
    decimals: { name: "Ch 2: Decimals & Percents", icon: "💯", generator: window.DecimalsGenerator },
    operations: { name: "Ch 3: Multi-Digit Operations", icon: "➕", generator: window.OperationsGenerator },
    fractions: { name: "Ch 4: Multiply/Divide Fractions", icon: "🍕", generator: window.FractionsGenerator },
    mixedNumbers: { name: "Ch 4: Mixed Numbers", icon: "🔢", generator: window.MixedNumbersGenerator },
    integers: { name: "Ch 5: Integers", icon: "❄️", generator: window.IntegersGenerator },
    expressions: { name: "Ch 6: Expressions", icon: "🧮", generator: window.ExpressionsGenerator },
    algebra: { name: "Ch 7: Equations", icon: "🔤", generator: window.AlgebraGenerator },
    geometry: { name: "Ch 9-10: Area & Volume", icon: "📐", generator: window.GeometryGenerator },
    measurement: { name: "Measurement Skills", icon: "📏", generator: window.MeasurementGenerator },
    wordProblems: { name: "Word Problems", icon: "📖", generator: window.WordProblemsGenerator }
};

// UPDATED: Glencoe Course 1 Chapter-by-Chapter Learning Path
const learningPath = [
    {
        stage: 1,
        name: "Chapter 1: Ratios and Rates",
        description: "Understand relationships between quantities",
        topics: [
            { key: 'ratios', required: 20, name: 'Ratios and Rates Practice' }
        ],
        lessons: [
            "1.1 Factors and Multiples",
            "1.2 Ratios",
            "1.3 Rates", 
            "1.4 Ratio Tables",
            "1.5 Graph Ratios",
            "1.6 Equivalent Ratios",
            "1.7 Ratio and Rate Problems"
        ]
    },
    {
        stage: 2,
        name: "Chapter 2: Fractions, Decimals, and Percents",
        description: "Convert between different number forms",
        topics: [
            { key: 'decimals', required: 20, name: 'Decimals and Percents Practice' }
        ],
        lessons: [
            "2.1 Decimals and Fractions",
            "2.2 Percents and Fractions",
            "2.3 Percents and Decimals",
            "2.4 Percent of a Number",
            "2.5 Compare and Order Fractions, Decimals, and Percents"
        ]
    },
    {
        stage: 3,
        name: "Chapter 3: Compute with Multi-Digit Numbers",
        description: "Operations with whole numbers and decimals",
        topics: [
            { key: 'operations', required: 25, name: 'Multi-Digit Operations' }
        ],
        lessons: [
            "3.1 Add and Subtract Decimals",
            "3.2 Estimate Products",
            "3.3 Multiply Decimals",
            "3.4 Divide Multi-Digit Numbers", // Jordan needs this!
            "3.5 Divide Decimals",
            "3.6 Add and Subtract Fractions with Unlike Denominators"
        ]
    },
    {
        stage: 4,
        name: "Chapter 4: Multiply and Divide Fractions",
        description: "Operations with fractions and mixed numbers",
        topics: [
            { key: 'fractions', required: 20, name: 'Fraction Operations' },
            { key: 'mixedNumbers', required: 15, name: 'Mixed Numbers' }
        ],
        lessons: [
            "4.1 Estimate Products of Fractions",
            "4.2 Multiply Fractions",
            "4.3 Simplify Before Multiplying",
            "4.4 Multiply Mixed Numbers",
            "4.5 Divide Whole Numbers by Fractions",
            "4.6 Divide Fractions",
            "4.7 Divide Mixed Numbers"
        ]
    },
    {
        stage: 5,
        name: "Chapter 5: Integers and the Coordinate Plane",
        description: "Positive and negative numbers, coordinate graphing",
        topics: [
            { key: 'integers', required: 20, name: 'Integer Operations' }
        ],
        lessons: [
            "5.1 Integers and Opposites",
            "5.2 Absolute Value",
            "5.3 Compare and Order Integers",
            "5.4 Add Integers",
            "5.5 Subtract Integers",
            "5.6 Distance on the Coordinate Plane"
        ]
    },
    {
        stage: 6,
        name: "Chapter 6: Expressions",
        description: "Write and evaluate algebraic expressions",
        topics: [
            { key: 'expressions', required: 15, name: 'Algebraic Expressions' }
        ],
        lessons: [
            "6.1 Powers and Exponents",
            "6.2 Order of Operations",
            "6.3 Write Algebraic Expressions",
            "6.4 Evaluate Algebraic Expressions",
            "6.5 Properties",
            "6.6 The Distributive Property",
            "6.7 Simplify Algebraic Expressions"
        ]
    },
    {
        stage: 7,
        name: "Chapter 7: Equations",
        description: "Solve one-step and two-step equations",
        topics: [
            { key: 'algebra', required: 20, name: 'Solving Equations' }
        ],
        lessons: [
            "7.1 Solve One-Step Addition and Subtraction Equations",
            "7.2 Solve One-Step Multiplication and Division Equations",
            "7.3 Solve Two-Step Equations",
            "7.4 Write and Solve Equations"
        ]
    },
    {
        stage: 8,
        name: "Chapter 8: Functions and Inequalities",
        description: "Understand functions and solve inequalities",
        topics: [
            { key: 'algebra', required: 15, name: 'Functions and Inequalities' }
        ],
        lessons: [
            "8.1 Function Tables",
            "8.2 Function Rules",
            "8.3 Functions and Equations",
            "8.4 Multiple Representations of Functions",
            "8.5 Inequalities",
            "8.6 Write and Graph Inequalities"
        ]
    },
    {
        stage: 9,
        name: "Chapter 9: Area",
        description: "Find area of various shapes",
        topics: [
            { key: 'geometry', required: 20, name: 'Area Calculations' }
        ],
        lessons: [
            "9.1 Area of Rectangles",
            "9.2 Area of Parallelograms",
            "9.3 Area of Triangles",
            "9.4 Area of Trapezoids",
            "9.5 Area of Composite Figures",
            "9.6 Area of Irregular Figures"
        ]
    },
    {
        stage: 10,
        name: "Chapter 10: Volume and Surface Area",
        description: "3D measurements and calculations",
        topics: [
            { key: 'geometry', required: 20, name: 'Volume and Surface Area' }
        ],
        lessons: [
            "10.1 Volume of Rectangular Prisms",
            "10.2 Volume of Triangular Prisms",
            "10.3 Volume of Pyramids",
            "10.4 Surface Area of Rectangular Prisms",
            "10.5 Surface Area of Triangular Prisms",
            "10.6 Surface Area of Pyramids"
        ]
    },
    {
        stage: 11,
        name: "Chapter 11: Statistical Measures",
        description: "Analyze data using statistical concepts",
        topics: [
            { key: 'wordProblems', required: 15, name: 'Statistical Word Problems' }
        ],
        lessons: [
            "11.1 Mean",
            "11.2 Median",
            "11.3 Mode and Range",
            "11.4 Quartiles and Outliers",
            "11.5 Histograms",
            "11.6 Box Plots"
        ]
    },
    {
        stage: 12,
        name: "Chapter 12: Statistical Displays",
        description: "Create and interpret data displays",
        topics: [
            { key: 'wordProblems', required: 15, name: 'Data Display Problems' }
        ],
        lessons: [
            "12.1 Line Plots",
            "12.2 Stem-and-Leaf Plots",
            "12.3 Circle Graphs",
            "12.4 Choose an Appropriate Display",
            "12.5 Use Appropriate Scales",
            "12.6 Misleading Graphs and Statistics"
        ]
    }
];

// Make learning path available globally for parent dashboard
window.learningPath = learningPath;

// Initialize App
document.addEventListener('DOMContentLoaded', async function() {
    await loadUserData();  // Wait for data to load first
    await loadParentSettings();
    checkDailyReset();  // Then check daily reset
    initializeTopics();
    showTopicSelection();
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
    try {
        // Try Firebase first
        const doc = await db.collection('settings').doc('parent').get();
        if (doc.exists) {
            parentSettings = doc.data();
            console.log('Loaded from Firebase:', parentSettings);
            localStorage.setItem('parentSettingsBackup', JSON.stringify(parentSettings));
            return;
        }
    } catch (error) {
        console.log('Firebase load failed:', error);
    }
    
    // Try localStorage if Firebase failed or had no data
    const localData = localStorage.getItem('parentSettingsBackup');
    if (localData) {
        try {
            parentSettings = JSON.parse(localData);
            console.log('Loaded from localStorage:', parentSettings);
            
            // If we have local data, try to sync it to Firebase
            if (parentSettings.pinHash) {
                saveParentSettings().catch(err => console.log('Could not sync to Firebase:', err));
            }
            return;
        } catch (e) {
            console.error('Failed to parse localStorage:', e);
        }
    }
    
    // Only use defaults if NOTHING exists
    console.log('No saved settings found, using defaults');
    parentSettings = {
        pinHash: hashPIN('1234'),
        initialized: false,
        lockedTopics: [],
        difficultySettings: {},
        lastPinChange: null
    };
    
    // Save the defaults
    await saveParentSettings();
}

// ENHANCED: Save user data with backup
async function saveUserData() {
    try {
        userData.lastActivity = new Date().toISOString();
        console.log('SAVING: correctCount=' + userData.correctCount + ', completedToday=' + userData.completedToday);
        await db.collection('users').doc('jordan').set(userData);
        localStorage.setItem('jordanMathBackup', JSON.stringify(userData));
        console.log('Save successful');
    } catch (error) {
        console.error("Error saving data:", error);
        localStorage.setItem('jordanMathBackup', JSON.stringify(userData));
    }
}

// Save parent settings with backup
async function saveParentSettings() {
    try {
        // Save to Firebase (primary)
        await db.collection('settings').doc('parent').set(parentSettings);
        
        // Also save to localStorage (backup)
        localStorage.setItem('parentSettingsBackup', JSON.stringify(parentSettings));
    } catch (error) {
        console.error("Firebase save failed, using localStorage only:", error);
        // If Firebase fails, at least save locally
        localStorage.setItem('parentSettingsBackup', JSON.stringify(parentSettings));
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
        // Don't save here - let it save later when data is ready
        // saveUserData();
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
        userData.currentChapter = currentStage + 1;
        saveUserData();
        return getRecommendedTopic();
    }
    
    return null;
}

// NEW: Chapter selector function
function setCurrentChapter(chapterNumber) {
    userData.currentStage = parseInt(chapterNumber);
    userData.currentChapter = parseInt(chapterNumber);
    saveUserData();
    initializeTopics();
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
    
    // NEW: Add chapter selector at the top
    let html = `
        <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
            <h3>📚 Select Your Current Chapter</h3>
            <p style="margin-bottom: 15px;">What chapter is your class working on?</p>
            <select id="chapterSelect" onchange="setCurrentChapter(this.value)" 
                    style="width: 100%; padding: 10px; font-size: 16px; border-radius: 5px; border: 2px solid #667eea;">
                ${learningPath.map((chapter, index) => `
                    <option value="${index + 1}" ${currentStage === index + 1 ? 'selected' : ''}>
                        ${chapter.name}
                    </option>
                `).join('')}
            </select>
            
            <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 10px;">
                <h4>Lessons in ${stage.name}:</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    ${stage.lessons.map(lesson => 
                        `<li style="margin: 5px 0;">${lesson}</li>`
                    ).join('')}
                </ul>
            </div>
        </div>
    `;
    
    html += `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
            <h3>🎯 Current Chapter - ${stage ? stage.name : 'Complete!'}</h3>
            <p>${stage ? stage.description : 'You\'ve completed all chapters!'}</p>
            
            <div style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; margin: 15px 0;">
                <div style="background: white; width: ${(currentStage - 1) / learningPath.length * 100}%; 
                            height: 100%; border-radius: 5px; transition: width 0.5s;"></div>
            </div>
            
            ${recommended ? `
                <div style="background: rgba(255,255,255,0.3); padding: 10px; border-radius: 10px; margin-top: 10px;">
                    <strong>Next Up:</strong> ${recommended.name} 
                    (${recommended.completed}/${recommended.required} completed)
                </div>
            ` : '<div style="padding: 10px;">🏆 Chapter completed! Move to next chapter or practice more.</div>'}
        </div>
    `;
    
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
                Switch to Chapter Mode
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
    
    // Determine availability and styling based on current chapter
    let isAvailable = !userData.pathMode;
    let isRecommended = false;
    let stageInfo = null;
    
    if (userData.pathMode) {
        // Check if this topic is in the current chapter
        const currentChapterData = learningPath[currentStage - 1];
        const topicInCurrentChapter = currentChapterData?.topics.find(t => t.key === key);
        
        if (topicInCurrentChapter) {
            isAvailable = true;
            isRecommended = recommended && recommended.key === key;
            stageInfo = {
                stage: currentStage,
                required: topicInCurrentChapter.required
            };
        } else {
            // Check if it's in any chapter for display purposes
            for (let i = 0; i < learningPath.length; i++) {
                const checkStage = learningPath[i];
                const topicInStage = checkStage.topics.find(t => t.key === key);
                if (topicInStage) {
                    stageInfo = {
                        stage: i + 1,
                        required: topicInStage.required
                    };
                    // Available if in current or previous chapters
                    isAvailable = (i + 1) <= currentStage;
                    break;
                }
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
        ${stageInfo && userData.pathMode ? `<div style="font-size: 0.8em; margin-top: 5px; opacity: 0.7;">Chapter ${stageInfo.stage}</div>` : ''}
        ${masteryHTML}
    `;
    
    // Set click handler
    if (!isLocked && isAvailable) {
        card.onclick = () => startTopic(key);
    } else if (isLocked) {
        card.onclick = () => alert("This topic is locked by parent controls");
    } else {
        card.onclick = () => alert(`This topic is in Chapter ${stageInfo?.stage}. Switch to that chapter to practice.`);
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
        let userAnswer = input.value.trim();
        
        if (!userAnswer) {
            alert("Please enter an answer!");
            return;
        }
        
        // Normalize spaces in both answers (replace multiple spaces with single space)
        userAnswer = userAnswer.replace(/\s+/g, ' ');
        let correctAnswer = currentQuestion.answer.toString().replace(/\s+/g, ' ');
        
        // Check if this is a fraction or mixed number answer
        if (correctAnswer.includes('/') || userAnswer.includes('/')) {
            // Direct string comparison for fractions/mixed numbers
            isCorrect = (userAnswer === correctAnswer);
        } else {
            // For numeric answers, do numeric comparison
            const numericAnswer = parseFloat(userAnswer.replace(/[^\d.-]/g, ''));
            const correctNum = parseFloat(correctAnswer);
            isCorrect = Math.abs(numericAnswer - correctNum) < 0.01;
        }
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
            userData.currentChapter = nextStage;
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
        saveParentSettings();
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
// Use getters to ensure we always get current values
Object.defineProperty(window, 'userData', {
    get: function() { return userData; },
    set: function(val) { userData = val; }
});

Object.defineProperty(window, 'parentSettings', {
    get: function() { return parentSettings; },
    set: function(val) { parentSettings = val; }
});

Object.defineProperty(window, 'currentStreak', {
    get: function() { return currentStreak; },
    set: function(val) { currentStreak = val; }
});

window.topics = topics;
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
window.setCurrentChapter = setCurrentChapter;
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
