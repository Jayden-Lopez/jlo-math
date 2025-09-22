// Word Problems Question Generator
window.WordProblemsGenerator = {
    generate: function() {
        const types = ['shopping', 'time', 'distance', 'sharing', 'patterns'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'shopping':
                return this.generateShopping();
            case 'time':
                return this.generateTime();
            case 'distance':
                return this.generateDistance();
            case 'sharing':
                return this.generateSharing();
            case 'patterns':
                return this.generatePatterns();
            default:
                return this.generateShopping();
        }
    },
    
    generateShopping: function() {
        const names = ['Sarah', 'Mike', 'Emma', 'Jordan', 'Alex', 'Lisa'];
        const name = names[Math.floor(Math.random() * names.length)];
        
        const items = [
            { item: 'pencils', price: 0.50, bulk: 12 },
            { item: 'notebooks', price: 2.50, bulk: 5 },
            { item: 'erasers', price: 0.75, bulk: 8 },
            { item: 'markers', price: 1.25, bulk: 6 },
            { item: 'folders', price: 1.50, bulk: 4 }
        ];
        
        const selected = items[Math.floor(Math.random() * items.length)];
        const quantity = Math.floor(Math.random() * 10) + 3;
        const discount = Math.floor(Math.random() * 3) + 2; // $2-4 discount
        
        const problems = [
            {
                question: `${name} buys ${quantity} ${selected.item} at $${selected.price} each. How much does ${name} spend?`,
                answer: (quantity * selected.price).toFixed(2),
                hint: `Multiply ${quantity} × $${selected.price}`,
                explanation: `${quantity} × $${selected.price} = $${(quantity * selected.price).toFixed(2)}`
            },
            {
                question: `${name} has $${(quantity * selected.price + 5).toFixed(2)}. After buying ${quantity} ${selected.item} at $${selected.price} each, how much money is left?`,
                answer: 5,
                hint: `First find the total cost, then subtract from the money ${name} has`,
                explanation: `Cost: ${quantity} × $${selected.price} = $${(quantity * selected.price).toFixed(2)}. Money left: $${(quantity * selected.price + 5).toFixed(2)} - $${(quantity * selected.price).toFixed(2)} = $5.00`
            },
            {
                question: `${selected.item} cost $${selected.price} each or $${(selected.bulk * selected.price - discount).toFixed(2)} for a pack of ${selected.bulk}. How much does ${name} save by buying the pack instead of ${selected.bulk} individual ${selected.item}?`,
                answer: discount,
                hint: `Compare the pack price to buying ${selected.bulk} individually`,
                explanation: `Individual cost: ${selected.bulk} × $${selected.price} = $${(selected.bulk * selected.price).toFixed(2)}. Pack costs $${(selected.bulk * selected.price - discount).toFixed(2)}. Savings: $${discount}.00`
            }
        ];
        
        return problems[Math.floor(Math.random() * problems.length)];
    },
    
    generateTime: function() {
        const names = ['Tom', 'Jenny', 'David', 'Maria', 'Chris'];
        const name = names[Math.floor(Math.random() * names.length)];
        
        const activities = [
            { activity: 'reads', unit: 'pages', rate: Math.floor(Math.random() * 10) + 15 },
            { activity: 'runs', unit: 'miles', rate: Math.floor(Math.random() * 3) + 2 },
            { activity: 'practices piano', unit: 'minutes', rate: Math.floor(Math.random() * 20) + 20 },
            { activity: 'does homework', unit: 'problems', rate: Math.floor(Math.random() * 5) + 8 }
        ];
        
        const selected = activities[Math.floor(Math.random() * activities.length)];
        const days = Math.floor(Math.random() * 10) + 5;
        
        const problems = [
            {
                question: `${name} ${selected.activity} ${selected.rate} ${selected.unit} per day. How many ${selected.unit} in ${days} days?`,
                answer: selected.rate * days,
                hint: `Multiply daily rate by number of days`,
                explanation: `${selected.rate} ${selected.unit}/day × ${days} days = ${selected.rate * days} ${selected.unit}`
            },
            {
                question: `${name} ${selected.activity} ${selected.rate} ${selected.unit} per day. How many ${selected.unit} in ${Math.floor(days/7)} weeks?`,
                answer: selected.rate * Math.floor(days/7) * 7,
                hint: `First convert weeks to days, then multiply`,
                explanation: `${Math.floor(days/7)} weeks = ${Math.floor(days/7) * 7} days. ${selected.rate} × ${Math.floor(days/7) * 7} = ${selected.rate * Math.floor(days/7) * 7} ${selected.unit}`
            }
        ];
        
        return problems[Math.floor(Math.random() * problems.length)];
    },
    
    generateDistance: function() {
        const places = ['school', 'park', 'library', 'store', 'gym'];
        const place1 = places[Math.floor(Math.random() * places.length)];
        const place2 = places[places.indexOf(place1) === places.length - 1 ? 0 : places.indexOf(place1) + 1];
        
        const dist1 = Math.floor(Math.random() * 5) + 2;
        const dist2 = Math.floor(Math.random() * 5) + 2;
        const speed = Math.floor(Math.random() * 3) + 3;
        
        const problems = [
            {
                question: `The ${place1} is ${dist1} miles from home. The ${place2} is ${dist2} miles from the ${place1}. How far is the ${place2} from home if you go through the ${place1}?`,
                answer: dist1 + dist2,
                hint: `Add the two distances together`,
                explanation: `Home to ${place1}: ${dist1} miles. ${place1} to ${place2}: ${dist2} miles. Total: ${dist1} + ${dist2} = ${dist1 + dist2} miles`
            },
            {
                question: `You bike to the ${place1} at ${speed} miles per hour. If the ${place1} is ${dist1} miles away, how many minutes does it take?`,
                answer: (dist1 / speed * 60),
                hint: `Time = Distance ÷ Speed, then convert to minutes`,
                explanation: `Time = ${dist1} miles ÷ ${speed} mph = ${(dist1/speed).toFixed(2)} hours = ${(dist1/speed * 60)} minutes`
            }
        ];
        
        return problems[Math.floor(Math.random() * problems.length)];
    },
    
    generateSharing: function() {
        const names1 = ['Amy', 'Ben', 'Carol', 'Dan'];
        const names2 = ['friends', 'classmates', 'teammates', 'siblings'];
        const name = names1[Math.floor(Math.random() * names1.length)];
        const group = names2[Math.floor(Math.random() * names2.length)];
        
        const items = ['cookies', 'candies', 'stickers', 'cards', 'marbles'];
        const item = items[Math.floor(Math.random() * items.length)];
        
        const people = Math.floor(Math.random() * 4) + 3;
        const perPerson = Math.floor(Math.random() * 8) + 4;
        const total = people * perPerson;
        const extra = Math.floor(Math.random() * 5) + 2;
        
        const problems = [
            {
                question: `${name} has ${total} ${item} to share equally among ${people} ${group}. How many ${item} does each person get?`,
                answer: perPerson,
                hint: `Divide the total by the number of people`,
                explanation: `${total} ${item} ÷ ${people} people = ${perPerson} ${item} per person`
            },
            {
                question: `${name} wants to give ${perPerson} ${item} to each of ${people} ${group}. How many ${item} does ${name} need in total?`,
                answer: total,
                hint: `Multiply ${item} per person by number of people`,
                explanation: `${perPerson} ${item} × ${people} people = ${total} ${item} needed`
            },
            {
                question: `${name} has ${total + extra} ${item}. After giving ${perPerson} ${item} to each of ${people} ${group}, how many are left?`,
                answer: extra,
                hint: `First find how many were given away, then subtract`,
                explanation: `Given away: ${perPerson} × ${people} = ${total}. Left: ${total + extra} - ${total} = ${extra} ${item}`
            }
        ];
        
        return problems[Math.floor(Math.random() * problems.length)];
    },
    
    generatePatterns: function() {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 2;
        const position = Math.floor(Math.random() * 5) + 4;
        
        const patterns = [
            {
                question: `What comes next in this pattern: ${start}, ${start + step}, ${start + 2*step}, ${start + 3*step}, ___?`,
                answer: start + 4*step,
                hint: `Find what number is being added each time`,
                explanation: `Pattern adds ${step} each time. Next: ${start + 3*step} + ${step} = ${start + 4*step}`
            },
            {
                question: `In the pattern that starts ${start}, ${start + step}, ${start + 2*step}... what is the ${position}th number?`,
                answer: start + (position - 1) * step,
                hint: `The pattern adds ${step} each time`,
                explanation: `Position ${position}: ${start} + ${step} × ${position - 1} = ${start + (position - 1) * step}`
            }
        ];
        
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
};
