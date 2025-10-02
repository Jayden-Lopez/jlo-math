// decimals.js - Glencoe Math Course 1, Chapter 2: Fractions, Decimals, and Percents
// For Jordan - 6th grade, current chapter in class

window.DecimalsGenerator = {
    generate: function() {
        const lessonTypes = [
            'decimalsToFractions',
            'fractionsToDecimals',
            'percentsAndFractions',
            'percentsAndDecimals',
            'percentOfNumber',
            'compareDecimals',
            'comparePercents'
        ];
        
        const type = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
        
        switch(type) {
            case 'decimalsToFractions':
                return this.generateDecimalsToFractions();
            case 'fractionsToDecimals':
                return this.generateFractionsToDecimals();
            case 'percentsAndFractions':
                return this.generatePercentsAndFractions();
            case 'percentsAndDecimals':
                return this.generatePercentsAndDecimals();
            case 'percentOfNumber':
                return this.generatePercentOfNumber();
            case 'compareDecimals':
                return this.generateCompareDecimals();
            case 'comparePercents':
                return this.generateComparePercents();
            default:
                return this.generateCompareDecimals();
        }
    },
    
    // Lesson 2.1: Decimals and Fractions
    generateDecimalsToFractions: function() {
        const decimals = [
            {decimal: 0.5, fraction: "1/2"},
            {decimal: 0.25, fraction: "1/4"},
            {decimal: 0.75, fraction: "3/4"},
            {decimal: 0.2, fraction: "1/5"},
            {decimal: 0.4, fraction: "2/5"},
            {decimal: 0.6, fraction: "3/5"},
            {decimal: 0.8, fraction: "4/5"},
            {decimal: 0.1, fraction: "1/10"},
            {decimal: 0.3, fraction: "3/10"},
            {decimal: 0.125, fraction: "1/8"},
            {decimal: 0.375, fraction: "3/8"}
        ];
        
        const selected = decimals[Math.floor(Math.random() * decimals.length)];
        
        return {
            question: `Convert ${selected.decimal} to a fraction in simplest form`,
            answer: selected.fraction,
            hint: "Think about place value - tenths, hundredths, then simplify",
            explanation: `${selected.decimal} = ${selected.fraction}`
        };
    },
    
    generateFractionsToDecimals: function() {
        const fractions = [
            {fraction: "1/2", decimal: 0.5},
            {fraction: "1/4", decimal: 0.25},
            {fraction: "3/4", decimal: 0.75},
            {fraction: "1/5", decimal: 0.2},
            {fraction: "2/5", decimal: 0.4},
            {fraction: "3/5", decimal: 0.6},
            {fraction: "4/5", decimal: 0.8},
            {fraction: "1/10", decimal: 0.1},
            {fraction: "3/10", decimal: 0.3},
            {fraction: "1/8", decimal: 0.125},
            {fraction: "7/10", decimal: 0.7}
        ];
        
        const selected = fractions[Math.floor(Math.random() * fractions.length)];
        
        return {
            question: `Convert ${selected.fraction} to a decimal`,
            answer: selected.decimal.toString(),
            hint: "Divide the numerator by the denominator",
            explanation: `${selected.fraction} = ${selected.decimal} (divide top by bottom)`
        };
    },
    
    // Lesson 2.2: Percents and Fractions
    generatePercentsAndFractions: function() {
        const types = ['percentToFraction', 'fractionToPercent'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'percentToFraction') {
            const percents = [
                {percent: 50, fraction: "1/2"},
                {percent: 25, fraction: "1/4"},
                {percent: 75, fraction: "3/4"},
                {percent: 20, fraction: "1/5"},
                {percent: 40, fraction: "2/5"},
                {percent: 60, fraction: "3/5"},
                {percent: 80, fraction: "4/5"},
                {percent: 10, fraction: "1/10"},
                {percent: 30, fraction: "3/10"}
            ];
            
            const selected = percents[Math.floor(Math.random() * percents.length)];
            
            return {
                question: `Convert ${selected.percent}% to a fraction in simplest form`,
                answer: selected.fraction,
                hint: `${selected.percent}% means ${selected.percent} out of 100`,
                explanation: `${selected.percent}% = ${selected.percent}/100 = ${selected.fraction}`
            };
        } else {
            const fractions = [
                {fraction: "1/2", percent: 50},
                {fraction: "1/4", percent: 25},
                {fraction: "3/4", percent: 75},
                {fraction: "1/5", percent: 20},
                {fraction: "2/5", percent: 40},
                {fraction: "3/5", percent: 60},
                {fraction: "4/5", percent: 80},
                {fraction: "1/10", percent: 10}
            ];
            
            const selected = fractions[Math.floor(Math.random() * fractions.length)];
            
            return {
                question: `Convert ${selected.fraction} to a percent`,
                answer: `${selected.percent}%`,
                hint: "Convert to decimal first, then multiply by 100",
                explanation: `${selected.fraction} = ${selected.percent/100} = ${selected.percent}%`
            };
        }
    },
    
    // Lesson 2.3: Percents and Decimals
    generatePercentsAndDecimals: function() {
        const types = ['decimalToPercent', 'percentToDecimal'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'decimalToPercent') {
            const decimal = (Math.random() * 0.99).toFixed(2);
            const percent = Math.round(decimal * 100);
            
            return {
                question: `Convert ${decimal} to a percent`,
                answer: `${percent}%`,
                hint: "Multiply by 100 and add the % symbol",
                explanation: `${decimal} × 100 = ${percent}%`
            };
        } else {
            const percent = Math.floor(Math.random() * 100) + 1;
            const decimal = (percent / 100).toFixed(2);
            
            return {
                question: `Convert ${percent}% to a decimal`,
                answer: decimal,
                hint: "Divide by 100 or move decimal point 2 places left",
                explanation: `${percent}% = ${percent} ÷ 100 = ${decimal}`
            };
        }
    },
    
    // Lesson 2.4: Percent of a Number
    generatePercentOfNumber: function() {
        const number = Math.floor(Math.random() * 100) * 10 + 100;
        const percent = Math.floor(Math.random() * 10) * 10 + 10;
        const result = (number * percent / 100);
        
        return {
            question: `Find ${percent}% of ${number}`,
            answer: result.toString(),
            hint: `Convert ${percent}% to decimal, then multiply`,
            explanation: `${percent}% = ${percent/100}\n${percent/100} × ${number} = ${result}`
        };
    },
    
    // Lesson 2.5: Compare and Order Fractions, Decimals, and Percents
    generateCompareDecimals: function() {
        const d1 = (Math.random() * 9.99).toFixed(2);
        const d2 = (Math.random() * 9.99).toFixed(2);
        
        if (parseFloat(d1) === parseFloat(d2)) {
            // Avoid equal values
            return this.generateCompareDecimals();
        }
        
        const symbol = parseFloat(d1) > parseFloat(d2) ? ">" : "<";
        
        return {
            question: `Compare: ${d1} ___ ${d2}`,
            answer: symbol,
            options: [">", "<", "="],
            correct: [">", "<", "="].indexOf(symbol),
            hint: "Compare digit by digit from left to right",
            explanation: `${d1} ${symbol} ${d2} because ${parseFloat(d1)} is ${symbol === ">" ? "greater than" : "less than"} ${parseFloat(d2)}`
        };
    },
    
    generateComparePercents: function() {
        const formats = [
            () => {
                const p1 = Math.floor(Math.random() * 100) + 1;
                const d2 = (Math.random() * 0.99).toFixed(2);
                const p2Value = d2 * 100;
                return {
                    item1: `${p1}%`,
                    item2: d2.toString(),
                    value1: p1,
                    value2: p2Value,
                    explanation: `${p1}% vs ${d2} (which is ${p2Value}%)`
                };
            },
            () => {
                const f1Num = Math.floor(Math.random() * 4) + 1;
                const f1Den = Math.floor(Math.random() * 4) + 2;
                const p2 = Math.floor(Math.random() * 100) + 1;
                const f1Value = (f1Num / f1Den) * 100;
                return {
                    item1: `${f1Num}/${f1Den}`,
                    item2: `${p2}%`,
                    value1: f1Value,
                    value2: p2,
                    explanation: `${f1Num}/${f1Den} (which is ${f1Value.toFixed(1)}%) vs ${p2}%`
                };
            }
        ];
        
        const format = formats[Math.floor(Math.random() * formats.length)]();
        const symbol = format.value1 > format.value2 ? ">" :
                       format.value1 < format.value2 ? "<" : "=";
        
        return {
            question: `Compare: ${format.item1} ___ ${format.item2}`,
            answer: symbol,
            options: [">", "<", "="],
            correct: [">", "<", "="].indexOf(symbol),
            hint: "Convert both to the same form (decimals or percents) to compare",
            explanation: format.explanation + `, so ${format.item1} ${symbol} ${format.item2}`
        };
    }
};
