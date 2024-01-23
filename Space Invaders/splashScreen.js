// Canvas Setup
var canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

var ctx = canvas.getContext('2d');

let hue = 0;


var mouse = {
    x: undefined,
    y: undefined
}

var maxRadius = 30;

var colorArray = [
    '#202D3F',
    '#0E1E2E',
    '#081525',
    '#030917',
    '#FFFFFF', 
    '#8B0000',
    '#00008B',
    '#8B8000',
    '#Ff8c00'
];

var gravity = 0.3;
var friction = 0.7

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    console.log(mouse);
})

window.addEventListener('resize', function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})


function Circle(x, y, dx, dy, radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color =  colorArray[Math.floor(Math.random() * colorArray.length)];
    
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    
    }

    this.update = function(){
        
    
        if ((this.x + this.radius) > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
    
        if ((this.y + this.radius) > innerHeight || this.y - this.radius < 0){
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        // Interactivity ------------------------------------------------
        if (mouse.x - this.x < 40 && mouse.x - this.x > -40 && mouse.y - this.y < 40 && mouse.y - this.y > -40 ) {
            if (this.radius < maxRadius){
                this.radius += 1;
            }
        } else if (this.radius > this.minRadius){
            this.radius -=1
        }
         
        this.draw();
    }

}


// Start Button
function StartButton() {
    // Images
    const images = ['./startScreen.png', './startScreen2.png'];
    let currentIndex = 0;
    const image = new Image();
    let intervalId;
    this.loaded = false;
    this.position = {
        x: -100, // Starting position off-screen
        y: 270   // Y position remains constant
    };

    // Loading Images and Setting them up
    const loadImage = (index) => {
        this.loaded = false;
        image.src = images[index];
        image.onload = () => {
            this.loaded = true;
            const scale = 0.21;
            this.width = image.width * scale;
            this.height = image.height * scale;
            // Set the final position (center of the canvas)
            this.finalPositionX = canvas.width / 2 - this.width / 2;
        };
    };

    loadImage(currentIndex);

    // Image Animation
    const changeImage = () => {
        if (!this.loaded) return;
        currentIndex = (currentIndex + 1) % images.length;
        loadImage(currentIndex);
    };

    intervalId = setInterval(changeImage, 1000); 

    this.move = function() {
        // Move the image to the right if it's not yet at its final position
        if (this.position.x < this.finalPositionX) {
            this.position.x += 2; 
        }
    };

    // Srawing Image on Screen
    this.draw = function() {
        if (!this.loaded) return;
        ctx.drawImage(image, this.position.x, this.position.y, this.width, this.height);
    };

    // Clicking Image
    canvas.addEventListener('click', function(event) {
        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;

        // Check if the click was inside the button
        if(x > canvas.width / 2 - 50 && x < canvas.width / 2 - 50 + 100 && y > 250 && y < 400) {
            clearInterval(intervalId); // Stop the animation
            window.location.href = './game.html'; // Redirect to the game file
        }
    });

    this.update = function() {
        this.move();
        this.draw();
    };
}

// How to play Button
function InstructionButton() {
    // Images for animation
    const images = ['./howInvader.png', './howInvader2.png'];
    let currentIndex = 0;
    const image = new Image();
    let intervalId;
    this.loaded = false;
    this.showInstructions = false;
    // Position of Image
    this.position = {
        x: 1300, 
        y: 400   
    };

    // Load and set up image
    const loadImage = (index) => {
        this.loaded = false;
        image.src = images[index];
        image.onload = () => {
            this.loaded = true;
            const scale = 0.3;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.finalPositionX = canvas.width / 2 - this.width / 2; // Center position
        };
    };

    loadImage(currentIndex);

    // Image Animation
    const changeImage = () => {
        if (!this.loaded) return;
        currentIndex = (currentIndex + 1) % images.length;
        loadImage(currentIndex);
    };

    intervalId = setInterval(changeImage, 1000);

    // Image animation
    this.move = function() {
        if (this.position.x > this.finalPositionX) {
            this.position.x -= 2; // Adjust speed if needed
        }
    };

    // Draw the image
    this.draw = function() {
        if (!this.loaded || this.showInstructions) return;
        ctx.drawImage(image, this.position.x, this.position.y, this.width, this.height);
    };

    // Draw the instruction screen
    const drawInstructions = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '20px Orbitron';
        ctx.fillText('USE ARROW KEYS TO MOVE', canvas.width / 2, canvas.height / 2 - 90);
        ctx.fillText('PRESS SPACE TO SHOOT', canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillStyle = 'red';
        ctx.fillText('INVADERS SHOOT BULLETS', canvas.width / 2, canvas.height / 2);
        ctx.fillText('SURVIVE FOR AS LONG AS POSSIBLE', canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillStyle = 'yellow';
        ctx.fillText('PRESS Z TO GO BACK', canvas.width / 2, canvas.height / 2 + 60);
    };

    // Escaping from instuctions screen
    const keyDownHandler = (event) => {
        if (event.key === 'z' || event.key === 'Z') {
            this.showInstructions = false;
        }
    };

    // Add event listeners
    canvas.addEventListener('click', function(event) {
        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;

        if(x > this.position.x && x < this.position.x + this.width && y > this.position.y && y < this.position.y + this.height) {
            clearInterval(intervalId);
            this.showInstructions = true;
        }
    }.bind(this));

    document.addEventListener('keydown', keyDownHandler);

    // Update the button state
    this.update = function() {
        this.move();
        this.draw();
        if (this.showInstructions) {
            drawInstructions();
        }
    };
}



// Title
function Title(x, y, dx, dy, text){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.text = text;

    // Setting the image
    const image = new Image();
    image.src = './invader.png';
    image.onload = () => {
        const scale = 0.21;
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
            x : 0 - this.width /2,
            y : 150 - this.height + 10
        }
        this.position2 = {
            x : 1500 - this.width /2,
            y : 150 - this.height + 10
        }
    };

    // Drawing invaders with title
    this.draw1 = function() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);  
    };

    this.draw2 = function() {
        ctx.drawImage(this.image, this.position2.x, this.position2.y, this.width, this.height);       
    };


    // Drawing title
    this.draw = function(){

        // Draw text
        ctx.beginPath();
        ctx.font = "italic small-caps bold 50px orbitron";
        ctx.textAlign = "center";
        ctx.fillStyle = `hsl(${hue}, 80%, 70%)`;
        ctx.fillText(String(this.text), this.x, this.y);
        ctx.closePath();

        hue += 0.1; // Increment hue for color change
    }

    // Updating and moving Title and images
    this.update = function(){
        if(this.y + this.dy > 150){
            this.dy = -this.dy * friction;
        } else {
            this.dy += gravity;
        }

        this.y += this.dy;
        this.draw();


        if (this.image) {
            this.draw1();
            this.draw2();

            if(this.position.x < 480 - this.width){
                this.position.x += 2;
            }

            if(this.position2.x > 990){
                this.position2.x -= 2;
            }
        }
    }
}

// Letters of title
var s = new Title(500, -100, undefined, 13, 'S');
var p = new Title(540, -100, undefined, 12, 'P');
var a = new Title(580, -100, undefined, 11, 'A');
var c = new Title(620, -100, undefined, 10, 'C');
var e = new Title(660, -100, undefined, 9, 'E');
var i2 = new Title(700, -100, undefined, 8, 'I');
var n = new Title(730, -100, undefined, 7, 'N');
var v = new Title(770, -100, undefined, 6, 'V');
var a2 = new Title(810, -100, undefined, 5, 'A');
var d = new Title(850, -100, undefined, 4, 'D');
var e2 = new Title(890, -100, undefined, 3, 'E');
var r = new Title(930, -100, undefined, 2, 'R');
var s2 = new Title(970, -100, undefined, 1, 'S');

var startButton = new StartButton();
var InstructionButton1 = new InstructionButton();

var circleArray = [];

function init(){

    circleArray = [];

    // Creating particle effect
    for (i = 0; i < 1000; i++){

        var radius = Math.random() * 1 + 1;
        var x = Math.random() * ( innerWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var dx = (Math.random() - 0.5) * 2 ;
        var dy = (Math.random() - 0.5) * 2; 
    
        circleArray.push(new Circle(x, y, dx, dy, radius));

    }
}

// Starting Animation
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0 , 0, innerWidth, innerHeight);

   for (var i = 0; i < circleArray.length; i++){
    
        circleArray[i].update();

   }

    s.update();
    p.update();
    a.update();
    c.update();
    e.update();
    i2.update();
    n.update();
    v.update();
    a2.update();
    d.update();
   e2.update();
    r.update();
    s2.update();

    startButton.update();
    InstructionButton1.update();


} 

animate();
init();



