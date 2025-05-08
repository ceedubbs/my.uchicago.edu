// Project: Intertwingularity
// Notes: gameMode = 0: start screen
//        gameMode = 1: game on
//        gameMode = 2: game in progress
//        gameMode = 3: scene one (collect all targets)
//        gameMode = 4: scene two (go past left edge)

let shape_location = [400,300];
let velocity = [50,50];
let up = false;
let down = false;
let left = false
let right = false;
let moving = false;
let currentColor = [1,100,1];
let gameMode = 0;
let targets = [];
let shape_size = 50;
let targets_populated = false;
let boundaryCounter = 0;
let completionCounter = [0,0,0,0,0]
let circles = [];
let timer = [0,0,0]; //timer[0] = start time, timer[1] = current time, timer[2] = elapsed time

function preload() {
  //cat memes
  clawcadillo = loadImage('/assets/clawcadillo.jpg');
  //creative misuse
  boy_in_nature = loadImage('/assets/creative_misuse.png');
  //fragments of you
  desires_and_reality = loadImage('/assets/desires_and_reality.png');
  //bug collection
  bug_collection = loadImage('/assets/bug_collection.jpeg');
  bug_collection_2 = loadImage('/assets/bug_collection_2.jpeg');
  //bug_collection_3 = loadImage('/assets/bug_collection_3.jpg');
}
function setup() {
  createCanvas(800, 600);
}
function draw() {
  background(220);
  frameRate(120);
  movement();
  boundaryControl();
  if (up === false && down === false && left === false && right === false){
    moving = false;
  }
  if (gameMode === 0){
    fill(0,0,0);
    text("Click to start", 300, 300);
  }
  target();
  sceneHandler();
  circle(shape_location[0], shape_location[1], shape_size);
  circles.push(createVector(shape_location[0], shape_location[1]));
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
  if (key === 'v') {
    saveCanvas('mypiece.jpg');
}
 if (key === 'm') {
    console.log("mic level: " + vol);
    console.log("shape location: " + shape_location[0] + ", " + shape_location[1]);
    console.log("velocity: " + velocity[0] + ", " + velocity[1]);
    console.log("boundaryCounter: " + boundaryCounter);
    console.log("gameMode: " + gameMode);
    console.log("targets length: " + targets.length);
    console.log("completionCounter: " + completionCounter);
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
function movement() {
  if (up === true){
    shape_location[1] -= velocity[1]*0.1;
  }
  if (down === true){
    shape_location[1] += velocity[1]*0.1;
  }
  if (left === true){
    shape_location[0] -= velocity[0]*0.1;
  }
  if (right === true){
    shape_location[0] += velocity[0]*0.1;
  }
}
function boundaryControl() {
  if (shape_location[0] < shape_size/2) {
    shape_location[0] = shape_size-20;
    currentColor = [random(255), random(255), random(255)];
    fill(currentColor[0], currentColor[1], currentColor[2]);
    boundaryCounter++;
  }
  if (shape_location[0] > width-(shape_size/2) && gameMode === 0) {
    shape_location[0] = width-shape_size+20;
    currentColor = [random(255), random(255), random(255)];
    fill(currentColor[0], currentColor[1], currentColor[2]);
    boundaryCounter++;  
  }
  if (shape_location[1] < (shape_size/2)) {
    shape_location[1] = shape_size-20;
    currentColor = [random(255), random(255), random(255)];
    fill(currentColor[0], currentColor[1], currentColor[2]);
    boundaryCounter++;
  }
  if (shape_location[1] > height-(shape_size/2)) {
    shape_location[1] = height-shape_size+20;
    currentColor = [random(255), random(255), random(255)];
    fill(currentColor[0], currentColor[1], currentColor[2]);
    boundaryCounter++;
  }
}
function mouseClicked() {
    if (gameMode === 0){
        gameMode = 1;
        console.log("game on");
    }
}
function target() {
    if (gameMode === 1) {
        for (let i = 0; i < 10; i++){
            let x = random(30, width-30);
            let y = random(30, height-30);
            targets.push(createVector(x, y));
        }
        targets_populated = true;
        gameMode = 2;
        completionCounter[4] = 1;
    }
    for (let i = 0; i < targets.length; i++){
        fill(255, 0, 0);
        circle(targets[i].x, targets[i].y, 20);
    }
    for (let i = 0; i < targets.length; i++){
        if (dist(shape_location[0], shape_location[1], targets[i].x, targets[i].y) < (shape_size/2)) {
            targets.splice(i, 1);
            currentColor = [random(255), random(255), random(255)];
            shape_size += 5;
            velocity[0] += 2;
            velocity[1] += 2;
            console.log("hit");
        }
      }
      
}
function sceneHandler() {
    if (targets.length === 0 && targets_populated === true){ //scene one
        gameMode = 3;
        //console.log("scene one");
        if (completionCounter[0] === 0){
            completionCounter[0] = 1;
        }
        image(desires_and_reality, 300, 100, 200, 200);
      }
      if (shape_location[0] > width+20 && completionCounter[4] === 1) { //scene two cat memes
        gameMode = 4;
        //console.log("scene two");
        image(clawcadillo, 200, 100, 200, 200)
        if (completionCounter[1] === 0){
            completionCounter[1] = 1;
        }
      }
      if (dist(shape_location[0], shape_location[1], 100, 100) < 50 && completionCounter[4] === 1) { //scene three 
        gameMode = 5;
        //console.log("scene three");
        image(bug_collection, 300, 100, 200, 200);
        image(bug_collection_2, 500, 150, 200, 200);
        fill(100,100,100);
        if (completionCounter[2] === 0){
            completionCounter[2] = 1;
        }
      }
      if (boundaryCounter > 100 && completionCounter[4] === 1 && gameMode != 7) { //scene four
        gameMode = 6;
        image(boy_in_nature, 300, 343, 200, 200);
        //console.log("scene four");
        if (completionCounter[3] === 0){
            completionCounter[3] = 1;
        }
      }
      if (completionCounter[0] === 1 && completionCounter[1] === 1 && completionCounter[2] === 1 && completionCounter[3] === 1){
        gameMode = 7;
        //timer[1] = Date.now();
        //elapsedTime = timer[1] - timer[0];
        console.log("game complete");
        //text(elapsedTime, 300, 300);
        for (let i = 0; i < circles.length; i++){
            let pos = circles[i];
            fill(currentColor[0], currentColor[1], currentColor[2]);
            circle(pos.x, pos.y, 50);
          }
      }
}
