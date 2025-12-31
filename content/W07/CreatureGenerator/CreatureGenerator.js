 // Global variables for the UI elements
        let eyeSpacingSlider, mouthCurveSlider, faceWidthSlider;
        let eyeShapeSelect, piercingSelect, speciesColorSelect;
        let generateButton;

        // --- P5.JS SKETCH ---
        const sketch = (p) => {
            // State constants
            const STATE_IDLE = 0;
            const STATE_SPHERE_DROP = 1;
            const STATE_CLOSE_UP = 2;
            const STATE_GENERATE_FACE = 3;
            const STATE_OPEN_AND_DISAPPEAR = 4;

            let state = STATE_IDLE;
            let startTime;
            const CANVAS_WIDTH = 500;
            const CANVAS_HEIGHT = 400;

            // Face parameters object (populated from UI)
            let faceParams = {};

            // Helper for color mapping (Discrete Parameter 5)
            const speciesColors = {
                'Human': { skin: [255, 224, 189], shadow: [200, 160, 130] },
                'Alien': { skin: [120, 200, 140], shadow: [80, 150, 100] },
                'Ogre': { skin: [150, 150, 150], shadow: [100, 100, 100] }
            };

            // Setup function for p5.js
            p.setup = () => {
                const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
                canvas.parent('p5-canvas-container');
                p.noLoop(); // Start in idle mode, wait for user input
                p.angleMode(p.DEGREES); // Use degrees for rotations

                // Link UI listeners to update the faceParams object
                setupEventListeners();
                updateFaceParams(); // Initialize parameters
            };

            // Draw function for p5.js (the animation loop)
            p.draw = () => {
                p.background(245);
                p.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2); // Center of the canvas is (0, 0)
                const elapsed = p.millis() - startTime;

                if (state === STATE_IDLE) {
                    drawIdleScreen(p);
                } else if (state === STATE_SPHERE_DROP) {
                    const duration = 1000;
                    const dropProgress = p.constrain(elapsed / duration, 0, 1);

                    // Sphere drops from top (-H/2) to center (0)
                    const sphereY = p.lerp(-CANVAS_HEIGHT / 2 - 50, 0, dropProgress);
                    const sphereSize = 100;
                    drawSphere(p, sphereY, sphereSize, 'Human'); // Use a generic color for the sphere

                    if (dropProgress >= 1) {
                        state = STATE_CLOSE_UP;
                        startTime = p.millis();
                    }
                } else if (state === STATE_CLOSE_UP) {
                    const duration = 1000;
                    const closeUpProgress = p.constrain(elapsed / duration, 0, 1);

                    // Sphere expands to cover the screen
                    const targetSize = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 1.5;
                    const sphereSize = p.lerp(100, targetSize, p.easeOutQuad(closeUpProgress));
                    drawSphere(p, 0, sphereSize, faceParams.speciesColor); // Sphere takes the final face color

                    if (closeUpProgress >= 1) {
                        state = STATE_GENERATE_FACE;
                        startTime = p.millis();
                    }
                } else if (state === STATE_GENERATE_FACE) {
                    const duration = 2000;
                    const faceProgress = p.constrain(elapsed / duration, 0, 1);

                    // Background color is the face's base color
                    const faceColor = speciesColors[faceParams.speciesColor].skin;
                    p.background(faceColor[0], faceColor[1], faceColor[2]);

                    // Fade in the face features
                    p.push();
                    p.translate(0, 0); // Already translated to center
                    p.scale(faceProgress); // Scale up from 0 to 1
                    drawFace(p, faceParams);
                    p.pop();

                    if (faceProgress >= 1 && elapsed > 3000) { // Hold the face for 3 seconds
                        state = STATE_OPEN_AND_DISAPPEAR;
                        startTime = p.millis();
                    }
                } else if (state === STATE_OPEN_AND_DISAPPEAR) {
                    const duration = 1000;
                    const disappearProgress = p.constrain(elapsed / duration, 0, 1);

                    const faceColor = speciesColors[faceParams.speciesColor].skin;
                    p.background(faceColor[0], faceColor[1], faceColor[2]);

                    p.push();
                    p.translate(0, 0);
                    // Shrink the face
                    p.scale(p.lerp(1, 0, p.easeOutQuad(disappearProgress)));
                    drawFace(p, faceParams);
                    p.pop();

                    // Optional: Fade out background
                    const fade = p.lerp(0, 245, disappearProgress);
                    p.fill(245, fade);
                    p.rect(-CANVAS_WIDTH/2, -CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT);


                    if (disappearProgress >= 1) {
                        state = STATE_IDLE;
                        p.noLoop();
                        generateButton.disabled = false;
                        generateButton.textContent = 'Generate Face Animation';
                    }
                }
            };

            // Easing function for smoother movement
            p.easeOutQuad = (t) => t * (2 - t);

            // Function to draw the generic sphere in animation phases 1 and 2
            const drawSphere = (p, y, size, colorKey) => {
                const color = speciesColors[colorKey].skin;
                p.fill(color[0], color[1], color[2]);
                p.noStroke();
                p.ellipse(0, y, size);
            };

            // Main function to draw the parametric face
            const drawFace = (p, params) => {
                const faceSize = 150;
                const headWidth = faceSize * params.faceWidthRatio;
                const headHeight = faceSize * 1.3;

                const colorSet = speciesColors[params.speciesColor];

                // 1. Draw Head (Main shape of the face)
                p.noStroke();
                p.fill(colorSet.skin[0], colorSet.skin[1], colorSet.skin[2]);
                p.ellipse(0, 0, headWidth, headHeight);

                // 2. Draw Eyes
                const eyeY = headHeight * -0.15;
                const eyeDist = headWidth * params.eyeSpacing;
                const eyeSize = 30;

                const drawSingleEye = (x, y, shape, size) => {
                    p.push();
                    p.translate(x, y);

                    // Sclera (White part)
                    p.fill(255);
                    if (shape === 'Round') p.ellipse(0, 0, size * 1.2, size);
                    if (shape === 'Slit') p.rect(-size * 0.6, -size * 0.1, size * 1.2, size * 0.2, 5);
                    if (shape === 'Target') p.ellipse(0, 0, size, size);

                    // Iris (Colored part - fixed color)
                    p.fill(30, 100, 200);
                    p.ellipse(0, 0, size * 0.5, size * 0.5);

                    // Pupil
                    p.fill(0);
                    if (shape === 'Round') p.ellipse(0, 0, size * 0.2, size * 0.2);
                    if (shape === 'Slit') p.rect(-size * 0.6, -size * 0.05, size * 1.2, size * 0.1, 5);
                    if (shape === 'Target') {
                        p.noFill();
                        p.stroke(0);
                        p.strokeWeight(2);
                        p.ellipse(0, 0, size * 0.1);
                        p.line(-size * 0.4, 0, size * 0.4, 0);
                        p.line(0, -size * 0.4, 0, size * 0.4);
                    }

                    p.pop();
                };

                drawSingleEye(-eyeDist / 2, eyeY, params.eyeShape, eyeSize);
                drawSingleEye(eyeDist / 2, eyeY, params.eyeShape, eyeSize);

                // 3. Draw Mouth (Mood/Curve Parameter)
                const mouthY = headHeight * 0.3;
                const mouthWidth = headWidth * 0.4;
                const curveDepth = 20 * params.mouthCurve;

                p.noFill();
                p.stroke(0);
                p.strokeWeight(3);
                p.arc(
                    0,
                    mouthY,
                    mouthWidth,
                    40,
                    20,
                    160
                );

                // Add curve to create expression
                p.strokeWeight(3);
                p.line(-mouthWidth / 2, mouthY + curveDepth * 0.5, mouthWidth / 2, mouthY + curveDepth * 0.5);
                p.beginShape();
                p.vertex(-mouthWidth / 2, mouthY + curveDepth * 0.5);
                p.bezierVertex(
                    -mouthWidth / 4, mouthY + curveDepth * 1.5,
                    mouthWidth / 4, mouthY + curveDepth * 1.5,
                    mouthWidth / 2, mouthY + curveDepth * 0.5
                );
                p.endShape();

                // 4. Draw Piercings (Discrete Parameter 6)
                p.fill(200, 200, 200); // Silver color for piercings
                p.stroke(0);
                p.strokeWeight(1);

                if (params.piercingType === 'Septum') {
                    p.arc(0, mouthY - 40, 10, 10, 0, 180); // Simple septum ring
                }
                if (params.piercingType === 'Lip') {
                    p.ellipse(mouthWidth / 3, mouthY + curveDepth * 0.5 + 5, 5, 5); // Lip stud
                }
            };

            // Updates the global faceParams object from UI elements
            const updateFaceParams = () => {
                faceParams = {
                    eyeSpacing: parseFloat(eyeSpacingSlider.value),
                    mouthCurve: parseFloat(mouthCurveSlider.value),
                    faceWidthRatio: parseFloat(faceWidthSlider.value),
                    eyeShape: eyeShapeSelect.value,
                    speciesColor: speciesColorSelect.value,
                    piercingType: piercingSelect.value,
                };

                // Update display values
                document.getElementById('eyeSpacingValue').textContent = faceParams.eyeSpacing.toFixed(2);
                document.getElementById('mouthCurveValue').textContent = faceParams.mouthCurve.toFixed(2);
                document.getElementById('faceWidthRatioValue').textContent = faceParams.faceWidthRatio.toFixed(2);
            };

            // Initializes UI elements and listeners
            const setupEventListeners = () => {
                eyeSpacingSlider = document.getElementById('eyeSpacing');
                mouthCurveSlider = document.getElementById('mouthCurve');
                faceWidthSlider = document.getElementById('faceWidthRatio');
                eyeShapeSelect = document.getElementById('eyeShape');
                piercingSelect = document.getElementById('piercingType');
                speciesColorSelect = document.getElementById('speciesColor');
                generateButton = document.getElementById('generateButton');

                // Update parameters on every change (Continuous feedback)
                [eyeSpacingSlider, mouthCurveSlider, faceWidthSlider, eyeShapeSelect, piercingSelect, speciesColorSelect].forEach(el => {
                    el.addEventListener('input', updateFaceParams);
                });

                // Button click to start the animation
                generateButton.addEventListener('click', () => {
                    if (state === STATE_IDLE) {
                        state = STATE_SPHERE_DROP;
                        startTime = p.millis();
                        generateButton.disabled = true;
                        generateButton.textContent = 'Animating...';
                        p.loop();
                    }
                });
            };

            const drawIdleScreen = (p) => {
                p.background(245);
                p.fill(200);
                p.rect(-CANVAS_WIDTH / 2 + 50, -CANVAS_HEIGHT / 2 + 50, CANVAS_WIDTH -100, CANVAS_HEIGHT - 100, 10);
                p.textSize(20);
                p.textAlign(p.CENTER, p.CENTER);
                p.fill(100);
                p.text("Press 'Generate' to see your creature!", 0, 0);
            };

        };

        // Initialize the p5 sketch
        new p5(sketch);