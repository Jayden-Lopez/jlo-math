// ratios.js - Glencoe Math Course 1, Chapter 1: Ratios and Rates
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapter 1 sequence

window.RatiosGenerator = {
    // Lesson structure for sequential learning
    lessons: [
        { id: '1.1', name: 'Factors and Multiples', types: ['factors'] },
        { id: '1.2', name: 'Ratios', types: ['ratios'] },
        { id: '1.3', name: 'Rates', types: ['rates'] },
        { id: '1.4', name: 'Ratio Tables', types: ['ratioTables'] },
        { id: '1.5', name: 'Graph Ratios', types: ['graphRatios'] },
        { id: '1.6', name: 'Equivalent Ratios', types: ['equivalentRatios'] },
        { id: '1.7', name: 'Ratio and Rate Problems', types: ['unitRates', 'rateWordProblems'] }
    ],

    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;
        const chapterProgress = userData.lessonProgress?.['chapter1'] || { currentLesson: 0 };
        return Math.min(chapterProgress.currentLesson || 0, this.lessons.length - 1);
    },

    generate: function(specificLesson = null) {
        const currentLessonIndex = specificLesson !== null ? specificLesson : this.getCurrentLesson();

        // Weight toward current lesson (60%) with review (40%)
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
            case 'factors':
                problem = this.generateFactors();
                break;
            case 'ratios':
                problem = this.generateRatios();
                break;
            case 'rates':
                problem = this.generateRates();
                break;
            case 'ratioTables':
                problem = this.generateRatioTables();
                break;
            case 'graphRatios':
                problem = this.generateGraphRatios();
                break;
            case 'equivalentRatios':
                problem = this.generateEquivalentRatios();
                break;
            case 'unitRates':
                problem = this.generateUnitRates();
                break;
            case 'rateWordProblems':
                problem = this.generateRateWordProblems();
                break;
            default:
                problem = this.generateRatios();
        }

        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
    },
    
    // Lesson 1.1: Factors and Multiples
    generateFactors: function() {
        const types = ['factor', 'multiple', 'gcf', 'lcm'];
        const subtype = types[Math.floor(Math.random() * types.length)];
        
        if (subtype === 'factor') {
            const num = Math.floor(Math.random() * 50) + 10;
            const factors = [];
            for (let i = 1; i <= num; i++) {
                if (num % i === 0) factors.push(i);
            }
            const testFactor = factors[Math.floor(Math.random() * factors.length)];
            
            return {
                question: `Is ${testFactor} a factor of ${num}?`,
                answer: "Yes",
                options: ["Yes", "No"],
                correct: 0,
                hint: `Check if ${num} ÷ ${testFactor} has no remainder`,
                explanation: `${num} ÷ ${testFactor} = ${num/testFactor} (no remainder), so YES`
            };
        } else if (subtype === 'multiple') {
            const base = Math.floor(Math.random() * 10) + 2;
            const mult = Math.floor(Math.random() * 10) + 1;
            const result = base * mult;
            
            return {
                question: `Is ${result} a multiple of ${base}?`,
                answer: "Yes",
                options: ["Yes", "No"],
                correct: 0,
                hint: `Check if ${result} ÷ ${base} gives a whole number`,
                explanation: `${result} ÷ ${base} = ${mult}, so YES`
            };
        } else if (subtype === 'gcf') {
            const a = Math.floor(Math.random() * 30) + 10;
            const b = Math.floor(Math.random() * 30) + 10;
            const gcf = this.findGCF(a, b);
            
            return {
                question: `Find the GCF of ${a} and ${b}`,
                answer: gcf.toString(),
                hint: "List all factors of each number and find the largest common one",
                explanation: `Factors of ${a}: ${this.getFactors(a).join(', ')}\nFactors of ${b}: ${this.getFactors(b).join(', ')}\nGCF = ${gcf}`
            };
        } else {
            const a = Math.floor(Math.random() * 10) + 2;
            const b = Math.floor(Math.random() * 10) + 2;
            const lcm = this.findLCM(a, b);
            
            return {
                question: `Find the LCM of ${a} and ${b}`,
                answer: lcm.toString(),
                hint: "Find the smallest number that both divide into evenly",
                explanation: `Multiples of ${a}: ${a}, ${a*2}, ${a*3}...\nMultiples of ${b}: ${b}, ${b*2}, ${b*3}...\nLCM = ${lcm}`
            };
        }
    },
    
    // Lesson 1.2: Ratios
    generateRatios: function() {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 12) + 2;
        const gcf = this.findGCF(a, b);
        const simplifiedA = a / gcf;
        const simplifiedB = b / gcf;
        
        return {
            question: `Write the ratio ${a}:${b} in simplest form`,
            answer: `${simplifiedA}:${simplifiedB}`,
            hint: `Find the GCF of ${a} and ${b}, then divide both by it`,
            explanation: `GCF of ${a} and ${b} is ${gcf}\n${a}÷${gcf} : ${b}÷${gcf} = ${simplifiedA}:${simplifiedB}`
        };
    },
    
    // Lesson 1.3: Rates
    generateRates: function() {
        const situations = [
            () => {
                const miles = Math.floor(Math.random() * 200) + 50;
                const hours = Math.floor(Math.random() * 4) + 2;
                const rate = miles / hours;
                return {
                    question: `A car travels ${miles} miles in ${hours} hours. What is the rate in miles per hour?`,
                    answer: `${rate} mph`,
                    hint: "Rate = distance ÷ time",
                    explanation: `Rate = ${miles} miles ÷ ${hours} hours = ${rate} miles per hour`
                };
            },
            () => {
                const dollars = Math.floor(Math.random() * 50) + 10;
                const items = Math.floor(Math.random() * 10) + 2;
                const rate = (dollars / items).toFixed(2);
                return {
                    question: `If ${items} items cost $${dollars}, what is the price per item?`,
                    answer: `$${rate}`,
                    hint: "Price per item = total cost ÷ number of items",
                    explanation: `$${dollars} ÷ ${items} items = $${rate} per item`
                };
            },
            () => {
                const pages = Math.floor(Math.random() * 50) + 20;
                const minutes = Math.floor(Math.random() * 20) + 10;
                const rate = (pages / minutes).toFixed(1);
                return {
                    question: `Jordan reads ${pages} pages in ${minutes} minutes. What is his reading rate?`,
                    answer: `${rate} pages per minute`,
                    hint: "Rate = pages ÷ time",
                    explanation: `${pages} pages ÷ ${minutes} minutes = ${rate} pages per minute`
                };
            }
        ];
        
        return situations[Math.floor(Math.random() * situations.length)]();
    },
    
    // Lesson 1.4: Ratio Tables
    generateRatioTables: function() {
        const base1 = Math.floor(Math.random() * 5) + 2;
        const base2 = Math.floor(Math.random() * 5) + 3;
        const multiplier = Math.floor(Math.random() * 4) + 2;
        
        return {
            question: `Complete the ratio table: ${base1}:${base2} = ${base1*2}:${base2*2} = ${base1*multiplier}:?`,
            answer: (base2 * multiplier).toString(),
            hint: "Find the pattern - what are we multiplying by?",
            explanation: `Pattern: multiply both parts by ${multiplier}\n${base1} × ${multiplier} = ${base1*multiplier}\n${base2} × ${multiplier} = ${base2*multiplier}`
        };
    },
    
    // Lesson 1.5: Graph Ratios
    generateGraphRatios: function() {
        const ratio1 = Math.floor(Math.random() * 4) + 1;
        const ratio2 = Math.floor(Math.random() * 4) + 2;
        const x = Math.floor(Math.random() * 5) + 1;
        const y = (x * ratio2) / ratio1;
        
        return {
            question: `If the ratio of x to y is ${ratio1}:${ratio2}, and x = ${x}, what is y?`,
            answer: y.toString(),
            hint: `Set up the proportion: ${ratio1}/${ratio2} = ${x}/y`,
            explanation: `${ratio1}:${ratio2} means for every ${ratio1} x, there are ${ratio2} y\nSo ${x} × (${ratio2}/${ratio1}) = ${y}`
        };
    },
    
    // Lesson 1.6: Equivalent Ratios
    generateEquivalentRatios: function() {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 3;
        const multiplier = Math.floor(Math.random() * 4) + 2;
        const newA = a * multiplier;
        const newB = b * multiplier;
        
        const missingPart = Math.random() < 0.5 ? 'first' : 'second';
        
        if (missingPart === 'first') {
            return {
                question: `Find the missing value: ?:${newB} = ${a}:${b}`,
                answer: newA.toString(),
                hint: `What did we multiply ${b} by to get ${newB}?`,
                explanation: `${b} × ${multiplier} = ${newB}, so ${a} × ${multiplier} = ${newA}`
            };
        } else {
            return {
                question: `Find the missing value: ${newA}:? = ${a}:${b}`,
                answer: newB.toString(),
                hint: `What did we multiply ${a} by to get ${newA}?`,
                explanation: `${a} × ${multiplier} = ${newA}, so ${b} × ${multiplier} = ${newB}`
            };
        }
    },
    
    // Lesson 1.7: Unit Rates
    generateUnitRates: function() {
        const quantity = Math.floor(Math.random() * 20) + 5;
        const units = Math.floor(Math.random() * 8) + 2;
        const unitRate = (quantity / units).toFixed(2);
        
        const contexts = [
            {
                question: `Find the unit rate: $${quantity} for ${units} items`,
                answer: `$${unitRate} per item`,
                explanation: `$${quantity} ÷ ${units} = $${unitRate} per item`
            },
            {
                question: `Find the unit rate: ${quantity} miles in ${units} hours`,
                answer: `${unitRate} miles per hour`,
                explanation: `${quantity} ÷ ${units} = ${unitRate} miles per hour`
            },
            {
                question: `Find the unit rate: ${quantity} points in ${units} games`,
                answer: `${unitRate} points per game`,
                explanation: `${quantity} ÷ ${units} = ${unitRate} points per game`
            }
        ];
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        context.hint = "Divide the total by the number of units";
        return context;
    },
    
    // Helper functions
    findGCF: function(a, b) {
        return b === 0 ? a : this.findGCF(b, a % b);
    },
    
    findLCM: function(a, b) {
        return (a * b) / this.findGCF(a, b);
    },
    
    getFactors: function(n) {
        const factors = [];
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) factors.push(i);
        }
        return factors;
    },

    // Lesson 1.7: Rate Word Problems
    generateRateWordProblems: function() {
        const problems = [
            () => {
                const rate = Math.floor(Math.random() * 10) + 5;
                const hours = Math.floor(Math.random() * 6) + 2;
                const total = rate * hours;
                return {
                    question: `Jordan can read ${rate} pages per hour. How many pages can he read in ${hours} hours?`,
                    answer: `${total} pages`,
                    hint: "Multiply the rate by the time",
                    explanation: `${rate} pages/hour × ${hours} hours = ${total} pages`
                };
            },
            () => {
                const miles = Math.floor(Math.random() * 100) + 50;
                const gallons = Math.floor(Math.random() * 4) + 2;
                const mpg = miles / gallons;
                return {
                    question: `A car travels ${miles} miles on ${gallons} gallons of gas. How many miles per gallon does it get?`,
                    answer: `${mpg} mpg`,
                    hint: "Divide miles by gallons",
                    explanation: `${miles} miles ÷ ${gallons} gallons = ${mpg} miles per gallon`
                };
            },
            () => {
                const price = Math.floor(Math.random() * 8) + 2;
                const quantity = Math.floor(Math.random() * 10) + 5;
                const total = price * quantity;
                return {
                    question: `Apples cost $${price} per pound. How much do ${quantity} pounds cost?`,
                    answer: `$${total}`,
                    hint: "Multiply price per pound by number of pounds",
                    explanation: `$${price}/pound × ${quantity} pounds = $${total}`
                };
            }
        ];
        return problems[Math.floor(Math.random() * problems.length)]();
    },

    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter1']) {
            userData.lessonProgress['chapter1'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter1'];
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
