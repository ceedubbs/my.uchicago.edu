import { player } from "./player.js";
import { currentScene } from "./scenes.js";
import { activeItemEvent, setActiveItemEvent } from "./events.js";

const RESPAWN_DELAY = 20 * 1000;

let removedItems = [];

export let itemSprites = {};
export let smokingFrames = [];
export let drinkingFrames = [];
export let phoneMemes = [];
export let phoneScrollIndex = 0;
export let phoneOpen = false;
export let canPickUp = false;
export const guiAssets = {
  statCounterImg: null,
  phoneGuiImg: null,
  bookshelfImg: null,
  admissionScroll: null,
};

export let items = [
  {
    name: "marlboro_red",
    x: 480,
    y: 240,
    size: 50,
    scene: 1, // the 'outside' scene (index)
    sprite: null, // will assign in preload
    onPickup: function () {
      setActiveItemEvent({
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
      });
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
      setActiveItemEvent({
        startedAt: millis(),
        duration: 3000,
        messageDuration: 3000,
        message: "speed boost enabled",
        messageStart: millis(),
        blocksMovement: true, // << Only true during the animation
        effect: function (elapsed) {
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
          }
        },
        onEnd: function () {
          player.velocity = baseSpeed + 10;
          player.knowledge += 5;
        },
      });
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
      setActiveItemEvent({
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
          image(guiAssets.phoneGuiImg, phoneX, phoneY, phoneW, phoneH);
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
      });
    },
  },
];
export function drawSceneItems() {
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
export function handleItemPickup() {
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
          if (item.onPickup) item.onPickup();
          // remove from active list
          const [removed] = items.splice(i, 1);
          // record removal time so we can respawn later
          removedItems.push({ item: removed, removedAt: millis() });
        }
        break;
      }
    }
  }
}

export function updateItemRespawns() {
  const now = millis();
  // scan graveyard backwards so we can splice safely
  for (let i = removedItems.length - 1; i >= 0; i--) {
    const entry = removedItems[i];
    if (now - entry.removedAt >= RESPAWN_DELAY) {
      // put it back
      items.push(entry.item);
      // remove from graveyard
      removedItems.splice(i, 1);
    }
  }
}
