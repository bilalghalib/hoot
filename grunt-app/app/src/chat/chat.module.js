/**
 * @ngdoc overview
 * @name app.chat
 * @description < description placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app.chat', [])
    .config(configuration);

  /* @ngInject */
  function configuration($stateProvider){
    $stateProvider
     .state('reply', {
       url:'/reply',
       templateUrl:'src/chat/reply.html',
       controller: 'Reply as vm'
     }
    );
  }

}());
