// Expressions Question Generator
window.ExpressionsGenerator = {
    generate: function() {
        const types = ['evaluate', 'simplify', 'factor', 'expand', 'substitute'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'evaluate':
                return this.generateEvaluate();
            case 'simplify':
                return this.generateSimplify();
            case 'factor':
                return this.generateFactor();
            case 'expand':
                return this.generateExpand();
            case 'substitute':
                return this.generateSubstitute();
            default:
                return this.generateEvaluate();
        }
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
    }
};
