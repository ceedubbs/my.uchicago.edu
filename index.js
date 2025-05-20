let activeItemEvent = null;
let currentScene = 1;
let currentColor = [1, 100, 1];
let gameMode = 0;
let timer = [0, 0, 0];
let inZoneSince = null;
let currentTransitionZone = null;
let TRANSITION_TIME = 1500; // milliseconds
let statCounterImg;
let canPickUp = false;
let comeFrom = null;
let admissionScroll; // Add this at the top
let showIntroScroll = true; // Track if scroll is being shown

let phoneMemes = [];
let phoneScrollIndex = 0;
let phoneOpen = false;

//music
let musicTracks = [];
let trackNames = [
  "Minecraft",
  "Living-Mice",
  "Moog-City",
  "Sweden",
  "Subwoofer-Lullaby",
  "Mice-On-Venus",
];
let trackFiles = [
  "/music/Minecraft.mp3",
  "/music/Living-Mice.mp3",
  "/music/Moog-City.mp3",
  "/music/Sweden.mp3",
  "/music/Subwoofer-Lullaby.mp3",
  "/music/Mice-On-Venus.mp3",
];
let currentTrackIndex = -1;
let previousTracks = [];
let musicTimer = 0;
let musicInterval = 3 * 60 * 1000; // 3 minutes
let waitingForNextTrack = false;

// images
let guy,
  background_reg,
  facing_backward,
  walking_left,
  walking_right,
  bookshelfImg,
  phoneGuiImg;

let player = {
  x: 300, //400
  y: 200, //300
  velocity: 30,
  size: 60,
  direction: "down",
  moving: false,
  step: 0,
  lastMoveTime: 0,
  coins: 0,
  knowledge: 0,
  sprites: {
    down: null,
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
let drinkingFrames = [];
let itemSprites = {};

let items = [
  {
    name: "marlboro_red",
    x: 480,
    y: 240,
    size: 50,
    scene: 1, // the 'outside' scene (index)
    sprite: null, // will assign in preload
    onPickup: function () {
      activeItemEvent = {
        name: "smoking",
        duration: 10000, // ms (10s)
        startedAt: millis(),
        frames: [smokingFrames[0], smokingFrames[1]],
        frameDuration: 1000,
        frameIndex: 0,
        lastFrameSwitch: millis(),
        knowledgePointsGiven: 0,
        draw: function () {
          // Animate frames
          if (millis() - this.lastFrameSwitch > this.frameDuration) {
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
            this.lastFrameSwitch = millis();
          }
          image(
            this.frames[this.frameIndex],
            player.x,
            player.y,
            player.size,
            player.size * 1.4
          );
          // (Optional) Add a message or overlay here
        },
        effect: function (elapsed) {
          let seconds = Math.floor(elapsed / 1000);
          if (seconds > this.knowledgePointsGiven && seconds <= 10) {
            player.knowledge += 1;
            this.knowledgePointsGiven = seconds;
          }
        },
        onEnd: function () {},
      };
    },
  },

  // --------- COFFEE ITEM ----------
  {
    name: "coffee",
    x: 460,
    y: 260,
    size: 60,
    scene: 0, // library
    sprite: null, // assign in preload
    onPickup: function () {
      const baseSpeed = player.velocity;
      activeItemEvent = {
        startedAt: millis(),
        duration: 10 * 60 * 1000,
        messageDuration: 3000,
        message: "speed boost enabled",
        messageStart: millis(),
        blocksMovement: true, // << Only true during the animation
        effect: function (elapsed) {
          if (elapsed < 5 * 60 * 1000) {
            player.velocity = baseSpeed + 30;
          } else if (elapsed >= 10 * 60 * 1000) {
            player.velocity = baseSpeed;
          }
          // After animation, allow movement
          if (millis() > this.messageStart + this.messageDuration) {
            this.blocksMovement = false;
          }
        },
        draw: function () {
          let showAnim = millis() < this.messageStart + this.messageDuration;
          if (showAnim) {
            // Animation: alternate between two frames
            let frame =
              Math.floor(millis() / 250) % 2 === 0
                ? drinkingFrames[0]
                : drinkingFrames[1];
            image(
              frame,
              player.x - 10,
              player.y - 10,
              player.size * 1.5,
              player.size * 1.8
            );

            // Draw message above the animation
            fill(255, 255, 0);
            textSize(15);
            textAlign(CENTER, BOTTOM);
            text(this.message, player.x + player.size / 2, player.y - 20);
          } else {
            // After animation, just draw the normal player sprite
            drawPlayer();
          }
          drawSceneItems();
        },
        onEnd: function () {
          player.velocity = baseSpeed;
          player.knowledge += 5;
        },
      };
    },
  },
  // --------- PHONE ITEM ----------
  {
    name: "phone",
    x: 150,
    y: 190,
    size: 40,
    scene: 2,
    sprite: null,
    onPickup: function () {
      activeItemEvent = {
        startedAt: millis(),
        duration: null,
        memeIndex: 0,
        memeSeen: 0,
        blocksMovement: true,
        draw: function () {
          // Draw your phone GUI image centered
          let phoneX = 200,
            phoneY = 0,
            phoneW = 400,
            phoneH = 600; // adjust as needed
          image(phoneGuiImg, phoneX, phoneY, phoneW, phoneH);
          // Draw meme centered on phone screen
          if (phoneMemes[this.memeIndex])
            image(
              phoneMemes[this.memeIndex],
              phoneX + 75,
              phoneY + 180,
              255,
              255
            );
          // Instructions
          fill(255);
          textSize(16);
          textAlign(CENTER, BOTTOM);
          text(
            "Use UP/DOWN to scroll, SHIFT to exit",
            400,
            phoneY + phoneH - 20
          );
        },
        onKey: function (key, keyCode) {
          if (keyCode === UP_ARROW) {
            this.memeIndex = max(0, this.memeIndex - 1);
          } else if (keyCode === DOWN_ARROW) {
            this.memeIndex = min(phoneMemes.length - 1, this.memeIndex + 1);
            if (this.memeSeen < phoneMemes.length) {
              player.knowledge++;
              this.memeSeen++;
            }
          } else if (keyCode === SHIFT) {
            activeItemEvent = null;
          }
        },
      };
    },
  },
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
  [180, 170, 140, 40], // top left table
  [500, 170, 140, 40], // top right table
  [180, 270, 140, 40], // bottom left table
  [500, 270, 140, 40], // bottom right table

  // Reception plants/bookshelves
  [200, 0, 35, 80], // left plant/bookshelf by desk
  [565, 0, 35, 80], // right plant/bookshelf by desk

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
  [0, 0, 170, 150], // Left shelf
  [630, 0, 90, 170], // Right shelf

  // --- Top right column/pillar ---
  [730, 50, 40, 170],

  // --- Top row of tables (3 tables with books/laptops) ---
  [290, 110, 50, 110], // Left table
  [420, 110, 50, 110], // Center table
  [560, 110, 50, 110], // Right table

  // --- Middle row tables ---
  [290, 280, 50, 110], // Left
  [420, 280, 50, 110], // Center
  [560, 280, 50, 110], // Right

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
let stacksForegroundObjects = [
  //first row
  {
    x: 0,
    y: 180,
    w: 100,
    h: 180,
    sprite: bookshelfImg,
    drawAboveY: 320,
  },
  {
    x: 100,
    y: 180,
    w: 100,
    h: 180,
    sprite: bookshelfImg,
    drawAboveY: 320,
  },
  {
    x: 200,
    y: 180,
    w: 100,
    h: 180,
    sprite: bookshelfImg, // loaded in preload
    drawAboveY: 320, // "footline" for hiding player (tweak for each shelf)
  },
  {
    x: 500,
    y: 180,
    w: 100,
    h: 180,
    sprite: bookshelfImg,
    drawAboveY: 320,
  },
  {
    x: 600,
    y: 180,
    w: 100,
    h: 180,
    sprite: bookshelfImg,
    drawAboveY: 320,
  },
  {
    x: 700,
    y: 180,
    w: 100,
    h: 180,
    sprite: bookshelfImg,
    drawAboveY: 320,
  },
];
let stacksSceneColliders = [
  // --- back wall ---
  [0, 0, 800, 110],
  // --- front ledge ---
  [0, 430, 250, 80],
  [530, 430, 250, 80],
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
    },
  },
  {
    name: "studyroom",
    background: null,
    borderFunc: genericBoundaryControl,
    colliders: studyroomSceneColliders,
    transitions: [
      [0, 570, 120, 40, 0], //returns to start
      [770, 500, 40, 120, 3],
    ],
    onEnter: function () {
      if (comeFrom === 3) {
        player.x = 750;
        player.y = 490;
      } else {
        player.x = 50;
        player.y = 480;
      }
    },
  },
  {
    name: "stacks",
    background: null,
    borderFunc: genericBoundaryControl,
    colliders: stacksSceneColliders,
    foregroundObjects: stacksForegroundObjects,
    transitions: [[270, 580, 250, 60, 2]],
    onEnter: function () {
      player.x = 400;
      player.y = 580;
      comeFrom = 3;
    },
  },
];

let coffeeBoostActive = false;
let coffeeBoostEnd = 0;
let coffeeMessageEnd = 0;
let coffeeBaseVelocity = player.velocity;

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
  admissionScroll = loadImage("/assets/background_start.png");
  scenes[0].background = loadImage("/assets/background_reg.png");
  scenes[1].background = loadImage("/assets/background_outside.png");
  scenes[2].background = loadImage("/assets/background_studyroom.png");
  scenes[3].background = loadImage("/assets/background_stacks.png");
  // foreground objects
  bookshelfImg = loadImage("/assets/background_item_bookshelf.png");
  //music
  for (let f of trackFiles) {
    musicTracks.push(loadSound(f));
  }
  if (stacksForegroundObjects) {
    stacksForegroundObjects.forEach((obj) => (obj.sprite = bookshelfImg));
  }
  // Load gui
  statCounterImg = loadImage("/assets/stat_counter.png");
  phoneGuiImg = loadImage("/assets/phone_gui.png");
  // Load item sprites
  itemSprites.marlboro_red = loadImage("/assets/marlboro_red.png");
  smokingFrames[0] = loadImage("/assets/smoking_scene_1.png");
  smokingFrames[1] = loadImage("/assets/smoking_scene_2.png");

  itemSprites.phone = loadImage("/assets/phone.png");
  // Preload meme images
  phoneMemes = [
    loadImage("/assets/meme1.png"),
    loadImage("/assets/meme2.png"),
    loadImage("/assets/meme3.png"),
    // etc.
  ];

  itemSprites.coffee = loadImage("/assets/coffee.png");
  drinkingFrames[0] = loadImage("/assets/drinking_scene_1.png");
  drinkingFrames[1] = loadImage("/assets/drinking_scene_2.png");

  // Assign sprites to items
  items.forEach((item) => {
    if (item.name === "marlboro_red") item.sprite = itemSprites.marlboro_red;
    if (item.name === "coffee") item.sprite = itemSprites.coffee;
    if (item.name === "phone") item.sprite = itemSprites.phone;
  });
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  let playerFootY = getPlayerFootY(); // Initialize player foot Y position
  background(220);
  if (scenes[currentScene].background) {
    image(scenes[currentScene].background, 0, 0, width, height);
  }
  if (showIntroScroll && admissionScroll) {
    // Center and size the scroll nicely
    let w = 900;
    let h = 700;
    let x = (width - w) / 2;
    let y = (height - h) / 2;
    image(admissionScroll, x, y, w, h);

    // Optionally, draw "Click to continue"
    // fill(255, 255, 255, 210);
    // stroke(60, 30, 10, 120);
    // strokeWeight(1.5);
    // textAlign(CENTER, BOTTOM);
    // textSize(28);
    // text("Click to continue...", width / 2, y + h - 60);
    gameMode = 1;
    return;
  }
  if (activeItemEvent) {
    if (typeof activeItemEvent.draw === "function") {
      activeItemEvent.draw();
      // Prevents normal game drawing when event GUI overlays (like phone)
      if (activeItemEvent.name === "phone") return;
    }
    let elapsed = millis() - activeItemEvent.startedAt;
    if (typeof activeItemEvent.effect === "function") {
      activeItemEvent.effect(elapsed);
    }
    if (activeItemEvent.duration && elapsed > activeItemEvent.duration) {
      if (typeof activeItemEvent.onEnd === "function") {
        activeItemEvent.onEnd();
      }
      activeItemEvent = null;
    }
  } else {
    // ...draw player, items, UI, etc as usual
    drawPlayer();
    drawSceneItems();
  }

  // Debug only: draw only current scene's colliders!
  if (scenes[currentScene].colliders) {
    drawColliders(scenes[currentScene].colliders, [255, 0, 0, 100]);
  }

  // Layered rendering for stacks scene
  if (
    scenes[currentScene].name === "stacks" &&
    scenes[currentScene].foregroundObjects
  ) {
    drawStackSceneWithLayers();
  } else {
    // --- your usual drawing code for other scenes ---
    if (activeItemEvent) {
      // ... (unchanged, see your existing draw code)
    } else {
      drawPlayer();
    }
    drawSceneItems();
  }
  frameRate(60);
  scenes[currentScene].borderFunc();

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
    text("Press E to pick up", player.x + player.size / 2, player.y - 10);
  }

  drawSceneItems();
  handleItemPickup();
  stroke(255, 0, 0);
  line(player.x, playerFootY, player.x + player.size, playerFootY);
  noStroke();

  // MUSIC LOGIC
  // Check if current track has finished or 3 mins elapsed, then play next
  if (!showIntroScroll && musicTracks.length > 0) {
    let track = musicTracks[currentTrackIndex];
    if (track && !track.isPlaying() && !waitingForNextTrack) {
      // Wait 3 minutes before next track
      musicTimer = millis();
      waitingForNextTrack = true;
    }
    if (waitingForNextTrack && millis() - musicTimer > musicInterval) {
      let nextTrack = pickNextTrack();
      playMusicTrack(nextTrack);
      waitingForNextTrack = false;
    }
  }
}

function keyReleased() {
  if (activeItemEvent && activeItemEvent.blocksMovement) {
    if (typeof activeItemEvent.onKey === "function") {
      activeItemEvent.onKey(key, keyCode);
    }
    return false;
  }
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
    image(img, player.x, player.y, player.size, player.size * 1.4);
  } else {
    fill(255, 0, 0); // fallback: red block for error
    rect(player.x, player.y, player.size, player.size * 1.4);
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
    if (
      rectsOverlap(
        player.x,
        player.y,
        player.size,
        player.size,
        c[0],
        c[1],
        c[2],
        c[3]
      )
    ) {
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
  if (showIntroScroll) {
    showIntroScroll = false;
    playMusicTrack(0); // Play "minecraft" (first track)
    currentTrackIndex = 0;
    musicTimer = millis();
    waitingForNextTrack = false;
    return;
  }
}

function drawStatsGUI() {
  // Draw the GUI image in the top left corner
  let guiX = 740;
  let guiY = 0;
  let guiW = 60; // Resize if needed
  let guiH = 125;

  image(statCounterImg, guiX, guiY, guiW, guiH);

  // Set text properties
  fill(255, 194, 133);
  stroke(0);
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  textSize(12);

  // Draw "coins" (yellow circle area, near the top)
  text(player.coins, guiX + guiW / 2, guiY + 52);

  // Draw "knowledge" (brown book area, near the middle)
  text(player.knowledge, guiX + guiW / 2, guiY + 110);
}

function handleSceneTransitions() {
  let transitions = scenes[currentScene].transitions || [];
  let inZone = false;
  let zoneIndex = null;

  for (let i = 0; i < transitions.length; i++) {
    let z = transitions[i];
    if (
      rectsOverlap(
        player.x,
        player.y,
        player.size,
        player.size,
        z[0],
        z[1],
        z[2],
        z[3]
      )
    ) {
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
        fill(200, 0, 0);
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
      let dx = player.x + player.size / 2 - (item.x + item.size / 2);
      let dy = player.y + player.size / 2 - (item.y + item.size / 2);
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < item.size * 0.8) {
        canPickUp = true;
        if (keyIsDown(69)) {
          // 'e'
          if (item.onPickup) item.onPickup();
          items.splice(i, 1);
        }
        break;
      }
    }
  }
}
function isPlayerBehindShelf(obj) {
  // Allow for some fudge factor (10px)
  return player.x + player.size > obj.x + 10 && player.x < obj.x + obj.w - 10;
}

function drawStackSceneWithLayers() {
  let fgObjs = scenes[currentScene].foregroundObjects || [];
  const playerFootY = player.y + player.size * 1.0; // Try 1.0 for full sprite height

  // 1. Draw shelves behind
  for (let obj of fgObjs) {
    if (playerFootY < obj.drawAboveY || !isPlayerBehindShelf(obj)) {
      image(obj.sprite, obj.x, obj.y, obj.w, obj.h);
    }
  }

  // 2. Draw player
  drawPlayer();

  // Debug: Draw player footline
  stroke(0, 255, 0);
  line(player.x, playerFootY, player.x + player.size, playerFootY);
  noStroke();

  // 3. Draw shelves in front (cover player)
  for (let obj of fgObjs) {
    if (playerFootY >= obj.drawAboveY && isPlayerBehindShelf(obj)) {
      image(obj.sprite, obj.x, obj.y, obj.w, obj.h);

      // Debug: show overlay
      fill(255, 0, 0, 120);
      rect(obj.x, obj.y, obj.w, obj.h);
    }
  }
}
function getPlayerFootY() {
  // Use 0.9 (90%) if feet are near the bottom; tweak as needed
  return player.y + player.size * 0.9;
}

function playMusicTrack(index) {
  // Stop all tracks first
  for (let t of musicTracks) t.stop();
  musicTracks[index].play();
  currentTrackIndex = index;
  // Update previousTracks
  previousTracks.push(index);
  if (previousTracks.length > 2) previousTracks.shift();
}

function pickNextTrack() {
  let available = [];
  for (let i = 0; i < musicTracks.length; i++) {
    if (i !== currentTrackIndex && !previousTracks.includes(i))
      available.push(i);
  }
  // If fewer than possible (e.g. just started), allow all except current
  if (available.length === 0) {
    for (let i = 0; i < musicTracks.length; i++) {
      if (i !== currentTrackIndex) available.push(i);
    }
  }
  let nextIndex = available[Math.floor(Math.random() * available.length)];
  return nextIndex;
}
