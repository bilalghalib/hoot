(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: ProductPageCtrl', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.product'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('ProductPageCtrl', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
