/**
 * Created by HP on 1/24/2017.
 */

(function () {

  'use strict';

  angular
    .module('app.listenHoot')
    .controller('listenHoot', listenHoot);

  /* @ngInject */
  function listenHoot(dataService, S3_BUCKET_ENDPOINT, r_getHoots, $ionicScrollDelegate, $rootScope) {
    $rootScope.isRecording = false;
    (function() {
      $('img').removeClass('animated');
    }());

    setTimeout(function () {
      $('img').removeClass('zoomedOutSky');
      $('img').addClass('animated');
    },1000);

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
    $rootScope.showSuccess = false;
    console.log(vm.hoots);

    vm.stopRecord = stopRecord;



    function stopRecord(recorder) {
      recorder.stopRecord();
      vm.isNotTapable = false;
    }

    function startChat(recorder) {
      vm.isNotTapable = true;
      $rootScope.isRecording = true;
      var play = document.getElementById('audio-tag');
      console.log(play);
      setTimeout(function(){
        play.src = "";
      },300);
      console.log("reply recording shuru");

      recorder.audioModel = null;
      $ionicScrollDelegate.$getByHandle('view-scroll').scrollTop(true);
      dataService.chat.getRoom(vm.hoots[currentIndex].user).then(
        function (res) {
          console.log(res);
          currentRoomID = res.data._id;
          recorder.startRecord();

        },
        function (err) {
          console.log(err);
        }
      )
    };

    function reply(recorder) {

      console.log(vm.hoots[currentIndex]);
      var data = {
        hootid: vm.hoots[currentIndex]._id,
        userid: vm.hoots[currentIndex].user
      };

      console.log("reply successfull");
      recorder.save("reply", data, currentRoomID);
      recorder.audioModel = null;
      console.log(recorder.audioModel);


    };

    function previousHoot() {
      currentIndex--;
      console.log(currentIndex);
      console.log('prev hoot hai');
      if (currentIndex >= 0) {
        vm.selectedHoot = vm.hoots[currentIndex];
      }
    };

    function nextHoot() {
      var play = document.getElementById('audio-tag');
      play.src = "";
      dataService.hoot.hootRead(vm.hoots[currentIndex]._id).then(function (res) {
          console.log(res.data);
          console.log('next hoot hai');

        },
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






