/**
 * @ngdoc overview
 * @name app
 * @description Glue to where all the greatness begins
 */

(function () {

  'use strict';

  angular.module('app', [
    'app.core',
    'app.common',
    'ngCordova',
    /**
     * Application modules
     **/
    'app.homepage',
    'app.listenHoot',
    'app.main',
    'app.login',
    'angularAudioRecorder',
    'app.chat'
    ])

}());
