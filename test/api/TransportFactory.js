'use strict';

import TransportFactory from '../../src/api/TransportFactory';

describe('TransportFactory', function() {
	it('should instance() be singleton', function() {
		const instance = TransportFactory.instance();
		assert.strictEqual(instance, TransportFactory.instance());
	});

	it('should throws exception for error on creating transport', function() {
		TransportFactory.instance().transports.willThrowError = function() {
			throw new Error();
		};
		assert.throws(function() {
			TransportFactory.instance().get('willThrowError');
		}, Error);
	});

	it('should throws exception for invalid transport type', function() {
		assert.throws(function() {
			TransportFactory.instance().get('invalid');
		}, Error);
	});
});
