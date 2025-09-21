// Measurement Question Generator
window.MeasurementGenerator = {
    generate: function() {
        const types = ['length', 'weight', 'time', 'temperature', 'capacity'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'length':
                return this.generateLength();
            case 'weight':
                return this.generateWeight();
            case 'time':
                return this.generateTime();
            case 'temperature':
                return this.generateTemperature();
            case 'capacity':
                return this.generateCapacity();
            default:
                return this.generateLength();
        }
    },
    
    generateLength: function() {
        const problems = [
            {
                generate: function() {
                    const feet = Math.floor(Math.random() * 10) + 3;
                    return {
                        question: `Convert ${feet} feet to inches`,
                        answer: feet * 12,
                        hint: "1 foot = 12 inches",
                        explanation: `${feet} feet × 12 inches/foot = ${feet * 12} inches`
                    };
                }
            },
            {
                generate: function() {
                    const meters = Math.floor(Math.random() * 5) + 2;
                    return {
                        question: `Convert ${meters} meters to centimeters`,
                        answer: meters * 100,
                        hint: "1 meter = 100 centimeters",
                        explanation: `${meters} meters × 100 cm/meter = ${meters * 100} cm`
                    };
                }
            },
            {
                generate: function() {
                    const yards = Math.floor(Math.random() * 8) + 2;
                    return {
                        question: `Convert ${yards} yards to feet`,
                        answer: yards * 3,
                        hint: "1 yard = 3 feet",
                        explanation: `${yards} yards × 3 feet/yard = ${yards * 3} feet`
                    };
                }
            },
            {
                generate: function() {
                    const km = Math.floor(Math.random() * 5) + 1;
                    return {
                        question: `Convert ${km} kilometers to meters`,
                        answer: km * 1000,
                        hint: "1 kilometer = 1000 meters",
                        explanation: `${km} km × 1000 m/km = ${km * 1000} meters`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateWeight: function() {
        const problems = [
            {
                generate: function() {
                    const pounds = Math.floor(Math.random() * 10) + 2;
                    return {
                        question: `Convert ${pounds} pounds to ounces`,
                        answer: pounds * 16,
                        hint: "1 pound = 16 ounces",
                        explanation: `${pounds} pounds × 16 oz/pound = ${pounds * 16} ounces`
                    };
                }
            },
            {
                generate: function() {
                    const kg = Math.floor(Math.random() * 5) + 2;
                    return {
                        question: `Convert ${kg} kilograms to grams`,
                        answer: kg * 1000,
                        hint: "1 kilogram = 1000 grams",
                        explanation: `${kg} kg × 1000 g/kg = ${kg * 1000} grams`
                    };
                }
            },
            {
                generate: function() {
                    const tons = Math.floor(Math.random() * 3) + 1;
                    return {
                        question: `Convert ${tons} tons to pounds`,
                        answer: tons * 2000,
                        hint: "1 ton = 2000 pounds",
                        explanation: `${tons} tons × 2000 pounds/ton = ${tons * 2000} pounds`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateTime: function() {
        const problems = [
            {
                generate: function() {
                    const hours = Math.floor(Math.random() * 5) + 2;
                    return {
                        question: `Convert ${hours} hours to minutes`,
                        answer: hours * 60,
                        hint: "1 hour = 60 minutes",
                        explanation: `${hours} hours × 60 minutes/hour = ${hours * 60} minutes`
                    };
                }
            },
            {
                generate: function() {
                    const minutes = Math.floor(Math.random() * 10) + 2;
                    return {
                        question: `Convert ${minutes} minutes to seconds`,
                        answer: minutes * 60,
                        hint: "1 minute = 60 seconds",
                        explanation: `${minutes} minutes × 60 seconds/minute = ${minutes * 60} seconds`
                    };
                }
            },
            {
                generate: function() {
                    const days = Math.floor(Math.random() * 7) + 2;
                    return {
                        question: `Convert ${days} days to hours`,
                        answer: days * 24,
                        hint: "1 day = 24 hours",
                        explanation: `${days} days × 24 hours/day = ${days * 24} hours`
                    };
                }
            },
            {
                generate: function() {
                    const weeks = Math.floor(Math.random() * 4) + 2;
                    return {
                        question: `Convert ${weeks} weeks to days`,
                        answer: weeks * 7,
                        hint: "1 week = 7 days",
                        explanation: `${weeks} weeks × 7 days/week = ${weeks * 7} days`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateTemperature: function() {
        const problems = [
            {
                generate: function() {
                    const celsius = Math.floor(Math.random() * 30) + 10;
                    const fahrenheit = Math.round(celsius * 9/5 + 32);
                    return {
                        question: `Convert ${celsius}°C to Fahrenheit`,
                        answer: fahrenheit,
                        hint: "F = (C × 9/5) + 32",
                        explanation: `F = (${celsius} × 9/5) + 32 = ${Math.round(celsius * 9/5)} + 32 = ${fahrenheit}°F`
                    };
                }
            },
            {
                generate: function() {
                    const fahrenheit = Math.floor(Math.random() * 20) + 60;
                    const celsius = Math.round((fahrenheit - 32) * 5/9);
                    return {
                        question: `Convert ${fahrenheit}°F to Celsius`,
                        answer: celsius,
                        hint: "C = (F - 32) × 5/9",
                        explanation: `C = (${fahrenheit} - 32) × 5/9 = ${fahrenheit - 32} × 5/9 = ${celsius}°C`
                    };
                }
            },
            {
                generate: function() {
                    const temp = Math.floor(Math.random() * 50) - 20;
                    const options = ["Hot", "Warm", "Cool", "Cold"];
                    let correct;
                    
                    if (temp > 30) correct = 0; // Hot
                    else if (temp > 20) correct = 1; // Warm
                    else if (temp > 10) correct = 2; // Cool
                    else correct = 3; // Cold
                    
                    return {
                        question: `If the temperature is ${temp}°C, how would you describe the weather?`,
                        options: options,
                        correct: correct,
                        hint: "Think about what you'd wear at this temperature",
                        explanation: `${temp}°C is ${options[correct].toLowerCase()} weather`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateCapacity: function() {
        const problems = [
            {
                generate: function() {
                    const gallons = Math.floor(Math.random() * 5) + 2;
                    return {
                        question: `Convert ${gallons} gallons to quarts`,
                        answer: gallons * 4,
                        hint: "1 gallon = 4 quarts",
                        explanation: `${gallons} gallons × 4 quarts/gallon = ${gallons * 4} quarts`
                    };
                }
            },
            {
                generate: function() {
                    const liters = Math.floor(Math.random() * 5) + 2;
                    return {
                        question: `Convert ${liters} liters to milliliters`,
                        answer: liters * 1000,
                        hint: "1 liter = 1000 milliliters",
                        explanation: `${liters} L × 1000 mL/L = ${liters * 1000} mL`
                    };
                }
            },
            {
                generate: function() {
                    const cups = Math.floor(Math.random() * 8) + 4;
                    return {
                        question: `Convert ${cups} cups to pints`,
                        answer: cups / 2,
                        hint: "2 cups = 1 pint",
                        explanation: `${cups} cups ÷ 2 cups/pint = ${cups / 2} pints`
                    };
                }
            },
            {
                generate: function() {
                    const quarts = Math.floor(Math.random() * 8) + 2;
                    return {
                        question: `Convert ${quarts} quarts to cups`,
                        answer: quarts * 4,
                        hint: "1 quart = 4 cups",
                        explanation: `${quarts} quarts × 4 cups/quart = ${quarts * 4} cups`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    }
};
