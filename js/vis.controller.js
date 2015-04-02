angular.module('app')
  .controller('MainCtrl', function(){
    var vm = this;

    vm.greeting = 'Resize the page to see the re-rendering';
    vm.data = _.map({
            0:1,
            1:1,
            2:1,
            3:1,
            4:145,
            5:156,
            6:213,
            7:200,
            8:123,
            9:123,
            a:123,
            b:123,
            c:50,
            d:50,
            e:50,
            f:50,
            10:20,
            11:20,
            12:20,
            13:20,
            14:10,
            15:10,
            16:10,
            17:10
          });
  });