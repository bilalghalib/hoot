(function () {

  angular.module('app')
    .run(run);

   function run ($ionicPlatform, $cordovaSplashscreen, $timeout) {
      // if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
      //   console.log('Running run function');
      //   $timeout(function () {
      //     console.log('Running hide timeout function');
      //     $ionicPlatform.ready(function () {
      //       try {
      //         $cordovaSplashscreen.hide();
      //         navigator.splashscreen.hide()
      //       }
      //       catch (e) {
      //         console.log(e);
      //       }
      //     });
      //   }, 5000);
      // }
      //
      // $ionicPlatform.ready(function() {
      //   // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      //   // for form inputs)
      //   if (window.cordova && window.cordova.plugins.Keyboard) {
      //     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(
      //       true);
      //   }
      //   if (window.StatusBar) {
      //     StatusBar.styleDefault();
      //   }
      // });
    }

})();
