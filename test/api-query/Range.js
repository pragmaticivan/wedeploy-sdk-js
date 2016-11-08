'use strict';

import Range from '../../src/api-query/Range';

describe('Range', function() {
	describe('Range.range', function () {
		it('should create instance with both from/to values', function() {
			var range = Range.range(10, 20);
			var body = {
				from: 10,
				to: 20
			};
			assert.deepEqual(body, range.body());
			assert.deepEqual('{"from":10,"to":20}', range.toString());
		});
	});
	describe('Range.from', function () {
		it('should create instance with just the "from" value', function() {
			var range = Range.from(10);
			var body = {
				from: 10
			};
			assert.deepEqual(body, range.body());
			assert.deepEqual('{"from":10}', range.toString());
		});
	});
	describe('Range.to', function () {
		it('should create instance with just the "to" value', function() {
			var range = Range.to(20);
			var body = {
				to: 20
			};
			assert.deepEqual(body, range.body());
			assert.deepEqual('{"to":20}', range.toString());
		});
	});
});
