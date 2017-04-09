/*
Ripley's K function clustering algorithm
Simon Kassel
*/

var url = "https://raw.githubusercontent.com/simonkassel/js_clustering_algorithms/master/data/nni_testing_data.json";

$.ajax(url).done(function(result) {

  // Temporarily hard-code in some values, will eventually come from user input
  // array of points from nni_testing_data.json script
  var area = 535156;
  var radius = 150;
  var folds = 99;

  var pts = JSON.parse(result);

  var n = pts.length;

  console.log(pts);

});
//
// var start = Date.now();
//
//
//
// // define bounding box
// xMax = _.max(pts, function(pt){return pt.x;}).x;
// xMin = _.min(pts, function(pt){return pt.x;}).x;
// yMax = _.max(pts, function(pt){return pt.y;}).y;
// yMin = _.min(pts, function(pt){return pt.y;}).y;
//
//
// // find nearest neighbors within radius
// function findKd (points){
//
//   var neighbors = [];
//   for (var i = 0; i < n; i++) {
//
//     var refPoint = points[i];
//     var refX = refPoint.x;
//     var refY = refPoint.y;
//     var refNeighbors = 0;
//     var otherPoints = points.slice(0,i).concat(points.slice(i + 1));
//
//     for (var p = 0; p < otherPoints.length; p++) {
//       var measureX = otherPoints[p].x;
//       var measureY = otherPoints[p].y;
//       var dist = math.sqrt(math.square(refX - measureX) + math.square(refY - measureY));
//       if (dist <= radius) {
//         refNeighbors++;
//       }
//     }
//     neighbors.push(refNeighbors);
//   }
//
//   var meanNeighbs = math.mean(neighbors);
//   var kd = meanNeighbs / (n / area);
//   var ld = math.sqrt(kd / 3.1415) - radius;
//   return(ld);
// }
//
// // randomize, find confidence envelopes
// function random(n, xmin, xmax, ymin, ymax) {
//   var randomPts = [];
//   for (var i = 0; i < n + 1; i++) {
//     var aRandomPoint = {};
//     var rp = {};
//     rp.x = Math.floor(Math.random() * (xmax - xmin)) + xmin;
//     rp.y = Math.floor(Math.random() * (ymax - ymin)) + ymin;
//     randomPts.push(rp);
//   }
//   return(randomPts);
// }
//
// // observed L(d) value
// var obsLD = findKd(pts);
//
//
// var randKds = [];
// for (var i = 0; i < folds; i++) {
//   var randomSet = random(n, xMin, xMax, yMin, yMax);
//   randKds.push(findKd(randomSet));
// }
//
// var envelope = {};
// envelope.min = _.min(randKds);
// envelope.max = _.max(randKds);
//
// console.log("Observed L(d) = " + obsLD);
// console.log("Computed conf. envelope of " + envelope.min + " - " + envelope.max + " on " + folds + " folds.");
//
// var finish = Date.now();
// console.log("Measured " + pts.length + " points in " + (finish - start) + " milliseconds.");
