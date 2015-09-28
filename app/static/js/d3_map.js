var add_map = function(){
  console.log('hi')
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


  var rateById = d3.map();

  var quantize = d3.scale.quantize()
      .domain([0, 2140]) //2140 257
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));


  queue()
      .defer(d3.json, "{{url_for('static', filename='json/seattle.json')}}")
      .await(ready);


  function ready(error, collection){
    if (error) throw error;
    
    var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

    var feature = g.selectAll("path")
          .data(collection.features)
        .enter().append("path")

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