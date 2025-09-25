// Decimals and Percents Generator
window.DecimalsGenerator = {
    generate: function() {
        const type = Math.floor(Math.random() * 4);
        
        switch(type) {
            case 0: return this.decimalToPercent();
            case 1: return this.percentToDecimal();
            case 2: return this.fractionToPercent();
            case 3: return this.percentProblems();
        }
    },
    
    decimalToPercent: function() {
        const decimals = [0.25, 0.5, 0.75, 0.1, 0.2, 0.33, 0.67, 0.125, 0.375, 0.8, 0.15, 0.45];
        const decimal = decimals[Math.floor(Math.random() * decimals.length)];
        const percent = decimal * 100;
        
        return {
            question: `Convert ${decimal} to a percent`,
            answer: percent,
            hint: `Multiply the decimal by 100 and add the % sign`,
            explanation: `${decimal} × 100 = ${percent}%`
        };
    },
    
    percentToDecimal: function() {
        const percents = [25, 50, 75, 10, 20, 33, 67, 12.5, 37.5, 80, 15, 45, 5, 95];
        const percent = percents[Math.floor(Math.random() * percents.length)];
        const decimal = percent / 100;
        
        return {
            question: `Convert ${percent}% to a decimal`,
            answer: decimal,
            hint: `Divide the percent by 100`,
            explanation: `${percent} ÷ 100 = ${decimal}`
        };
    },
    
    fractionToPercent: function() {
        const fractions = [
            {num: 1, den: 2, percent: 50},
            {num: 1, den: 4, percent: 25},
            {num: 3, den: 4, percent: 75},
            {num: 1, den: 5, percent: 20},
            {num: 2, den: 5, percent: 40},
            {num: 1, den: 10, percent: 10},
            {num: 3, den: 10, percent: 30},
            {num: 1, den: 3, percent: 33.33},
            {num: 2, den: 3, percent: 66.67}
        ];
        
        const frac = fractions[Math.floor(Math.random() * fractions.length)];
        
        return {
            question: `Convert ${frac.num}/${frac.den} to a percent (round to nearest whole number if needed)`,
            answer: Math.round(frac.percent),
            hint: `First convert to decimal, then multiply by 100`,
            explanation: `${frac.num}/${frac.den} = ${(frac.num/frac.den).toFixed(2)} = ${Math.round(frac.percent)}%`
        };
    },
    
    percentProblems: function() {
        const base = Math.floor(Math.random() * 50 + 10) * 10; // 100, 200, 300, etc.
        const percent = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
        const result = (base * percent) / 100;
        
        return {
            question: `What is ${percent}% of ${base}?`,
            answer: result,
            hint: `Convert ${percent}% to decimal and multiply by ${base}`,
            explanation: `${percent}% = ${percent/100}, then ${percent/100} × ${base} = ${result}`
        };
    }
};
