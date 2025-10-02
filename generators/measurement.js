// measurement.js - Aligned with Glencoe Math Course 1
// Structured learning path for Jordan - follows textbook progression
// Measurement appears throughout multiple chapters in Glencoe

window.MeasurementGenerator = {
    // Track Jordan's current position in the learning path
    currentLevel: 1, // Start at foundation level
    
    // Structured progression following Glencoe textbook
    learningPath: {
        // Level 1: Foundation (Chapter 1-2 basics)
        foundation: {
            level: 1,
            skills: ['money', 'time', 'length_basics', 'weight_basics']
        },
        // Level 2: Unit Conversion (Chapter 3)
        conversion: {
            level: 2,
            skills: ['customary_length', 'customary_weight', 'customary_capacity', 'metric_basics']
        },
        // Level 3: Area and Perimeter (Chapter 5)
        geometry_measurement: {
            level: 3,
            skills: ['perimeter', 'area_rectangle', 'area_complex']
        },
        // Level 4: Volume (Chapter 6)
        volume: {
            level: 4,
            skills: ['volume_prism', 'volume_composite', 'surface_area']
        }
    },
    
    generate: function() {
        // Follow structured path based on Jordan's needs
        // Start with foundation since he's at 380 (2nd grade level)
        const level = this.getCurrentLevel();
        
        switch(level) {
            case 1:
                return this.generateFoundation();
            case 2:
                return this.generateConversion();
            case 3:
                return this.generateGeometryMeasurement();
            case 4:
                return this.generateVolume();
            default:
                return this.generateFoundation();
        }
    },
    
    getCurrentLevel: function() {
        // Check Jordan's progress and return appropriate level
        // For now, focusing on foundation due to his 380 score
        return 1;
    },
    
    // LEVEL 1: FOUNDATION SKILLS (Jordan needs these first!)
    generateFoundation: function() {
        const skills = ['money', 'time', 'basicLength', 'basicWeight'];
        const skill = skills[Math.floor(Math.random() * skills.length)];
        
        switch(skill) {
            case 'money':
                return this.generateMoneyProblem();
            case 'time':
                return this.generateTimeProblem();
            case 'basicLength':
                return this.generateBasicLength();
            case 'basicWeight':
                return this.generateBasicWeight();
        }
    },
    
    // Money counting (addressing his 2nd grade level need)
    generateMoneyProblem: function() {
        const types = ['count', 'makeChange', 'compare'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'count') {
            const quarters = Math.floor(Math.random() * 4);
            const dimes = Math.floor(Math.random() * 5);
            const nickels = Math.floor(Math.random() * 4);
            const pennies = Math.floor(Math.random() * 10);
            
            const total = (quarters * 25) + (dimes * 10) + (nickels * 5) + pennies;
            
            return {
                question: `Count the money:\n${quarters} quarters, ${dimes} dimes, ${nickels} nickels, ${pennies} pennies`,
                answer: `$${(total/100).toFixed(2)}`,
                hint: "Quarter = 25¢, Dime = 10¢, Nickel = 5¢, Penny = 1¢",
                explanation: `Quarters: ${quarters} × 25¢ = ${quarters * 25}¢\nDimes: ${dimes} × 10¢ = ${dimes * 10}¢\nNickels: ${nickels} × 5¢ = ${nickels * 5}¢\nPennies: ${pennies}¢\nTotal: ${total}¢ = $${(total/100).toFixed(2)}`
            };
        } else if (type === 'makeChange') {
            const cost = (Math.floor(Math.random() * 20) + 1) * 0.25;
            const paid = Math.ceil(cost) + Math.floor(Math.random() * 5);
            const change = paid - cost;
            
            return {
                question: `An item costs $${cost.toFixed(2)}. You pay with $${paid.toFixed(2)}. How much change?`,
                answer: `$${change.toFixed(2)}`,
                hint: "Subtract the cost from what you paid",
                explanation: `$${paid.toFixed(2)} - $${cost.toFixed(2)} = $${change.toFixed(2)}`
            };
        } else {
            const amount1 = (Math.random() * 10).toFixed(2);
            const amount2 = (Math.random() * 10).toFixed(2);
            const greater = parseFloat(amount1) > parseFloat(amount2) ? amount1 : amount2;
            
            return {
                question: `Which is more money: $${amount1} or $${amount2}?`,
                answer: `$${greater}`,
                options: [`$${amount1}`, `$${amount2}`],
                correct: greater === amount1 ? 0 : 1,
                hint: "Compare the dollar amounts and cents",
                explanation: `$${greater} is more because ${parseFloat(greater)} > ${parseFloat(greater === amount1 ? amount2 : amount1)}`
            };
        }
    },
    
    // Time (clock reading)
    generateTimeProblem: function() {
        const hours = Math.floor(Math.random() * 12) + 1;
        const minutes = Math.floor(Math.random() * 12) * 5;
        const minuteStr = minutes < 10 ? `0${minutes}` : minutes.toString();
        
        const types = ['read', 'elapsed', 'convert'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'read') {
            return {
                question: `What time is shown: The hour hand points to ${hours} and the minute hand points to ${minutes === 0 ? 12 : minutes/5}`,
                answer: `${hours}:${minuteStr}`,
                hint: "Hour hand tells hours, minute hand tells minutes (each number = 5 minutes)",
                explanation: `Hour: ${hours}, Minutes: ${minutes/5} × 5 = ${minutes}, Time: ${hours}:${minuteStr}`
            };
        } else if (type === 'elapsed') {
            const startHour = Math.floor(Math.random() * 11) + 1;
            const elapsedHours = Math.floor(Math.random() * 3) + 1;
            const endHour = (startHour + elapsedHours - 1) % 12 + 1;
            
            return {
                question: `If it's ${startHour}:00 now, what time will it be in ${elapsedHours} hours?`,
                answer: `${endHour}:00`,
                hint: `Add ${elapsedHours} to ${startHour}, remember 12:00 comes after 11:00`,
                explanation: `${startHour}:00 + ${elapsedHours} hours = ${endHour}:00`
            };
        } else {
            const totalMinutes = Math.floor(Math.random() * 180) + 60;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            
            return {
                question: `Convert ${totalMinutes} minutes to hours and minutes`,
                answer: `${hours} hours ${minutes} minutes`,
                hint: "60 minutes = 1 hour",
                explanation: `${totalMinutes} ÷ 60 = ${hours} hours with ${minutes} minutes left over`
            };
        }
    },
    
    // Basic length measurement
    generateBasicLength: function() {
        const inch = Math.floor(Math.random() * 11) + 1;
        
        return {
            question: `How many inches long is an object that reaches from 0 to ${inch} on a ruler?`,
            answer: `${inch} inches`,
            hint: "Count the spaces from 0 to the number",
            explanation: `The object is ${inch} inches long`
        };
    },
    
    // Basic weight
    generateBasicWeight: function() {
        const pounds = Math.floor(Math.random() * 10) + 1;
        const ounces = Math.floor(Math.random() * 16);
        
        return {
            question: `What is the total weight: ${pounds} pounds and ${ounces} ounces?`,
            answer: `${pounds} lb ${ounces} oz`,
            hint: "16 ounces = 1 pound",
            explanation: `${pounds} pounds + ${ounces} ounces = ${pounds} lb ${ounces} oz`
        };
    },
    
    // LEVEL 2: UNIT CONVERSION (Glencoe Chapter 3)
    generateConversion: function() {
        const conversions = [
            { from: 'feet', to: 'inches', factor: 12, fromVal: Math.floor(Math.random() * 10) + 1 },
            { from: 'yards', to: 'feet', factor: 3, fromVal: Math.floor(Math.random() * 10) + 1 },
            { from: 'pounds', to: 'ounces', factor: 16, fromVal: Math.floor(Math.random() * 5) + 1 },
            { from: 'gallons', to: 'quarts', factor: 4, fromVal: Math.floor(Math.random() * 5) + 1 },
            { from: 'meters', to: 'centimeters', factor: 100, fromVal: Math.floor(Math.random() * 10) + 1 }
        ];
        
        const conv = conversions[Math.floor(Math.random() * conversions.length)];
        const result = conv.fromVal * conv.factor;
        
        return {
            question: `Convert: ${conv.fromVal} ${conv.from} = ? ${conv.to}`,
            answer: `${result} ${conv.to}`,
            hint: `1 ${conv.from.slice(0, -1)} = ${conv.factor} ${conv.to}`,
            explanation: `${conv.fromVal} ${conv.from} × ${conv.factor} = ${result} ${conv.to}`
        };
    },
    
    // LEVEL 3: GEOMETRY MEASUREMENTS (Glencoe Chapter 5)
    generateGeometryMeasurement: function() {
        const types = ['perimeter', 'area'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'perimeter') {
            const length = Math.floor(Math.random() * 15) + 5;
            const width = Math.floor(Math.random() * 10) + 3;
            const perimeter = 2 * (length + width);
            
            return {
                question: `Find the perimeter of a rectangle: length = ${length} cm, width = ${width} cm`,
                answer: `${perimeter} cm`,
                hint: "Perimeter = 2 × (length + width)",
                explanation: `P = 2 × (${length} + ${width}) = 2 × ${length + width} = ${perimeter} cm`
            };
        } else {
            const length = Math.floor(Math.random() * 12) + 4;
            const width = Math.floor(Math.random() * 10) + 3;
            const area = length * width;
            
            return {
                question: `Find the area of a rectangle: length = ${length} ft, width = ${width} ft`,
                answer: `${area} square feet`,
                hint: "Area = length × width",
                explanation: `A = ${length} × ${width} = ${area} square feet`
            };
        }
    },
    
    // LEVEL 4: VOLUME (Glencoe Chapter 6)
    generateVolume: function() {
        const length = Math.floor(Math.random() * 10) + 2;
        const width = Math.floor(Math.random() * 8) + 2;
        const height = Math.floor(Math.random() * 6) + 2;
        const volume = length * width * height;
        
        return {
            question: `Find the volume: length = ${length} m, width = ${width} m, height = ${height} m`,
            answer: `${volume} cubic meters`,
            hint: "Volume = length × width × height",
            explanation: `V = ${length} × ${width} × ${height} = ${volume} cubic meters`
        };
    },
    
    // Progress tracking for Jordan
    checkProgress: function() {
        // This would connect to the main app to track which level Jordan has mastered
        return {
            currentLevel: this.currentLevel,
            mastered: [],
            needsPractice: ['money', 'time', 'basic_measurement'],
            nextGoal: 'Master foundation skills before moving to conversions'
        };
    }
};
