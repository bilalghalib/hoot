(function(){

  'use strict';

  angular
    .module('app.login')
    .controller('loginCtrl', loginCtrl);


  function loginCtrl($state, hootAPI) {


    // var FirebaseTokenGenerator = require("firebase-token-generator");
    // var tokenGenerator = new FirebaseTokenGenerator("<YOUR_FIREBASE_SECRET>");
    // var token = tokenGenerator.createToken({ uid: "uniqueId1", some: "arbitrary", data: "here" });


    var vm = this;

    vm.email = "00.00.00.00.00.00@hoot.com";
    vm.email = "test@hoot.com";
    vm.password = "testingtestingtesting";

    /** Function Declaration **/
    vm.changeState = changeState;
    vm.createUser = createUser;


    /** Function Definitions**/
    function changeState(name) {
      console.log(name);
      $state.go(name);
    }

    function createUser() {
      window.MacAddress.getMacAddress(
        function(macAddress) {
          //alert(macAddress);
          vm.email = macAddress + "@hoot.com";
          var str = vm.email;
          vm.email = str.replace(/:/g, ".");
          // alert(vm.email);
          vm.password = macAddress;
          // alert(vm.password);
        },
        function(fail) {
          alert(fail);
        }
      );
      hootAPI.createUser(vm.email, vm.password);
      firebase.auth().onAuthStateChanged(function(user) {
        if (user !== null) {
          console.log('Weloome!');
          changeState('homepage');
        }
      });

    }

  }


}());
