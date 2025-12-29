let cols = 15;
let colWidth;
let columnSettings = [];

let colorPalette = [
  '#3d7aff',
'  #cf5975',
  '#8c1fc9',
  '#afa9fc',
  '#3c9470'
];


function setup() {
  createCanvas(800, 600);
  background(20);
  stroke(255);
  noLoop();

  colWidth = width / cols;

  for (let i = 0; i < cols; i++) {
    // Base values per column
    let baseSeg = random(1, 30);
    let strokeW = floor(random(2, 6));
    let spacing = random(8, 20);
    let repeatGuess = floor(height / (baseSeg + 10));

    let exactSegLen = (height - (repeatGuess * 10)) / repeatGuess;

    columnSettings.push({
      segLength: exactSegLen,
      spacing: spacing,
      strokeW: strokeW,
      repeats: repeatGuess,
      colColor: color(colorPalette[floor(random(colorPalette.length))])
    });
  }
}

function draw() {
  background(20);

  for (let col = 0; col < cols; col++) {
    drawColumn(col);
  }
}

function drawColumn(colIndex) {
  let s = columnSettings[colIndex];

  // Set stroke to the palette color
  stroke(s.colColor);
  strokeWeight(s.strokeW);
  
  let xCenter = colIndex * colWidth + colWidth * 0.5;

  let x1 = xCenter - s.spacing;
  let x2 = xCenter;
  let x3 = xCenter + s.spacing;

  let startY = 0;

  for (let r = 0; r < s.repeats; r++) {
    line(x1, startY, x1, startY + s.segLength);
    line(x2, startY, x2, startY + s.segLength);
    line(x3, startY, x3, startY + s.segLength);

    let bottomY = startY + s.segLength;

    line(x1, bottomY, x2, bottomY + 10);
    line(x2, bottomY, x3, bottomY + 10);
    line(x3, bottomY, x1, bottomY + 10);

    startY += s.segLength + 10;
  }
}
