
// Initial Setup
// Get the canvas element and its 2D rendering context, set canvas dimensions, and define initial mouse position.
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
// Initialize mouse position and an array of colors.
let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};
const colors = [
    '#2185C5',
    '#7ECEFD',
    '#FFF6E5',
    '#FF7F66'
];
hue = 1;

// Event Listeners
// Track mouse movement and window resizing.
addEventListener("mousemove", function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
addEventListener("resize", function(event){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

// Utility Functions
// Generate a random integer within a given range and pick a random color from the array.
function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor(colors){
    return colors[Math.floor(Math.random() * colors.length)];
}

// Objects
// Define a StartButton object with image animation and click functionality.
function StartButton() {
    // Initialize variables and load images.
    // Start off-screen and move towards the center of the canvas.
    const images = ['./menu.png', './menu2.png'];
    let currentIndex = 0;
    const image = new Image();
    let intervalId;
    this.loaded = false;
    this.position = {
        x: -100,
        y: 270
    };

    // Load an image and set dimensions when loaded.
    const loadImage = (index) => {
        // Load image, set dimensions, and set the final position.
        this.loaded = false;
        image.src = images[index];
        image.onload = () => {
            this.loaded = true;
            const scale = 0.16;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.finalPositionX = canvas.width / 2 - this.width / 2;
        };
    };
    loadImage(currentIndex);

    // Change the displayed image at intervals.
    const changeImage = () => {
        if (!this.loaded) return;
        currentIndex = (currentIndex + 1) % images.length;
        loadImage(currentIndex);
    };
    intervalId = setInterval(changeImage, 1000);

    // Move the button to the right until it reaches the center.
    this.move = function() {
        if (this.position.x < this.finalPositionX) {
            this.position.x += 2; // Adjust the speed as necessary
        }
    };

    // Draw the image on the canvas.
    this.draw = function() {
        if (!this.loaded) return;
        c.drawImage(image, this.position.x, this.position.y, this.width, this.height);
    };

    // Handle button click event and redirect if clicked within the button area.
    canvas.addEventListener('click', function(event) {
        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;
        if(x > canvas.width / 2 - 50 && x < canvas.width / 2 - 50 + 100 && y > 250 && y < 500) {
            clearInterval(intervalId);
            window.location.href = './spalshScreen.html';
        }
    });

    // Update the button's position and drawing on each animation frame.
    this.update = function() {
        this.move();
        this.draw();
    };
}

// Implementation
// Initialize the StartButton at the center of the canvas.
var lose = new StartButton(canvas.width / 2, 100, undefined, undefined);

// Animation Loop
// Animate the "You Lose" text along with the StartButton.
function animate(){
    requestAnimationFrame(animate);
    
    // Clear the canvas and draw the "You Lose" text.
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.beginPath();
    c.font = "italic small-caps bold 50px orbitron";
    c.textAlign = "center";
    c.fillStyle = `hsl(${hue}, 100%, 50%)`;
    c.fillText('You Lose', canvas.width / 2, 100);
    c.closePath();
    
    // Update the hue for text color variation.
    hue += 50;

    // Update and draw the StartButton.
    lose.update();
}

//  start the animation loop.
animate();
