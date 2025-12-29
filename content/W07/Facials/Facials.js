let faceWidthSlider, faceHeightSlider, eyeSizeSlider;
let mouthCurveSlider, browTiltSlider;
let numEyesSelect, piercingCheckbox;

function setup() {
  createCanvas(500, 500);
  noStroke();
  angleMode(DEGREES);

  // Continuous parameters
  faceWidthSlider = createSlider(150, 300, 200);
  faceHeightSlider = createSlider(180, 320, 250);
  eyeSizeSlider = createSlider(10, 50, 25);
  mouthCurveSlider = createSlider(-50, 50, 0); // frown to smile
  browTiltSlider = createSlider(-30, 30, 0); // angry to surprised

  // Discrete parameters
  numEyesSelect = createSelect();
  numEyesSelect.option('1');
  numEyesSelect.option('2');
  numEyesSelect.option('3');
  numEyesSelect.selected('2');

  piercingCheckbox = createCheckbox('Piercing', false);
}

function draw() {
  background(220);
  let faceWidth = faceWidthSlider.value();
  let faceHeight = faceHeightSlider.value();
  let eyeSize = eyeSizeSlider.value();
  let mouthCurve = mouthCurveSlider.value();
  let browTilt = browTiltSlider.value();
  let numEyes = int(numEyesSelect.value());
  let hasPiercing = piercingCheckbox.checked();

  translate(width / 2, height / 2);

  // Draw head
  fill(255, 220, 180);
  ellipse(0, 0, faceWidth, faceHeight);

  // Draw eyes
  let eyeY = -faceHeight / 6;
  let spacing = faceWidth / (numEyes + 1);

  fill(255);
  for (let i = 0; i < numEyes; i++) {
    let x = (i - (numEyes - 1) / 2) * spacing;
    ellipse(x, eyeY, eyeSize * 1.2, eyeSize);
    fill(0);
    ellipse(x, eyeY, eyeSize / 2, eyeSize / 2);
    fill(255);
  }

  // Draw eyebrows
  stroke(60);
  strokeWeight(4);
  noFill();
  for (let i = 0; i < numEyes; i++) {
    let x = (i - (numEyes - 1) / 2) * spacing;
    let y = eyeY - eyeSize;
    push();
    translate(x, y);
    rotate(browTilt / 4);
    line(-eyeSize / 1.2, -browTilt / 2, eyeSize / 1.2, browTilt / 2);
    pop();
  }
  noStroke();

  // Draw mouth
  let mouthY = faceHeight / 4;
  stroke(80);
  noFill();
  strokeWeight(3);
  beginShape();
  for (let x = -faceWidth / 6; x <= faceWidth / 6; x += 5) {
    let y = mouthY + sin(map(x, -faceWidth / 6, faceWidth / 6, 0, 180)) * mouthCurve / 5;
    vertex(x, y);
  }
  endShape();

  noStroke();

  // Draw nose
  fill(255, 180, 150);
  triangle(0, -10, -10, 30, 10, 30);

  // Draw piercing (optional)
  if (hasPiercing) {
    fill(200);
    ellipse(faceWidth / 6, mouthY + 10, 8, 8);
  }

  // Labels
  resetMatrix();
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Use sliders and options to change parameters!", 10, height - 15);
}
