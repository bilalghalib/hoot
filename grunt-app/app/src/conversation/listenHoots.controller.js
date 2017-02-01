/**
 * Created by HP on 1/24/2017.
 */

(function () {

  'use strict';

  angular
    .module('app.listenHoot')
    .controller('listenHoot', listenHoot);

  /* @ngInject */
  function listenHoot(dataService, S3_BUCKET_ENDPOINT, r_getHoots, $ionicScrollDelegate) {

    var vm = this;
    var currentIndex = 0;
    var currentRoomID;
    vm.previousHoot = previousHoot;
    vm.nextHoot = nextHoot;
    vm.hoots = [];
    vm.selectedHoot = null;
    vm.isNotTapable = false;
    vm.hoots = r_getHoots.data;
    vm.startChat = startChat;
    vm.reply = reply;
    

    console.log(vm.hoots);


    function startChat(recorder){
      console.log("yeh dekho");
      console.log("this");
      // recorder.audioModel = {};
      $ionicScrollDelegate.$getByHandle('view-scroll').scrollTop(true);
      dataService.chat.getRoom(vm.hoots[currentIndex].user).then(
          function(res){
            console.log(res.data);
            currentRoomID = res.data._id;
            recorder.startRecord();

          },
          function(err){
          console.log(err);
          }
      )
    };
    
    function reply(recorder){

      console.log(vm.hoots[currentIndex]);
      var data = {
        hootid: vm.hoots[currentIndex]._id,
        userid: vm.hoots[currentIndex].user
      };

console.log("yeh bhi le lo");
      recorder.save("reply", data, currentRoomID);
     console.log(recorder.audioModel);

      
    };

    function previousHoot() {
       currentIndex--;
      console.log(currentIndex);
      console.log('prev');
      if (currentIndex >= 0) {
        vm.selectedHoot = vm.hoots[currentIndex];
      }
      };

    function nextHoot() {
      dataService.hoot.hootRead(vm.hoots[currentIndex]._id).then(function (res) {
          console.log(res.data);
          console.log('Hoot Read');},
        function (err) {
          console.log(err);
        })
      currentIndex++;
      console.log(currentIndex);
      console.log('next');
      if (currentIndex < vm.hoots.length) {
        vm.selectedHoot = vm.hoots[currentIndex];
      }
      else {
        vm.isNotTapable = true;
        console.log("Else");
        dataService.hoot.getHoot().then(function (res) {
            vm.hoots = vm.hoots.concat(res.data);
            vm.isNotTapable = false;
            console.log(vm.hoots.length);
          },
          function (err) {
            vm.isNotTapable = false;
            console.log(err);
          });
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




