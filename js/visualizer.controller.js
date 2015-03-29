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

  function onRecieveCallback (obj) {

    var parsedKVPArr = [];

    function serialToString(arrayBuffer) {
      var  u8view       = new Uint8Array(arrayBuffer),
           str          = '';

      for (var a = 0; a < u8view.length; a++) {
        str += String.fromCharCode(u8view[a]);
      }
      parsedKVPArr = str.replace(/(\r\n|\n|\r)/gm, ',').replace(/(\s)/g, '').split(',').slice(0, -1);
      // console.log(parsedKVPArr, str);
      return parsedKVPArr;
    }

    function serialToArr (arr, dataPoints) {
      var parsedArr    = [],
          parsedKVPArr = arr;
      for (var b = 0; b < dataPoints; b++) {
        parsedArr.push(parsedKVPArr[b]);
      }
      console.log(parsedArr);
      return parsedArr;
    }


    function serialStringToObj(arr) {
      var obj = {},
       arrLen = arr.length,
         temp;
      for (var i = 0; i < arrLen; i++) {
        temp = arr[i].split(':');
        obj[temp[0]] = temp[1];
      }
      console.log(obj);
      return obj;
    }

    serialStringToObj(serialToArr(serialToString(obj.data), 24));
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
  serial.onReceive.addListener(_.throttle(onRecieveCallback, 750));


  // Listens for errors from data stream. I think???
  // serial.onReceiveError.addListener(onReceiveErrorCallback);








}
