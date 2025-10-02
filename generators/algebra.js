// algebra.js - Glencoe Math Course 1, Algebraic Thinking & Expressions
// Combines algebra and expressions topics
// For Jordan - 6th grade (currently at level 480)

window.AlgebraGenerator = {
    generate: function() {
        const lessonTypes = [
            'writeExpression',
            'evaluateExpression',
            'simplifyExpression',
            'solveOneStep',
            'solveTwoStep',
            'inequality',
            'patterns',
            'functions'
        ];
        
        const type = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
        
        switch(type) {
            case 'writeExpression':
                return this.generateWriteExpression();
            case 'evaluateExpression':
                return this.generateEvaluateExpression();
            case 'simplifyExpression':
                return this.generateSimplifyExpression();
            case 'solveOneStep':
                return this.generateSolveOneStep();
            case 'solveTwoStep':
                return this.generateSolveTwoStep();
            case 'inequality':
                return this.generateInequality();
            case 'patterns':
                return this.generatePatterns();
            case 'functions':
                return this.generateFunctions();
            default:
                return this.generateSolveOneStep();
        }
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
    }
};

// Also make expressions generator point to algebra for compatibility
window.ExpressionsGenerator = window.AlgebraGenerator;
