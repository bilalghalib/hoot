/**
 * Created by HP on 1/24/2017.
 */

(function () {

  'use strict';

  angular
    .module('app.listenHoot')
    .controller('listenHoot', listenHoot);

  /* @ngInject */
  function listenHoot(dataService, S3_BUCKET_ENDPOINT) {

    var vm = this;
    var currentIndex = 0;
    vm.previousHoot = previousHoot;
    vm.nextHoot = nextHoot;
    vm.hoots = [];
    vm.selectedHoot = null;


    dataService.hoot.getHoot().then(function (res) {
        if (res.success) {
          console.log('Hoot rec');
          vm.hoots = res.data;
          vm.selectedHoot = vm.hoots[currentIndex];
        }
      },
      function (err) {
        console.log(err);
      });


    function previousHoot() {
      console.log('prev');
      if (currentIndex >= 0) {
        vm.selectedHoot = vm.hoots[--currentIndex];
        console.log(currentIndex);
      }
    }

    function nextHoot() {
      console.log('next');
      if (currentIndex < vm.hoots.length) {
        vm.selectedHoot = vm.hoots[++currentIndex];
        console.log(currentIndex);
      }
    }
  }

}());


//     vm.getHoots = getHoots;
//
//
//     function listenHoot($state, dataService, $rootScope, $localStorage, Restangular) {
//
//         function getHoots() {
//             dataService.hoot.getHoot().then(function (res) {
//                     if (res.success) {
//                         console.log('Hoot rec');
//                         console.log(res.data);
//
//
//                         // getHoots = [];
//                         // vm.getHoots = [
//                         //   {path:'s3.amazonaws.com/hoot-app-audio/.wav'},
//                         //   {path:'s3.amazonaws.com/hoot-app-audio/.wav'}
//                         // ];
//                         //
//                         // // I want to add more images with this:
//                         // for(var i=0; i<5; i++) {
//                         //   vm.getHoots.push({
//                         //     path: 's3.amazonaws.com/hoot-app-audio'+[i]+'/.wav'
//                         //     path: 's3.amazonaws.com/hoot-app-audio/585ce73651ede42484c6e9da/.wav'
//                         //
//                         //
//                         //   });
//                         //   console.log("hoots received");
//                         // }
//
//
//                     }
//                 },
//                 function (err) {
//                     console.log(err);
//                 }
//             )
//         }
//     }

//         function vm.getHoots(){
//
//             dataService.auth.login(user).then(function(res){
//                     if(res.success){
//                         console.log('user found and go inside the app');
//                         console.log(res);
//
//                         $localStorage.token = res.data.token;
//                         Restangular.setDefaultHeaders({'x-access-token': res.data.token});
//                         setTimeout(function(){
//                             vm.changeState('homepage');
//                         },300)
//                     }
//
//                     else{
//                         console.log('user not found signup , login and then go inside the app');
//                         dataService.auth.signup(user).then(function(res){
//                             if(res.success){
//                                 dataService.auth.login(user).then(function(res){
//
//                                     },
//                                     function(err){
//
//                                     })
//                             }
//                         }, function(err){
//                             console.log(err);
//                         });
//                     }
//                 },
//                 function(err){
//
//                 });
//
//         }
//
//     }
//
//
// }());




