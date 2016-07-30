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
	function homePageCtrl($state, $cordovaGeolocation, $cordovaMedia, $ionicLoading) {
    var vm = this;

    //-------------- Declarations
    //-----Variables Declarations
    vm.loginData = {};
    vm.model = {};

    //-----Functions Declarations

    vm.getLatLong = getLatLong;
    vm.changeState = changeState;
    vm.play = play;
    vm.record = record;
    vm.getMediaURL = getMediaURL;

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


     document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
        var src = getMediaURL("sounds/myrecording.amr");
        var media = new Media(src,
        function() {
            alert("recordAudio():Audio Success");
        },

        function(err) {
            alert("recordAudio():Audio Error: "+ err.code);
        });
    }



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
          var lat = position.coords.latitude
          var long = position.coords.longitude
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


    function play() {
      // vm.model.hootimage = "images/postHoot.png";
      console.log("In Play Function!");
      media.play();    
      // var iOSPlayOptions = {
      //   numberOfLoops: 2,
      //   playAudioWhenScreenIsLocked : false
      // }
      // media.stopRecord(); 
      // setTimeout(function(){
      //  media.play();     
      // }, 2000);

    }

    function record() {
      alert("Recording");
      media.startRecord();

      setTimeout(function(){
        media.stopRecord();
        alert("Now Playing");
      }, 3000);
     }   


    function getMediaURL(s) {
      var isAndroid = ionic.Platform.isAndroid();
      if (isAndroid) return "/android_asset/www/" + s;
      return s;
    }

  }
  }());
