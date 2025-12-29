/* =========================================================
   TIME SAND
   =========================================================
   
*/

/* ---------------- UI STATE ---------------- */

// This array will hold the validated task objects used
// by the visualization
let tasks = [];

// Cache all the DOM elements I need to interact with
const tasksContainer = document.getElementById("tasks-container");
const legendPanel = document.getElementById("legend-panel");
const trackerPanel = document.getElementById("tracker-panel");
const legendItems = document.getElementById("legend-items");

// Button bindings
document.getElementById("add-task-btn").onclick = () => addTask();
document.getElementById("calculate-btn").onclick = calculate;
document.getElementById("reset-btn").onclick = resetAll;

// Start with one empty task row by default
addTask();

/* ---------------- HOURS GUARD ---------------- */

/**
 * Calculates the total number of hours currently entered.
 * This is used to prevent exceeding the 168 hours available
 * in a single week.
 */
function getTotalHours() {
    let total = 0;
    const rows = document.querySelectorAll(".task-row");

    rows.forEach(r => {
        const h = parseInt(r.children[1].value);
        if (!isNaN(h)) total += h;
    });

    return total;
}

/* ---------------- TASK UI ---------------- */

/**
 * Adds a new task row to the UI.
 * Before creating it, I check whether the user has already
 * allocated all 168 weekly hours.
 */
function addTask(name = "", hours = "") {

    // Block adding new tasks if the week is already full
    if (getTotalHours() >= 168) {
        alert(
            "You already allocated all 168 hours of the week. " +
            "Remove or edit a task to continue."
        );
        return;
    }

    const row = document.createElement("div");
    row.className = "task-row";

    // Task name, hours input, and remove button
    row.innerHTML = `
        <input type="text" placeholder="Task name" value="${name}">
        <input type="number" min="1" step="1" placeholder="hrs/week" value="${hours}">
        <button>−</button>
    `;

    // Remove the task row when the minus button is clicked
    row.querySelector("button").onclick = () => {
        tasksContainer.removeChild(row);
    };

    // Limit the UI to a maximum of 7 tasks
    if (tasksContainer.children.length < 7) {
        tasksContainer.appendChild(row);
    } else {
        alert("Maximum of 7 tasks allowed.");
    }
}

/**
 * Reads all task rows, validates them, and launches
 * the visualization if everything is valid.
 */
function calculate() {
    tasks = [];
    const rows = document.querySelectorAll(".task-row");

    // Build the task list from the UI
    rows.forEach(r => {
        const name = r.children[0].value.trim();
        const hours = parseInt(r.children[1].value);

        // Skip incomplete rows
        if (!name || !hours) return;

        tasks.push({
            name,
            hours,
            color: randomColor()
        });
    });

    if (!tasks.length) return;

    // Final safety check to ensure we never exceed 168 hours
    const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
    if (totalHours > 168) {
        alert(`Your total is ${totalHours} hours. A week only has 168 hours.`);
        return;
    }

    // Swap UI panels and start the visualization
    trackerPanel.classList.add("hidden");
    legendPanel.classList.remove("hidden");

    buildLegend();
    startVisualization(tasks);
}

/**
 * Builds the color legend that matches tasks to sand colors.
 */
function buildLegend() {
    legendItems.innerHTML = "";

    tasks.forEach(t => {
        const div = document.createElement("div");
        div.className = "legend-item";
        div.innerHTML = `
            <div class="legend-color" style="background:${t.color}"></div>
            ${t.name} — ${t.hours} hrs/week
        `;
        legendItems.appendChild(div);
    });
}

/**
 * Resets both the UI and the visualization state.
 */
function resetAll() {
    tasks = [];
    legendItems.innerHTML = "";
    tasksContainer.innerHTML = "";

    // Restore a single empty task row
    addTask();

    legendPanel.classList.add("hidden");
    trackerPanel.classList.remove("hidden");

    resetVisualization();
}

/* ---------------- P5 UTIL ---------------- */

// Expose p5's color() so I can safely use it outside setup()
window.p5Color = (...args) => color(...args);

/**
 * Generates a soft random color for task visualization.
 */
function randomColor() {
    return window.p5Color(
        Math.random() * 200 + 30,
        Math.random() * 200 + 30,
        Math.random() * 200 + 30
    );
}

/* =========================================================
   P5.JS — SAND VISUALIZATION
   ========================================================= */

// Size of each sand cell
const CELL = 4;

let cols, rows;
let canvas;
let grains = [];

// Task sequencing state
let taskQueue = [];
let currentTaskIndex = 0;
let phase = "idle"; // "show" → "fall"
let phaseStartTime = 0;

// Timing constants
const SHOW_DURATION = 1500;
const FALL_DURATION = 2000;

/* ---------------- P5 SETUP ---------------- */

function setup() {
    // I manually control draw() with loop()/noLoop()
    noLoop();
}

/* ---------------- START / RESET ---------------- */

/**
 * Initializes the visualization with the validated task data.
 */
function startVisualization(taskData) {
    if (!canvas) {
        canvas = createCanvas(700, 700);
        canvas.parent("p5-container");
    }

    cols = floor(width / CELL);
    rows = floor(height / CELL);
    grains = [];

    // Assign each task a fixed horizontal position
    taskQueue = taskData.map(t => ({
        ...t,
        x: random(width * 0.2, width * 0.8)
    }));

    currentTaskIndex = 0;
    phase = "show";
    phaseStartTime = millis();

    background(240);
    loop();
}

/**
 * Clears the canvas and stops animation.
 */
function resetVisualization() {
    noLoop();
    grains = [];
    clear();
    background(240);
}

/* ---------------- WORD DISPLAY ---------------- */

/**
 * Displays the task name before it turns into sand.
 */
function drawWord(task, yOffset) {
    fill(task.color);
    textAlign(CENTER, CENTER);
    textSize(48);
    text(task.name, task.x, yOffset + 40);
}

/* ---------------- WORD → SAND ---------------- */

/**
 * Converts the rendered text into sand particles.
 * The number of grains is proportional to the task's hours.
 */
function createWordSand(task, yOffset) {
    const gfx = createGraphics(width, 80);
    gfx.pixelDensity(1);
    gfx.clear();

    gfx.fill(task.color);
    gfx.textAlign(CENTER, CENTER);
    gfx.textSize(48);
    gfx.text(task.name, task.x, 40);

    gfx.loadPixels();

    const density = task.hours * 2;

    for (let x = 0; x < gfx.width; x += CELL) {
        for (let y = 0; y < gfx.height; y += CELL) {
            const idx = 4 * (y * gfx.width + x);

            // Only spawn sand where text pixels exist
            if (gfx.pixels[idx + 3] > 0 && random() < 0.15) {
                for (let i = 0; i < density; i++) {
                    grains.push({
                        x: floor(x / CELL),
                        y: floor((y + yOffset) / CELL),
                        color: task.color
                    });
                }
            }
        }
    }
}

/* ---------------- MAIN LOOP ---------------- */

function draw() {
    background(240);

    updateSand();
    drawSand();

    if (currentTaskIndex >= taskQueue.length) return;

    const task = taskQueue[currentTaskIndex];
    const yOffset = currentTaskIndex * 70;

    // Show the word first
    if (phase === "show") {
        drawWord(task, yOffset);

        if (millis() - phaseStartTime > SHOW_DURATION) {
            createWordSand(task, yOffset);
            phase = "fall";
            phaseStartTime = millis();
        }
    }

    // Then let the sand fall before moving to the next task
    if (phase === "fall") {
        if (millis() - phaseStartTime > FALL_DURATION) {
            currentTaskIndex++;
            phase = "show";
            phaseStartTime = millis();
        }
    }
}

/* ---------------- PHYSICS ---------------- */

/**
 * Simple falling sand simulation with basic collision.
 */
function updateSand() {
    for (let i = grains.length - 1; i >= 0; i--) {
        const g = grains[i];

        if (g.y >= rows - 1) continue;

        if (!isOccupied(g.x, g.y + 1)) {
            g.y++;
        } else {
            const dir = random() < 0.5 ? -1 : 1;
            if (isFree(g.x + dir, g.y + 1)) {
                g.x += dir;
                g.y++;
            }
        }

        g.x = constrain(g.x, 0, cols - 1);
        g.y = constrain(g.y, 0, rows - 1);
    }
}

/**
 * Checks whether a sand cell is already occupied.
 */
function isOccupied(x, y) {
    return grains.some(g => g.x === x && g.y === y);
}

/**
 * Checks if a position is inside bounds and empty.
 */
function isFree(x, y) {
    if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
    return !isOccupied(x, y);
}

/* ---------------- DRAW ---------------- */

/**
 * Renders all sand grains to the canvas.
 */
function drawSand() {
    noStroke();
    for (const g of grains) {
        fill(g.color);
        rect(g.x * CELL, g.y * CELL, CELL, CELL);
    }
}
