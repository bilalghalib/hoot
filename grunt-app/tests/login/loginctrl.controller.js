(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: Loginctrl', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.login'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('Loginctrl', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
