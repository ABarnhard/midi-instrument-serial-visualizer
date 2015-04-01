angular
  .module('app')
  .directive('visualizer', visualizer);

function visualizer() {
  'use strict';

  var directive = {
    restrict: 'E',
    templateUrl: 'js/visualizer.html',
    controller: 'VisualizerController',
    controllerAs: 'vis'
    // link: serialDisplay
  };

  return directive;

  // function serialDisplay (scope, ele) {
  //     // our d3 code will go here
  //   var svg = d3.select(ele[0])
  //           .append('svg')
  //           .style('width', '100%');

  //     // Watch for resize event
  //     scope.$watch(scope.serial, function() {
  //       scope.render(scope.serial);
  //     });

  //     scope.render = function(data) {

  //       // If we don't pass any data, return out of the element
  //       if (!data) return;

  //       // setup variables
  //       var width = d3.select(ele[0]).node().offsetWidth - 5,
  //           // calculate the height
  //           height = Object.keys(scope.data).length * (15 + 5),
  //           // Use the category20() scale function for multicolor support
  //           color = d3.scale.category20(),
  //           // our xScale
  //           xScale = d3.scale.linear()
  //             .domain([0, d3.max(data, function(d) {
  //               return d.score;
  //             })])
  //             .range([0, width]);

  //       // set the height based on the calculations above
  //       svg.attr('height', height);

  //       //create the rectangles for the bar chart
  //       svg.selectAll('rect')
  //         .data(data).enter()
  //           .append('rect')
  //           .attr('height', 15)
  //           .attr('width', 140)
  //           .attr('x', Math.round(5/2))
  //           .attr('y', function(d,i) {
  //             return i * (15 + 5);
  //           })
  //           .attr('fill', function(d) { return color(d.score); })
  //           .transition()
  //             .duration(1000)
  //             .attr('width', function(d) {
  //               return xScale(d.score);
  //             });
  //     };
  // }
}


