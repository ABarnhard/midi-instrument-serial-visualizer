angular
  .module('app')
  .controller('VisualizerController', VisualizerController);

function VisualizerController($scope) {
  'use strict';

  var vm     = this,
      serial = chrome.serial,
      connectionInfo,
      connectionPath = '',
      connectionId;

  vm.devices = [];

  function onGetDevices(ports) {
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
      // console.log(tempArr);
      if (!!tempArr[0] && !!tempArr[1]) {
        if (sync) {
          obj[tempArr[0]] = tempArr[1];
          if (Object.keys(obj).length === 24){
            // vm.serial = obj;
            // $scope.$apply();
            console.log(obj);
          }
        } else if (tempArr[0] === '0') {
          obj[tempArr[0]] = tempArr[1];
          sync = true;
        }
      } else {
        console.log('Dropped a Value??? ' + tempArr[0]);
      }
    }
  }

  function onReceiveErrorCallback(info) {
    console.log(info);
  }



  document.querySelector('body').onclick = function(){
    serial.setPaused(connectionId, true, function() {});
  };

  // Lists available serial devices and appends them to vm.devices and connects to the controller.
  serial.getDevices(onGetDevices);

  // Listen for data from controller.
  serial.onReceive.addListener(onRecieveCallback);

  // Listens for errors from data stream.
  serial.onReceiveError.addListener(onReceiveErrorCallback);
}
