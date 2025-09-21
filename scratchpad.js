// scratchpad.js - Fixed version with proper initialization
// This replaces your entire scratchpad.js file

class ScratchPad {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.isEraserMode = false;
        this.currentColor = '#2563eb';
        this.brushSize = 3;
        this.drawingHistory = [];
        this.currentPath = [];
    }

    // Get the HTML for the scratch pad
    getHTML() {
        return `
            <button id="scratchPadOpenBtn" onclick="scratchPad.show()" 
                    style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); 
                           color: #92400e; border: none; 
                           padding: 10px 20px; border-radius: 15px; cursor: pointer; 
                           font-weight: bold; margin-bottom: 15px;
                           box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                ✏️ Need Scratch Paper?
            </button>
            <div id="scratchPadContainer" style="display: none; background: #fffbf0; 
                 border: 2px dashed #fbbf24; border-radius: 15px; padding: 15px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="color: #92400e; font-weight: bold; font-size: 1.2em;">✏️ Scratch Pad</label>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button id="penBtn" onclick="scratchPad.setPenMode()" style="background: #10b981; color: white; border: none; 
                                padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: bold; box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);">
                            ✏️ Pen
                        </button>
                        <button id="eraserBtn" onclick="scratchPad.setEraserMode()" style="background: #fb923c; color: white; border: none; 
                                padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: bold;">
                            🧹 Eraser
                        </button>
                        <button onclick="scratchPad.undo()" style="background: #60a5fa; color: white; border: none; 
                                padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: bold;">
                            ↶ Undo
                        </button>
                        <button onclick="scratchPad.clear()" style="background: #fbbf24; color: #92400e; border: none; 
                                padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: bold;">
                            🗑️ Clear All
                        </button>
                        <button onclick="scratchPad.hide()" style="background: #f59e0b; color: white; border: none; 
                                padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: bold;">
                            ✕ Close
                        </button>
                    </div>
                </div>
                
                <!-- Color palette -->
                <div style="display: flex; gap: 5px; margin-bottom: 10px; flex-wrap: wrap; align-items: center;">
                    <button onclick="scratchPad.setColor('#2563eb')" style="width: 35px; height: 35px; background: #2563eb; 
                            border: 3px solid #1e40af; border-radius: 50%; cursor: pointer;" id="colorBlue"></button>
                    <button onclick="scratchPad.setColor('#000000')" style="width: 35px; height: 35px; background: #000000; 
                            border: 3px solid #333; border-radius: 50%; cursor: pointer;" id="colorBlack"></button>
                    <button onclick="scratchPad.setColor('#dc2626')" style="width: 35px; height: 35px; background: #dc2626; 
                            border: 3px solid #991b1b; border-radius: 50%; cursor: pointer;" id="colorRed"></button>
                    <button onclick="scratchPad.setColor('#16a34a')" style="width: 35px; height: 35px; background: #16a34a; 
                            border: 3px solid #14532d; border-radius: 50%; cursor: pointer;" id="colorGreen"></button>
                    <button onclick="scratchPad.setColor('#9333ea')" style="width: 35px; height: 35px; background: #9333ea; 
                            border: 3px solid #6b21a8; border-radius: 50%; cursor: pointer;" id="colorPurple"></button>
                    <div style="margin-left: 15px; display: flex; align-items: center; gap: 10px;">
                        <label style="color: #92400e; font-weight: bold;">Size:</label>
                        <input type="range" id="brushSizeRange" min="1" max="20" value="3" 
                               oninput="scratchPad.setBrushSize(this.value)"
                               style="width: 100px;">
                        <span id="brushSizeDisplay" style="color: #92400e; font-weight: bold;">3px</span>
                    </div>
                </div>
                
                <canvas id="scratchCanvas" style="border: 2px solid #fcd34d; border-radius: 10px; 
                        background: white; cursor: crosshair; display: block; width: 100%; height: 400px;
                        touch-action: none;"></canvas>
                
                <div style="margin-top: 10px; font-size: 0.9em; color: #92400e;">
                    💡 Tip: Use your finger or stylus to write! Switch between pen and eraser as needed.
                </div>
            </div>
        `;
    }

    // Show the scratch pad
    show() {
        const container = document.getElementById('scratchPadContainer');
        const button = document.getElementById('scratchPadOpenBtn');
        if (container && button) {
            container.style.display = 'block';
            button.style.display = 'none';
            // Important: Setup canvas after a short delay to ensure DOM is ready
            setTimeout(() => this.setupCanvas(), 100);
        }
    }

    // Hide the scratch pad
    hide() {
        const container = document.getElementById('scratchPadContainer');
        const button = document.getElementById('scratchPadOpenBtn');
        if (container && button) {
            container.style.display = 'none';
            button.style.display = 'block';
        }
    }

    // Setup canvas and event listeners
    setupCanvas() {
        this.canvas = document.getElementById('scratchCanvas');
        if (!this.canvas) {
            console.error('Canvas not found!');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on container
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = 400;
        
        // Set initial drawing styles
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeStyle = this.currentColor;
        
        // Remove any existing listeners
        this.canvas.onmousedown = null;
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
        this.canvas.onmouseout = null;
        this.canvas.ontouchstart = null;
        this.canvas.ontouchmove = null;
        this.canvas.ontouchend = null;
        
        // Add mouse event listeners
        this.canvas.onmousedown = (e) => this.startDrawing(e);
        this.canvas.onmousemove = (e) => this.draw(e);
        this.canvas.onmouseup = () => this.stopDrawing();
        this.canvas.onmouseout = () => this.stopDrawing();
        
        // Add touch event listeners for iPad
        this.canvas.ontouchstart = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const mouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            this.startDrawing(mouseEvent);
        };
        
        this.canvas.ontouchmove = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            this.draw(mouseEvent);
        };
        
        this.canvas.ontouchend = (e) => {
            e.preventDefault();
            this.stopDrawing();
        };
        
        console.log('Canvas setup complete');
    }

    // Get coordinates relative to canvas
    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    // Start drawing
    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoordinates(e);
        
        this.currentPath = [{
            x: coords.x,
            y: coords.y,
            color: this.currentColor,
            size: this.brushSize,
            isEraser: this.isEraserMode
        }];
        
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
    }

    // Draw on canvas
    draw(e) {
        if (!this.isDrawing) return;

        const coords = this.getCoordinates(e);
        
        this.ctx.globalCompositeOperation = this.isEraserMode ? 'destination-out' : 'source-over';
        this.ctx.strokeStyle = this.isEraserMode ? 'rgba(0,0,0,1)' : this.currentColor;
        this.ctx.lineWidth = this.isEraserMode ? this.brushSize * 3 : this.brushSize;
        
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
        
        this.currentPath.push({
            x: coords.x,
            y: coords.y,
            color: this.currentColor,
            size: this.brushSize,
            isEraser: this.isEraserMode
        });
    }

    // Stop drawing
    stopDrawing() {
        if (this.isDrawing && this.currentPath.length > 0) {
            this.drawingHistory.push([...this.currentPath]);
            if (this.drawingHistory.length > 50) {
                this.drawingHistory.shift();
            }
        }
        this.isDrawing = false;
        if (this.ctx) {
            this.ctx.beginPath();
        }
    }

    // Set pen mode
    setPenMode() {
        this.isEraserMode = false;
        if (this.canvas) {
            this.canvas.style.cursor = 'crosshair';
        }
        const penBtn = document.getElementById('penBtn');
        const eraserBtn = document.getElementById('eraserBtn');
        if (penBtn) penBtn.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)';
        if (eraserBtn) eraserBtn.style.boxShadow = 'none';
    }

    // Set eraser mode
    setEraserMode() {
        this.isEraserMode = true;
        if (this.canvas) {
            this.canvas.style.cursor = 'grab';
        }
        const penBtn = document.getElementById('penBtn');
        const eraserBtn = document.getElementById('eraserBtn');
        if (eraserBtn) eraserBtn.style.boxShadow = '0 0 10px rgba(251, 146, 60, 0.3)';
        if (penBtn) penBtn.style.boxShadow = 'none';
    }

    // Set pen color
    setColor(color) {
        this.currentColor = color;
        this.setPenMode(); // Switch to pen mode when selecting a color
    }

    // Set brush size
    setBrushSize(size) {
        this.brushSize = parseInt(size);
        const display = document.getElementById('brushSizeDisplay');
        if (display) {
            display.textContent = size + 'px';
        }
    }

    // Undo last stroke
    undo() {
        if (this.drawingHistory.length > 0) {
            this.drawingHistory.pop();
            this.redrawCanvas();
        }
    }

    // Clear entire canvas
    clear() {
        if (confirm('Are you sure you want to clear the entire scratch pad?')) {
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            this.drawingHistory = [];
        }
    }

    // Redraw canvas from history
    redrawCanvas() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawingHistory.forEach(path => {
            if (path.length === 0) return;
            
            for (let i = 0; i < path.length - 1; i++) {
                const point = path[i];
                const nextPoint = path[i + 1];
                
                this.ctx.globalCompositeOperation = point.isEraser ? 'destination-out' : 'source-over';
                this.ctx.strokeStyle = point.isEraser ? 'rgba(0,0,0,1)' : point.color;
                this.ctx.lineWidth = point.isEraser ? point.size * 3 : point.size;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                
                this.ctx.beginPath();
                this.ctx.moveTo(point.x, point.y);
                this.ctx.lineTo(nextPoint.x, nextPoint.y);
                this.ctx.stroke();
            }
        });
    }
}

// Create global instance
const scratchPad = new ScratchPad();

// FIX FOR REPEATING QUESTIONS
// Add this to your app.js or replace the existing nextQuestion function
if (typeof nextQuestion === 'undefined') {
    window.nextQuestion = function() {
        // Clear the scratch pad for new question
        if (scratchPad.ctx && scratchPad.canvas) {
            scratchPad.ctx.clearRect(0, 0, scratchPad.canvas.width, scratchPad.canvas.height);
            scratchPad.drawingHistory = [];
        }
        
        currentQuestionIndex++;
        showQuestion();
        
        // Re-enable submit button for new question
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    };
}
