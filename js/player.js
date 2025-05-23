export let player = {
  x: 400,
  y: 400,
  moveDelay: 150, //prev. velocity
  actionConstant: 1,
  lastMoveTime: 0,
  stepSize: 30,
  size: 60,
  direction: null,
  moving: false,
  step: 0,
  coins: 0,
  knowledge: 0,
  sprites: {},
  memesWatched: 0,
  coffeesDrank: 0,
  cigarettesSmoked: 0,
  pagesRead: 0,
  psetsDone: 0,
  fishingRod: false,
  pickaxe: false,
};

// export let coffeeBoostActive = false;
// export let coffeeBoostEnd = 0;
// export let coffeeMessageEnd = 0;
// export let coffeeBaseVelocity = player.velocity;
