/**
 * Created by HP on 1/24/2017.
 */
(function () {

    'use strict';

    angular
        .module('app.listenHoot')
        .config(configuration);

    function configuration($stateProvider) {
        //add your state mappings here
        $stateProvider
            .state('listenHoot', {
                url: '/listenHoot',
                templateUrl: 'src/conversation/listenHoots.html',
                controller: 'listenHoot as vm',
              resolve: {
               r_getHoots: function (dataService){
                 return dataService.hoot.getHoot();
               } 
              }
            });
    }
}());
