function setup() {
  createCanvas(400, 400);
  var generators = [];

  for (var i = 0; i < 30; i++) {
    var color = [parseInt(Math.random() * 180 + 30), parseInt(Math.random() * 40 + 10), parseInt(Math.random() * 180 + 30)];
    var pos = [parseInt(Math.random() * 400), parseInt(Math.random() * 400)];
    var comb = [pos, color];
    generators.push(comb);
  }

  for (var i = 0; i < 400; i++) {
    for (var j = 0; j < 400; j++) {
      var min = 0;
      var dist_min = distance(j, generators[0][0][0], i, generators[0][0][1]);
      for (var iter = 0; iter < generators.length; iter++) {
        var dist_curr = distance(j, generators[iter][0][0], i, generators[iter][0][1]);
        if (dist_curr < dist_min) {
          min = iter;
          var dist_min = distance(j, generators[min][0][0], i, generators[min][0][1]);
        }
      }
      stroke(generators[min][1][0], generators[min][1][1], generators[min][1][2]);
      point(j, i);
    }
  }
}

function draw() {

}

function distance(x1, x2, y1, y2) {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}