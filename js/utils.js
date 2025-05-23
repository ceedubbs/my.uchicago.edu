import { player } from "./player.js";
import { scenes, currentScene } from "./scenes.js";
import { guiAssets } from "./items.js";

export function genericBoundaryControl() {
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
export function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
export function drawColliders(colliders, colorVal = [255, 0, 0, 100]) {
  push();
  noStroke();
  fill(...colorVal); // default: semi-transparent red
  for (let i = 0; i < colliders.length; i++) {
    let c = colliders[i];
    rect(c[0], c[1], c[2], c[3]);
  }
  pop();
}

export function getPlayerFootY() {
  // Use 0.9 (90%) if feet are near the bottom; tweak as needed
  return player.y + player.size * 0.9;
}

export function drawStatsGUI() {
  // Draw the GUI image in the top left corner
  let guiX = 740;
  let guiY = 0;
  let guiW = 60; // Resize if needed
  let guiH = 125;

  image(guiAssets.statCounterImg, guiX, guiY, guiW, guiH);

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

export function canMoveTo(newX, newY) {
  let colliders = scenes[currentScene].colliders || [];
  for (let c of colliders) {
    if (
      rectsOverlap(newX, newY, player.size, player.size, c[0], c[1], c[2], c[3])
    ) {
      return false;
    }
  }
  // Also prevent going out of bounds
  if (newX < 0 || newX > 800 - player.size) return false;
  if (newY < 0 || newY > 600 - player.size) return false;
  return true;
}

export function processMovement(moveKeyActive, heldDirection) {
  if (!moveKeyActive || !heldDirection) return;

  let now = millis();
  if (now - player.lastMoveTime < player.moveDelay) return;

  // Determine intended move
  let dx = 0,
    dy = 0;
  if (heldDirection === "up") dy = -player.stepSize;
  if (heldDirection === "down") dy = player.stepSize;
  if (heldDirection === "left") dx = -player.stepSize;
  if (heldDirection === "right") dx = player.stepSize;

  // Predict new location
  let newX = player.x + dx;
  let newY = player.y + dy;

  // Check collision BEFORE moving
  if (canMoveTo(newX, newY)) {
    player.x = newX;
    player.y = newY;
    player.direction = heldDirection;
    player.step = 1 - player.step;
    player.moving = true;
    player.lastMoveTime = now;
  }
}
