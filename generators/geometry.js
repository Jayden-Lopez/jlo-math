// Geometry Question Generator
window.GeometryGenerator = {
    generate: function() {
        const types = ['area', 'perimeter', 'volume', 'angles', 'coordinates'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        switch(type) {
            case 'area':
                return this.generateArea();
            case 'perimeter':
                return this.generatePerimeter();
            case 'volume':
                return this.generateVolume();
            case 'angles':
                return this.generateAngles();
            case 'coordinates':
                return this.generateCoordinates();
            default:
                return this.generateArea();
        }
    },
    
    generateArea: function() {
        const shapes = [
            {
                name: 'rectangle',
                generate: function() {
                    const length = Math.floor(Math.random() * 10) + 3;
                    const width = Math.floor(Math.random() * 10) + 3;
                    return {
                        question: `What is the area of a rectangle with length ${length} and width ${width}?`,
                        answer: length * width,
                        hint: "Area of rectangle = length × width",
                        explanation: `Area = ${length} × ${width} = ${length * width} square units`
                    };
                }
            },
            {
                name: 'square',
                generate: function() {
                    const side = Math.floor(Math.random() * 10) + 3;
                    return {
                        question: `What is the area of a square with side length ${side}?`,
                        answer: side * side,
                        hint: "Area of square = side × side",
                        explanation: `Area = ${side} × ${side} = ${side * side} square units`
                    };
                }
            },
            {
                name: 'triangle',
                generate: function() {
                    const base = Math.floor(Math.random() * 10) + 4;
                    const height = Math.floor(Math.random() * 8) + 3;
                    return {
                        question: `What is the area of a triangle with base ${base} and height ${height}?`,
                        answer: (base * height) / 2,
                        hint: "Area of triangle = (base × height) ÷ 2",
                        explanation: `Area = (${base} × ${height}) ÷ 2 = ${base * height} ÷ 2 = ${(base * height) / 2} square units`
                    };
                }
            }
        ];
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        return shape.generate();
    },
    
    generatePerimeter: function() {
        const shapes = [
            {
                name: 'rectangle',
                generate: function() {
                    const length = Math.floor(Math.random() * 10) + 3;
                    const width = Math.floor(Math.random() * 10) + 3;
                    return {
                        question: `What is the perimeter of a rectangle with length ${length} and width ${width}?`,
                        answer: 2 * (length + width),
                        hint: "Perimeter = 2 × (length + width)",
                        explanation: `Perimeter = 2 × (${length} + ${width}) = 2 × ${length + width} = ${2 * (length + width)} units`
                    };
                }
            },
            {
                name: 'square',
                generate: function() {
                    const side = Math.floor(Math.random() * 10) + 3;
                    return {
                        question: `What is the perimeter of a square with side length ${side}?`,
                        answer: 4 * side,
                        hint: "Perimeter of square = 4 × side",
                        explanation: `Perimeter = 4 × ${side} = ${4 * side} units`
                    };
                }
            },
            {
                name: 'triangle',
                generate: function() {
                    const side1 = Math.floor(Math.random() * 8) + 3;
                    const side2 = Math.floor(Math.random() * 8) + 3;
                    const side3 = Math.floor(Math.random() * 8) + 3;
                    return {
                        question: `What is the perimeter of a triangle with sides ${side1}, ${side2}, and ${side3}?`,
                        answer: side1 + side2 + side3,
                        hint: "Add all three sides together",
                        explanation: `Perimeter = ${side1} + ${side2} + ${side3} = ${side1 + side2 + side3} units`
                    };
                }
            }
        ];
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        return shape.generate();
    },
    
    generateVolume: function() {
        const shapes = [
            {
                name: 'box',
                generate: function() {
                    const length = Math.floor(Math.random() * 5) + 2;
                    const width = Math.floor(Math.random() * 5) + 2;
                    const height = Math.floor(Math.random() * 5) + 2;
                    return {
                        question: `A box has length ${length}, width ${width}, and height ${height}. What is its volume?`,
                        answer: length * width * height,
                        hint: "Volume = length × width × height",
                        explanation: `Volume = ${length} × ${width} × ${height} = ${length * width * height} cubic units`
                    };
                }
            },
            {
                name: 'cube',
                generate: function() {
                    const side = Math.floor(Math.random() * 6) + 2;
                    return {
                        question: `What is the volume of a cube with side length ${side}?`,
                        answer: side * side * side,
                        hint: "Volume of cube = side × side × side",
                        explanation: `Volume = ${side} × ${side} × ${side} = ${side * side * side} cubic units`
                    };
                }
            }
        ];
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        return shape.generate();
    },
    
    generateAngles: function() {
        const problems = [
            {
                generate: function() {
                    const angle1 = Math.floor(Math.random() * 60) + 30;
                    const angle2 = 180 - angle1;
                    return {
                        question: `Two angles on a straight line. One angle is ${angle1}°. What is the other angle?`,
                        answer: angle2,
                        hint: "Angles on a straight line add to 180°",
                        explanation: `180° - ${angle1}° = ${angle2}°`
                    };
                }
            },
            {
                generate: function() {
                    const angle = Math.floor(Math.random() * 40) + 20;
                    const complement = 90 - angle;
                    return {
                        question: `What is the complement of a ${angle}° angle?`,
                        answer: complement,
                        hint: "Complementary angles add to 90°",
                        explanation: `90° - ${angle}° = ${complement}°`
                    };
                }
            },
            {
                generate: function() {
                    const angle1 = Math.floor(Math.random() * 50) + 30;
                    const angle2 = Math.floor(Math.random() * 50) + 30;
                    const angle3 = 180 - angle1 - angle2;
                    return {
                        question: `A triangle has angles of ${angle1}° and ${angle2}°. What is the third angle?`,
                        answer: angle3,
                        hint: "Angles in a triangle add to 180°",
                        explanation: `180° - ${angle1}° - ${angle2}° = ${angle3}°`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    },
    
    generateCoordinates: function() {
        const problems = [
            {
                generate: function() {
                    const x1 = Math.floor(Math.random() * 10);
                    const y1 = Math.floor(Math.random() * 10);
                    const x2 = Math.floor(Math.random() * 10);
                    const y2 = Math.floor(Math.random() * 10);
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;
                    
                    return {
                        question: `Find the midpoint between points (${x1}, ${y1}) and (${x2}, ${y2})`,
                        answer: `(${midX}, ${midY})`,
                        hint: "Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2)",
                        explanation: `Midpoint = ((${x1} + ${x2})/2, (${y1} + ${y2})/2) = (${midX}, ${midY})`
                    };
                }
            },
            {
                generate: function() {
                    const x = Math.floor(Math.random() * 10) - 5;
                    const y = Math.floor(Math.random() * 10) - 5;
                    let quadrant;
                    
                    if (x > 0 && y > 0) quadrant = "I";
                    else if (x < 0 && y > 0) quadrant = "II";
                    else if (x < 0 && y < 0) quadrant = "III";
                    else if (x > 0 && y < 0) quadrant = "IV";
                    else quadrant = "on an axis";
                    
                    const options = ["I", "II", "III", "IV"];
                    let correct = options.indexOf(quadrant);
                    if (correct === -1) correct = 0; // Default if on axis
                    
                    return {
                        question: `In which quadrant is the point (${x}, ${y})?`,
                        options: options,
                        correct: correct,
                        hint: "Quadrant I: (+,+), II: (-,+), III: (-,-), IV: (+,-)",
                        explanation: `Point (${x}, ${y}) has ${x > 0 ? 'positive' : 'negative'} x and ${y > 0 ? 'positive' : 'negative'} y, so it's in Quadrant ${quadrant}`
                    };
                }
            }
        ];
        
        const problem = problems[Math.floor(Math.random() * problems.length)];
        return problem.generate();
    }
};
