// generators/ratios.js
// Ratios Question Generator - Updated to use global helper functions
window.RatiosGenerator = {
    generate: function() {
        const types = ['simplify', 'proportion', 'scale', 'percentage', 'compare'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'simplify':
                return this.generateSimplify();
            case 'proportion':
                return this.generateProportion();
            case 'scale':
                return this.generateScale();
            case 'percentage':
                return this.generatePercentage();
            case 'compare':
                return this.generateCompare();
            default:
                return this.generateSimplify();
        }
    },
    
    generateSimplify: function() {
        const factor = Math.floor(Math.random() * 5) + 2;
        const a = factor * (Math.floor(Math.random() * 5) + 1);
        const b = factor * (Math.floor(Math.random() * 5) + 2);
        
        // Using global gcd function instead of this.gcd
        const g = gcd(a, b);
        const simplifiedA = a / g;
        const simplifiedB = b / g;
        
        return {
            question: `Simplify the ratio ${a}:${b}`,
            answer: `${simplifiedA}:${simplifiedB}`,
            hint: `Step 1: Look for a number that divides both ${a} and ${b}
Step 2: Try small numbers: Does 2 work? ${a % 2 === 0 && b % 2 === 0 ? 'Yes!' : 'No'}
Step 3: Try ${g} - it divides both!
Step 4: ${a} ÷ ${g} = ${simplifiedA}
Step 5: ${b} ÷ ${g} = ${simplifiedB}
Step 6: Simplified ratio is ${simplifiedA}:${simplifiedB}`,
            explanation: `GCF of ${a} and ${b} is ${g}. ${a}÷${g} : ${b}÷${g} = ${simplifiedA}:${simplifiedB}`
        };
    },
    
    generateProportion: function() {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 8) + 2;
        const d = (b * c) / a;
        
        if (d === Math.floor(d)) {
            return {
                question: `Solve for x: ${a}:${b} = ${c}:x`,
                answer: d,
                hint: `Step 1: Set up the proportion: ${a}/${b} = ${c}/x
Step 2: Cross multiply (make an X): ${a} × x and ${b} × ${c}
Step 3: This gives you: ${a} × x = ${b} × ${c}
Step 4: Calculate: ${a} × x = ${b * c}
Step 5: Divide both sides by ${a}: x = ${b * c} ÷ ${a}
Step 6: x = ${d}`,
                explanation: `${a} × x = ${b} × ${c}, so ${a}x = ${b * c}, therefore x = ${d}`
            };
        } else {
            // Generate a different problem if result isn't whole
            return this.generateProportion();
        }
    },
    
    generateScale: function() {
        const scales = [2, 3, 4, 5, 10];
        const scale = scales[Math.floor(Math.random() * scales.length)];
        
        const problems = [
            {
                generate: function() {
                    const original = Math.floor(Math.random() * 10) + 5;
                    return {
                        question: `A map uses a scale of 1:${scale}. If a distance on the map is ${original} cm, what is the real distance?`,
                        answer: original * scale,
                        hint: `Step 1: The scale 1:${scale} means 1 cm on map = ${scale} cm in real life
Step 2: You have ${original} cm on the map
Step 3: Multiply: ${original} × ${scale} = ?
Step 4: Real distance = ${original * scale} cm`,
                        explanation: `Real distance = ${original} cm × ${scale} = ${original * scale} cm`
                    };
                }
            },
            {
                generate: function() {
                    const real = scale * (Math.floor(Math.random() * 10) + 5);
                    return {
                        question: `A model uses a scale of 1:${scale}. If the real object is ${real} inches, how long is the model?`,
                        answer: real / scale,
                        hint: `Step 1: The scale 1:${scale} means model is ${scale} times smaller
Step 2: Real size is ${real} inches
Step 3: To find model size, divide by ${scale}
Step 4: ${real} ÷ ${scale} = ${real / scale} inches`,
                        explanation: `Model size = ${real} inches ÷ ${scale} = ${real / scale} inches`
                    };
                }
            },
            {
                generate: function() {
                    const width = Math.floor(Math.random() * 8) + 3;
                    const height = Math.floor(Math.random() * 8) + 3;
                    return {
                        question: `A photo is ${width} inches by ${height} inches. If it's enlarged by a scale factor of ${scale}, what are the new dimensions?`,
                        answer: `${width * scale} by ${height * scale}`,
                        hint: `Step 1: Scale factor ${scale} means everything gets ${scale} times bigger
Step 2: Original width: ${width} inches → New width: ${width} × ${scale} = ${width * scale} inches
Step 3: Original height: ${height} inches → New height: ${height} × ${scale} = ${height * scale} inches
Step 4: New dimensions: ${width * scale} by ${height * scale} inches`,
                        explanation: `New width = ${width} × ${scale} = ${width * scale} inches, New height = ${height} × ${scale} = ${height * scale} inches`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generatePercentage: function() {
        const problems = [
            {
                generate: function() {
                    const total = Math.floor(Math.random() * 50) * 10 + 100;
                    const percent = Math.floor(Math.random() * 9) * 10 + 10;
                    return {
                        question: `What is ${percent}% of ${total}?`,
                        answer: (total * percent) / 100,
                        hint: `Step 1: Convert ${percent}% to a decimal: ${percent} ÷ 100 = ${percent/100}
Step 2: Multiply by ${total}: ${percent/100} × ${total}
Step 3: Calculate: ${(total * percent) / 100}
Shortcut: Move decimal point left twice in ${percent} to get ${percent/100}, then multiply!`,
                        explanation: `${percent}% = ${percent/100}, so ${percent/100} × ${total} = ${(total * percent) / 100}`
                    };
                }
            },
            {
                generate: function() {
                    const part = Math.floor(Math.random() * 20) + 10;
                    const whole = part * (Math.floor(Math.random() * 4) + 2);
                    const percent = Math.round((part / whole) * 100);
                    return {
                        question: `${part} is what percent of ${whole}?`,
                        answer: percent,
                        hint: `Step 1: Set up a fraction: ${part}/${whole}
Step 2: Divide: ${part} ÷ ${whole} = ${(part/whole).toFixed(2)}
Step 3: Convert to percent: multiply by 100
Step 4: ${(part/whole).toFixed(2)} × 100 = ${percent}%`,
                        explanation: `(${part} ÷ ${whole}) × 100 = ${(part/whole).toFixed(2)} × 100 = ${percent}%`
                    };
                }
            },
            {
                generate: function() {
                    const original = Math.floor(Math.random() * 50) + 50;
                    const increase = Math.floor(Math.random() * 5) * 10 + 10;
                    const newValue = original + (original * increase / 100);
                    return {
                        question: `A $${original} item increases in price by ${increase}%. What is the new price?`,
                        answer: newValue,
                        hint: `Step 1: Find ${increase}% of $${original}
Step 2: ${increase}% = ${increase/100}, so ${increase/100} × ${original} = $${original * increase / 100}
Step 3: This is the increase amount: $${original * increase / 100}
Step 4: Add to original: $${original} + $${original * increase / 100} = $${newValue}`,
                        explanation: `Increase = ${original} × ${increase/100} = ${original * increase / 100}. New price = ${original} + ${original * increase / 100} = $${newValue}`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateCompare: function() {
        const contexts = [
            {
                items: ['apples', 'oranges'],
                generate: function() {
                    const a = Math.floor(Math.random() * 10) + 5;
                    const b = Math.floor(Math.random() * 10) + 5;
                    const total = a + b;
                    return {
                        question: `There are ${a} ${this.items[0]} and ${b} ${this.items[1]}. What is the ratio of ${this.items[0]} to total fruit?`,
                        answer: `${a}:${total}`,
                        hint: `Step 1: Count the ${this.items[0]}: ${a}
Step 2: Count all fruit: ${a} + ${b} = ${total}
Step 3: Write the ratio of ${this.items[0]} to total
Step 4: ${this.items[0]}:total = ${a}:${total}`,
                        explanation: `Total fruit = ${a} + ${b} = ${total}. Ratio of ${this.items[0]} to total = ${a}:${total}`
                    };
                }
            },
            {
                items: ['boys', 'girls'],
                generate: function() {
                    const ratio1 = Math.floor(Math.random() * 3) + 2;
                    const ratio2 = Math.floor(Math.random() * 3) + 2;
                    const multiplier = Math.floor(Math.random() * 5) + 2;
                    const boys = ratio1 * multiplier;
                    const girls = ratio2 * multiplier;
                    
                    return {
                        question: `In a class, the ratio of ${this.items[0]} to ${this.items[1]} is ${ratio1}:${ratio2}. If there are ${boys} ${this.items[0]}, how many ${this.items[1]} are there?`,
                        answer: girls,
                        hint: `Step 1: The ratio ${ratio1}:${ratio2} means for every ${ratio1} ${this.items[0]}, there are ${ratio2} ${this.items[1]}
Step 2: We have ${boys} ${this.items[0]}
Step 3: Set up: ${ratio1}:${ratio2} = ${boys}:?
Step 4: Cross multiply: ${ratio1} × ? = ${ratio2} × ${boys}
Step 5: ? = (${ratio2} × ${boys}) ÷ ${ratio1} = ${girls}`,
                        explanation: `${ratio1}:${ratio2} = ${boys}:x. So ${ratio1} × x = ${ratio2} × ${boys}, x = ${girls} ${this.items[1]}`
                    };
                }
            },
            {
                generate: function() {
                    const red = Math.floor(Math.random() * 8) + 3;
                    const blue = Math.floor(Math.random() * 8) + 3;
                    const green = Math.floor(Math.random() * 8) + 3;
                    
                    const options = [
                        `${red}:${blue}:${green}`,
                        `${blue}:${red}:${green}`,
                        `${red}:${green}:${blue}`,
                        `${green}:${blue}:${red}`
                    ];
                    
                    return {
                        question: `There are ${red} red marbles, ${blue} blue marbles, and ${green} green marbles. What is the ratio red:blue:green?`,
                        options: options,
                        correct: 0,
                        hint: `Step 1: Count each color:
- Red marbles: ${red}
- Blue marbles: ${blue}
- Green marbles: ${green}
Step 2: Write in the order asked (red:blue:green)
Step 3: ${red}:${blue}:${green}`,
                        explanation: `Red:Blue:Green = ${red}:${blue}:${green}`
                    };
                }
            }
        ];
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        return context.generate();
    }
};
