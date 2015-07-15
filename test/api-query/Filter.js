'use strict';

import Filter from '../../src/api-query/Filter';

describe('Filter', function() {
	describe('Filter.of', function() {
		it('should create SimpleFilter for a custom operator', function() {
			var filter = Filter.of('age', '>', 12);
			var body = {
				age: {
					operator: '>',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());

			filter = Filter.of('number', '<', 0);
			body = {
				number: {
					operator: '<',
					value: 0
				}
			};
			assert.deepEqual(body, filter.body());
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
		it('should create SimpleFilter for "=" operator', function() {
			var filter = Filter.equal('age', 12);
			var body = {
				age: {
					operator: '=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.gt', function() {
		it('should create SimpleFilter for ">" operator', function() {
			var filter = Filter.gt('age', 12);
			var body = {
				age: {
					operator: '>',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.gte', function() {
		it('should create SimpleFilter for ">=" operator', function() {
			var filter = Filter.gte('age', 12);
			var body = {
				age: {
					operator: '>=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.in', function() {
		it('should create SimpleFilter for "in" operator', function() {
			var filter = Filter.in('age', 12, 21, 25);
			var body = {
				age: {
					operator: 'in',
					value: [12, 21, 25]
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.like', function() {
		it('should create SimpleFilter for "like" operator', function() {
			var filter = Filter.like('age', 12);
			var body = {
				age: {
					operator: 'like',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.lt', function() {
		it('should create SimpleFilter for "<" operator', function() {
			var filter = Filter.lt('age', 12);
			var body = {
				age: {
					operator: '<',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.lte', function() {
		it('should create SimpleFilter for "<=" operator', function() {
			var filter = Filter.lte('age', 12);
			var body = {
				age: {
					operator: '<=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});

	describe('Filter.notEqual', function() {
		it('should create SimpleFilter for "!=" operator', function() {
			var filter = Filter.notEqual('age', 12);
			var body = {
				age: {
					operator: '!=',
					value: 12
				}
			};
			assert.deepEqual(body, filter.body());
		});
	});
});
