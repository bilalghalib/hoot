/**
 * @ngdoc controller
 * @name app.homepage.controller:Loginctrl
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.homepage', [])
    .controller('homePageCtrl', homePageCtrl);

  /* @ngInject */
  function homePageCtrl($state, dataService) {
    var vm = this;
    var media;
    var extension = null;


    //-------------- Declarations
    //-----Variables Declarations
    vm.loginData = {};
    vm.model = {};

    //-----Functions Declarations

    // vm.getLatLong = getLatLong;

    vm.changeState = changeState;
    vm.signOut = signOut;
    vm.getHoots = getHoots;
    vm.uploadHoot = uploadHoot;



    // vm.addHoot = addHoot;


    // vm.test1 = function(rightSwipe){
    //   console.log("I am right swipe");
    //   // console.log(recorder);
    // };

    vm.test1 = function( ){

        console.log("I am right tap");

    };

    vm.test2 = function( ){

        console.log("I am left tap");

    };

     function uploadHoot () {

      if (control.playbackResume === true){
        console.log("abcadad");
      }

    };
    
    function getHoots(){
      dataService.hoot.getHoot().then(function(res){
            if(res.success){
              console.log('Hoot rec');
              console.log(res.data);

              vm.changeState('listenHoot');


              // getHoots = [];
              // vm.getHoots = [
              //   {path:'s3.amazonaws.com/hoot-app-audio/.wav'},
              //   {path:'s3.amazonaws.com/hoot-app-audio/.wav'}
              // ];
              //
              // // I want to add more images with this:
              // for(var i=0; i<5; i++) {
              //   vm.getHoots.push({
              //     path: 's3.amazonaws.com/hoot-app-audio'+[i]+'/.wav'
              //     path: 's3.amazonaws.com/hoot-app-audio/585ce73651ede42484c6e9da/.wav'
              //
              //
              //   });
              //   console.log("hoots received");
              // }


            }
          },
          function(err){
            console.log(err);
          }
      )
    };

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


    // function getLatLong() {
    //   var isIOS = ionic.Platform.isIOS();
    //   var posOptions = {
    //     maximumAge: 3000,
    //     timeout: 5000,
    //     enableHighAccuracy: true
    //   };
    //   $cordovaGeolocation.getCurrentPosition(posOptions).then(
    //     function (position) {
    //       var lat = position.coords.latitude;
    //       var long = position.coords.longitude;
    //       console.log("lat" + position.coords.latitude);
    //       console.log("long" + position.coords.longitude);
    //     }, function (err) {
    //       console.log("err");
    //     });
    // }


    function changeState(name) {
      console.log(name);
      $state.go(name);
    }


    function signOut(name){
      dataService.auth.logout().then(function(res){
      if(res.success){
        console.log('Logging Out');
        console.log(res);
        }
      },
      function(err){
        console.log(err);
      });

      // setTimeout(function(){
      //   vm.changeState(name);
      // }, 1000)
    }

  }
} ());
