(function(){

  'use strict';

  angular
    .module('app.login')
    .config(configuration);

  function configuration($stateProvider){
    //add your state mappings here
    $stateProvider
      .state('homepage', {
          url:'/homepage',
          templateUrl:'src/homepage/homepageview.html',
          controller: 'homePageCtrl as vm'
        }
      );
  }

}());
