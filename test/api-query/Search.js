'use strict';

import Aggregation from '../../src/api-query/Aggregation';
import Filter from '../../src/api-query/Filter';
import Search from '../../src/api-query/Search';

describe('Search', function() {
	describe('Search.builder()', function() {
		it('should create Search instance', function() {
			var search = Search.builder();
			assert.ok(search instanceof Search);
		});

		it('should start with an empty body', function() {
			var search = Search.builder();
			assert.deepEqual({}, search.body());
			assert.strictEqual('{}', search.toString());
		});
	});

	describe('aggregate', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.aggregate('aggr', 'name', 'count'));
		});

		it('should add an existing aggregation', function() {
			var search = Search.builder().aggregate('aggr', Aggregation.histogram('age', 100));
			var bodyStr = '{"aggregation":[{"age":{"name":"aggr","operator":"histogram","value":100}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add an aggregation from the given field and operator', function() {
			var search = Search.builder().aggregate('aggr', 'foo', 'count');
			var bodyStr = '{"aggregation":[{"foo":{"name":"aggr","operator":"count"}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add multiple aggregations', function() {
			var search = Search.builder()
				.aggregate('aggr', Aggregation.histogram('age', 100))
				.aggregate('aggr', 'foo', 'count');
			var bodyStr = '{"aggregation":[' +
				'{"age":{"name":"aggr","operator":"histogram","value":100}},' +
				'{"foo":{"name":"aggr","operator":"count"}}' +
				']}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});

	describe('cursor', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.cursor('foo'));
		});

		it('should set the cursor value', function() {
			var search = Search.builder().cursor('foo');
			assert.strictEqual('{"cursor":"foo"}', search.toString());
		});
	});

	describe('highlight', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.highlight('name'));
		});

		it('should add a highlight entry for a field', function() {
			var search = Search.builder().highlight('name');
			assert.strictEqual('{"highlight":{"name":{}}}', search.toString());
		});

		it('should add a highlight entry for a field and size', function() {
			var search = Search.builder().highlight('name', 10);
			assert.strictEqual('{"highlight":{"name":{"size":10}}}', search.toString());
		});

		it('should add a highlight entry for a field, size and count', function() {
			var search = Search.builder().highlight('name', 10, 5);
			assert.strictEqual('{"highlight":{"name":{"size":10,"count":5}}}', search.toString());
		});

		it('should add multiple highlights', function() {
			var search = Search.builder()
				.highlight('address')
				.highlight('name', 10)
				.highlight('lastName', 10, 5);
			var bodyStr = '{"highlight":{"address":{},"name":{"size":10},"lastName":{"size":10,"count":5}}}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});

	describe('postFilter', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.postFilter(Filter.gt('age', 12)));
		});

		it('should add an existing filter', function() {
			var search = Search.builder().postFilter(Filter.gt('age', 12));
			var bodyStr = '{"postFilter":[{"age":{"operator":">","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from text', function() {
			var search = Search.builder().postFilter('foo');
			var bodyStr = '{"postFilter":[{"*":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field and text', function() {
			var search = Search.builder().postFilter('name', 'foo');
			var bodyStr = '{"postFilter":[{"name":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field, operator and text', function() {
			var search = Search.builder().postFilter('age', '<', 12);
			var bodyStr = '{"postFilter":[{"age":{"operator":"<","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add multiple filters', function() {
			var search = Search.builder()
				.postFilter(Filter.gt('age', 12))
				.postFilter('foo')
				.postFilter('name', 'foo')
				.postFilter('age', '<', 12);

			var bodyStr = '{"postFilter":[' +
				'{"age":{"operator":">","value":12}},' +
				'{"*":{"operator":"match","value":"foo"}},' +
				'{"name":{"operator":"match","value":"foo"}},' +
				'{"age":{"operator":"<","value":12}}' +
				']}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});

	describe('preFilter', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.preFilter(Filter.gt('age', 12)));
		});

		it('should add an existing filter', function() {
			var search = Search.builder().preFilter(Filter.gt('age', 12));
			var bodyStr = '{"preFilter":[{"age":{"operator":">","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from text', function() {
			var search = Search.builder().preFilter('foo');
			var bodyStr = '{"preFilter":[{"*":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field and text', function() {
			var search = Search.builder().preFilter('name', 'foo');
			var bodyStr = '{"preFilter":[{"name":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field, operator and text', function() {
			var search = Search.builder().preFilter('age', '<', 12);
			var bodyStr = '{"preFilter":[{"age":{"operator":"<","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add multiple filters', function() {
			var search = Search.builder()
				.preFilter(Filter.gt('age', 12))
				.preFilter('foo')
				.preFilter('name', 'foo')
				.preFilter('age', '<', 12);

			var bodyStr = '{"preFilter":[' +
				'{"age":{"operator":">","value":12}},' +
				'{"*":{"operator":"match","value":"foo"}},' +
				'{"name":{"operator":"match","value":"foo"}},' +
				'{"age":{"operator":"<","value":12}}' +
				']}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});

	describe('query', function() {
		it('should be chainnable', function() {
			var search = Search.builder();
			assert.strictEqual(search, search.query(Filter.gt('age', 12)));
		});

		it('should add an existing filter', function() {
			var search = Search.builder().query(Filter.gt('age', 12));
			var bodyStr = '{"query":[{"age":{"operator":">","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from text', function() {
			var search = Search.builder().query('foo');
			var bodyStr = '{"query":[{"*":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field and text', function() {
			var search = Search.builder().query('name', 'foo');
			var bodyStr = '{"query":[{"name":{"operator":"match","value":"foo"}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add filter from field, operator and text', function() {
			var search = Search.builder().query('age', '<', 12);
			var bodyStr = '{"query":[{"age":{"operator":"<","value":12}}]}';
			assert.strictEqual(bodyStr, search.toString());
		});

		it('should add multiple filters', function() {
			var search = Search.builder()
				.query(Filter.gt('age', 12))
				.query('foo')
				.query('name', 'foo')
				.query('age', '<', 12);

			var bodyStr = '{"query":[' +
				'{"age":{"operator":">","value":12}},' +
				'{"*":{"operator":"match","value":"foo"}},' +
				'{"name":{"operator":"match","value":"foo"}},' +
				'{"age":{"operator":"<","value":12}}' +
				']}';
			assert.strictEqual(bodyStr, search.toString());
		});
	});
});
