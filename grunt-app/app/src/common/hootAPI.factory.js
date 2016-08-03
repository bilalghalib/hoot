(function () {


  angular
    .module('app.common')
    .factory('hootAPI', hoot);


  function hoot() {
    var hootAPI = {};

    hootAPI.createUser = function (email, password) {
      var user = firebase.auth().currentUser;
      if(!user){
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });

        if (user) {
          console.log("Currently Logged In: " + user.email);
        } else {
          console.log("Sign In: Null");
        }
      }
      else {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);

        });
        firebase.auth().onAuthStateChanged(function(user) {
          if (user !== null) {
            console.log('logged in!');
          }
        });
        console.log("Logged In As: " + user.email);
      }
      };

      hootAPI.storeAudio = function (url, blob, filename) {
        var file = new File([blob], "recording");
        var storageRef = firebase.storage().ref();
        console.log(url);
        console.log(blob);
        console.log(filename);
        var uploadTask = storageRef.child('audio/' + filename).put(file);

       uploadTask.on('state_changed', function(snapshot){
        }, function(error) {
        }, function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
        });
      };


    return hootAPI;
  }

})();
