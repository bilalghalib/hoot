(function(){

  'use strict';

  angular.module('app.core')
    .run(routingEvents);
  /* @ngInject */
  function routingEvents($rootScope, $ionicPlatform, $ionicSideMenuDelegate, $localStorage, Restangular){


    if ($localStorage.token) {
      Restangular.setDefaultHeaders({
        'x-access-token': $localStorage.token
      });
    }

    //on routing error
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
      //do some logging and toasting
    });

    //on routing error
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      //do some title setting
      $rootScope.pageTitle = toState.title || 'app';
      $rootScope.currentState = toState.name;
      console.log('-------------------------------------------------->',$rootScope.currentState);
    });
  }

}());
