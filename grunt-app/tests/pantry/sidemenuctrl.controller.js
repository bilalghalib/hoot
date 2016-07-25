(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: Sidemenuctrl', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.pantry'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('Sidemenuctrl', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
