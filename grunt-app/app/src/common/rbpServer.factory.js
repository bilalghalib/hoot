/**
 * @ngdoc service
 * @name app.common.rbpServer
 * @description < description placeholder >
 */

(function () {

  'use strict';

  angular
    .module('app.common')
    .factory('rbpServer', rbpServer);

  /* @ngInject */
  function rbpServer($http) {
    var baseUrl = 'http://192.168.16.1:8080/api/';

    return {
      getWifi: getWifi,
      setWifi: setWifi,
      checkviv: checkviv,
      checkstatus : checkstatus
    };

    function getWifi() {
      return $http({
        method: 'GET',
        url: baseUrl + 'scan'
      })
    }

    function setWifi(data) {
      return $http({
        method: 'POST',
        data : data,
        url: baseUrl + 'connect'
      })
    }
    
    function checkviv(){
      return $http({
        method: 'GET',
        url: baseUrl
      })
    }

    function  checkstatus() {
      return $http({
        method: 'GET',
        url: baseUrl + 'status'
      })
    }

  }

}());
