/**
 */

let blocks = [];
let currentBlock;
let integrity = 100;
let timeUnits = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  spawnBlock();
}

function draw() {
  background(240, 10, 10); // Dark navy background

  // Draw the "Ground" (Accumulated Value)
  fill(0, 0, 20);
  rect(0, height - 20, width, 20);

  // Update and show all settled blocks
  for (let b of blocks) {
    b.display();
  }

  // Handle the active falling block
  if (currentBlock) {
    let focused = mouseIsPressed || keyIsPressed;
    currentBlock.update(focused);
    currentBlock.display(focused);

    // Check for collision with ground or other blocks
    if (currentBlock.hasSettled(blocks)) {
      blocks.push(currentBlock);
      calculateIntegrity(currentBlock);
      timeUnits++;
      spawnBlock();
    }
  }

  drawHUD();
}

function spawnBlock() {
  currentBlock = new Block(random(width * 0.2, width * 0.8), -50);
}

class Block {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.w = random(40, 80);
    this.h = 20;
    this.speed = 3;
    this.isSettled = false;
    this.angle = 0;
    this.hue = 200;
    this.type = "glitch";
  }

  update(focused) {
    if (focused) {
      // Direct control: Smooth placement
      this.pos.x = lerp(this.pos.x, mouseX, 0.1);
      this.angle = 0;
      this.hue = 180; // Cyan for focus
      this.type = "solid";
      this.speed = 5; 
    } else {
      // Distracted: Random drifting and rotation
      this.pos.x += sin(frameCount * 0.1) * 2;
      this.angle += 0.05;
      this.hue = 340; // Reddish for entropy
      this.type = "glitch";
      this.speed = 2;
    }
    this.pos.y += this.speed;
  }

  display(focused) {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    
    if (this.type === "solid") {
      fill(this.hue, 80, 100);
      stroke(255);
    } else {
      fill(this.hue, 50, 30, 50);
      stroke(this.hue, 80, 50);
      // Add a "glitch" jitter
      translate(random(-2, 2), 0);
    }
    
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop();
  }

  hasSettled(others) {
    // Check ground
    if (this.pos.y + this.h/2 >= height - 20) {
      this.pos.y = height - 20 - this.h/2;
      return true;
    }
    // Check other blocks
    for (let o of others) {
      let d = dist(this.pos.x, this.pos.y, o.pos.x, o.pos.y);
      if (d < 25) return true; 
    }
    return false;
  }
}

function calculateIntegrity(b) {
  // If the block is tilted or "glitchy", integrity drops
  if (abs(b.angle) > 0.1 || b.type === "glitch") {
    integrity -= 5;
  } else {
    integrity += 1;
  }
  integrity = constrain(integrity, 0, 100);
}

function drawHUD() {
  noStroke();
  fill(255);
  textSize(20);
  text("TIME UNITS SPENT: " + timeUnits, 30, 50);
  
  // Integrity Bar
  text("STRUCTURAL INTEGRITY: " + integrity + "%", 30, 80);
  fill(integrity > 50 ? 120 : 0, 80, 100);
  rect(30, 90, integrity * 2, 10);
  
  if (integrity < 20) {
    fill(0, 100, 100, sin(frameCount * 0.1) * 100);
    textAlign(CENTER);
    text("TIME IS COLLAPSING - FOCUS!", width/2, height/2);
  }
}