'use strict';

import Filter from '../../src/api-query/SearchFilter';
import SearchFilter from '../../src/api-query/SearchFilter';

describe('SearchFilter', function() {
	describe('SearchFilter.exists', function() {
		it('should create SearchFilter with "exists" operator', function() {
			var filter = SearchFilter.exists('age');
			var body = {
				'age': {
					operator: 'exists',
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"exists"}}', filter.toString());
		});
	});

	describe('SearchFilter.missing', function() {
		it('should create SearchFilter with "missing" operator', function() {
			var filter = SearchFilter.missing('age');
			var body = {
				'age': {
					operator: 'missing',
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"missing"}}', filter.toString());
		});
	});

	describe('SearchFilter.prefix', function() {
		it('should create SearchFilter with "pre" operator on all fields for given query', function() {
			var filter = SearchFilter.prefix('myPrefix');
			var body = {
				'*': {
					operator: 'pre',
					value: 'myPrefix'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"pre","value":"myPrefix"}}', filter.toString());
		});

		it('should create SearchFilter with "pre" operator for given field and query', function() {
			var filter = SearchFilter.prefix('name', 'myPrefix');
			var body = {
				name: {
					operator: 'pre',
					value: 'myPrefix'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"name":{"operator":"pre","value":"myPrefix"}}', filter.toString());
		});
	});

	describe('SearchFilter.disMaxOf', function() {
		it('should compose filters with the "disMax" operator', function() {
			var filter = SearchFilter.disMaxOf(
				Filter.gt('age', 12),
				Filter.lt('age', 15)
			);
			var body = {
				disMax: [
					{
						age: {
							operator: '>',
							value: 12
						}
					},
					{
						age: {
							operator: '<',
							value: 15
						}
					}
				]
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"disMax":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}}]}';
			assert.strictEqual(bodyStr, filter.toString());
		});
	});
});
