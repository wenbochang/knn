var NodeList = function(k) {
  this.nodes = [];
  this.k = k;
  this.features = {};
}

NodeList.prototype.add = function(node) {
  this.nodes.push(node);
}

//calculate min/max for each feature
NodeList.prototype.calculateRanges = function() {
  for (var i in this.nodes) {
    var node = this.nodes[i];

    for (var feature in node.features) {
      if (feature === "type") continue;

      this.features[feature] = (this.features[feature] || {min: 1000000, max: 0});
      if (node.features[feature] < this.features[feature].min) 
        this.features[feature].min = node.features[feature];
      if (node.features[feature] > this.features[feature].max) 
        this.features[feature].max = node.features[feature];
    }
  }

  this.areas = this.features.area;
  this.rooms = this.features.rooms;

}

NodeList.prototype.determineUnknown = function() {
  this.calculateRanges();

  //loop through all nodes and look for unknown
  for (var i in this.nodes) {
    if (!this.nodes[i].features.type) {

      //clone neighbors
      this.nodes[i].neighbors = [];
      for (var j in this.nodes) {
        if (!this.nodes[j].features.type) continue;
        this.nodes[i].neighbors.push( new Node(this.nodes[j].features) );
      }

      //measure distances
      this.nodes[i].measureDistances(this.features);
      
      //sort by distance
      this.nodes[i].sortByDistance();

      //guess type of node
      console.log(this.nodes[i].guessType(this.k));
    }
  }
};

NodeList.prototype.draw = function(canvas_id) {
  var rooms_range = this.rooms.max - this.rooms.min;
  var areas_range = this.areas.max - this.areas.min;

  var canvas = document.getElementById(canvas_id);
  var ctx = canvas.getContext("2d");
  var width = 400;
  var height = 400;
  ctx.clearRect(0,0,width, height);

  for (var i in this.nodes)
  {
    ctx.save();

    switch (this.nodes[i].features.type)
    {
      case 'apartment':
        ctx.fillStyle = 'red';
        break;
      case 'house':
        ctx.fillStyle = 'green';
        break;
      case 'flat':
        ctx.fillStyle = 'blue';
        break;
      default:
        ctx.fillStyle = '#666666';
    }

    var padding = 40;
    var x_shift_pct = (width  - padding) / width;
    var y_shift_pct = (height - padding) / height;

    var x = (this.nodes[i].features.rooms - this.rooms.min) * (width  / rooms_range) * x_shift_pct + (padding / 2);
    var y = (this.nodes[i].features.area  - this.areas.min) * (height / areas_range) * y_shift_pct + (padding / 2);
    y = Math.abs(y - height);


    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    

    /* 
     * Is this an unknown node? If so, draw the radius of influence
     */

    if ( ! this.nodes[i].features.type )
    {
      switch (this.nodes[i].guess.type)
      {
        case 'apartment':
          ctx.strokeStyle = 'red';
          break;
        case 'house':
          ctx.strokeStyle = 'green';
          break;
        case 'flat':
          ctx.strokeStyle = 'blue';
          break;
        default:
          ctx.strokeStyle = '#666666';
      }

      var radius = this.nodes[i].neighbors[this.k - 1].distance * width;
      radius *= x_shift_pct;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI*2, true);
      ctx.stroke();
      ctx.closePath();

    }

    ctx.restore();

  }

};

