(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: MarketCtrl', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.market'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('MarketCtrl', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
