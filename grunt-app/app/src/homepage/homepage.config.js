(function() {
    console.log('fuck');
    'use strict';

    angular
        .module('app.homepage')
        .config(configuration);

    function configuration($stateProvider) {
        console.log('fuck3');

        //add your state mappings here
        $stateProvider
          .state('homepage', {
              url: '/homepage',
              templateUrl: 'src/homepage/homepageview.html',
              controller: 'homePageCtrl as vm'
          });
    }

}());
