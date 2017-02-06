'use strict';

import { assertNotNull, assertBrowserEnvironment } from '../../src/api/assertions';
import globals from '../../src/globals/globals';

describe('assertions', function() {
	it('throws an error on assertNotNull', function() {
		assert.throws(function() {
			assertNotNull(null, 'test message');
		}, Error);
	});

	it('throws an error on assertBrowserEnvironment', function() {
		globals.window = null;
		assert.throws(function() {
			assertBrowserEnvironment(null, 'test message');
		}, Error);
	});
});
