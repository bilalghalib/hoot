/**
 * @ngdoc overview
 * @name app.common
 * @description Host of all the cross cutting source
 */

(function(){

  'use strict';

  angular.module('app.common', [

  ])
    .run(run);

  /* @ngInject */
  function run($rootScope, $state, S3_BUCKET_ENDPOINT){
    $rootScope.goto = function(name) {
      
      console.log(name);
      $state.go(name);

    };

    $rootScope.hootURL = function(id){
      return S3_BUCKET_ENDPOINT + id + '.wav';
    };
  }

}());

