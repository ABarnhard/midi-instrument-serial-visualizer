angular
  .module('visualizer')
  .controller('VisualizerController', VisualizerController);

function VisualizerController () {
  var vm = this;

  // function onGetDevices (ports) {
  //   for (var i=0; i<ports.length; i++) {
  //     console.log(ports[i].path);
  //   }
  // }

  function onConnect (connectionInfo) {
    // The serial port has been opened. Save its id to use later.
    this.connectionId = connectionInfo.connectionId;
    // Do whatever you need to do with the opened port.
    vm.data = this.connectionId;
  }



  // chrome.serial.getDevices(onGetDevices);

  // Connect to the serial port /dev/ttyS01
  chrome.serial.connect("/dev/tty.usbmodemfa141", {bitrate: 115200}, onConnect);


}
