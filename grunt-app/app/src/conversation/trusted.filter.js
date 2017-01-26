/**
 * @ngdoc filter
 * @name app.conversation.filer:trusted
 * @description < description placeholder >
 * @param {object} input object to be filtered
 * @returns {object} < returns placeholder >
 */

(function(){

  'use strict';

  angular
    .module('app')
  .filter('trusted', ['$sce',
    /* @ngInject */
    function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);

}());
