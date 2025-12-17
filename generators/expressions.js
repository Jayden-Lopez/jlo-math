// expressions.js - Glencoe Math Course 1, Chapter 6: Expressions
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapter 6 sequence

window.ExpressionsGenerator = {
    // Lesson structure for sequential learning
    lessons: [
        { id: '6.1', name: 'Powers and Exponents', types: ['exponents'] },
        { id: '6.2', name: 'Order of Operations', types: ['orderOfOps'] },
        { id: '6.3', name: 'Write Algebraic Expressions', types: ['writeExpression'] },
        { id: '6.4', name: 'Evaluate Algebraic Expressions', types: ['evaluate', 'substitute'] },
        { id: '6.5', name: 'Properties', types: ['properties'] },
        { id: '6.6', name: 'The Distributive Property', types: ['expand'] },
        { id: '6.7', name: 'Simplify Algebraic Expressions', types: ['simplify'] }
    ],

    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;
        const chapterProgress = userData.lessonProgress?.['chapter6'] || { currentLesson: 0 };
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
            case 'exponents':
                problem = this.generateExponents();
                break;
            case 'orderOfOps':
                problem = this.generateOrderOfOps();
                break;
            case 'writeExpression':
                problem = this.generateWriteExpression();
                break;
            case 'evaluate':
                problem = this.generateEvaluate();
                break;
            case 'substitute':
                problem = this.generateSubstitute();
                break;
            case 'properties':
                problem = this.generateProperties();
                break;
            case 'expand':
                problem = this.generateExpand();
                break;
            case 'simplify':
                problem = this.generateSimplify();
                break;
            default:
                problem = this.generateEvaluate();
        }

        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
    },

    // Lesson 6.1: Powers and Exponents
    generateExponents: function() {
        const bases = [2, 3, 4, 5, 10];
        const exponents = [2, 3, 4];

        const base = bases[Math.floor(Math.random() * bases.length)];
        const exp = exponents[Math.floor(Math.random() * exponents.length)];
        const result = Math.pow(base, exp);

        return {
            question: `Evaluate: ${base}^${exp} (${base} to the power of ${exp})`,
            answer: result.toString(),
            hint: `${base}^${exp} means ${base} multiplied by itself ${exp} times`,
            explanation: `${base}^${exp} = ${Array(exp).fill(base).join(' × ')} = ${result}`
        };
    },

    // Lesson 6.2: Order of Operations
    generateOrderOfOps: function() {
        const problems = [
            { expr: '3 + 4 × 2', answer: 11, steps: '3 + 8 = 11' },
            { expr: '20 - 12 ÷ 4', answer: 17, steps: '20 - 3 = 17' },
            { expr: '(5 + 3) × 2', answer: 16, steps: '8 × 2 = 16' },
            { expr: '18 ÷ (3 + 3)', answer: 3, steps: '18 ÷ 6 = 3' },
            { expr: '2 × 3²', answer: 18, steps: '2 × 9 = 18' },
            { expr: '4 + 3 × 5 - 2', answer: 17, steps: '4 + 15 - 2 = 17' },
            { expr: '(8 - 2) × 3', answer: 18, steps: '6 × 3 = 18' },
            { expr: '5² - 10', answer: 15, steps: '25 - 10 = 15' }
        ];

        const problem = problems[Math.floor(Math.random() * problems.length)];

        return {
            question: `Evaluate using order of operations: ${problem.expr}`,
            answer: problem.answer.toString(),
            hint: 'PEMDAS: Parentheses, Exponents, Multiply/Divide (left to right), Add/Subtract (left to right)',
            explanation: `${problem.expr} = ${problem.steps}`
        };
    },

    // Lesson 6.3: Write Algebraic Expressions
    generateWriteExpression: function() {
        const situations = [
            { words: "five more than a number", expression: "x + 5", hint: "More than means addition" },
            { words: "a number decreased by 7", expression: "x - 7", hint: "Decreased means subtraction" },
            { words: "three times a number", expression: "3x", hint: "Times means multiplication" },
            { words: "a number divided by 4", expression: "x/4", hint: "Divided by means division" },
            { words: "twice a number plus 6", expression: "2x + 6", hint: "Twice means multiply by 2" },
            { words: "the sum of a number and 8", expression: "x + 8", hint: "Sum means addition" },
            { words: "the product of 5 and a number", expression: "5x", hint: "Product means multiplication" },
            { words: "10 less than a number", expression: "x - 10", hint: "Less than means subtraction" },
            { words: "a number squared", expression: "x²", hint: "Squared means to the power of 2" }
        ];

        const situation = situations[Math.floor(Math.random() * situations.length)];

        return {
            question: `Write an algebraic expression for: "${situation.words}"`,
            answer: situation.expression,
            hint: situation.hint,
            explanation: `"${situation.words}" translates to ${situation.expression}`
        };
    },

    // Lesson 6.5: Properties
    generateProperties: function() {
        const properties = [
            {
                name: 'Commutative (Addition)',
                example: '3 + 7 = 7 + 3',
                question: 'Which property says a + b = b + a?',
                answer: 'Commutative Property of Addition'
            },
            {
                name: 'Commutative (Multiplication)',
                example: '4 × 5 = 5 × 4',
                question: 'Which property says a × b = b × a?',
                answer: 'Commutative Property of Multiplication'
            },
            {
                name: 'Associative (Addition)',
                example: '(2 + 3) + 4 = 2 + (3 + 4)',
                question: 'Which property says (a + b) + c = a + (b + c)?',
                answer: 'Associative Property of Addition'
            },
            {
                name: 'Identity (Addition)',
                example: '5 + 0 = 5',
                question: 'Which property says a + 0 = a?',
                answer: 'Identity Property of Addition'
            },
            {
                name: 'Identity (Multiplication)',
                example: '6 × 1 = 6',
                question: 'Which property says a × 1 = a?',
                answer: 'Identity Property of Multiplication'
            }
        ];

        const prop = properties[Math.floor(Math.random() * properties.length)];

        return {
            question: prop.question,
            answer: prop.answer,
            hint: `Example: ${prop.example}`,
            explanation: `${prop.answer}: ${prop.example}`
        };
    },
    
    generateEvaluate: function() {
        const problems = [
            {
                generate: function() {
                    const x = Math.floor(Math.random() * 10) + 1;
                    const a = Math.floor(Math.random() * 5) + 2;
                    const b = Math.floor(Math.random() * 10) + 1;
                    const result = a * x + b;
                    
                    return {
                        question: `Evaluate ${a}x + ${b} when x = ${x}`,
                        answer: result,
                        hint: `Substitute ${x} for x`,
                        explanation: `${a}(${x}) + ${b} = ${a * x} + ${b} = ${result}`
                    };
                }
            },
            {
                generate: function() {
                    const x = Math.floor(Math.random() * 5) + 1;
                    const result = x * x;
                    
                    return {
                        question: `Evaluate x² when x = ${x}`,
                        answer: result,
                        hint: "x² means x times x",
                        explanation: `${x}² = ${x} × ${x} = ${result}`
                    };
                }
            },
            {
                generate: function() {
                    const x = Math.floor(Math.random() * 6) + 2;
                    const y = Math.floor(Math.random() * 6) + 2;
                    const result = 2 * x + 3 * y;
                    
                    return {
                        question: `Evaluate 2x + 3y when x = ${x} and y = ${y}`,
                        answer: result,
                        hint: "Substitute both values",
                        explanation: `2(${x}) + 3(${y}) = ${2 * x} + ${3 * y} = ${result}`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateSimplify: function() {
        const problems = [
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 5) + 2;
                    const b = Math.floor(Math.random() * 5) + 1;
                    const c = Math.floor(Math.random() * 5) + 1;
                    const coefficient = a + b + c;
                    
                    return {
                        question: `Simplify: ${a}x + ${b}x + ${c}x`,
                        answer: `${coefficient}x`,
                        hint: "Add all the coefficients of x",
                        explanation: `(${a} + ${b} + ${c})x = ${coefficient}x`
                    };
                }
            },
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 8) + 3;
                    const b = Math.floor(Math.random() * 5) + 1;
                    const coefficient = a - b;
                    
                    if (coefficient <= 0) return this.generate(); // Ensure positive result
                    
                    return {
                        question: `Simplify: ${a}y - ${b}y`,
                        answer: coefficient === 1 ? 'y' : `${coefficient}y`,
                        hint: "Subtract the coefficients",
                        explanation: `(${a} - ${b})y = ${coefficient}y`
                    };
                }
            },
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 5) + 2;
                    const b = Math.floor(Math.random() * 5) + 2;
                    const c = Math.floor(Math.random() * 10) + 5;
                    const d = Math.floor(Math.random() * 10) + 5;
                    
                    return {
                        question: `Simplify: ${a}x + ${c} + ${b}x + ${d}`,
                        answer: `${a + b}x + ${c + d}`,
                        hint: "Group like terms together",
                        explanation: `(${a}x + ${b}x) + (${c} + ${d}) = ${a + b}x + ${c + d}`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateFactor: function() {
        const problems = [
            {
                generate: function() {
                    const factor = Math.floor(Math.random() * 5) + 2;
                    const a = factor * (Math.floor(Math.random() * 4) + 1);
                    const b = factor * (Math.floor(Math.random() * 5) + 1);
                    
                    return {
                        question: `Factor: ${a}x + ${b}`,
                        answer: `${factor}(${a/factor}x + ${b/factor})`,
                        hint: `Find the GCF of ${a} and ${b}`,
                        explanation: `GCF is ${factor}. ${a}x + ${b} = ${factor}(${a/factor}x + ${b/factor})`
                    };
                }
            },
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 5) + 2;
                    const b = Math.floor(Math.random() * 5) + 2;
                    
                    return {
                        question: `Factor: ${a}x² + ${a * b}x`,
                        answer: `${a}x(x + ${b})`,
                        hint: `Factor out the common term ${a}x`,
                        explanation: `${a}x² + ${a * b}x = ${a}x(x + ${b})`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateExpand: function() {
        const problems = [
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 5) + 2;
                    const b = Math.floor(Math.random() * 5) + 1;
                    const c = Math.floor(Math.random() * 5) + 1;
                    
                    return {
                        question: `Expand: ${a}(${b}x + ${c})`,
                        answer: `${a * b}x + ${a * c}`,
                        hint: `Multiply ${a} by each term inside`,
                        explanation: `${a} × ${b}x = ${a * b}x, ${a} × ${c} = ${a * c}. Result: ${a * b}x + ${a * c}`
                    };
                }
            },
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 4) + 2;
                    const b = Math.floor(Math.random() * 5) + 2;
                    const c = Math.floor(Math.random() * 5) + 1;
                    
                    return {
                        question: `Expand: ${a}(x + ${b}) + ${c}`,
                        answer: `${a}x + ${a * b + c}`,
                        hint: `First expand ${a}(x + ${b}), then add ${c}`,
                        explanation: `${a}(x + ${b}) = ${a}x + ${a * b}. Then add ${c}: ${a}x + ${a * b + c}`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateSubstitute: function() {
        const problems = [
            {
                generate: function() {
                    const x = Math.floor(Math.random() * 8) + 2;
                    const formula = `3x + 7`;
                    const result = 3 * x + 7;
                    
                    return {
                        question: `If the formula for cost is C = ${formula}, what is the cost when x = ${x}?`,
                        answer: result,
                        hint: `Replace x with ${x} in the formula`,
                        explanation: `C = 3(${x}) + 7 = ${3 * x} + 7 = ${result}`
                    };
                }
            },
            {
                generate: function() {
                    const n = Math.floor(Math.random() * 10) + 5;
                    const formula = `2n - 3`;
                    const result = 2 * n - 3;
                    
                    return {
                        question: `The ${n}th term of a sequence is given by ${formula}. What is the ${n}th term?`,
                        answer: result,
                        hint: `Substitute n = ${n} into the formula`,
                        explanation: `Term = 2(${n}) - 3 = ${2 * n} - 3 = ${result}`
                    };
                }
            },
            {
                generate: function() {
                    const h = Math.floor(Math.random() * 5) + 2;
                    const rate = Math.floor(Math.random() * 5) + 10;
                    const bonus = Math.floor(Math.random() * 5) * 5 + 20;
                    const formula = `${rate}h + ${bonus}`;
                    const result = rate * h + bonus;
                    
                    return {
                        question: `Pay is calculated as P = ${formula} where h is hours worked. What is the pay for ${h} hours?`,
                        answer: result,
                        hint: `Replace h with ${h} in the formula`,
                        explanation: `P = ${rate}(${h}) + ${bonus} = ${rate * h} + ${bonus} = $${result}`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },

    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter6']) {
            userData.lessonProgress['chapter6'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter6'];
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
