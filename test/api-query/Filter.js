'use strict';

import Filter from '../../src/api-query/Filter';

describe('Filter', function() {
	describe('Filter.field', function() {
		it('should create Filter for a custom operator', function() {
			var filter = Filter.field('age', '>', 12);
			var body = {
				age: {
					operator: '>',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":">","value":12}}', filter.toString());

			filter = Filter.field('number', '<', 0);
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
			var filter = Filter.field('age', 12);
			var body = {
				age: {
					operator: '=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.any', function() {
		it('should create Filter for "any" operator form multiple params', function() {
			var filter = Filter.any('age', 12, 21, 25);
			var body = {
				age: {
					operator: 'any',
					value: [12, 21, 25]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"any","value":[12,21,25]}}', filter.toString());
		});

		it('should create Filter for "any" operator from array', function() {
			var filter = Filter.any('age', [12, 21, 25]);
			var body = {
				age: {
					operator: 'any',
					value: [12, 21, 25]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"any","value":[12,21,25]}}', filter.toString());
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

	describe('Filter.regex', function() {
		it('should create Filter for "~" operator', function() {
			var filter = Filter.regex('age', 12);
			var body = {
				age: {
					operator: '~',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"~","value":12}}', filter.toString());
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

	describe('Filter.none', function() {
		it('should create Filter for "none" operator from multiple values', function() {
			var filter = Filter.none('age', 12, 21, 25);
			var body = {
				age: {
					operator: 'none',
					value: [12, 21, 25]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"none","value":[12,21,25]}}', filter.toString());
		});

		it('should create Filter for "none" operator from array', function() {
			var filter = Filter.none('age', [12, 21, 25]);
			var body = {
				age: {
					operator: 'none',
					value: [12, 21, 25]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"none","value":[12,21,25]}}', filter.toString());
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

	describe('Filter.and', function() {
		it('should compose filters with the "and" operator', function() {
			var filter = Filter.and(
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

	describe('Filter.or', function() {
		it('should compose filters with the "or" operator', function() {
			var filter = Filter.or(
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

	describe('Filter.not', function() {
		it('should negate an existing filter', function() {
			var filter = Filter.not(Filter.field('age', '>', 12));
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
			var filter = Filter.not('age', '>', 12);
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
			var filter = Filter.not('age', 12);
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
	});
});
