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

	describe('Filter.notIn', function() {
		it('should create Filter for "nin" operator', function() {
			var filter = Filter.notIn('age', 12, 21, 25);
			var body = {
				age: {
					operator: 'nin',
					value: [12, 21, 25]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"nin","value":[12,21,25]}}', filter.toString());
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

	describe('Filter.orOf', function() {
		it('should compose filters with the "or" operator', function() {
			var filter = Filter.orOf(
				Filter.gt('age', 12),
				Filter.lt('age', 15),
				Filter.equal('name', 'foo')
			);
			var body = {
				or: [
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

			var bodyStr = '{"or":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}},' +
				'{"name":{"operator":"=","value":"foo"}}]}';
			assert.strictEqual(bodyStr, filter.toString());
		});
	});

	describe('Filter.notOf', function() {
		it('should negate an existing filter', function() {
			var filter = Filter.notOf(Filter.of('age', '>', 12));
			var body = {
				not: {
					age: {
						operator: '>',
						value: 12
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"not":{"age":{"operator":">","value":12}}}', filter.toString());
		});

		it('should negate a filter created from field/operator/value params', function() {
			var filter = Filter.notOf('age', '>', 12);
			var body = {
				not: {
					age: {
						operator: '>',
						value: 12
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"not":{"age":{"operator":">","value":12}}}', filter.toString());
		});

		it('should negate a filter created from field/value params', function() {
			var filter = Filter.notOf('age', 12);
			var body = {
				not: {
					age: {
						operator: '=',
						value: 12
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"not":{"age":{"operator":"=","value":12}}}', filter.toString());
		});
	});

	describe('Composition', function() {
		it('should compose current filter with another using the "and" operator', function() {
			var filter = Filter.gt('age', 12).and(Filter.lt('age', 15));
			var bodyStr = '{"and":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}}]}';
			assert.strictEqual(bodyStr, filter.toString());

			filter = Filter.gt('age', 12).and('age', '<', 15);
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should compose current filter with another using the "or" operator', function() {
			var filter = Filter.gt('age', 12).or(Filter.lt('age', 15));
			var bodyStr = '{"or":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}}]}';
			assert.strictEqual(bodyStr, filter.toString());

			filter = Filter.gt('age', 12).or('age', '<', 15);
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should compose current filter with another using the "disMax" operator', function() {
			var filter = Filter.gt('age', 12).disMax(Filter.lt('age', 15));
			var bodyStr = '{"disMax":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}}]}';
			assert.strictEqual(bodyStr, filter.toString());

			filter = Filter.gt('age', 12).disMax('age', '<', 15);
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should compose current filter with others using different operators', function() {
			var filter = Filter.gt('age', 12)
				.or('age', '<', 15)
				.and('name', 'Foo')
				.disMax('name', 'Bar');
			var bodyStr = '{"disMax":[{"and":[{"or":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}}]},' +
				'{"name":{"operator":"=","value":"Foo"}}]},' +
				'{"name":{"operator":"=","value":"Bar"}}]}';
			assert.strictEqual(bodyStr, filter.toString());
		});
	});
});
