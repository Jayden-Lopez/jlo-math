// inequalities.js - Glencoe Math Course 1, Chapter 8: Functions and Inequalities
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapter 8 sequence (focus on 8.5-8.6)

window.InequalitiesGenerator = {
    lessons: [
        { id: '8.1', name: 'Function Tables', types: ['functionTable'] },
        { id: '8.2', name: 'Function Rules', types: ['functionRule'] },
        { id: '8.3', name: 'Functions and Equations', types: ['functionEquation'] },
        { id: '8.4', name: 'Multiple Representations', types: ['functionRepresentation'] },
        { id: '8.5', name: 'Inequalities', types: ['readInequality', 'solveAddSub', 'solveMulDiv', 'checkSolution'] },
        { id: '8.6', name: 'Write and Graph Inequalities', types: ['writeInequality', 'graphInequality', 'numberLineToInequality'] }
    ],

    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;
        const chapterProgress = userData.lessonProgress?.['chapter8'] || { currentLesson: 0 };
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
            case 'functionTable': problem = this.generateFunctionTable(); break;
            case 'functionRule': problem = this.generateFunctionRule(); break;
            case 'functionEquation': problem = this.generateFunctionEquation(); break;
            case 'functionRepresentation': problem = this.generateFunctionRepresentation(); break;
            case 'readInequality': problem = this.generateReadInequality(); break;
            case 'solveAddSub': problem = this.generateSolveAddSub(); break;
            case 'solveMulDiv': problem = this.generateSolveMulDiv(); break;
            case 'checkSolution': problem = this.generateCheckSolution(); break;
            case 'writeInequality': problem = this.generateWriteInequality(); break;
            case 'graphInequality': problem = this.generateGraphInequality(); break;
            case 'numberLineToInequality': problem = this.generateNumberLineToInequality(); break;
            default: problem = this.generateSolveAddSub();
        }

        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
    },

    // ===== FUNCTIONS (8.1 - 8.4) =====

    // 8.1: Function Tables - find output given input and rule
    generateFunctionTable: function() {
        const rules = [
            { display: 'y = x + 3', fn: x => x + 3, desc: 'add 3' },
            { display: 'y = x - 2', fn: x => x - 2, desc: 'subtract 2' },
            { display: 'y = 2x', fn: x => 2 * x, desc: 'multiply by 2' },
            { display: 'y = 3x', fn: x => 3 * x, desc: 'multiply by 3' },
            { display: 'y = x + 7', fn: x => x + 7, desc: 'add 7' },
            { display: 'y = 4x', fn: x => 4 * x, desc: 'multiply by 4' },
            { display: 'y = x/2', fn: x => x / 2, desc: 'divide by 2' },
            { display: 'y = 2x + 1', fn: x => 2 * x + 1, desc: 'multiply by 2, then add 1' },
            { display: 'y = 3x - 1', fn: x => 3 * x - 1, desc: 'multiply by 3, then subtract 1' }
        ];

        const rule = rules[Math.floor(Math.random() * rules.length)];
        // For division rules, use even inputs
        const isDivision = rule.display.includes('/2');
        const input = isDivision
            ? (Math.floor(Math.random() * 6) + 1) * 2
            : Math.floor(Math.random() * 10) + 1;
        const output = rule.fn(input);

        return {
            question: `Function rule: ${rule.display}\nIf x = ${input}, what is y?`,
            answer: output.toString(),
            hint: `Use the rule: ${rule.desc}. Plug in ${input} for x.`,
            explanation: `${rule.display}\nPlug in x = ${input}: y = ${output}`
        };
    },

    // 8.2: Function Rules - figure out the rule from input/output pairs
    generateFunctionRule: function() {
        const rules = [
            { display: 'y = x + 4', fn: x => x + 4, answer: 'x + 4', desc: 'add 4' },
            { display: 'y = x - 3', fn: x => x - 3, answer: 'x - 3', desc: 'subtract 3' },
            { display: 'y = 2x', fn: x => 2 * x, answer: '2x', desc: 'multiply by 2' },
            { display: 'y = 3x', fn: x => 3 * x, answer: '3x', desc: 'multiply by 3' },
            { display: 'y = x + 6', fn: x => x + 6, answer: 'x + 6', desc: 'add 6' },
            { display: 'y = 5x', fn: x => 5 * x, answer: '5x', desc: 'multiply by 5' }
        ];

        const rule = rules[Math.floor(Math.random() * rules.length)];
        const inputs = [1, 2, 3, 4];
        const pairs = inputs.map(x => `(${x}, ${rule.fn(x)})`);

        return {
            question: `Find the rule! Input → Output:\n${pairs.join(', ')}\ny = ___`,
            answer: rule.answer,
            hint: `Look at how the output changes. Try: does it ${rule.desc}?`,
            explanation: `The pattern is ${rule.desc}.\nRule: y = ${rule.answer}\nCheck: ${inputs[0]} → ${rule.fn(inputs[0])}, ${inputs[1]} → ${rule.fn(inputs[1])} ✓`
        };
    },

    // 8.3: Functions and Equations - complete a function table
    generateFunctionEquation: function() {
        const multiplier = Math.floor(Math.random() * 4) + 2;
        const adder = Math.floor(Math.random() * 6) + 1;
        const types = [
            { display: `y = ${multiplier}x + ${adder}`, fn: x => multiplier * x + adder },
            { display: `y = ${multiplier}x`, fn: x => multiplier * x },
            { display: `y = x + ${adder}`, fn: x => x + adder }
        ];
        const rule = types[Math.floor(Math.random() * types.length)];

        const x = Math.floor(Math.random() * 8) + 2;
        const y = rule.fn(x);

        if (Math.random() < 0.5) {
            // Given x, find y
            return {
                question: `Rule: ${rule.display}\nWhen x = ${x}, what is y?`,
                answer: y.toString(),
                hint: `Substitute ${x} for x in the equation.`,
                explanation: `${rule.display}\nx = ${x} → y = ${y}`
            };
        } else {
            // Given y, find x (use simpler rules)
            const simpleX = Math.floor(Math.random() * 8) + 1;
            const simpleY = multiplier * simpleX;
            return {
                question: `Rule: y = ${multiplier}x\nWhen y = ${simpleY}, what is x?`,
                answer: simpleX.toString(),
                hint: `Divide ${simpleY} by ${multiplier} to find x.`,
                explanation: `y = ${multiplier}x → ${simpleY} = ${multiplier}x → x = ${simpleY} ÷ ${multiplier} = ${simpleX}`
            };
        }
    },

    // 8.4: Multiple Representations
    generateFunctionRepresentation: function() {
        const add = Math.floor(Math.random() * 5) + 2;
        const inputs = [0, 1, 2, 3, 4];
        const outputs = inputs.map(x => x + add);
        const missingIdx = Math.floor(Math.random() * 5);

        const tableRows = inputs.map((x, i) => {
            if (i === missingIdx) return `x = ${x} → y = ?`;
            return `x = ${x} → y = ${outputs[i]}`;
        }).join('\n');

        return {
            question: `Complete the table for y = x + ${add}:\n${tableRows}`,
            answer: outputs[missingIdx].toString(),
            hint: `Plug x = ${inputs[missingIdx]} into y = x + ${add}.`,
            explanation: `y = x + ${add}\nx = ${inputs[missingIdx]} → y = ${inputs[missingIdx]} + ${add} = ${outputs[missingIdx]}`
        };
    },

    // ===== INEQUALITIES (8.5 - 8.6) =====

    // 8.5: Read and understand inequality symbols
    generateReadInequality: function() {
        const problems = [
            () => {
                const n = Math.floor(Math.random() * 15) + 3;
                const symbols = [
                    { sym: '>', word: 'greater than', includes: false },
                    { sym: '<', word: 'less than', includes: false },
                    { sym: '≥', word: 'greater than or equal to', includes: true },
                    { sym: '≤', word: 'less than or equal to', includes: true }
                ];
                const s = symbols[Math.floor(Math.random() * symbols.length)];
                return {
                    question: `What does x ${s.sym} ${n} mean?`,
                    answer: `x is ${s.word} ${n}`,
                    hint: `The symbol ${s.sym} means "${s.word}". ${s.includes ? 'The line under the symbol means ' + n + ' IS included.' : n + ' is NOT included.'}`,
                    explanation: `x ${s.sym} ${n} means x is ${s.word} ${n}.\n${s.includes ? 'Since there\'s a line under the symbol, ' + n + ' counts as a solution!' : 'Since there\'s NO line, ' + n + ' does NOT count — only numbers strictly ' + (s.sym === '>' ? 'greater' : 'less') + ' than ' + n + '.'}`
                };
            },
            () => {
                const n = Math.floor(Math.random() * 20) + 1;
                const testVal = n + (Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? Math.floor(Math.random() * 5) + 1 : -(Math.floor(Math.random() * 5) + 1)));
                const sym = ['>', '<', '≥', '≤'][Math.floor(Math.random() * 4)];
                let isSolution;
                switch(sym) {
                    case '>': isSolution = testVal > n; break;
                    case '<': isSolution = testVal < n; break;
                    case '≥': isSolution = testVal >= n; break;
                    case '≤': isSolution = testVal <= n; break;
                }
                return {
                    question: `Is x = ${testVal} a solution of x ${sym} ${n}?\n(Answer: yes or no)`,
                    answer: isSolution ? 'yes' : 'no',
                    hint: `Check: is ${testVal} ${sym === '>' ? 'greater than' : sym === '<' ? 'less than' : sym === '≥' ? 'greater than or equal to' : 'less than or equal to'} ${n}?`,
                    explanation: `x ${sym} ${n} → is ${testVal} ${sym} ${n}?\n${testVal} ${isSolution ? 'IS' : 'is NOT'} ${sym === '>' ? 'greater than' : sym === '<' ? 'less than' : sym === '≥' ? 'greater than or equal to' : 'less than or equal to'} ${n}.\nAnswer: ${isSolution ? 'YES ✓' : 'NO ✗'}`
                };
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)]();
    },

    // 8.5: Solve one-step addition and subtraction inequalities
    generateSolveAddSub: function() {
        const problems = [
            // x + a < b  →  x < b - a
            () => {
                const a = Math.floor(Math.random() * 12) + 3;
                const b = a + Math.floor(Math.random() * 15) + 5;
                const sym = ['<', '>', '≤', '≥'][Math.floor(Math.random() * 4)];
                const result = b - a;
                return {
                    question: `Solve: x + ${a} ${sym} ${b}`,
                    answer: `x ${sym} ${result}`,
                    hint: `Subtract ${a} from both sides. The inequality sign stays the same!`,
                    explanation: `x + ${a} ${sym} ${b}\nSubtract ${a} from both sides:\nx ${sym} ${b} - ${a}\nx ${sym} ${result}`
                };
            },
            // x - a < b  →  x < b + a  (Jordan's test mistake: he subtracted instead of adding!)
            () => {
                const a = Math.floor(Math.random() * 12) + 3;
                const b = Math.floor(Math.random() * 20) + 5;
                const sym = ['<', '>', '≤', '≥'][Math.floor(Math.random() * 4)];
                const result = b + a;
                return {
                    question: `Solve: x - ${a} ${sym} ${b}`,
                    answer: `x ${sym} ${result}`,
                    hint: `ADD ${a} to both sides (undo the subtraction). Don't subtract — that's a common mistake!`,
                    explanation: `x - ${a} ${sym} ${b}\nAdd ${a} to both sides:\nx ${sym} ${b} + ${a}\nx ${sym} ${result}\n\n⚠️ Remember: to undo "minus ${a}", you ADD ${a}!`
                };
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)]();
    },

    // 8.5: Solve one-step multiplication and division inequalities
    generateSolveMulDiv: function() {
        const problems = [
            // ax > b  →  x > b/a  (positive coefficient, no flip)
            () => {
                const a = Math.floor(Math.random() * 7) + 2;
                const x = Math.floor(Math.random() * 12) + 2;
                const b = a * x;
                const sym = ['<', '>', '≤', '≥'][Math.floor(Math.random() * 4)];
                return {
                    question: `Solve: ${a}x ${sym} ${b}`,
                    answer: `x ${sym} ${x}`,
                    hint: `Divide both sides by ${a}. Since ${a} is POSITIVE, the sign stays the same!`,
                    explanation: `${a}x ${sym} ${b}\nDivide both sides by ${a}:\nx ${sym} ${b} ÷ ${a}\nx ${sym} ${x}`
                };
            },
            // x/a < b  →  x < a*b  (Jordan's test mistake: he flipped when multiplying by positive!)
            () => {
                const a = Math.floor(Math.random() * 6) + 2;
                const b = Math.floor(Math.random() * 15) + 2;
                const result = a * b;
                const sym = ['<', '>', '≤', '≥'][Math.floor(Math.random() * 4)];
                return {
                    question: `Solve: x/${a} ${sym} ${b}`,
                    answer: `x ${sym} ${result}`,
                    hint: `Multiply both sides by ${a}. Since ${a} is POSITIVE, do NOT flip the sign!`,
                    explanation: `x/${a} ${sym} ${b}\nMultiply both sides by ${a}:\nx ${sym} ${b} × ${a}\nx ${sym} ${result}\n\n⚠️ Only flip the sign when multiplying or dividing by a NEGATIVE number!`
                };
            },
            // -ax > b  →  x < -b/a  (negative coefficient, FLIP!)
            () => {
                const a = Math.floor(Math.random() * 5) + 2;
                const x = Math.floor(Math.random() * 8) + 1;
                const b = a * x;
                const syms = [['<', '>'], ['>', '<'], ['≤', '≥'], ['≥', '≤']];
                const [sym, flipped] = syms[Math.floor(Math.random() * syms.length)];
                return {
                    question: `Solve: -${a}x ${sym} ${b}`,
                    answer: `x ${flipped} -${x}`,
                    hint: `Divide both sides by -${a}. Since you're dividing by a NEGATIVE, FLIP the sign!`,
                    explanation: `-${a}x ${sym} ${b}\nDivide both sides by -${a} (FLIP the sign!):\nx ${flipped} ${b} ÷ (-${a})\nx ${flipped} -${x}\n\n🔄 The sign FLIPPED because we divided by a negative number!`
                };
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)]();
    },

    // 8.5: Check if a value is a solution (Jordan's test: 4x > 52, is 13 a solution?)
    generateCheckSolution: function() {
        const types = [
            () => {
                const a = Math.floor(Math.random() * 5) + 2;
                const threshold = a * (Math.floor(Math.random() * 10) + 5);
                const sym = ['<', '>', '≤', '≥'][Math.floor(Math.random() * 4)];
                // Pick a test value near the boundary
                const boundary = threshold / a;
                const offsets = [-1, 0, 1];
                const testVal = boundary + offsets[Math.floor(Math.random() * offsets.length)];
                const product = a * testVal;

                let isSolution;
                switch(sym) {
                    case '>': isSolution = product > threshold; break;
                    case '<': isSolution = product < threshold; break;
                    case '≥': isSolution = product >= threshold; break;
                    case '≤': isSolution = product <= threshold; break;
                }

                return {
                    question: `Is x = ${testVal} a solution of ${a}x ${sym} ${threshold}?\n(Answer: yes or no)`,
                    answer: isSolution ? 'yes' : 'no',
                    hint: `Plug in ${testVal} for x: is ${a} × ${testVal} = ${product} ${sym} ${threshold}?`,
                    explanation: `Plug in x = ${testVal}:\n${a} × ${testVal} = ${product}\nIs ${product} ${sym} ${threshold}?\n${isSolution ? `YES! ${product} ${sym} ${threshold} ✓` : `NO! ${product} is NOT ${sym === '>' ? 'greater than' : sym === '<' ? 'less than' : sym === '≥' ? 'greater than or equal to' : 'less than or equal to'} ${threshold} ✗`}${testVal === boundary ? '\n\n⚠️ Remember: ' + (sym === '>' || sym === '<' ? 'with > or <, equal does NOT count!' : 'with ≥ or ≤, equal DOES count!') : ''}`
                };
            },
            // Specific pattern from Jordan's test: picking from multiple choices
            () => {
                const a = Math.floor(Math.random() * 5) + 2;
                const boundary = Math.floor(Math.random() * 10) + 5;
                const product = a * boundary;
                const sym = '>';
                // Three choices: boundary-1, boundary, boundary+1
                const choices = [boundary - 1, boundary, boundary + 1];
                const solutions = choices.filter(v => a * v > product);
                const solutionStr = solutions.length > 0 ? solutions.join(', ') : 'none of them';

                return {
                    question: `Which of these is a solution of ${a}x > ${product}?\nChoices: ${choices.join(', ')}`,
                    answer: solutions.length > 0 ? solutions[0].toString() : 'none',
                    hint: `Test each value: multiply it by ${a} and check if the result is GREATER THAN ${product}. Remember, equal doesn't count with >!`,
                    explanation: `Test each:\n${choices.map(v => `${a} × ${v} = ${a * v} → ${a * v > product ? '> ' + product + ' ✓' : 'NOT > ' + product + ' ✗'}`).join('\n')}\n\nAnswer: ${solutionStr}\n${a * boundary === product ? `\n⚠️ ${boundary} gives exactly ${product}, but > means GREATER THAN, not equal!` : ''}`
                };
            }
        ];
        return types[Math.floor(Math.random() * types.length)]();
    },

    // 8.6: Write inequalities from word problems
    generateWriteInequality: function() {
        const problems = [
            () => {
                const n = Math.floor(Math.random() * 30) + 15;
                return {
                    question: `Write an inequality:\n"The temperature was no more than ${n} degrees."`,
                    answer: `t ≤ ${n}`,
                    hint: `"No more than" means less than OR equal to → ≤`,
                    explanation: `"No more than ${n}" means at most ${n}.\nThat includes ${n} itself, so use ≤.\nt ≤ ${n}`
                };
            },
            () => {
                const n = Math.floor(Math.random() * 50) + 20;
                return {
                    question: `Write an inequality:\n"You must be at least ${n} inches tall to ride."`,
                    answer: `h ≥ ${n}`,
                    hint: `"At least" means that number OR more → ≥`,
                    explanation: `"At least ${n}" means ${n} or more.\nThat includes ${n}, so use ≥.\nh ≥ ${n}`
                };
            },
            () => {
                const n = Math.floor(Math.random() * 20) + 10;
                return {
                    question: `Write an inequality:\n"There are fewer than ${n} students in the club."`,
                    answer: `s < ${n}`,
                    hint: `"Fewer than" means strictly less than → <  (${n} is NOT included)`,
                    explanation: `"Fewer than ${n}" means less than ${n}.\n${n} itself does NOT count, so use <.\ns < ${n}`
                };
            },
            () => {
                const n = Math.floor(Math.random() * 10) + 3;
                return {
                    question: `Write an inequality:\n"Jordan scored more than ${n} goals this season."`,
                    answer: `g > ${n}`,
                    hint: `"More than" means strictly greater than → >  (${n} is NOT included)`,
                    explanation: `"More than ${n}" means greater than ${n}.\n${n} itself does NOT count (he scored MORE), so use >.\ng > ${n}`
                };
            },
            () => {
                const n = (Math.floor(Math.random() * 6) + 3) * 5;
                return {
                    question: `Write an inequality:\n"Practice will be no longer than ${n} minutes."`,
                    answer: `p ≤ ${n}`,
                    hint: `"No longer than" means at most → ≤  (${n} IS included)`,
                    explanation: `"No longer than ${n}" means at most ${n} minutes.\n${n} itself is OK, so use ≤.\np ≤ ${n}`
                };
            },
            () => {
                const n = Math.floor(Math.random() * 40) + 10;
                return {
                    question: `Write an inequality:\n"The bag can hold no more than ${n} pounds."`,
                    answer: `w ≤ ${n}`,
                    hint: `"No more than" means at most → ≤`,
                    explanation: `"No more than ${n}" means at most ${n} pounds.\nThat includes exactly ${n}, so use ≤.\nw ≤ ${n}`
                };
            },
            () => {
                const n = Math.floor(Math.random() * 5) + 8;
                return {
                    question: `Write an inequality:\n"You need more than ${n} correct answers to pass."`,
                    answer: `a > ${n}`,
                    hint: `"More than" means strictly greater → >  (exactly ${n} does NOT pass)`,
                    explanation: `"More than ${n}" means greater than ${n}.\nExactly ${n} is NOT enough, so use >.\na > ${n}`
                };
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)]();
    },

    // 8.6: Graph inequalities (identify correct number line description)
    generateGraphInequality: function() {
        const n = Math.floor(Math.random() * 20) + 1;
        const types = [
            {
                sym: '>', circle: 'open', direction: 'right',
                graph: `Open circle at ${n}, shade to the RIGHT`,
                explain: `> means the number is NOT included → open circle.\nGreater than → shade RIGHT (bigger numbers).`
            },
            {
                sym: '<', circle: 'open', direction: 'left',
                graph: `Open circle at ${n}, shade to the LEFT`,
                explain: `< means the number is NOT included → open circle.\nLess than → shade LEFT (smaller numbers).`
            },
            {
                sym: '≥', circle: 'filled', direction: 'right',
                graph: `Filled circle at ${n}, shade to the RIGHT`,
                explain: `≥ means the number IS included → filled circle.\nGreater than or equal → shade RIGHT (bigger numbers).`
            },
            {
                sym: '≤', circle: 'filled', direction: 'left',
                graph: `Filled circle at ${n}, shade to the LEFT`,
                explain: `≤ means the number IS included → filled circle.\nLess than or equal → shade LEFT (smaller numbers).`
            }
        ];
        const type = types[Math.floor(Math.random() * types.length)];

        return {
            question: `How would you graph x ${type.sym} ${n} on a number line?`,
            answer: type.graph,
            hint: `Two questions: (1) Is ${n} included? ${type.sym.includes('=') || type.sym === '≥' || type.sym === '≤' ? 'Yes → filled circle' : 'No → open circle'}\n(2) Which direction? ${type.sym.includes('>') || type.sym === '>' || type.sym === '≥' ? 'Right (bigger)' : 'Left (smaller)'}`,
            explanation: `x ${type.sym} ${n}:\n${type.explain}\nAnswer: ${type.graph}`
        };
    },

    // 8.6: Read a number line and write the inequality
    generateNumberLineToInequality: function() {
        const n = Math.floor(Math.random() * 20) + 1;
        const configs = [
            { circle: 'open', dir: 'right', sym: '>', desc: 'greater than' },
            { circle: 'open', dir: 'left', sym: '<', desc: 'less than' },
            { circle: 'filled', dir: 'right', sym: '≥', desc: 'greater than or equal to' },
            { circle: 'filled', dir: 'left', sym: '≤', desc: 'less than or equal to' }
        ];
        const cfg = configs[Math.floor(Math.random() * configs.length)];

        return {
            question: `A number line shows a ${cfg.circle} circle at ${n}, shaded to the ${cfg.dir}.\nWrite the inequality.`,
            answer: `x ${cfg.sym} ${n}`,
            hint: `${cfg.circle === 'filled' ? 'Filled circle → the number IS included (use ≤ or ≥)' : 'Open circle → the number is NOT included (use < or >)'}.\nShaded ${cfg.dir} → ${cfg.dir === 'right' ? 'greater than' : 'less than'}.`,
            explanation: `${cfg.circle === 'filled' ? 'Filled' : 'Open'} circle at ${n} → ${n} is ${cfg.circle === 'filled' ? 'included' : 'NOT included'}\nShaded ${cfg.dir} → ${cfg.desc}\nInequality: x ${cfg.sym} ${n}`
        };
    },

    // Lesson progress tracking (same pattern as algebra.js)
    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter8']) {
            userData.lessonProgress['chapter8'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter8'];
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
