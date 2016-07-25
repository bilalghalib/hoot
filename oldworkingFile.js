var app = angular.module('hoot', ['ionic', 'ngCordova']);
app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(
                true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
app.controller('HootCtrl', function($scope, $cordovaFile, $window,
    $cordovaFileTransfer, $cordovaMedia, $cordovaGeolocation) {
    ionic.Platform.ready(function() {
        if ($window.cordova) {
            console.log("onPhone");
            if (ionic.Platform.isAndroid()) {
                $scope.model.path = cordova.file.externalRootDirectory;
                $scope.model.src = "recordede.mp3";
                console.log("on Droid");
            }
            if (ionic.Platform.isIOS()) {
                $scope.model.path = cordova.file.cacheDirectory;
                $scope.model.src = "recordede.wav";
                console.log("on IOS");
            }
            var src = $scope.model.src;
            console.log(src);
            $scope.checkAndCreateFile();
        }
        //else if it is on a computer
        else {
            console.log("on:");
            var src = $scope.model.src;
            console.log(src);
            console.log("src");
            $scope.media = new Audio();
            $scope.media.src = src;
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
    $scope.model = {
        src: "",
        path: "",
        hootimage: "/img/preHoot.png",
        currentPlatform: ionic.Platform.platform(),
        showDelete: false,
        showMove: false,
    };
    //check and create file if necessary:
    $scope.checkAndCreateFile = function() {
            var fileSRC = $scope.model.src + $scope.model.path;
            console.log("create file here " + fileSRC);
            if (ionic.Platform.isIOS()) {
           $cordovaFile.createFile($scope.model.path, $scope.model.src, true)
              .then(function (success) {
                // success
              }, function (error) {
                // error
              });
            }

            $scope.media = new Media(fileSRC, function() {}, function(err) {});
        }
        //fileupload code
    $scope.fileUpload = function() {
        // Destination URL
        var url =
            "http://bilalghalib.com:3000/api/containers/container1/upload";
        var targetPath = $scope.model.path + $scope.model.src;
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
    $scope.stopRecordingAndUpload = function(sound) {
        $scope.model.hootimage = "/img/postHoot.png";
        console.log("stopRecordingAndUpload");
        $scope.media.stopRecord();
        $cordovaFile.checkFile($scope.model.path, $scope.model.src)
            .then(function(success) {
                console.log("Found you!");
                console.log($scope.media.src);
                //$scope.media.play();
                $scope.fileUpload();
            }, function(error) {
                console.log("Can't find file in path :" +
                    $scope.model.path);
                console.log("and file :" + $scope.model.src);
            });
        $scope.media.play();
    }
    $scope.record = function(sound) {
        console.log("record");
        $scope.media.startRecord();

    if (ionic.Platform.isAndroid()) {
        $cordovaFile.checkFile($scope.model.path, $scope.model.src)
            .then(function(success) {
                console.log("Don't need you!");
                $cordovaFile.removeFile($scope.model.path,
                    $scope.model.src).then(function(success) {
                    console.log("Deleted!");
                }, function(error) {
                    console.log("can't be Deleted!");
                });
            }, function(error) {
                console.log("no file");
            });
          }

    }
    $scope.downloadFile = function(Filename) {
            var fileTransfer = new FileTransfer();
            var url = encodeURI(
                "http://bilalghalib.com:3000/api/containers/container1/download/1455780326190recordede.mp3"
            );
            var filename = url.split("/").pop();
            // Save location
            var targetPath = $scope.model.path + filename;
            console.log("it's it");
            console.log("IOS PATH!" + $scope.model.path);
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
    $scope.getLatLong = function() {
        isIOS = ionic.Platform.isIOS();
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
});
app.directive('map', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var zValue = scope.$eval(attrs.zoom);
            var lat = scope.$eval(attrs.lat);
            var lng = scope.$eval(attrs.lng);
            var myLatlng = new google.maps.LatLng(lat, lng),
                mapOptions = {
                    zoom: zValue,
                    center: myLatlng
                },
                map = new google.maps.Map(element[0], mapOptions),
                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    draggable: true
                });
        }
    };
});
