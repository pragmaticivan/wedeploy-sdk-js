'use strict';

import Filter from '../../src/api-query/Filter';
import Query from '../../src/api-query/Query';
import Aggregation from '../../src/api-query/Aggregation';

describe('Query', function() {
	describe('filter', function() {
		it('should be chainnable', function() {
			var query = Query.filter();
			assert.strictEqual(query, query.filter(Filter.gt('age', 12)));
		});

		it('should add an existing filter', function() {
			var query = Query.filter(Filter.gt('age', 12));
			var body = {
				filter: [{
					age: {
						operator: '>',
						value: 12
					}
				}]
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"filter":[{"age":{"operator":">","value":12}}]}', query.toString());
		});

		it('should add filter from field/operator/value', function() {
			var query = Query.filter('age', '>', 12);
			var body = {
				filter: [{
					age: {
						operator: '>',
						value: 12
					}
				}]
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"filter":[{"age":{"operator":">","value":12}}]}', query.toString());
		});

		it('should add filter from field/value', function() {
			var query = Query.filter('age', 12);
			var body = {
				filter: [{
					age: {
						operator: '=',
						value: 12
					}
				}]
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"filter":[{"age":{"operator":"=","value":12}}]}', query.toString());
		});

		it('should add multiple filters', function() {
			var query = Query
				.filter(Filter.gt('age', 12))
				.filter('age', '<', 15)
				.filter('name', 'Foo');

			var bodyStr = '{"filter":[{"age":{"operator":">","value":12}},' +
				'{"age":{"operator":"<","value":15}},' +
				'{"name":{"operator":"=","value":"Foo"}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});
	});

	describe('search', function() {
		it('should be chainnable', function() {
			var query = Query.search();
			assert.strictEqual(query, query.search(Query.search()));
		});

		it('should set the search entry from text', function() {
			var query = Query.search('foo');
			var body = {
				search: [{
					'*': {
						operator: 'match',
						value: 'foo'
					}
				}]
			};
			assert.deepEqual(body, query.body());

			var bodyStr = '{"search":[{"*":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should set the search entry from field and text', function() {
			var query = Query.search('name', 'foo');
			var body = {
				search: [{
					name: {
						operator: 'match',
						value: 'foo'
					}
				}]
			};
			assert.deepEqual(body, query.body());

			var bodyStr = '{"search":[{"name":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should set the search entry from field, operator and text', function() {
			var query = Query.search('age', '<', 12);
			var body = {
				search: [{
					age: {
						operator: '<',
						value: 12
					}
				}]
			};
			assert.deepEqual(body, query.body());

			var bodyStr = '{"search":[{"age":{"operator":"<","value":12}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should be chainnable', function() {
			var query = Query.search();
			assert.strictEqual(query, query.search(Filter.gt('age', 12)));
		});

		it('should add an existing filter', function() {
			var query = Query.search(Filter.gt('age', 12));
			var bodyStr = '{"search":[{"age":{"operator":">","value":12}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should add filter from text', function() {
			var query = Query.search('foo');
			var bodyStr = '{"search":[{"*":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should add filter from field and text', function() {
			var query = Query.search('name', 'foo');
			var bodyStr = '{"search":[{"name":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should add filter from field, operator and text', function() {
			var query = Query.search('age', '<', 12);
			var bodyStr = '{"search":[{"age":{"operator":"<","value":12}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should add multiple filters', function() {
			var query = Query
				.search(Filter.gt('age', 12))
				.search('foo')
				.search('name', 'foo')
				.search('age', '<', 12);

			var bodyStr = '{"search":[' +
				'{"age":{"operator":">","value":12}},' +
				'{"*":{"operator":"match","value":"foo"}},' +
				'{"name":{"operator":"match","value":"foo"}},' +
				'{"age":{"operator":"<","value":12}}' +
				']}';
			assert.strictEqual(bodyStr, query.toString());
		});
	});

	describe('sort', function() {
		it('should be chainnable', function() {
			var query = Query.sort();
			assert.strictEqual(query, query.sort('age'));
		});

		it('should add a sort entry for the given field', function() {
			var query = Query.sort('age');
			var body = {
				sort: [{
					age: 'asc'
				}]
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"sort":[{"age":"asc"}]}', query.toString());
		});

		it('should add a sort entry for the given field and direction', function() {
			var query = Query.sort('age', 'desc');
			var body = {
				sort: [{
					age: 'desc'
				}]
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"sort":[{"age":"desc"}]}', query.toString());
		});

		it('should add multiple sort entries', function() {
			var query = Query
				.sort('age', 'desc')
				.sort('name');
			assert.strictEqual('{"sort":[{"age":"desc"},{"name":"asc"}]}', query.toString());
		});
	});

	describe('type', function() {
		it('should be chainnable', function() {
			var query = Query.type();
			assert.strictEqual(query, query.type('count'));
		});

		it('should set the query type to the given value', function() {
			var query = Query.type('customType');
			var body = {
				type: 'customType'
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"type":"customType"}', query.toString());
		});

		it('should set the query type to "count"', function() {
			var query = Query.count();
			var body = {
				type: 'count'
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"type":"count"}', query.toString());
		});

		it('should set the query type to "fetch"', function() {
			var query = Query.fetch();
			var body = {
				type: 'fetch'
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"type":"fetch"}', query.toString());
		});
	});

	describe('offset', function() {
		it('should be chainnable', function() {
			var query = Query.offset();
			assert.strictEqual(query, query.offset(10));
		});

		it('should set the query type to the given value', function() {
			var query = Query.offset(10);
			var body = {
				offset: 10
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"offset":10}', query.toString());
		});
	});

	describe('limit', function() {
		it('should be chainnable', function() {
			var query = Query.limit();
			assert.strictEqual(query, query.limit(10));
		});

		it('should set the query type to the given value', function() {
			var query = Query.limit(10);
			var body = {
				limit: 10
			};
			assert.deepEqual(body, query.body());
			assert.strictEqual('{"limit":10}', query.toString());
		});
	});

	describe('all', function() {
		it('should create complex query with many different keys', function() {
			var query = Query
				.filter(Filter.gt('age', 12))
				.sort('age', 'desc')
				.sort('name')
				.offset(5)
				.limit(10)
				.fetch();
			var bodyStr = '{' +
				'"filter":[{"age":{"operator":">","value":12}}],' +
				'"sort":[{"age":"desc"},{"name":"asc"}],' +
				'"offset":5,' +
				'"limit":10,' +
				'"type":"fetch"' +
				'}';
			assert.strictEqual(bodyStr, query.toString());
		});
	});

	describe('aggregate', function() {
		it('should be chainnable', function() {
			var query = Query.aggregate();
			assert.strictEqual(query, query.aggregate('aggr', 'name', 'count'));
		});

		it('should add an existing aggregation', function() {
			var query = Query.aggregate('aggr', Aggregation.histogram('age', 100));
			var bodyStr = '{"aggregation":[{"age":{"name":"aggr","operator":"histogram","value":100}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should add an aggregation from the given field and operator', function() {
			var query = Query.aggregate('aggr', 'foo', 'count');
			var bodyStr = '{"aggregation":[{"foo":{"name":"aggr","operator":"count"}}]}';
			assert.strictEqual(bodyStr, query.toString());
		});

		it('should add multiple aggregations', function() {
			var query = Query
				.aggregate('aggr', Aggregation.histogram('age', 100))
				.aggregate('aggr', 'foo', 'count');
			var bodyStr = '{"aggregation":[' +
				'{"age":{"name":"aggr","operator":"histogram","value":100}},' +
				'{"foo":{"name":"aggr","operator":"count"}}' +
				']}';
			assert.strictEqual(bodyStr, query.toString());
		});
	});

	describe('highlight', function() {
		it('should be chainnable', function() {
			var query = Query.highlight();
			assert.strictEqual(query, query.highlight('name'));
		});

		it('should add a highlight entry for a field', function() {
			var query = Query.highlight('name');
			assert.strictEqual('{"highlight":["name"]}', query.toString());
		});

		it('should add multiple highlights', function() {
			var query = Query
				.highlight('address')
				.highlight('name', 10)
				.highlight('lastName', 10, 5);
			var bodyStr = '{"highlight":["address","name","lastName"]}';
			assert.strictEqual(bodyStr, query.toString());
		});
	});
});
