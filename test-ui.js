/**
 * Test UI Controller
 * Handles all UI interactions for the test simulation module
 */

// Test UI state
let testMode = false;
let currentQuestion = null;
let testTimerInterval = null;
let selectedAnswer = null;

/**
 * Toggle between practice mode and test mode
 */
function toggleMode() {
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
        if (testTimerInterval) {
            clearInterval(testTimerInterval);
            testTimerInterval = null;
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

    // Ask user for number of questions
    const numQuestions = prompt(
        `How many questions would you like?\n\nRecommended: 15-20 questions\nTopics in this chapter: ${chapter.topics.length}`,
        '15'
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
    if (testTimerInterval) {
        clearInterval(testTimerInterval);
    }

    testTimerInterval = setInterval(() => {
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
    currentQuestion = window.TestSimulation.getCurrentQuestion();
    if (!currentQuestion) {
        // Test is over
        finishTest();
        return;
    }

    selectedAnswer = null;

    const progress = window.TestSimulation.getProgress();
    document.getElementById('testProgress').textContent =
        `Question ${progress.currentQuestion} of ${progress.totalQuestions}`;

    document.getElementById('testQuestionText').innerHTML = currentQuestion.question;

    // Clear feedback
    document.getElementById('testFeedbackArea').innerHTML = '';

    // Create answer section
    const answerSection = document.getElementById('testAnswerSection');
    answerSection.innerHTML = '';

    if (currentQuestion.options) {
        // Multiple choice
        const mcDiv = document.createElement('div');
        mcDiv.className = 'mc-options';

        currentQuestion.options.forEach((option, index) => {
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

    // Enable submit button
    document.getElementById('testSubmitBtn').disabled = false;
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
    selectedAnswer = index;
}

/**
 * Submit answer for current test question
 */
function submitTestAnswer() {
    let userAnswer;

    if (currentQuestion.options) {
        if (selectedAnswer === null) {
            alert('Please select an answer');
            return;
        }
        userAnswer = selectedAnswer;
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

    // Disable submit button
    document.getElementById('testSubmitBtn').disabled = true;

    // Auto-advance after 2 seconds
    setTimeout(() => {
        const hasMore = window.TestSimulation.nextQuestion();
        if (hasMore) {
            showTestQuestion();
        } else {
            finishTest();
        }
    }, 2000);
}

/**
 * Show feedback for test answer
 */
function showTestFeedback(result) {
    const feedbackArea = document.getElementById('testFeedbackArea');

    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback ${result.isCorrect ? 'correct' : 'incorrect'}`;

    if (result.isCorrect) {
        feedbackDiv.innerHTML = `✓ Correct!`;
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
}

/**
 * Show hint for current test question
 */
function showTestHint() {
    if (!currentQuestion || !currentQuestion.hint) {
        alert('No hint available for this question');
        return;
    }

    const feedbackArea = document.getElementById('testFeedbackArea');
    const hintDiv = document.createElement('div');
    hintDiv.className = 'hint-box';
    hintDiv.innerHTML = `<strong>💡 Hint:</strong><br>${currentQuestion.hint}`;

    feedbackArea.innerHTML = '';
    feedbackArea.appendChild(hintDiv);
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
    if (testTimerInterval) {
        clearInterval(testTimerInterval);
        testTimerInterval = null;
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
