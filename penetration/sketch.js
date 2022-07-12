//global variables to anchor drawings
var centerX;
var centerY;

//the body is the background of the sketch
var body = {
  size: 500,
  rgb: {
    r: 252,
    g: 225,
    b: 237
  }
};

//object sizes are multiplied by the scale
scale = body.size / 100;

//initialize vulva
var vulva = {
  posY: -5 * scale, //position relative to centerY
  quiver: 0.5, //amount of quiver on penetration
  // topScale: 1, //scales up or down the top portion of the vulva
  bottomScale: 0.5, //scales up or down the bottom portion of the vulva
  majora: {
    height: 80 * scale,  //height and width halved for convenience
    startWidth: 40 * scale,
    rgb: {
      r: 255,
      g: 189,
      b: 214
    }
  },
  minora: {
    height: 30 * scale,  //height and width halved for convenience
    startWidth: 3 * scale,
    rgb: {
      r: 234,
      g: 154,
      b: 183
    }
  },
  vagina: {
    height: 7 * scale,  //height and width halved for convenience
    startWidth: 1 * scale,
    rgb: {
      r: 255,
      g: 135,
      b: 183
    }
  }
};

//initialize penis
var penis = {
  tipSize: 5 * scale,
  posX: 0 * scale, //position of penis relative to centerX
  posY: 0 * scale, //position of tip relative to centerY
  quiver: 0.5, //amount of quiver on penetration
  head: {
    size: 60 * scale,
    rgb: {
      r: 153,
      g: 51,
      b: 47
    }
  },
  shaft: {
    size: 55 * scale,
    rgb: {
      r: 71,
      g: 43,
      b: 12
    }
  }
};

//variables to control penetration
var penetration = {
  posYabs: 0, //absolute position of penetration
  limit: {
    posY: 0, //position of limit relative to centerY
    reached: false,
    acceleration: 2 //speed at which the limit changes
  }
};

function setup() {
  //create canvas
  createCanvas(body.size, body.size);

  //define variables to anchor drawings
  centerX = width / 2;
  centerY = height / 2;

  //initialize penetration settings
  penetration.posYabs = centerY + vulva.posY;
  penetration.limit.posY = vulva.posY;
}

function draw() {
  //draw the female bottom portion
  drawBottom();

  //draw the penis
  drawPenis();

  //draw the female top portion
  drawTop();

  //stretch vulva when penis enters
  stretchVulva();
}

// Function to draw the female bottom half
function drawBottom() {

  //draw background
  background(body.rgb.r, body.rgb.g, body.rgb.b);

  //draw vulva bottom//
  strokeWeight(0);

  //majora
  noStroke();
  fill(vulva.majora.rgb.r, vulva.majora.rgb.g, vulva.majora.rgb.b);
  arc(centerX, penetration.posYabs, vulva.majora.width, vulva.majora.height * vulva.bottomScale, 0, PI);

  //minora
  fill(vulva.minora.rgb.r, vulva.minora.rgb.g, vulva.minora.rgb.b);
  triangle(centerX + vulva.minora.width, penetration.posYabs, //right
    centerX, centerY + vulva.posY + vulva.minora.height * vulva.bottomScale, //bottom
    centerX - vulva.minora.width, penetration.posYabs); //left

  //vagina
  fill(vulva.vagina.rgb.r, vulva.vagina.rgb.g, vulva.vagina.rgb.b);
  triangle(centerX + vulva.vagina.width, penetration.posYabs, //right
    centerX, centerY + vulva.posY + vulva.vagina.height * vulva.bottomScale, //bottom
    centerX - vulva.vagina.width, penetration.posYabs); //left
}

// Function to draw the penis
function drawPenis() {

  //move penis with mouse
  penis.posY = winMouseY - centerY - penis.head.size;

  //limit penetration
  if (penis.posY < penetration.limit.posY) {
    penis.posY = penetration.limit.posY;
    if (!penetration.limit.reached) {
      penetration.limit.posY-= penetration.limit.acceleration;
      penetration.limit.reached = true;
    }
  }
  else if (penetration.limit.reached) {
    penetration.limit.reached = false;
  }

  //variable for the center of the penis head
  penis.head.posY = centerY + penis.head.size / 2 + penis.posY;

  //draw penis//

  //shaft
  fill(penis.shaft.rgb.r, penis.shaft.rgb.g, penis.shaft.rgb.b);
  rect(centerX + penis.posX - penis.shaft.size / 2, penis.head.posY, penis.shaft.size, height - penis.head.posY);

  //head
  fill(penis.head.rgb.r, penis.head.rgb.g, penis.head.rgb.b);
  ellipse(centerX + penis.posX, penis.head.posY, penis.head.size);

  //tip
  fill(0);
  ellipse(centerX + penis.posX, centerY + penis.tipSize / 2 + penis.posY, penis.tipSize);
}

// Function to draw the female top half
function drawTop() {

  //draw background skin top
  fill(body.rgb.r, body.rgb.g, body.rgb.b);
  noStroke();
  rect(0, 0, width, penetration.posYabs);

  //draw vulva top//
  strokeWeight(0);

  //majora
  fill(vulva.majora.rgb.r, vulva.majora.rgb.g, vulva.majora.rgb.b);
  arc(centerX, penetration.posYabs, vulva.majora.width, vulva.majora.height, PI, 0);

  //minora
  fill(vulva.minora.rgb.r, vulva.minora.rgb.g, vulva.minora.rgb.b);
  triangle(centerX, centerY - vulva.minora.height + vulva.posY, //top
    centerX + vulva.minora.width, penetration.posYabs, //right
    centerX - vulva.minora.width, penetration.posYabs); //left

  //vagina
  fill(vulva.vagina.rgb.r, vulva.vagina.rgb.g, vulva.vagina.rgb.b);
  triangle(centerX, centerY - vulva.vagina.height + vulva.posY, //top
    centerX + vulva.vagina.width, penetration.posYabs, //right
    centerX - vulva.vagina.width, penetration.posYabs); //left
}

// Function to stretch the vulva when the penis enters
function stretchVulva() {

  //set variables for head collision detection (thanks, Pythagoras!)
  var pytY = dist(centerX, penetration.posYabs, centerX, penis.head.posY);
  var pytH = penis.head.size / 2;
  var pytX = sqrt(pytH * pytH - pytY * pytY);

  //stretch vulva when penis enters//
  if (penis.posY < vulva.posY) {
    //stretch vagina on head
    vulva.vagina.width = pytX + random(-vulva.quiver, vulva.quiver); //quiver when penetrated
    penis.posX = random(-penis.quiver, penis.quiver); //penis quivers on penetration
    //stretch vagina on shaft
    if (vulva.vagina.width < penis.shaft.size / 2 + vulva.vagina.startWidth &&
      penis.head.posY < penetration.posYabs ||
      penis.head.posY < penetration.posYabs - penis.head.size / 2) {
      vulva.vagina.width = penis.shaft.size / 2 + random(-vulva.quiver, vulva.quiver); //quiver when penetrated
    }
  }
  else {
    vulva.vagina.width = vulva.vagina.startWidth; //unstretch on exit
  }
  vulva.minora.width = vulva.vagina.width + vulva.minora.startWidth - vulva.vagina.startWidth; //stretch minora
  vulva.majora.width = vulva.minora.width + vulva.majora.startWidth - vulva.minora.startWidth; //stretch majora
}
