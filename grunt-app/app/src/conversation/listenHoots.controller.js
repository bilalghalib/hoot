/**
 * Created by HP on 1/24/2017.
 */

(function () {

  'use strict';

  angular
    .module('app.listenHoot')
    .controller('listenHoot', listenHoot);

  /* @ngInject */
  function listenHoot(dataService, S3_BUCKET_ENDPOINT, r_getHoots, $ionicScrollDelegate, $rootScope, $scope) {
    $rootScope.isRecording = false;
    (function () {
      $('img').removeClass('animated');
    }());

    setTimeout(function () {
      $('img').removeClass('zoomedOutSky');
      $('img').addClass('animated');
    }, 1000);
    var play = document.getElementById('audio-tag');


    var vm = this;
    var currentIndex = 0;
    var currentRoomID;
    vm.isPlaying = false;
    vm.isPaused = true;
    vm.previousHoot = previousHoot;
    vm.nextHoot = nextHoot;
    vm.hoots = [];
    vm.selectedHoot = null;
    vm.isNotTapable = false;
    vm.isHootChanged = false;
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
      setTimeout(function () {
        play.src = "";
      }, 200);
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
      if (vm.isNotTapable) {
        console.log("Inside Reply Function");
        return;
      }
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
      vm.isPlaying = true;
      vm.isHootChanged = false;
      setTimeout(function () {
        vm.isHootChanged = true;
        $scope.$apply();
        if (vm.isNotTapable) {
          console.log("Previous Hoot Function");
        }
        else {
          currentIndex--;
          console.log(currentIndex);
          console.log('prev hoot hai');
          if (currentIndex >= 0) {
            vm.selectedHoot = vm.hoots[currentIndex];
          }
        }
      },400);
    };



    function nextHoot() {
      vm.isPlaying = true;

      vm.isHootChanged = false;
      setTimeout(function () {
        if (vm.isNotTapable) {
          console.log("Next Hoot Function");
        }
        else {
          vm.isHootChanged = true;
          console.log(play.paused);
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
      },400);
    }



  }
}());






