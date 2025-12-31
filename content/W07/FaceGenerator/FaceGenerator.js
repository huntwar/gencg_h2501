let faceParams = {};

function setup() {
  createCanvas(600, 600);
  noLoop();
  generateFace();
}

function draw() {
  background(230);
  drawFace();
}

function mousePressed() {
  // Generate a new random face on click
  generateFace();
  redraw();
}

function generateFace() {
  // Continuous parameters (floats)
  faceParams.headWidth = random(150, 300);
  faceParams.headHeight = random(180, 320);
  faceParams.eyeSize = random(20, 60);
  faceParams.eyeDistance = random(50, 120);
  faceParams.mouthWidth = random(40, 150);
  faceParams.mouthY = random(50, 100);
  faceParams.headColor = color(random(150, 255), random(150, 255), random(150, 255));
  faceParams.eyeShape = random(['circle', 'square']);
  faceParams.mouthShape = random(['line', 'arc', 'rect']);

  // Discrete parameters (integers / booleans)
  faceParams.numEyes = int(random([1, 2, 3]));
  faceParams.hasPiercing = random([true, false]);
  faceParams.hasHat = random([true, false]);
  faceParams.hasBlush = random([true, false]);
  faceParams.species = random(['human', 'robot', 'house']); // changes visual style
}

function drawFace() {
  push();
  translate(width / 2, height / 2);

  // Draw head
  noStroke();
  fill(faceParams.headColor);
  if (faceParams.species === 'house') {
    // Draw a house-shaped head
    rectMode(CENTER);
    rect(0, 0, faceParams.headWidth, faceParams.headHeight, 10);
    fill(150);
    triangle(
      -faceParams.headWidth / 2,
      -faceParams.headHeight / 2,
      0,
      -faceParams.headHeight / 2 - 80,
      faceParams.headWidth / 2,
      -faceParams.headHeight / 2
    );
  } else if (faceParams.species === 'robot') {
    rectMode(CENTER);
    rect(0, 0, faceParams.headWidth, faceParams.headHeight, 20);
  } else {
    ellipse(0, 0, faceParams.headWidth, faceParams.headHeight);
  }

  // Eyes
  fill(0);
  let eyeY = -faceParams.headHeight / 8;
  let spacing = faceParams.eyeDistance;

  for (let i = 0; i < faceParams.numEyes; i++) {
    let x;
    if (faceParams.numEyes === 1) x = 0;
    else if (faceParams.numEyes === 2) x = map(i, 0, 1, -spacing / 2, spacing / 2);
    else x = map(i, 0, 2, -spacing, spacing);

    if (faceParams.eyeShape === 'circle') {
      ellipse(x, eyeY, faceParams.eyeSize);
    } else if (faceParams.eyeShape === 'square') {
      rectMode(CENTER);
      rect(x, eyeY, faceParams.eyeSize, faceParams.eyeSize);
    }

    // Blush
    if (faceParams.hasBlush) {
      fill(255, 150, 150, 150);
      ellipse(x, eyeY + 40, 30, 20);
      fill(0);
    }

    // Piercing
    if (faceParams.hasPiercing && i === 0) {
      fill(200);
      ellipse(x - faceParams.eyeSize / 2, eyeY + faceParams.eyeSize / 2, 8, 8);
      fill(0);
    }
  }

  // Mouth
  fill(50);
  let mouthY = faceParams.headHeight / 2 - faceParams.mouthY;

  if (faceParams.mouthShape === 'line') {
    stroke(0);
    strokeWeight(3);
    line(-faceParams.mouthWidth / 2, mouthY, faceParams.mouthWidth / 2, mouthY);
  } else if (faceParams.mouthShape === 'arc') {
    noFill();
    stroke(0);
    strokeWeight(3);
    arc(0, mouthY, faceParams.mouthWidth, 40, 0, PI);
  } else {
    noStroke();
    rectMode(CENTER);
    rect(0, mouthY, faceParams.mouthWidth, 20, 5);
  }

  // Hat (optional)
  if (faceParams.hasHat) {
    fill(30);
    rectMode(CENTER);
    rect(0, -faceParams.headHeight / 2 - 40, faceParams.headWidth * 0.8, 30, 5);
    rect(0, -faceParams.headHeight / 2 - 60, faceParams.headWidth * 0.4, 40, 5);
  }

  pop();

  // Label
  noStroke();
  fill(60);
  textAlign(CENTER);
  textSize(14);
  text("Click to generate a new face", width / 2, height - 30);
}
