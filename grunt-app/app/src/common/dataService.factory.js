/**
 * @ngdoc service
 * @name app.common.dataService
 * @description < description placeholder >
 */

(function(){

  'use strict';

	angular
		.module('app.common')
		.factory('dataService', dataService);

  /* @ngInject */
  function dataService(Restangular){
    var auth = {
        login: function (user) {
          return Restangular.one('users').one('login').post('',user);
        },
        signup: function (user) {
            return Restangular.one('users').one('register').post('',user);
        }
    };





		return {
      auth:auth
		};

	}

}());
