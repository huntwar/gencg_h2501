let img;
let imgURL = "https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg"; 
// replace with any famous image URL or local file

function preload() {
  img = loadImage(imgURL);
}

function setup() {
  createCanvas(600, 700);
  imageMode(CENTER);

  // make image smaller so the effect is clearer & faster
  img.resize(100, 0);

  noStroke();
  pixelDensity(1);
  img.loadPixels();
}

function draw() {
  background(20);

  let step = 6; // pixel sampling resolution

  translate(width / 2 - img.width * step / 2,
            height / 2 - img.height * step / 2);

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {

      let index = (x + y * img.width) * 4;

      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // brightness can control circle size
      let bright = (r + g + b) / 3;
      let size = map(bright, 0, 255, 2, step + 2);

      fill(r, g, b);
      ellipse(x * step, y * step, size, size);
    }
  }

  noLoop(); // draw once
}
