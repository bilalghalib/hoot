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
        },
        logout: function(){
          return Restangular.one('users').one('logout').get();
        }
    };
    var hoot = {
        add: function (data){
          return Restangular.one('hoot').one().post('',data);
        }
    };

		return {
      auth:auth
		};

	}

}());
