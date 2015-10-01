'use strict';

import Filter from '../../src/api-query/Filter';
import Geo from '../../src/api-query/Geo';
import Range from '../../src/api-query/Range';

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

	describe('Filter.boundingBox', function() {
		it('should create Filter with "gp" operator for bounding box', function() {
			var filter = Filter.boundingBox('shape', Geo.boundingBox('20,0', [0, 20]));
			var body = {
				shape: {
					operator: 'gp',
					value: ['20,0', [0, 20]]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"shape":{"operator":"gp","value":["20,0",[0,20]]}}',
				filter.toString()
			);
		});

		it('should create Filter with "gp" operator for bounding box points', function() {
			var filter = Filter.boundingBox('shape', '20,0', Geo.point(0, 20));
			var body = {
				shape: {
					operator: 'gp',
					value: ['20,0', [0, 20]]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"shape":{"operator":"gp","value":["20,0",[0,20]]}}',
				filter.toString()
			);
		});
	});

	describe('Filter.distance', function() {
		it('should create Filter with "gp" operator from Circle', function() {
			var filter = Filter.distance('point', Geo.circle([0, 0], 2));

			var body = {
				point: {
					operator: 'gd',
					value: {
						location: [0, 0],
						max: 2
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"point":{"operator":"gd","value":{"location":[0,0],"max":2}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should create Filter with "gd" operator from location and distance', function() {
			var filter = Filter.distance('point', Geo.point(0, 0), 2);

			var body = {
				point: {
					operator: 'gd',
					value: {
						location: [0, 0],
						max: 2
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"point":{"operator":"gd","value":{"location":[0,0],"max":2}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should create Filter with "gd" operator from location and full range', function() {
			var filter = Filter.distance('point', [0, 0], Range.range(1, 2));

			var body = {
				point: {
					operator: 'gd',
					value: {
						location: [0, 0],
						min: 1,
						max: 2
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"point":{"operator":"gd","value":{"location":[0,0],"min":1,"max":2}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should create Filter with "gd" operator from location and min range', function() {
			var filter = Filter.distance('point', [0, 0], Range.from(1));

			var body = {
				point: {
					operator: 'gd',
					value: {
						location: [0, 0],
						min: 1
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"point":{"operator":"gd","value":{"location":[0,0],"min":1}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});
	});

	describe('Filter.exists', function() {
		it('should create Filter with "exists" operator', function() {
			var filter = Filter.exists('age');
			var body = {
				age: {
					operator: 'exists',
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"exists"}}', filter.toString());
		});
	});

	describe('Filter.fuzzy', function() {
		it('should create Filter with "fuzzy" operator from just the query', function() {
			var filter = Filter.fuzzy('foo');
			var body = {
				'*': {
					operator: 'fuzzy',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"fuzzy","value":{"query":"foo"}}}', filter.toString());
		});

		it('should create Filter with "fuzzy" operator from both field and query', function() {
			var filter = Filter.fuzzy('name', 'foo');
			var body = {
				'name': {
					operator: 'fuzzy',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"fuzzy","value":{"query":"foo"}}}',
				filter.toString()
			);
		});

		it('should create Filter with "fuzzy" operator from query and fuzziness', function() {
			var filter = Filter.fuzzy('foo', 0.8);
			var body = {
				'*': {
					operator: 'fuzzy',
					value: {
						query: 'foo',
						fuzziness: 0.8
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"*":{"operator":"fuzzy","value":{"query":"foo","fuzziness":0.8}}}',
				filter.toString()
			);
		});

		it('should create Filter with "fuzzy" operator from field, query and fuzziness', function() {
			var filter = Filter.fuzzy('name', 'foo', 0.8);
			var body = {
				'name': {
					operator: 'fuzzy',
					value: {
						query: 'foo',
						fuzziness: 0.8
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"fuzzy","value":{"query":"foo","fuzziness":0.8}}}',
				filter.toString()
			);
		});
	});

	describe('Filter.match', function() {
		it('should create Filter with "match" operator from just the query', function() {
			var filter = Filter.match('foo');
			var body = {
				'*': {
					operator: 'match',
					value: 'foo'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"match","value":"foo"}}', filter.toString());
		});

		it('should create Filter with "match" operator from field and query', function() {
			var filter = Filter.match('name', 'foo');
			var body = {
				name: {
					operator: 'match',
					value: 'foo'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"name":{"operator":"match","value":"foo"}}', filter.toString());
		});
	});

	describe('Filter.missing', function() {
		it('should create Filter with "missing" operator', function() {
			var filter = Filter.missing('age');
			var body = {
				age: {
					operator: 'missing',
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"missing"}}', filter.toString());
		});
	});

	describe('Filter.similar', function() {
		it('should create Filter with "similar" operator from just the query', function() {
			var filter = Filter.similar('foo');
			var body = {
				'*': {
					operator: 'similar',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"similar","value":{"query":"foo"}}}', filter.toString());
		});

		it('should create Filter with "similar" operator from field and query', function() {
			var filter = Filter.similar('name', 'foo');
			var body = {
				name: {
					operator: 'similar',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"name":{"operator":"similar","value":{"query":"foo"}}}', filter.toString());
		});
	});

	describe('Filter.phrase', function() {
		it('should create Filter with phrase "match" operator from just the query', function() {
			var filter = Filter.phrase('foo');
			var body = {
				'*': {
					operator: 'phrase',
					value: 'foo'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"*":{"operator":"phrase","value":"foo"}}',
				filter.toString()
			);
		});

		it('should create Filter with phrase "match" operator from field and query', function() {
			var filter = Filter.phrase('name', 'foo');
			var body = {
				name: {
					operator: 'phrase',
					value: 'foo'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"phrase","value":"foo"}}',
				filter.toString()
			);
		});
	});

	describe('Filter.polygon', function() {
		it('should create Filter with "gp" operator', function() {
			var filter = Filter.polygon('shape', '10,0', [20, 0], Geo.point(15, 10));
			var body = {
				shape: {
					operator: 'gp',
					value: ['10,0', [20, 0], [15, 10]]
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"shape":{"operator":"gp","value":["10,0",[20,0],[15,10]]}}',
				filter.toString()
			);
		});
	});

	describe('Filter.prefix', function() {
		it('should create Filter with "prefix" operator on all fields for given query', function() {
			var filter = Filter.prefix('myPrefix');
			var body = {
				'*': {
					operator: 'prefix',
					value: 'myPrefix'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"prefix","value":"myPrefix"}}', filter.toString());
		});

		it('should create Filter with "prefix" operator for given field and query', function() {
			var filter = Filter.prefix('name', 'myPrefix');
			var body = {
				name: {
					operator: 'prefix',
					value: 'myPrefix'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"name":{"operator":"prefix","value":"myPrefix"}}', filter.toString());
		});
	});

	describe('Filter.range', function() {
		it('should create Filter with "range" operator', function() {
			var filter = Filter.range('age', 12, 15);
			var body = {
				age: {
					operator: 'range',
					value: {
						from: 12,
						to: 15
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"range","value":{"from":12,"to":15}}}', filter.toString());
		});

		it('should create Filter with "range" operator through Range instance', function() {
			var filter = Filter.range('age', Range.range(12, 15));
			var body = {
				age: {
					operator: 'range',
					value: {
						from: 12,
						to: 15
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"range","value":{"from":12,"to":15}}}', filter.toString());
		});
	});

	describe('Filter.shape', function() {
		it('should create Filter with "gs" operator', function() {
			var filter = Filter.shape(
				'shape',
				Geo.circle([0, 0], '2km'),
				Geo.boundingBox([20, 0], [0, 20])
			);
			var body = {
				shape: {
					operator: 'gs',
					value: {
						type: 'geometrycollection',
						geometries: [
							{
								type: 'circle',
								coordinates: [0, 0],
								radius: '2km'
							},
							{
								type: 'envelope',
								coordinates: [[20, 0], [0, 20]]
							}
						]
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"shape":{"operator":"gs","value":{"type":"geometrycollection",' +
				'"geometries":[{"type":"circle","coordinates":[0,0],"radius":"2km"},' +
				'{"type":"envelope","coordinates":[[20,0],[0,20]]}]}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});
	});
});
