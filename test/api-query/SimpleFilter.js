'use strict';

import SimpleFilter from '../../src/api-query/SimpleFilter';

describe('SimpleFilter', function() {
	it('should return json object from "body" function', function() {
		var body = {
			myField: {
				operator: '=',
				value: 'foo'
			}
		};
		assert.deepEqual(body, new SimpleFilter('myField', '=', 'foo').body());

		body = {
			array: {
				operator: 'in',
				value: ['foo', 'bar']
			}
		};
		assert.deepEqual(body, new SimpleFilter('array', 'in', ['foo', 'bar']).body());
	});

	it('should return json string from "toString" function', function() {
		var body = '{"myField":{"operator":"=","value":"foo"}}';
		assert.strictEqual(body, new SimpleFilter('myField', '=', 'foo').toString());

		body = '{"array":{"operator":"in","value":["foo","bar"]}}';
		assert.strictEqual(body, new SimpleFilter('array', 'in', ['foo', 'bar']).toString());
	});
});
