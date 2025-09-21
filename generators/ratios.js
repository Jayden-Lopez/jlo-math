// Ratios Question Generator
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
        
        const gcd = this.gcd(a, b);
        const simplifiedA = a / gcd;
        const simplifiedB = b / gcd;
        
        return {
            question: `Simplify the ratio ${a}:${b}`,
            answer: `${simplifiedA}:${simplifiedB}`,
            hint: `Find the greatest common factor of ${a} and ${b}`,
            explanation: `GCF of ${a} and ${b} is ${gcd}. ${a}÷${gcd} : ${b}÷${gcd} = ${simplifiedA}:${simplifiedB}`
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
                hint: "Cross multiply: a × x = b × c",
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
                        hint: `Multiply the map distance by ${scale}`,
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
                        hint: `Divide the real size by ${scale}`,
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
                        hint: `Multiply each dimension by ${scale}`,
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
                        hint: `Convert ${percent}% to decimal and multiply`,
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
                        hint: "Divide part by whole, then multiply by 100",
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
                        hint: `Find ${increase}% of ${original} and add it to the original`,
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
                        hint: `Find the total first, then write the ratio`,
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
                        hint: `Use the ratio to set up a proportion`,
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
                        hint: "Write the numbers in the order asked",
                        explanation: `Red:Blue:Green = ${red}:${blue}:${green}`
                    };
                }
            }
        ];
        
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        return context.generate();
    },
    
    // Helper function
    gcd: function(a, b) {
        return b ? this.gcd(b, a % b) : a;
    }
};
