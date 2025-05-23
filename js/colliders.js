export let startSceneColliders = [
  // Reception Desk (top middle)
  [250, 0, 500, 60],
  // Left Arch/Wall
  [0, 0, 130, 50],
  // Right Wall by bookshelf/door
  [710, 0, 90, 50],
  // Top left back wall
  [140, 0, 65, 50],
  // Right bookshelf
  [690, 170, 120, 80],

  // Left middle entrance
  [0, 230, 130, 80],
  // Tables (center)
  [180, 160, 140, 40], // top left table
  [500, 170, 120, 40], // top right table
  [180, 270, 140, 40], // bottom left table
  [500, 270, 120, 40], // bottom right table

  // Reception plants/bookshelves
  [200, 0, 35, 50], // left plant/bookshelf by desk
  [565, 0, 35, 60], // right plant/bookshelf by desk

  // Bottom left table (partially offscreen)
  [0, 460, 130, 50],

  // Bottom walls/rooms
  [0, 530, 300, 90], //left
  [500, 530, 250, 90], //right

  // Door frame (right bottom)
  [690, 345, 160, 60],
];
export let outsideSceneColliders = [
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
export let studyroomSceneColliders = [
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
  [310, 280, 50, 110], // Left
  [420, 280, 50, 110], // Center
  [560, 280, 50, 110], // Right

  // --- Bottom right and center tables ---
  [180, 450, 140, 60], // Bottom left table (with laptop & book)
  [520, 450, 150, 60], // Bottom right table
  // --- Center left table ---
  [0, 310, 110, 60],
  // --- Center left top chair (next to table)---
  [0, 250, 80, 60],
  // --- Top chair backstop ---
  [210, 120, 10, 110],
  // --- Bottom right small bookshelf ---
  [730, 300, 40, 170],
  // -- back wall ---
  [0, 0, 800, 150],
];
export let stacksForegroundObjects = [
  //first row
  {
    x: 0,
    y: 180,
    w: 100,
    h: 180,
    sprite: null,
    drawAboveY: 320,
  },
  {
    x: 100,
    y: 180,
    w: 100,
    h: 180,
    sprite: null,
    drawAboveY: 320,
  },
  {
    x: 200,
    y: 180,
    w: 100,
    h: 180,
    sprite: null, // loaded in preload
    drawAboveY: 320, // "footline" for hiding player (tweak for each shelf)
  },
  {
    x: 500,
    y: 180,
    w: 100,
    h: 180,
    sprite: null,
    drawAboveY: 320,
  },
  {
    x: 600,
    y: 180,
    w: 100,
    h: 180,
    sprite: null,
    drawAboveY: 320,
  },
  {
    x: 700,
    y: 180,
    w: 100,
    h: 180,
    sprite: null,
    drawAboveY: 320,
  },
];
export let stacksSceneColliders = [
  // --- back wall ---
  [0, 0, 800, 110],
  // --- front ledge ---
  [0, 430, 250, 80],
  [530, 430, 250, 80],
];
export let voidSceneColliders = [
  [530, 150, 250, 150], //fishing pond
  [0, 0, 800, 150], //back wall
];
