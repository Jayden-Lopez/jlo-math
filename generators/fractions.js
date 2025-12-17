// generators/fractions.js
// Glencoe Math Course 1, Chapter 4: Multiply and Divide Fractions
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapter 4 sequence

window.FractionsGenerator = {
    // Lesson structure for sequential learning
    lessons: [
        { id: '4.1', name: 'Estimate Products of Fractions', types: ['estimateProducts'] },
        { id: '4.2', name: 'Multiply Fractions', types: ['multiply'] },
        { id: '4.3', name: 'Simplify Before Multiplying', types: ['simplifyBeforeMultiply'] },
        { id: '4.4', name: 'Multiply Mixed Numbers', types: ['multiplyMixed'] },
        { id: '4.5', name: 'Divide Whole Numbers by Fractions', types: ['divideWholeByFraction'] },
        { id: '4.6', name: 'Divide Fractions', types: ['divide'] },
        { id: '4.7', name: 'Divide Mixed Numbers', types: ['divideMixed'] }
    ],

    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;
        const chapterProgress = userData.lessonProgress?.['chapter4'] || { currentLesson: 0 };
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
            case 'estimateProducts':
                problem = this.generateEstimateProducts();
                break;
            case 'multiply':
                problem = this.generateMultiplication();
                break;
            case 'simplifyBeforeMultiply':
                problem = this.generateSimplifyBeforeMultiply();
                break;
            case 'multiplyMixed':
                problem = this.generateMultiplyMixed();
                break;
            case 'divideWholeByFraction':
                problem = this.generateDivideWholeByFraction();
                break;
            case 'divide':
                problem = this.generateDivision();
                break;
            case 'divideMixed':
                problem = this.generateDivideMixed();
                break;
            default:
                problem = this.generateMultiplication();
        }

        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
    },

    // Lesson 4.1: Estimate Products of Fractions
    generateEstimateProducts: function() {
        const fractions = [
            { frac: '1/8', estimate: 0 },
            { frac: '1/6', estimate: 0 },
            { frac: '1/4', estimate: 0 },
            { frac: '1/3', estimate: 0.5 },
            { frac: '3/8', estimate: 0.5 },
            { frac: '2/5', estimate: 0.5 },
            { frac: '1/2', estimate: 0.5 },
            { frac: '5/8', estimate: 0.5 },
            { frac: '2/3', estimate: 0.5 },
            { frac: '3/4', estimate: 1 },
            { frac: '7/8', estimate: 1 },
            { frac: '9/10', estimate: 1 }
        ];

        const f1 = fractions[Math.floor(Math.random() * fractions.length)];
        const whole = Math.floor(Math.random() * 20) + 10;

        // Round fraction to 0, 1/2, or 1
        let estimateStr;
        if (f1.estimate === 0) estimateStr = '0';
        else if (f1.estimate === 0.5) estimateStr = '1/2';
        else estimateStr = '1';

        const estimated = Math.round(whole * f1.estimate);

        return {
            question: `Estimate: ${f1.frac} × ${whole}\n(Round the fraction to 0, 1/2, or 1)`,
            answer: estimated.toString(),
            hint: `${f1.frac} is closest to ${estimateStr}. Then multiply ${estimateStr} × ${whole}`,
            explanation: `${f1.frac} ≈ ${estimateStr}, so ${estimateStr} × ${whole} ≈ ${estimated}`
        };
    },
    
    generateAddition: function() {
        const denominators = [2, 3, 4, 5, 6, 8, 10];
        const d1 = denominators[Math.floor(Math.random() * denominators.length)];
        const d2 = denominators[Math.floor(Math.random() * denominators.length)];
        const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
        const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
        
        // Find LCD using global lcm function
        const lcd = lcm(d1, d2);
        const result_n = (n1 * lcd / d1) + (n2 * lcd / d2);
        const result_d = lcd;
        
        // Simplify result using global gcd function
        const g = gcd(result_n, result_d);
        const final_n = result_n / g;
        const final_d = result_d / g;
        
        return {
            question: `What is ${n1}/${d1} + ${n2}/${d2}?`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Step 1: Look at the bottom numbers (denominators): ${d1} and ${d2}
Step 2: Find a common denominator. Try ${lcd}
Step 3: Convert the fractions: ${n1}/${d1} = ${n1 * lcd / d1}/${lcd}
Step 4: Convert the second: ${n2}/${d2} = ${n2 * lcd / d2}/${lcd}
Step 5: Add the top numbers: ${n1 * lcd / d1} + ${n2 * lcd / d2} = ${result_n}
Step 6: Keep the bottom: ${result_n}/${result_d}
Step 7: Simplify if you can: ${final_n}/${final_d}`,
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
        const lcd = lcm(d1, d2);
        
        if (v1 >= v2) {
            result_n = (n1 * lcd / d1) - (n2 * lcd / d2);
            result_d = lcd;
            question = `What is ${n1}/${d1} - ${n2}/${d2}?`;
        } else {
            result_n = (n2 * lcd / d2) - (n1 * lcd / d1);
            result_d = lcd;
            question = `What is ${n2}/${d2} - ${n1}/${d1}?`;
        }
        
        const g = gcd(result_n, result_d);
        const final_n = result_n / g;
        const final_d = result_d / g;
        
        return {
            question: question,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Step 1: Find a common denominator: ${lcd}
Step 2: Convert both fractions to have denominator ${lcd}
Step 3: Subtract the top numbers only
Step 4: Keep the bottom number the same
Step 5: Simplify your answer if possible`,
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
        
        const g = gcd(result_n, result_d);
        const final_n = result_n / g;
        const final_d = result_d / g;
        
        return {
            question: `What is ${n1}/${d1} × ${n2}/${d2}?`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Step 1: Multiply the top numbers: ${n1} × ${n2} = ${result_n}
Step 2: Multiply the bottom numbers: ${d1} × ${d2} = ${result_d}
Step 3: Write as a fraction: ${result_n}/${result_d}
Step 4: Simplify if you can: ${final_n}/${final_d}`,
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
        
        const lcd = lcm(d1, d2);
        
        return {
            question: `Which is larger: ${n1}/${d1} or ${n2}/${d2}?`,
            options: options,
            correct: correct,
            hint: `Step 1: Make the bottoms the same (use ${lcd})
Step 2: ${n1}/${d1} becomes ${n1 * lcd / d1}/${lcd}
Step 3: ${n2}/${d2} becomes ${n2 * lcd / d2}/${lcd}
Step 4: Now compare ${n1 * lcd / d1}/${lcd} and ${n2 * lcd / d2}/${lcd}
Step 5: The one with the bigger top number is larger!`,
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

        const g = gcd(n, d);
        const final_n = n / g;
        const final_d = d / g;

        return {
            question: `Simplify ${n}/${d}`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Step 1: Find a number that divides both ${n} and ${d}
Step 2: Try small numbers first: 2, 3, 4, 5...
Step 3: ${g} goes into both!
Step 4: ${n} ÷ ${g} = ${final_n}
Step 5: ${d} ÷ ${g} = ${final_d}
Step 6: Your answer is ${final_n}/${final_d}`,
            explanation: `Both ${n} and ${d} can be divided by ${g}. ${n} ÷ ${g} = ${final_n}, ${d} ÷ ${g} = ${final_d}`
        };
    },

    generateDivideWholeByFraction: function() {
        // Divide whole numbers by fractions (Lesson 4.5)
        const wholeNums = [2, 3, 4, 5, 6, 8, 10, 12];
        const whole = wholeNums[Math.floor(Math.random() * wholeNums.length)];

        const denominators = [2, 3, 4, 5, 6, 8];
        const d = denominators[Math.floor(Math.random() * denominators.length)];
        const n = Math.floor(Math.random() * (d - 1)) + 1;

        // To divide by a fraction, multiply by its reciprocal
        // whole ÷ (n/d) = whole × (d/n)
        const result_n = whole * d;
        const result_d = n;

        const g = gcd(result_n, result_d);
        const final_n = result_n / g;
        const final_d = result_d / g;

        // Convert to mixed number if improper
        let answerDisplay;
        if (final_d === 1) {
            answerDisplay = `${final_n}`;
        } else if (final_n > final_d) {
            const wholepart = Math.floor(final_n / final_d);
            const remainder = final_n % final_d;
            answerDisplay = remainder === 0 ? `${wholepart}` : `${wholepart} ${remainder}/${final_d}`;
        } else {
            answerDisplay = `${final_n}/${final_d}`;
        }

        return {
            question: `What is ${whole} ÷ ${n}/${d}?`,
            answer: answerDisplay,
            hint: `Step 1: Remember, dividing by a fraction is the same as multiplying by its reciprocal
Step 2: The reciprocal of ${n}/${d} is ${d}/${n} (flip the fraction!)
Step 3: Change the problem to: ${whole} × ${d}/${n}
Step 4: Multiply: ${whole} × ${d} = ${whole * d}
Step 5: Put it over the denominator: ${whole * d}/${n}
Step 6: Simplify if needed: ${answerDisplay}`,
            explanation: `${whole} ÷ ${n}/${d} = ${whole} × ${d}/${n} = ${whole * d}/${n} = ${answerDisplay}`
        };
    },

    generateDivision: function() {
        // Divide fractions by fractions
        const nums = [1, 2, 3, 4];
        const denoms = [2, 3, 4, 5, 6, 8];

        const n1 = nums[Math.floor(Math.random() * nums.length)];
        const d1 = denoms[Math.floor(Math.random() * denoms.length)];
        const n2 = nums[Math.floor(Math.random() * nums.length)];
        const d2 = denoms[Math.floor(Math.random() * denoms.length)];

        // (n1/d1) ÷ (n2/d2) = (n1/d1) × (d2/n2) = (n1 × d2) / (d1 × n2)
        const result_n = n1 * d2;
        const result_d = d1 * n2;

        const g = gcd(result_n, result_d);
        const final_n = result_n / g;
        const final_d = result_d / g;

        return {
            question: `What is ${n1}/${d1} ÷ ${n2}/${d2}?`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Step 1: Keep the first fraction: ${n1}/${d1}
Step 2: Flip the second fraction: ${n2}/${d2} becomes ${d2}/${n2}
Step 3: Change ÷ to ×: ${n1}/${d1} × ${d2}/${n2}
Step 4: Multiply across: (${n1} × ${d2}) / (${d1} × ${n2})
Step 5: That's ${result_n}/${result_d}
Step 6: Simplify: ${final_n}/${final_d}`,
            explanation: `${n1}/${d1} ÷ ${n2}/${d2} = ${n1}/${d1} × ${d2}/${n2} = ${result_n}/${result_d} = ${final_n}/${final_d}`
        };
    },

    // Lesson 4.3: Simplify Before Multiplying
    generateSimplifyBeforeMultiply: function() {
        // Create fractions where cross-cancellation is possible
        const pairs = [
            { n1: 2, d1: 3, n2: 3, d2: 4 },  // 3 cancels
            { n1: 3, d1: 4, n2: 2, d2: 3 },  // 3 cancels
            { n1: 4, d1: 5, n2: 5, d2: 6 },  // 5 cancels
            { n1: 2, d1: 5, n2: 5, d2: 8 },  // 5 cancels
            { n1: 3, d1: 8, n2: 4, d2: 9 },  // No cancellation but still works
            { n1: 6, d1: 7, n2: 7, d2: 8 }   // 7 cancels
        ];

        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        const result_n = pair.n1 * pair.n2;
        const result_d = pair.d1 * pair.d2;

        const g = gcd(result_n, result_d);
        const final_n = result_n / g;
        const final_d = result_d / g;

        return {
            question: `Multiply (simplify first if possible): ${pair.n1}/${pair.d1} × ${pair.n2}/${pair.d2}`,
            answer: final_d === 1 ? `${final_n}` : `${final_n}/${final_d}`,
            hint: `Look for numbers that can cancel diagonally before multiplying`,
            explanation: `${pair.n1}/${pair.d1} × ${pair.n2}/${pair.d2} = ${result_n}/${result_d} = ${final_n}/${final_d}`
        };
    },

    // Lesson 4.4: Multiply Mixed Numbers
    generateMultiplyMixed: function() {
        const whole1 = Math.floor(Math.random() * 3) + 1;
        const n1 = Math.floor(Math.random() * 3) + 1;
        const d1 = Math.floor(Math.random() * 3) + 2;

        const whole2 = Math.floor(Math.random() * 2) + 1;
        const n2 = Math.floor(Math.random() * 3) + 1;
        const d2 = Math.floor(Math.random() * 3) + 2;

        // Convert to improper fractions
        const improper1_n = whole1 * d1 + n1;
        const improper2_n = whole2 * d2 + n2;

        // Multiply
        const result_n = improper1_n * improper2_n;
        const result_d = d1 * d2;

        // Simplify
        const g = gcd(result_n, result_d);
        const simplified_n = result_n / g;
        const simplified_d = result_d / g;

        // Convert to mixed number
        const finalWhole = Math.floor(simplified_n / simplified_d);
        const finalNum = simplified_n % simplified_d;

        let answer;
        if (finalNum === 0) {
            answer = `${finalWhole}`;
        } else if (finalWhole === 0) {
            answer = `${simplified_n}/${simplified_d}`;
        } else {
            answer = `${finalWhole} ${finalNum}/${simplified_d}`;
        }

        return {
            question: `Multiply: ${whole1} ${n1}/${d1} × ${whole2} ${n2}/${d2}`,
            answer: answer,
            hint: `Step 1: Convert to improper fractions: ${improper1_n}/${d1} × ${improper2_n}/${d2}
Step 2: Multiply across
Step 3: Convert back to mixed number`,
            explanation: `${whole1} ${n1}/${d1} = ${improper1_n}/${d1}, ${whole2} ${n2}/${d2} = ${improper2_n}/${d2}
${improper1_n}/${d1} × ${improper2_n}/${d2} = ${result_n}/${result_d} = ${answer}`
        };
    },

    // Lesson 4.7: Divide Mixed Numbers
    generateDivideMixed: function() {
        const whole1 = Math.floor(Math.random() * 3) + 2;
        const n1 = Math.floor(Math.random() * 3) + 1;
        const d1 = Math.floor(Math.random() * 3) + 2;

        const whole2 = Math.floor(Math.random() * 2) + 1;
        const n2 = Math.floor(Math.random() * 3) + 1;
        const d2 = Math.floor(Math.random() * 3) + 2;

        // Convert to improper fractions
        const improper1_n = whole1 * d1 + n1;
        const improper2_n = whole2 * d2 + n2;

        // Divide by multiplying by reciprocal
        const result_n = improper1_n * d2;
        const result_d = d1 * improper2_n;

        // Simplify
        const g = gcd(result_n, result_d);
        const simplified_n = result_n / g;
        const simplified_d = result_d / g;

        // Convert to mixed number if needed
        const finalWhole = Math.floor(simplified_n / simplified_d);
        const finalNum = simplified_n % simplified_d;

        let answer;
        if (finalNum === 0) {
            answer = `${finalWhole}`;
        } else if (finalWhole === 0) {
            answer = `${simplified_n}/${simplified_d}`;
        } else {
            answer = `${finalWhole} ${finalNum}/${simplified_d}`;
        }

        return {
            question: `Divide: ${whole1} ${n1}/${d1} ÷ ${whole2} ${n2}/${d2}`,
            answer: answer,
            hint: `Step 1: Convert to improper fractions
Step 2: Flip the second fraction (reciprocal)
Step 3: Change ÷ to × and multiply`,
            explanation: `${whole1} ${n1}/${d1} = ${improper1_n}/${d1}, ${whole2} ${n2}/${d2} = ${improper2_n}/${d2}
${improper1_n}/${d1} ÷ ${improper2_n}/${d2} = ${improper1_n}/${d1} × ${d2}/${improper2_n} = ${answer}`
        };
    },

    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter4']) {
            userData.lessonProgress['chapter4'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter4'];
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
