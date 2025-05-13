let quote = "all that you touch you change all that you change changes you ";
let quoteChars = quote.split('');
let chars = [];
let fontSize = 12;
let spacingY = 12;
let mainColor;
let prevMouse;


function setup() {
  createCanvas(windowWidth, windowHeight);
  mainColor = color('#a3d9ff');
  textSize(fontSize);
  textAlign(LEFT, TOP);
  fillChars();
  prevMouse = createVector(mouseX, mouseY);

  // Prevent scrolling when touching canvas
  let canvas = document.querySelector('canvas');
  canvas.addEventListener('touchstart', e => e.preventDefault());
  canvas.addEventListener('touchmove', e => e.preventDefault());
}

function draw() {
  background(0);

  if (mouseIsPressed) {
    let m = createVector(mouseX, mouseY);
    let delta = p5.Vector.sub(m, prevMouse);

    if (delta.mag() > 0.5) {
      applyMouseDistortion(mouseX, mouseY, delta);
    }

    prevMouse = m;
  }

  for (let ch of chars) {
    ch.update();
    ch.display();
  }
}

function mousePressed() {
  applyMouseDistortion(mouseX, mouseY, createVector(0, 0));
  prevMouse = createVector(mouseX, mouseY);
}

function applyMouseDistortion(px, py, delta) {
  for (let ch of chars) {
    let d = dist(px, py, ch.x, ch.y);
    let maxDist = 60; // 💥 smaller explosion radius
    if (d < maxDist) {
      let force = map(d, 0, maxDist, 1.5, 0);
      let angle = atan2(ch.y - py, ch.x - px);
      let strength = random(5, 15) * force;

      ch.vx = cos(angle) * strength;
      ch.vy = sin(angle) * strength;
      ch.rotationSpeed = random(-0.4, 0.4) * force;
      ch.sizeBoost = random(10, 20);
    }
  }
}

function fillChars() {
  chars = [];
  let y = 10;
  let index = 0;

  while (y < height - spacingY) {
    let x = 10;
    while (x < width - 10) {
      let c = quoteChars[index % quoteChars.length];
      let w = textWidth(c || ' ');
      chars.push(new BubbleChar(c, x, y));
      x += w + 1;
      index++;
    }
    y += spacingY;
  }
}

class BubbleChar {
  constructor(c, x, y) {
    this.c = c;
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.rotationSpeed = 0;
    this.sizeBoost = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx += (this.originalX - this.x) * 0.1;
    this.vy += (this.originalY - this.y) * 0.1;
    this.vx *= 0.75;
    this.vy *= 0.75;

    this.angle += this.rotationSpeed;
    this.rotationSpeed += -this.angle * 0.001;
    this.rotationSpeed *= 0.1;

    this.sizeBoost *= 0.5;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(mainColor);
    noStroke();
    textSize(fontSize + this.sizeBoost);
    text(this.c, 0, 0);
    pop();
  }
}
