'use strict';

import Filter from '../../src/api-query/Filter';

describe('Filter', function() {
	describe('Filter.of', function() {
		it('should create Filter for a custom operator', function() {
			var filter = Filter.of('age', '>', 12);
			var body = {
				age: {
					operator: '>',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":">","value":12}}', filter.toString());

			filter = Filter.of('number', '<', 0);
			body = {
				number: {
					operator: '<',
					value: 0
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"number":{"operator":"<","value":0}}', filter.toString());
		});

		it('should assume "=" operator if none is given', function() {
			var filter = Filter.of('age', 12);
			var body = {
				age: {
					operator: '=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.equal', function() {
		it('should create Filter for "=" operator', function() {
			var filter = Filter.equal('age', 12);
			var body = {
				age: {
					operator: '=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"=","value":12}}', filter.toString());
		});
	});

	describe('Filter.gt', function() {
		it('should create Filter for ">" operator', function() {
			var filter = Filter.gt('age', 12);
			var body = {
				age: {
					operator: '>',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":">","value":12}}', filter.toString());
		});
	});

	describe('Filter.gte', function() {
		it('should create Filter for ">=" operator', function() {
			var filter = Filter.gte('age', 12);
			var body = {
				age: {
					operator: '>=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":">=","value":12}}', filter.toString());
		});
	});

	describe('Filter.in', function() {
		it('should create Filter for "in" operator', function() {
			var filter = Filter.in('age', 12, 21, 25);
			var body = {
				age: {
					operator: 'in',
					value: [12, 21, 25]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"in","value":[12,21,25]}}', filter.toString());
		});
	});

	describe('Filter.like', function() {
		it('should create Filter for "like" operator', function() {
			var filter = Filter.like('age', 12);
			var body = {
				age: {
					operator: 'like',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"like","value":12}}', filter.toString());
		});
	});

	describe('Filter.lt', function() {
		it('should create Filter for "<" operator', function() {
			var filter = Filter.lt('age', 12);
			var body = {
				age: {
					operator: '<',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"<","value":12}}', filter.toString());
		});
	});

	describe('Filter.lte', function() {
		it('should create Filter for "<=" operator', function() {
			var filter = Filter.lte('age', 12);
			var body = {
				age: {
					operator: '<=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"<=","value":12}}', filter.toString());
		});
	});

	describe('Filter.notEqual', function() {
		it('should create Filter for "!=" operator', function() {
			var filter = Filter.notEqual('age', 12);
			var body = {
				age: {
					operator: '!=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"!=","value":12}}', filter.toString());
		});
	});

	describe('Filter.andOf', function() {
		it('should compose filters with the "and" operator', function() {
			var filter = Filter.andOf(
				Filter.gt('age', 12),
				Filter.lt('age', 15),
				Filter.equal('name', 'foo')
			);
			var body = {
				and: [
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
					},
					{
						name: {
							operator: '=',
							value: 'foo'
						}
					}
				]
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"and":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}},' +
				'{"name":{"operator":"=","value":"foo"}}]}';
			assert.strictEqual(bodyStr, filter.toString());
		});
	});

	describe('and', function() {
		var body;
		var bodyStr;

		before(function() {
			body = {
				and: [
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
			bodyStr = '{"and":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}}]}';
		});

		it('should compose current filter with another using the "and" operator', function() {
			var filter = Filter.gt('age', 12).and(Filter.lt('age', 15));
			assert.deepEqual(body, filter.body());
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should compose current filter with filter data using the "and" operator', function() {
			var filter = Filter.gt('age', 12).and('age', '<', 15);
			assert.deepEqual(body, filter.body());
			assert.strictEqual(bodyStr, filter.toString());
		});
	});
});
