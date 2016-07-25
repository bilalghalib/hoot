(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: Tabs-ctrl', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.main'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('Tabs-ctrl', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
