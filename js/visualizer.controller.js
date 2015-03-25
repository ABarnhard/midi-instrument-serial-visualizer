angular
  .module('visualizer')
  .controller('VisualizerController', VisualizerController);

function VisualizerController($scope) {
  'use strict';

  var vm     = this,
      choice = '/dev/tty.usbmodemfa141',
      stringRecieved = '';

  vm.devices = [];
  vm.stringRecieved = stringRecieved;
  vm.id;


  function onGetDevices(ports) {
    for (var i = 0; i < ports.length; i++) {
      vm.devices.push(ports[i].path);
    }
    $scope.$apply();
  }



  function onConnect(info) {
    // The serial port has been opened. Save its id to use later.
    vm.id = this.connectionId = info.connectionId;
    // Do whatever you need to do with the opened port.
  }


  function onReceiveCallback(obj) {

      // Broken Google Code

      // if (info.connectionId === vm.id && info.data) {
      //   var str = convertArrayBufferToString(info.data);
      //   if (str.charAt(str.length-1) === '\n') {
      //     stringReceived += str.substring(0, str.length-1);
      //     onLineReceived(stringReceived);
      //     stringReceived = '';
      //   } else {
      //     stringReceived += str;
      //   }
      // }


      // My code but console.logs data as an ArrayBuffer

    if (connectionId === obj.connectionId) {
      console.log('data', obj.data);
    } else {
      chrome.serial.setPaused(vm.id, true, function (arg) {
        console.log(arg);
      });
    }

    // Also my code but parses ArrayBuffer... Sort Of???

    // if(connectionId === obj.connectionId){
    //   data = new Uint8Array(obj.data);
    //   console.log("data", data);
    // } else {
    //   console.log(obj);
    // }

  }

  function onReceiveErrorCallback(info) {
    console.log(info.data)
  }




  // console.log(); Current connections logs an array of connection objects.
  chrome.serial.getConnections(function (arg) {
    console.log(arg);
  });


  // console.logs a specific connection.
  // chrome.serial.getInfo(connectionId, function (arg) {console.log(arg)});


  // Lists available serial devices and appends them to vm.devices.

  chrome.serial.getDevices(onGetDevices);




  // Connect to the serial port EG: "/dev/tty.usbmodemfa141"
  chrome.serial.connect(choice, {bitrate: 115200}, onConnect);





  // Listen for data from controller.
  // chrome.serial.onReceive.addListener(onReceiveCallback);




  // Listens for errors from data stream. I think???
  // chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);

}
