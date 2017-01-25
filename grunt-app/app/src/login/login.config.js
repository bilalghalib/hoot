(function () {

  'use strict';

  angular
    .module('app.login')
    .config(configuration);

  function configuration($stateProvider) {
    console.log('fuck2');

    //add your state mappings here
    $stateProvider
      .state('login', {
          url: '/login',
          templateUrl: 'src/login/loginview.html',
          controller: 'loginCtrl as vm'
        }
      );
    $stateProvider
      .state('homepage', {
        cache: false,
        url: '/homepage',
        templateUrl: 'src/homepage/homepageview.html',
        /*controller: 'homePageCtrl as vm'*/
      });
  }

}());
