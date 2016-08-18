'use strict';

import GoogleAuthProvider from '../../../src/api/auth/GoogleAuthProvider';

describe('GoogleAuthProvider', function() {
	it('should set provider to GoogleAuthProvider.PROVIDER', function() {
		var provider = new GoogleAuthProvider();
		assert.strictEqual(GoogleAuthProvider.PROVIDER, provider.getProvider());
	});

	it('should make authorization url with provider', function() {
		var provider = new GoogleAuthProvider();
		assert.strictEqual('/oauth/authorize?provider=google', provider.makeAuthorizationUrl());
	});
});
