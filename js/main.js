import { player } from "./player.js";
import {
  items,
  drawSceneItems,
  handleItemPickup,
  smokingFrames,
  drinkingFrames,
  itemSprites,
  phoneMemes,
  guiAssets,
  updateItemRespawns,
  bookFlipFrames,
  fishingFrames,
} from "./items.js";

import {
  scenes,
  changeScene,
  currentScene,
  handleSceneTransitions,
  drawStackSceneWithLayers,
  backgroundObjects,
} from "./scenes.js";
import {
  startSceneColliders,
  outsideSceneColliders,
  studyroomSceneColliders,
  stacksSceneColliders,
  stacksForegroundObjects,
} from "./colliders.js";
import {
  getPlayerFootY,
  drawColliders,
  drawStatsGUI,
  canMoveTo,
  processMovement,
} from "./utils.js";
import { TRANSITION_TIME } from "./constants.js";
import {
  playMusicTrack,
  pickNextTrack,
  musicTracks,
  currentTrackIndex,
  setCurrentTrackIndex,
  musicInterval,
  trackFiles,
} from "./music.js";
import { activeItemEvent, setActiveItemEvent } from "./events.js";

// Game mode/state flags
let gameMode = 0;
let showIntroScroll = true;
let endgameFont = null;

//endgame
let endgameActive = false;
let endgameStartTime = 0;
let endgameFrame = 0;
let endgameStatsFrameImgs = [];
const ENDGAME_ANIMATION_FRAMES = 2; // Number of animated states before stats
const ENDGAME_FRAME_DURATION = 2000; // ms per frame

let heldDirection = null; // Track which direction is being held
let moveKeyActive = false; // Is any movement key pressed?

// Timing and color (if used for other features)
let timer = [0, 0, 0];
let currentColor = [1, 100, 1];

let musicTimer = 0;
let waitingForNextTrack = false;

let canPickUp = false;

// p5 preload: load assets
function preload() {
  // Player sprites
  player.sprites.down = loadImage("assets/sprites/stationary.png");
  player.sprites.up = loadImage("assets/sprites/facing_backward.png");
  player.sprites.left = loadImage("assets/sprites/walking_left.png");
  player.sprites.right = loadImage("assets/sprites/walking_right.png");
  player.sprites.walk_left = loadImage("assets/sprites/walking_left.png");
  player.sprites.walk_right = loadImage("assets/sprites/walking_right.png");
  player.sprites.walk_up = loadImage("assets/sprites/facing_backward.png");
  player.sprites.walk_down = loadImage("assets/sprites/walking_forward.png");

  // Backgrounds and intro scroll
  guiAssets.admissionScroll = loadImage(
    "assets/backgrounds/background_start.png"
  );
  scenes[0].background = loadImage("assets/backgrounds/background_reg.png");
  scenes[1].background = loadImage("assets/backgrounds/background_outside.png");
  scenes[2].background = loadImage(
    "assets/backgrounds/background_studyroom.png"
  );
  scenes[3].background = loadImage("assets/backgrounds/background_stacks.png");
  // Foreground object sprite
  guiAssets.bookshelfImg = loadImage(
    "assets/backgrounds/background_item_bookshelf.png"
  );
  if (stacksForegroundObjects) {
    stacksForegroundObjects.forEach(
      (obj) => (obj.sprite = guiAssets.bookshelfImg)
    );
  }
  // GUI images
  guiAssets.statCounterImg = loadImage("assets/gui/stat_counter.png");
  guiAssets.phoneGuiImg = loadImage("assets/gui/phone_gui.png");

  guiAssets.bookGuiImg = loadImage("assets/gui/book_gui.png");
  bookFlipFrames[0] = loadImage("assets/gui/book_gui.png");
  bookFlipFrames[1] = loadImage("assets/gui/book_flipping.png");

  // Item sprites
  itemSprites.marlboro_red = loadImage("assets/items/marlboro_red.png");
  itemSprites.coffee = loadImage("assets/items/coffee.png");
  itemSprites.phone = loadImage("assets/items/phone.png");
  itemSprites.book = loadImage("assets/items/book.png");
  itemSprites.pickaxe = loadImage("assets/items/pickaxe.png");
  itemSprites.fishing_rod = loadImage("assets/items/fishing_rod.png");

  itemSprites.fishing_spot = loadImage("assets/items/fishing_pond.png");

  fishingFrames[0] = loadImage("assets/items/fishing_scene_1.png");
  fishingFrames[1] = loadImage("assets/items/fishing_scene_2.png");
  fishingFrames[2] = loadImage("assets/items/fishing_scene_1.png");
  fishingFrames[3] = loadImage("assets/items/fishing_scene_2.png");
  fishingFrames[4] = loadImage("assets/items/fishing_scene_1.png");
  fishingFrames[5] = loadImage("assets/items/fishing_scene_3.png");

  items.forEach((item) => {
    if (item.name === "marlboro_red") item.sprite = itemSprites.marlboro_red;
    if (item.name === "coffee") item.sprite = itemSprites.coffee;
    if (item.name === "phone") item.sprite = itemSprites.phone;
    if (item.name === "book") item.sprite = itemSprites.book;
    if (item.name === "fishing_rod") item.sprite = itemSprites.fishing_rod;
    if (item.name === "pickaxe") item.sprite = itemSprites.pickaxe;
    if (item.name === "fishing_spot") item.sprite = itemSprites.fishing_spot;
  });
  // Event animation frames
  smokingFrames[0] = loadImage("assets/sprites/smoking_scene_1.png");
  smokingFrames[1] = loadImage("assets/sprites/smoking_scene_2.png");
  drinkingFrames[0] = loadImage("assets/sprites/drinking_scene_1.png");
  drinkingFrames[1] = loadImage("assets/sprites/drinking_scene_2.png");
  // Phone meme images
  phoneMemes.push(loadImage("assets/memes/meme1.png"));
  phoneMemes.push(loadImage("assets/memes/meme2.png"));
  phoneMemes.push(loadImage("assets/memes/meme3.png"));
  // Music tracks
  for (let file of musicInterval ? [] : []) {
  } // (musicInterval imported to ensure it's loaded)
  for (let f of trackFiles) {
    musicTracks.push(loadSound(f));
  }

  //background objects
  // For the smoking group:
  let smokingGroup = backgroundObjects.find((o) => o.name === "smoking_group");
  if (smokingGroup) {
    smokingGroup.frames = [
      loadImage("assets/backgrounds/background_group_1.png"),
      loadImage("assets/backgrounds/background_group_2.png"),
    ];
  }

  //endgame
  endgameStatsFrameImgs[0] = loadImage("assets/endgame/endgame_1.png");
  endgameStatsFrameImgs[1] = loadImage("assets/endgame/endgame_2.png");
  endgameStatsFrameImgs[2] = loadImage("assets/endgame/endgame_final.png");

  //fonts
  endgameFont = loadFont("assets/fonts/sketch_gothic_school.ttf");
}

function setup() {
  console.log("✅ setup() fired");
  createCanvas(800, 600);
}

function draw() {
  // endgame logic
  if (!endgameActive && player.knowledge >= 200) {
    endgameActive = true;
    endgameStartTime = millis();
    endgameFrame = 0;
  }
  if (endgameActive) {
    let now = millis();
    let frameToShow = endgameFrame;

    // Animate frames before final stats
    if (endgameFrame < ENDGAME_ANIMATION_FRAMES) {
      if (now - endgameStartTime > ENDGAME_FRAME_DURATION) {
        endgameFrame++;
        endgameStartTime = now;
      }
      frameToShow = min(endgameFrame, ENDGAME_ANIMATION_FRAMES - 1);
      background(215, 173, 115);
      image(endgameStatsFrameImgs[frameToShow], 0, 0, width, height);
    } else {
      background(215, 173, 115);
      // Final stats frame
      image(endgameStatsFrameImgs[ENDGAME_ANIMATION_FRAMES], -5, -35, 800, 700);

      // Display stats
      fill(72, 41, 30);
      textAlign(CENTER, TOP);
      textFont(endgameFont);
      textSize(30);
      text("Shuai Xin Wong", width / 2, 200);
      textSize(24);
      text("Bachlors of Science in Molecular Engineering", width / 2, 250);
      textSize(17);
      let stats = [
        "Gpa: horrendous",
        `Memes watched: ${player.memesWatched || 0}`,
        `Coffees drank: ${player.coffeesDrank || 0}`,
        `Cigarettes smoked: ${player.cigarettesSmoked || 0}`,
        `Pages read: ${player.pagesRead || 0}`,
        `Psets done: ${player.psetsDone || 0} (placeholder)`,
      ];
      for (let i = 0; i < stats.length; i++) {
        text(stats[i], width / 2, 290 + i * 30);
      }
    }
    return;
  }

  //movement stuff
  processMovement(moveKeyActive, heldDirection);

  // Respawn any items due
  updateItemRespawns();

  background(220);
  if (scenes[currentScene].background) {
    image(scenes[currentScene].background, 0, 0, width, height);
  }

  // Intro scroll overlay
  if (showIntroScroll && guiAssets.admissionScroll) {
    const w = 900,
      h = 700;
    const x = (width - w) / 2,
      y = (height - h) / 2;
    image(guiAssets.admissionScroll, x, y, w, h);
    gameMode = 1;
    return;
  }
  // Draw and update background animated objects for this scene
  for (let obj of backgroundObjects) {
    if (obj.scene === currentScene) {
      obj.update();
      obj.draw();
    }
  }
  // If we're in the stacks scene, always use the layering
  const isInStacks =
    scenes[currentScene].name === "stacks" &&
    scenes[currentScene].foregroundObjects;

  // --- Render overlays (GUIs, events, etc) ---
  if (activeItemEvent) {
    // 1. Always draw the scene layer for stacks first
    if (isInStacks) {
      drawStackSceneWithLayers(drawPlayer);
    }
    // 2. Now draw the active item overlay GUI
    if (typeof activeItemEvent.draw === "function") {
      activeItemEvent.draw();
    }
    // 3. Continue processing event effect/end
    const elapsed = millis() - activeItemEvent.startedAt;
    if (typeof activeItemEvent.effect === "function") {
      activeItemEvent.effect(elapsed);
    }
    if (activeItemEvent.duration && elapsed > activeItemEvent.duration) {
      if (typeof activeItemEvent.onEnd === "function") {
        activeItemEvent.onEnd();
      }
      setActiveItemEvent(null);
    }
    drawStatsGUI();
    return; // Don't double draw scene/game if event is active
  }

  // --- Normal game draw path ---
  if (isInStacks) {
    drawStackSceneWithLayers(drawPlayer);
  } else {
    drawPlayer();
    drawSceneItems();
  }
  drawStatsGUI();

  // Can pick up any nearby item?
  canPickUp = false;
  for (let item of items) {
    if (item.scene === currentScene) {
      let dx = player.x + player.size / 2 - (item.x + item.size / 2);
      let dy = player.y + player.size / 2 - (item.y + item.size / 2);
      if (sqrt(dx * dx + dy * dy) < item.size * 0.8) {
        canPickUp = true;
        break;
      }
    }
  }
  if (canPickUp) {
    fill(255);
    textSize(16);
    text("Press E to Interact", player.x + player.size / 2, player.y - 10);
  }

  //// 6) Debug colliders
  // if (scenes[currentScene].colliders) {
  //   drawColliders(scenes[currentScene].colliders, [255, 0, 0, 100]);
  // }

  // 7) Stacks layering
  if (
    scenes[currentScene].name === "stacks" &&
    scenes[currentScene].foregroundObjects
  ) {
    drawStackSceneWithLayers(drawPlayer);
  }

  // 8) Frame rate & boundaries
  frameRate(60);
  scenes[currentScene].borderFunc();

  // // 9) HUD & debug texts
  fill(0);
  text(`player location: ${player.x}, ${player.y}`, 10, 20);
  drawStatsGUI();

  // 10) Auto‐transitions & hint
  handleSceneTransitions();
  // if (scenes[currentScene].transitions) {
  //   drawColliders(scenes[currentScene].transitions, [0, 255, 255, 80]);
  // }

  // 12) Music logic
  if (!showIntroScroll && musicTracks.length) {
    const track = musicTracks[currentTrackIndex];
    if (track && !track.isPlaying() && !waitingForNextTrack) {
      musicTimer = millis();
      waitingForNextTrack = true;
    }
    if (waitingForNextTrack && millis() - musicTimer > musicInterval) {
      const next = pickNextTrack();
      playMusicTrack(next);
      waitingForNextTrack = false;
    }
  }
}

// Called when a key is pressed (sets movement state)
function keyPressed() {
  if (endgameActive) return false;

  if (activeItemEvent && activeItemEvent.blocksMovement) {
    if (typeof activeItemEvent.onKey === "function") {
      activeItemEvent.onKey(key, keyCode);
    }
    return false;
  }
  if (key === "w" || key === "ArrowUp") {
    heldDirection = "up";
    moveKeyActive = true;
  } else if (key === "s" || key === "ArrowDown") {
    heldDirection = "down";
    moveKeyActive = true;
  } else if (key === "a" || key === "ArrowLeft") {
    heldDirection = "left";
    moveKeyActive = true;
  } else if (key === "d" || key === "ArrowRight") {
    heldDirection = "right";
    moveKeyActive = true;
  } else if ((key === "e" || key === "E") && canPickUp) {
    handleItemPickup();
    return false;
  }
}

function keyReleased() {
  if (endgameActive) return false;

  // Only reset if the released key matches the held direction (handles diagonals)
  if (
    ((key === "w" || key === "ArrowUp") && heldDirection === "up") ||
    ((key === "s" || key === "ArrowDown") && heldDirection === "down") ||
    ((key === "a" || key === "ArrowLeft") && heldDirection === "left") ||
    ((key === "d" || key === "ArrowRight") && heldDirection === "right")
  ) {
    moveKeyActive = false;
    heldDirection = null;
  }
  // Pass other keys to GUI
  if (activeItemEvent && activeItemEvent.blocksMovement) {
    if (typeof activeItemEvent.onKey === "function") {
      activeItemEvent.onKey(key, keyCode);
    }
    return false;
  }
}

// main.js

export function drawPlayer() {
  let img;
  // Use walking frame as long as a movement key is held and a direction is selected
  if (moveKeyActive && heldDirection) {
    if (heldDirection === "left")
      img = player.sprites.walk_left || player.sprites.down;
    else if (heldDirection === "right")
      img = player.sprites.walk_right || player.sprites.down;
    else if (heldDirection === "up")
      img = player.sprites.walk_up || player.sprites.down;
    else if (heldDirection === "down")
      img = player.sprites.walk_down || player.sprites.down;
  } else {
    // Otherwise, use stationary frame
    img = player.sprites.down;
  }

  if (img) {
    image(img, player.x, player.y, player.size, player.size * 1.4);
  } else {
    fill(255, 0, 0);
    rect(player.x, player.y, player.size, player.size * 1.4);
    text("ERR", player.x + 10, player.y + 20);
  }
}

function mouseClicked() {
  if (endgameActive) return false;
  if (showIntroScroll) {
    // Hide intro scroll and start game
    showIntroScroll = false;
    playMusicTrack(0);
    // currentTrackIndex is set by playMusicTrack; reset music timer and waiting flag
    musicTimer = millis();
    waitingForNextTrack = false;
    return;
  }
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;
window.mouseClicked = mouseClicked;
