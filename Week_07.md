# Week 07

For this lesson, I learned how to design a face as a system of parameters instead of a fixed drawing. Sliders and dropdown menus allowed me to continuously or discretely control features such as width, spacing, mood, color, and accessories. I also explored how animation states can guide the viewer through a sequence, from something abstract to a final expressive character. Working through this lesson helped me better understand concepts like interpolation, easing, and user interaction inside a sketch.

### Animated Generative Creature

My first try is an interactive and animated face generator. The face is controlled by UI sliders and dropdowns that change eye spacing, mouth curve, face width, eye shape, piercings, and even the “species” color (Human, Alien, or Ogre). When I press the button, an animation plays through several states: a sphere drops in, zooms up to fill the screen, the face slowly fades in, and finally shrinks and disappears. This project really taught me how to structure animations using program states and easing to make motion feel smooth and intentional.

<iframe src="content/W07/FaceGenerator/FaceGenerator.html" width="100%" height="100%" frameborder="no"></iframe>

### Parametric Cartoon Face

The second try is a simpler but very flexible parametric face sketch. I used sliders to control the width and height of the head, eye size, mouth curve (from frown to smile), and eyebrow tilt. I also added discrete controls for the number of eyes (1–3) and an optional piercing. This one helped me understand how even small parameter changes can totally change the expression and personality of a character.

<iframe src="content/W07/Facials/Facials.html" width="100%" height="100%" frameborder="no"></iframe>

### Alternate Version of the Animated Generator

The third try is a variation of the first animated face generator. It works with the same idea of animation states, easing, and UI-controlled parameters. The sphere transforms into a colored face that slowly appears with the features scaling in. This version helped reinforce my understanding of organizing code, working with global state, and updating parameters live from the UI.

<iframe src="content/W07/CreatureGenerator/CreatureGenerator.html" width="100%" height="100%" frameborder="no"></iframe>

Overall, this lesson showed me how procedural design + interaction = endless variation. Instead of drawing one face, I created systems that can generate hundreds of them — each one unique.
