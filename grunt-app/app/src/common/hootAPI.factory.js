(function () {


  angular
    .module('app.common')
    .factory('hootAPI', hoot);


  function hoot() {
    var hootAPI = {};
    var userID = "0123456789";


    hootAPI.createUser = function (email, password) {
      userID = password;
      var user = firebase.auth().currentUser;
      if(!user){
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
          alert("User Created!!");
          firebase.database().ref('users/').update(
            user: userID);  
        })
        .catch(function (error) {
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


    hootAPI.storeAudio = function (blob, url,  filename) {
        var base64;
        console.log(blob);
        console.log(url);

        function getFileContentAsBase64(path,callback){
            window.resolveLocalFileSystemURL(path, gotFile, fail);

            function fail(e) {
                  alert('Cannot found requested file');
            }

            function gotFile(fileEntry) {
             fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                     var content = this.result;
                     callback(content);
                };
                // The most important point, use the readAsDatURL Method from the file plugin
                reader.readAsDataURL(file);
             });
          }
        }
        getFileContentAsBase64(url,function(base64Audio){
        //window.open(base64Image);
          console.log(base64Audio);
          base64 = base64Audio;
        // Then you'll be able to handle the myimage.png file as base64
        });
        setTimeout(function(){
          alert(base64);
          firebase.database().ref('audio/' + userID).push(base64);
        }, 1000);
    };


    hootAPI.getAudio = function(){
      console.log(userID);
      var userId = firebase.auth().currentUser.uid;

      firebase.database().ref('users/').once('value').then(function(snapshot) {
          var i = 0;
          snapshot.forEach(function() {
            alert(i++);
          });   
        )

        
      });
    };


    return hootAPI;
  }
})();
