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

    return hootAPI;
  }

})();
