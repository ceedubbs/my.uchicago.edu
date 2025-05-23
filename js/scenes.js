import { player } from "./player.js";
import {
  startSceneColliders,
  outsideSceneColliders,
  studyroomSceneColliders,
  stacksSceneColliders,
  stacksForegroundObjects,
  voidSceneColliders,
} from "./colliders.js";
import { genericBoundaryControl, rectsOverlap } from "./utils.js";
import { TRANSITION_TIME } from "./constants.js";

// You can also import colliders from a new file if it gets too big
export let inZoneSince = null;
export let currentScene = 0;
export let currentTransitionZone = null;
export let comeFrom = null;
export let scenes = [
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
      if (comeFrom === 1) {
        player.x = 400;
        player.y = 400;
      }
      if (comeFrom === 2) {
        player.x = 50;
        player.y = 480;
      } else {
        player.x = 330;
        player.y = 450;
      }
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
      comeFrom = 1;
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
        player.x = 700;
        player.y = 460;
      } else {
        player.x = 50;
        player.y = 480;
      }
      comeFrom = 2;
    },
  },
  {
    name: "stacks",
    background: null,
    borderFunc: genericBoundaryControl,
    colliders: stacksSceneColliders,
    foregroundObjects: stacksForegroundObjects,
    transitions: [
      [270, 580, 250, 60, 2],
      [0, 0, 50, 200, 4],
    ],
    onEnter: function () {
      if (comeFrom === 4) {
        player.x = 50;
        player.y = 150;
      } else {
        player.x = 400;
        player.y = 550;
      }
      comeFrom = 3;
    },
  },
  {
    name: "void",
    background: null,
    borderFunc: genericBoundaryControl,
    colliders: voidSceneColliders,
    foregroundObjects: [],
    transitions: [[270, 570, 150, 40, 3]],
    onEnter: function () {
      player.x = 400;
      player.y = 580;
      comeFrom = 4;
    },
  },
];
export let backgroundObjects = [
  {
    name: "smoking_group",
    scene: 1,
    x: 40,
    y: 210,
    w: 220,
    h: 160,
    frames: [],
    frameIndex: 0,
    frameDuration: 2000,
    lastFrameTime: 0,
    draw: function () {
      image(this.frames[this.frameIndex], this.x, this.y, this.w, this.h);
    },
    update: function () {
      if (millis() - this.lastFrameTime > this.frameDuration) {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        this.lastFrameTime = millis();
      }
    },
  },
];
export function handleSceneTransitions() {
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
export function changeScene(sceneIndex) {
  currentScene = sceneIndex;
  if (scenes[currentScene].onEnter) {
    scenes[currentScene].onEnter();
  }
}

export function drawStackSceneWithLayers(drawPlayerFn) {
  let fgObjs = scenes[currentScene].foregroundObjects || [];
  const playerFootY = player.y + player.size * 1.0; // Try 1.0 for full sprite height

  // 1. Draw shelves behind
  for (let obj of fgObjs) {
    if (playerFootY < obj.drawAboveY || !isPlayerBehindShelf(obj)) {
      image(obj.sprite, obj.x, obj.y, obj.w, obj.h);
    }
  }
  drawPlayerFn();

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
export function isPlayerBehindShelf(obj) {
  // Allow for some fudge factor (10px)
  return player.x + player.size > obj.x + 10 && player.x < obj.x + obj.w - 10;
}
