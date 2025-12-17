// algebra.js - Glencoe Math Course 1, Chapter 7: Equations
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapter 7 sequence

window.AlgebraGenerator = {
    // Lesson structure for sequential learning
    lessons: [
        { id: '7.1', name: 'Equations', types: ['writeEquation'] },
        { id: '7.2', name: 'Solve One-Step Addition Equations', types: ['solveAddition'] },
        { id: '7.3', name: 'Solve One-Step Subtraction Equations', types: ['solveSubtraction'] },
        { id: '7.4', name: 'Solve One-Step Multiplication Equations', types: ['solveMultiplication'] },
        { id: '7.5', name: 'Solve One-Step Division Equations', types: ['solveDivision'] },
        { id: '7.6', name: 'Solve Two-Step Equations', types: ['solveTwoStep'] },
        { id: '7.7', name: 'Write and Solve Equations', types: ['wordProblemEquation'] }
    ],

    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;
        const chapterProgress = userData.lessonProgress?.['chapter7'] || { currentLesson: 0 };
        return Math.min(chapterProgress.currentLesson || 0, this.lessons.length - 1);
    },

    generate: function(specificLesson = null) {
        const currentLessonIndex = specificLesson !== null ? specificLesson : this.getCurrentLesson();

        let lessonIndex;
        if (Math.random() < 0.6 || currentLessonIndex === 0) {
            lessonIndex = currentLessonIndex;
        } else {
            lessonIndex = Math.floor(Math.random() * currentLessonIndex);
        }

        const lesson = this.lessons[lessonIndex];
        const type = lesson.types[Math.floor(Math.random() * lesson.types.length)];

        let problem;
        switch(type) {
            case 'writeEquation':
                problem = this.generateWriteEquation();
                break;
            case 'solveAddition':
                problem = this.generateSolveAddition();
                break;
            case 'solveSubtraction':
                problem = this.generateSolveSubtraction();
                break;
            case 'solveMultiplication':
                problem = this.generateSolveMultiplication();
                break;
            case 'solveDivision':
                problem = this.generateSolveDivision();
                break;
            case 'solveTwoStep':
                problem = this.generateSolveTwoStep();
                break;
            case 'wordProblemEquation':
                problem = this.generateWordProblemEquation();
                break;
            default:
                problem = this.generateSolveAddition();
        }

        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
    },

    // Lesson 7.1: Write Equations
    generateWriteEquation: function() {
        const situations = [
            { words: "A number plus 5 equals 12", equation: "x + 5 = 12", hint: "Plus means addition" },
            { words: "A number minus 3 equals 7", equation: "x - 3 = 7", hint: "Minus means subtraction" },
            { words: "4 times a number equals 20", equation: "4x = 20", hint: "Times means multiplication" },
            { words: "A number divided by 2 equals 6", equation: "x/2 = 6", hint: "Divided by means division" },
            { words: "Twice a number plus 1 equals 9", equation: "2x + 1 = 9", hint: "Twice means multiply by 2" },
            { words: "The sum of a number and 8 is 15", equation: "x + 8 = 15", hint: "Sum means addition" }
        ];

        const situation = situations[Math.floor(Math.random() * situations.length)];

        return {
            question: `Write an equation for: "${situation.words}"`,
            answer: situation.equation,
            hint: situation.hint,
            explanation: `"${situation.words}" translates to ${situation.equation}`
        };
    },

    // Lesson 7.2: Solve One-Step Addition Equations
    generateSolveAddition: function() {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 25) + 10;

        return {
            question: `Solve: x + ${a} = ${b}`,
            answer: (b - a).toString(),
            hint: `Subtract ${a} from both sides`,
            explanation: `x + ${a} = ${b}\nx = ${b} - ${a}\nx = ${b - a}`
        };
    },

    // Lesson 7.3: Solve One-Step Subtraction Equations
    generateSolveSubtraction: function() {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 20) + 5;

        return {
            question: `Solve: x - ${a} = ${b}`,
            answer: (a + b).toString(),
            hint: `Add ${a} to both sides`,
            explanation: `x - ${a} = ${b}\nx = ${b} + ${a}\nx = ${a + b}`
        };
    },

    // Lesson 7.4: Solve One-Step Multiplication Equations
    generateSolveMultiplication: function() {
        const a = Math.floor(Math.random() * 9) + 2;
        const x = Math.floor(Math.random() * 12) + 2;
        const b = a * x;

        return {
            question: `Solve: ${a}x = ${b}`,
            answer: x.toString(),
            hint: `Divide both sides by ${a}`,
            explanation: `${a}x = ${b}\nx = ${b} ÷ ${a}\nx = ${x}`
        };
    },

    // Lesson 7.5: Solve One-Step Division Equations
    generateSolveDivision: function() {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 10) + 2;

        return {
            question: `Solve: x/${a} = ${b}`,
            answer: (a * b).toString(),
            hint: `Multiply both sides by ${a}`,
            explanation: `x/${a} = ${b}\nx = ${b} × ${a}\nx = ${a * b}`
        };
    },

    // Lesson 7.7: Word Problem Equations
    generateWordProblemEquation: function() {
        const problems = [
            () => {
                const spent = Math.floor(Math.random() * 20) + 10;
                const left = Math.floor(Math.random() * 30) + 5;
                const total = spent + left;
                return {
                    question: `Jordan had some money. He spent $${spent} and has $${left} left. How much did he start with?\n(Write and solve an equation)`,
                    answer: `$${total}`,
                    hint: `Let x = starting amount. Then x - ${spent} = ${left}`,
                    explanation: `x - ${spent} = ${left}\nx = ${left} + ${spent}\nx = $${total}`
                };
            },
            () => {
                const perItem = Math.floor(Math.random() * 5) + 2;
                const total = perItem * (Math.floor(Math.random() * 8) + 3);
                const count = total / perItem;
                return {
                    question: `Each pencil costs $${perItem}. Jordan spent $${total} on pencils. How many did he buy?`,
                    answer: `${count} pencils`,
                    hint: `Let x = number of pencils. Then ${perItem}x = ${total}`,
                    explanation: `${perItem}x = ${total}\nx = ${total} ÷ ${perItem}\nx = ${count} pencils`
                };
            },
            () => {
                const add = Math.floor(Math.random() * 15) + 5;
                const result = Math.floor(Math.random() * 30) + 20;
                const original = result - add;
                return {
                    question: `Jordan collected ${add} more cards and now has ${result} cards. How many did he have before?`,
                    answer: `${original} cards`,
                    hint: `Let x = original cards. Then x + ${add} = ${result}`,
                    explanation: `x + ${add} = ${result}\nx = ${result} - ${add}\nx = ${original} cards`
                };
            }
        ];

        return problems[Math.floor(Math.random() * problems.length)]();
    },
    
    // Write Algebraic Expressions
    generateWriteExpression: function() {
        const situations = [
            {
                words: "five more than a number",
                expression: "x + 5",
                hint: "More than means addition"
            },
            {
                words: "a number decreased by 7",
                expression: "x - 7",
                hint: "Decreased means subtraction"
            },
            {
                words: "three times a number",
                expression: "3x",
                hint: "Times means multiplication"
            },
            {
                words: "a number divided by 4",
                expression: "x/4",
                hint: "Divided by means division"
            },
            {
                words: "twice a number plus 6",
                expression: "2x + 6",
                hint: "Twice means multiply by 2"
            },
            {
                words: "the sum of a number and 8",
                expression: "x + 8",
                hint: "Sum means addition"
            },
            {
                words: "the product of 5 and a number",
                expression: "5x",
                hint: "Product means multiplication"
            },
            {
                words: "10 less than a number",
                expression: "x - 10",
                hint: "Less than means subtraction"
            }
        ];
        
        const situation = situations[Math.floor(Math.random() * situations.length)];
        
        return {
            question: `Write an algebraic expression for: "${situation.words}"`,
            answer: situation.expression,
            hint: situation.hint,
            explanation: `"${situation.words}" translates to ${situation.expression}`
        };
    },
    
    // Evaluate Expressions
    generateEvaluateExpression: function() {
        const x = Math.floor(Math.random() * 10) + 1;
        const expressions = [
            { expr: `3x + 2`, value: 3 * x + 2 },
            { expr: `2x - 5`, value: 2 * x - 5 },
            { expr: `4x + 7`, value: 4 * x + 7 },
            { expr: `5x - 3`, value: 5 * x - 3 },
            { expr: `x² + 1`, value: x * x + 1 },
            { expr: `2x² - x`, value: 2 * x * x - x },
            { expr: `10 - x`, value: 10 - x },
            { expr: `x/2 + 3`, value: x/2 + 3 }
        ];
        
        const expression = expressions[Math.floor(Math.random() * expressions.length)];
        
        return {
            question: `Evaluate ${expression.expr} when x = ${x}`,
            answer: expression.value.toString(),
            hint: `Substitute ${x} for x in the expression`,
            explanation: `Replace x with ${x}: ${expression.expr.replace(/x/g, x)} = ${expression.value}`
        };
    },
    
    // Simplify Expressions (Combining like terms)
    generateSimplifyExpression: function() {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        
        const expressions = [
            {
                expr: `${a}x + ${b}x`,
                simplified: `${a + b}x`,
                explanation: `Combine like terms: ${a}x + ${b}x = ${a + b}x`
            },
            {
                expr: `${a + b}x - ${a}x`,
                simplified: `${b}x`,
                explanation: `Combine like terms: ${a + b}x - ${a}x = ${b}x`
            },
            {
                expr: `${a}x + ${b} + ${c}x`,
                simplified: `${a + c}x + ${b}`,
                explanation: `Combine like terms: ${a}x + ${c}x = ${a + c}x, constant = ${b}`
            }
        ];
        
        const problem = expressions[Math.floor(Math.random() * expressions.length)];
        
        return {
            question: `Simplify: ${problem.expr}`,
            answer: problem.simplified,
            hint: "Combine like terms (terms with the same variable)",
            explanation: problem.explanation
        };
    },
    
    // Solve One-Step Equations
    generateSolveOneStep: function() {
        const types = ['add', 'subtract', 'multiply', 'divide'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'add':
                const a1 = Math.floor(Math.random() * 10) + 5;
                const b1 = Math.floor(Math.random() * 20) + 10;
                return {
                    question: `Solve: x + ${a1} = ${b1}`,
                    answer: (b1 - a1).toString(),
                    hint: `Subtract ${a1} from both sides`,
                    explanation: `x + ${a1} = ${b1}\nx = ${b1} - ${a1}\nx = ${b1 - a1}`
                };
                
            case 'subtract':
                const a2 = Math.floor(Math.random() * 10) + 5;
                const b2 = Math.floor(Math.random() * 15) + 5;
                return {
                    question: `Solve: x - ${a2} = ${b2}`,
                    answer: (a2 + b2).toString(),
                    hint: `Add ${a2} to both sides`,
                    explanation: `x - ${a2} = ${b2}\nx = ${b2} + ${a2}\nx = ${a2 + b2}`
                };
                
            case 'multiply':
                const a3 = Math.floor(Math.random() * 9) + 2;
                const b3 = a3 * (Math.floor(Math.random() * 10) + 2);
                return {
                    question: `Solve: ${a3}x = ${b3}`,
                    answer: (b3 / a3).toString(),
                    hint: `Divide both sides by ${a3}`,
                    explanation: `${a3}x = ${b3}\nx = ${b3} ÷ ${a3}\nx = ${b3 / a3}`
                };
                
            case 'divide':
                const a4 = Math.floor(Math.random() * 9) + 2;
                const b4 = Math.floor(Math.random() * 10) + 1;
                return {
                    question: `Solve: x/${a4} = ${b4}`,
                    answer: (a4 * b4).toString(),
                    hint: `Multiply both sides by ${a4}`,
                    explanation: `x/${a4} = ${b4}\nx = ${b4} × ${a4}\nx = ${a4 * b4}`
                };
        }
    },
    
    // Solve Two-Step Equations
    generateSolveTwoStep: function() {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 10) + 5;
        const c = Math.floor(Math.random() * 20) + 10;
        
        const types = ['add', 'subtract'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'add') {
            const x = (c - b) / a;
            if (Number.isInteger(x)) {
                return {
                    question: `Solve: ${a}x + ${b} = ${c}`,
                    answer: x.toString(),
                    hint: `First subtract ${b}, then divide by ${a}`,
                    explanation: `${a}x + ${b} = ${c}\n${a}x = ${c} - ${b}\n${a}x = ${c - b}\nx = ${(c - b) / a}`
                };
            }
        }
        
        // Default case
        const x = 4;
        return {
            question: `Solve: 3x + 5 = 17`,
            answer: "4",
            hint: "First subtract 5, then divide by 3",
            explanation: `3x + 5 = 17\n3x = 12\nx = 4`
        };
    },
    
    // Simple Inequalities
    generateInequality: function() {
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 20) + 10;
        const symbols = ['<', '>', '≤', '≥'];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        
        return {
            question: `Solve: x + ${a} ${symbol} ${b}`,
            answer: `x ${symbol} ${b - a}`,
            hint: `Subtract ${a} from both sides`,
            explanation: `x + ${a} ${symbol} ${b}\nx ${symbol} ${b} - ${a}\nx ${symbol} ${b - a}`
        };
    },
    
    // Pattern Recognition
    generatePatterns: function() {
        const patterns = [
            {
                sequence: [3, 6, 9, 12],
                next: 15,
                rule: "add 3"
            },
            {
                sequence: [2, 4, 8, 16],
                next: 32,
                rule: "multiply by 2"
            },
            {
                sequence: [20, 17, 14, 11],
                next: 8,
                rule: "subtract 3"
            },
            {
                sequence: [1, 4, 9, 16],
                next: 25,
                rule: "square numbers (1², 2², 3², 4², 5²)"
            },
            {
                sequence: [5, 10, 15, 20],
                next: 25,
                rule: "add 5"
            }
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        return {
            question: `Find the next number in the pattern: ${pattern.sequence.join(", ")}, ___`,
            answer: pattern.next.toString(),
            hint: `Look for a pattern: what operation connects the numbers?`,
            explanation: `Pattern: ${pattern.rule}\nNext number: ${pattern.next}`
        };
    },
    
    // Function Tables (Input/Output)
    generateFunctions: function() {
        const rules = [
            { rule: "x + 3", desc: "add 3" },
            { rule: "x - 2", desc: "subtract 2" },
            { rule: "2x", desc: "multiply by 2" },
            { rule: "3x + 1", desc: "multiply by 3, then add 1" },
            { rule: "x/2", desc: "divide by 2" }
        ];

        const selectedRule = rules[Math.floor(Math.random() * rules.length)];
        const input = Math.floor(Math.random() * 10) + 1;
        let output;

        // Calculate output based on rule
        switch(selectedRule.rule) {
            case "x + 3": output = input + 3; break;
            case "x - 2": output = input - 2; break;
            case "2x": output = 2 * input; break;
            case "3x + 1": output = 3 * input + 1; break;
            case "x/2": output = input / 2; break;
        }

        return {
            question: `If the function rule is "${selectedRule.desc}", what is the output when input = ${input}?`,
            answer: output.toString(),
            hint: `Apply the rule: ${selectedRule.desc}`,
            explanation: `Input: ${input}\nRule: ${selectedRule.desc}\nOutput: ${output}`
        };
    },

    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter7']) {
            userData.lessonProgress['chapter7'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter7'];
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

        const accuracy = mastery.attempts > 0 ? mastery.correct / mastery.attempts : 0;
        const isMastered = mastery.streak >= 5 || (accuracy >= 0.8 && mastery.attempts >= 10);

        const currentLessonIndex = this.lessons.findIndex(l => l.id === lessonId);
        if (isMastered && currentLessonIndex === progress.currentLesson && currentLessonIndex < this.lessons.length - 1) {
            progress.currentLesson = currentLessonIndex + 1;
            return { advanced: true, newLesson: this.lessons[currentLessonIndex + 1] };
        }
        return { advanced: false };
    }
};

// Note: ExpressionsGenerator is defined separately in expressions.js for Chapter 6
