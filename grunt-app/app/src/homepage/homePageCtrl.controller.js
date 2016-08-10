/**
 * @ngdoc controller
 * @name app.homepage.controller:Loginctrl
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.homepage')
    .controller('homePageCtrl', homePageCtrl);

  /* @ngInject */
  function homePageCtrl($state, $cordovaGeolocation, $scope) {
    var vm = this;
    var media;
    var extension = null;

    //-------------- Declarations
    //-----Variables Declarations
    vm.loginData = {};
    vm.model = {};

    //-----Functions Declarations

    vm.getLatLong = getLatLong;
    vm.changeState = changeState;
    vm.signOut = signOut;
    /////////////////////

    /*

     ionic.Platform.ready(function() {
     if ($window.cordova) {
     console.log("onPhone");
     if (ionic.Platform.isAndroid()) {
     vm.model.path = cordova.file.externalRootDirectory;
     vm.model.src = "newHoot.mp3";
     console.log("on Droid");
     }
     if (ionic.Platform.isIOS()) {
     vm.model.path = cordova.file.cacheDirectory;
     vm.model.src = "newHoot.wav";
     console.log("on IOS");
     }
     var src = vm.model.src;
     console.log(src);
     vm.checkAndCreateFile();
     }
     //else if it is on a computer
     else {
     console.log("on:");
     var src = vm.model.src;
     console.log(src);
     console.log("src");
     vm.media = new Audio();
     vm.media.src = src;
     }

     function onSuccess() {
     console.log("duuude");
     }
     // onError Callback
     //

     function onError(error) {
     console.log("aww dude...");
     alert('code: ' + error.code + '\n' +
     'message: ' + error.message + '\n');
     }
     });*/

    vm.model = {
      src: "",
      path: "",
      hootimage: "images/preHoot.png",
      currentPlatform: ionic.Platform.platform(),
      showDelete: false,
      showMove: false
    };


    function getLatLong() {
      var isIOS = ionic.Platform.isIOS();
      var posOptions = {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
      };
      $cordovaGeolocation.getCurrentPosition(posOptions).then(
        function (position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          console.log("lat" + position.coords.latitude);
          console.log("long" + position.coords.longitude);
        }, function (err) {
          console.log("err");
        });
    }


    function changeState(name) {
      console.log(name);
      $state.go(name);
    }


    function signOut(name){
      console.log(firebase.auth().currentUser);
      firebase.auth().signOut().then(function() {
        console.log("Signed Out! ");
      }, function(error) {
        alert(error);
      });
      setTimeout(function(){
        vm.changeState(name);
      }, 1000)
    }

  }
}());
