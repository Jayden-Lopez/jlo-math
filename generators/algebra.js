// Algebra Question Generator
window.AlgebraGenerator = {
    generate: function() {
        const types = ['simple', 'twoStep', 'distribute', 'combine'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'simple':
                return this.generateSimpleEquation();
            case 'twoStep':
                return this.generateTwoStep();
            case 'distribute':
                return this.generateDistributive();
            case 'combine':
                return this.generateCombineLikeTerms();
            default:
                return this.generateSimpleEquation();
        }
    },
    
    generateSimpleEquation: function() {
        const x = Math.floor(Math.random() * 10) + 1;
        const operations = [
            {
                a: Math.floor(Math.random() * 10) + 2,
                generate: function() {
                    return {
                        question: `Solve for x: x + ${this.a} = ${x + this.a}`,
                        answer: x,
                        hint: `Subtract ${this.a} from both sides`,
                        explanation: `x + ${this.a} = ${x + this.a}. Subtract ${this.a}: x = ${x}`
                    };
                }
            },
            {
                a: Math.floor(Math.random() * 10) + 2,
                generate: function() {
                    return {
                        question: `Solve for x: x - ${this.a} = ${x - this.a}`,
                        answer: x,
                        hint: `Add ${this.a} to both sides`,
                        explanation: `x - ${this.a} = ${x - this.a}. Add ${this.a}: x = ${x}`
                    };
                }
            },
            {
                a: Math.floor(Math.random() * 9) + 2,
                generate: function() {
                    return {
                        question: `Solve for x: ${this.a}x = ${this.a * x}`,
                        answer: x,
                        hint: `Divide both sides by ${this.a}`,
                        explanation: `${this.a}x = ${this.a * x}. Divide by ${this.a}: x = ${x}`
                    };
                }
            }
        ];
        
        const op = operations[Math.floor(Math.random() * operations.length)];
        return op.generate();
    },
    
    generateTwoStep: function() {
        const x = Math.floor(Math.random() * 10) + 1;
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 10) + 1;
        
        const problems = [
            {
                question: `Solve for x: ${a}x + ${b} = ${a * x + b}`,
                answer: x,
                hint: `First subtract ${b}, then divide by ${a}`,
                explanation: `${a}x + ${b} = ${a * x + b}. Subtract ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}`
            },
            {
                question: `Solve for x: ${a}x - ${b} = ${a * x - b}`,
                answer: x,
                hint: `First add ${b}, then divide by ${a}`,
                explanation: `${a}x - ${b} = ${a * x - b}. Add ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}`
            },
            {
                question: `Solve for x: ${b} + ${a}x = ${b + a * x}`,
                answer: x,
                hint: `First subtract ${b}, then divide by ${a}`,
                explanation: `${b} + ${a}x = ${b + a * x}. Subtract ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}`
            }
        ];
        
        return problems[Math.floor(Math.random() * problems.length)];
    },
    
    generateDistributive: function() {
        const x = Math.floor(Math.random() * 8) + 1;
        const a = Math.floor(Math.random() * 4) + 2;
        const b = Math.floor(Math.random() * 5) + 1;
        
        const result = a * (x + b);
        
        return {
            question: `Simplify: ${a}(x + ${b}) when x = ${x}`,
            answer: result,
            hint: `Distribute ${a} to both terms inside the parentheses`,
            explanation: `${a}(x + ${b}) = ${a}x + ${a * b}. When x = ${x}: ${a}(${x}) + ${a * b} = ${a * x} + ${a * b} = ${result}`
        };
    },
    
    generateCombineLikeTerms: function() {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 10) + 5;
        const d = Math.floor(Math.random() * 10) + 5;
        
        const problems = [
            {
                question: `Simplify: ${a}x + ${b}x`,
                answer: `${a + b}x`,
                hint: "Add the coefficients of x",
                explanation: `${a}x + ${b}x = (${a} + ${b})x = ${a + b}x`
            },
            {
                question: `Simplify: ${c} + ${a}x + ${d} + ${b}x`,
                answer: `${a + b}x + ${c + d}`,
                hint: "Combine like terms: x terms together, constants together",
                explanation: `Group like terms: (${a}x + ${b}x) + (${c} + ${d}) = ${a + b}x + ${c + d}`
            },
            {
                question: `Simplify: ${a}x - ${b}x + ${c}`,
                answer: `${a - b}x + ${c}`,
                hint: "Combine the x terms first",
                explanation: `${a}x - ${b}x + ${c} = (${a} - ${b})x + ${c} = ${a - b}x + ${c}`
            }
        ];
        
        return problems[Math.floor(Math.random() * problems.length)];
    }
};
