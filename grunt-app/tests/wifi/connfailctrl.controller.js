(function(){

  /* global module, inject */

  'use strict';

  describe('Controller: ConnfailCtrl', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.wifi'));

    var ctrl;
    var scope;

    beforeEach(inject(function($controller, $injector){

      scope = $injector.get('$rootScope');

      ctrl = $controller('ConnfailCtrl', {
        //add injectable services
      });

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
