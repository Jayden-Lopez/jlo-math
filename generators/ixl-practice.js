// ixl-practice.js - Targeted Practice Based on IXL Feedback
// Open practice area for working on specific deficient skills

window.IXLPracticeGenerator = {
    // Skill categories based on common IXL areas
    skillCategories: {
        'division-basic': {
            name: 'Basic Division (2-digit ÷ 1-digit)',
            description: 'Master simple division facts',
            weight: 1.0
        },
        'division-intermediate': {
            name: 'Intermediate Division (3-digit ÷ 1-digit)',
            description: 'Build confidence with larger numbers',
            weight: 1.0
        },
        'division-advanced': {
            name: 'Advanced Division (4-digit ÷ 1-digit)',
            description: 'Challenge yourself with complex division',
            weight: 1.0
        },
        'division-with-remainders': {
            name: 'Division with Remainders',
            description: 'Practice problems that have remainders',
            weight: 1.0
        },
        'multiplication-facts': {
            name: 'Multiplication Facts (1-12)',
            description: 'Speed up with multiplication tables',
            weight: 1.0
        },
        'decimal-operations': {
            name: 'Decimal Addition & Subtraction',
            description: 'Work with decimal numbers',
            weight: 1.0
        },
        'fraction-basics': {
            name: 'Basic Fractions',
            description: 'Understand fraction concepts',
            weight: 1.0
        },
        'place-value': {
            name: 'Place Value',
            description: 'Understand digits and their values',
            weight: 1.0
        }
    },

    // Select a random skill area or use a specified one
    generate: function(skillKey = null) {
        if (!skillKey) {
            // Random selection from all skills
            const skills = Object.keys(this.skillCategories);
            skillKey = skills[Math.floor(Math.random() * skills.length)];
        }

        // Generate a problem based on the skill
        switch(skillKey) {
            case 'division-basic':
                return this.generateDivisionBasic();
            case 'division-intermediate':
                return this.generateDivisionIntermediate();
            case 'division-advanced':
                return this.generateDivisionAdvanced();
            case 'division-with-remainders':
                return this.generateDivisionWithRemainders();
            case 'multiplication-facts':
                return this.generateMultiplicationFacts();
            case 'decimal-operations':
                return this.generateDecimalOperations();
            case 'fraction-basics':
                return this.generateFractionBasics();
            case 'place-value':
                return this.generatePlaceValue();
            default:
                return this.generateDivisionBasic();
        }
    },

    // Division Practice - Basic Level
    generateDivisionBasic: function() {
        const divisor = Math.floor(Math.random() * 7) + 2; // 2-8
        const quotient = Math.floor(Math.random() * 9) + 2; // 2-10
        const remainder = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
        const dividend = divisor * quotient + remainder;

        return {
            question: `Divide: ${dividend} ÷ ${divisor}`,
            answer: remainder > 0 ? `${quotient} R${remainder}` : quotient.toString(),
            hint: `Think: How many groups of ${divisor} can you make from ${dividend}?`,
            explanation: `${divisor} × ${quotient} = ${divisor * quotient}${remainder > 0 ? `\nLeftover: ${remainder}` : ''}\nAnswer: ${quotient}${remainder > 0 ? ' R' + remainder : ''}`,
            skillArea: 'Basic Division'
        };
    },

    // Division Practice - Intermediate Level
    generateDivisionIntermediate: function() {
        const divisor = Math.floor(Math.random() * 7) + 2; // 2-8
        const quotient = Math.floor(Math.random() * 90) + 10; // 10-99
        const remainder = Math.random() > 0.5 ? Math.floor(Math.random() * divisor) : 0;
        const dividend = divisor * quotient + remainder;

        return {
            question: `Divide: ${dividend} ÷ ${divisor}`,
            answer: remainder > 0 ? `${quotient} R${remainder}` : quotient.toString(),
            hint: `Break it down: Start with the hundreds digit, then work through tens and ones.`,
            explanation: `${divisor} × ${quotient} = ${divisor * quotient}${remainder > 0 ? `\nLeftover: ${remainder}` : ''}\nAnswer: ${quotient}${remainder > 0 ? ' R' + remainder : ''}`,
            skillArea: 'Intermediate Division'
        };
    },

    // Division Practice - Advanced Level
    generateDivisionAdvanced: function() {
        const divisor = Math.floor(Math.random() * 9) + 2; // 2-10
        const quotient = Math.floor(Math.random() * 500) + 100; // 100-599
        const remainder = Math.random() > 0.5 ? Math.floor(Math.random() * divisor) : 0;
        const dividend = divisor * quotient + remainder;

        return {
            question: `Divide: ${dividend} ÷ ${divisor}`,
            answer: remainder > 0 ? `${quotient} R${remainder}` : quotient.toString(),
            hint: `Work carefully through each digit. Use estimation to check your answer makes sense.`,
            explanation: `${divisor} × ${quotient} = ${divisor * quotient}${remainder > 0 ? `\nLeftover: ${remainder}` : ''}\nAnswer: ${quotient}${remainder > 0 ? ' R' + remainder : ''}`,
            skillArea: 'Advanced Division'
        };
    },

    // Division with Remainders Focus
    generateDivisionWithRemainders: function() {
        const divisor = Math.floor(Math.random() * 8) + 2; // 2-9
        const quotient = Math.floor(Math.random() * 50) + 5; // 5-54
        // Always has a remainder
        const remainder = Math.floor(Math.random() * (divisor - 1)) + 1; // 1 to divisor-1
        const dividend = divisor * quotient + remainder;

        return {
            question: `Divide: ${dividend} ÷ ${divisor}\n(This problem has a remainder!)`,
            answer: `${quotient} R${remainder}`,
            hint: `Multiply ${divisor} by different numbers to find the closest product less than ${dividend}.`,
            explanation: `${divisor} × ${quotient} = ${divisor * quotient}\n${dividend} - ${divisor * quotient} = ${remainder}\nAnswer: ${quotient} R${remainder}`,
            skillArea: 'Division with Remainders'
        };
    },

    // Multiplication Facts (1-12)
    generateMultiplicationFacts: function() {
        const a = Math.floor(Math.random() * 12) + 1; // 1-12
        const b = Math.floor(Math.random() * 12) + 1; // 1-12
        const product = a * b;

        return {
            question: `Multiply: ${a} × ${b}`,
            answer: product.toString(),
            hint: `Try skip counting by ${a}, ${b} times. Or use what you know about ${a} and ${b}.`,
            explanation: `${a} × ${b} = ${product}`,
            skillArea: 'Multiplication Facts'
        };
    },

    // Decimal Operations
    generateDecimalOperations: function() {
        const operation = Math.random() > 0.5 ? 'add' : 'subtract';

        if (operation === 'add') {
            const a = (Math.random() * 50).toFixed(2);
            const b = (Math.random() * 50).toFixed(2);
            const sum = (parseFloat(a) + parseFloat(b)).toFixed(2);

            return {
                question: `Add: ${a} + ${b}`,
                answer: sum,
                hint: "Line up the decimal points, then add like whole numbers.",
                explanation: `  ${a}\n+ ${b}\n-------\n  ${sum}`,
                skillArea: 'Decimal Operations'
            };
        } else {
            const a = (Math.random() * 50 + 25).toFixed(2);
            const b = (Math.random() * 25).toFixed(2);
            const diff = (parseFloat(a) - parseFloat(b)).toFixed(2);

            return {
                question: `Subtract: ${a} - ${b}`,
                answer: diff,
                hint: "Line up the decimal points, then subtract like whole numbers.",
                explanation: `  ${a}\n- ${b}\n-------\n  ${diff}`,
                skillArea: 'Decimal Operations'
            };
        }
    },

    // Fraction Basics
    generateFractionBasics: function() {
        const types = ['simplify', 'compare', 'equivalent'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'simplify') {
            const gcd = Math.floor(Math.random() * 4) + 2; // 2-5
            const num = gcd * (Math.floor(Math.random() * 5) + 2); // multiple of gcd
            const den = gcd * (Math.floor(Math.random() * 5) + 3); // multiple of gcd
            const simplifiedNum = num / gcd;
            const simplifiedDen = den / gcd;

            return {
                question: `Simplify: ${num}/${den}`,
                answer: `${simplifiedNum}/${simplifiedDen}`,
                hint: `Find the greatest common factor of ${num} and ${den}.`,
                explanation: `Both ${num} and ${den} are divisible by ${gcd}\n${num} ÷ ${gcd} = ${simplifiedNum}\n${den} ÷ ${gcd} = ${simplifiedDen}\nAnswer: ${simplifiedNum}/${simplifiedDen}`,
                skillArea: 'Fraction Basics'
            };
        } else if (type === 'compare') {
            const num1 = Math.floor(Math.random() * 7) + 1;
            const den1 = Math.floor(Math.random() * 5) + num1 + 1;
            const num2 = Math.floor(Math.random() * 7) + 1;
            const den2 = Math.floor(Math.random() * 5) + num2 + 1;

            const val1 = num1 / den1;
            const val2 = num2 / den2;
            const symbol = val1 > val2 ? '>' : val1 < val2 ? '<' : '=';

            return {
                question: `Compare: ${num1}/${den1} ___ ${num2}/${den2}\n(Use <, >, or =)`,
                answer: symbol,
                hint: 'Convert to decimals or find a common denominator to compare.',
                explanation: `${num1}/${den1} ≈ ${val1.toFixed(3)}\n${num2}/${den2} ≈ ${val2.toFixed(3)}\nAnswer: ${symbol}`,
                skillArea: 'Fraction Basics'
            };
        } else {
            // Equivalent fractions
            const num = Math.floor(Math.random() * 8) + 1;
            const den = Math.floor(Math.random() * 8) + num + 1;
            const multiplier = Math.floor(Math.random() * 4) + 2;
            const newNum = num * multiplier;

            return {
                question: `Find the missing number: ${num}/${den} = ${newNum}/?`,
                answer: (den * multiplier).toString(),
                hint: `${num} was multiplied by ${multiplier} to get ${newNum}. What should you multiply ${den} by?`,
                explanation: `Multiply both numerator and denominator by ${multiplier}:\n${num} × ${multiplier} = ${newNum}\n${den} × ${multiplier} = ${den * multiplier}\nAnswer: ${den * multiplier}`,
                skillArea: 'Fraction Basics'
            };
        }
    },

    // Place Value
    generatePlaceValue: function() {
        const types = ['identify', 'round', 'expand'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'identify') {
            const number = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
            const digits = number.toString().split('').reverse();
            const place = ['ones', 'tens', 'hundreds', 'thousands'][Math.floor(Math.random() * 4)];
            const placeMap = { ones: 0, tens: 1, hundreds: 2, thousands: 3 };
            const digit = digits[placeMap[place]];

            return {
                question: `What digit is in the ${place} place in ${number}?`,
                answer: digit,
                hint: `The ${place} place is ${['1st', '2nd', '3rd', '4th'][placeMap[place]]} from the right.`,
                explanation: `${number} = ${digits[3]}${digits[2]}${digits[1]}${digits[0]}\nThe ${place} place contains: ${digit}`,
                skillArea: 'Place Value'
            };
        } else if (type === 'round') {
            const number = Math.floor(Math.random() * 900) + 100; // 100-999
            const rounded = Math.round(number / 10) * 10;

            return {
                question: `Round ${number} to the nearest ten.`,
                answer: rounded.toString(),
                hint: 'Look at the ones digit. If it\'s 5 or more, round up. Otherwise, round down.',
                explanation: `The ones digit in ${number} is ${number % 10}\n${number % 10 >= 5 ? 'Round up' : 'Round down'} to ${rounded}`,
                skillArea: 'Place Value'
            };
        } else {
            // Expanded form
            const number = Math.floor(Math.random() * 900) + 100; // 100-999
            const hundreds = Math.floor(number / 100) * 100;
            const tens = Math.floor((number % 100) / 10) * 10;
            const ones = number % 10;
            const expanded = [];
            if (hundreds > 0) expanded.push(hundreds);
            if (tens > 0) expanded.push(tens);
            if (ones > 0) expanded.push(ones);

            return {
                question: `Write ${number} in expanded form.\n(Example: 325 = 300 + 20 + 5)`,
                answer: expanded.join(' + '),
                hint: 'Break the number into hundreds, tens, and ones.',
                explanation: `${number} = ${expanded.join(' + ')}`,
                skillArea: 'Place Value'
            };
        }
    }
};
