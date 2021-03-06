angular
  .module('app')
  .controller('VisualizerController', VisualizerController);

VisualizerController.$inject = ['$rootScope','$scope', 'SERIAL'];

function VisualizerController($rootScope, $scope, SERIAL) {
  'use strict';

  var vm             = this,
      connectionPath = '',
      serialObject   = {},
      connectionInfo,
      connectionId;

  vm.devices = [];


  setInterval(function(){
    $rootScope.$broadcast('dataChanged');
  }, 5);

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


// {0: val, key: val, key: val, key: val, key: val, 24: val} 24sec
// {0: val, key: val, key: val, key: val, key: val, 24: val} 25sec
// {0: val, key: val, key: val, key: val, key: val, 24: val} 26sec
// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}

// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}
// {0: val, key: val, key: val, key: val, key: val, 24: val}

// {0: val, key: val, key: val, key: val, key: val, 24: val}


//chrome.storage = Json.stringify(data)

  function onRecieveCallback (arrayBuffer) {
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
            if (Object.keys(serialObject).length === 24) {
              // newArray.push(new data(datatimestamp,serialObject));
              // chrome.storage = Json.stringify(data)
              vm.data = d3.entries(serialObject);
              $rootScope.$broadcast('dataChanged');
              serialObject = {};
            }
          } else if (tempArr[0] === '0') {
            serialObject[tempArr[0]] = parseInt(tempArr[1], 16);
            sync = true;
          }
        } else {
          console.log('Dropped a Value/Out of Sync??? ' + parseInt(tempArr[0], 16));
        }
      }
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
