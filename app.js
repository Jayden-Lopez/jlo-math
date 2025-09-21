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

// User Progress Data
let userData = {
    completedProblems: {},
    totalAttempts: 0,
    correctCount: 0,
    topicProgress: {},
    lastActivity: new Date().toISOString()
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

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    initializeTopics();
    showTopicSelection();
});

// Load user data from Firebase
async function loadUserData() {
    try {
        const doc = await db.collection('users').doc('jordan').get();
        if (doc.exists) {
            userData = doc.data();
            updateStats();
            updateLevel();
        } else {
            // Create initial document
            await saveUserData();
        }
    } catch (error) {
        console.error("Error loading data:", error);
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

// Initialize topic cards
function initializeTopics() {
    const topicGrid = document.getElementById('topicGrid');
    topicGrid.innerHTML = '';
    
    for (const [key, topic] of Object.entries(topics)) {
        const progress = userData.topicProgress[key] || { completed: 0, attempts: 0 };
        const card = document.createElement('div');
        card.className = 'topic-card';
        
        if (progress.completed >= 10) {
            card.className += ' completed';
        } else if (progress.completed > 0) {
            card.className += ' in-progress';
        }
        
        card.innerHTML = `
            <div class="topic-name">${topic.icon} ${topic.name}</div>
            <div class="topic-progress">Completed: ${progress.completed}</div>
        `;
        
        card.onclick = () => startTopic(key);
        topicGrid.appendChild(card);
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
        userData.topicProgress[currentTopic] = { completed: 0, attempts: 0 };
    }
    userData.topicProgress[currentTopic].attempts++;
    
    if (isCorrect) {
        userData.correctCount++;
        userData.topicProgress[currentTopic].completed++;
        currentStreak++;
        showFeedback(true);
    } else {
        currentStreak = 0;
        showFeedback(false);
    }
    
    // Save progress
    saveUserData();
    updateStats();
    
    // Stop timer
    clearInterval(timerInterval);
    
    // Disable submit button
    document.getElementById('submitBtn').disabled = true;
    
    // Show next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
        document.getElementById('submitBtn').disabled = false;
    }, 3000);
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
        `;
    }
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
    document.getElementById('levelDisplay').textContent = `Level: ${level}`;
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
    const modal = document.getElementById('parentModal');
    const statsDiv = document.getElementById('parentStats');
    
    const accuracy = userData.totalAttempts > 0 ? 
        Math.round((userData.correctCount / userData.totalAttempts) * 100) : 0;
    
    let topicStats = '<h3>Progress by Topic:</h3>';
    for (const [key, topic] of Object.entries(topics)) {
        const progress = userData.topicProgress[key] || { completed: 0, attempts: 0 };
        const topicAccuracy = progress.attempts > 0 ? 
            Math.round((progress.completed / progress.attempts) * 100) : 0;
        
        topicStats += `
            <div style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 10px;">
                <strong>${topic.name}:</strong> 
                ${progress.completed} completed | 
                ${progress.attempts} attempts | 
                ${topicAccuracy}% accuracy
            </div>
        `;
    }
    
    statsDiv.innerHTML = `
        <div style="padding: 20px;">
            <h3>Overall Statistics:</h3>
            <p><strong>Total Problems Completed:</strong> ${userData.correctCount}</p>
            <p><strong>Total Attempts:</strong> ${userData.totalAttempts}</p>
            <p><strong>Overall Accuracy:</strong> ${accuracy}%</p>
            <p><strong>Current Level:</strong> ${calculateLevel()}</p>
            <p><strong>Last Active:</strong> ${new Date(userData.lastActivity).toLocaleDateString()}</p>
            ${topicStats}
            <button class="btn btn-primary" onclick="resetProgress()">Reset All Progress</button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeParentDashboard() {
    document.getElementById('parentModal').style.display = 'none';
}

// Reset progress
function resetProgress() {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
        userData = {
            completedProblems: {},
            totalAttempts: 0,
            correctCount: 0,
            topicProgress: {},
            lastActivity: new Date().toISOString()
        };
        currentStreak = 0;
        saveUserData();
        updateStats();
        updateLevel();
        initializeTopics();
        closeParentDashboard();
        alert("Progress has been reset!");
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('parentModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}