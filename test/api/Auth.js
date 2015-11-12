'use strict';

import Auth from '../../src/api/Auth';

describe('Auth', function() {
	it('should create Auth instance with a token', function() {
		var auth = Auth.create('My Token');
		assert.ok(auth.hasToken());
		assert.strictEqual('My Token', auth.token());
	});

	it('should create Auth instance with username and password', function() {
		var auth = Auth.create('username', 'password');
		assert.ok(auth.hasUsername());
		assert.ok(auth.hasPassword());
		assert.strictEqual('username', auth.username());
		assert.strictEqual('password', auth.password());
	});
});
