/**
 * @ngdoc overview
 * @name app.core
 * @description Configuration block for routing
 */

(function(){

  'use strict';

  angular.module('app.core')
    .config(configuration);

  /* @ngInject */
  function configuration($urlRouterProvider)
  {
    $urlRouterProvider.otherwise('/login');
  }


}());
