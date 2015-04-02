angular
  .module('app')
  .controller('VisualizerController', VisualizerController);

VisualizerController.$inject = ['$scope', 'SERIAL'];

function VisualizerController($scope, SERIAL) {
  'use strict';

  var vm             = this,
      connectionPath = '',
      connectionInfo,
      connectionId;

  vm.devices = [];

  // Lists available serial devices and appends them to vm.devices and connects to the device.
  SERIAL.getDevices(onGetDevices);

  // Listen for data from device.
  SERIAL.onReceive.addListener(onRecieveCallback);

  // Listens for errors from data stream.
  SERIAL.onReceiveError.addListener(onReceiveErrorCallback);

  // Pauses & unpauses the data stream.
  document.querySelector('body').onclick = pauser;





  function onGetDevices(ports) {
    for (var i = 0; i < ports.length; i++) {
      vm.devices.push(ports[i].path);
    }
    connectionPath = vm.connectionPath = vm.devices[5];
    SERIAL.connect(connectionPath, {receiveTimeout: 3000}, onConnect);
    $scope.$apply();
  }

  function onConnect(info) {
    // The serial port has been opened. Save its id to use later.
    connectionId = vm.id = info.connectionId;
    connectionInfo = vm.connectionInfo = info;
  }

  var serialObject = {};

  function onRecieveCallback (arrayBuffer) {
    // _.delay(function () {
      var  u8view       = new Uint8Array(arrayBuffer.data),
           parsedKVPArr = [],
           str          = '',
           sync         = false;

      // Convert ArrayBuffer to a string then an Array.
      str = String.fromCharCode.apply(null, u8view);

      parsedKVPArr = str.replace(/(\r\n|\n|\r)/gm, ',').replace(/(\s)/g, '').split(',').slice(0, -1);

      // Convert Parsed Array into an obj with 24 values starting from 0

      for (var c = 0; c < parsedKVPArr.length; c++) {
        var tempArr = parsedKVPArr[c].split(':');

        if (!!tempArr[0] && !!tempArr[1]) {
          if (sync) {
            serialObject[tempArr[0]] = parseInt(tempArr[1], 16);
            if (Object.keys(serialObject).length === 24){
                vm.serial = serialObject;
                serialObject = {};
                $scope.$apply();
            }
          } else if (tempArr[0] === '0') {
            serialObject[tempArr[0]] = parseInt(tempArr[1], 16);
            sync = true;
          }
        } else {
          console.log('Dropped a Value/Out of Sync??? ' + parseInt(tempArr[0], 16));
        }
      }
    // }, 100);
  }

  function onReceiveErrorCallback(info) {
    console.log(info);
  }

  function pauser () {
    if (connectionInfo.paused) {
      SERIAL.setPaused(connectionId, false, function(){});
      connectionInfo.paused = vm.connectionInfo.paused = false;
    } else {
      SERIAL.setPaused(connectionId, true, function(){console.log('Paused');});
      connectionInfo.paused = vm.connectionInfo.paused = true;
    }
    $scope.$apply();
  }

}
