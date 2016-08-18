'use strict';

import { core } from 'metal';
import Uri from 'metal-uri';

/**
 * Class responsible for encapsulate provider information.
 */
class AuthProvider {
	/**
	 * Constructs an {@link AuthProvider} instance.
	 * @constructor
	 */
	constructor() {
		this.provider = null;
		this.providerScope = null;
		this.redirectUri = null;
		this.scope = null;
	}

	/**
	 * Checks if provider is defined and not null.
	 * @return {boolean}
	 */
	hasProvider() {
		return core.isDefAndNotNull(this.provider);
	}

	/**
	 * Checks if scope is defined and not null.
	 * @return {boolean}
	 */
	hasProviderScope() {
		return core.isDefAndNotNull(this.providerScope);
	}

	/**
	 * Checks if redirect uri is defined and not null.
	 * @return {boolean}
	 */
	hasRedirectUri() {
		return core.isDefAndNotNull(this.redirectUri);
	}

	/**
	 * Checks if scope is defined and not null.
	 * @return {boolean}
	 */
	hasScope() {
		return core.isDefAndNotNull(this.scope);
	}

	/**
	 * Makes authorization url.
	 * @return {string=} Authorization url.
	 */
	makeAuthorizationUrl(opt_authUrl) {
		var uri = new Uri(opt_authUrl);

		uri.setPathname('/oauth/authorize');

		if (this.hasProvider()) {
			uri.setParameterValue('provider', this.getProvider());
		}
		if (this.hasProviderScope()) {
			uri.setParameterValue('provider_scope', this.getProviderScope());
		}
		if (this.hasRedirectUri()) {
			uri.setParameterValue('redirect_uri', this.getRedirectUri());
		}
		if (this.hasScope()) {
			uri.setParameterValue('scope', this.getScope());
		}

		return uri.toString();
	}

	/**
	 * Gets provider name.
	 * @return {string=} Provider name.
	 */
	getProvider() {
		return this.provider;
	}

	/**
	 * Gets provider scope.
	 * @return {string=} String with scopes.
	 */
	getProviderScope() {
		return this.providerScope;
	}

	/**
	 * Gets redirect uri.
	 * @return {string=}.
	 */
	getRedirectUri() {
		return this.redirectUri;
	}

	/**
	 * Gets scope.
	 * @return {string=} String with scopes.
	 */
	getScope() {
		return this.scope;
	}

	/**
	 * Sets provider scope.
	 * @param {string=} scope Scope string. Separate by space for multiple
	 *   scopes, e.g. "scope1 scope2".
	 */
	setProviderScope(providerScope) {
		assertStringIfDefAndNotNull(providerScope, 'Provider scope must be a string');
		this.providerScope = providerScope;
	}

	/**
	 * Sets redirect uri.
	 * @param {string=} redirectUri.
	 */
	setRedirectUri(redirectUri) {
		assertStringIfDefAndNotNull(redirectUri, 'Redirect uri must be a string');
		this.redirectUri = redirectUri;
	}

	/**
	 * Sets scope.
	 * @param {string=} scope Scope string. Separate by space for multiple
	 *   scopes, e.g. "scope1 scope2".
	 */
	setScope(scope) {
		assertStringIfDefAndNotNull(scope, 'Scope must be a string');
		this.scope = scope;
	}
}

function assertStringIfDefAndNotNull(value, errorMessage) {
	if (core.isDefAndNotNull(value) && !core.isString(value)) {
		throw new Error(errorMessage);
	}
}

export default AuthProvider;
