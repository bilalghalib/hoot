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

    vm.email = "test@test.com";
    vm.password = "ThisisKeWeL32";

    /** Function Declaration **/
    vm.changeState = changeState;
    vm.createUser = createUser;


    /** Function Definitions**/
    function changeState(name) {
      console.log(name);
      $state.go(name);
    }

    function createUser() {
      hootAPI.createUser(vm.email, vm.password);
    }

  }


}());
