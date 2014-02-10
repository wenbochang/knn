var Node = function(object) {
  this.features = {};
  for (var key in object) {
    this.features[key] = object[key];
  }
}


Node.prototype.measureDistances = function(features) {
  for (var i in this.neighbors) {
    var neighbor = this.neighbors[i];
    var total_diff = 0;

    for (var feature in features) {
      var feature_range = features[feature].max - features[feature].min;
      var feature_diff = neighbor.features[feature] - this.features[feature];
      feature_diff /= feature_range;
      total_diff += (feature_diff * feature_diff);
    }

    neighbor.distance = Math.sqrt(total_diff);
  }
}

Node.prototype.sortByDistance = function() {
  this.neighbors.sort( function(a, b) {
    return a.distance - b.distance;
  });
}

Node.prototype.guessType = function(k) {
  var types = {};

  //loop through neighbors and increment neighbor type in hash
  for (var i in this.neighbors.slice(0, k)) {
    var neighbor = this.neighbors[i];
    if (!types[neighbor.features.type]) types[neighbor.features.type] = 0;
    types[neighbor.features.type] += 1;
  }

  //loop through types hash and get highest count
  var guess = {type: false, count: 0};
  for (var type in types) {
    if (types[type] > guess.count) {
      guess.type = type;
      guess.count = type[type];
    }
  }

  this.guess = guess;
  return types;
}
