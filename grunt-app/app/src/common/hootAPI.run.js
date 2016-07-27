(function () {

  angular
    .module('app.common')
    .run(hootRun);

  function hootRun() {

    var config = {
      apiKey: "AIzaSyBesnLApe5vUT_vNBfi0I3UTgcU0cyThnk",
      authDomain: "hoot-101a8.firebaseapp.com",
      databaseURL: "https://hoot-101a8.firebaseio.com",
      storageBucket: "hoot-101a8.appspot.com"
    };

    firebase.initializeApp(config);

  }

})();
