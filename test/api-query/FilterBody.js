'use strict';

import Filter from '../../src/api-query/Filter';
import FilterBody from '../../src/api-query/FilterBody';

describe('FilterBody', function() {
	it('should return the filter\'s body object', function() {
		var filterBody = new FilterBody('age', '>', 0);
		var body = {
			age: {
				operator: '>',
				value: 0
			}
		};
		assert.deepEqual(body, filterBody.getObject());
	});

	it('should assume "=" operator if none is given', function() {
		var filterBody = new FilterBody('age', 12);
		var body = {
			age: {
				operator: '=',
				value: 12
			}
		};
		assert.deepEqual(body, filterBody.getObject());
	});

	it('should not set "value" key if null is given', function() {
		var filterBody = new FilterBody('age', null);
		var body = {
			age: {
				operator: '='
			}
		};
		assert.deepEqual(body, filterBody.getObject());
	});

	describe('Composition', function() {
		it('should compose filter with another with the given operator', function() {
			var filterBody = new FilterBody('age', '>', 12);
			filterBody.add('and', Filter.lt('age', 15));
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
					}
				]
			};
			assert.deepEqual(body, filterBody.getObject());
		});

		it('should compose filter with multiple others with the given operator', function() {
			var filterBody = new FilterBody('age', '>', 12);
			filterBody.addMany('and', Filter.lt('age', 15), Filter.equal('name', 'foo'));
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
			assert.deepEqual(body, filterBody.getObject());
		});
	});

	it('should compose filter with a unary operator', function() {
		var filterBody = new FilterBody('age', '>', 12);
		filterBody.add('not');
		var body = {
			not: {
				age: {
					operator: '>',
					value: 12
				}
			}
		};
		assert.deepEqual(body, filterBody.getObject());
	});
});
