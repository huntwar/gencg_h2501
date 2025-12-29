// Drawing Machine — with Color Picker
// A generative drawing system with evolving personalities
// Press 1–7 to switch modes, C to clear, + / – to resize brush

let modes = [
  "Expander",
  "Augmentor",
  "Distorter",
  "Questioner",
  "Complicator",
  "Interpreter",
  "Improver"
];
let modeIndex = 0;

let intensity = 0.5;
let chaos = 0.3;
let persistence = 0.92;
let brushSize = 8;

let pg;
let currentStroke = [];
let colorPicker;
let drawColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(width, height);
  pg.clear();
  background(10);
  strokeJoin(ROUND);
  strokeCap(ROUND);
  noFill();
  textFont('monospace');

  // Color Picker UI
  colorPicker = createColorPicker('#7c3aed');
  colorPicker.position(20, 20);
  colorPicker.style('width', '80px');
  drawColor = colorPicker.color();

  createP('Use mouse to draw. 1–7: switch mode, C: clear, + / –: brush size')
    .position(20, 50)
    .style('color', '#aaa');
}

function draw() {
  background(10, 15, 30, 255 * (1 - persistence));
  image(pg, 0, 0);

  // live update color
  drawColor = colorPicker.color();

  // Preview current stroke
  if (currentStroke.length > 1) {
    stroke(drawColor);
    strokeWeight(brushSize);
    noFill();
    beginShape();
    for (let p of currentStroke) vertex(p.x, p.y);
    endShape();
  }

  // HUD
  noStroke();
  fill(180);
  textSize(14);
  text(
    `Mode: ${modes[modeIndex]} | Intensity: ${intensity.toFixed(2)} | Chaos: ${chaos.toFixed(2)} | Brush: ${brushSize}`,
    20,
    height - 20
  );
}

function mousePressed() {
  currentStroke = [];
}

function mouseDragged() {
  currentStroke.push({ x: mouseX, y: mouseY });
}

function mouseReleased() {
  if (currentStroke.length > 1) applyMachineBehavior(currentStroke);
  currentStroke = [];
}

function keyPressed() {
  if (key >= '1' && key <= '7') modeIndex = parseInt(key) - 1;
  if (key === 'c' || key === 'C') pg.clear();
  if (key === '+' || key === '=') brushSize++;
  if (key === '-' && brushSize > 1) brushSize--;
}

function applyMachineBehavior(stroke) {
  switch (modes[modeIndex]) {
    case "Expander": drawExpander(stroke); break;
    case "Augmentor": drawAugmentor(stroke); break;
    case "Distorter": drawDistorter(stroke); break;
    case "Questioner": drawQuestioner(stroke); break;
    case "Complicator": drawComplicator(stroke); break;
    case "Interpreter": drawInterpreter(stroke); break;
    case "Improver": drawImprover(stroke); break;
  }
}

// ---------- Mode Behaviors ----------

function drawExpander(stroke) {
  for (let i = 0; i < 5; i++) {
    let s = map(i, 0, 5, 1, 1.5 + intensity);
    let a = map(i, 0, 5, 255, 60);
    drawStroke(stroke, brushSize * s, color(red(drawColor), green(drawColor), blue(drawColor), a), s);
  }
}

function drawAugmentor(stroke) {
  drawStroke(stroke, brushSize, drawColor);
  for (let p of stroke) {
    let len = brushSize * (0.5 + intensity);
    let angle = random(TWO_PI);
    pg.stroke(red(drawColor), green(drawColor), blue(drawColor), 120);
    pg.strokeWeight(brushSize * 0.15);
    pg.line(p.x, p.y, p.x + cos(angle) * len, p.y + sin(angle) * len);
  }
}

function drawDistorter(stroke) {
  let distorted = stroke.map(p => ({
    x: p.x + random(-50, 50) * chaos,
    y: p.y + random(-50, 50) * chaos
  }));
  drawStroke(distorted, brushSize * (1 + intensity), color(red(drawColor), green(drawColor), blue(drawColor), 180));
}

function drawQuestioner(stroke) {
  for (let i = 0; i < stroke.length - 1; i += floor(random(2, 8))) {
    if (random() < chaos) continue;
    let a = stroke[i];
    let b = stroke[i + 1];
    pg.stroke(red(drawColor), green(drawColor), blue(drawColor), 200);
    pg.strokeWeight(brushSize * random(0.4, 1));
    pg.line(a.x, a.y, b.x, b.y);
  }
}

function drawComplicator(stroke) {
  drawStroke(stroke, brushSize, drawColor);
  for (let i = 0; i < 3; i++) {
    let scale = pow(0.6, i + 1);
    let offset = random(-30, 30);
    let nested = stroke.map(p => ({
      x: width / 2 + (p.x - width / 2) * scale + offset,
      y: height / 2 + (p.y - height / 2) * scale + offset
    }));
    drawStroke(nested, brushSize * scale, color(red(drawColor), green(drawColor), blue(drawColor), 140));
  }
}

function drawInterpreter(stroke) {
  let simple = simplifyPath(stroke, 5);
  drawStroke(simple, brushSize * 0.8, color(red(drawColor), green(drawColor), blue(drawColor), 220));
}

function drawImprover(stroke) {
  let smoothed = smoothStroke(stroke, 0.6);
  drawStroke(smoothed, brushSize * 0.9, color(red(drawColor), green(drawColor), blue(drawColor), 240));
}

// ---------- Drawing Utilities ----------

function drawStroke(pts, weight, col, scale = 1) {
  pg.push();
  pg.stroke(col);
  pg.strokeWeight(weight);
  pg.noFill();
  pg.beginShape();
  for (let p of pts) {
    pg.vertex(
      (p.x - width / 2) * scale + width / 2,
      (p.y - height / 2) * scale + height / 2
    );
  }
  pg.endShape();
  pg.pop();
}

function simplifyPath(pts, tolerance) {
  if (pts.length < 3) return pts;
  let result = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    let a = pts[i - 1], b = pts[i], c = pts[i + 1];
    let d = abs((b.y - a.y) * (c.x - a.x) - (b.x - a.x) * (c.y - a.y));
    if (d > tolerance) result.push(b);
  }
  result.push(pts[pts.length - 1]);
  return result;
}

function smoothStroke(pts, amt) {
  let smoothed = pts.map(p => ({ x: p.x, y: p.y }));
  for (let i = 1; i < smoothed.length - 1; i++) {
    smoothed[i].x = lerp(smoothed[i].x, (pts[i - 1].x + pts[i + 1].x) / 2, amt);
    smoothed[i].y = lerp(smoothed[i].y, (pts[i - 1].y + pts[i + 1].y) / 2, amt);
  }
  return smoothed;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let newpg = createGraphics(width, height);
  newpg.image(pg, 0, 0);
  pg = newpg;
}
