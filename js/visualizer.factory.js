angular
  .module('app')
  .factory('visualizerFactory', visualizerFactory);

function visualizerFactory () {

  var d3 = {
      barChart: barChart,
  };

  return d3;


  function barChart () {

  }
}