let numberPoints;
let heights = [];

function setup() {
  var canvasDiv = document.getElementById('background');
  var myCanvas = createCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
  myCanvas.parent("background");
  frameRate(60);
  
}

function windowResized() {
  var canvasDiv = document.getElementById('background');
  resizeCanvas(canvasDiv.offsetWidth, canvasDiv.offsetHeight);
}

function draw() {
  windowResized();
  background(51);

  if (width > 1000) {
    numberPoints = 750;
  } else {
    numberPoints = width / 2;
  }
  
  fill(255,255,255,255);
  stroke(255);
  beginShape();
  vertex(0, height);
  var center = numberPoints / 2;
  for (var x = 0; x <= numberPoints; x++) {
    var distanceFromCenter = Math.abs(x - center)/10;
    vertex(x*width/numberPoints, (height/3 * -Math.cos(distanceFromCenter-frameCount/100)) / (distanceFromCenter+1) + 2*height/3);
  }
  vertex(width, height);
  endShape();
}