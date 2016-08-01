(function(){

  'use strict';

  angular
    .module('app.homepage')
    .config(configuration);

  function configuration($stateProvider, recorderServiceProvider){
    //add your state mappings here
    $stateProvider
      .state('homepage', {
          url:'/homepage',
          templateUrl:'src/homepage/homepageview.html',
          controller: 'homePageCtrl as vm'
        }
      );
    recorderServiceProvider
      .forceSwf(false)
//      .setSwfUrl('/lib/recorder.wav')
      .withMp3Conversion(false);
  }

}());
