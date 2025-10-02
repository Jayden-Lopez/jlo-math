// operations.js - Glencoe Math Course 1, Chapter 3: Compute with Multi-Digit Numbers
// Aligned with Jordan's textbook for 6th grade

window.OperationsGenerator = {
    generate: function() {
        const problemTypes = [
            'addDecimals',
            'subtractDecimals', 
            'multiplyWholeNumbers',
            'divideWholeNumbers',
            'multiplyDecimals',
            'divideDecimals',
            'estimateProducts',
            'estimateSums'
        ];
        
        const type = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        
        switch(type) {
            case 'addDecimals':
                return this.generateAddDecimals();
            case 'subtractDecimals':
                return this.generateSubtractDecimals();
            case 'multiplyWholeNumbers':
                return this.generateMultiplyWholeNumbers();
            case 'divideWholeNumbers':
                return this.generateDivideWholeNumbers();
            case 'multiplyDecimals':
                return this.generateMultiplyDecimals();
            case 'divideDecimals':
                return this.generateDivideDecimals();
            case 'estimateProducts':
                return this.generateEstimateProducts();
            case 'estimateSums':
                return this.generateEstimateSums();
            default:
                return this.generateDivideWholeNumbers();
        }
    },
    
    // Lesson 3.1: Add and Subtract Decimals
    generateAddDecimals: function() {
        const a = (Math.random() * 100).toFixed(2);
        const b = (Math.random() * 50).toFixed(2);
        const sum = (parseFloat(a) + parseFloat(b)).toFixed(2);
        
        return {
            question: `Add: ${a} + ${b}`,
            answer: sum,
            hint: "Line up the decimal points vertically",
            explanation: `Line up decimals:\n  ${a}\n+ ${b}\n-------\n  ${sum}`
        };
    },
    
    generateSubtractDecimals: function() {
        const a = (Math.random() * 100 + 50).toFixed(2);
        const b = (Math.random() * 50).toFixed(2);
        const diff = (parseFloat(a) - parseFloat(b)).toFixed(2);
        
        return {
            question: `Subtract: ${a} - ${b}`,
            answer: diff,
            hint: "Line up the decimal points vertically",
            explanation: `Line up decimals:\n  ${a}\n- ${b}\n-------\n  ${diff}`
        };
    },
    
    // Lesson 3.2: Estimate Products
    generateEstimateProducts: function() {
        const a = Math.floor(Math.random() * 900) + 100;
        const b = Math.floor(Math.random() * 90) + 10;
        const roundedA = Math.round(a / 100) * 100;
        const roundedB = Math.round(b / 10) * 10;
        const estimate = roundedA * roundedB;
        
        return {
            question: `Estimate the product by rounding: ${a} × ${b}`,
            answer: estimate.toString(),
            hint: `Round ${a} to nearest hundred, ${b} to nearest ten`,
            explanation: `${a} ≈ ${roundedA}, ${b} ≈ ${roundedB}\nEstimate: ${roundedA} × ${roundedB} = ${estimate}`
        };
    },
    
    generateEstimateSums: function() {
        const a = Math.floor(Math.random() * 900) + 100;
        const b = Math.floor(Math.random() * 900) + 100;
        const roundedA = Math.round(a / 100) * 100;
        const roundedB = Math.round(b / 100) * 100;
        const estimate = roundedA + roundedB;
        
        return {
            question: `Estimate the sum by rounding: ${a} + ${b}`,
            answer: estimate.toString(),
            hint: "Round each number to the nearest hundred",
            explanation: `${a} ≈ ${roundedA}, ${b} ≈ ${roundedB}\nEstimate: ${roundedA} + ${roundedB} = ${estimate}`
        };
    },
    
    // Lesson 3.3: Multiply Decimals
    generateMultiplyDecimals: function() {
        const a = (Math.random() * 10).toFixed(1);
        const b = (Math.random() * 10).toFixed(1);
        const product = (parseFloat(a) * parseFloat(b)).toFixed(2);
        
        return {
            question: `Multiply: ${a} × ${b}`,
            answer: product,
            hint: "Multiply as whole numbers, then count decimal places",
            explanation: `${a} has 1 decimal place, ${b} has 1 decimal place\n${a} × ${b} = ${product} (2 decimal places total)`
        };
    },
    
    // Lesson 3.4: Divide Multi-Digit Numbers (Jordan needs this!)
    generateDivideWholeNumbers: function() {
        const divisor = Math.floor(Math.random() * 9) + 2;
        const quotient = Math.floor(Math.random() * 500) + 100;
        const remainder = Math.floor(Math.random() * divisor);
        const dividend = divisor * quotient + remainder;
        
        return {
            question: `Divide: ${dividend} ÷ ${divisor}`,
            answer: remainder > 0 ? `${quotient} R${remainder}` : quotient.toString(),
            hint: `How many times does ${divisor} go into ${dividend}?`,
            explanation: `${divisor} × ${quotient} = ${divisor * quotient}\n${dividend} - ${divisor * quotient} = ${remainder}\nAnswer: ${quotient}${remainder > 0 ? ' R' + remainder : ''}`
        };
    },
    
    // Lesson 3.5: Divide Decimals (Jordan needs this!)
    generateDivideDecimals: function() {
        const divisor = (Math.random() * 9 + 1).toFixed(1);
        const quotient = (Math.random() * 20 + 5).toFixed(1);
        const dividend = (parseFloat(divisor) * parseFloat(quotient)).toFixed(2);
        
        return {
            question: `Divide: ${dividend} ÷ ${divisor}`,
            answer: quotient,
            hint: "Move decimal point to make divisor a whole number",
            explanation: `Move decimal 1 place: ${parseFloat(dividend) * 10} ÷ ${parseFloat(divisor) * 10} = ${quotient}`
        };
    },
    
    // Standard multiplication for variety
    generateMultiplyWholeNumbers: function() {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;
        const product = a * b;
        
        return {
            question: `Multiply: ${a} × ${b}`,
            answer: product.toString(),
            hint: "Break it down: multiply by ones, then by tens",
            explanation: `${a} × ${b} = ${product}`
        };
    }
};
