/**
 * @ngdoc overview
 * @name app.core
 * @description Configuration block for routing
 */

(function () {

  'use strict';

  angular.module('app.core')
    .config(configuration)
    .run(routingEvents);


  /* @ngInject */
  function configuration($urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
  }

  function routingEvents($rootScope, $ionicLoading,$state, $ionicHistory, $ionicPopup) {
    //on routing error
    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
      //do some logging and toasting
      console.log('not Found');
      $ionicPopup.alert({
        title: 'Network Error',
        template: '<h5>Try Again after connecting</h5>'
      });
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      //do some logging and toasting
      console.log("State Change Fail ------------------------------------------###");
      console.log(error);

      $rootScope.viewEntered = false;

      switch (error.status){
        case 403:
          console.log('hit');
          //$ionicHistory.goBack();
          //$rootScope.showLogin();
          break;

        case -1:
          $state.go('AboutUs');
          $ionicPopup.alert({
            title: 'Network Error',
            template: '<h5>Try Again after connecting</h5>'
          });
          break;
      }
    });

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
      console.log($rootScope.viewEntered);
      //do some title setting
      $rootScope.pageTitle = toState.title || 'LAUNCH Summit on Entaj';
      console.log('------------------------------------------------>>>');
      console.log('lodaing from', fromState.name);

    });

    //on routing error
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      //do some title setting
      $rootScope.viewEntered = true;
      console.log($rootScope.viewEntered);
      console.log('<<<------------------------------------------------');
      console.log('lodaing done to', toState.name);
      $rootScope.pageTitle = toState.title || 'Hoot App - Give A Hoot, Take A Hoot';
    });

  }


}());
