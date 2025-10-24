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
    currentStage: 3, // Start at Chapter 3 (where Jordan's class is)
    currentChapter: 3, // Track current textbook chapter
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
    ixlPractice: { name: "IXL Targeted Practice", icon: "🎯", generator: window.IXLPracticeGenerator },
    ratios: { name: "Ch 1: Ratios & Rates", icon: "⚖️", generator: window.RatiosGenerator },
    decimals: { name: "Ch 2: Decimals & Percents", icon: "💯", generator: window.DecimalsGenerator },
    operations: { name: "Ch 3: Multi-Digit Operations", icon: "➕", generator: window.OperationsGenerator },
    fractions: { name: "Ch 4: Fractions", icon: "🍕", generator: window.FractionsGenerator },
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
    let currentStage = userData.currentStage || 1;

    // Validate that the current stage is unlocked
    // If it's locked, find the highest unlocked chapter
    if (window.MasteryTracker) {
        const unlockStatus = window.MasteryTracker.isChapterUnlocked(currentStage, userData, learningPath);

        if (!unlockStatus.unlocked) {
            // Current stage is locked, find the highest unlocked chapter
            for (let i = learningPath.length; i >= 1; i--) {
                const checkStatus = window.MasteryTracker.isChapterUnlocked(i, userData, learningPath);
                if (checkStatus.unlocked) {
                    currentStage = i;
                    // Note: Don't modify userData here to avoid infinite loop
                    // The caller should update userData if needed
                    break;
                }
            }
        }
    }

    return currentStage;
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
    // Use iteration instead of recursion to prevent stack overflow
    let stageNum = getCurrentStage();
    const maxIterations = learningPath.length; // Safety limit
    let iterations = 0;

    while (stageNum <= learningPath.length && iterations < maxIterations) {
        iterations++;
        const stage = learningPath[stageNum - 1];

        if (!stage) return null;

        // Look for incomplete topics in current stage
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

        // Current stage is complete, try next stage
        if (stageNum < learningPath.length) {
            stageNum++;
            // Only update userData if this stage is actually unlocked
            if (window.MasteryTracker) {
                const unlockStatus = window.MasteryTracker.isChapterUnlocked(stageNum, userData, learningPath);
                if (unlockStatus.unlocked) {
                    userData.currentStage = stageNum;
                    userData.currentChapter = stageNum;
                    saveUserData();
                } else {
                    // Can't advance to locked stage, stop here
                    break;
                }
            } else {
                userData.currentStage = stageNum;
                userData.currentChapter = stageNum;
                saveUserData();
            }
        } else {
            // Reached end of learning path
            break;
        }
    }

    return null;
}

// NEW: Chapter selector function
function setCurrentChapter(chapterNumber) {
    const newChapter = parseInt(chapterNumber);

    // Check if trying to advance beyond mastered chapters
    if (window.MasteryTracker && newChapter > userData.currentChapter) {
        // Check if previous chapter is mastered
        const previousMastery = window.MasteryTracker.checkChapterMastery(
            newChapter - 1,
            userData,
            learningPath
        );

        if (!previousMastery.mastered) {
            alert(`⚠️ Cannot advance to Chapter ${newChapter} yet!\n\nYou must first master Chapter ${newChapter - 1}:\n\n${previousMastery.topicsNeeded.map(t => `• ${t.name}: ${t.status}`).join('\n')}`);

            // Reset dropdown to current chapter
            document.getElementById('chapterSelect').value = userData.currentChapter;
            return;
        }
    }

    userData.currentStage = newChapter;
    userData.currentChapter = newChapter;
    saveUserData();
    initializeTopics();
}

// Show chapter progress in a modal window
function showChapterProgress(chapterNum) {
    if (!chapterNum) {
        // User selected the placeholder option, do nothing
        return;
    }

    const chapterNumber = parseInt(chapterNum);
    const stage = learningPath[chapterNumber - 1];

    if (!stage) return;

    let chapterMastery = null;
    if (window.MasteryTracker) {
        chapterMastery = window.MasteryTracker.checkChapterMastery(chapterNumber, userData, learningPath);
    }

    // Create modal content
    const modalContent = `
        <div style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <h2 style="color: #667eea; margin-bottom: 10px;">${stage.name}</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">${stage.description}</p>

            ${generateChapterDetailedProgress(chapterNumber, stage, chapterMastery)}
        </div>
    `;

    // Get or create modal
    let modal = document.getElementById('chapterProgressModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'chapterProgressModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="margin: 20px auto; padding: 30px; max-width: 90%; background: white; border-radius: 20px;">
                <span class="close" onclick="closeChapterProgressModal()" style="float: right; font-size: 28px; font-weight: bold; cursor: pointer; color: #999;">&times;</span>
                <div id="chapterProgressContent"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.onclick = function(event) {
            if (event.target === modal) {
                closeChapterProgressModal();
            }
        };
    }

    // Update content and show modal
    document.getElementById('chapterProgressContent').innerHTML = modalContent;
    modal.style.display = 'flex';

    // Reset dropdown to placeholder
    setTimeout(() => {
        document.getElementById('chapterSelect').value = '';
    }, 100);
}

function closeChapterProgressModal() {
    const modal = document.getElementById('chapterProgressModal');
    if (modal) {
        modal.style.display = 'none';
    }
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

function generateChapterDetailedProgress(chapterNum, stage, chapterMastery) {
    if (!stage) return '<p>Chapter not found</p>';

    let html = '';

    // Topic Progress Section
    html += '<h4 style="color: #667eea; margin-bottom: 15px;">📊 Topic Progress:</h4>';

    stage.topics.forEach(topic => {
        const topicData = topics[topic.key];
        const progress = userData.topicProgress[topic.key] || { completed: 0, attempts: 0 };
        const accuracy = progress.attempts > 0 ? Math.round((progress.completed / progress.attempts) * 100) : 0;
        const percentComplete = Math.min(100, Math.round((progress.completed / topic.required) * 100));

        // Determine status
        let status = '';
        let statusColor = '';
        let statusIcon = '';
        if (window.MasteryTracker) {
            const mastery = window.MasteryTracker.checkMastery(topic.key, userData);
            if (mastery.mastered) {
                status = 'Mastered!';
                statusColor = '#10b981';
                statusIcon = '✅';
            } else if (progress.completed >= topic.required * 0.7) {
                status = 'Almost there!';
                statusColor = '#f59e0b';
                statusIcon = '⚠️';
            } else if (progress.completed > 0) {
                status = 'In progress';
                statusColor = '#3b82f6';
                statusIcon = '📝';
            } else {
                status = 'Not started';
                statusColor = '#9ca3af';
                statusIcon = '❌';
            }
        }

        html += `
            <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid ${statusColor};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #2d3748;">${statusIcon} ${topicData.icon} ${topicData.name}</strong>
                    <span style="background: ${statusColor}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.85em; font-weight: bold;">
                        ${status}
                    </span>
                </div>
                <div style="font-size: 0.9em; color: #4a5568; margin-bottom: 8px;">
                    Progress: ${progress.completed}/${topic.required} completed (${percentComplete}%) • Accuracy: ${accuracy}%
                </div>
                <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: ${statusColor}; width: ${percentComplete}%; height: 100%; transition: width 0.3s;"></div>
                </div>
                ${progress.completed < topic.required ? `
                    <div style="font-size: 0.85em; color: #6b7280; margin-top: 8px;">
                        ⏱️ ${topic.required - progress.completed} more problem${topic.required - progress.completed !== 1 ? 's' : ''} needed
                        ${accuracy < 80 ? ` • Need ${80 - accuracy}% higher accuracy` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    });

    // Lessons Covered Section
    html += '<h4 style="color: #667eea; margin: 20px 0 15px 0;">📚 Lessons Covered:</h4>';
    html += '<div style="background: white; padding: 15px; border-radius: 10px;">';
    html += '<ul style="list-style: none; padding: 0; margin: 0;">';

    stage.lessons.forEach((lesson, index) => {
        // Simple heuristic: mark lessons as complete based on overall chapter progress
        const lessonProgress = chapterMastery ? (chapterMastery.completedTopics / chapterMastery.totalTopics) : 0;
        const lessonIndex = index / stage.lessons.length;

        let lessonIcon = '';
        let lessonStyle = '';
        if (lessonIndex < lessonProgress) {
            lessonIcon = '✅';
            lessonStyle = 'color: #10b981;';
        } else if (lessonIndex < lessonProgress + 0.3) {
            lessonIcon = '⚠️';
            lessonStyle = 'color: #f59e0b;';
        } else {
            lessonIcon = '○';
            lessonStyle = 'color: #9ca3af;';
        }

        html += `<li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; ${lessonStyle}">
            ${lessonIcon} ${lesson}
        </li>`;
    });

    html += '</ul></div>';

    // Recent Activity Section
    const recentActivity = getRecentActivityForChapter(chapterNum);
    html += '<h4 style="color: #667eea; margin: 20px 0 15px 0;">📈 Recent Activity:</h4>';
    html += `
        <div style="background: white; padding: 15px; border-radius: 10px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <div style="font-size: 0.85em; color: #6b7280;">Last Practiced:</div>
                    <div style="font-size: 1.1em; font-weight: bold; color: #2d3748;">${recentActivity.lastPracticed}</div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: #6b7280;">This Week:</div>
                    <div style="font-size: 1.1em; font-weight: bold; color: #2d3748;">${recentActivity.thisWeek} problems</div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: #6b7280;">Best Accuracy:</div>
                    <div style="font-size: 1.1em; font-weight: bold; color: #2d3748;">${recentActivity.bestAccuracy}%</div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: #6b7280;">Time to Master:</div>
                    <div style="font-size: 1.1em; font-weight: bold; color: #2d3748;">${recentActivity.timeToMaster}</div>
                </div>
            </div>
        </div>
    `;

    // Recommendation Section
    const recommendation = getChapterRecommendation(chapterNum, stage, chapterMastery);
    if (recommendation) {
        html += `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px; margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">💡 Recommendation:</h4>
                <p style="margin: 0; font-size: 1.05em;">${recommendation}</p>
            </div>
        `;
    }

    return html;
}

function getRecentActivityForChapter(chapterNum) {
    const stage = learningPath[chapterNum - 1];
    if (!stage) return { lastPracticed: 'Never', thisWeek: 0, bestAccuracy: 0, timeToMaster: 'Unknown' };

    let lastPracticed = null;
    let thisWeekCount = 0;
    let bestAccuracy = 0;
    let totalNeeded = 0;
    let totalCompleted = 0;

    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    stage.topics.forEach(topic => {
        const progress = userData.topicProgress[topic.key] || { completed: 0, attempts: 0, lastActivity: null };

        if (progress.lastActivity) {
            const activityDate = new Date(progress.lastActivity);
            if (!lastPracticed || activityDate > lastPracticed) {
                lastPracticed = activityDate;
            }
            if (activityDate.getTime() > oneWeekAgo) {
                thisWeekCount += progress.completed;
            }
        }

        const accuracy = progress.attempts > 0 ? Math.round((progress.completed / progress.attempts) * 100) : 0;
        if (accuracy > bestAccuracy) bestAccuracy = accuracy;

        totalNeeded += topic.required;
        totalCompleted += Math.min(progress.completed, topic.required);
    });

    const remaining = totalNeeded - totalCompleted;
    let timeToMaster = 'Unknown';
    if (remaining <= 0) {
        timeToMaster = 'Complete!';
    } else if (remaining <= 10) {
        timeToMaster = '~20 min';
    } else if (remaining <= 25) {
        timeToMaster = '~45 min';
    } else if (remaining <= 50) {
        timeToMaster = '~90 min';
    } else {
        timeToMaster = `~${Math.ceil(remaining / 30)} sessions`;
    }

    return {
        lastPracticed: lastPracticed ? formatTimeAgo(lastPracticed) : 'Never',
        thisWeek: thisWeekCount,
        bestAccuracy: bestAccuracy,
        timeToMaster: timeToMaster
    };
}

function getChapterRecommendation(chapterNum, stage, chapterMastery) {
    if (!chapterMastery) return null;

    if (chapterMastery.mastered) {
        return `🎉 Chapter ${chapterNum} is complete! Ready to advance to the next chapter.`;
    }

    // Find the topic that needs the most work
    let needsMostWork = null;
    let lowestProgress = Infinity;

    stage.topics.forEach(topic => {
        const progress = userData.topicProgress[topic.key] || { completed: 0, attempts: 0 };
        const percentComplete = progress.completed / topic.required;
        const accuracy = progress.attempts > 0 ? (progress.completed / progress.attempts) : 0;
        const score = percentComplete + (accuracy * 0.5); // Combined score

        if (score < lowestProgress) {
            lowestProgress = score;
            needsMostWork = topic;
        }
    });

    if (needsMostWork) {
        const topicData = topics[needsMostWork.key];
        const progress = userData.topicProgress[needsMostWork.key] || { completed: 0 };
        const accuracy = progress.attempts > 0 ? Math.round((progress.completed / progress.attempts) * 100) : 0;

        if (accuracy < 70) {
            return `Focus on ${topicData.name} to improve accuracy. Try IXL Practice for targeted skill work.`;
        } else {
            return `Keep practicing ${topicData.name} - you're making good progress! ${needsMostWork.required - progress.completed} more to go.`;
        }
    }

    return 'Keep up the great work! Practice any topic to continue progressing.';
}

function formatTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

function buildPathModeUI(container) {
    const currentStage = getCurrentStage();
    const stage = learningPath[currentStage - 1];
    const recommended = getRecommendedTopic();

    // Check mastery status for current chapter
    let chapterMastery = null;
    if (window.MasteryTracker) {
        chapterMastery = window.MasteryTracker.checkChapterMastery(currentStage, userData, learningPath);
    }
    
    // Chapter overview dropdown - minimal space usage
    let html = `
        <div style="background: #f0f9ff; padding: 15px; border-radius: 15px; margin-bottom: 20px;">
            <select id="chapterSelect" onchange="showChapterProgress(this.value)"
                    style="width: 100%; padding: 12px; font-size: 16px; border-radius: 8px; border: 2px solid #667eea;">
                <option value="">📚 Choose chapter to view update</option>
                ${learningPath.map((chapter, index) => {
                    const chapterNum = index + 1;
                    const unlockStatus = window.MasteryTracker ?
                        window.MasteryTracker.isChapterUnlocked(chapterNum, userData, learningPath) :
                        { unlocked: true };
                    const lockIcon = unlockStatus.unlocked ? '' : '🔒 ';

                    return `
                        <option value="${chapterNum}"
                                ${!unlockStatus.unlocked ? 'disabled' : ''}>
                            ${lockIcon}${chapter.name}
                        </option>
                    `;
                }).join('')}
            </select>
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
            
            ${chapterMastery ? `
                <div style="background: rgba(255,255,255,0.3); padding: 10px; border-radius: 10px; margin-top: 10px;">
                    <strong>Progress:</strong> ${chapterMastery.completedTopics}/${chapterMastery.totalTopics} topics mastered
                </div>
            ` : ''}
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

    // IXL Practice is ALWAYS available (never locked)
    const isIXLPractice = key === 'ixlPractice';

    // Check mastery using MasteryTracker
    let masteryHTML = '';
    let isMastered = false;
    if (window.MasteryTracker && !isIXLPractice) {
        const mastery = window.MasteryTracker.checkMastery(key, userData);
        isMastered = mastery.mastered;

        if (mastery.mastered) {
            masteryHTML = '<div style="background: gold; color: #333; padding: 5px; border-radius: 10px; margin-top: 5px; font-weight: bold;">🏆 MASTERED!</div>';
            card.className += ' mastered';
        } else {
            masteryHTML = `<div style="font-size: 0.8em; color: #666; margin-top: 5px; padding: 5px; background: #f3f4f6; border-radius: 5px;">${mastery.progress.message}</div>`;
        }
    }

    // Determine availability based on chapter system
    let isAvailable = !userData.pathMode || isIXLPractice; // IXL Practice always available
    let isRecommended = false;
    let stageInfo = null;
    let lockReason = '';

    if (userData.pathMode && !isIXLPractice) {
        // Find which chapter this topic belongs to
        for (let i = 0; i < learningPath.length; i++) {
            const checkStage = learningPath[i];
            const topicInStage = checkStage.topics.find(t => t.key === key);
            if (topicInStage) {
                stageInfo = {
                    stage: i + 1,
                    required: topicInStage.required
                };

                // Check if this chapter is unlocked
                if (window.MasteryTracker) {
                    const unlockStatus = window.MasteryTracker.isChapterUnlocked(i + 1, userData, learningPath);
                    isAvailable = unlockStatus.unlocked;
                    if (!unlockStatus.unlocked) {
                        lockReason = unlockStatus.reason;
                    }
                } else {
                    // Fallback: available if in current or previous chapters
                    isAvailable = (i + 1) <= currentStage;
                }

                // Check if it's the recommended topic
                isRecommended = recommended && recommended.key === key;
                break;
            }
        }
    }

    // Add special styling for IXL Practice
    if (isIXLPractice) {
        masteryHTML = '<div style="background: #667eea; color: white; padding: 5px; border-radius: 10px; margin-top: 5px; font-weight: bold;">⚡ Always Available</div>';
    }
    
    // Apply styling
    if (isLocked) {
        card.className += ' locked';
    } else if (!isAvailable) {
        card.className += ' locked';
        card.style.opacity = '0.5';
        card.style.border = '2px solid #e5e7eb';
    } else if (isMastered) {
        card.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
        card.style.color = 'white';
    } else if (isRecommended) {
        card.className += ' recommended';
        card.style.border = '3px solid #667eea';
        card.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
    } else if (progress.completed >= 10) {
        card.className += ' in-progress';
    }
    
    // Build card content
    card.innerHTML = `
        ${isRecommended ? '<div style="position: absolute; top: -10px; right: -10px; background: #667eea; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em;">NEXT</div>' : ''}
        ${isMastered ? '<div style="position: absolute; top: -10px; left: -10px; font-size: 1.5em;">🏆</div>' : ''}
        ${!isAvailable && !isLocked ? '<div style="position: absolute; top: 10px; right: 10px; font-size: 1.5em;">🔒</div>' : ''}
        <div class="topic-name">${topic.icon} ${topic.name}</div>
        <div class="topic-progress">Completed: ${progress.completed}${stageInfo ? `/${stageInfo.required}` : ''}</div>
        <div class="topic-accuracy">Accuracy: ${accuracy}%</div>
        ${stageInfo && userData.pathMode ? `<div style="font-size: 0.8em; margin-top: 5px; opacity: 0.7;">Chapter ${stageInfo.stage}</div>` : ''}
        ${masteryHTML}
        ${!isAvailable && lockReason ? `<div style="font-size: 0.75em; color: #ef4444; margin-top: 5px; font-weight: bold;">🔒 ${lockReason}</div>` : ''}
    `;
    
    // Set click handler
    if (!isLocked && isAvailable) {
        card.onclick = () => startTopic(key);
        card.style.cursor = 'pointer';
    } else if (isLocked) {
        card.onclick = () => alert("This topic is locked by parent controls");
        card.style.cursor = 'not-allowed';
    } else {
        card.onclick = () => {
            if (stageInfo) {
                alert(`🔒 This topic is in Chapter ${stageInfo.stage}.\n\n${lockReason}\n\nMaster the previous chapter to unlock this one!`);
            }
        };
        card.style.cursor = 'not-allowed';
    }
    
    return card;
}

// Session Management
function startTopic(topicKey) {
    currentTopic = topicKey;
    currentQuestionIndex = 0;
    sessionQuestions = [];

    // Update currentChapter based on which topic was selected (unless it's IXL Practice)
    if (topicKey !== 'ixlPractice') {
        for (let i = 0; i < learningPath.length; i++) {
            const stage = learningPath[i];
            const topicInStage = stage.topics.find(t => t.key === topicKey);
            if (topicInStage) {
                userData.currentChapter = i + 1;
                userData.currentStage = i + 1;
                saveUserData();
                break;
            }
        }
    }

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
        userData.topicProgress[currentTopic] = { completed: 0, attempts: 0, accuracy: 0, lastActivity: null };
    }
    userData.topicProgress[currentTopic].attempts++;
    userData.topicProgress[currentTopic].lastActivity = new Date().toISOString();

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
    checkAndCelebrateMastery();
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

// NEW: Check and celebrate mastery achievements
function checkAndCelebrateMastery() {
    if (!window.MasteryTracker) return;
    
    const currentChapter = userData.currentChapter || userData.currentStage || 1;
    const mastery = window.MasteryTracker.checkChapterMastery(currentChapter, userData, learningPath);
    
    // Check if we just completed the chapter
    if (mastery.mastered && !userData.completedChapters) {
        userData.completedChapters = [];
    }
    
    if (mastery.mastered && !userData.completedChapters.includes(currentChapter)) {
        userData.completedChapters.push(currentChapter);
        saveUserData();
        
        // Show celebration
        setTimeout(() => {
            alert(`🎉🏆 CHAPTER ${currentChapter} MASTERED! 🏆🎉

${mastery.chapterName}

All ${mastery.totalTopics} topics completed with 80%+ accuracy!

${currentChapter < learningPath.length ? 
    `Chapter ${currentChapter + 1} is now unlocked! 🔓` : 
    'You\'ve completed all chapters! 🌟'}`);
        }, 500);
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
