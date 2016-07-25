(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: layout', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.common'));

    var layout;

    beforeEach(inject(function($injector){

      layout = $injector.get('layout');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
