let img;
let imgURL = "https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg";

let step = 6;        // spacing between sample pixels
let hoverRadius = 30; // how close the mouse must be to affect a pixel
let maxGrow = 10;     // maximum size increase from hover

function preload() {
  img = loadImage(imgURL);
}

function setup() {
  createCanvas(600, 700);
  img.resize(100, 0);   // shrink image for speed/clarity
  pixelDensity(1);
  img.loadPixels();
  noStroke();
}

function draw() {
  background(20);

  // center the image of dots
  let offsetX = width / 2 - (img.width * step) / 2;
  let offsetY = height / 2 - (img.height * step) / 2;

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {

      let index = (x + y * img.width) * 4;

      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // base brightness → base size
      let bright = (r + g + b) / 3;
      let baseSize = map(bright, 0, 255, 2, step + 2);

      // screen position of this dot
      let px = offsetX + x * step;
      let py = offsetY + y * step;

      // distance to mouse
      let d = dist(mouseX, mouseY, px, py);

      // if close, grow smoothly (falloff with distance)
      let grow = 0;
      if (d < hoverRadius) {
        let amt = map(d, 0, hoverRadius, 1, 0); // 1 near center → 0 at edge
        grow = amt * maxGrow;
      }

      fill(r, g, b);
      ellipse(px, py, baseSize + grow, baseSize + grow);
    }
  }
}
