(function () {

  angular.module('app')
    .config(configuration);



  function configuration ($ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.views.transition('none');

  };

})();
