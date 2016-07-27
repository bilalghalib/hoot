(function () {

  angular.module('app')
    .config(configuration);



  function configuration ($ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
  };

})();
