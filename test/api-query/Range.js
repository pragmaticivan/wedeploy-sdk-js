'use strict';

import Range from '../../src/api-query/Range';

describe('Range', function() {
  describe('Range.range', function() {
    it('should create instance with both from/to values', function() {
      const range = Range.range(10, 20);
      const body = {
        from: 10,
        to: 20,
      };
      assert.deepEqual(body, range.body());
      assert.deepEqual('{"from":10,"to":20}', range.toString());
    });
  });
  describe('Range.from', function() {
    it('should create instance with just the "from" value', function() {
      const range = Range.from(10);
      const body = {
        from: 10,
      };
      assert.deepEqual(body, range.body());
      assert.deepEqual('{"from":10}', range.toString());
    });
  });
  describe('Range.to', function() {
    it('should create instance with just the "to" value', function() {
      const range = Range.to(20);
      const body = {
        to: 20,
      };
      assert.deepEqual(body, range.body());
      assert.deepEqual('{"to":20}', range.toString());
    });
  });
});
