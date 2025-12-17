// operations.js - Glencoe Math Course 1, Chapter 3: Compute with Multi-Digit Numbers
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapter 3 sequence

window.OperationsGenerator = {
    // Lesson structure for sequential learning
    lessons: [
        { id: '3.1', name: 'Add and Subtract Decimals', types: ['addDecimals', 'subtractDecimals'] },
        { id: '3.2', name: 'Estimate Products', types: ['estimateProducts', 'estimateSums'] },
        { id: '3.3', name: 'Multiply Decimals', types: ['multiplyDecimals', 'multiplyWholeNumbers'] },
        { id: '3.4', name: 'Divide Multi-Digit Numbers', types: ['divideWholeNumbers'] },
        { id: '3.5', name: 'Divide Decimals', types: ['divideDecimals'] },
        { id: '3.6', name: 'Add/Subtract Fractions (Unlike Denominators)', types: ['addFractionsUnlike', 'subtractFractionsUnlike'] }
    ],

    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;
        const chapterProgress = userData.lessonProgress?.['chapter3'] || { currentLesson: 0 };
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
            case 'addDecimals':
                problem = this.generateAddDecimals();
                break;
            case 'subtractDecimals':
                problem = this.generateSubtractDecimals();
                break;
            case 'multiplyWholeNumbers':
                problem = this.generateMultiplyWholeNumbers();
                break;
            case 'divideWholeNumbers':
                problem = this.generateDivideWholeNumbers();
                break;
            case 'multiplyDecimals':
                problem = this.generateMultiplyDecimals();
                break;
            case 'divideDecimals':
                problem = this.generateDivideDecimals();
                break;
            case 'estimateProducts':
                problem = this.generateEstimateProducts();
                break;
            case 'estimateSums':
                problem = this.generateEstimateSums();
                break;
            case 'addFractionsUnlike':
                problem = this.generateAddFractionsUnlike();
                break;
            case 'subtractFractionsUnlike':
                problem = this.generateSubtractFractionsUnlike();
                break;
            default:
                problem = this.generateDivideWholeNumbers();
        }

        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
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
    },

    // Lesson 3.6: Add Fractions with Unlike Denominators
    generateAddFractionsUnlike: function() {
        const denominators = [2, 3, 4, 5, 6, 8, 10];
        const d1 = denominators[Math.floor(Math.random() * denominators.length)];
        let d2 = denominators[Math.floor(Math.random() * denominators.length)];
        while (d2 === d1) d2 = denominators[Math.floor(Math.random() * denominators.length)];

        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;

        // Find LCD
        const lcd = this.findLCM(d1, d2);
        const result_n = (n1 * lcd / d1) + (n2 * lcd / d2);
        const result_d = lcd;

        // Simplify
        const g = this.findGCF(result_n, result_d);
        const final_n = result_n / g;
        const final_d = result_d / g;

        return {
            question: `Add: ${n1}/${d1} + ${n2}/${d2}`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Find a common denominator: ${lcd}\nConvert: ${n1}/${d1} = ${n1 * lcd / d1}/${lcd} and ${n2}/${d2} = ${n2 * lcd / d2}/${lcd}`,
            explanation: `${n1}/${d1} + ${n2}/${d2} = ${n1 * lcd / d1}/${lcd} + ${n2 * lcd / d2}/${lcd} = ${result_n}/${result_d} = ${final_n}/${final_d}`
        };
    },

    // Lesson 3.6: Subtract Fractions with Unlike Denominators
    generateSubtractFractionsUnlike: function() {
        const denominators = [2, 3, 4, 5, 6, 8];
        const d1 = denominators[Math.floor(Math.random() * denominators.length)];
        let d2 = denominators[Math.floor(Math.random() * denominators.length)];
        while (d2 === d1) d2 = denominators[Math.floor(Math.random() * denominators.length)];

        let n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        let n2 = Math.floor(Math.random() * (d2 - 1)) + 1;

        // Ensure first fraction is larger
        if ((n1 / d1) < (n2 / d2)) {
            [n1, n2, d1, d2] = [n2, n1, d2, d1];
        }

        const lcd = this.findLCM(d1, d2);
        const result_n = (n1 * lcd / d1) - (n2 * lcd / d2);
        const result_d = lcd;

        const g = this.findGCF(Math.abs(result_n), result_d);
        const final_n = result_n / g;
        const final_d = result_d / g;

        return {
            question: `Subtract: ${n1}/${d1} - ${n2}/${d2}`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Find a common denominator: ${lcd}`,
            explanation: `${n1}/${d1} - ${n2}/${d2} = ${n1 * lcd / d1}/${lcd} - ${n2 * lcd / d2}/${lcd} = ${result_n}/${result_d} = ${final_n}/${final_d}`
        };
    },

    // Helper functions
    findGCF: function(a, b) {
        return b === 0 ? a : this.findGCF(b, a % b);
    },

    findLCM: function(a, b) {
        return (a * b) / this.findGCF(a, b);
    },

    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter3']) {
            userData.lessonProgress['chapter3'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter3'];
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
