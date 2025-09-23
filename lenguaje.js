let fondo;
let ovniFrames = [], frameIndex = 0, frameDelay = 5, frameCounter = 0;

let miNave;
let enemigos = [];
let proyectiles = [];


class MiNave {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.lastShot = 0;
    this.cooldown = 500; 
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) this.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) this.x += 5;
    this.x = constrain(this.x, 0, width - this.size);
  }

  dibujar() {
    if (++frameCounter >= frameDelay) {
      frameCounter = 0;
      frameIndex = (frameIndex + 1) % ovniFrames.length;
    }
    image(ovniFrames[frameIndex], this.x, this.y, this.size, this.size);
  }

  disparar() {
    let now = millis();
    if (now - this.lastShot > this.cooldown) {
      proyectiles.push(new Proyectil(this.x + this.size / 2, this.y + this.size));
      this.lastShot = now;
    }
  }
}

class NaveEnemiga {
  constructor(x, y, w, h, dir, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dir = dir;
    this.speed = speed;
  }

  mover() {
    this.x += this.dir * this.speed;
    if (this.x <= 0 || this.x + this.w >= width) {
      this.dir *= -1; 
    }
  }

  dibujar() {
    fill(200, 0, 0);
    rect(this.x, this.y, this.w, this.h);
  }
}


class Proyectil {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 5;
    this.h = 15;
  }

  mover() {
    this.y += 7; 
  }

  dibujar() {
    fill(255, 255, 0);
    rect(this.x, this.y, this.w, this.h);
  }

  colisiona(enemigo) {
    return (this.x > enemigo.x && this.x < enemigo.x + enemigo.w &&
            this.y + this.h > enemigo.y && this.y < enemigo.y + enemigo.h);
  }
}


function preload() {
  fondo = loadImage("FlappyFond.png");
  for (let i = 1; i <= 5; i++) ovniFrames.push(loadImage(`I${i}.png`));
}

function setup() {
  createCanvas(800, 400);
  miNave = new MiNave(350, 50, 90);


  
  enemigos.push(new NaveEnemiga(200, 250, 50, 30, 1, 2));
  enemigos.push(new NaveEnemiga(500, 300, 50, 30, -1, 2.5));
}

function draw() {
  image(fondo, 0, 0, width, height);

  miNave.mover();
  miNave.dibujar();


  
  for (let i = proyectiles.length - 1; i >= 0; i--) {
    let p = proyectiles[i];
    p.mover();
    p.dibujar();

    for (let j = enemigos.length - 1; j >= 0; j--) {
      if (p.colisiona(enemigos[j])) {
        enemigos.splice(j, 1);
        proyectiles.splice(i, 1);
        break;
      }
    }

    if (p.y > height) proyectiles.splice(i, 1);
  }

  
  for (let e of enemigos) {
    e.mover();
    e.dibujar();
  }
}



function keyPressed() {
  if (key === " ") {
    miNave.disparar();
  }
}
