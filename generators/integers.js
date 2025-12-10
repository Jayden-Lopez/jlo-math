// integers.js - Glencoe Math Course 1, Chapter 5: Integers and the Coordinate Plane
// For Jordan - 6th grade

window.IntegersGenerator = {
    generate: function() {
        const lessonTypes = [
            'opposites',
            'absoluteValue',
            'compareIntegers',
            'orderIntegers',
            'addIntegers',
            'subtractIntegers',
            'coordinatePlane',
            'distance'
        ];
        
        const type = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
        
        switch(type) {
            case 'opposites':
                return this.generateOpposites();
            case 'absoluteValue':
                return this.generateAbsoluteValue();
            case 'compareIntegers':
                return this.generateCompareIntegers();
            case 'orderIntegers':
                return this.generateOrderIntegers();
            case 'addIntegers':
                return this.generateAddIntegers();
            case 'subtractIntegers':
                return this.generateSubtractIntegers();
            case 'coordinatePlane':
                return this.generateCoordinatePlane();
            case 'distance':
                return this.generateDistance();
            default:
                return this.generateAbsoluteValue();
        }
    },
    
    // Lesson 5.1: Integers and Opposites
    generateOpposites: function() {
        const num = Math.floor(Math.random() * 21) - 10;
        const opposite = -num;
        
        return {
            question: `What is the opposite of ${num}?`,
            answer: opposite.toString(),
            hint: "The opposite has the same distance from zero but different sign",
            explanation: `The opposite of ${num} is ${opposite}`
        };
    },
    
    // Lesson 5.2: Absolute Value
    generateAbsoluteValue: function() {
        const num = Math.floor(Math.random() * 21) - 10;
        const absValue = Math.abs(num);
        
        return {
            question: `What is |${num}|?`,
            answer: absValue.toString(),
            hint: "Absolute value is the distance from zero (always positive)",
            explanation: `|${num}| = ${absValue} (${absValue} units from 0)`
        };
    },
    
    // Lesson 5.3: Compare Integers
    generateCompareIntegers: function() {
        const num1 = Math.floor(Math.random() * 21) - 10;
        const num2 = Math.floor(Math.random() * 21) - 10;
        
        if (num1 === num2) {
            return this.generateCompareIntegers(); // Regenerate if equal
        }
        
        const symbol = num1 > num2 ? ">" : "<";
        
        return {
            question: `Compare: ${num1} ___ ${num2}`,
            answer: symbol,
            options: [">", "<", "="],
            correct: [">", "<", "="].indexOf(symbol),
            hint: "On a number line, numbers to the right are greater",
            explanation: `${num1} ${symbol} ${num2} because ${num1} is ${symbol === ">" ? "greater than" : "less than"} ${num2}`
        };
    },
    
    // Lesson 5.4: Order Integers
    generateOrderIntegers: function() {
        const nums = [
            Math.floor(Math.random() * 21) - 10,
            Math.floor(Math.random() * 21) - 10,
            Math.floor(Math.random() * 21) - 10,
            Math.floor(Math.random() * 21) - 10
        ];
        
        // Shuffle for the question
        const shuffled = [...nums].sort(() => Math.random() - 0.5);
        // Sort for the answer
        const sorted = [...nums].sort((a, b) => a - b);
        
        return {
            question: `Order from least to greatest: ${shuffled.join(", ")}`,
            answer: sorted.join(", "),
            hint: "Remember: negative numbers are less than positive numbers",
            explanation: `On a number line from left to right: ${sorted.join(", ")}`
        };
    },
    
    // Lesson 5.5: Add Integers
    generateAddIntegers: function() {
        const num1 = Math.floor(Math.random() * 21) - 10;
        const num2 = Math.floor(Math.random() * 21) - 10;
        const sum = num1 + num2;
        
        return {
            question: `Add: ${num1} + ${num2}`,
            answer: sum.toString(),
            hint: num1 * num2 > 0 ? "Same signs: add and keep the sign" : "Different signs: subtract and use sign of larger absolute value",
            explanation: `${num1} + ${num2} = ${sum}`
        };
    },
    
    // Lesson 5.6: Subtract Integers
    generateSubtractIntegers: function() {
        const num1 = Math.floor(Math.random() * 21) - 10;
        const num2 = Math.floor(Math.random() * 21) - 10;
        const diff = num1 - num2;
        
        return {
            question: `Subtract: ${num1} - ${num2}`,
            answer: diff.toString(),
            hint: "Subtracting is the same as adding the opposite",
            explanation: `${num1} - ${num2} = ${num1} + (${-num2}) = ${diff}`
        };
    },
    
    // Lesson 5.7: The Coordinate Plane
    generateCoordinatePlane: function() {
        const x = Math.floor(Math.random() * 11) - 5;
        const y = Math.floor(Math.random() * 11) - 5;
        
        let quadrant;
        if (x > 0 && y > 0) quadrant = "I";
        else if (x < 0 && y > 0) quadrant = "II";
        else if (x < 0 && y < 0) quadrant = "III";
        else if (x > 0 && y < 0) quadrant = "IV";
        else if (x === 0 && y !== 0) quadrant = "y-axis";
        else if (x !== 0 && y === 0) quadrant = "x-axis";
        else quadrant = "origin";
        
        return {
            question: `In which quadrant or axis is the point (${x}, ${y})?`,
            answer: quadrant.includes("Quadrant") ? quadrant : (quadrant === "origin" ? "Origin" : `On the ${quadrant}`),
            hint: "Check the signs: (+,+)=I, (-,+)=II, (-,-)=III, (+,-)=IV",
            explanation: `(${x}, ${y}): x is ${x >= 0 ? "positive" : "negative"}, y is ${y >= 0 ? "positive" : "negative"}, so ${quadrant.includes("Quadrant") ? quadrant : quadrant}`
        };
    },
    
    // Lesson 5.8: Distance on the Coordinate Plane
    generateDistance: function() {
        const types = ['horizontal', 'vertical'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'horizontal') {
            const y = Math.floor(Math.random() * 11) - 5;
            const x1 = Math.floor(Math.random() * 11) - 5;
            const x2 = Math.floor(Math.random() * 11) - 5;
            const distance = Math.abs(x2 - x1);

            // Regenerate if points are the same (distance would be 0)
            if (distance === 0) {
                return this.generateDistance();
            }

            return {
                question: `Find the distance between points (${x1}, ${y}) and (${x2}, ${y})`,
                answer: `${distance} units`,
                hint: "Same y-coordinate means horizontal line, find |x₂ - x₁|",
                explanation: `Distance = |${x2} - ${x1}| = ${distance} units`
            };
        } else {
            const x = Math.floor(Math.random() * 11) - 5;
            const y1 = Math.floor(Math.random() * 11) - 5;
            const y2 = Math.floor(Math.random() * 11) - 5;
            const distance = Math.abs(y2 - y1);

            // Regenerate if points are the same (distance would be 0)
            if (distance === 0) {
                return this.generateDistance();
            }

            return {
                question: `Find the distance between points (${x}, ${y1}) and (${x}, ${y2})`,
                answer: `${distance} units`,
                hint: "Same x-coordinate means vertical line, find |y₂ - y₁|",
                explanation: `Distance = |${y2} - ${y1}| = ${distance} units`
            };
        }
    }
};
