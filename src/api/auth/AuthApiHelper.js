'use strict';

import Auth from './Auth';
import FacebookAuthProvider from './FacebookAuthProvider';
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
	constructor(wedeployClient) {
		assertDefAndNotNull(wedeployClient, 'WeDeploy client reference must be specified');

		this.currentUser = null;
		this.onSignInCallback = null;
		this.onSignOutCallback = null;
		this.wedeployClient = wedeployClient;
		this.storage = new Storage(new LocalStorageMechanism());

		this.processSignIn_();

		this.provider = {
			Facebook: FacebookAuthProvider,
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
	 * Calls the on sign in callback if set.
	 * @protected
	 */
	maybeCallOnSignInCallback_() {
		if (this.onSignInCallback) {
			this.onSignInCallback.call(this, this.currentUser);
		}
	}

	/**
	 * Calls the on sign out callback if set.
	 * @protected
	 */
	maybeCallOnSignOutCallback_() {
		if (this.onSignOutCallback) {
			this.onSignOutCallback.call(this, this.currentUser);
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
	}

	/**
	 * Fires passed callback when a user sign-out. Note that it keeps only the
	 * last callback passed.
	 * @param {!Function} callback
	 */
	onSignOut(callback) {
		assertFunction(callback, 'Sign-out callback must be a function');
		this.onSignOutCallback = callback;
	}

	/**
	 * Processes sign-in by detecting a presence of a fragment
	 * <code>#access_token=</code> in the url or, alternatively, by local
	 * storage current user.
	 */
	processSignIn_() {
		var redirectAccessToken = this.getRedirectAccessToken_();
		if (redirectAccessToken) {
			this.removeUrlFragmentCompletely_();
			this.loadCurrentUser(redirectAccessToken)
				.then(() => this.maybeCallOnSignInCallback_());
			return;
		}
		var currentUser = this.storage.get('currentUser');
		if (currentUser) {
			this.currentUser = this.makeUserAuthFromData(currentUser);
		}
	}

	/**
	 * Removes fragment from url by performing a push state to the current path.
	 * @protected
	 */
	removeUrlFragmentCompletely_() {
		globals.window.history.pushState({}, document.title, window.location.pathname + window.location.search);
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
			.then(response => this.loadCurrentUser(response.body().access_token))
			.then((user) => {
				this.maybeCallOnSignInCallback_();
				return user;
			});
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
				this.maybeCallOnSignOutCallback_();
				this.unloadCurrentUser_();
				return response;
			});
	}

	/**
	 * Unloads all information for <code>currentUser</code> and removes from
	 * <code>localStorage</code> if present.
	 * @return {[type]} [description]
	 */
	unloadCurrentUser_() {
		this.currentUser = null;
		this.storage.remove('currentUser');
	}
}

function assertSupportedProvider(provider) {
	switch (provider.constructor.PROVIDER) {
		case FacebookAuthProvider.PROVIDER:
		case GithubAuthProvider.PROVIDER:
		case GoogleAuthProvider.PROVIDER:
			break;
		default:
			throw new Error('Sign-in provider not supported');
	}
}

export default AuthApiHelper;
