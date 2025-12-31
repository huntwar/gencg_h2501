// ================= CONFIG =================
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const CELL = 2;               // grain size (smaller = more sand)
const GRAVITY = 1;

// ================= GRID =================
let cols, rows;
let grid;
let nextGrid;

// ================= TASK DATA =================
let words = [];
let activeWordIndex = 0;
let myCanvas;

// ================= SETUP =================
function setup() {
    // canvas created on demand
}

// ================= HTML TRIGGER =================
window.setupVisualization = () => {
    if (!myCanvas) {
        myCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        myCanvas.parent("p5-container");
    }

    cols = floor(width / CELL);
    rows = floor(height / CELL);

    grid = createGrid();
    nextGrid = createGrid();

    words = [];
    activeWordIndex = 0;

    const taskCount = window.getTaskCount();

    for (let i = 1; i <= taskCount; i++) {
        const name = document.getElementById(`task-name-${i}`).value;
        if (!name) continue;
        words.push(name.toUpperCase());
    }

    background(240);
    loop();
};

// ================= GRID HELPERS =================
function createGrid() {
    let arr = new Array(cols);
    for (let x = 0; x < cols; x++) {
        arr[x] = new Array(rows).fill(null);
    }
    return arr;
}

// ================= DRAW LOOP =================
function draw() {
    background(240);

    // spawn next word
    if (frameCount % 50 === 0 && activeWordIndex < words.length) {
        spawnWord(words[activeWordIndex]);
        activeWordIndex++;
    }

    updateSand();
    drawSand();

    if (activeWordIndex >= words.length && isGridSettled()) {
        noLoop();
    }
}

// ================= SAND PHYSICS =================
function updateSand() {
    nextGrid = createGrid();

    for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
            const grain = grid[x][y];
            if (!grain) continue;

            let moved = false;

            // down
            if (y + 1 < rows && !grid[x][y + 1]) {
                nextGrid[x][y + 1] = grain;
                moved = true;
            }
            // down-left
            else if (x > 0 && y + 1 < rows && !grid[x - 1][y + 1]) {
                nextGrid[x - 1][y + 1] = grain;
                moved = true;
            }
            // down-right
            else if (x < cols - 1 && y + 1 < rows && !grid[x + 1][y + 1]) {
                nextGrid[x + 1][y + 1] = grain;
                moved = true;
            }

            if (!moved) {
                nextGrid[x][y] = grain;
            }
        }
    }

    grid = nextGrid;
}

// ================= DRAW =================
function drawSand() {
    noStroke();
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const grain = grid[x][y];
            if (grain) {
                fill(grain.color);
                rect(x * CELL, y * CELL, CELL, CELL);
            }
        }
    }
}

// ================= WORD → SAND =================
function spawnWord(word) {
    const gfx = createGraphics(width, 80);
    gfx.pixelDensity(1);
    gfx.background(0, 0);
    gfx.fill(255);
    gfx.textAlign(CENTER, CENTER);
    gfx.textSize(64);
    gfx.text(word, width / 2, 40);

    gfx.loadPixels();

    const col = color(random(80,255), random(80,255), random(80,255));

    for (let x = 0; x < gfx.width; x += CELL) {
        for (let y = 0; y < gfx.height; y += CELL) {
            const i = 4 * (y * gfx.width + x);
            if (gfx.pixels[i] > 200) {
                const gx = floor(x / CELL);
                const gy = floor(y / CELL);
                if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
                    grid[gx][gy] = { color: col };
                }
            }
        }
    }
}

// ================= UTILS =================
function isGridSettled() {
    for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[x][y] && !grid[x][y + 1]) return false;
        }
    }
    return true;
}
