function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
 	
 
// Add a vector to another
Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
}

// Substract a vector from another
Vector.prototype.subs = function(vector) {
  this.x -= vector.x;
  this.y -= vector.y;
}

Vector.prototype.scale = function(factor) {
  this.x /= factor;
  this.y /= factor;
}

 
// Gets the length of the vector
Vector.prototype.getMagnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
 
// Gets the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function () {
  return Math.atan2(this.y,this.x);
};
 
// Allows us to get a new vector from angle and magnitude
Vector.fromAngle = function (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};
 

function Walker(node_from, velocity) {
  this.position = new Vector(node_from.x, node_from.y);
  this.node_to = this.next_node();
  this.node_from = position;
  this.node = node_from;

  this.way = (this.position.subs(this.node_to)).getMagnitude();
  this.velocity = (this.node_to.subs(this.node_from)).scale(this.way);
  
}
 	

Walker.prototype.one_tick = function () {
  // Add our current velocity to our position
  this.position.add(this.velocity);
}; 

Walker.prototype.new_node(node){
  this.position = new Vector(node.x, node.y);
}

Walker.prototype.next_node = function () {
  
  // Add our current velocity to our position
  this.position.add(this.velocity);
}; 