'use strict';

import FacebookAuthProvider from '../../../src/api/auth/FacebookAuthProvider';

describe('FacebookAuthProvider', function() {
	it('should set provider to FacebookAuthProvider.PROVIDER', function() {
		const provider = new FacebookAuthProvider();
		assert.strictEqual(FacebookAuthProvider.PROVIDER, provider.getProvider());
	});

	it('should make authorization url with provider', function() {
		const provider = new FacebookAuthProvider();
		assert.strictEqual('/oauth/authorize?provider=facebook', provider.makeAuthorizationUrl());
	});
});
