var rStart = 206;
var gStart = 15;
var bStart = 105;

var rEnd = 255;
var gEnd = 255;
var bEnd = 255;

var clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var clientHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var minDim = Math.min(clientWidth, clientHeight) / 8;
minDim = 400;

console.log("THE CLIENT WIDTH IS: " + clientWidth);
console.log("THE CLIENT HEIGHT IS: " + clientHeight);

var canvasLarge;

function setup() {
  noCanvas();
  console.log("BEGINNING SETUP");
  var xSize = clientWidth;
  var ySize = clientHeight;

  var sketch = function(p) {
    p.setup = function(){
      p.createCanvas(windowWidth, windowHeight); 
    }
  };
  canvasLarge = new p5(sketch, 'canvasContainer');

  var generators = [];
  
  var minColor = Math.min(rStart,gStart,bStart);

  var ratio = 1.5;
  var totalRange = (minColor / ratio);
  var rangeDiff = (minColor / (ratio * 2));

  for (var i = 0; i < minDim; i++) {
    var pos = [parseInt(Math.random() * xSize), parseInt(Math.random() * ySize)];
    
    var randDiff = Math.random() * totalRange - rangeDiff;

    var color = [
      parseInt(getColor(rStart, rEnd, randDiff, pos[1], ySize)),
      parseInt(getColor(gStart, gEnd, randDiff, pos[1], ySize)),
      parseInt(getColor(bStart, bEnd, randDiff, pos[1], ySize))
    ];

    var comb = [pos, color];
    generators.push(comb);
  }

    var generatorStart = generators[0][0][0];
    var generatorEnd = generators[0][0][1];

    var genLen = generators.length;

  for (var y = 0; y < ySize; y+=5) {
    for (var x = 0; x < xSize; x+=5) {
      var min = 0;
      var dist_min = distance(x, generatorStart, y, generatorEnd);

      for (var iter = 0; iter < genLen; iter++) {
        var targetGen0 = generators[iter][0][0];
        var targetGen1 = generators[iter][0][1];

        var dist_curr = distance(x, targetGen0, y, targetGen1);
        if (dist_curr < dist_min) {
          min = iter;
          var dist_min = distance(x, targetGen0, y, targetGen1);
        }
      }

      var targetGen = generators[min][1];
      canvasLarge.stroke(targetGen[0]+20, targetGen[1]+20, targetGen[2]+20);
      canvasLarge.fill(targetGen[0], targetGen[1], targetGen[2]);
      canvasLarge.rect(x, y, 5, 5);
    }
  }
}

function draw() {

}

function distance(x1, x2, y1, y2) {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}

function getColor(start, end, constRandom, y, ySize) {
  var heightCalc = (y / ySize);
  var colorPartial = 0;
  
  if (heightCalc > 0.9) colorPartial = 255; else colorPartial = start + (end - start) * heightCalc;
  var returnCalc = Math.max(colorPartial + constRandom, 0);
  return returnCalc;
}