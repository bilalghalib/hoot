(function(){

  'use strict';

  angular
    .module('app.login')
    .controller('loginCtrl', loginCtrl);


  function loginCtrl($state, dataService, $rootScope, $localStorage, Restangular) {


    // var FirebaseTokenGenerator = require("firebase-token-generator");
    // var tokenGenerator = new FirebaseTokenGenerator("<YOUR_FIREBASE_SECRET>");
    // var token = tokenGenerator.createToken({ uid: "uniqueId1", some: "arbitrary", data: "here" });


    var vm = this;

    var email = "11.00.00.0c.aa.00@hoot.com";
    // var email = "test@hoot.com";
    var password = "testingtestingtesting";

    var user = {
      username : email,
      password : password
    };

    /** Function Declaration **/
    vm.changeState = changeState;
    vm.createUser = createUser;


    /** Function Definitions**/
    function changeState(name) {
      console.log(name);
      $state.go(name);
    }

    function createUser() {
      // window.MacAddress.getMacAddress(
      //   function(macAddress) {
      //     //alert(macAddress);
      //     vm.email = macAddress + "@hoot.com";
      //     var str = vm.email;
      //     vm.email = str.replace(/:/g, ".");
      //     // alert(vm.email);
      //     vm.password = macAddress;
      //     // alert(vm.password);
      //   },
      //   function(fail) {
      //     alert(fail);
      //   }
      // );
      // hootAPI.createUser(vm.email, vm.password);
      dataService.auth.login(user).then(function(res){
        if(res.success){
          console.log('user found and go inside the app');
          console.log(res);

          $localStorage.token = res.data.token;
          Restangular.setDefaultHeaders({'x-access-token': res.data.token});
          setTimeout(function(){
            vm.changeState('homepage');
          },300)
        }

        else{
          console.log('user not found signup , login and then go inside the app');
          dataService.auth.signup(user).then(function(res){
            if(res.success){
              dataService.auth.login(user).then(function(res){

              },
              function(err){

              })
            }
          }, function(err){
            console.log(err);
          });
        }
      },
      function(err){

      });

      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user !== null) {
      //     console.log('Weloome!');
      //     changeState('homepage');
      //   }
      // });
    }

  }


}());
