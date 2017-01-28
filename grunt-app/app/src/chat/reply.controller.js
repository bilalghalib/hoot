/**
 * @ngdoc controller
 * @name app.chat.controller:Reply
 * @description < description placeholder >
 */

(function(){

  'use strict';

	angular
		.module('app.chat')
		.controller('Reply', Reply);

  /* @ngInject */
	function Reply(){
		var vm = this;

		vm.testFunction = testFunction;

    /////////////////////

    /**
     * @ngdoc method
     * @name testFunction
     * @param {number} num number is the number of the number
     * @methodOf app.chat.controller:Reply
     * @description
     * My Description rules
     */
    function testFunction(num){
			console.info('This is a test function');
		}
	}

}());
