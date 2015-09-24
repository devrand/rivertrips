/*********** dis is my testing framework !!! **********/

var output = document.getElementById('output'); 
  
function assert( outcome, description ) { 
    var li = document.createElement('li'); 
    li.className = outcome ? 'pass' : 'fail'; 
    li.appendChild( document.createTextNode( description ) ); 
  
    output.appendChild(li); 
}; 

/*********** eof my testing framework !!! **********/

var Walker = (function() {
        var id = 0;
        var x;
        var y;
        var v = 1;
        var path = [];

        function nextid() { return id++; }

        var Walker = function(node) {
          this.id = nextid();
          
          this.x = node.x;
          this.y = node.y;
          this.path = [node.id, null];

        };

        Walker.prototype = {
          walk: function(t) { if(this.paths.indexOf(n)===-1) { this.paths.push(n); }},
          angle: function(n2){  return Math.atan2(this.y, this.x) - Math.atan2(n2.y,  n2.x)},
          length: function(n2){ return Math.sqrt((this.x - n2.x)*(this.x - n2.x) + (this.y - n2.y)*(this.y - n2.y)) }
        };

        return Walker;
}());
 


var Node = (function() {
        var id = 0;
        function nextid() { return id++; }

        var Node = function(x, y) {
          this.id = nextid();
          this.paths = [];
          this.x = +x;
          this.y = +y;
        };

        Node.prototype = {
          link: function(n) { if(this.paths.indexOf(n)===-1) { this.paths.push(n); }},
          toString: function() { return this.id + ": " + this.paths.map(function(n) { return n.id; }).join(","); },
          angle: function(n2){  return Math.atan2(this.y, this.x) - Math.atan2(n2.y,  n2.x)},
          length: function(n2){ return Math.sqrt((this.x - n2.x)*(this.x - n2.x) + (this.y - n2.y)*(this.y - n2.y)) }
        };

        return Node;
}());

function check_node(x, y, nodes){ // check if node with (x, y) exists
  
  for(n in nodes){ 
    var node = nodes[n];  
    if(node.x === +x && node.y === +y){ 
      return node.id;  
    }
  }
  return -1;
}

function find_node(nodes, id){ // get node by id
  for(n in nodes){ 
    var node = nodes[n];   
    if(node.id == id) return node;  
  }
  
}

function links(node, nodes){ // connect node to array of nodes
  nodes.forEach(function(n){ node.link(n.id) } )
}

function add_or_create_nodes_with_paths(node_coordinates, nodes){ // this function converts row with coords to legit Nodes with paths


  var filtered = d3.values(node_coordinates).filter(function(d){ return typeof d !== "undefined"; }) ;  
  var lnodes = filtered.map(function(cs){  // coord strings for adj list of nodes
    // check if node with such coords exists, if not - create:
    var node;
    var ar = cs.replace(/[(),]/g, '').split(' '); // convert str to pair of coords

    var id = check_node( ar[0], ar[1], nodes);
    if( id === -1){ // node creation
      node = new Node(ar[0], ar[1]);
      nodes.push(node);
    } else { // ... if exists
      node = find_node(nodes, id);
    }  
    return node; 
  })

  connect_group(lnodes);  
}

function connect_group(node_array){ // connect all nodes in group
  // i.e. add all neibourghood nodes to link list,  for each node
    for(var n = 0; n < node_array.length; n++){
      var clone = node_array.slice(0);
      var current = node_array[n];
      clone.splice(n, 1); // drop current
      links(current, clone);
    }
}

function init_nodes(data){ // create graph from adj list data
  var nodes = [];
  data.forEach(function(row){
    add_or_create_nodes_with_paths(row, nodes);
  })
  return nodes;
}


function edge_list(nodes){ // create list of all edge pairs
  return nodes.reduce(function(memo, node){ 

    var boo = memo.concat( node.paths.map(function(p){ return [node.id, p]} ) );
 //console.log(boo);     
    return boo; }, []);
}



d3.tsv("adj.out", make_graph);  // read data, uncomment me
function make_graph(data) { 

  var nodes = init_nodes(data);
  //nodes = nodes.filter(function(n){ return n.paths.length > 0;})
  var edges = edge_list(nodes); 

//console.log(nodes)

  var map = d3.select("#map").append("svg").append("g");
  var w = 1000, h = 800;

  var scx = d3.scale.linear().range([0, w]).domain([30.587, 30.613]),
      scy = d3.scale.linear().range([h, 0]).domain([50.428, 50.451]);

  var line = d3.svg.line()
      .x(function(d) { return scx(d.x); })
      .y(function(d) { return scy(d.y); })
      .interpolate("linear");


  var pairs = map.selectAll('line')
    .data(edges)
      .enter()
    .append('line')
    .datum(function(d){
      var f = find_node(nodes, d[0]), t = find_node(nodes, d[1]);
      if( f )   return [f.x, f.y, t.x, t.y];
      else return  null;   
    })
    .attr('x1', function(d){ return scx(d[0]);  })
    .attr('y1', function(d){ return scy(d[1]);  })
    .attr('x2', function(d){ return scx(d[2]);  })
    .attr('y2', function(d){ return scy(d[3]);  })
  
  
   var nodes = map.selectAll('circle')
    .data(nodes)
    .enter()
    .append("circle")
    .attr('cx', function(d){ return scx(d.x)})
    .attr('cy', function(d){ return scy(d.y)})
    .attr('r', '1')
    .attr('id', function(d){return d.id})
    .style("stroke", 'black');

/*      
    .append('path')
    .datum(function(d, i){

      var f = nodes[d.from], t = nodes[d.to];
//console.log(''+d.to); 
     if(typeof nodes[d.to] !== "undefined")   return [{x: f.x, y: f.y}, {x: t.x, y: t.y}]
     else return  [{x: 0, y: 0}, {x: 0, y: 0}]   
    })
    .attr("d", function(d) { return line(d) + "Z"; });
    //.attr("d", line);

*/




}

function do_tests(){
  var test_data = [["(0, 1)", "(1, 2)"], ["(1, 2)", "(1, 3)", "(1, 4)"]];
  var tnodes = init_nodes(test_data);
//console.log(tnodes)
  assert(tnodes.length === 4, 'checking non-duplication of same nodes, length = ' + tnodes.length)

console.log(edge_list(tnodes))
  assert( find_node(tnodes, 0).id === 0, 'check id of first node')
  assert( find_node(tnodes, 1).paths.length === 3, 'check all links for node = 1');
  assert( edge_list(tnodes).length === 8, 'number of all edge pairs = 8');
  //assert( [1,2,3].concat([3,2,1]) === [1,2,3,3,2,1], 'check' );
}

//do_tests();