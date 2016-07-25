(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: SettingsCtrl', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.settings'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('SettingsCtrl', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
