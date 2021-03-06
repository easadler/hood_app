<!DOCTYPE html>
<head>
<meta charset="utf-8">
 <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"/><script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/queue-async/1.0.7/queue.min.js"></script>
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>


<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script src="{{ url_for('static', filename='js/d3_map.js') }}"></script>
<script src="{{ url_for('static', filename='js/sortable.js') }}"></script>

<link rel="stylesheet" type="text/css" href="{{url_for('static', filename='css/d3_map.css')}}">
<link rel="stylesheet" type="text/css" href="{{url_for('static', filename='css/sortables.css')}}">

</head>
<body>

{% include 'header.html' %}
{% include 'body.html' %}

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>
<script type="text/javascript" charset="utf-8">
console.log({{ map_data|tojson|safe }})
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', function() {
        socket.emit('my event', {data: 'I\'m connected!'});
    });
    socket.on('new clusters', function(){
      plotMap()
    })
</script>


<!-- render map -->
<script type="text/javascript">

var plotMap function(){
  var map = L.map('map').setView([47.6097, -122.3331], 11);
    L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.high-contrast/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
          id: 'mapbox.streets'
        }).addTo(map);

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    var c10 = d3.scale.category10();

}
  

var plotData = function(){



  var rateById = d3.map();

  // var quantize = d3.scale.quantize()
  //     .domain([0, 2140]) //2140 257
  //     .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));





  queue()
      .defer(d3.json, "{{url_for('static', filename='json/seattle.json')}}")
      .defer(d3.csv, "{{url_for('static', filename='csv/clusters.csv')}}", function(d) { rateById.set(+d.id, +d.cluster); })
      .await(ready);


  function ready(error, collection){
    if (error) throw error;
    
    var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

    var feature = g.selectAll("path")
          .data(collection.features)
        
      feature.enter().append("path")
        .attr("fill", function(d) { return c10(rateById.get(d.properties.REGIONID)); })
        .attr('class', function(d) { return d.properties.NAME;})

      feature.exit().remove()

    map.on("viewreset", reset);
    reset();


      function reset() {
      var bounds = path.bounds(collection),
          topLeft = bounds[0],
          bottomRight = bounds[1];

      svg.attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

      feature.attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
  }
}
</script>