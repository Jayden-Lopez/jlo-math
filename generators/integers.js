// integers.js - Glencoe Math Course 1, Chapter 5: Integers and the Coordinate Plane
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapter 5 sequence

window.IntegersGenerator = {
    // Lesson structure for sequential learning
    lessons: [
        { id: '5.1', name: 'Integers and Opposites', types: ['opposites', 'numberLine'] },
        { id: '5.2', name: 'Absolute Value', types: ['absoluteValue'] },
        { id: '5.3', name: 'Compare and Order Integers', types: ['compareIntegers', 'orderIntegers'] },
        { id: '5.4', name: 'Add Integers', types: ['addIntegers'] },
        { id: '5.5', name: 'Subtract Integers', types: ['subtractIntegers'] },
        { id: '5.6', name: 'The Coordinate Plane', types: ['coordinatePlane', 'plotPoints', 'readCoordinates'] },
        { id: '5.7', name: 'Graph on the Coordinate Plane', types: ['graphFromTable', 'identifyPattern'] },
        { id: '5.8', name: 'Distance on the Coordinate Plane', types: ['distance'] }
    ],

    // Get current lesson based on user progress
    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;

        const chapterProgress = userData.lessonProgress?.['chapter5'] || { currentLesson: 0, lessonMastery: {} };
        return Math.min(chapterProgress.currentLesson || 0, this.lessons.length - 1);
    },

    // Generate problem based on lesson progression
    generate: function(specificLesson = null) {
        const currentLessonIndex = specificLesson !== null ? specificLesson : this.getCurrentLesson();
        const userData = window.userData;

        // Weight toward current lesson (60%) with review of previous lessons (40%)
        let lessonIndex;
        if (Math.random() < 0.6 || currentLessonIndex === 0) {
            // Current lesson
            lessonIndex = currentLessonIndex;
        } else {
            // Review a random previous lesson
            lessonIndex = Math.floor(Math.random() * currentLessonIndex);
        }

        const lesson = this.lessons[lessonIndex];
        const type = lesson.types[Math.floor(Math.random() * lesson.types.length)];

        let problem;
        switch(type) {
            case 'opposites':
                problem = this.generateOpposites();
                break;
            case 'numberLine':
                problem = this.generateNumberLine();
                break;
            case 'absoluteValue':
                problem = this.generateAbsoluteValue();
                break;
            case 'compareIntegers':
                problem = this.generateCompareIntegers();
                break;
            case 'orderIntegers':
                problem = this.generateOrderIntegers();
                break;
            case 'addIntegers':
                problem = this.generateAddIntegers();
                break;
            case 'subtractIntegers':
                problem = this.generateSubtractIntegers();
                break;
            case 'coordinatePlane':
                problem = this.generateCoordinatePlane();
                break;
            case 'plotPoints':
                problem = this.generatePlotPoints();
                break;
            case 'readCoordinates':
                problem = this.generateReadCoordinates();
                break;
            case 'graphFromTable':
                problem = this.generateGraphFromTable();
                break;
            case 'identifyPattern':
                problem = this.generateIdentifyPattern();
                break;
            case 'distance':
                problem = this.generateDistance();
                break;
            default:
                problem = this.generateAbsoluteValue();
        }

        // Add lesson info to problem for tracking
        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
    },
    
    // Lesson 5.1: Integers and Opposites
    generateOpposites: function() {
        const num = Math.floor(Math.random() * 21) - 10;
        const opposite = -num;
        
        return {
            question: `What is the opposite of ${num}?`,
            answer: opposite.toString(),
            hint: "The opposite has the same distance from zero but different sign",
            explanation: `The opposite of ${num} is ${opposite}`
        };
    },
    
    // Lesson 5.2: Absolute Value
    generateAbsoluteValue: function() {
        const num = Math.floor(Math.random() * 21) - 10;
        const absValue = Math.abs(num);
        
        return {
            question: `What is |${num}|?`,
            answer: absValue.toString(),
            hint: "Absolute value is the distance from zero (always positive)",
            explanation: `|${num}| = ${absValue} (${absValue} units from 0)`
        };
    },
    
    // Lesson 5.3: Compare Integers
    generateCompareIntegers: function() {
        const num1 = Math.floor(Math.random() * 21) - 10;
        const num2 = Math.floor(Math.random() * 21) - 10;
        
        if (num1 === num2) {
            return this.generateCompareIntegers(); // Regenerate if equal
        }
        
        const symbol = num1 > num2 ? ">" : "<";
        
        return {
            question: `Compare: ${num1} ___ ${num2}`,
            answer: symbol,
            options: [">", "<", "="],
            correct: [">", "<", "="].indexOf(symbol),
            hint: "On a number line, numbers to the right are greater",
            explanation: `${num1} ${symbol} ${num2} because ${num1} is ${symbol === ">" ? "greater than" : "less than"} ${num2}`
        };
    },
    
    // Lesson 5.4: Order Integers
    generateOrderIntegers: function() {
        const nums = [
            Math.floor(Math.random() * 21) - 10,
            Math.floor(Math.random() * 21) - 10,
            Math.floor(Math.random() * 21) - 10,
            Math.floor(Math.random() * 21) - 10
        ];
        
        // Shuffle for the question
        const shuffled = [...nums].sort(() => Math.random() - 0.5);
        // Sort for the answer
        const sorted = [...nums].sort((a, b) => a - b);
        
        return {
            question: `Order from least to greatest: ${shuffled.join(", ")}`,
            answer: sorted.join(", "),
            hint: "Remember: negative numbers are less than positive numbers",
            explanation: `On a number line from left to right: ${sorted.join(", ")}`
        };
    },
    
    // Lesson 5.5: Add Integers
    generateAddIntegers: function() {
        const num1 = Math.floor(Math.random() * 21) - 10;
        const num2 = Math.floor(Math.random() * 21) - 10;
        const sum = num1 + num2;
        
        return {
            question: `Add: ${num1} + ${num2}`,
            answer: sum.toString(),
            hint: num1 * num2 > 0 ? "Same signs: add and keep the sign" : "Different signs: subtract and use sign of larger absolute value",
            explanation: `${num1} + ${num2} = ${sum}`
        };
    },
    
    // Lesson 5.6: Subtract Integers
    generateSubtractIntegers: function() {
        const num1 = Math.floor(Math.random() * 21) - 10;
        const num2 = Math.floor(Math.random() * 21) - 10;
        const diff = num1 - num2;
        
        return {
            question: `Subtract: ${num1} - ${num2}`,
            answer: diff.toString(),
            hint: "Subtracting is the same as adding the opposite",
            explanation: `${num1} - ${num2} = ${num1} + (${-num2}) = ${diff}`
        };
    },
    
    // Lesson 5.7: The Coordinate Plane
    generateCoordinatePlane: function() {
        const x = Math.floor(Math.random() * 11) - 5;
        const y = Math.floor(Math.random() * 11) - 5;
        
        let quadrant;
        if (x > 0 && y > 0) quadrant = "I";
        else if (x < 0 && y > 0) quadrant = "II";
        else if (x < 0 && y < 0) quadrant = "III";
        else if (x > 0 && y < 0) quadrant = "IV";
        else if (x === 0 && y !== 0) quadrant = "y-axis";
        else if (x !== 0 && y === 0) quadrant = "x-axis";
        else quadrant = "origin";
        
        return {
            question: `In which quadrant or axis is the point (${x}, ${y})?`,
            answer: quadrant.includes("Quadrant") ? quadrant : (quadrant === "origin" ? "Origin" : `On the ${quadrant}`),
            hint: "Check the signs: (+,+)=I, (-,+)=II, (-,-)=III, (+,-)=IV",
            explanation: `(${x}, ${y}): x is ${x >= 0 ? "positive" : "negative"}, y is ${y >= 0 ? "positive" : "negative"}, so ${quadrant.includes("Quadrant") ? quadrant : quadrant}`
        };
    },
    
    // Lesson 5.8: Distance on the Coordinate Plane
    generateDistance: function() {
        const types = ['horizontal', 'vertical'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'horizontal') {
            const y = Math.floor(Math.random() * 11) - 5;
            const x1 = Math.floor(Math.random() * 11) - 5;
            const x2 = Math.floor(Math.random() * 11) - 5;
            const distance = Math.abs(x2 - x1);

            // Regenerate if points are the same (distance would be 0)
            if (distance === 0) {
                return this.generateDistance();
            }

            return {
                question: `Find the distance between points (${x1}, ${y}) and (${x2}, ${y})`,
                answer: `${distance} units`,
                hint: "Same y-coordinate means horizontal line, find |x₂ - x₁|",
                explanation: `Distance = |${x2} - ${x1}| = ${distance} units`
            };
        } else {
            const x = Math.floor(Math.random() * 11) - 5;
            const y1 = Math.floor(Math.random() * 11) - 5;
            const y2 = Math.floor(Math.random() * 11) - 5;
            const distance = Math.abs(y2 - y1);

            // Regenerate if points are the same (distance would be 0)
            if (distance === 0) {
                return this.generateDistance();
            }

            return {
                question: `Find the distance between points (${x}, ${y1}) and (${x}, ${y2})`,
                answer: `${distance} units`,
                hint: "Same x-coordinate means vertical line, find |y₂ - y₁|",
                explanation: `Distance = |${y2} - ${y1}| = ${distance} units`
            };
        }
    },

    // NEW: Lesson 5.1 - Number Line Graphing
    generateNumberLine: function() {
        const target = Math.floor(Math.random() * 21) - 10;

        // Create a number line representation
        const lineStart = Math.floor(target / 5) * 5 - 5;
        const lineEnd = lineStart + 15;

        // Generate wrong answers near the target
        const wrongAnswers = [];
        const possibleWrong = [target - 2, target - 1, target + 1, target + 2, -target];
        for (const w of possibleWrong) {
            if (w !== target && !wrongAnswers.includes(w) && wrongAnswers.length < 3) {
                wrongAnswers.push(w);
            }
        }

        // Ensure we have 3 wrong answers
        while (wrongAnswers.length < 3) {
            const rand = Math.floor(Math.random() * 21) - 10;
            if (rand !== target && !wrongAnswers.includes(rand)) {
                wrongAnswers.push(rand);
            }
        }

        const options = [target, ...wrongAnswers].sort(() => Math.random() - 0.5);

        // Build ASCII number line
        let numberLine = '';
        for (let i = lineStart; i <= lineEnd; i += 5) {
            numberLine += `${i}`.padStart(4);
        }
        numberLine += '\n';
        for (let i = lineStart; i <= lineEnd; i++) {
            if (i % 5 === 0) {
                numberLine += '|';
            } else {
                numberLine += '-';
            }
        }
        numberLine += '\n';
        // Mark position with arrow
        const arrowPos = target - lineStart;
        numberLine += ' '.repeat(Math.max(0, arrowPos)) + '↑';

        return {
            question: `What integer is shown on this number line?\n\n${numberLine}`,
            answer: target.toString(),
            options: options.map(o => o.toString()),
            correct: options.indexOf(target),
            hint: "Count the marks from a labeled number like 0 or -5",
            explanation: `The arrow points to ${target} on the number line`
        };
    },

    // NEW: Lesson 5.6 - Plot Points (identify correct location)
    generatePlotPoints: function() {
        // Generate coordinates that are NOT on the axes (must be in a quadrant)
        let x = 0, y = 0;
        while (x === 0 || y === 0) {
            x = Math.floor(Math.random() * 8) - 4; // -4 to 3, then adjust
            y = Math.floor(Math.random() * 8) - 4;
            if (x >= 0) x++; // Avoid 0: makes range -4 to -1 and 1 to 4
            if (y >= 0) y++;
        }

        // Determine quadrant
        let location;
        let correctIndex;
        if (x > 0 && y > 0) { location = "Quadrant I (upper right)"; correctIndex = 0; }
        else if (x < 0 && y > 0) { location = "Quadrant II (upper left)"; correctIndex = 1; }
        else if (x < 0 && y < 0) { location = "Quadrant III (lower left)"; correctIndex = 2; }
        else { location = "Quadrant IV (lower right)"; correctIndex = 3; }

        // Generate directions based on coordinates
        let directions = `Start at the origin. `;
        directions += `Move ${Math.abs(x)} unit${Math.abs(x) > 1 ? 's' : ''} ${x > 0 ? 'right' : 'left'}. `;
        directions += `Then move ${Math.abs(y)} unit${Math.abs(y) > 1 ? 's' : ''} ${y > 0 ? 'up' : 'down'}.`;

        return {
            question: `To plot the point (${x}, ${y}), where would you end up?\n\n${directions}`,
            answer: location,
            options: [
                "Quadrant I (upper right)",
                "Quadrant II (upper left)",
                "Quadrant III (lower left)",
                "Quadrant IV (lower right)"
            ],
            correct: correctIndex,
            hint: "x tells you left/right, y tells you up/down. (+,+)=I, (-,+)=II, (-,-)=III, (+,-)=IV",
            explanation: `(${x}, ${y}): Move ${x > 0 ? 'right' : 'left'} ${Math.abs(x)}, then ${y > 0 ? 'up' : 'down'} ${Math.abs(y)} → ${location}`
        };
    },

    // NEW: Lesson 5.6 - Read Coordinates from description
    generateReadCoordinates: function() {
        const x = Math.floor(Math.random() * 9) - 4;
        const y = Math.floor(Math.random() * 9) - 4;

        // Avoid origin for more interesting questions
        if (x === 0 && y === 0) {
            return this.generateReadCoordinates();
        }

        // Create description of location
        let description = `A point is located `;
        if (x !== 0) {
            description += `${Math.abs(x)} unit${Math.abs(x) > 1 ? 's' : ''} ${x > 0 ? 'right of' : 'left of'} the origin`;
        }
        if (x !== 0 && y !== 0) {
            description += ` and `;
        }
        if (y !== 0) {
            description += `${Math.abs(y)} unit${Math.abs(y) > 1 ? 's' : ''} ${y > 0 ? 'above' : 'below'} ${x === 0 ? 'the origin' : 'that'}`;
        }
        description += '.';

        // Generate wrong answers
        const correctAnswer = `(${x}, ${y})`;
        const wrongAnswers = [
            `(${y}, ${x})`,      // Swapped
            `(${-x}, ${y})`,     // Wrong x sign
            `(${x}, ${-y})`      // Wrong y sign
        ];

        const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

        return {
            question: `${description}\n\nWhat are the coordinates of this point?`,
            answer: correctAnswer,
            options: options,
            correct: options.indexOf(correctAnswer),
            hint: "x-coordinate = left/right from origin, y-coordinate = up/down from origin",
            explanation: `${Math.abs(x)} ${x > 0 ? 'right' : 'left'} = x of ${x}, ${Math.abs(y)} ${y > 0 ? 'up' : 'down'} = y of ${y}, so the point is (${x}, ${y})`
        };
    },

    // NEW: Lesson 5.7 - Graph from Table
    generateGraphFromTable: function() {
        // Generate a simple linear pattern
        const startX = Math.floor(Math.random() * 3) - 1;
        const slope = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        const intercept = Math.floor(Math.random() * 5) - 2;

        // Create table of values
        const points = [];
        for (let i = 0; i < 4; i++) {
            const x = startX + i;
            const y = slope * x + intercept;
            points.push({ x, y });
        }

        // Format table
        let table = 'x  |  y\n';
        table += '---|---\n';
        points.forEach(p => {
            table += `${p.x.toString().padStart(2)} | ${p.y.toString().padStart(2)}\n`;
        });

        // Ask about a specific point
        const askIndex = Math.floor(Math.random() * points.length);
        const askPoint = points[askIndex];

        return {
            question: `Look at this table of values:\n\n${table}\nWhat ordered pair represents the point when x = ${askPoint.x}?`,
            answer: `(${askPoint.x}, ${askPoint.y})`,
            hint: "Find the x value in the table, then read across to find y",
            explanation: `When x = ${askPoint.x}, the table shows y = ${askPoint.y}, so the point is (${askPoint.x}, ${askPoint.y})`
        };
    },

    // NEW: Lesson 5.7 - Identify Pattern in coordinates
    generateIdentifyPattern: function() {
        // Generate ordered pairs that follow a pattern
        const patterns = [
            { rule: 'y = x', pairs: [[1,1], [2,2], [3,3]], next: [4,4], desc: 'y equals x' },
            { rule: 'y = x + 1', pairs: [[0,1], [1,2], [2,3]], next: [3,4], desc: 'y is one more than x' },
            { rule: 'y = x + 2', pairs: [[0,2], [1,3], [2,4]], next: [3,5], desc: 'y is two more than x' },
            { rule: 'y = 2x', pairs: [[1,2], [2,4], [3,6]], next: [4,8], desc: 'y is double x' },
            { rule: 'y = x - 1', pairs: [[1,0], [2,1], [3,2]], next: [4,3], desc: 'y is one less than x' },
            { rule: 'y = -x', pairs: [[1,-1], [2,-2], [3,-3]], next: [4,-4], desc: 'y is the opposite of x' }
        ];

        const pattern = patterns[Math.floor(Math.random() * patterns.length)];

        // Format the given pairs
        const givenPairs = pattern.pairs.map(p => `(${p[0]}, ${p[1]})`).join(', ');
        const nextX = pattern.next[0];
        const correctY = pattern.next[1];

        // Generate wrong answers
        const wrongYs = [correctY + 1, correctY - 1, correctY + 2].filter(y => y !== correctY);
        const options = [correctY, ...wrongYs.slice(0, 3)].sort(() => Math.random() - 0.5);

        return {
            question: `The pattern shows these ordered pairs: ${givenPairs}\n\nIf x = ${nextX}, what is y?`,
            answer: correctY.toString(),
            options: options.map(o => o.toString()),
            correct: options.indexOf(correctY),
            hint: `Look at how y changes compared to x. The rule is: ${pattern.desc}`,
            explanation: `The pattern follows ${pattern.rule}. When x = ${nextX}, y = ${correctY}`
        };
    },

    // Utility: Check if a lesson should advance
    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter5']) {
            userData.lessonProgress['chapter5'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter5'];
        if (!progress.lessonMastery[lessonId]) {
            progress.lessonMastery[lessonId] = { correct: 0, attempts: 0, streak: 0 };
        }

        const mastery = progress.lessonMastery[lessonId];
        mastery.attempts++;
        if (isCorrect) {
            mastery.correct++;
            mastery.streak++;
        } else {
            mastery.streak = 0;
        }

        // Check if lesson is mastered (5 correct in a row OR 80% with 10+ attempts)
        const accuracy = mastery.attempts > 0 ? mastery.correct / mastery.attempts : 0;
        const isMastered = mastery.streak >= 5 || (accuracy >= 0.8 && mastery.attempts >= 10);

        // Advance to next lesson if current is mastered
        const currentLessonIndex = this.lessons.findIndex(l => l.id === lessonId);
        if (isMastered && currentLessonIndex === progress.currentLesson && currentLessonIndex < this.lessons.length - 1) {
            progress.currentLesson = currentLessonIndex + 1;
            return {
                advanced: true,
                newLesson: this.lessons[currentLessonIndex + 1]
            };
        }

        return { advanced: false };
    }
};
