// Operations Question Generator
window.OperationsGenerator = {
    generate: function() {
        const types = ['multiply', 'divide', 'mixed', 'order'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'multiply':
                return this.generateMultiplication();
            case 'divide':
                return this.generateDivision();
            case 'mixed':
                return this.generateMixed();
            case 'order':
                return this.generateOrderOfOperations();
            default:
                return this.generateMultiplication();
        }
    },
    
    generateMultiplication: function() {
        const num1 = Math.floor(Math.random() * 50) + 10;
        const num2 = Math.floor(Math.random() * 9) + 2;
        const answer = num1 * num2;
        
        return {
            question: `What is ${num1} × ${num2}?`,
            answer: answer,
            hint: `Break it down: ${num1} × ${num2} = (${Math.floor(num1/10)*10} × ${num2}) + (${num1%10} × ${num2})`,
            explanation: `${Math.floor(num1/10)*10} × ${num2} = ${Math.floor(num1/10)*10 * num2}, and ${num1%10} × ${num2} = ${(num1%10) * num2}. Add them: ${Math.floor(num1/10)*10 * num2} + ${(num1%10) * num2} = ${answer}`
        };
    },
    
    generateDivision: function() {
        const divisor = Math.floor(Math.random() * 9) + 2;
        const quotient = Math.floor(Math.random() * 50) + 10;
        const dividend = divisor * quotient;
        
        return {
            question: `What is ${dividend} ÷ ${divisor}?`,
            answer: quotient,
            hint: `Think: What times ${divisor} equals ${dividend}?`,
            explanation: `${divisor} × ${quotient} = ${dividend}, so ${dividend} ÷ ${divisor} = ${quotient}`
        };
    },
    
    generateMixed: function() {
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 20) + 5;
        const c = Math.floor(Math.random() * 10) + 1;
        
        const operations = [
            {
                question: `${a} + ${b} × ${c}`,
                answer: a + (b * c),
                hint: "Remember: multiplication before addition",
                explanation: `First: ${b} × ${c} = ${b * c}. Then: ${a} + ${b * c} = ${a + (b * c)}`
            },
            {
                question: `${a} × ${c} - ${b}`,
                answer: (a * c) - b,
                hint: "Remember: multiplication before subtraction",
                explanation: `First: ${a} × ${c} = ${a * c}. Then: ${a * c} - ${b} = ${(a * c) - b}`
            },
            {
                question: `${a + b} - ${c} × 2`,
                answer: (a + b) - (c * 2),
                hint: "Calculate multiplication first",
                explanation: `First: ${c} × 2 = ${c * 2}. Then: ${a + b} - ${c * 2} = ${(a + b) - (c * 2)}`
            }
        ];
        
        return operations[Math.floor(Math.random() * operations.length)];
    },
    
    generateOrderOfOperations: function() {
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 5) + 2;
        
        const problems = [
            {
                question: `(${a} + ${b}) × ${c}`,
                answer: (a + b) * c,
                hint: "Do what's in parentheses first",
                explanation: `First: ${a} + ${b} = ${a + b}. Then: ${a + b} × ${c} = ${(a + b) * c}`
            },
            {
                question: `${a} × (${b} + ${c})`,
                answer: a * (b + c),
                hint: "Do what's in parentheses first",
                explanation: `First: ${b} + ${c} = ${b + c}. Then: ${a} × ${b + c} = ${a * (b + c)}`
            },
            {
                question: `${a * c} ÷ ${c} + ${b}`,
                answer: a + b,
                hint: "Division before addition",
                explanation: `First: ${a * c} ÷ ${c} = ${a}. Then: ${a} + ${b} = ${a + b}`
            },
            {
                question: `${b} + ${a} × ${c} - ${c}`,
                answer: b + (a * c) - c,
                hint: "Remember PEMDAS: multiplication before addition/subtraction",
                explanation: `First: ${a} × ${c} = ${a * c}. Then left to right: ${b} + ${a * c} = ${b + (a * c)}, then ${b + (a * c)} - ${c} = ${b + (a * c) - c}`
            }
        ];
        
        return problems[Math.floor(Math.random() * problems.length)];
    }
};
