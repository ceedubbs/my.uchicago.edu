let shape_location = [400,300];
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
let triangles = [];
let squares = [];
let currentColor = [0,0,0];
let mode = 1;
var mic;
let vol = 0;

function preload() {
  //img = loadImage('/assets/fractal.jpeg');
}
function setup() {
  createCanvas(800, 600);
  mic = new p5.AudioIn();
  mic.start();
}
function draw() {
  background(220);
  let vol = mic.getLevel();
  modeHandling();
  movement();
  boundaryControl();
  dragMovement();
  if (up === false && down === false && left === false && right === false){
    moving = false;
  }
  text("circle x: " + shape_location[0] + "  circle y: " + shape_location[1],10,30)
  text("velocity: " + velocity ,10 , 50)
  text("origin",10,10)
  text("+x",700,10)
  text("+y",10,500)
  //text("momentum x: " + momentum[0] + "  momentum y: " + momentum[1],10,50)
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
        shape_location[0] += velocity[0]*0.1;
        velocity[0] -= drag;
        console.log("dragging right");
        }
        if (velocity[0] < 0) {
        shape_location[0] += velocity[0]*0.1;
        velocity[0] += drag;
        console.log("dragging left");
        }
        if (velocity[1] > 0) {
        shape_location[1] += velocity[1]*0.1;
        velocity[1] -= drag;
        console.log("dragging down");
        }
        if (velocity[1] < 0) {
        shape_location[1] += velocity[1]*0.1;
        velocity[1] += drag;
        console.log("dragging up");
        }
    }
}
function movement() {
  if (up === true){
    shape_location[1] += velocity[1]*0.1;
    console.log("moved up");
    velocity[1] -= acceleration;
  }
  if (down === true){
    shape_location[1] += velocity[1]*0.1;
    console.log("moved down");
    velocity[1] += acceleration;
  }
  if (left === true){
    shape_location[0] += velocity[0]*0.1;
    console.log("moved left");
    velocity[0] -= acceleration;
  }
  if (right === true){
    shape_location[0] += velocity[0]*0.1;
    console.log("moved right");
    velocity[0] += acceleration;
  }
}
function boundaryControl() {
  if (shape_location[0] < vol) {
    shape_location[0] = vol;
    velocity[0] = -velocity[0];
    currentColor = [random(255), random(255), random(255)];
    fill(currentColor[0], currentColor[1], currentColor[2]);
  }
  if (shape_location[0] > width-vol) {
    shape_location[0] = width-vol;
    velocity[0] = -velocity[0];
    currentColor = [random(255), random(255), random(255)];
    fill(currentColor[0], currentColor[1], currentColor[2]);
  }
  if (shape_location[1] < vol) {
    shape_location[1] = vol;
    velocity[1] = -velocity[1];
    currentColor = [random(255), random(255), random(255)];
    fill(currentColor[0], currentColor[1], currentColor[2]);
  }
  if (shape_location[1] > height-vol) {
    shape_location[1] = height-vol;
    velocity[1] = -velocity[1];
    currentColor = [random(255), random(255), random(255)];
    fill(currentColor[0], currentColor[1], currentColor[2]);
  }
}
function modeHandling() {
    if (mode === 1){ // circle mode
        circles.push(createVector(shape_location[0], shape_location[1]));
    }
    if (mode === 2){ // square mode
        squares.push(createVector(shape_location[0], shape_location[1]));
    }
    if (mode === 3){ // triangle mode
        triangles.push(createVector(shape_location[0], shape_location[1]));
    }
    for (let i = 0; i < circles.length; i++){
        let pos = circles[i];
        fill(currentColor[0], currentColor[1], currentColor[2]);
        ellipse(pos.x, pos.y,(vol+1)*50);
      }
      for (let i = 0; i < squares.length; i++){
        let pos = squares[i];
        fill(currentColor[0], currentColor[1], currentColor[2]);
        square(pos.x-40, pos.y-40,(vol+1)*50);
      }
      for (let i = 0; i < triangles.length; i++){
        let pos = triangles[i];
        fill(currentColor[0], currentColor[1], currentColor[2]);
        triangle(pos.x, pos.y-((vol+0.5)*50), pos.x+((vol+0.5)*50), pos.y+((vol+0.5)*50), pos.x-((vol+0.5)*50), pos.y+((vol+0.5)*50));
      }
}
function mouseClicked() {
    if (mode < 3){
        mode++;
    }
    else {
        mode = 1;
    }
    console.log("mode: " + mode);
}
function micHandling() {
    let vol = mic.getLevel();
    console.log(vol);
}
