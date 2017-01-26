(function () {

  angular
    .module('app.common')
    .constant('FIREBASE_URI', 'https://hoot-101a8.firebaseio.com/')
    .constant('S3_BUCKET_ENDPOINT','https://s3.amazonaws.com/hoot-app-audio/');

})();
