(function(){

  /* global module, inject */

  'use strict';

  describe('Filter: trusted', function(){

    beforeEach(module('app.core'));
    beforeEach(module('app.conversation'));

    var trusted;

    beforeEach(inject(function (trustedFilter){

      trusted = trustedFilter;

    }));

    it('should not do anything for now', function(){
      expect(true).toBe(false);
    });

  });
}());
