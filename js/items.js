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

export let bookPages = [];
export let bookFlipFrames = [];

export let fishingFrames = [];

let bookPagesText = [
  "Sea cucumbers defend by expelling their internal organs",
  "Eyes mirror forgotten twilight fires\n\nMemory cradles unspoken goodbyes",
  "The value of labour-power resolves itself into the value of a definite quantity of the means of subsistence\n\nnecessary for its production",
  "In socialised production the money-capital is eliminated",
  "The capitalist buys labour-power in order to use it;\n\nlabour-power in use is labour itself",
  "Ink bleeds across empty pages\n\nSouls dance on whispered lines",
  "The Eiffel Tower can grow six inches in summer",
  "Mountains echo silent human dreams\n\nWinds carry unseen lullabies\n\nEarth whispers timeless ancient truths",
  "Cats have extra toes through a condition called polydactyly",
  "M—C—M′ is therefore in reality the general formula of capital\n\nas it appears prima facie within the sphere of circulation",
  "The worker becomes poorer the more wealth he produces",
  "Hands reach toward unseen horizons\n\nFear dissolves into trembling light\n\nHope stirs silent waking worlds",
  "Desert blooms after unseen rains\n\nBones remember ancient hidden rhythms",
  "Humans share fifty percent of DNA with bananas",
  "Use-value realizes itself only in use or in consumption",
  "Lightning strikes produce ozone, freshening our air",
  "A snail can sleep for three years solid",
  "Total labour-power of society counts as one homogeneous mass of human labour power",
  "Sharks existed before trees appeared on Earth",
  "Butterflies taste with their feet, sensing nectar sweetness",
  "Sunlight reaching Earth takes eight minutes\n\nIts journey started eight minutes ago",
  "Surplus-value and the value of labour-power vary in opposite directions",
  "Bananas are berries but strawberries are not",
  "Rainbows are full circles; we see arcs on Earth",
  "the more the worker produces, the less he has to consume",
  "The purchaser of labour-power consumes it by setting the seller of it to work",
  "The simple value-form of the commodity is the simple appearance of use-value and exchange-value",
  "The expansion of value is the subjective aim of the capitalist",
  "The means of production and labour-power are distinguished by their different roles in creating value",
  "Capital is dead labour, that, vampire-like,\n\nonly lives by sucking living labour",
  "The wealth of societies where capitalist production prevails\n\nappears as an immense collection of commodities",
  "The value created by a working day of 12 hours is a constant quantity,\n\nsay, six shillings",
  "Octopuses have three hearts and blue blood",
  "Jellyfish existed before dinosaurs walked the Earth",
  "Venus spins backwards; on Venus, the sun rises west",
  "Dawn awakens dormant restless sighs\n\nLight baptizes wounded silent souls\n\nDaybreak shatters nocturnal doubts",
  "Honey never spoils and can last thousands of years",
  "A day on Venus lasts longer than its year",
  "Hot water can freeze faster than cold water\n\nThis is called the Mpemba effect",
  "Gravity binds our fractured hearts\n\nPain pulses with overlooked purpose\n\nLove labors within broken scars",
  "The time during which the labourer works\n\nis the time during which the capitalist consumes labour-power",
  "The heart of a blue whale weighs more than a car",
  "Moon cradles restless woven dreams\n\nNight unfurls secrets in silence\n\nStars tremble with ancient longing",
  "River sings beneath shattered reflections\n\nTime erodes even stoneless memories",
  "A working day of given length always creates the same amount of value",
  "A commodity appears, at first sight, a very trivial thing,\n\neasily understood",
  "There are more trees on Earth than stars in Milky Way",
  "The variable capital is advanced in money,\n\npaid out as wages",
  "Wombat poop is cube-shaped to prevent rolling away",
  "Mirrors fracture endless inner landscapes\n\nTruth emerges beyond veiled illusions",
];

export const guiAssets = {
  statCounterImg: null,
  phoneGuiImg: null,
  bookshelfImg: null,
  admissionScroll: null,
  bookGuiImg: null,
  bookFlipImg: null,
};

export let items = [
  {
    name: "marlboro_red",
    x: 480,
    y: 240,
    size: 50,
    scene: 1, // the 'outside' scene (index)
    sprite: null, // will assign in preload
    respawn: true,
    persistent: false,
    onPickup: function () {
      setActiveItemEvent({
        name: "smoking",
        duration: 10000, // ms (10s)
        startedAt: millis(),
        frames: [smokingFrames[0], smokingFrames[1]],
        frameDuration: 1000,
        frameIndex: 0,
        blocksMovement: true,
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
        onEnd: function () {
          player.cigarettesSmoked = (player.cigarettesSmoked || 0) + 1;
        },
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
    respawn: true,
    persistent: false,
    onPickup: function () {
      const baseSpeed = player.moveDelay;
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
          player.moveDelay = baseSpeed - 50;
          player.knowledge += 5;
          player.coffeesDrank = (player.coffeesDrank || 0) + 1;
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
    respawn: true,
    persistent: false,
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
              player.knowledge += 3;
              this.memeSeen++;
              player.memesWatched = (player.memesWatched || 0) + 1;
            }
          } else if (keyCode === SHIFT) {
            setActiveItemEvent(null);
          }
        },
      });
    },
  },
  // --------- FISHING ROD ITEM ----------
  {
    name: "fishing_rod",
    x: 400,
    y: 300,
    size: 50,
    scene: 3, // stacks scene index
    sprite: null, // will assign in preload
    respawn: false,
    persistent: false,
    onPickup: function () {
      // Show a one‐frame message overlay for 2s
      setActiveItemEvent({
        startedAt: millis(),
        duration: 2000,
        message: "You've got a fishing rod!",
        blocksMovement: true,
        draw: function () {
          // draw simple text at center
          fill(255, 255, 0);
          textSize(15);
          textAlign(CENTER, BOTTOM);
          text(this.message, player.x + player.size / 2, player.y - 20);
        },
        onEnd: () => {
          player.fishingRod = true;
        },
      });
    },
  },

  // --------- BOOK ITEM ----------
  {
    name: "book",
    x: 265,
    y: 310,
    size: 50,
    scene: 2, // studyroom
    sprite: null,
    respawn: false,
    persistent: true,
    onPickup: function () {
      setActiveItemEvent({
        startedAt: millis(),
        duration: null, // stay until SHIFT
        blocksMovement: true, // ✱ allow onKey to fire ✱
        pageIndex: 0, // which page (if you had images)
        flipping: false, // are we in the brief flip animation?
        flipStart: 0, // when it began
        flipDuration: 500, // 200 ms for flip
        lastFlipTime: -99999, // last time we flipped
        draw: function () {
          const bookX = 100,
            bookY = 110,
            bookW = 600,
            bookH = 400;
          // If flipping, draw the flip animation frame:
          if (this.flipping) {
            const elapsed = millis() - this.flipStart;
            // pick which frame from bookFlipFrames:
            const idx = floor(
              (elapsed / this.flipDuration) * bookFlipFrames.length
            );
            const frameImg =
              bookFlipFrames[min(idx, bookFlipFrames.length - 1)];
            image(frameImg, bookX, bookY, bookW, bookH);
            // finish flipping after flipDuration:
            if (elapsed > this.flipDuration) {
              this.flipping = false;
            }
            return;
          }
          // Otherwise, draw static book GUI:
          image(guiAssets.bookGuiImg, bookX, bookY, bookW, bookH);

          // Draw the page text inside the box, formatted as paragraphs
          textSize(15);
          textAlign(LEFT, TOP);

          // bookPagesText[pageIndex] is a string
          const marginX = 30;
          const marginY = 50;
          const textBoxWidth = bookW / 2 - marginX * 2 - 60;
          const textBoxHeight = bookH - marginY * 2;

          let textString = bookPagesText[this.pageIndex] || "";
          text(
            textString,
            bookX + marginX + 90,
            bookY + marginY + 50,
            textBoxWidth,
            textBoxHeight
          );

          // Instructions text:
          fill(255);
          textSize(16);
          textAlign(CENTER, BOTTOM);
          text(
            "← Previous   → Next   (SHIFT to close)",
            bookX + bookW / 2,
            bookY + bookH - 10
          );
          if (this.showDelayMessage) {
            fill(255, 0, 0);
            textSize(20);
            textAlign(CENTER, CENTER);
            text(
              "Please wait 5s before flipping pages",
              bookX + bookW / 2,
              bookY + bookH / 2
            );
          }
        },
        onKey: function (_key, keyCode) {
          console.log(
            "BOOK key event:",
            _key,
            keyCode,
            "pageIndex:",
            this.pageIndex,
            "flipping:",
            this.flipping
          );
          if (keyCode === SHIFT) {
            setActiveItemEvent(null);
          }
          const MIN_PAGE_DELAY = 5000;
          const now = millis();
          if (typeof this.lastFlipTime === "undefined")
            this.lastFlipTime = -99999;
          if (this.flipping) return;
          if (now - this.lastFlipTime < MIN_PAGE_DELAY) {
            this.showDelayMessage = true;
            this.delayMessageStart = now;
            return;
          }
          if (keyCode === 39 && this.pageIndex < bookPagesText.length - 1) {
            this.flipping = true;
            this.flipStart = now;
            this.pageIndex++;
            player.pagesRead = (player.pagesRead || 0) + 1;
            this.lastFlipTime = now;
            this.showDelayMessage = false;
            player.knowledge += 5;
          } else if (keyCode === 37 && this.pageIndex > 0) {
            this.flipping = true;
            this.flipStart = now;
            this.pageIndex--;
            this.lastFlipTime = now;
            this.showDelayMessage = false;
          }
        },
      });
    },
  },

  // --------- FISHING SPOT (the pond) ----------
  {
    name: "fishing_spot",
    x: 500,
    y: 100,
    size: 250,
    scene: 4,
    sprite: null,
    respawn: false,
    persistent: true,
    used: false,
    onPickup: function () {
      if (player.fishingRod === false) return;
      if (this.used) return;
      const pondX = this.x,
        pondY = this.y; // Fix animation location
      const phases = [
        { duration: 10000, frame: 0 },
        { duration: 500, frame: 1 },
        { duration: 500, frame: 3 },
        { duration: 500, frame: 4 },
        { duration: 2000, frame: 5 },
      ];
      let total = phases[0].duration + phases[1].duration + phases[2].duration;
      setActiveItemEvent({
        startedAt: millis(),
        duration: total + 3000,
        blocksMovement: true,
        draw: function () {
          if (itemSprites.fishing_spot) {
            image(itemSprites.fishing_spot, pondX, pondY, 250, 250); // Adjust size as needed
          }
          const elapsed = millis() - this.startedAt;
          let cum = 0;
          for (let p of phases) {
            cum += p.duration;
            if (elapsed < cum) {
              if (fishingFrames[p.frame]) {
                // Draw animation at the pond, not the player
                image(fishingFrames[p.frame], pondX + 40, pondY + 30, 100, 120);
              }
              return;
            }
          }
          // Show result text at pond
          fill(255);
          textSize(20);
          textAlign(CENTER, CENTER);
          text("You found a pickaxe!", pondX + 80, pondY + 50);
        },
        onEnd: () => {
          player.coins += 40;
          this.used = true;
          const pickaxe = items.find((item) => item.name === "pickaxe");
          if (pickaxe) {
            pickaxe.x = this.x - 50;
            pickaxe.y = this.y + 120;
          }
          console.log("You found a pickaxe! at" + pickaxe.x + "," + pickaxe.y);
          player.pickaxe = true;
        },
      });
    },
  },
  {
    name: "pickaxe",
    x: 1000,
    y: 1000,
    size: 60,
    scene: 4,
    sprite: null,
    respawn: false,
    persistent: false,
    onPickup: function () {
      // Show a one‐frame message overlay for 2s
      setActiveItemEvent({
        startedAt: millis(),
        duration: 2000,
        blocksMovement: true,
        draw: function () {},

        onEnd: () => {
          player.pickaxe = true;
        },
      });
    },
  },
];
export function drawSceneItems() {
  // Draw non-persistent items in normal loop
  for (let item of items) {
    if (item.scene === currentScene && !item.persistent) {
      if (!item.sprite) {
        console.log("Item missing sprite!", item.name, item);
      }
      if (item.sprite) {
        image(item.sprite, item.x, item.y, item.size, item.size);
      } else {
        fill(200, 0, 0);
        rect(item.x, item.y, item.size, item.size);
      }
    }
  }
  // Draw persistent items always
  for (let item of items) {
    if (item.scene === currentScene && item.persistent) {
      if (item.sprite) {
        image(item.sprite, item.x, item.y, item.size, item.size);
      } else {
        fill(0, 200, 0);
        rect(item.x, item.y, item.size, item.size);
      }
    }
  }
}

export function handleItemPickup() {
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    if (item.scene === currentScene) {
      let dx = player.x + player.size / 2 - (item.x + item.size / 2);
      let dy = player.y + player.size / 2 - (item.y + item.size / 2);
      if (Math.sqrt(dx * dx + dy * dy) < item.size * 0.8) {
        if (item.onPickup) item.onPickup();
        // Only remove if NOT persistent
        if (!item.persistent) {
          if (item.respawn) {
            const [removed] = items.splice(i, 1);
            removedItems.push({ item: removed, removedAt: millis() });
          } else {
            items.splice(i, 1);
          }
        }
        break;
      }
    }
  }
}
export function updateItemRespawns() {
  const now = millis();
  for (let i = removedItems.length - 1; i >= 0; i--) {
    const entry = removedItems[i];
    if (now - entry.removedAt >= RESPAWN_DELAY) {
      // Only respawn items that are supposed to respawn
      if (entry.item.respawn) {
        items.push(entry.item);
      }
      removedItems.splice(i, 1);
    }
  }
}
