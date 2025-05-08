let trails = [];

function setup() {
    createCanvas(800, 600);
}

function draw() {
    background(220);

    if (trails.length > 80) {
        trails.shift();
    }
    trails.push(createVector(mouseX, mouseY));
    for (let i = 0; i < trails.length; i++) {
        let pos = trails[i];
        console.log(pos);
        console.log(trails);
        ellipse(pos.x, pos.y, 80);
    }
}