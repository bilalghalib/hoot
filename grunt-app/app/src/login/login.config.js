(function () {

  'use strict';

  angular
    .module('app.login')
    .config(configuration);

  function configuration($stateProvider) {


    //add your state mappings here
    $stateProvider
      .state('login', {
          cache: false,
          url: '/login',
          templateUrl: 'src/login/loginview.html',
          controller: 'loginCtrl as vm'
        }
      );
  }

}());
