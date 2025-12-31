let font;

function setup() {
  let canvas = createCanvas(500, 500);
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  background(10, 10, 20, 80); // soft fade for motion trails
  translate(width / 2, height / 2);

  let hr = hour(); // 0-23
  let mn = minute(); // 0-59
  let sc = second(); // 0-59

  // draw subtle glowing background
  noFill();
  stroke(255, 200);
  strokeWeight(1);
  ellipse(0, 0, 400, 400);

  // ---- Seconds: fleeting sparkles ----
  push();
  rotate(map(sc, 0, 60, 0, 360));
  let sRadius = 180;
  for (let i = 0; i < 60; i++) {
    let ang = map(i, 0, 60, 0, 360);
    let x = sRadius * cos(ang);
    let y = sRadius * sin(ang);
    let fade = i === sc ? 255 : 80;
    fill(150 + random(-10, 10), 200, 255, fade);
    circle(x, y, i === sc ? 10 : 4);
  }
  pop();

  // ---- Minutes: rhythmic pulse (The Arc) ----
  push();
  strokeWeight(6);
  // Map minutes (0-59) to a full circle (0-360 degrees).
  let currentMinute = mn + sc / 60;
  let endAngle = map(currentMinute, 0, 60, 0, 360);
  
  stroke(255, 210, 100);
  noFill();
  // Arc starts at the top (-90 degrees)
  arc(0, 0, 300, 300, -90, endAngle - 90);
  pop();
  
  // ------------------------------------------------------------------
  // ---- CENTER (NUMBER OF CIRCLES BY HOUR) ----
  // ------------------------------------------------------------------
  
  let totalCircles = hr ;
  let maxRadius = totalCircles * 10;
  let hourColor = color(100, 200, 255); 
  
  // Draw the concentric rings
  for (let i = 1; i <= totalCircles; i++) {
    let alpha = map(i, 1, totalCircles, 200, 50); 
    
    hourColor.setAlpha(alpha);
    stroke(hourColor);
    
    strokeWeight(3); 
    noFill(); 
    ellipse(0, 0, i * 10); 
  }

 // hour indicating line
  
  push();
  rotate(0); 
  stroke(255, 255, 150); // Bright green for contrast
  strokeWeight(1);
  text(` ${totalCircles}`, 110, 0);  
  // The line starts at (0, 0) and extends out to the edge of the largest hour circle.
  // The radius of the largest circle is (hr + 1) * 10, or maxRadius.
  line(0, 0, maxRadius / 2, 0); 
  // Draw a small circle at the end of the line for a visual cap
  fill(255, 255, 150);
  noStroke();
  circle(maxRadius / 2, 0, 6);
  pop();
  
  // Re-establish text properties
  fill(255); 
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);

}