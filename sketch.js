// var rStart = 206;
// var gStart = 15;
// var bStart = 105;

var rStart = 175;
var gStart = 39;
var bStart = 47;

var rEnd = 0;
var gEnd = 0;
var bEnd = 0;
// 34, 34, 34
// var rEnd = 255;
// var gEnd = 255;
// var bEnd = 255;

var squareSize = 20; //Doesn't matter
var baseSquareSize = 6;
var addedSquareSize = 4;

var borderColor = 8;

var clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var clientHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var minDim = Math.min(clientWidth, clientHeight) / 8;
minDim = 800;

console.log("THE CLIENT WIDTH IS: " + clientWidth);
console.log("THE CLIENT HEIGHT IS: " + clientHeight);

var canvasLarge, contextLarge;

var startTime, endTime;

function setup() {
    noCanvas();
    console.log("BEGINNING SETUP");
    startTime = new Date().getTime();
    var xSize = clientWidth;
    var ySize = clientHeight;

    var sketch = function(p) {
        p.setup = function() {
            p.createCanvas(windowWidth, windowHeight);
        }
    };
    canvasLarge = new p5(sketch, 'canvasContainer');


    var generators = [];

    var minColor = Math.min(rStart, gStart, bStart);

    var ratio = 1.5;
    var totalRange = (minColor / ratio);
    var rangeDiff = (minColor / (ratio * 2));

    for (var i = 0; i < minDim; i++) {
        var pos = [parseInt(Math.random() * xSize), parseInt(Math.random() * ySize)];

        var randDiff = Math.random() * totalRange - rangeDiff;

        // -1(x-0.5)^2 + 0.25
        var color = [
            parseInt(getColor(rStart, rEnd, randDiff, pos[1], ySize)),
            parseInt(getColor(gStart, gEnd, randDiff, pos[1], ySize)),
            parseInt(getColor(bStart, bEnd, randDiff, pos[1], ySize))
        ];

        var comb = [pos, color];
        generators.push(comb);
    }

        
    
    renderPolygons(xSize, ySize, generators);    
}

async function renderPolygons(xSize, ySize, generators) {
    var pixelCount = 0;
    
    renderRow(xSize, ySize, generators, 0);

    console.log("TOTAL PIXELS: " + pixelCount);
    console.log("COMPLETION TIME: " + (new Date().getTime() - startTime) + "ms");
}

function renderRow(xSize, ySize, generators, index){
    if(index < ySize){
        var generatorStart = generators[0][0][0];
        var generatorEnd = generators[0][0][1];

        squareSize = baseSquareSize + (1 - (index / ySize)) * addedSquareSize;
        canvasLarge.redraw();
    
        renderCol(xSize, ySize, index, generatorStart, generatorEnd, generators);

        setTimeout(function(xS, yS, gens, i){
            renderRow(xS, yS, gens, i);
        }.bind(null, xSize, ySize, generators, index + squareSize), 1 + index / ySize * 8);

        
        
        // for (var y = 0; y < ySize; y += squareSize) {
        // }
    }
}

function renderCol(xSize, ySize, y, generatorStart, generatorEnd, generators){
    var genLen = generators.length;

    borderColor = 8;
    var renderProgress = (y / ySize); //At 50% height this will be = 1, at 100% this will be = 2
    renderProgress = Math.min(-5 * Math.pow(renderProgress - 0.49, 2) + 1.1, 1);   
    var currBorder = (borderColor * renderProgress);

    // var currBorder = (borderColor * renderProgress);
    // currBorder = currBorder - currBorder % borderColor;
    // 0 -> 100% -> 0

    for (var x = 0; x < xSize; x += squareSize) {
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
        canvasLarge.stroke(targetGen[0] + currBorder, targetGen[1] + currBorder, targetGen[2] + currBorder);
        canvasLarge.fill(targetGen[0] - y / ySize, targetGen[1], targetGen[2]);
        canvasLarge.rect(x, y, squareSize, squareSize);
    }
}

function distance(x1, x2, y1, y2) {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}

function getColor(start, end, constRandom, y, ySize) {
    var heightCalc = (y / ySize);
    // console.log("Height calc: " + heightCalc);
    var colorPartial = 0;

    var renderProgress;
    if(heightCalc >= 0.98){
        return end;
    } else if(heightCalc >= 0.953){
        return Math.max(end + constRandom * 0.025, 0);
    } else
        renderProgress = 1.1 * Math.pow(heightCalc - 0.953, 2); //At 50% height this will be = 1, at 100% this will be = 2
    // This is all good
    // Render progress will be between 1 and 0

    // console.log("INBETWEEN COLOR: " + (start + (end - start)));
    console.log("INBETWEEN COLOR: " + (start - end));

    // 179 - 255 = -76 * (0 -> 1)

    if(start - end > 0) // For black
        return Math.min(Math.max(((start - end) * renderProgress) + constRandom * 0.05, 0), 255);
    // For white
    return Math.min(Math.max((start + ((end - start) * (1 - renderProgress))) + constRandom * 0.05, 0), 255);

    // start - end < 0
    // 179 - 255 = -76
    

    // 255 - 179 = 76

    // 179 + (76 * 0.5) + 4 = 221

    // -4.5(x-0.471)^2 + 1
    // if (heightCalc > 0.9) colorPartial = 0;
    // else colorPartial = start + (end - start) * heightCalc;
    // var returnCalc = Math.max(colorPartial + constRandom * 0.05, 0);
    // return returnCalc;
}
