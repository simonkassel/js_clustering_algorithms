/*

Ripley's K function clustering algorithm
Simon Kassel

*/

// Temporarily hard-code in some values, will eventually come from user input
// array of points from nni_testing_data.json script
var start = Date.now();
var removeOutliers = true;
var area = 535156;
var n = pts.length;


var nnd = [];
for (var i = 0; i < n; i++) {

  var refPoint = pts[i];
  var refX = refPoint.x;
  var refY = refPoint.y;

  var lowDist = area;

  var otherPoints = pts.slice(0,i).concat(pts.slice(i + 1));

  for (var p = 0; p < otherPoints.length; p++) {
    var measureX = otherPoints[p].x;
    var measureY = otherPoints[p].y;

    var dist = math.sqrt(math.square(refX - measureX) + math.square(refY - measureY));

    if (dist < lowDist) {
      lowDist =  dist;
    }
  }
  nnd.push(lowDist);
}


var meanObserved = math.mean(nnd);


if (removeOutliers) {
  var noOutliers = _.filter(nnd, function(dist){
    return dist < (meanObserved + (2.5 * math.std(nnd)));
  });

  meanObserved = math.mean(noOutliers);
} else {
  var noOutliers = nnd;
}


var meanExpected = 0.5 / math.sqrt(noOutliers.length / area);

var se = 0.26136 / math.sqrt(math.square(noOutliers.length) / area);

var zscore = (meanObserved - meanExpected)/se;

if (zscore > 0) {
  var pval = 1 - jStat.ztest(zscore, 1);
} else {
  var pval = jStat.ztest(zscore, 1);
}

var nni = meanObserved / meanExpected;

var finish = Date.now();

console.log("NNI is " + nni + ".");
console.log("with a p-value of " + pval + ".");
console.log("Measured " + n + " points in " + (finish - start) + " milliseconds.");
