(function () {

  angular.module('app')

    .config(function ($ionicConfigProvider) {
      $ionicConfigProvider.views.swipeBackEnabled(false);
    });

})();
