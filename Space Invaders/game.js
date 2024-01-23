const scoreEl = document.querySelector('#scoreEl') // Score element for displaying the score
const canvas = document.querySelector('canvas') // Canvas element for drawing the game
const ctx = canvas.getContext('2d'); // Context of the canvas, used for drawing

// Set canvas dimensions
canvas.width = 1224
canvas.height = 726

// level Screen and choosing levels
const levelScreen = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Level Screen Title
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Level Screen', canvas.width / 2 - 100, 50);

    // Loading Images
    const image1 = new Image();
    const image2 = new Image();
    const image3 = new Image();

    image1.onload = () => {
        const scale = 0.1;
        const imageWidth = image1.width * scale;
        const imageHeight = image1.height * scale;
        
        ctx.drawImage(image1, canvas.width / 2 - 50, 200, imageWidth, imageHeight);
    };

    image1.src = './level1.png';

    image2.onload = () => {
        const scale = 0.1;
        const imageWidth = image2.width * scale;
        const imageHeight = image2.height * scale;
        
        ctx.drawImage(image2, canvas.width / 2 - 65, 300, imageWidth, imageHeight);
    };

    image2.src = './level2.png';

    image3.onload = () => {
        const scale = 0.1;
        const imageWidth = image3.width * scale;
        const imageHeight = image3.height * scale;
        
        ctx.drawImage(image3, canvas.width / 2 - 100, 400, imageWidth, imageHeight);
    };

    image3.src = './level3.png';
};


// Player -----------------------------------------------------------------------------------
class Player {
    constructor(){
        // player properties
        this.velocity = {
            x : 0,
            y : 0
        }

        this.rotation = 0
        this.opacity = 1
        // setting player image
        const image = new Image()
        image.src = './space ship.png'
        image.onload = () => {
            const scale = 0.15;
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {   // player position
                x : canvas.width / 2 - this.width /2,
                y : canvas.height - this.height - 20
            }
        }
        
    }

    // Drawing player on canvas
    draw(){

        ctx.save();

        ctx.globalAlpha = this.opacity
        ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        ctx.rotate(this.rotation)
        ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)


        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }

    // moving player
    update(){
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x
        }
    }
}

// Shooting -----------------------------------------------------------
class Projectile {
    constructor({position, velocity}){
        // Properties
        this.position = position
        this.velocity = velocity

        this.radius = 4
    }

    // drawing projectile
    draw(){
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill()
        ctx.closePath()
    }
    // moving projectile
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

// Particle effects when player or enemy is hit
class Particle {
    // properties 
    constructor({position, velocity, radius,  color, fades}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    // drawing particles
    draw(){
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    // animating particles and making them dissapear
    update(){
        this.draw() 
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.fades){
            this.opacity -= 0.01
        }
    }
}

// Enemy Projectles
class InvaderProjectile {
    // properties
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }

    // Drawing projectile
    draw(){
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    // moving projectile
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

// Invaders -----------------------------------------------------------
class Invader {
    constructor({position}){

        this.velocity = {
            x : 0,
            y : 0
        }

        // Setting enemy images
        const image = new Image()
        image.src = './invader.png'
        image.onload = () => {
            const scale = 0.1;
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x : position.x,
                y : position.y
            }
        }
        
    }


    // drawing enemies
    draw(){

        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

    }

    // moving enemies
    update({velocity}){
        if (this.image) {
            this.draw();
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
    // enemies shooting projectiles
    shoot(invaderProjectiles){
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
               x: 0,
               y: 5 
            }
        }))
    }
}

// Grid of enemies
class Grid{
    // Properties
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 1,
            y: 0
        }

        this.invaders = []

        // Filling grid with invaders and spacing them out
        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)
        
        this.width = columns * 60

        for (let x = 0; x < columns; x++){
            for (let y = 0; y < rows; y++){
                this.invaders.push(new Invader({position: {
                    x: x * 60,
                    y: y * 40
                }}))
            }   
        }
        console.log(this.invaders)
    }
    // moving invaders 
    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 40
        }
    }
}

// Player class and arrays 
const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];

// checking for keyboard input
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

// Setitng frames and game running or not running
let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
    over: false,
    active: true
}

// Score varaible
let score = 0

// Enemy explosion when they are hit by player projectiles
for(let i = 0; i < 100; i++){
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity:{
            x: 0,
            y: 0.4
        },
        radius: Math.random() * 2,  
        color: 'white'
    }))
} 

// Function for making explosions
function creatExplosion({object, color, fades}){
                                
    // Explosion Effects
    for(let i = 0; i < 15; i++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity:{
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,  
            color: color || '#BAA0DE',
            fades
        }))
    } 
}

// Animation ---------------------------------------------------
function animate(){
    // Check if the game is active or not
    if (!game.active) return
    // animation loop and clearing canvas
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Updating the player
    player.update();

    // Moving and drawing particle explosions
    particles.forEach((particle, i) => {

        if(particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }
        // Removing particle if its opacity reaches 0
        if (particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else{
            particle.update()
        }
    })

    
    // Update invader projectiles and handle collisions and removing invaders
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(index, 1) 
            }, 0); 
        } else{
            invaderProjectile.update()
        }

        // Projectile colision with player
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x + invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x +player.width){
            
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0 
                game.over = true
            }, 0); 

            // ending game and changing screen to lose screen
            setTimeout(() => {
                game.active = false
                window.location.href = './loseScreen.html'
            }, 2000); 
            // explosion effect when player is hit
            creatExplosion({ 
                object: player,
                color: 'red',  
                fades: true                          
            })
        }
    })    

    // Updating player projectiles and removing them
    projectiles.forEach((projectile, index) => {

        if (projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1) 
            }, 0);            
        } else{
            projectile.update()
        }    
    })
    // Moving invaders and bouncing from the wall

    grids.forEach((grid, gridIndex) =>{
        grid.update()

        // Spawn Invader Projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0){
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})

            // Projectiles hit enemy
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y) {

                    // handelling collision
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
                        const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)


                        // Removing Invaders and Projectiles 
                        if (invaderFound && projectileFound){
                            score += 100  // increasing score
                            console.log(score)
                            scoreEl.innerHTML = score
                            creatExplosion({
                                object: invader,  
                                fades: true                           
                            })
                            // removing invaders when they are hit
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            // Changing dminesions of grid to bounce  or auto clearance
                            if (grid.invaders.length > 0) {
                                
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x;
                            } else {
                               grids.splice(gridIndex, 1)
                            }
                        }
                    },0)
                } 
            })
        })
    })

    // Player input and moving player and rotating player
    if (keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -5
        player.rotation = -0.15
    } else if(keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 5
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    // Spawning invaders
    if (frames % randomInterval === 0){
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500);
        frames = 0;
    }
    
    // Increasing framess
    frames++;

}

// staritng game
const startGame = () => {
    animate();
};

// Call the level screen before starting the game loop
levelScreen();

// Add event listener to start the game when the user clicks
canvas.addEventListener('click', () => {
    startGame();
});




// Movement and keys

// keyboard input when pressed
addEventListener('keydown', ({key}) => {
    if (game.over) return

    switch(key){
        // moving left for player with 'a' key
        case 'a': 
            keys.a.pressed = true
            break
            // moving right for player with 'd' key
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            // player shooting when space pressed
            projectiles.push(new Projectile({
                position:{
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            break
    } 
})

// stopping movement or shooting when keys are released
addEventListener('keyup', ({key}) => {
    switch(key){
        case 'a': 
            // console.log('left')
            keys.a.pressed = false
            break
        case 'd':
            // console.log('right')
            keys.d.pressed = false
            break
        case ' ':
            // console.log('space')
            break
    }
})