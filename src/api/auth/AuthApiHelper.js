'use strict';

import Auth from './Auth';
import GithubAuthProvider from './GithubAuthProvider';
import globals from '../../globals/globals';
import GoogleAuthProvider from './GoogleAuthProvider';
import { Storage, LocalStorageMechanism } from 'metal-storage';

import { assertDefAndNotNull, assertFunction, assertObject, assertUserSignedIn, assertBrowserEnvironment, assertResponseSucceeded } from '../assertions';

/**
 * Class responsible for encapsulate auth api calls.
 */
class AuthApiHelper {
	/**
	 * Constructs an {@link AuthApiHelper} instance.
	 * @constructor
	 */
	constructor() {
		this.currentUser = null;
		this.onSignInCallback = null;
		this.wedeployClient = null;
		this.storage = new Storage(new LocalStorageMechanism());

		this.maybeLoadCurrentUserFromLocalStorage();

		this.provider = {
			Google: GoogleAuthProvider,
			Github: GithubAuthProvider
		};
	}

	/**
	 * Creates user.
	 * @param {!object} data The data to be used to create the user.
	 * @return {CancellablePromise}
	 */
	createUser(data) {
		assertObject(data, 'User data must be specified as object');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/users')
			.post(data)
			.then(response => assertResponseSucceeded(response))
			.then(response => this.makeUserAuthFromData(response.body()));
	}

	/**
	 * Gets the current browser url without the fragment part.
	 * @return {!string}
	 * @protected
	 */
	getHrefWithoutFragment_() {
		var location = globals.window.location;
		return location.protocol + '//' + location.host + location.pathname + (location.search ? location.search : '');
	}

	/**
	 * Gets the access token from the url fragment and removes it.
	 * @return {?string}
	 * @protected
	 */
	getRedirectAccessToken_() {
		if (globals.window) {
			var fragment = globals.window.location.hash;
			if (fragment.indexOf('#access_token=') === 0) {
				globals.window.location.hash = '';
				return fragment.substring(14);
			}
		}
		return null;
	}

	/**
	 * Gets user by id.
	 * @param {!string} userId
	 * @return {CancellablePromise}
	 */
	getUser(userId) {
		assertDefAndNotNull(userId, 'User userId must be specified');
		assertUserSignedIn(this.currentUser);
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/users', userId)
			.auth(this.currentUser.token)
			.get()
			.then(response => assertResponseSucceeded(response));
	}

	/**
	 * Loads current user. Requires a user token as argument.
	 * @param {!string} token
	 * @return {CancellablePromise}
	 */
	loadCurrentUser(token) {
		assertDefAndNotNull(token, 'User token must be specified');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/user')
			.auth(token)
			.get()
			.then(response => {
				var data = response.body();
				data.token = token;
				this.currentUser = this.makeUserAuthFromData(data);
				this.storage.set('currentUser', data);
				return this.currentUser;
			});
	}

	/**
	 * Makes user Auth from data object.
	 * @param {object} data
	 * @return {Auth}
	 * @protected
	 */
	makeUserAuthFromData(data) {
		var auth = new Auth();
		auth.setWedeployClient(this.wedeployClient);
		auth.setCreatedAt(data.createdAt);
		auth.setEmail(data.email);
		auth.setId(data.id);
		auth.setName(data.name);
		auth.setPhotoUrl(data.photoUrl);
		auth.setToken(data.token);
		return auth;
	}

	/**
	 * If key <code>currentUser</code> is present on <code>localStorage</code>
	 * uses it as <code>this.currentUser</code>.
	 * @return {[type]} [description]
	 */
	maybeLoadCurrentUserFromLocalStorage() {
		var currentUser = this.storage.get('currentUser');
		if (currentUser) {
			this.currentUser = this.makeUserAuthFromData(currentUser);
		}
	}

	/**
	 * Fires passed callback when a user sign-in. Note that it keeps only the
	 * last callback passed.
	 * @param {!Function} callback
	 */
	onSignIn(callback) {
		assertFunction(callback, 'Sign-in callback must be a function');
		this.onSignInCallback = callback;
		var redirectAccessToken = this.getRedirectAccessToken_();
		if (redirectAccessToken) {
			this.loadCurrentUser(redirectAccessToken).then(() => this.onSignInCallback.call(this, this.currentUser));
		}
	}

	/**
	 * Sends password reset email to the specified email if found in database.
	 * For security reasons call do not fail if email not found.
	 * @param {!string} email
	 * @return {CancellablePromise}
	 */
	sendPasswordResetEmail(email) {
		assertDefAndNotNull(email, 'Send password reset email must be specified');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/user/recover')
			.param('email', email)
			.post()
			.then(response => assertResponseSucceeded(response));
	}

	/**
	 * Signs in using email and password.
	 * @param {!string} email
	 * @param {!string} password
	 * @return {CancellablePromise}
	 */
	signInWithEmailAndPassword(email, password) {
		assertDefAndNotNull(email, 'Sign-in email must be specified');
		assertDefAndNotNull(password, 'Sign-in password must be specified');

		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/oauth/token')
			.param('grant_type', 'password')
			.param('username', email)
			.param('password', password)
			.get()
			.then(response => assertResponseSucceeded(response))
			.then(response => this.loadCurrentUser(response.body().access_token));
	}

	/**
	 * Signs in with redirect. Some providers and environment may not support
	 * this flow.
	 * @param {AuthProvider} provider
	 */
	signInWithRedirect(provider) {
		assertBrowserEnvironment();
		assertDefAndNotNull(provider, 'Sign-in provider must be defined');
		assertSupportedProvider(provider);

		if (!provider.hasRedirectUri()) {
			provider.setRedirectUri(this.getHrefWithoutFragment_());
		}
		globals.window.location.href = provider.makeAuthorizationUrl(this.wedeployClient.authUrl_);
	}

	/**
	 * Signs out <code>currentUser</code> and removes from <code>localStorage</code>.
	 * @return {[type]} [description]
	 */
	signOut() {
		assertUserSignedIn(this.currentUser);
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/oauth/revoke')
			.param('token', this.currentUser.token)
			.get()
			.then(response => assertResponseSucceeded(response))
			.then(response => {
				this.unloadCurrentUser();
				return response;
			});
	}

	/**
	 * Sets reference for <code>WeDeploy</code> class to be used for internal
	 * requests.
	 * @param {WeDeploy} wedeployClient
	 */
	setWedeployClient(wedeployClient) {
		this.wedeployClient = wedeployClient;
	}

	/**
	 * Unloads all information for <code>currentUser</code> and removes from
	 * <code>localStorage</code> if present.
	 * @return {[type]} [description]
	 */
	unloadCurrentUser() {
		this.currentUser = null;
		this.storage.remove('currentUser');
	}
}

function assertSupportedProvider(provider) {
	switch (provider.constructor.PROVIDER) {
		case GithubAuthProvider.PROVIDER:
		case GoogleAuthProvider.PROVIDER:
			break;
		default:
			throw new Error('Sign-in provider not supported');
	}
}

export default AuthApiHelper;
