var Node = function(object) {
  for (var key in object) {
    this[key] = object[key];
  }
}

Node.prototype.measureDistances = function(area_obj, room_obj) {
  var area_range = area_obj.max - area_obj.min;
  var rooms_range = room_obj.max - room_obj.min;

  //loop through neighbors and calc area/room diff
  for (var i in this.neighbors) {
    var neighbor = this.neighbors[i];

    var area_diff = neighbor.area - this.area;
    area_diff /= area_range;

    var rooms_diff = neighbor.rooms - this.rooms;
    rooms_diff /= rooms_range;

    neighbor.distance = Math.sqrt(area_diff*area_diff + rooms_diff*rooms_diff);
  }

};

Node.prototype.sortByDistance = function() {
  this.neighbors.sort( function(a, b) {
    return a.distance - b.distance;
  });
}

Node.prototype.guessType = function(k) {
  var types = {};

  //loop through neighbors and increment neighbor type in hash
  for (var i in this.neighbors.slice(0, 2)) {
    var neighbor = this.neighbors[i];
    if (!types[neighbor.type]) types[neighbor.type] = 0;
    types[neighbor.type] += 1;
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
