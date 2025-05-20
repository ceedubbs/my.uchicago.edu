let activeItemEvent = null;
let player = {
  x: 400,
  y: 300,
  velocity: 30,
  size: 60,
  direction: "down",
  moving: false,
  step: 0, // toggles between 0 and 1 for animation
  lastMoveTime: 0, // to control animation rate
  coins: 0,
  knowledge: 0,
  sprites: {
    down: null, // assign in preload
    up: null,
    left: null,
    right: null,
    walk_left: null,
    walk_right: null,
    walk_up: null,
    walk_down: null,
  },
};
let smokingFrames = [];
let itemSprites = {}; // We'll load these in preload

let items = [
  {
    name: "marlboro_red",
    x: 480,
    y: 240,
    size: 40,
    scene: 1, // the 'outside' scene (index)
    sprite: null, // will assign in preload
    onPickup: function() {
      activeItemEvent = {
        duration: 10000, // ms (10s)
        startedAt: millis(),
        frames: [smokingFrames[0], smokingFrames[1]],
        frameDuration: 1000,
        frameIndex: 0,
        lastFrameSwitch: millis(),
        knowledgePointsGiven: 0,
        effect: function(elapsed) {
          let seconds = Math.floor(elapsed / 1000);
          if (seconds > this.knowledgePointsGiven && seconds <= 10) {
            player.knowledge += 1;
            this.knowledgePointsGiven = seconds;
          }
        },
        onEnd: function() {
          // You can trigger a dialog or stat update here if needed.
        }
      };
    }
  },
  // Add more items as needed, with scene: [sceneIndex]
];

let startSceneColliders = [
  // Reception Desk (top middle)
  [250, 0, 300, 80],
  // Left Arch/Wall
  [0, 0, 130, 280],
  // Right Wall by bookshelf/door
  [710, 0, 90, 265],
  // Top left bookshelf
  [140, 0, 65, 130],
  // Right bookshelf
  [660, 110, 120, 100],

  // Tables (center)
  [180, 170, 140, 40],  // top left table
  [500, 170, 140, 40],  // top right table
  [180, 270, 140, 40],  // bottom left table
  [500, 270, 140, 40],  // bottom right table

  // Reception plants/bookshelves
  [200, 0, 35, 80],    // left plant/bookshelf by desk
  [565, 0, 35, 80],    // right plant/bookshelf by desk

  // Bottom left table (partially offscreen)
  [0, 460, 130, 50],

  // Bottom walls/rooms
  [0, 530, 300, 90], //left
  [500, 530, 250, 90], //right

  // Door frame (right bottom)
  [680, 370, 160, 120],
];
let outsideSceneColliders = [
// Top wall/building above doors (full width)
[0, 0, 800, 140],

// Left planter (vertical)
[0, 140, 280, 450],

// Right planter (vertical)
[580, 140, 280, 450],

// Bottom left grass (horizontal)
[0, 540, 270, 60],

// Bottom right grass (horizontal)
[530, 540, 270, 60],

// Left inner grass (patch by left planter)
[200, 310, 50, 230],

// Right inner grass (patch by right planter)
[550, 310, 50, 230],
];
let studyroomSceneColliders = [
  
  // --- Top row bookshelves ---
  [0, 0, 170, 150],     // Left shelf
  [630, 0, 90, 170],   // Right shelf

  // --- Top right column/pillar ---
  [730, 50, 40, 170],

  // --- Top row of tables (3 tables with books/laptops) ---
  [290, 110, 50, 110],   // Left table
  [420, 110, 50, 110],   // Center table
  [560, 110, 50, 110],   // Right table

  // --- Middle row tables ---
  [290, 280, 50, 110],   // Left
  [420, 280, 50, 110],   // Center
  [560, 280, 50, 110],   // Right

  // --- Bottom right and center tables ---
  [210, 450, 130, 60], // Bottom left table (with laptop & book)
  [520, 450, 150, 60], // Bottom right table
  // --- Center left table ---
  [0, 310, 100, 60],
  // --- Center left top chair (next to table)---
  [0, 250, 80, 60],
  // --- Top chair backstop ---
  [210, 120, 10, 110],
  // --- Bottom right small bookshelf ---
  [730, 300, 40, 170],
  // -- back wall ---
  [0, 0, 800, 150],
];

let scenes = [
  {
    name: "library",
    background: null,
    borderFunc: genericBoundaryControl,
    colliders: startSceneColliders,
    transitions: [
      // [x, y, w, h, targetSceneIndex]
      [270, 540, 250, 60, 1], //goes to "outside"
      [0, 280, 130, 60, 2], //goes to "studyroom"
    ],
    onEnter: function () {
        player.x = 330;
        player.y = 450;
    }, 
  },
  {
    name: "outside",
    background: null,
    borderFunc: genericBoundaryControl,
    colliders: outsideSceneColliders,
    transitions: [
      [350, 180, 100, 30, 0], //returns to "start"
    ],
    onEnter: function () {
      player.x = 400;
      player.y = 230;
    }
  },
  {
    name: "studyroom",
    background: null,
    borderFunc: genericBoundaryControl,
    colliders: studyroomSceneColliders,
    transitions: [
      [0, 570, 120, 40, 0], //returns to start
      [770, 500, 40, 120, 3]
    ],
    onEnter: function () {
      player.x = 50;
      player.y = 480;
    }
  },
  {
    name: "stacks",
    background: null,
    borderFunc: genericBoundaryControl,
    colliders: [],
    transitions: [
      [400, 570, 120, 40, 0], //returns to reading room
    ],
    onEnter: function () {
      player.x = 50;
      player.y = 480;
    }
  },
  

];
let currentScene = 0;
let currentColor = [1, 100, 1];
let gameMode = 0;
let timer = [0, 0, 0];
let inZoneSince = null;
let currentTransitionZone = null;
let TRANSITION_TIME = 1500; // milliseconds
let statCounterImg;
let canPickUp = false;

// images
let guy, background_reg, facing_backward, walking_left, walking_right;

function preload() {
  player.sprites.down = loadImage("/assets/stationary.png");
  player.sprites.up = loadImage("/assets/facing_backward.png");
  player.sprites.left = loadImage("/assets/walking_left.png");
  player.sprites.right = loadImage("/assets/walking_right.png");
  // Load the player sprites
  player.sprites.walk_left = loadImage("/assets/walking_left.png");
  player.sprites.walk_right = loadImage("/assets/walking_right.png");
  player.sprites.walk_up = loadImage("/assets/facing_backward.png");
  player.sprites.walk_down = loadImage("/assets/walking_forward.png");
  // Load the background images
  scenes[0].background = loadImage("/assets/background_reg.png");
  scenes[1].background = loadImage("/assets/background_outside.png");
  scenes[2].background = loadImage("/assets/background_studyroom.png");
  // Load the stat counter image
  statCounterImg = loadImage('/assets/stat_counter.png');
  // Load item sprites
  itemSprites.marlboro_red = loadImage("/assets/marlboro_red.png");
  smokingFrames[0] = loadImage("/assets/smoking_scene_1.png");
  smokingFrames[1] = loadImage("/assets/smoking_scene_2.png");

  // Assign sprites to items
  items.forEach(item => {
    if (item.name === "marlboro_red") item.sprite = itemSprites.marlboro_red;
    // ...add other sprites if needed...
  });
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220);

  // Draw the scene background
  if (scenes[currentScene].background) {
      image(scenes[currentScene].background, 0, 0, width, height);
  }

  // Debug only: draw only current scene's colliders!
  if (scenes[currentScene].colliders) {
    drawColliders(scenes[currentScene].colliders, [255, 0, 0, 100]);
  }

  frameRate(60);
  scenes[currentScene].borderFunc();

  if (gameMode === 0){
    fill(255);
    stroke(24)
    textSize(24);
    text("Click to start", 335, 300);
    return;
  }
  
  fill(0);
  text(`player location: ${player.x}, ${player.y}`, 10, 20);

  drawStatsGUI();
  handleSceneTransitions();

  // Transition scene debugger
  if (scenes[currentScene].transitions) {
    drawColliders(scenes[currentScene].transitions, [0, 255, 255, 80]);
  }
  if (canPickUp) {
    fill(255);
    textSize(16);
    text("Press E to pick up", player.x + player.size/2, player.y - 10);
  }
  if (activeItemEvent) {
    let elapsed = millis() - activeItemEvent.startedAt;
  
    // Animate frames if any
    if (activeItemEvent.frames && activeItemEvent.frames.length > 0) {
      if (millis() - activeItemEvent.lastFrameSwitch > activeItemEvent.frameDuration) {
        activeItemEvent.frameIndex = (activeItemEvent.frameIndex + 1) % activeItemEvent.frames.length;
        activeItemEvent.lastFrameSwitch = millis();
      }
      image(activeItemEvent.frames[activeItemEvent.frameIndex], player.x, player.y, player.size, player.size);
    } else {
      drawPlayer();
    }
    // Effect function (can award points, display overlays, etc)
    if (typeof activeItemEvent.effect === "function") {
      activeItemEvent.effect.call(activeItemEvent, elapsed);
    }
  
    // End the event after duration
    if (elapsed > activeItemEvent.duration) {
      if (typeof activeItemEvent.onEnd === "function") {
        activeItemEvent.onEnd();
      }
      activeItemEvent = null;
    }
  } else {
    drawPlayer();
  }
  
  drawSceneItems();
  handleItemPickup();
}


function keyReleased() {
  if (gameMode !== 1 || activeItemEvent) return;

  let moved = false;
  if (key === "w" || key === "ArrowUp") {
    player.y -= player.velocity;
    player.direction = "up";
    moved = true;
  } else if (key === "s" || key === "ArrowDown") {
    player.y += player.velocity;
    player.direction = "down";
    moved = true;
  } else if (key === "a" || key === "ArrowLeft") {
    player.x -= player.velocity;
    player.direction = "left";
    moved = true;
  } else if (key === "d" || key === "ArrowRight") {
    player.x += player.velocity;
    player.direction = "right";
    moved = true;
  }
  // Toggle step to animate on every move
  if (moved) {
    player.step = 1 - player.step; // flip between 0 and 1
    player.moving = true;
    player.lastMoveTime = millis();
  } else {
    player.moving = false;
  }
}
function drawPlayer() {
  let img;
  if (player.moving && player.step === 1) {
    // Use walking frames for each direction
    if (player.direction === "left") img = player.sprites.walk_left;
    else if (player.direction === "right") img = player.sprites.walk_right;
    else if (player.direction === "up") img = player.sprites.walk_up;
    else if (player.direction === "down") img = player.sprites.walk_down;
  } else {
    // Always use stationary frame (facing down) when not moving
    img = player.sprites.down;
  }

  if (img) {
    image(img, player.x, player.y, player.size, player.size*1.4);
  } else {
    fill(255, 0, 0); // fallback: red block for error
    rect(player.x, player.y, player.size, player.size*1.4);
    text("ERR", player.x + 10, player.y + 20);
  }

  if (player.moving && millis() - player.lastMoveTime > 500) {
    player.moving = false;
  }
}

function genericBoundaryControl() {
  // Prevent leaving the canvas
  if (player.x < 0) player.x = 0;
  if (player.x > width - player.size) player.x = width - player.size;
  if (player.y < 0) player.y = 0;
  if (player.y > height - player.size) player.y = height - player.size;

  let colliders = scenes[currentScene].colliders || [];
  for (let i = 0; i < colliders.length; i++) {
      let c = colliders[i];
      if (rectsOverlap(player.x, player.y, player.size, player.size, c[0], c[1], c[2], c[3])) {
          // Undo last move
          if (player.direction === "up") player.y += player.velocity;
          if (player.direction === "down") player.y -= player.velocity;
          if (player.direction === "left") player.x += player.velocity;
          if (player.direction === "right") player.x -= player.velocity;
      }
  }
}


// Helper for AABB collision (axis-aligned rectangles)
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function drawColliders(colliders, colorVal = [255, 0, 0, 100]) {
    push();
    noStroke();
    fill(...colorVal); // default: semi-transparent red
    for (let i = 0; i < colliders.length; i++) {
        let c = colliders[i];
        rect(c[0], c[1], c[2], c[3]);
    }
    pop();
}

function changeScene(sceneIndex) {
    currentScene = sceneIndex;
    if (scenes[currentScene].onEnter) {
        scenes[currentScene].onEnter();
    }
}

function mouseClicked() {
  if (gameMode === 0) {
    gameMode = 1;
    console.log("game on");
  }
}

function drawStatsGUI() {
    // Draw the GUI image in the top left corner
    let guiX = 740;
    let guiY = 0;
    let guiW = 60;  // Resize if needed
    let guiH = 125;

    image(statCounterImg, guiX, guiY, guiW, guiH);

    // Set text properties
    fill(255,194,133);
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER, CENTER);
    textSize(12);

    // Draw "coins" (yellow circle area, near the top)
    text(player.coins, guiX + guiW/2, guiY + 52);

    // Draw "knowledge" (brown book area, near the middle)
    text(player.knowledge, guiX + guiW/2, guiY + 110);
}

function handleSceneTransitions() {
  let transitions = scenes[currentScene].transitions || [];
  let inZone = false;
  let zoneIndex = null;

  for (let i = 0; i < transitions.length; i++) {
      let z = transitions[i];
      if (rectsOverlap(player.x, player.y, player.size, player.size, z[0], z[1], z[2], z[3])) {
          inZone = true;
          zoneIndex = i;
          break;
      }
  }

  if (inZone) {
      if (currentTransitionZone !== zoneIndex) {
          inZoneSince = millis();
          currentTransitionZone = zoneIndex;
      } else if (millis() - inZoneSince > TRANSITION_TIME) {
          let target = transitions[zoneIndex][4];
          changeScene(target);
          inZoneSince = null;
          currentTransitionZone = null;
      }
  } else {
      inZoneSince = null;
      currentTransitionZone = null;
  }
}

function drawSceneItems() {
  for (let item of items) {
    if (item.scene === currentScene) {
      if (item.sprite) {
        image(item.sprite, item.x, item.y, item.size, item.size);
      } else {
        // Placeholder: a colored square
        fill(200,0,0);
        rect(item.x, item.y, item.size, item.size);
      }
    }
  }
}
function handleItemPickup() {
  canPickUp = false;
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    if (item.scene === currentScene) {
      let dx = player.x + player.size/2 - (item.x + item.size/2);
      let dy = player.y + player.size/2 - (item.y + item.size/2);
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < item.size * 0.8) {
        canPickUp = true;
        if (keyIsDown(69)) { // 'e'
          if (item.onPickup) item.onPickup();
          items.splice(i, 1);
        }
        break;
      }
    }
  }
}