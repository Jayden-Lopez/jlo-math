// Fractions Question Generator
window.FractionsGenerator = {
    generate: function() {
        const types = ['add', 'subtract', 'multiply', 'compare', 'simplify'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'add':
                return this.generateAddition();
            case 'subtract':
                return this.generateSubtraction();
            case 'multiply':
                return this.generateMultiplication();
            case 'compare':
                return this.generateComparison();
            case 'simplify':
                return this.generateSimplification();
            default:
                return this.generateAddition();
        }
    },
    
    generateAddition: function() {
        const denominators = [2, 3, 4, 5, 6, 8, 10];
        const d1 = denominators[Math.floor(Math.random() * denominators.length)];
        const d2 = denominators[Math.floor(Math.random() * denominators.length)];
        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
        
        // Find LCD
        const lcd = this.lcm(d1, d2);
        const result_n = (n1 * lcd / d1) + (n2 * lcd / d2);
        const result_d = lcd;
        
        // Simplify result
        const gcd = this.gcd(result_n, result_d);
        const final_n = result_n / gcd;
        const final_d = result_d / gcd;
        
        return {
            question: `What is ${n1}/${d1} + ${n2}/${d2}?`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `First find a common denominator. Try ${lcd}`,
            explanation: `To add fractions: ${n1}/${d1} = ${n1 * lcd / d1}/${lcd} and ${n2}/${d2} = ${n2 * lcd / d2}/${lcd}. Then ${n1 * lcd / d1}/${lcd} + ${n2 * lcd / d2}/${lcd} = ${result_n}/${result_d}. Simplified: ${final_n}/${final_d}`
        };
    },
    
    generateSubtraction: function() {
        const denominators = [2, 3, 4, 5, 6, 8];
        const d1 = denominators[Math.floor(Math.random() * denominators.length)];
        const d2 = denominators[Math.floor(Math.random() * denominators.length)];
        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
        
        // Ensure first fraction is larger
        const v1 = n1 / d1;
        const v2 = n2 / d2;
        
        let question, result_n, result_d;
        const lcd = this.lcm(d1, d2);
        
        if (v1 >= v2) {
            result_n = (n1 * lcd / d1) - (n2 * lcd / d2);
            result_d = lcd;
            question = `What is ${n1}/${d1} - ${n2}/${d2}?`;
        } else {
            result_n = (n2 * lcd / d2) - (n1 * lcd / d1);
            result_d = lcd;
            question = `What is ${n2}/${d2} - ${n1}/${d1}?`;
        }
        
        const gcd = this.gcd(result_n, result_d);
        const final_n = result_n / gcd;
        const final_d = result_d / gcd;
        
        return {
            question: question,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Convert to the same denominator: ${lcd}`,
            explanation: `Using common denominator ${lcd}, subtract the numerators and simplify to get ${final_n}/${final_d}`
        };
    },
    
    generateMultiplication: function() {
        const nums = [1, 2, 3, 4, 5];
        const denoms = [2, 3, 4, 5, 6, 8];
        
        const n1 = nums[Math.floor(Math.random() * nums.length)];
        const d1 = denoms[Math.floor(Math.random() * denoms.length)];
        const n2 = nums[Math.floor(Math.random() * nums.length)];
        const d2 = denoms[Math.floor(Math.random() * denoms.length)];
        
        const result_n = n1 * n2;
        const result_d = d1 * d2;
        
        const gcd = this.gcd(result_n, result_d);
        const final_n = result_n / gcd;
        const final_d = result_d / gcd;
        
        return {
            question: `What is ${n1}/${d1} × ${n2}/${d2}?`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: "Multiply the tops, multiply the bottoms",
            explanation: `${n1} × ${n2} = ${result_n} and ${d1} × ${d2} = ${result_d}. Simplified: ${final_n}/${final_d}`
        };
    },
    
    generateComparison: function() {
        const denominators = [2, 3, 4, 5, 6, 8];
        const d1 = denominators[Math.floor(Math.random() * denominators.length)];
        const d2 = denominators[Math.floor(Math.random() * denominators.length)];
        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
        
        const v1 = n1 / d1;
        const v2 = n2 / d2;
        
        const options = [`${n1}/${d1}`, `${n2}/${d2}`, "They're equal", "Can't tell"];
        let correct;
        
        if (Math.abs(v1 - v2) < 0.001) {
            correct = 2;
        } else if (v1 > v2) {
            correct = 0;
        } else {
            correct = 1;
        }
        
        const lcd = this.lcm(d1, d2);
        
        return {
            question: `Which is larger: ${n1}/${d1} or ${n2}/${d2}?`,
            options: options,
            correct: correct,
            hint: `Convert to the same denominator: ${lcd}`,
            explanation: `${n1}/${d1} = ${n1 * lcd / d1}/${lcd} and ${n2}/${d2} = ${n2 * lcd / d2}/${lcd}, so ${options[correct]} is larger`
        };
    },
    
    generateSimplification: function() {
        const factors = [2, 3, 4, 5, 6];
        const factor = factors[Math.floor(Math.random() * factors.length)];
        const n_base = Math.floor(Math.random() * 9) + 1;
        const d_base = Math.floor(Math.random() * 9) + 2;
        
        const n = n_base * factor;
        const d = d_base * factor;
        
        const gcd = this.gcd(n, d);
        const final_n = n / gcd;
        const final_d = d / gcd;
        
        return {
            question: `Simplify ${n}/${d}`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Find the greatest common factor of ${n} and ${d}`,
            explanation: `Both ${n} and ${d} can be divided by ${gcd}. ${n} ÷ ${gcd} = ${final_n}, ${d} ÷ ${gcd} = ${final_d}`
        };
    },
    
    // Helper functions
    gcd: function(a, b) {
        return b ? this.gcd(b, a % b) : a;
    },
    
    lcm: function(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    }
};
