(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: rbpServer', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.common'));

    var rbpServer;

    beforeEach(inject(function($injector){

      rbpServer = $injector.get('rbpServer');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
