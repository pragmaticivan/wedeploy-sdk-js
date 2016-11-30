'use strict';

import AuthProvider from '../../../src/api/auth/AuthProvider';

describe('AuthProvider', function() {
	it('should support default constructor', function() {
		assert.doesNotThrow(function() {
			new AuthProvider();
		});
	});

	it('should not set default provider', function() {
		const provider = new AuthProvider();
		assert.strictEqual(null, provider.getProvider());
	});

	it('should set provider scope', function() {
		const provider = new AuthProvider();
		assert.ok(!provider.hasProviderScope());
		provider.setProviderScope('providerScope');
		assert.ok(provider.hasProviderScope());
		assert.strictEqual('providerScope', provider.getProviderScope());
	});

	it('should set provider scope as string', function() {
		const provider = new AuthProvider();
		assert.throws(function() {
			provider.setProviderScope(0);
		}, Error);
	});

	it('should set redirect uri', function() {
		const provider = new AuthProvider();
		assert.ok(!provider.hasRedirectUri());
		provider.setRedirectUri('uri');
		assert.ok(provider.hasRedirectUri());
		assert.strictEqual('uri', provider.getRedirectUri());
	});

	it('should set redirect uri as string', function() {
		const provider = new AuthProvider();
		assert.throws(function() {
			provider.setRedirectUri(0);
		}, Error);
	});

	it('should set scope', function() {
		const provider = new AuthProvider();
		assert.ok(!provider.hasScope());
		provider.setScope('scope');
		assert.ok(provider.hasScope());
		assert.strictEqual('scope', provider.getScope());
	});

	it('should set scope as string', function() {
		const provider = new AuthProvider();
		assert.throws(function() {
			provider.setScope(0);
		}, Error);
	});

	it('should make authorization url with base auth url', function() {
		const provider = new AuthProvider();
		assert.strictEqual('https://auth:8080/oauth/authorize', provider.makeAuthorizationUrl('https://auth:8080'));
	});

	it('should make authorization url for null parameters', function() {
		const provider = new AuthProvider();
		assert.strictEqual('/oauth/authorize', provider.makeAuthorizationUrl());
	});

	it('should make authorization url for empty parameters', function() {
		const provider = new AuthProvider();
		provider.setProviderScope('');
		provider.setRedirectUri('');
		provider.setScope('');
		assert.strictEqual('/oauth/authorize?provider_scope=&redirect_uri=&scope=', provider.makeAuthorizationUrl());
	});

	it('should make authorization url for defined parameters', function() {
		const provider = new AuthProvider();
		provider.setProviderScope('scope1 scope2');
		provider.setRedirectUri('uri');
		provider.setScope('scope1 scope2');
		assert.strictEqual('/oauth/authorize?provider_scope=scope1%20scope2&redirect_uri=uri&scope=scope1%20scope2', provider.makeAuthorizationUrl());
	});
});
