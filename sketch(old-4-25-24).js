let cirLocation = [400,300];
let velocity = [0,0];
let acceleration = 0.1;
let momentum = [0,0];
let drag = 0.5;
let up;
let down;
let left;
let right;
let moving = false;

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
}

function keyPressed() {
  console.log('Key pressed:', key);
  if (key === 'w' || key === 'ArrowUp'){
    up = true;
  }
  if (key === 's' || key === 'ArrowDown'){
    down = true;
  }
  if (key === 'a' || key === 'ArrowLeft'){
    left = true;
  }
  if (key === 'd' || key === 'ArrowRight'){
    right = true;
  }
  if (up === true || down === true || left === true || right === true){
    moving = true;
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
  if (up === false && down === false && left === false && right === false){
    moving = false;
  }
  // if (up === false && down === false && left === false && right === false && velocity[0] > 0 && velocity[1] > 0){
  //   cirLocation[0] += velocity[0];
  //   cirLocation[1] += velocity[1];
  //   velocity[0] -= drag;
  //   velocity[1] -= drag;
  //   console.log("dragging");
  // }
  // if (up === false && down === false && left === false && right === false && velocity[0] < 0 && velocity[1] < 0){
  //   cirLocation[0] += velocity[0];
  //   cirLocation[1] += velocity[1];
  //   velocity[0] += drag;
  //   velocity[1] += drag;
  //   console.log("dragging");
  // }
  // if (up === false && down === false && left === false && right === false && velocity[0] > 0 && velocity[1] < 0){
  //   cirLocation[0] += velocity[0];
  //   cirLocation[1] += velocity[1];
  //   velocity[0] -= drag;
  //   velocity[1] += drag;
  //   console.log("dragging");
  // }
  // if (up === false && down === false && left === false && right === false && velocity[0] < 0 && velocity[1] > 0){
  //   cirLocation[0] += velocity[0];
  //   cirLocation[1] += velocity[1];
  //   velocity[0] += drag;
  //   velocity[1] -= drag;
  //   console.log("dragging");
  // }
  // velocity[0] = 0;
  // velocity[1] = 0;
}

function circleMovement() {
  if (up === true){
    cirLocation[1] += velocity[1];
    console.log("moved up");
    velocity[1] -= acceleration;
  }
  if (down === true){
    cirLocation[1] += velocity[1];
    console.log("moved down");
    velocity[1] += acceleration;
  }
  if (left === true){
    cirLocation[0] += velocity[0];
    console.log("moved left");
    velocity[0] -= acceleration;
  }
  if (right === true){
    cirLocation[0] += velocity[0];
    console.log("moved right");
    velocity[0] += acceleration;
  }
  circle(cirLocation[0], cirLocation[1], 80);
}

function dragMovement() { 

}

function boundaryControl() {
  if (cirLocation[0] < 40) {
    cirLocation[0] = 50;
    fill(random(255), random(255), random(255));
  }
  if (cirLocation[0] > width-40) {
    cirLocation[0] = width-50;
    fill(random(255), random(255), random(255));
  }
  if (cirLocation[1] < 40) {
    cirLocation[1] = 50;
    fill(random(255), random(255), random(255));
  }
  if (cirLocation[1] > height-40) {
    cirLocation[1] = height-50;
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