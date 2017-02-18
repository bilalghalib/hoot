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
    $rootScope.showSuccess = false;


    $rootScope.goto = function(name, recorder) {
      console.log(name);
      if(name == 'listenHoot'){
        $rootScope.PageChange = true;
        $rootScope.isListenHootPage = true;
        setTimeout(function () {
          $state.go(name);
        },500);
      }
      if(name == 'homepage'){
        $rootScope.PageChange = false;
        $state.go(name);
      }
      if(recorder)
       recorder.audioModel = null;
    };

    $rootScope.hootURL = function(id){
      return S3_BUCKET_ENDPOINT + id + '.wav';
    };
  }

}());

