angular
  .module('app')
  .directive('visualizer', visualizer);


function visualizer() {
  return {
    restrict: 'E',
    templateUrl: 'js/visualizer.html',
    controller: 'VisualizerController',
    controllerAs: 'vis'
  };
}
