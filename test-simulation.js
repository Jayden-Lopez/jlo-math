/**
 * Math Test Simulation Module
 * Creates chapter-based practice tests for Jordan
 * Completely separate from regular practice module
 */

window.TestSimulation = (function() {
    // Test state
    let currentTest = null;
    let currentQuestionIndex = 0;
    let testStartTime = null;
    let questionStartTime = null;
    let testAnswers = [];

    /**
     * Generate a test for a specific chapter
     * @param {number} chapterNum - Chapter number (1-12)
     * @param {number} numQuestions - Number of questions (default 15)
     * @returns {Object} Test object with questions
     */
    function generateTest(chapterNum, numQuestions = 15) {
        const chapter = window.learningPath.find(ch => ch.stage === chapterNum);
        if (!chapter) {
            console.error('Chapter not found:', chapterNum);
            return null;
        }

        const test = {
            chapterNum: chapterNum,
            chapterName: chapter.name,
            description: chapter.description,
            questions: [],
            totalQuestions: numQuestions,
            startTime: null,
            endTime: null,
            answers: []
        };

        // Get all topics for this chapter
        const topics = chapter.topics;

        // Distribute questions across topics
        const questionsPerTopic = Math.floor(numQuestions / topics.length);
        const remainder = numQuestions % topics.length;

        topics.forEach((topic, index) => {
            // Add extra question to first topics if there's a remainder
            const questionsToGenerate = questionsPerTopic + (index < remainder ? 1 : 0);

            for (let i = 0; i < questionsToGenerate; i++) {
                const question = generateQuestionForTopic(topic.key);
                if (question) {
                    test.questions.push({
                        ...question,
                        topicKey: topic.key,
                        topicName: topic.name,
                        questionNumber: test.questions.length + 1
                    });
                }
            }
        });

        // Shuffle questions to mix topics
        test.questions = shuffleArray(test.questions);

        // Renumber after shuffle
        test.questions.forEach((q, i) => {
            q.questionNumber = i + 1;
        });

        return test;
    }

    /**
     * Generate a question for a specific topic
     * @param {string} topicKey - Topic key (e.g., 'ratios', 'operations')
     * @returns {Object} Question object
     */
    function generateQuestionForTopic(topicKey) {
        try {
            let generator = null;

            // Map topic keys to generators
            switch(topicKey) {
                case 'ratios':
                    generator = window.RatiosGenerator;
                    break;
                case 'decimals':
                    generator = window.DecimalsGenerator;
                    break;
                case 'operations':
                    generator = window.OperationsGenerator;
                    break;
                case 'fractions':
                    generator = window.FractionsGenerator;
                    break;
                case 'mixedNumbers':
                    generator = window.MixedNumbersGenerator;
                    break;
                case 'integers':
                    generator = window.IntegersGenerator;
                    break;
                case 'expressions':
                    generator = window.ExpressionsGenerator;
                    break;
                case 'algebra':
                    generator = window.AlgebraGenerator;
                    break;
                case 'geometry':
                    generator = window.GeometryGenerator;
                    break;
                case 'wordProblems':
                    generator = window.WordProblemsGenerator;
                    break;
                default:
                    console.warn('No generator found for topic:', topicKey);
                    return null;
            }

            if (generator && typeof generator.generate === 'function') {
                return generator.generate();
            }
        } catch (error) {
            console.error('Error generating question for', topicKey, error);
        }
        return null;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Start a test
     * @param {number} chapterNum - Chapter number
     * @param {number} numQuestions - Number of questions
     */
    function startTest(chapterNum, numQuestions = 15) {
        currentTest = generateTest(chapterNum, numQuestions);
        if (!currentTest) {
            alert('Error: Could not generate test for this chapter.');
            return false;
        }

        currentQuestionIndex = 0;
        testStartTime = Date.now();
        questionStartTime = Date.now();
        testAnswers = [];

        return true;
    }

    /**
     * Get current question
     */
    function getCurrentQuestion() {
        if (!currentTest || currentQuestionIndex >= currentTest.questions.length) {
            return null;
        }
        return currentTest.questions[currentQuestionIndex];
    }

    /**
     * Submit answer for current question
     * @param {string} userAnswer - User's answer
     * @returns {Object} Result with correct/incorrect and explanation
     */
    function submitAnswer(userAnswer) {
        const question = getCurrentQuestion();
        if (!question) {
            return { error: 'No current question' };
        }

        const timeSpent = Date.now() - questionStartTime;
        const isCorrect = checkAnswer(userAnswer, question);

        const result = {
            questionNumber: currentQuestionIndex + 1,
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: question.answer,
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            explanation: question.explanation,
            topicKey: question.topicKey,
            topicName: question.topicName
        };

        testAnswers.push(result);
        return result;
    }

    /**
     * Check if answer is correct
     * @param {string} userAnswer - User's answer
     * @param {Object} question - Question object
     * @returns {boolean} True if correct
     */
    function checkAnswer(userAnswer, question) {
        // Handle multiple choice
        if (question.options && question.correct !== undefined) {
            return parseInt(userAnswer) === question.correct;
        }

        // Normalize answers
        const userAns = String(userAnswer).trim().toLowerCase();
        const correctAns = String(question.answer).trim().toLowerCase();

        // Direct string comparison for simple cases
        if (userAns === correctAns) {
            return true;
        }

        // Try numeric comparison with tolerance
        const userNum = parseFloat(userAns);
        const correctNum = parseFloat(correctAns);

        if (!isNaN(userNum) && !isNaN(correctNum)) {
            return Math.abs(userNum - correctNum) <= 0.01;
        }

        // Fraction comparison
        if (userAns.includes('/') && correctAns.includes('/')) {
            return compareFractions(userAns, correctAns);
        }

        return false;
    }

    /**
     * Compare two fractions for equality
     */
    function compareFractions(frac1, frac2) {
        const parse = (frac) => {
            const parts = frac.split('/');
            if (parts.length !== 2) return null;
            const num = parseInt(parts[0].trim());
            const den = parseInt(parts[1].trim());
            if (isNaN(num) || isNaN(den) || den === 0) return null;
            return { num, den };
        };

        const f1 = parse(frac1);
        const f2 = parse(frac2);

        if (!f1 || !f2) return false;

        // Cross multiply to compare
        return f1.num * f2.den === f2.num * f1.den;
    }

    /**
     * Move to next question
     * @returns {boolean} True if there are more questions
     */
    function nextQuestion() {
        currentQuestionIndex++;
        questionStartTime = Date.now();
        return currentQuestionIndex < currentTest.questions.length;
    }

    /**
     * End the test and get results
     * @returns {Object} Test results
     */
    function endTest() {
        if (!currentTest) {
            return null;
        }

        const endTime = Date.now();
        const totalTime = endTime - testStartTime;

        const correctCount = testAnswers.filter(a => a.isCorrect).length;
        const totalQuestions = testAnswers.length;
        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

        // Calculate average time per question
        const avgTime = totalQuestions > 0 ? Math.round(totalTime / totalQuestions / 1000) : 0;

        // Group by topic for detailed analysis
        const topicBreakdown = {};
        testAnswers.forEach(answer => {
            if (!topicBreakdown[answer.topicKey]) {
                topicBreakdown[answer.topicKey] = {
                    name: answer.topicName,
                    correct: 0,
                    total: 0
                };
            }
            topicBreakdown[answer.topicKey].total++;
            if (answer.isCorrect) {
                topicBreakdown[answer.topicKey].correct++;
            }
        });

        const results = {
            chapterNum: currentTest.chapterNum,
            chapterName: currentTest.chapterName,
            totalQuestions: totalQuestions,
            correctCount: correctCount,
            incorrectCount: totalQuestions - correctCount,
            score: score,
            totalTime: totalTime,
            avgTimePerQuestion: avgTime,
            answers: testAnswers,
            topicBreakdown: topicBreakdown,
            date: new Date().toISOString(),
            passed: score >= 70 // 70% to pass
        };

        // Save test results to history
        saveTestResults(results);

        return results;
    }

    /**
     * Save test results to userData
     */
    function saveTestResults(results) {
        if (!window.userData) {
            console.error('userData not available');
            return;
        }

        // Initialize test history if it doesn't exist
        if (!window.userData.testHistory) {
            window.userData.testHistory = [];
        }

        // Add to history
        window.userData.testHistory.push({
            chapterNum: results.chapterNum,
            chapterName: results.chapterName,
            score: results.score,
            correctCount: results.correctCount,
            totalQuestions: results.totalQuestions,
            date: results.date,
            passed: results.passed,
            totalTime: results.totalTime
        });

        // Keep only last 50 tests
        if (window.userData.testHistory.length > 50) {
            window.userData.testHistory = window.userData.testHistory.slice(-50);
        }

        // Save to Firebase/localStorage
        if (window.saveUserData) {
            window.saveUserData();
        }
    }

    /**
     * Get test history for a chapter
     */
    function getTestHistory(chapterNum) {
        if (!window.userData || !window.userData.testHistory) {
            return [];
        }

        if (chapterNum) {
            return window.userData.testHistory.filter(t => t.chapterNum === chapterNum);
        }

        return window.userData.testHistory;
    }

    /**
     * Get current test progress
     */
    function getProgress() {
        if (!currentTest) {
            return null;
        }

        return {
            currentQuestion: currentQuestionIndex + 1,
            totalQuestions: currentTest.questions.length,
            answeredCount: testAnswers.length,
            timeElapsed: Date.now() - testStartTime
        };
    }

    /**
     * Format time in mm:ss
     */
    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Get letter grade from percentage
     */
    function getLetterGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }

    // Public API
    return {
        startTest: startTest,
        getCurrentQuestion: getCurrentQuestion,
        submitAnswer: submitAnswer,
        nextQuestion: nextQuestion,
        endTest: endTest,
        getProgress: getProgress,
        getTestHistory: getTestHistory,
        formatTime: formatTime,
        getLetterGrade: getLetterGrade,
        get currentTest() { return currentTest; }
    };
})();
