//The agent class
	
var Agent = (function() {
        var id = 0;  // class type var
   
        function nextid() { return id++; }

        var Agent = function(params) {
          this.id = nextid();
          this.node_id = params.node;

          var node = node_info(graph_data[this.node_id]);
          
          this.x = node.x;
          this.y = node.y;
          this.path = this.node_id;

        };

        Agent.prototype = {
          angle: function(n2){  return Math.atan2(this.y, this.x) - Math.atan2(n2.y,  n2.x)},
          length: function(n2){ return Math.sqrt((this.x - n2.x)*(this.x - n2.x) + (this.y - n2.y)*(this.y - n2.y)) }
        };

        return Agent;
})();



