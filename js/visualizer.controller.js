angular
  .module('app')
  .controller('VisualizerController', VisualizerController);

function VisualizerController($scope) {
  'use strict';

  var vm     = this,
      serial = chrome.serial,
      connectionInfo,
      connectionId;

  vm.devices = [];



  function onGetDevices(ports) {
    var  connectionPath = '';

    for (var i = 0; i < ports.length; i++) {
      vm.devices.push(ports[i].path);
    }

    connectionPath = vm.connectionPath = vm.devices[5];
    $scope.$apply();
    serial.connect(connectionPath, onConnect);
  }



  function onConnect(info) {
    // The serial port has been opened. Save its id to use later.
    connectionId = vm.id = info.connectionId;
    connectionInfo = vm.connectionInfo = info;
    // Do whatever you need to do with the opened port.
  }


  function onRecieveCallback (arrayBuffer) {
      var obj          = {},
          u8view       = new Uint8Array(arrayBuffer.data),
          parsedKVPArr = [],
          str          = '',
          sync         = false;

// Convert ArrayBuffer to a string then an Array.

        for (var a = 0; a < u8view.length; a++) {
          str += String.fromCharCode(u8view[a]);
        }

        parsedKVPArr = str.replace(/(\r\n|\n|\r)/gm, ',').replace(/(\s)/g, '').split(',').slice(0, -1);

// Convert Parsed Array into an obj with 24 values starting from 0

        for (var c = 0; c < parsedKVPArr.length; c++) {
          var tempArr = parsedKVPArr[c].split(':');
          if (sync) {
            obj[tempArr[0]] = tempArr[1];
            if (Object.keys(obj).length === 24){
              console.log(obj);
              return obj;
            }
          } else {
            if (tempArr[0] === '0') {
              obj[tempArr[0]] = tempArr[1];
              sync = true;
            }
          }
        }
    // document.querySelector('.serialDisplay').textContent = serialToString(obj.data);
  }



  function onReceiveErrorCallback(info) {
    console.log(info.data);
  }



  document.querySelector('body').onclick = function(){
    serial.setPaused(connectionId, true, function(){});
  };

  // console.log(); Current connections logs an array of connection objects.
  // serial.getConnections(function (arg) {
  //   console.log(arg);
  // });


  // console.logs a specific connection.
  // serial.getInfo(connectionId, function (arg) {console.log(arg)});


  // Lists available serial devices and appends them to vm.devices.

  serial.getDevices(onGetDevices);




  // Connect to the serial port EG: "/dev/tty.usbmodemfa141"


  // Listen for data from controller.
  serial.onReceive.addListener(onRecieveCallback);


  // Listens for errors from data stream. I think???
  // serial.onReceiveError.addListener(onReceiveErrorCallback);








}
