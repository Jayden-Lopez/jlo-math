/**
 * Test UI Controller
 * Handles all UI interactions for the test simulation module
 */

console.log('test-ui.js is loading...');

// Test UI state
let testMode = false;
let currentTestQuestion = null;
let testModeTimerInterval = null;
let selectedTestAnswer = null;

console.log('test-ui.js variables declared');

/**
 * Toggle between practice mode and test mode
 */
function toggleMode() {
    console.log('toggleMode called, testMode:', testMode);

    // Check if required modules are loaded
    if (!window.learningPath) {
        alert('Learning path not loaded yet. Please wait a moment and try again.');
        console.error('window.learningPath is not defined');
        return;
    }

    if (!window.TestSimulation) {
        alert('Test simulation module not loaded yet. Please wait a moment and try again.');
        console.error('window.TestSimulation is not defined');
        return;
    }

    console.log('All modules loaded. Switching to', testMode ? 'practice' : 'test', 'mode');
    testMode = !testMode;

    const topicSelection = document.getElementById('topicSelection');
    const testSelection = document.getElementById('testSelection');
    const questionContainer = document.getElementById('questionContainer');
    const testContainer = document.getElementById('testContainer');
    const testResults = document.getElementById('testResults');
    const modeToggleBtn = document.getElementById('modeToggleBtn');

    if (testMode) {
        // Switch to test mode
        topicSelection.style.display = 'none';
        questionContainer.style.display = 'none';
        testSelection.style.display = 'block';
        testContainer.style.display = 'none';
        testResults.style.display = 'none';
        modeToggleBtn.textContent = '📚 Practice Mode';
        modeToggleBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        // Load chapter selection
        loadChapterSelection();
    } else {
        // Switch to practice mode
        topicSelection.style.display = 'block';
        testSelection.style.display = 'none';
        testContainer.style.display = 'none';
        testResults.style.display = 'none';
        modeToggleBtn.textContent = '📝 Test Simulation Mode';
        modeToggleBtn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

        // Stop test timer if running
        if (testModeTimerInterval) {
            clearInterval(testModeTimerInterval);
            testModeTimerInterval = null;
        }
    }
}

/**
 * Load chapter selection grid
 */
function loadChapterSelection() {
    const chapterGrid = document.getElementById('chapterGrid');
    chapterGrid.innerHTML = '';

    window.learningPath.forEach(chapter => {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        card.onclick = () => startChapterTest(chapter.stage);

        // Get test history for this chapter
        const history = window.TestSimulation.getTestHistory(chapter.stage);
        const lastTest = history.length > 0 ? history[history.length - 1] : null;

        let historyHTML = '';
        if (lastTest) {
            historyHTML = `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);">
                    <div style="font-size: 0.85em;">Last Score: ${lastTest.score}%</div>
                    <div style="font-size: 0.75em; opacity: 0.8;">${new Date(lastTest.date).toLocaleDateString()}</div>
                </div>
            `;
        }

        card.innerHTML = `
            <h3>Chapter ${chapter.stage}</h3>
            <p style="margin-top: 5px;">${chapter.name.replace('Chapter ' + chapter.stage + ': ', '')}</p>
            <p style="font-size: 0.85em; margin-top: 10px;">${chapter.topics.length} topic${chapter.topics.length > 1 ? 's' : ''}</p>
            ${historyHTML}
        `;

        chapterGrid.appendChild(card);
    });
}

/**
 * Start a test for a specific chapter
 */
function startChapterTest(chapterNum) {
    const chapter = window.learningPath.find(ch => ch.stage === chapterNum);
    if (!chapter) {
        alert('Chapter not found!');
        return;
    }

    // Calculate recommended questions based on lessons in the chapter
    // Find the generator for this chapter's topic to count lessons
    const topicKey = chapter.topics[0]?.key;
    const generator = topicKey ? window[topicKey.charAt(0).toUpperCase() + topicKey.slice(1) + 'Generator'] ||
                                 window.ExpressionsGenerator : null;
    const lessonCount = generator?.lessons?.length || chapter.topics.length;
    const recommendedQuestions = Math.max(21, lessonCount * 3); // At least 3 per lesson, minimum 21

    // Ask user for number of questions
    const numQuestions = prompt(
        `How many questions would you like?\n\n` +
        `Recommended: ${recommendedQuestions} questions (${lessonCount} lessons × 3 each)\n` +
        `This ensures good coverage of all topics!`,
        recommendedQuestions.toString()
    );

    if (!numQuestions) return;

    const num = parseInt(numQuestions);
    if (isNaN(num) || num < 5 || num > 50) {
        alert('Please enter a number between 5 and 50');
        return;
    }

    // Start the test
    const success = window.TestSimulation.startTest(chapterNum, num);
    if (!success) {
        alert('Failed to generate test. Please try again.');
        return;
    }

    // Hide test selection, show test container
    document.getElementById('testSelection').style.display = 'none';
    document.getElementById('testContainer').style.display = 'block';

    // Set test title
    document.getElementById('testTitle').textContent = chapter.name;

    // Start timer
    startTestTimer();

    // Show first question
    showTestQuestion();
}

/**
 * Start the test timer
 */
function startTestTimer() {
    if (testModeTimerInterval) {
        clearInterval(testModeTimerInterval);
    }

    testModeTimerInterval = setInterval(() => {
        const progress = window.TestSimulation.getProgress();
        if (progress) {
            const timeStr = window.TestSimulation.formatTime(progress.timeElapsed);
            document.getElementById('testTimer').textContent = timeStr;
        }
    }, 1000);
}

/**
 * Show current test question
 */
function showTestQuestion() {
    currentTestQuestion = window.TestSimulation.getCurrentQuestion();
    if (!currentTestQuestion) {
        // Test is over
        finishTest();
        return;
    }

    selectedTestAnswer = null;

    const progress = window.TestSimulation.getProgress();
    document.getElementById('testProgress').textContent =
        `Question ${progress.currentQuestion} of ${progress.totalQuestions}`;

    document.getElementById('testQuestionText').innerHTML = currentTestQuestion.question;

    // Clear feedback
    document.getElementById('testFeedbackArea').innerHTML = '';

    // Create answer section
    const answerSection = document.getElementById('testAnswerSection');
    answerSection.innerHTML = '';

    if (currentTestQuestion.options) {
        // Multiple choice
        const mcDiv = document.createElement('div');
        mcDiv.className = 'mc-options';

        currentTestQuestion.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'mc-option';
            optionDiv.textContent = option;
            optionDiv.onclick = () => selectTestOption(index, optionDiv);
            mcDiv.appendChild(optionDiv);
        });

        answerSection.appendChild(mcDiv);
    } else {
        // Text input
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'answer-input';
        input.id = 'testAnswerInput';
        input.placeholder = 'Type your answer here...';
        input.style.width = '100%';
        input.style.padding = '15px';
        input.style.fontSize = '1.2em';
        input.style.border = '3px solid #cbd5e0';
        input.style.borderRadius = '15px';
        input.style.marginTop = '20px';

        // Submit on Enter key
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                submitTestAnswer();
            }
        };

        answerSection.appendChild(input);
        input.focus();
    }

    // Reset buttons - show Submit, hide Next
    document.getElementById('testSubmitBtn').disabled = false;
    document.getElementById('testSubmitBtn').style.display = 'inline-block';
    document.getElementById('testNextBtn').style.display = 'none';
}

/**
 * Select a multiple choice option
 */
function selectTestOption(index, element) {
    // Remove selection from all options
    document.querySelectorAll('.mc-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Select this option
    element.classList.add('selected');
    selectedTestAnswer = index;
}

/**
 * Submit answer for current test question
 */
function submitTestAnswer() {
    let userAnswer;

    if (currentTestQuestion.options) {
        if (selectedTestAnswer === null) {
            alert('Please select an answer');
            return;
        }
        userAnswer = selectedTestAnswer;
    } else {
        const input = document.getElementById('testAnswerInput');
        if (!input || !input.value.trim()) {
            alert('Please enter an answer');
            return;
        }
        userAnswer = input.value.trim();
    }

    // Submit answer
    const result = window.TestSimulation.submitAnswer(userAnswer);

    // Show feedback
    showTestFeedback(result);

    // Disable submit button, show Next button
    document.getElementById('testSubmitBtn').disabled = true;
    document.getElementById('testSubmitBtn').style.display = 'none';
    document.getElementById('testNextBtn').style.display = 'inline-block';
}

/**
 * Move to next question (called by Next button)
 */
function nextTestQuestion() {
    // Clear scratchpad for new question
    if (window.scratchPad && window.scratchPad.ctx && window.scratchPad.canvas) {
        window.scratchPad.ctx.clearRect(0, 0, window.scratchPad.canvas.width, window.scratchPad.canvas.height);
        window.scratchPad.drawingHistory = [];
    }

    // Hide scratchpad container, show button
    const scratchContainer = document.getElementById('testScratchPadContainer');
    const scratchBtn = document.getElementById('testScratchPadOpenBtn');
    if (scratchContainer) scratchContainer.style.display = 'none';
    if (scratchBtn) scratchBtn.style.display = 'block';

    const hasMore = window.TestSimulation.nextQuestion();
    if (hasMore) {
        showTestQuestion();
    } else {
        finishTest();
    }
}

/**
 * Show feedback for test answer
 */
function showTestFeedback(result) {
    const feedbackArea = document.getElementById('testFeedbackArea');

    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback ${result.isCorrect ? 'correct' : 'incorrect'}`;

    if (result.isCorrect) {
        feedbackDiv.innerHTML = `✓ Correct! Great job! 🎉`;
    } else {
        feedbackDiv.innerHTML = `
            ✗ Incorrect<br>
            <div style="margin-top: 10px; font-size: 0.9em;">
                The correct answer is: <strong>${result.correctAnswer}</strong>
            </div>
        `;
    }

    feedbackArea.innerHTML = '';
    feedbackArea.appendChild(feedbackDiv);

    // Show explanation if available
    if (result.explanation) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation-box';
        explanationDiv.innerHTML = `<strong>Explanation:</strong><br>${result.explanation}`;
        feedbackArea.appendChild(explanationDiv);
    }

    // If incorrect, offer tutorial help
    if (!result.isCorrect) {
        const helpDiv = document.createElement('div');
        helpDiv.style.cssText = 'margin-top: 15px; padding: 15px; background: #ebf8ff; border-radius: 10px; border-left: 4px solid #4299e1;';
        helpDiv.innerHTML = `
            <div style="color: #2b6cb0; font-weight: bold; margin-bottom: 8px;">
                📚 Need help understanding this?
            </div>
            <button onclick="showTestTutorial()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1em;">
                📖 Show Me a Step-by-Step Tutorial
            </button>
        `;
        feedbackArea.appendChild(helpDiv);
    }
}

/**
 * Show hint for current test question
 */
function showTestHint() {
    if (!currentTestQuestion || !currentTestQuestion.hint) {
        alert('No hint available for this question');
        return;
    }

    const feedbackArea = document.getElementById('testFeedbackArea');
    const hintDiv = document.createElement('div');
    hintDiv.className = 'hint-box';
    hintDiv.innerHTML = `<strong>💡 Hint:</strong><br>${currentTestQuestion.hint}`;

    feedbackArea.innerHTML = '';
    feedbackArea.appendChild(hintDiv);
}

/**
 * Tutorials for each lesson type - step-by-step examples
 */
const lessonTutorials = {
    // Chapter 6: Expressions
    '6.1': {
        title: 'Powers and Exponents',
        steps: [
            { text: 'An exponent tells you how many times to multiply a number by itself.', example: '2³ means 2 × 2 × 2' },
            { text: 'The small number (exponent) goes on top. The big number (base) is what you multiply.', example: 'In 5², the base is 5 and the exponent is 2' },
            { text: 'Multiply step by step:', example: '2³ = 2 × 2 × 2 = 4 × 2 = 8' },
            { text: 'Another example:', example: '3⁴ = 3 × 3 × 3 × 3 = 9 × 9 = 81' }
        ],
        practice: '4² = 4 × 4 = 16'
    },
    '6.2': {
        title: 'Order of Operations (PEMDAS)',
        steps: [
            { text: 'Remember PEMDAS - the order you solve math problems:', example: 'P - Parentheses first\nE - Exponents second\nMD - Multiply & Divide (left to right)\nAS - Add & Subtract (left to right)' },
            { text: 'Step 1: Do parentheses first', example: '(3 + 2) × 4 → 5 × 4' },
            { text: 'Step 2: Do exponents', example: '5 + 2³ → 5 + 8' },
            { text: 'Step 3: Multiply and divide from left to right', example: '3 + 4 × 2 → 3 + 8 (NOT 7 × 2!)' },
            { text: 'Step 4: Add and subtract from left to right', example: '3 + 8 = 11' }
        ],
        practice: '2 + 3 × 4 = 2 + 12 = 14 (multiply first!)'
    },
    '6.3': {
        title: 'Writing Algebraic Expressions',
        steps: [
            { text: 'Use a variable (like x) to represent "a number"', example: '"a number" → x' },
            { text: 'Key words for ADDITION: plus, more than, sum, increased by', example: '"5 more than a number" → x + 5' },
            { text: 'Key words for SUBTRACTION: minus, less than, difference, decreased by', example: '"a number decreased by 3" → x - 3' },
            { text: 'Key words for MULTIPLICATION: times, product, twice, triple', example: '"twice a number" → 2x' },
            { text: 'Key words for DIVISION: divided by, quotient, half', example: '"a number divided by 4" → x/4' }
        ],
        practice: '"three times a number plus 7" → 3x + 7'
    },
    '6.4': {
        title: 'Evaluating Algebraic Expressions',
        steps: [
            { text: 'To evaluate means to find the value when you know what x equals', example: 'Evaluate 2x + 3 when x = 5' },
            { text: 'Step 1: Write the expression', example: '2x + 3' },
            { text: 'Step 2: Replace x with the number (use parentheses!)', example: '2(5) + 3' },
            { text: 'Step 3: Multiply first', example: '10 + 3' },
            { text: 'Step 4: Then add/subtract', example: '= 13' }
        ],
        practice: 'Evaluate 3x - 2 when x = 4:\n3(4) - 2 = 12 - 2 = 10'
    },
    '6.5': {
        title: 'Properties of Operations',
        steps: [
            { text: 'Commutative Property: You can swap the order', example: 'Addition: 3 + 5 = 5 + 3\nMultiplication: 4 × 6 = 6 × 4' },
            { text: 'Associative Property: You can regroup', example: 'Addition: (2 + 3) + 4 = 2 + (3 + 4)\nMultiplication: (2 × 3) × 4 = 2 × (3 × 4)' },
            { text: 'Identity Property: Special numbers that don\'t change the answer', example: 'Addition: 7 + 0 = 7 (0 is the identity)\nMultiplication: 7 × 1 = 7 (1 is the identity)' },
            { text: 'Zero Property: Anything times 0 equals 0', example: '5 × 0 = 0' }
        ],
        practice: 'Commutative: 8 + 2 = 2 + 8 = 10'
    },
    '6.6': {
        title: 'The Distributive Property',
        steps: [
            { text: 'Distributive Property: Multiply the outside number by EACH term inside', example: '3(x + 2) means 3 times x AND 3 times 2' },
            { text: 'Step 1: Write out what you\'re multiplying', example: '3(x + 4) → 3·x + 3·4' },
            { text: 'Step 2: Do each multiplication', example: '3·x = 3x and 3·4 = 12' },
            { text: 'Step 3: Write the final answer', example: '3x + 12' },
            { text: 'Works with subtraction too!', example: '2(x - 5) = 2x - 10' }
        ],
        practice: '4(x + 3) = 4·x + 4·3 = 4x + 12'
    },
    '6.7': {
        title: 'Simplifying Algebraic Expressions',
        steps: [
            { text: 'Combine "like terms" - terms with the same variable', example: '3x and 5x are like terms\n3x and 5y are NOT like terms' },
            { text: 'Step 1: Find the like terms', example: 'In 2x + 5 + 3x, the like terms are 2x and 3x' },
            { text: 'Step 2: Add or subtract the coefficients (the numbers in front)', example: '2x + 3x = 5x' },
            { text: 'Step 3: Bring down the other terms', example: '2x + 5 + 3x = 5x + 5' },
            { text: 'Numbers without variables are like terms too!', example: '3x + 2 + 4x + 5 = 7x + 7' }
        ],
        practice: '4x + 3 + 2x + 1 = (4x + 2x) + (3 + 1) = 6x + 4'
    },
    // Add generic tutorials for other topics
    'default': {
        title: 'Problem Solving Steps',
        steps: [
            { text: 'Step 1: Read the problem carefully', example: 'Understand what is being asked' },
            { text: 'Step 2: Identify what you know', example: 'Write down the given information' },
            { text: 'Step 3: Choose your strategy', example: 'What operation or formula do you need?' },
            { text: 'Step 4: Solve step by step', example: 'Show your work!' },
            { text: 'Step 5: Check your answer', example: 'Does it make sense?' }
        ],
        practice: 'Take your time and work through each step!'
    }
};

/**
 * Show tutorial for current question type
 */
function showTestTutorial() {
    if (!currentTestQuestion) {
        alert('No question loaded');
        return;
    }

    // Get the lesson ID from the question
    const lessonId = currentTestQuestion.lesson || 'default';
    const tutorial = lessonTutorials[lessonId] || lessonTutorials['default'];

    const feedbackArea = document.getElementById('testFeedbackArea');

    let tutorialHTML = `
        <div class="tutorial-box" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; margin-top: 15px;">
            <h3 style="margin: 0 0 15px 0; font-size: 1.3em;">📖 Tutorial: ${tutorial.title}</h3>
            <div style="background: rgba(255,255,255,0.95); color: #2d3748; padding: 15px; border-radius: 10px;">
    `;

    tutorial.steps.forEach((step, index) => {
        tutorialHTML += `
            <div style="margin-bottom: 15px; ${index < tutorial.steps.length - 1 ? 'border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;' : ''}">
                <div style="font-weight: bold; color: #5a67d8; margin-bottom: 5px;">
                    Step ${index + 1}: ${step.text}
                </div>
                <div style="background: #f7fafc; padding: 10px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; color: #2d3748;">
${step.example}
                </div>
            </div>
        `;
    });

    tutorialHTML += `
                <div style="margin-top: 15px; padding: 12px; background: #c6f6d5; border-radius: 8px; border-left: 4px solid #48bb78;">
                    <strong style="color: #276749;">✏️ Practice Example:</strong>
                    <div style="margin-top: 5px; font-family: monospace; white-space: pre-wrap; color: #2d3748;">${tutorial.practice}</div>
                </div>
            </div>
        </div>
    `;

    feedbackArea.innerHTML = tutorialHTML;
}

/**
 * End test early
 */
function endTestEarly() {
    const confirm = window.confirm(
        'Are you sure you want to end the test early?\n\n' +
        'Your answers so far will be scored.'
    );

    if (confirm) {
        finishTest();
    }
}

/**
 * Finish the test and show results
 */
function finishTest() {
    // Stop timer
    if (testModeTimerInterval) {
        clearInterval(testModeTimerInterval);
        testModeTimerInterval = null;
    }

    // Get results
    const results = window.TestSimulation.endTest();

    // Hide test container
    document.getElementById('testContainer').style.display = 'none';

    // Show results
    showTestResults(results);
}

/**
 * Display test results
 */
function showTestResults(results) {
    const resultsDiv = document.getElementById('testResults');
    const contentDiv = document.getElementById('testResultsContent');

    // Score display
    const grade = window.TestSimulation.getLetterGrade(results.score);
    const passed = results.passed ? '✓ PASSED' : '✗ NEEDS REVIEW';
    const passColor = results.passed ? '#48bb78' : '#f56565';

    let html = `
        <div class="score-display">
            <h3>${results.score}%</h3>
            <div class="grade-badge">${grade}</div>
            <div style="margin-top: 15px; font-size: 1.2em; color: ${passColor};">
                ${passed}
            </div>
            <div style="margin-top: 10px; font-size: 0.9em; opacity: 0.9;">
                ${results.correctCount} of ${results.totalQuestions} correct
            </div>
            <div style="margin-top: 5px; font-size: 0.85em; opacity: 0.8;">
                Time: ${window.TestSimulation.formatTime(results.totalTime)}
                (Avg: ${results.avgTimePerQuestion}s per question)
            </div>
        </div>

        <h3 style="color: #5a67d8; margin-bottom: 15px;">Topic Breakdown</h3>
        <div class="topic-breakdown">
    `;

    // Topic breakdown
    Object.keys(results.topicBreakdown).forEach(topicKey => {
        const topic = results.topicBreakdown[topicKey];
        const topicScore = topic.total > 0 ? Math.round((topic.correct / topic.total) * 100) : 0;
        const topicColor = topicScore >= 70 ? '#48bb78' : '#f56565';

        html += `
            <div class="topic-result">
                <h4>${topic.name}</h4>
                <div style="font-size: 1.5em; color: ${topicColor}; font-weight: bold;">
                    ${topicScore}%
                </div>
                <div style="font-size: 0.9em; color: #718096; margin-top: 5px;">
                    ${topic.correct}/${topic.total} correct
                </div>
            </div>
        `;
    });

    html += `</div><h3 style="color: #5a67d8; margin: 30px 0 15px 0;">Detailed Results</h3>`;

    // Detailed question results
    results.answers.forEach((answer, index) => {
        const cardClass = answer.isCorrect ? 'correct' : 'incorrect';
        const icon = answer.isCorrect ? '✓' : '✗';
        const color = answer.isCorrect ? '#48bb78' : '#f56565';

        html += `
            <div class="result-card ${cardClass}">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: ${color}; margin-bottom: 5px;">
                            ${icon} Question ${index + 1}
                        </div>
                        <div style="color: #2d3748; margin-bottom: 10px;">
                            ${answer.question}
                        </div>
                        <div style="font-size: 0.9em; color: #718096;">
                            Your answer: <strong>${answer.userAnswer}</strong>
                        </div>
                        ${!answer.isCorrect ? `
                            <div style="font-size: 0.9em; color: #718096;">
                                Correct answer: <strong style="color: #48bb78;">${answer.correctAnswer}</strong>
                            </div>
                        ` : ''}
                    </div>
                    <div style="text-align: right; margin-left: 15px;">
                        <div style="font-size: 0.85em; color: #718096;">
                            ${Math.round(answer.timeSpent / 1000)}s
                        </div>
                        <div style="font-size: 0.75em; color: #a0aec0; margin-top: 3px;">
                            ${answer.topicName}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    contentDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
}

/**
 * Go back to test selection
 */
function backToTestSelection() {
    document.getElementById('testResults').style.display = 'none';
    document.getElementById('testSelection').style.display = 'block';
    loadChapterSelection();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Test UI Controller loaded');
});

// Expose functions to window for onclick handlers
window.toggleMode = toggleMode;
window.startChapterTest = startChapterTest;
window.submitTestAnswer = submitTestAnswer;
window.showTestHint = showTestHint;
window.showTestTutorial = showTestTutorial;
window.nextTestQuestion = nextTestQuestion;
window.endTestEarly = endTestEarly;
window.backToTestSelection = backToTestSelection;
window.showTestScratchPad = showTestScratchPad;
window.hideTestScratchPad = hideTestScratchPad;

/**
 * Show scratchpad in test mode
 */
function showTestScratchPad() {
    const container = document.getElementById('testScratchPadContainer');
    const button = document.getElementById('testScratchPadOpenBtn');
    if (container && button) {
        container.style.display = 'block';
        button.style.display = 'none';
        // Setup canvas after showing
        setTimeout(() => {
            if (window.scratchPad) {
                window.scratchPad.canvas = document.getElementById('testScratchCanvas');
                if (window.scratchPad.canvas) {
                    window.scratchPad.ctx = window.scratchPad.canvas.getContext('2d');
                    const rect = window.scratchPad.canvas.getBoundingClientRect();
                    window.scratchPad.canvas.width = rect.width;
                    window.scratchPad.canvas.height = 300;
                    window.scratchPad.ctx.lineCap = 'round';
                    window.scratchPad.ctx.lineJoin = 'round';
                    window.scratchPad.ctx.lineWidth = window.scratchPad.brushSize;
                    window.scratchPad.ctx.strokeStyle = window.scratchPad.currentColor;

                    // Add event listeners
                    window.scratchPad.canvas.onmousedown = (e) => window.scratchPad.startDrawing(e);
                    window.scratchPad.canvas.onmousemove = (e) => window.scratchPad.draw(e);
                    window.scratchPad.canvas.onmouseup = () => window.scratchPad.stopDrawing();
                    window.scratchPad.canvas.onmouseout = () => window.scratchPad.stopDrawing();

                    // Touch events for iPad
                    window.scratchPad.canvas.ontouchstart = (e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        window.scratchPad.startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
                    };
                    window.scratchPad.canvas.ontouchmove = (e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        window.scratchPad.draw({ clientX: touch.clientX, clientY: touch.clientY });
                    };
                    window.scratchPad.canvas.ontouchend = (e) => {
                        e.preventDefault();
                        window.scratchPad.stopDrawing();
                    };
                }
            }
        }, 100);
    }
}

/**
 * Hide scratchpad in test mode
 */
function hideTestScratchPad() {
    const container = document.getElementById('testScratchPadContainer');
    const button = document.getElementById('testScratchPadOpenBtn');
    if (container && button) {
        container.style.display = 'none';
        button.style.display = 'block';
    }
}
