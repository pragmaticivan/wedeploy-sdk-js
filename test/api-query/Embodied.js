'use strict';

import Embodied from '../../src/api-query/Embodied';

describe('Embodied', function() {
	it('should return empty body object', function() {
		var body = new Embodied();
		assert.deepEqual({}, body.body());
	});

	it('should print empty body JSON string', function() {
		var body = new Embodied();
		assert.deepEqual('{}', body.toString());
	});

	describe('Embodied.toBody', function() {
		it('should return the body content of an Embodied instance', function() {
			class TestEmbodied extends Embodied {
				constructor() {
					super();
					this.body_.foo = 'foo';
				}
			}

			var body = {
				foo: 'foo'
			};
			assert.deepEqual(body, Embodied.toBody(new TestEmbodied()));
		});

		it('should return the original object if it\'s not an Embodied instance', function() {
			var obj = {};
			assert.strictEqual(obj, Embodied.toBody(obj));
		});
	});
});
