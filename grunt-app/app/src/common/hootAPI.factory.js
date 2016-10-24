(function () {


  angular
    .module('app.common')
    .factory('hootAPI', hoot);


  function hoot($rootScope, dataService) {
    var hootAPI = {};
    hootAPI.userID = "";

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
        });
    };


    hootAPI.getAudio = function(){
      console.log(userID);
      console.log(JSON.stringify(userId));
      };

    return hootAPI;
  }
})();
