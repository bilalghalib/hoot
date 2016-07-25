(function(){

  /* global module, inject */

  'use strict';

  describe('Filter: euroFilter', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.common'));

    var euroFilter;

    beforeEach(inject(function (euroFilterFilter){

      euroFilter = euroFilterFilter;

    }));

    it('should not do anything for now', function(){
      expect(true).toBe(false);
    });

  });
}());
