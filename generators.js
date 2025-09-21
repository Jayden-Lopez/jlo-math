// generators.js - Random Question Generators for Jordan's Math Practice
// Add this as a new file or replace the generator stubs in your HTML

// Operations Generator (Addition, Subtraction, Multiplication, Division)
window.OperationsGenerator = {
    generate: function() {
        const operations = ['+', '-', '×', '÷'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer, hint, explanation;
        
        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 100) + 1;
                answer = num1 + num2;
                hint = `Add the ones place, then the tens place`;
                explanation = `${num1} + ${num2} = ${answer}`;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 100) + 20;
                num2 = Math.floor(Math.random() * num1);
                answer = num1 - num2;
                hint = `Subtract ${num2} from ${num1}`;
                explanation = `${num1} - ${num2} = ${answer}`;
                break;
            case '×':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                hint = `Think of ${num1} groups of ${num2}`;
                explanation = `${num1} × ${num2} = ${answer}`;
                break;
            case '÷':
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = Math.floor(Math.random() * 12) + 1;
                num1 = num2 * answer;
                hint = `How many groups of ${num2} are in ${num1}?`;
                explanation = `${num1} ÷ ${num2} = ${answer}`;
                break;
        }
        
        return {
            question: `What is ${num1} ${operation} ${num2}?`,
            answer: answer.toString(),
            hint: hint,
            explanation: explanation
        };
    }
};

// Fractions Generator
window.FractionsGenerator = {
    generate: function() {
        const types = ['add', 'subtract', 'simplify', 'convert'];
        const type = types[Math.floor(Math.random() * types.length)];
        let question, answer, hint, explanation;
        
        switch(type) {
            case 'add':
                const den1 = [2, 4, 8][Math.floor(Math.random() * 3)];
                const den2 = [2, 4, 8][Math.floor(Math.random() * 3)];
                const num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
                const num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
                
                if (den1 === den2) {
                    answer = `${num1 + num2}/${den1}`;
                    hint = `Add the numerators when denominators are the same`;
                    explanation = `${num1}/${den1} + ${num2}/${den2} = ${num1 + num2}/${den1}`;
                } else {
                    const lcm = (den1 * den2) / gcd(den1, den2);
                    const newNum1 = num1 * (lcm / den1);
                    const newNum2 = num2 * (lcm / den2);
                    answer = `${newNum1 + newNum2}/${lcm}`;
                    hint = `Find a common denominator first`;
                    explanation = `Convert to common denominator ${lcm}: ${newNum1}/${lcm} + ${newNum2}/${lcm} = ${answer}`;
                }
                question = `What is ${num1}/${den1} + ${num2}/${den2}?`;
                break;
                
            case 'subtract':
                const d1 = [2, 4, 8][Math.floor(Math.random() * 3)];
                const d2 = [2, 4, 8][Math.floor(Math.random() * 3)];
                const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
                const n2 = Math.floor(Math.random() * (d2 - 1)) + 1;
                
                if (d1 === d2 && n1 > n2) {
                    answer = `${n1 - n2}/${d1}`;
                    hint = `Subtract the numerators when denominators are the same`;
                    explanation = `${n1}/${d1} - ${n2}/${d2} = ${n1 - n2}/${d1}`;
                } else {
                    answer = `1/2`; // Simplified for now
                    hint = `Find a common denominator first`;
                    explanation = `Find common denominator, then subtract`;
                }
                question = `What is ${n1}/${d1} - ${n2}/${d2}?`;
                break;
                
            case 'simplify':
                const numerator = Math.floor(Math.random() * 20) + 2;
                const denominator = numerator * (Math.floor(Math.random() * 3) + 2);
                const g = gcd(numerator, denominator);
                answer = `${numerator/g}/${denominator/g}`;
                question = `Simplify ${numerator}/${denominator}`;
                hint = `Find the GCD of ${numerator} and ${denominator}`;
                explanation = `GCD is ${g}, so ${numerator}÷${g}/${denominator}÷${g} = ${answer}`;
                break;
                
            case 'convert':
                const whole = Math.floor(Math.random() * 5) + 1;
                const frac_num = Math.floor(Math.random() * 7) + 1;
                const frac_den = 8;
                answer = `${whole * frac_den + frac_num}/${frac_den}`;
                question = `Convert ${whole} ${frac_num}/${frac_den} to an improper fraction`;
                hint = `Multiply the whole number by the denominator, then add the numerator`;
                explanation = `${whole} × ${frac_den} + ${frac_num} = ${whole * frac_den + frac_num}, so the answer is ${answer}`;
                break;
        }
        
        return { question, answer, hint, explanation };
    }
};

// Algebra Generator
window.AlgebraGenerator = {
    generate: function() {
        const types = ['solve', 'evaluate'];
        const type = types[Math.floor(Math.random() * types.length)];
        let question, answer, hint, explanation;
        
        if (type === 'solve') {
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 20) - 10;
            const c = Math.floor(Math.random() * 30) + 1;
            
            if (Math.random() < 0.5) {
                // x + b = c
                answer = (c - b).toString();
                question = `Solve for x: x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`;
                hint = `Isolate x by doing the opposite operation`;
                explanation = `x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)} = ${answer}`;
            } else {
                // ax = c
                const result = Math.floor(Math.random() * 10) + 1;
                const product = a * result;
                answer = result.toString();
                question = `Solve for x: ${a}x = ${product}`;
                hint = `Divide both sides by ${a}`;
                explanation = `x = ${product} ÷ ${a} = ${answer}`;
            }
        } else {
            // evaluate
            const x = Math.floor(Math.random() * 10) + 1;
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 10);
            answer = (a * x + b).toString();
            question = `Evaluate ${a}x + ${b} when x = ${x}`;
            hint = `Substitute ${x} for x, then calculate`;
            explanation = `${a}(${x}) + ${b} = ${a * x} + ${b} = ${answer}`;
        }
        
        return { question, answer, hint, explanation };
    }
};

// Word Problems Generator
window.WordProblemsGenerator = {
    generate: function() {
        const problems = [
            {
                template: "NAME has NUM1 ITEMS. PRONOUN gives NUM2 to FRIEND. How many ITEMS does NAME have left?",
                calc: (n1, n2) => n1 - n2,
                constraint: (n1, n2) => n1 > n2,
                hint: "Subtract the amount given away",
                explain: (n1, n2, ans) => `${n1} - ${n2} = ${ans}`
            },
            {
                template: "NAME buys NUM1 ITEMS on Monday and NUM2 ITEMS on Tuesday. How many ITEMS does NAME have in total?",
                calc: (n1, n2) => n1 + n2,
                constraint: (n1, n2) => true,
                hint: "Add the items from both days",
                explain: (n1, n2, ans) => `${n1} + ${n2} = ${ans}`
            },
            {
                template: "There are NUM1 students in class. If they form groups of NUM2, how many groups will there be?",
                calc: (n1, n2) => Math.floor(n1 / n2),
                constraint: (n1, n2) => n1 % n2 === 0 && n2 > 1 && n2 < n1,
                hint: "Divide the total by the group size",
                explain: (n1, n2, ans) => `${n1} ÷ ${n2} = ${ans} groups`
            },
            {
                template: "A pizza has NUM1 slices. NAME eats NUM2 slices. What fraction of the pizza is left?",
                calc: (n1, n2) => `${n1 - n2}/${n1}`,
                constraint: (n1, n2) => n1 > n2 && n1 <= 12,
                hint: "Find how many slices are left, then write as a fraction",
                explain: (n1, n2, ans) => `${n1} - ${n2} = ${n1-n2} slices left, so ${ans} of the pizza remains`
            },
            {
                template: "NAME saves $NUM1 per week. How much will NAME save in NUM2 weeks?",
                calc: (n1, n2) => n1 * n2,
                constraint: (n1, n2) => n1 <= 20 && n2 <= 12,
                hint: "Multiply the weekly amount by the number of weeks",
                explain: (n1, n2, ans) => `$${n1} × ${n2} weeks = $${ans}`
            }
        ];
        
        const names = ['Sarah', 'Mike', 'Emma', 'Jordan', 'Alex', 'Lily', 'Tom', 'Zoe'];
        const items = ['apples', 'cookies', 'marbles', 'stickers', 'pencils', 'books', 'toys'];
        const friends = ['friend', 'sister', 'brother', 'classmate'];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const item = items[Math.floor(Math.random() * items.length)];
        const friend = friends[Math.floor(Math.random() * friends.length)];
        const pronoun = ['Sarah', 'Emma', 'Lily', 'Zoe'].includes(name) ? 'She' : 'He';
        
        let num1, num2;
        do {
            num1 = Math.floor(Math.random() * 30) + 5;
            num2 = Math.floor(Math.random() * 20) + 1;
        } while (!problem.constraint(num1, num2));
        
        const answer = problem.calc(num1, num2).toString();
        const question = problem.template
            .replace(/NAME/g, name)
            .replace(/NUM1/g, num1)
            .replace(/NUM2/g, num2)
            .replace(/ITEMS/g, item)
            .replace(/FRIEND/g, friend)
            .replace(/PRONOUN/g, pronoun);
        
        return {
            question: question,
            answer: answer,
            hint: problem.hint,
            explanation: problem.explain(num1, num2, answer)
        };
    }
};

// Geometry Generator
window.GeometryGenerator = {
    generate: function() {
        const shapes = ['rectangle', 'square', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const calc_type = Math.random() < 0.5 ? 'area' : 'perimeter';
        let question, answer, hint, explanation;
        
        switch(shape) {
            case 'rectangle':
                const length = Math.floor(Math.random() * 10) + 2;
                const width = Math.floor(Math.random() * 10) + 2;
                if (calc_type === 'area') {
                    answer = (length * width).toString();
                    question = `What is the area of a rectangle with length ${length} and width ${width}?`;
                    hint = `Area = length × width`;
                    explanation = `Area = ${length} × ${width} = ${answer} square units`;
                } else {
                    answer = (2 * (length + width)).toString();
                    question = `What is the perimeter of a rectangle with length ${length} and width ${width}?`;
                    hint = `Perimeter = 2 × (length + width)`;
                    explanation = `Perimeter = 2 × (${length} + ${width}) = 2 × ${length + width} = ${answer} units`;
                }
                break;
                
            case 'square':
                const side = Math.floor(Math.random() * 10) + 2;
                if (calc_type === 'area') {
                    answer = (side * side).toString();
                    question = `What is the area of a square with side length ${side}?`;
                    hint = `Area = side × side`;
                    explanation = `Area = ${side} × ${side} = ${answer} square units`;
                } else {
                    answer = (4 * side).toString();
                    question = `What is the perimeter of a square with side length ${side}?`;
                    hint = `Perimeter = 4 × side`;
                    explanation = `Perimeter = 4 × ${side} = ${answer} units`;
                }
                break;
                
            case 'triangle':
                const base = Math.floor(Math.random() * 10) + 2;
                const height = Math.floor(Math.random() * 10) + 2;
                answer = ((base * height) / 2).toString();
                question = `What is the area of a triangle with base ${base} and height ${height}?`;
                hint = `Area = (base × height) ÷ 2`;
                explanation = `Area = (${base} × ${height}) ÷ 2 = ${base * height} ÷ 2 = ${answer} square units`;
                break;
        }
        
        return { question, answer, hint, explanation };
    }
};

// Measurement Generator
window.MeasurementGenerator = {
    generate: function() {
        const conversions = [
            { from: 'feet', to: 'inches', factor: 12 },
            { from: 'yards', to: 'feet', factor: 3 },
            { from: 'meters', to: 'centimeters', factor: 100 },
            { from: 'kilograms', to: 'grams', factor: 1000 },
            { from: 'liters', to: 'milliliters', factor: 1000 },
            { from: 'hours', to: 'minutes', factor: 60 },
            { from: 'minutes', to: 'seconds', factor: 60 },
            { from: 'pounds', to: 'ounces', factor: 16 }
        ];
        
        const conversion = conversions[Math.floor(Math.random() * conversions.length)];
        const value = Math.floor(Math.random() * 10) + 1;
        const answer = (value * conversion.factor).toString();
        
        return {
            question: `Convert ${value} ${conversion.from} to ${conversion.to}`,
            answer: answer,
            hint: `1 ${conversion.from.slice(0, -1)} = ${conversion.factor} ${conversion.to}`,
            explanation: `${value} ${conversion.from} × ${conversion.factor} = ${answer} ${conversion.to}`
        };
    }
};

// Ratios Generator
window.RatiosGenerator = {
    generate: function() {
        const types = ['simplify', 'percent', 'proportion'];
        const type = types[Math.floor(Math.random() * types.length)];
        let question, answer, hint, explanation;
        
        switch(type) {
            case 'simplify':
                const a = Math.floor(Math.random() * 20) + 2;
                const b = Math.floor(Math.random() * 20) + 2;
                const g = gcd(a, b);
                answer = `${a/g}:${b/g}`;
                question = `Simplify the ratio ${a}:${b}`;
                hint = `Find the GCD of ${a} and ${b}`;
                explanation = `GCD is ${g}, so ${a}÷${g} : ${b}÷${g} = ${answer}`;
                break;
                
            case 'percent':
                const total = [10, 20, 25, 50, 100][Math.floor(Math.random() * 5)];
                const part = Math.floor(Math.random() * total) + 1;
                answer = ((part / total) * 100).toString();
                question = `What percent is ${part} out of ${total}?`;
                hint = `Divide the part by the whole, then multiply by 100`;
                explanation = `(${part} ÷ ${total}) × 100 = ${answer}%`;
                break;
                
            case 'proportion':
                const ratio1 = Math.floor(Math.random() * 5) + 1;
                const ratio2 = Math.floor(Math.random() * 5) + 1;
                const known = Math.floor(Math.random() * 20) + 5;
                answer = ((known * ratio2) / ratio1).toString();
                question = `If the ratio is ${ratio1}:${ratio2} and the first value is ${known}, what is the second value?`;
                hint = `Set up a proportion and cross multiply`;
                explanation = `${ratio1}:${ratio2} = ${known}:x, so x = (${known} × ${ratio2}) ÷ ${ratio1} = ${answer}`;
                break;
        }
        
        return { question, answer, hint, explanation };
    }
};

// Integers Generator (Positive and Negative Numbers)
window.IntegersGenerator = {
    generate: function() {
        const operations = ['add', 'subtract', 'multiply'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1 = Math.floor(Math.random() * 20) - 10;
        let num2 = Math.floor(Math.random() * 20) - 10;
        let question, answer, hint, explanation;
        
        switch(operation) {
            case 'add':
                answer = (num1 + num2).toString();
                question = `What is ${num1} + ${num2}?`;
                if (num1 < 0 && num2 < 0) {
                    hint = `Adding two negatives: add the values and keep negative`;
                } else if (num1 < 0 || num2 < 0) {
                    hint = `Different signs: subtract and keep the sign of the larger absolute value`;
                } else {
                    hint = `Both positive: just add normally`;
                }
                explanation = `${num1} + ${num2} = ${answer}`;
                break;
                
            case 'subtract':
                answer = (num1 - num2).toString();
                question = `What is ${num1} - ${num2}?`;
                hint = `Subtracting is the same as adding the opposite`;
                explanation = `${num1} - ${num2} = ${num1} + ${-num2} = ${answer}`;
                break;
                
            case 'multiply':
                answer = (num1 * num2).toString();
                question = `What is ${num1} × ${num2}?`;
                if ((num1 < 0 && num2 < 0) || (num1 > 0 && num2 > 0)) {
                    hint = `Same signs = positive result`;
                } else {
                    hint = `Different signs = negative result`;
                }
                explanation = `${num1} × ${num2} = ${answer}`;
                break;
        }
        
        return { question, answer, hint, explanation };
    }
};

// Expressions Generator
window.ExpressionsGenerator = {
    generate: function() {
        const x = Math.floor(Math.random() * 10) + 1;
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10);
        const c = Math.floor(Math.random() * 5) + 1;
        
        const expressions = [
            {
                expr: `${a}x + ${b}`,
                calc: () => a * x + b,
                hint: `Substitute ${x} for x, then calculate`,
                explain: (ans) => `${a}(${x}) + ${b} = ${a * x} + ${b} = ${ans}`
            },
            {
                expr: `${a}x - ${b}`,
                calc: () => a * x - b,
                hint: `Substitute ${x} for x, then calculate`,
                explain: (ans) => `${a}(${x}) - ${b} = ${a * x} - ${b} = ${ans}`
            },
            {
                expr: `${a}x + ${b}x`,
                calc: () => (a + b) * x,
                hint: `Combine like terms first, then substitute`,
                explain: (ans) => `${a}x + ${b}x = ${a + b}x = ${a + b}(${x}) = ${ans}`
            },
            {
                expr: `${a}(x + ${c})`,
                calc: () => a * (x + c),
                hint: `Substitute ${x} for x inside the parentheses first`,
                explain: (ans) => `${a}(${x} + ${c}) = ${a}(${x + c}) = ${ans}`
            }
        ];
        
        const expression = expressions[Math.floor(Math.random() * expressions.length)];
        const answer = expression.calc().toString();
        
        return {
            question: `Evaluate ${expression.expr} when x = ${x}`,
            answer: answer,
            hint: expression.hint,
            explanation: expression.explain(answer)
        };
    }
};

// Helper function for GCD (Greatest Common Divisor)
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}
