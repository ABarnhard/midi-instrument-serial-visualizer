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

    function arrayBufferToString(arrayBuffer) {

      var u8view = new Uint8Array(arrayBuffer),
             str = '',
               i = 0;
      for (i = 0; i < arrayBuffer.byteLength; i++) {
        str += String.fromCharCode(u8view[i]);
      }
      return str.replace(/(\r\n|\n|\r)/gm, ',').replace(/(\s)/g, '');
    }


    function serialStringToObj(str) {
      var obj = {},
          arr = str.split(',').slice(0, -1),
       arrLen = arr.length,
         temp;
      for (var i = 0; i < arrLen; i++) {
        temp = arr[i].split(':');
        obj[temp[0]] = temp[1];
      }
      return obj;
    }

    // I'd like to eventually live update the view using the object I'm getting from the serialToObj method
    // Also I'd like the object coming from the serialToObj method to be a set number of values, EG: 24 data points.
    // But It would also need a way to sync up with the 0 key from the data so the updated obj would be the same on every iteration.


    // vm.serial = serialStringToObj(arrayBufferToString(obj.data));




    //For now I'm Console.logging the obj created from parsing the string created from the stream of data coming in from the ArrayBuffer {};

    console.log(serialStringToObj(arrayBufferToString(obj.data)));

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
  chrome.serial.onReceive.addListener(onReceiveCallback);



  // Listens for errors from data stream. I think???
  // chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);








}
