let cirLocation = [400,300];
let velocity = [0,0];
let acceleration = 2;
let momentum = [0,0];
let drag = 1;
let up = false;
let down = false;
let left = false
let right = false;
let moving = false;
let circles = [];
//build a circle of circles for loop to create an array of circles

function preload() {
  img = loadImage('/assets/fractal.jpeg');
}
function setup() {
  createCanvas(800, 600);
}
function draw() {
  background(220);
  //image(img, 0, 0, width, height);
  circle(cirLocation[0],cirLocation[1],80);
  circleMovement();
  boundaryControl();
  text("circle x: " + cirLocation[0] + "  circle y: " + cirLocation[1],10,30)
  text("velocity: " + velocity ,10 , 50)
  text("origin",10,10)
  text("+x",700,10)
  text("+y",10,500)
  //text("momentum x: " + momentum[0] + "  momentum y: " + momentum[1],10,50)
  grandExplosion();
  dragMovement();
  if (up === false && down === false && left === false && right === false){
    moving = false;
  }
}

function keyPressed() {
  console.log('Key pressed:', key);
  if (key === 'w' || key === 'ArrowUp'){
    up = true;
    circle.push(cirLocation[0], cirLocation[1]);
  }
  if (key === 's' || key === 'ArrowDown'){
    down = true;
    circle.push(cirLocation[0], cirLocation[1]);
  }
  if (key === 'a' || key === 'ArrowLeft'){
    left = true;
    circle.push(cirLocation[0], cirLocation[1]);
  }
  if (key === 'd' || key === 'ArrowRight'){
    right = true;
    circle.push(cirLocation[0], cirLocation[1]);
  }
  if (up === true || down === true || left === true || right === true){
    moving = true;
    console.log("moving");
  }
  if (key === ' ') {
    console.log(up, down, left, right);
    console.log(moving);
}
}
function keyReleased() {
  console.log('Key released:', key);
  if (key === 'w' || key === 'ArrowUp'){
    up = false;
  }
  if (key === 's' || key === 'ArrowDown'){
    down = false;
  }
  if (key === 'a' || key === 'ArrowLeft'){
    left = false;
  }
  if (key === 'd' || key === 'ArrowRight'){
    right = false;
  }
  
}
function dragMovement() {
    if (moving === false){ 
        console.log("dragging");
        if (velocity[0] > 0) {
        cirLocation[0] += velocity[0]*0.1;
        velocity[0] -= drag;
        console.log("dragging right");
        }
        if (velocity[0] < 0) {
        cirLocation[0] += velocity[0]*0.1;
        velocity[0] += drag;
        console.log("dragging left");
        }
        if (velocity[1] > 0) {
        cirLocation[1] += velocity[1]*0.1;
        velocity[1] -= drag;
        console.log("dragging down");
        }
        if (velocity[1] < 0) {
        cirLocation[1] += velocity[1]*0.1;
        velocity[1] += drag;
        console.log("dragging up");
        }
    }
}

function circleMovement() {
  if (up === true){
    cirLocation[1] += velocity[1]*0.1;
    console.log("moved up");
    velocity[1] -= acceleration;
  }
  if (down === true){
    cirLocation[1] += velocity[1]*0.1;
    console.log("moved down");
    velocity[1] += acceleration;
  }
  if (left === true){
    cirLocation[0] += velocity[0]*0.1;
    console.log("moved left");
    velocity[0] -= acceleration;
  }
  if (right === true){
    cirLocation[0] += velocity[0]*0.1;
    console.log("moved right");
    velocity[0] += acceleration;
  }
}

function boundaryControl() {
  if (cirLocation[0] < 40) {
    cirLocation[0] = 50;
    velocity[0] = -velocity[0];
    fill(random(255), random(255), random(255));
  }
  if (cirLocation[0] > width-40) {
    cirLocation[0] = width-50;
    velocity[0] = -velocity[0];
    fill(random(255), random(255), random(255));
  }
  if (cirLocation[1] < 40) {
    cirLocation[1] = 50;
    velocity[1] = -velocity[1];
    fill(random(255), random(255), random(255));
  }
  if (cirLocation[1] > height-40) {
    cirLocation[1] = height-50;
    velocity[1] = -velocity[1];
    fill(random(255), random(255), random(255));
  }
}
function grandExplosion() {
  if (velocity > 50) {
    for (let i = 0; i < 100; i++) {
      let x = random(0, width);
      let y = random(0, height);
      fill(random(255), random(255), random(255));
      circle(x, y, 10);
    }
  }
}