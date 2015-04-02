angular
  .module('app')
  .directive('visualizer', visualizer);

function visualizer() {
  'use strict';

  var directive = {
    restrict: 'EA',
    templateUrl: 'js/visualizer.html',
    controller: 'MainCtrl',
    controllerAs: 'vis',
    link: serialDisplay
  };

  return directive;

  function serialDisplay (scope, element, attrs) {

    var margin = parseInt(attrs.margin) || 20,
        barHeight = parseInt(attrs.barHeight) || 20,
        barPadding = parseInt(attrs.barPadding) || 5;

    var svg = d3.select(element[0])
                .append('svg')
                .style('width', '100%');

    // Browser onresize event
    window.onresize = function() {
      scope.$apply();
    };

    scope.$watch('data', function(newVals, oldVals) {
      return scope.vis.render(newVals);
    }, true);

    // Watch for resize event
    scope.$watch(function() {
      return angular.element(window)[0].innerWidth;
    }, function() {
      scope.vis.render(scope.vis.data);
    });

    scope.vis.render = function(data) {
      // remove all previous items before render
      svg.selectAll('*').remove();

      // If we don't pass any data, return out of the element
      if (!data) return;

      // setup variables
      var width = d3.select(element[0]).node().offsetWidth - margin,
          // calculate the height
          height = scope.vis.data.length * (barHeight + barPadding),
          // Use the category20() scale function for multicolor support
          color = d3.scale.category20(),
          // our xScale
          xScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
              return d.value;
            })])
            .range([0, width]);

      // set the height based on the calculations above
      svg.attr('height', height);

      //create the rectangles for the bar chart
      svg.selectAll('rect')
        .data(data).enter()
          .append('rect')
          .attr('height', barHeight)
          .attr('width', 140)
          .attr('x', Math.round(margin/2))
          .attr('y', function(d,i) {
            return i * (barHeight + barPadding);
          })
          .attr('fill', function(d) { return color(d.value); })
          .attr('width', function(d) {
            return xScale(d.value);
          });
    };
  }
}
