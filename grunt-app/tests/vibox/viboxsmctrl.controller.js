(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: ViboxsmCtrl', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.vibox'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('ViboxsmCtrl', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
