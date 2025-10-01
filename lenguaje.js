let fondo;

let ovni1, ovni2, ovni3, ovni4, ovni5;


let imagenActual = 0;        //IMG actual
let esperaEntreImagenes = 5;  //Cambia cada 5 frames
let contadorCiclos = 0;     //cuantos cilos

let miNave;
let listaEnemigos = [];
let listaProyectiles = [];


class MiNave {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.ultimoDisparo = 0;
    this.tiempoRecarga = 500; 
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) this.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) this.x += 5;

  }

  dibujar() {

    if (++contadorCiclos >= esperaEntreImagenes) {
      contadorCiclos = 0;
      imagenActual = (imagenActual + 1) % 5; 
    }
  //Cada vez que se ejecuta dibujar se incrementa +1 y se dibujan los frames con sus cordenadas
    if (imagenActual === 0) image(ovni1, this.x, this.y, this.size, this.size);
    if (imagenActual === 1) image(ovni2, this.x, this.y, this.size, this.size);
    if (imagenActual === 2) image(ovni3, this.x, this.y, this.size, this.size);
    if (imagenActual === 3) image(ovni4, this.x, this.y, this.size, this.size);
    if (imagenActual === 4) image(ovni5, this.x, this.y, this.size, this.size);
  }

  disparar() {
    let ahora = millis();
    if (ahora - this.ultimoDisparo > this.tiempoRecarga) {
      listaProyectiles.push(new Proyectil(this.x + this.size / 2, this.y + this.size));
      this.ultimoDisparo = ahora;
    }
  }
}

class NaveEnemiga {
  constructor(x, y) {  //parametros
    this.x = x;      
    this.y = y;      
    this.ancho = 50;    
    this.alto = 30;     
    this.direccion = 1;    
    this.velocidad = 2;  
  }

  mover() {
    this.x += this.direccion * this.velocidad;
    if (this.x <= 0 || this.x + this.ancho >= width) {
      this.direccion *= -1; 
    }
  }

  dibujar() {
    fill(200, 0, 0);
    rect(this.x, this.y, this.ancho, this.alto);
  }
}

class Proyectil {
  constructor(x, y) { //parametros 
    this.x = x;
    this.y = y;
    this.ancho = 5;
    this.alto = 15;
  }

  mover() {
    this.y += 7; 
  }

  dibujar() {
    fill(255, 255, 0);
    rect(this.x, this.y, this.ancho, this.alto);
  }

  colisiona(enemigo) {
    return (
      this.x > enemigo.x &&  //X e Y dentro del enemigo se crea un collide y se destruye
      this.x < enemigo.x + enemigo.ancho &&
      this.y + this.alto > enemigo.y &&
      this.y < enemigo.y + enemigo.alto
    );
  }
}


function preload() {
  fondo = loadImage("FlappyFond.png");

  ovni1 = loadImage("I1.png");
  ovni2 = loadImage("I2.png");
  ovni3 = loadImage("I3.png");
  ovni4 = loadImage("I4.png");
  ovni5 = loadImage("I5.png");
}

function setup() {   //cordenadas y canvas
  createCanvas(800, 400);
  miNave = new MiNave(350, 50, 90);

  listaEnemigos.push(new NaveEnemiga(200, 250)); //agraga mas elementos al array
  listaEnemigos.push(new NaveEnemiga(500, 300));
}

function draw() {  
  image(fondo, 0, 0, width, height);

  miNave.mover(); //Hilo 
  miNave.dibujar();


  for (let i = listaProyectiles.length - 1; i >= 0; i--) {
    let p = listaProyectiles[i];
    p.mover();
    p.dibujar();

    for (let j = listaEnemigos.length - 1; j >= 0; j--) {
      if (p.colisiona(listaEnemigos[j])) {
        listaEnemigos.splice(j, 1);
        listaProyectiles.splice(i, 1);
        break;
      }
    }

    if (p.y > height) listaProyectiles.splice(i, 1);
  }


  for (let e of listaEnemigos) {
    e.mover();
    e.dibujar();
  }
}

function keyPressed() {
  if (key === " ") {
    miNave.disparar();
  }
}
