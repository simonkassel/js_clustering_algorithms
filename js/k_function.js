/*
Ripley's K function clustering algorithm
Simon Kassel
*/

// ---------- Helper functions ---------- //
/*
Convert json points to 2d array
  input:
    - json points
  return:
    - 2d array of x and y coords for all points
*/
function jsonToArray(result) {
  var ptsJSON = JSON.parse(result);

  var pts = [];

  for (var i = 0; i < ptsJSON.length; i++) {
    apt = [];
    apt.push(ptsJSON[i].x);
    apt.push(ptsJSON[i].y);
    pts.push(apt);
  }

  return(pts);
}

/*
Define bounding box from user input points
  input:
    - 2d array of input coordinates
  return:
    - array of coordinates defining bounding box of input points
      format: [xMax, xMin, yMax, yMin]
*/
function defBbox(points) {
  // define bounding box
  xMax = _.max(points, function(points){return points[0];})[0];
  xMin = _.min(points, function(points){return points[0];})[0];
  yMax = _.max(points, function(points){return points[1];})[1];
  yMin = _.min(points, function(points){return points[1];})[1];

  var bbox = [xMax, xMin, yMax, yMin];
  return(bbox);
}

/*
find L(d) value for a point pattern (random or observed)
input:
    - 2d array of input coordinates
    - measurement radius (via user input)
    - area of the bounding box (will come from leaflet draw input)
  return:
    - value of L(d)
*/
function findKd(points, radius, area){

  var neighbors = [];

  //var bbox = defBbox(points);
  var n = points.length;

  for (var i = 0; i < n; i++) {

    var refPoint = points[i];

    var refX = refPoint[0];
    var refY = refPoint[1];

    var refNeighbors = 0;

    var otherPoints = points.slice(0,i).concat(points.slice(i + 1));

    for (var p = 0; p < otherPoints.length; p++) {
      var measureX = otherPoints[p][0];
      var measureY = otherPoints[p][1];
      var dist = math.sqrt(math.square(refX - measureX) + math.square(refY - measureY));
      if (dist <= radius) {
        refNeighbors++;
      }
    }
    neighbors.push(refNeighbors);
  }
  var meanNeighbs = math.mean(neighbors);
  var kd = meanNeighbs / (n / area);
  var ld = math.sqrt(kd / 3.1415) - radius;
  return(ld);
}

/*
develop a random point pattern with the same boundaries and number of points
as the test pattern
input:
    - 2d array of input coordinates
  return:
    - a new, random 2d array of input coordinates
*/
function random(points) {

  var n = points.length;
  var bbox = defBbox(points);

  var randomPts = [];


  for (var i = 0; i < n + 1; i++) {
    var aRandomPoint = [];
    var rp = [];
    rp[0] = Math.floor(Math.random() * (bbox[0] - bbox[1])) + bbox[1];
    rp[1] = Math.floor(Math.random() * (bbox[2] - bbox[3])) + bbox[3];
    randomPts.push(rp);
  }
  return(randomPts);
}

/*
Find confidence interval of L(d) values for expected random patterns
input:
    - 2d array of test pattern points
    - user specified search radius
    - area of bounding box
    - number of folds (random samples to try)
  return:
    - an envelope object with min and max characteristics
*/
function confEnvelopes(points, radius, folds, area) {

  var randomKds = [];

  for (var i = 0; i <= folds; i++) {
    var randomSet = random(points);
    randomKds.push(findKd(randomSet, radius, area));
  }

  var envelope = {};
  envelope.min = _.min(randomKds);
  envelope.max = _.max(randomKds);

  return(envelope);
}



// URL for sample data from github repo
var url = "https://raw.githubusercontent.com/simonkassel/js_clustering_algorithms/master/data/nni_testing_data.json";

// Run analysis on sample data
$.ajax(url).done(function(result) {

  var start = Date.now();

  // Temporarily hard-code in some values, will eventually come from user input
  var area = 535156; // from leaflet draw / area of phila
  var radius = 150; // user input (slider bar)
  var folds = 99; // I will choose this based on performance

  // Convert json to 2d array
  var pts = jsonToArray(result);

  // observed L(d) value
  var obsLD = findKd(pts, radius, area);

  // confidence envelopes
  var env = confEnvelopes(pts, radius, folds, area);

  var finish = Date.now();

  console.log("Observed L(d) = " + (math.round(obsLD * 100) / 100));
  console.log("Computed confidence envelope of " + (math.round(env.min * 100) / 100) + " to " + (math.round(env.max * 100) / 100) + " on " + folds + " folds.");
  console.log("Measured " + pts.length + " points in " + (finish - start) + " milliseconds.");
});
