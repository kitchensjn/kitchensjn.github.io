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
    //windowResized();
    background('rgba(0,0,0,0)');

    var pixelWidth = 5
    var pixelHeight = 5

    for (var y=0; y<=height/pixelHeight; y++){
        for (var x=0; x<=width/pixelWidth; x++) {
            if (y > 0.01*(x-(width/pixelWidth)/2)**2+(height/pixelHeight)/2) {
                continue
            }
            if (random(1) > (y*y)/1000) {
                if (random(1) > 0.95) {
                    if (random(1) > 0.5) {
                        fill("#337ab7");
                        stroke("#337ab7");
                    } else {
                        fill(51);
                        stroke(51);
                    }
                } else {
                    fill(255);
                    stroke(255);
                }
                rect(x*pixelWidth, height-y*pixelHeight, pixelWidth-1, pixelHeight-1);
            }
        }
    }
    noLoop();
}