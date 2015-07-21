'use strict';

import Filter from '../../src/api-query/SearchFilter';
import Range from '../../src/api-query/Range';
import SearchFilter from '../../src/api-query/SearchFilter';

describe('SearchFilter', function() {
	describe('SearchFilter.common', function() {
		it('should create SearchFilter with "common" operator from just the query', function() {
			var filter = SearchFilter.common('foo');
			var body = {
				'*': {
					operator: 'common',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"common","value":{"query":"foo"}}}', filter.toString());
		});

		it('should create SearchFilter with "common" operator from both field and query', function() {
			var filter = SearchFilter.common('name', 'foo');
			var body = {
				'name': {
					operator: 'common',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"common","value":{"query":"foo"}}}',
				filter.toString()
			);
		});

		it('should create SearchFilter with "common" operator from query and threshold', function() {
			var filter = SearchFilter.common('foo', 0.8);
			var body = {
				'*': {
					operator: 'common',
					value: {
						query: 'foo',
						threshold: 0.8
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"*":{"operator":"common","value":{"query":"foo","threshold":0.8}}}',
				filter.toString()
			);
		});

		it('should create SearchFilter with "common" operator from field, query and threshold', function() {
			var filter = SearchFilter.common('name', 'foo', 0.8);
			var body = {
				'name': {
					operator: 'common',
					value: {
						query: 'foo',
						threshold: 0.8
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"common","value":{"query":"foo","threshold":0.8}}}',
				filter.toString()
			);
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
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"*":{"operator":"match","value":{"query":"foo"}}}', filter.toString());
		});

		it('should create SearchFilter with "match" operator from field and query', function() {
			var filter = SearchFilter.match('name', 'foo');
			var body = {
				name: {
					operator: 'match',
					value: {
						query: 'foo'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual('{"name":{"operator":"match","value":{"query":"foo"}}}', filter.toString());
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

	describe('SearchFilter.phrase', function() {
		it('should create SearchFilter with phrase "match" operator from just the query', function() {
			var filter = SearchFilter.phrase('foo');
			var body = {
				'*': {
					operator: 'match',
					value: {
						query: 'foo',
						type: 'phrase'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"*":{"operator":"match","value":{"query":"foo","type":"phrase"}}}',
				filter.toString()
			);
		});

		it('should create SearchFilter with phrase "match" operator from field and query', function() {
			var filter = SearchFilter.phrase('name', 'foo');
			var body = {
				name: {
					operator: 'match',
					value: {
						query: 'foo',
						type: 'phrase'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"match","value":{"query":"foo","type":"phrase"}}}',
				filter.toString()
			);
		});
	});

	describe('SearchFilter.phrasePrefix', function() {
		it('should create SearchFilter with phrase_prefix "match" operator from just the query', function() {
			var filter = SearchFilter.phrasePrefix('foo');
			var body = {
				'*': {
					operator: 'match',
					value: {
						query: 'foo',
						type: 'phrase_prefix'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"*":{"operator":"match","value":{"query":"foo","type":"phrase_prefix"}}}',
				filter.toString()
			);
		});

		it('should create SearchFilter with phrase_prefix "match" operator from field and query', function() {
			var filter = SearchFilter.phrasePrefix('name', 'foo');
			var body = {
				name: {
					operator: 'match',
					value: {
						query: 'foo',
						type: 'phrase_prefix'
					}
				}
			};
			assert.deepEqual(body, filter.body());
			assert.strictEqual(
				'{"name":{"operator":"match","value":{"query":"foo","type":"phrase_prefix"}}}',
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
