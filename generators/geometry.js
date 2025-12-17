// geometry.js - Glencoe Math Course 1, Chapters 9-10: Area & Volume
// For Jordan - 6th grade
// Lessons follow Glencoe Course 1 Chapters 9-10 sequence

window.GeometryGenerator = {
    // Lesson structure for sequential learning (Chapters 9 & 10 combined)
    lessons: [
        { id: '9.1', name: 'Area of Parallelograms', types: ['areaParallelogram'] },
        { id: '9.2', name: 'Area of Triangles', types: ['areaTriangle'] },
        { id: '9.3', name: 'Area of Trapezoids', types: ['areaTrapezoid'] },
        { id: '9.4', name: 'Polygons on the Coordinate Plane', types: ['polygonCoordinate'] },
        { id: '9.5', name: 'Area of Composite Figures', types: ['areaComplex'] },
        { id: '10.1', name: 'Volume of Rectangular Prisms', types: ['volumePrism'] },
        { id: '10.2', name: 'Surface Area of Rectangular Prisms', types: ['surfaceArea'] },
        { id: '10.3', name: 'Volume of Triangular Prisms', types: ['volumeTriangularPrism'] },
        { id: '10.4', name: 'Surface Area of Triangular Prisms', types: ['surfaceAreaTriangular'] },
        { id: '10.5', name: 'Volume of Pyramids', types: ['volumePyramid'] }
    ],

    getCurrentLesson: function() {
        const userData = window.userData;
        if (!userData) return 0;
        const chapterProgress = userData.lessonProgress?.['chapter9'] || { currentLesson: 0 };
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
            case 'areaParallelogram':
                problem = this.generateAreaParallelogram();
                break;
            case 'areaTriangle':
                problem = this.generateAreaTriangle();
                break;
            case 'areaTrapezoid':
                problem = this.generateAreaTrapezoid();
                break;
            case 'polygonCoordinate':
                problem = this.generatePolygonCoordinate();
                break;
            case 'areaComplex':
                problem = this.generateAreaComplex();
                break;
            case 'volumePrism':
                problem = this.generateVolumePrism();
                break;
            case 'surfaceArea':
                problem = this.generateSurfaceArea();
                break;
            case 'volumeTriangularPrism':
                problem = this.generateVolumeTriangularPrism();
                break;
            case 'surfaceAreaTriangular':
                problem = this.generateSurfaceAreaTriangular();
                break;
            case 'volumePyramid':
                problem = this.generateVolumePyramid();
                break;
            default:
                problem = this.generateAreaTriangle();
        }

        problem.lesson = lesson.id;
        problem.lessonName = lesson.name;
        return problem;
    },

    // Lesson 9.1: Area of Parallelograms
    generateAreaParallelogram: function() {
        const base = Math.floor(Math.random() * 12) + 4;
        const height = Math.floor(Math.random() * 10) + 3;
        const area = base * height;

        return {
            question: `Find the area of a parallelogram with base = ${base} cm and height = ${height} cm`,
            answer: `${area} square cm`,
            hint: "Area of parallelogram = base × height",
            explanation: `A = base × height = ${base} × ${height} = ${area} square cm`
        };
    },

    // Lesson 9.3: Area of Trapezoids
    generateAreaTrapezoid: function() {
        const b1 = Math.floor(Math.random() * 10) + 4;
        const b2 = Math.floor(Math.random() * 10) + 4;
        const height = Math.floor(Math.random() * 8) + 3;
        const area = ((b1 + b2) * height) / 2;

        return {
            question: `Find the area of a trapezoid with bases ${b1} m and ${b2} m, and height ${height} m`,
            answer: `${area} square meters`,
            hint: "Area = ½ × (base₁ + base₂) × height",
            explanation: `A = ½ × (${b1} + ${b2}) × ${height} = ½ × ${b1 + b2} × ${height} = ${area} square meters`
        };
    },

    // Lesson 9.4: Polygons on Coordinate Plane
    generatePolygonCoordinate: function() {
        // Simple rectangle on coordinate plane
        const x1 = Math.floor(Math.random() * 3) + 1;
        const y1 = Math.floor(Math.random() * 3) + 1;
        const width = Math.floor(Math.random() * 6) + 2;
        const height = Math.floor(Math.random() * 5) + 2;

        const x2 = x1 + width;
        const y2 = y1 + height;

        const area = width * height;

        return {
            question: `A rectangle has corners at (${x1}, ${y1}), (${x2}, ${y1}), (${x2}, ${y2}), and (${x1}, ${y2}).\nFind its area.`,
            answer: `${area} square units`,
            hint: "Find the length and width by counting units on each side",
            explanation: `Width = ${x2} - ${x1} = ${width}, Height = ${y2} - ${y1} = ${height}\nArea = ${width} × ${height} = ${area} square units`
        };
    },

    // Lesson 10.3: Volume of Triangular Prisms
    generateVolumeTriangularPrism: function() {
        const base = Math.floor(Math.random() * 8) + 3;
        const triHeight = Math.floor(Math.random() * 6) + 3;
        const length = Math.floor(Math.random() * 10) + 4;
        const triangleArea = (base * triHeight) / 2;
        const volume = triangleArea * length;

        return {
            question: `Find the volume of a triangular prism:\nTriangle base = ${base} cm, triangle height = ${triHeight} cm, prism length = ${length} cm`,
            answer: `${volume} cubic cm`,
            hint: "V = (½ × base × height) × length = triangle area × length",
            explanation: `Triangle area = ½ × ${base} × ${triHeight} = ${triangleArea} sq cm\nVolume = ${triangleArea} × ${length} = ${volume} cubic cm`
        };
    },

    // Lesson 10.4: Surface Area of Triangular Prisms
    generateSurfaceAreaTriangular: function() {
        const base = Math.floor(Math.random() * 6) + 3;
        const triHeight = Math.floor(Math.random() * 5) + 3;
        const length = Math.floor(Math.random() * 8) + 4;
        // Simplified: assume right triangle with legs = base and triHeight
        const hyp = Math.round(Math.sqrt(base * base + triHeight * triHeight));

        const triangleArea = (base * triHeight) / 2;
        // 2 triangles + 3 rectangles (base×length, triHeight×length, hyp×length)
        const sa = 2 * triangleArea + (base * length) + (triHeight * length) + (hyp * length);

        return {
            question: `A triangular prism has triangle base = ${base} cm, triangle height = ${triHeight} cm, and length = ${length} cm.\nFind the surface area. (The third side of the triangle is approximately ${hyp} cm)`,
            answer: `${sa} square cm`,
            hint: "SA = 2(triangle areas) + 3(rectangle areas)",
            explanation: `2 triangles = 2 × ${triangleArea} = ${2 * triangleArea}\n3 rectangles = ${base * length} + ${triHeight * length} + ${hyp * length}\nTotal SA = ${sa} square cm`
        };
    },
    
    // Basic Angle Concepts
    generateAngles: function() {
        const types = ['classify', 'complementary', 'supplementary'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'classify') {
            const angle = Math.floor(Math.random() * 180) + 1;
            let classification;
            if (angle < 90) classification = "acute";
            else if (angle === 90) classification = "right";
            else if (angle < 180) classification = "obtuse";
            else classification = "straight";
            
            return {
                question: `Classify an angle that measures ${angle}°`,
                answer: classification,
                hint: "Acute < 90°, Right = 90°, Obtuse > 90° but < 180°, Straight = 180°",
                explanation: `${angle}° is ${classification} because it is ${angle < 90 ? "less than 90°" : angle === 90 ? "exactly 90°" : angle < 180 ? "between 90° and 180°" : "exactly 180°"}`
            };
        } else if (type === 'complementary') {
            const angle1 = Math.floor(Math.random() * 80) + 10;
            const angle2 = 90 - angle1;
            
            return {
                question: `If two complementary angles and one measures ${angle1}°, what is the other angle?`,
                answer: `${angle2}°`,
                hint: "Complementary angles add up to 90°",
                explanation: `90° - ${angle1}° = ${angle2}°`
            };
        } else {
            const angle1 = Math.floor(Math.random() * 170) + 10;
            const angle2 = 180 - angle1;
            
            return {
                question: `If two supplementary angles and one measures ${angle1}°, what is the other angle?`,
                answer: `${angle2}°`,
                hint: "Supplementary angles add up to 180°",
                explanation: `180° - ${angle1}° = ${angle2}°`
            };
        }
    },
    
    // Triangle Properties
    generateTriangles: function() {
        const types = ['classify', 'angleSum'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'classify') {
            const triangles = [
                { sides: "3 equal sides", name: "equilateral" },
                { sides: "2 equal sides", name: "isosceles" },
                { sides: "no equal sides", name: "scalene" }
            ];
            const triangle = triangles[Math.floor(Math.random() * triangles.length)];
            
            return {
                question: `What type of triangle has ${triangle.sides}?`,
                answer: triangle.name,
                hint: "Equilateral = all equal, Isosceles = 2 equal, Scalene = none equal",
                explanation: `A triangle with ${triangle.sides} is called ${triangle.name}`
            };
        } else {
            const angle1 = Math.floor(Math.random() * 60) + 20;
            const angle2 = Math.floor(Math.random() * 60) + 20;
            const angle3 = 180 - angle1 - angle2;
            
            return {
                question: `A triangle has angles of ${angle1}° and ${angle2}°. What is the third angle?`,
                answer: `${angle3}°`,
                hint: "The sum of angles in a triangle is 180°",
                explanation: `180° - ${angle1}° - ${angle2}° = ${angle3}°`
            };
        }
    },
    
    // Quadrilateral Properties (Jordan's IXL need: parallel sides)
    generateQuadrilaterals: function() {
        const shapes = [
            { name: "square", parallel: "2 pairs", properties: "4 equal sides, 4 right angles" },
            { name: "rectangle", parallel: "2 pairs", properties: "opposite sides equal, 4 right angles" },
            { name: "parallelogram", parallel: "2 pairs", properties: "opposite sides equal and parallel" },
            { name: "trapezoid", parallel: "1 pair", properties: "exactly one pair of parallel sides" },
            { name: "rhombus", parallel: "2 pairs", properties: "4 equal sides, opposite sides parallel" }
        ];
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        return {
            question: `How many pairs of parallel sides does a ${shape.name} have?`,
            answer: shape.parallel,
            hint: `A ${shape.name} has ${shape.properties}`,
            explanation: `A ${shape.name} has ${shape.parallel} of parallel sides`
        };
    },
    
    // Perimeter
    generatePerimeter: function() {
        const shapes = ['rectangle', 'square', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        if (shape === 'rectangle') {
            const length = Math.floor(Math.random() * 20) + 5;
            const width = Math.floor(Math.random() * 15) + 3;
            const perimeter = 2 * (length + width);
            
            return {
                question: `Find the perimeter of a rectangle: length = ${length} cm, width = ${width} cm`,
                answer: `${perimeter} cm`,
                hint: "P = 2(length + width)",
                explanation: `P = 2(${length} + ${width}) = 2 × ${length + width} = ${perimeter} cm`
            };
        } else if (shape === 'square') {
            const side = Math.floor(Math.random() * 15) + 5;
            const perimeter = 4 * side;
            
            return {
                question: `Find the perimeter of a square with side length ${side} m`,
                answer: `${perimeter} m`,
                hint: "P = 4 × side",
                explanation: `P = 4 × ${side} = ${perimeter} m`
            };
        } else {
            const a = Math.floor(Math.random() * 10) + 5;
            const b = Math.floor(Math.random() * 10) + 5;
            const c = Math.floor(Math.random() * 10) + 5;
            const perimeter = a + b + c;
            
            return {
                question: `Find the perimeter of a triangle with sides ${a} ft, ${b} ft, and ${c} ft`,
                answer: `${perimeter} ft`,
                hint: "Add all three sides",
                explanation: `P = ${a} + ${b} + ${c} = ${perimeter} ft`
            };
        }
    },
    
    // Area of Rectangles
    generateAreaRectangle: function() {
        const length = Math.floor(Math.random() * 15) + 5;
        const width = Math.floor(Math.random() * 12) + 3;
        const area = length * width;
        
        return {
            question: `Find the area of a rectangle: length = ${length} m, width = ${width} m`,
            answer: `${area} square meters`,
            hint: "Area = length × width",
            explanation: `A = ${length} × ${width} = ${area} square meters`
        };
    },
    
    // Area of Triangles
    generateAreaTriangle: function() {
        const base = Math.floor(Math.random() * 12) + 4;
        const height = Math.floor(Math.random() * 10) + 3;
        const area = (base * height) / 2;
        
        return {
            question: `Find the area of a triangle: base = ${base} cm, height = ${height} cm`,
            answer: `${area} square cm`,
            hint: "Area = ½ × base × height",
            explanation: `A = ½ × ${base} × ${height} = ${base * height}/2 = ${area} square cm`
        };
    },
    
    // Complex Area (composite figures)
    generateAreaComplex: function() {
        const rect1Length = Math.floor(Math.random() * 10) + 5;
        const rect1Width = Math.floor(Math.random() * 8) + 3;
        const rect2Length = Math.floor(Math.random() * 8) + 4;
        const rect2Width = Math.floor(Math.random() * 6) + 2;
        
        const area1 = rect1Length * rect1Width;
        const area2 = rect2Length * rect2Width;
        const totalArea = area1 + area2;
        
        return {
            question: `Find the total area of a figure made of two rectangles:\nRectangle 1: ${rect1Length}m × ${rect1Width}m\nRectangle 2: ${rect2Length}m × ${rect2Width}m`,
            answer: `${totalArea} square meters`,
            hint: "Find each area separately, then add",
            explanation: `Area 1 = ${rect1Length} × ${rect1Width} = ${area1}\nArea 2 = ${rect2Length} × ${rect2Width} = ${area2}\nTotal = ${area1} + ${area2} = ${totalArea} square meters`
        };
    },
    
    // Volume of Rectangular Prisms (Jordan's IXL topic)
    generateVolumePrism: function() {
        const length = Math.floor(Math.random() * 10) + 2;
        const width = Math.floor(Math.random() * 8) + 2;
        const height = Math.floor(Math.random() * 6) + 2;
        const volume = length * width * height;
        
        return {
            question: `Find the volume of a rectangular prism: length = ${length} cm, width = ${width} cm, height = ${height} cm`,
            answer: `${volume} cubic cm`,
            hint: "Volume = length × width × height",
            explanation: `V = ${length} × ${width} × ${height} = ${volume} cubic cm`
        };
    },
    
    // Volume of Pyramids
    generateVolumePyramid: function() {
        const baseLength = Math.floor(Math.random() * 10) + 3;
        const baseWidth = Math.floor(Math.random() * 10) + 3;
        const height = Math.floor(Math.random() * 8) + 4;
        const baseArea = baseLength * baseWidth;
        const volume = (baseArea * height) / 3;
        
        return {
            question: `Find the volume of a pyramid with rectangular base ${baseLength}m × ${baseWidth}m and height ${height}m`,
            answer: `${volume.toFixed(1)} cubic meters`,
            hint: "Volume = ⅓ × base area × height",
            explanation: `Base area = ${baseLength} × ${baseWidth} = ${baseArea}\nV = ⅓ × ${baseArea} × ${height} = ${volume.toFixed(1)} cubic meters`
        };
    },
    
    // Surface Area
    generateSurfaceArea: function() {
        const length = Math.floor(Math.random() * 8) + 2;
        const width = Math.floor(Math.random() * 6) + 2;
        const height = Math.floor(Math.random() * 5) + 2;

        const sa = 2 * (length * width + length * height + width * height);

        return {
            question: `Find the surface area of a rectangular prism: length = ${length} cm, width = ${width} cm, height = ${height} cm`,
            answer: `${sa} square cm`,
            hint: "SA = 2(lw + lh + wh)",
            explanation: `SA = 2(${length}×${width} + ${length}×${height} + ${width}×${height}) = 2(${length*width} + ${length*height} + ${width*height}) = ${sa} square cm`
        };
    },

    checkLessonProgress: function(lessonId, isCorrect) {
        const userData = window.userData;
        if (!userData) return;

        if (!userData.lessonProgress) userData.lessonProgress = {};
        if (!userData.lessonProgress['chapter9']) {
            userData.lessonProgress['chapter9'] = { currentLesson: 0, lessonMastery: {} };
        }

        const progress = userData.lessonProgress['chapter9'];
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
