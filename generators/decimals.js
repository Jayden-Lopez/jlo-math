// decimals.js - Glencoe Math Course 1, Chapter 2: Fractions, Decimals, and Percents
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapter 2 sequence

window.DecimalsGenerator = {
    // Lesson structure for sequential learning
    lessons: [
        { id: '2.1', name: 'Decimals and Fractions', types: ['decimalsToFractions', 'fractionsToDecimals'] },
        { id: '2.2', name: 'Percents and Fractions', types: ['percentsAndFractions'] },
        { id: '2.3', name: 'Percents and Decimals', types: ['percentsAndDecimals'] },
        { id: '2.4', name: 'Percent of a Number', types: ['percentOfNumber'] },
        { id: '2.5', name: 'Compare and Order', types: ['compareDecimals', 'comparePercents', 'orderNumbers'] }
    ],

    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;
        const chapterProgress = userData.lessonProgress?.['chapter2'] || { currentLesson: 0 };
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
            case 'decimalsToFractions':
                problem = this.generateDecimalsToFractions();
                break;
            case 'fractionsToDecimals':
                problem = this.generateFractionsToDecimals();
                break;
            case 'percentsAndFractions':
                problem = this.generatePercentsAndFractions();
                break;
            case 'percentsAndDecimals':
                problem = this.generatePercentsAndDecimals();
                break;
            case 'percentOfNumber':
                problem = this.generatePercentOfNumber();
                break;
            case 'compareDecimals':
                problem = this.generateCompareDecimals();
                break;
            case 'comparePercents':
                problem = this.generateComparePercents();
                break;
            case 'orderNumbers':
                problem = this.generateOrderNumbers();
                break;
            default:
                problem = this.generateCompareDecimals();
        }

        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
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
    },

    // Lesson 2.5: Order Numbers (mixed formats)
    generateOrderNumbers: function() {
        // Create a mix of decimals, fractions, and percents
        const values = [
            { display: '0.25', value: 0.25 },
            { display: '1/2', value: 0.5 },
            { display: '75%', value: 0.75 },
            { display: '0.1', value: 0.1 },
            { display: '3/4', value: 0.75 },
            { display: '40%', value: 0.4 },
            { display: '0.6', value: 0.6 },
            { display: '1/4', value: 0.25 },
            { display: '80%', value: 0.8 },
            { display: '0.5', value: 0.5 }
        ];

        // Pick 4 random values
        const shuffled = [...values].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 4);

        // Sort by value for the answer
        const sorted = [...selected].sort((a, b) => a.value - b.value);
        const question = selected.map(v => v.display).join(', ');
        const answer = sorted.map(v => v.display).join(', ');

        return {
            question: `Order from least to greatest: ${question}`,
            answer: answer,
            hint: "Convert all to decimals to compare: fractions ÷, percents ÷ 100",
            explanation: `Converting to decimals: ${sorted.map(v => `${v.display} = ${v.value}`).join(', ')}\nOrdered: ${answer}`
        };
    },

    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter2']) {
            userData.lessonProgress['chapter2'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter2'];
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
