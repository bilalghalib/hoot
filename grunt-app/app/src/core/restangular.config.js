/**
 * @ngdoc overview
 * @name app.core
 * @description Configuration block for restangular
 */

(function(){

  'use strict';

  angular.module('app.core')
    .config(configuration);

  /* @ngInject */
  function configuration(RestangularProvider){

    RestangularProvider.setBaseUrl('http://192.168.10.9:3000/api');
    // RestangularProvider.setBaseUrl('http://localhost:3000/api');

  }

}());
