'use strict';

import Embodied from '../../src/api-query/Embodied';

describe('Embodied', function() {
	describe('should return empty body object', function() {
		var body = new Embodied();
		assert.deepEqual({}, body.body());
	});

	describe('should print empty body JSON string', function() {
		var body = new Embodied();
		assert.deepEqual('{}', body.toString());
	});
});
