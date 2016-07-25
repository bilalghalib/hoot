/**
 * @ngdoc controller
 * @name app.login.controller:Loginctrl
 * @description < description placeholder >
 */

(function(){

  'use strict';

	angular
		.module('app.login')
		.controller('homePageCtrl', Loginctrl);

  /* @ngInject */
	function Loginctrl($state,$ionicScrollDelegate, $cordovaFile, $window,
                     $cordovaFileTransfer, $cordovaMedia, $cordovaGeolocation) {
    var vm = this;

    //-------------- Declarations
    //-----Variables Declarations
    vm.loginData = {};
    vm.model = {};

    //-----Functions Declarations

    vm.checkAndCreateFile = checkAndCreateFile;
    vm.fileUpload = fileUpload;
    vm.downloadFile = downloadFile;
    vm.removeOldFiles = removeOldFiles;
    vm.record = record;
    vm.stopRecordingAndUpload = stopRecordingAndUpload;
    vm.getLatLong = getLatLong;

    /////////////////////

    /**
     * @ngdoc method
     * @name testFunction
     * @param {number} num number is the number of the number
     * @methodOf app.login.controller:Loginctrl
     * @description
     * My Description rules
     */


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
    });
    vm.model = {
      src: "",
      path: "",
      hootimage: "/images/preHoot.png",
      currentPlatform: ionic.Platform.platform(),
      showDelete: false,
      showMove: false
    };
    //check and create file if necessary:
    function checkAndCreateFile() {
      var fileSRC = vm.model.src + vm.model.path;
      console.log("create file here " + fileSRC);

      $cordovaFile.createFile(vm.model.path, vm.model.src, true)
        .then(function (success) {
          // success
        }, function (error) {
          // error
        });

      vm.media = new Media(fileSRC, function() {}, function(err) {});
    }

    //fileupload code
    function fileUpload() {
      // Destination URL
      var url =
        "http://bilalghalib.com:3000/api/containers/container1/upload";
      var targetPath = vm.model.path + vm.model.src;
      console.log("Made it to upload:");
      //File for Upload
      var unixTimestamp = Date.now();
      console.log(targetPath);
      // File name only
      var filename = targetPath.split("/").pop();
      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = unixTimestamp + filename;
      options.mimeType = "audio/mpeg3";
      options.headers = {
        Connection: "close"
      }
      options.chunkedMode = false;
      console.log("so close");
      console.log(filename.type);
      $cordovaFileTransfer.upload(url, targetPath, options).then(
        function(result) {
          console.log("SUCCESS: " + JSON.stringify(result
              .response));
        }, function(err) {
          console.log("ERROR: " + JSON.stringify(err));
        }, function(progress) {
          // PROGRESS HANDLING GOES HERE
        });
    }

    function stopRecordingAndUpload() {
      vm.model.hootimage = "/images/postHoot.png";
      console.log("stopRecordingAndUpload");
      vm.media.stopRecord();
      $cordovaFile.checkFile(vm.model.path, vm.model.src)
        .then(function(success) {
          console.log("Found you!");
          console.log(vm.media.src);
          vm.media.play();
          vm.fileUpload();
        }, function(error) {
          console.log("Can't find file in path :" +
            vm.model.path);
          console.log("and file :" + vm.model.src);
        });
      //vm.media.play();
    }

    function record() {
      console.log("record");

      vm.media.startRecord();
    }

    function removeOldFiles() {
      $cordovaFile.checkFile(vm.model.path, vm.model.src)
        .then(function(success) {
          console.log("Don't need you!");
          $cordovaFile.removeFile(vm.model.path,
            vm.model.src).then(function(success) {
            console.log("Deleted!");
          }, function(error) {
            console.log("can't be Deleted!");
          });
        }, function(error) {
          console.log("no file");
        });
    }

    function downloadFile() {
      var targetPath = cordova.file.dataDirectory + '1455780326190recordede.mp3';
      console.log("path for data: "+ cordova.file.dataDirectory);
      vm.downloaded_media =
        new Media(
          targetPath,
          function() {},
          function(
            err
          ) {});
      // Play audio
      vm.downloaded_media.play();

      var fileTransfer = new FileTransfer();
      var url = encodeURI(
        "http://bilalghalib.com:3000/api/containers/container1/download/1455780326190recordede.mp3"
      );
      var filename = url.split("/").pop();
      // Save location
      var targetPath = vm.model.path + filename;
      console.log("it's it");
      console.log("IOS PATH!" + vm.model.path);
      $cordovaFileTransfer.download(url, targetPath, {}, true).then(
        function(result) {
          console.log('Successfully downloaded');

          // Play audio
        }, function(err) {
          console.log("ERROR: " + JSON.stringify(err));
        }, function(progress) {
          // PROGRESS HANDLING GOES HERE
        });
    } //End DownloadFile


    function getLatLong() {
      var isIOS = ionic.Platform.isIOS();
      var posOptions = {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
      };
      $cordovaGeolocation.getCurrentPosition(posOptions).then(
        function(position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          console.log("lat" + position.coords.latitude);
          console.log("long" + position.coords.longitude);
        }, function(err) {
          console.log("err");
        });
    }


  }
  }());
