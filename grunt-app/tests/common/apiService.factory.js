(function(){

  /* global module, inject */

  'use strict';

  describe('Factory: apiService', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.common'));

    var apiService;

    beforeEach(inject(function($injector){

      apiService = $injector.get('apiService');

    }));

    it('should do nothing', function(){
      expect(true).toBe(false);
    });

  });
}());
