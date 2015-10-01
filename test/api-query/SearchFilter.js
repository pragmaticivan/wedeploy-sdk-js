'use strict';

import Filter from '../../src/api-query/SearchFilter';
import Geo from '../../src/api-query/Geo';
import Range from '../../src/api-query/Range';
import SearchFilter from '../../src/api-query/SearchFilter';

describe('SearchFilter', function() {
	describe('SearchFilter.bbox', function() {
		it('should create SearchFilter with "gp" operator for bounding box', function() {
			var filter = SearchFilter.bbox('shape', Geo.bbox('20,0', [0, 20]));
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

		it('should create SearchFilter with "gp" operator for bounding box points', function() {
			var filter = SearchFilter.bbox('shape', '20,0', Geo.point(0, 20));
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

	describe('SearchFilter.distance', function() {
		it('should create SearchFilter with "gp" operator from Circle', function() {
			var filter = SearchFilter.distance('point', Geo.circle([0, 0], 2));

			var body = {
				point: {
					operator: 'gp',
					value: {
						location: [0, 0],
						max: 2
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"point":{"operator":"gp","value":{"location":[0,0],"max":2}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should create SearchFilter with "gp" operator from location and distance', function() {
			var filter = SearchFilter.distance('point', Geo.point(0, 0), 2);

			var body = {
				point: {
					operator: 'gp',
					value: {
						location: [0, 0],
						max: 2
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"point":{"operator":"gp","value":{"location":[0,0],"max":2}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should create SearchFilter with "gp" operator from location and full range', function() {
			var filter = SearchFilter.distance('point', [0, 0], Range.range(1, 2));

			var body = {
				point: {
					operator: 'gp',
					value: {
						location: [0, 0],
						min: 1,
						max: 2
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"point":{"operator":"gp","value":{"location":[0,0],"min":1,"max":2}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});

		it('should create SearchFilter with "gp" operator from location and min range', function() {
			var filter = SearchFilter.distance('point', [0, 0], Range.from(1));

			var body = {
				point: {
					operator: 'gp',
					value: {
						location: [0, 0],
						min: 1
					}
				}
			};
			assert.deepEqual(body, filter.body());

			var bodyStr = '{"point":{"operator":"gp","value":{"location":[0,0],"min":1}}}';
			assert.strictEqual(bodyStr, filter.toString());
		});
	});

	describe('SearchFilter.exists', function() {
		it('should create SearchFilter with "exists" operator', function() {
			var filter = SearchFilter.exists('age');
			var body = {
				age: {
					operator: 'exists',
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"exists"}}', filter.toString());
		});
	});

	describe('SearchFilter.fuzzy', function() {
		it('should create SearchFilter with "fuzzy" operator from just the query', function() {
			var filter = SearchFilter.fuzzy('foo');
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

		it('should create SearchFilter with "fuzzy" operator from both field and query', function() {
			var filter = SearchFilter.fuzzy('name', 'foo');
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

		it('should create SearchFilter with "fuzzy" operator from query and fuzziness', function() {
			var filter = SearchFilter.fuzzy('foo', 0.8);
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

		it('should create SearchFilter with "fuzzy" operator from field, query and fuzziness', function() {
			var filter = SearchFilter.fuzzy('name', 'foo', 0.8);
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

	describe('SearchFilter.fuzzyLikeThis', function() {
		it('should create SearchFilter with "flt" operator from just the query', function() {
			var filter = SearchFilter.fuzzyLikeThis('foo');
			var body = {
				'*': {
					operator: 'flt',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"flt","value":{"query":"foo"}}}', filter.toString());
		});

		it('should create SearchFilter with "flt" operator from both field and query', function() {
			var filter = SearchFilter.fuzzyLikeThis('name', 'foo');
			var body = {
				'name': {
					operator: 'flt',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"flt","value":{"query":"foo"}}}',
				filter.toString()
			);
		});

		it('should create SearchFilter with "flt" operator from query and fuzziness', function() {
			var filter = SearchFilter.fuzzyLikeThis('foo', 0.8);
			var body = {
				'*': {
					operator: 'flt',
					value: {
						query: 'foo',
						fuzziness: 0.8
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"*":{"operator":"flt","value":{"query":"foo","fuzziness":0.8}}}',
				filter.toString()
			);
		});

		it('should create SearchFilter with "flt" operator from field, query and fuzziness', function() {
			var filter = SearchFilter.fuzzyLikeThis('name', 'foo', 0.8);
			var body = {
				'name': {
					operator: 'flt',
					value: {
						query: 'foo',
						fuzziness: 0.8
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"flt","value":{"query":"foo","fuzziness":0.8}}}',
				filter.toString()
			);
		});
	});

	describe('SearchFilter.match', function() {
		it('should create SearchFilter with "match" operator from just the query', function() {
			var filter = SearchFilter.match('foo');
			var body = {
				'*': {
					operator: 'match',
					value: 'foo'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"match","value":"foo"}}', filter.toString());
		});

		it('should create SearchFilter with "match" operator from field and query', function() {
			var filter = SearchFilter.match('name', 'foo');
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

	describe('SearchFilter.missing', function() {
		it('should create SearchFilter with "missing" operator', function() {
			var filter = SearchFilter.missing('age');
			var body = {
				age: {
					operator: 'missing',
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"age":{"operator":"missing"}}', filter.toString());
		});
	});

	describe('SearchFilter.moreLikeThis', function() {
		it('should create SearchFilter with "mlt" operator from just the query', function() {
			var filter = SearchFilter.moreLikeThis('foo');
			var body = {
				'*': {
					operator: 'mlt',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"mlt","value":{"query":"foo"}}}', filter.toString());
		});

		it('should create SearchFilter with "mlt" operator from field and query', function() {
			var filter = SearchFilter.moreLikeThis('name', 'foo');
			var body = {
				name: {
					operator: 'mlt',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"name":{"operator":"mlt","value":{"query":"foo"}}}', filter.toString());
		});
	});

	describe('SearchFilter.phrase', function() {
		it('should create SearchFilter with phrase "match" operator from just the query', function() {
			var filter = SearchFilter.phrase('foo');
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

		it('should create SearchFilter with phrase "match" operator from field and query', function() {
			var filter = SearchFilter.phrase('name', 'foo');
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

	describe('SearchFilter.phrasePrefix', function() {
		it('should create SearchFilter with phrasePrefix "match" operator from just the query', function() {
			var filter = SearchFilter.phrasePrefix('foo');
			var body = {
				'*': {
					operator: 'phrasePrefix',
					value: 'foo'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"*":{"operator":"phrasePrefix","value":"foo"}}',
				filter.toString()
			);
		});

		it('should create SearchFilter with phrasePrefix "match" operator from field and query', function() {
			var filter = SearchFilter.phrasePrefix('name', 'foo');
			var body = {
				name: {
					operator: 'phrasePrefix',
					value: 'foo'
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"phrasePrefix","value":"foo"}}',
				filter.toString()
			);
		});
	});

	describe('SearchFilter.polygon', function() {
		it('should create SearchFilter with "gp" operator', function() {
			var filter = SearchFilter.polygon('shape', '10,0', [20, 0], Geo.point(15, 10));
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

	describe('SearchFilter.range', function() {
		it('should create SearchFilter with "range" operator', function() {
			var filter = SearchFilter.range('age', 12, 15);
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

		it('should create SearchFilter with "range" operator through Range instance', function() {
			var filter = SearchFilter.range('age', Range.range(12, 15));
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

	describe('SearchFilter.shape', function() {
		it('should create SearchFilter with "gs" operator', function() {
			var filter = SearchFilter.shape(
				'shape',
				Geo.circle([0, 0], '2km'),
				Geo.bbox([20, 0], [0, 20])
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
