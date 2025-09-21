// Integers Question Generator
window.IntegersGenerator = {
    generate: function() {
        const types = ['add', 'subtract', 'multiply', 'divide', 'compare', 'absolute'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'add':
                return this.generateAddition();
            case 'subtract':
                return this.generateSubtraction();
            case 'multiply':
                return this.generateMultiplication();
            case 'divide':
                return this.generateDivision();
            case 'compare':
                return this.generateComparison();
            case 'absolute':
                return this.generateAbsolute();
            default:
                return this.generateAddition();
        }
    },
    
    generateAddition: function() {
        const problems = [
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 20) - 10;
                    const b = Math.floor(Math.random() * 20) - 10;
                    const sum = a + b;
                    return {
                        question: `What is ${a} + ${b}?`,
                        answer: sum,
                        hint: a < 0 && b < 0 ? "Adding two negatives gives a negative" : 
                              a < 0 || b < 0 ? "Different signs: subtract and use the sign of the larger absolute value" : 
                              "Add the positive numbers",
                        explanation: `${a} + ${b} = ${sum}`
                    };
                }
            },
            {
                generate: function() {
                    const temp = Math.floor(Math.random() * 10) + 5;
                    const drop = Math.floor(Math.random() * 15) + 10;
                    const result = temp - drop;
                    return {
                        question: `The temperature is ${temp}°C. It drops by ${drop}°C. What is the new temperature?`,
                        answer: result,
                        hint: `Start at ${temp} and count down ${drop}`,
                        explanation: `${temp} - ${drop} = ${result}°C`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateSubtraction: function() {
        const a = Math.floor(Math.random() * 20) - 10;
        const b = Math.floor(Math.random() * 20) - 10;
        const diff = a - b;
        
        return {
            question: `What is ${a} - ${b}?`,
            answer: diff,
            hint: b < 0 ? "Subtracting a negative is the same as adding" : "Subtract normally",
            explanation: b < 0 ? `${a} - (${b}) = ${a} + ${Math.abs(b)} = ${diff}` : `${a} - ${b} = ${diff}`
        };
    },
    
    generateMultiplication: function() {
        const a = Math.floor(Math.random() * 10) - 5;
        const b = Math.floor(Math.random() * 10) - 5;
        const product = a * b;
        
        const sign = (a < 0 && b < 0) ? "Negative × Negative = Positive" :
                    (a < 0 || b < 0) ? "Positive × Negative = Negative" :
                    "Positive × Positive = Positive";
        
        return {
            question: `What is ${a} × ${b}?`,
            answer: product,
            hint: sign,
            explanation: `${a} × ${b} = ${product}. ${sign}`
        };
    },
    
    generateDivision: function() {
        const b = Math.floor(Math.random() * 8) + 2;
        const quotient = Math.floor(Math.random() * 10) - 5;
        const a = b * quotient;
        
        if (a === 0) return this.generateDivision(); // Avoid 0 ÷ b
        
        const sign = (a < 0 && b < 0) ? "Negative ÷ Negative = Positive" :
                    (a < 0 || b < 0) ? "Positive ÷ Negative = Negative" :
                    "Positive ÷ Positive = Positive";
        
        return {
            question: `What is ${a} ÷ ${b}?`,
            answer: quotient,
            hint: sign,
            explanation: `${a} ÷ ${b} = ${quotient}. ${sign}`
        };
    },
    
    generateComparison: function() {
        const a = Math.floor(Math.random() * 20) - 10;
        const b = Math.floor(Math.random() * 20) - 10;
        
        const options = [
            `${a} > ${b}`,
            `${a} < ${b}`,
            `${a} = ${b}`,
            "Cannot determine"
        ];
        
        let correct;
        if (a > b) correct = 0;
        else if (a < b) correct = 1;
        else correct = 2;
        
        return {
            question: `Which statement is true about ${a} and ${b}?`,
            options: options,
            correct: correct,
            hint: "Remember: negative numbers are less than positive numbers",
            explanation: `${a} ${a > b ? '>' : a < b ? '<' : '='} ${b}, so "${options[correct]}" is correct`
        };
    },
    
    generateAbsolute: function() {
        const problems = [
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 20) - 10;
                    return {
                        question: `What is |${a}|?`,
                        answer: Math.abs(a),
                        hint: "Absolute value is the distance from zero",
                        explanation: `|${a}| = ${Math.abs(a)} (always positive or zero)`
                    };
                }
            },
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 10) - 5;
                    const b = Math.floor(Math.random() * 10) - 5;
                    const result = Math.abs(a) + Math.abs(b);
                    return {
                        question: `What is |${a}| + |${b}|?`,
                        answer: result,
                        hint: "Find each absolute value first, then add",
                        explanation: `|${a}| = ${Math.abs(a)}, |${b}| = ${Math.abs(b)}. So ${Math.abs(a)} + ${Math.abs(b)} = ${result}`
                    };
                }
            },
            {
                generate: function() {
                    const a = Math.floor(Math.random() * 15) - 7;
                    const b = Math.floor(Math.random() * 15) - 7;
                    
                    const options = [
                        `|${a}|`,
                        `|${b}|`,
                        "They're equal",
                        "Cannot determine"
                    ];
                    
                    let correct;
                    if (Math.abs(a) > Math.abs(b)) correct = 0;
                    else if (Math.abs(a) < Math.abs(b)) correct = 1;
                    else correct = 2;
                    
                    return {
                        question: `Which is larger: |${a}| or |${b}|?`,
                        options: options,
                        correct: correct,
                        hint: "Compare the distances from zero",
                        explanation: `|${a}| = ${Math.abs(a)}, |${b}| = ${Math.abs(b)}, so ${options[correct]} is larger`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    }
};
