/* global d3 */
// d3-es-geo-chart
import topojson from 'topojson';
import ngeohash from 'ngeohash';

// import d3_geo_projection from 'd3-geo-projection';
// import d3_selection from 'd3-selection';


export default function() {

  var width, height, data, topology,
      landClass = 'land',
      borderClass = 'border',
      pinClass = 'pin';

  function geoChart(selection) {
    selection.each(function(d, i) {
      var element = d3.select(this);

      var scale = 173 / 1090;

      var projection = d3.geo.equirectangular()
          .scale(scale * width)
          .translate([width / 2, height / 2])
          .precision(0.1);

      var path = d3.geo.path()
          .projection(projection);

      element.insert('path', '.graticule')
          .datum(topojson.feature(topology, topology.objects.land))
          .attr('class', landClass)
          .attr('d', path);

      element.insert('path', '.graticule')
          .datum(topojson.mesh(topology, topology.objects.countries, function(a, b) { return a !== b; }))
          .attr('class', borderClass)
          .attr('d', path);

      // now draw the data
      data = data || {buckets: []};
      element.selectAll('circle')
              .data(data.buckets)
              .enter()
              .append('circle')
              .attr('class', pinClass)
              .attr('transform', function(d) {
                var latLon = ngeohash.decode(d.key);
                return 'translate(' + projection([latLon.longitude, latLon.latitude]) + ')';
              });
    });
  }

  geoChart.width = function(val) {
    if (!arguments.length) {
      return width;
    }
    width = val;
    return geoChart;
  };

  geoChart.height = function(val) {
    if (!arguments.length) {
      return height;
    }
    height = val;
    return geoChart;
  };

  geoChart.topology = function(val) {
    if (!arguments.length) {
      return topology;
    }
    topology = val;
    return geoChart;
  };

  geoChart.landClass = function(val) {
    if (!arguments.length) {
      return landClass;
    }
    landClass = val;
    return geoChart;
  };

  geoChart.borderClass = function(val) {
    if (!arguments.length) {
      return borderClass;
    }
    borderClass = val;
    return geoChart;
  };

  geoChart.pinClass = function(val) {
    if (!arguments.length) {
      return pinClass;
    }
    pinClass = val;
    return geoChart;
  };

  geoChart.data = function(val) {
    if (!arguments.length) {
      return data;
    }
    data = val;
    return geoChart;
  };

  return geoChart;
}