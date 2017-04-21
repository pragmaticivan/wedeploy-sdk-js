'use strict';

import Auth from './Auth';
import ApiHelper from '../ApiHelper';
import FacebookAuthProvider from './FacebookAuthProvider';
import GithubAuthProvider from './GithubAuthProvider';
import globals from '../../globals/globals';
import GoogleAuthProvider from './GoogleAuthProvider';
import {Storage, LocalStorageMechanism} from 'metal-storage';
import {isObject} from 'metal';

import {
  assertDefAndNotNull,
  assertFunction,
  assertObject,
  assertUserSignedIn,
  assertBrowserEnvironment,
  assertResponseSucceeded,
} from '../assertions';

/**
 * Class responsible for encapsulating auth API calls.
 */
class AuthApiHelper extends ApiHelper {
  /**
	 * Constructs an {@link AuthApiHelper} instance.
	 * @param {!string} wedeployClient
	 * @constructor
	 */
  constructor(wedeployClient) {
    super(wedeployClient);
    this.currentUser = null;
    this.onSignInCallback = null;
    this.onSignOutCallback = null;

    if (LocalStorageMechanism.isSupported()) {
      this.storage = new Storage(new LocalStorageMechanism());
    }

    this.processSignIn_();

    this.provider = {
      Facebook: FacebookAuthProvider,
      Google: GoogleAuthProvider,
      Github: GithubAuthProvider,
    };
  }

  /**
	 * Creates access token cookie.
	 * @param {string} accessToken
	 */
  createAccessTokenCookie(accessToken) {
    if (globals.document && globals.window) {
      globals.document.cookie =
        'access_token=' +
        accessToken +
        '; Domain=' +
        globals.window.location.hostname +
        ';';
    }
  }

  /**
	 * Creates user.
	 * @param {!Object} data The data to be used to create the user.
	 * @return {CancellablePromise}
	 */
  createUser(data) {
    assertObject(data, 'User data must be specified as object');

    let request = this.wedeployClient
      .url(this.wedeployClient.authUrl_)
      .path('/users');

    let authScope = this.resolveAuthScope();
    if (authScope) {
      request.auth(authScope.token);
    }

    return request
      .post(data)
      .then(response => assertResponseSucceeded(response))
      .then(response => this.makeUserAuthFromData(response.body()));
  }

  /**
	 * Deletes access token cookie.
	 */
  deleteAccessTokenCookie() {
    if (globals.document && globals.window) {
      globals.document.cookie =
        'access_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;Domain=' +
        globals.window.location.hostname +
        ';';
    }
  }

  /**
	 * Gets the current browser url without the fragment part.
	 * @return {!string}
	 * @protected
	 */
  getHrefWithoutFragment_() {
    let location = globals.window.location;
    return (
      location.protocol +
      '//' +
      location.host +
      location.pathname +
      (location.search ? location.search : '')
    );
  }

  /**
	 * Gets the access token from the url fragment and removes it.
	 * @return {?string}
	 * @protected
	 */
  getRedirectAccessToken_() {
    if (globals.window && globals.window.location) {
      let fragment = globals.window.location.hash;
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
      .auth(this.resolveAuthScope().token)
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => this.makeUserAuthFromData(response.body()));
  }

  /**
	 * Loads current user. Requires a user token as argument.
	 * @param {!string} token
	 * @return {CancellablePromise}
	 */
  loadCurrentUser(token) {
    return this.verifyUser(token).then(currentUser => {
      this.currentUser = currentUser;
      if (this.storage) {
        this.storage.set('currentUser', currentUser);
      }
      if (this.currentUser.hasToken()) {
        this.createAccessTokenCookie(this.currentUser.getToken());
      }
      return this.currentUser;
    });
  }

  /**
	 * Makes user Auth from data object.
	 * @param {Object} data
	 * @return {Auth}
	 * @protected
	 */
  makeUserAuthFromData(data) {
    let auth = new Auth();
    if (isObject(data)) {
      let properties = {};
      Object.keys(data).forEach(key => {
        properties[key] = {
          enumerable: true,
          value: data[key],
          writable: true,
        };
      });
      Object.defineProperties(auth, properties);
    }
    auth.setWedeployClient(this.wedeployClient);
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
    let redirectAccessToken = this.getRedirectAccessToken_();
    if (redirectAccessToken) {
      this.removeUrlFragmentCompletely_();
      this.loadCurrentUser(redirectAccessToken).then(() =>
        this.maybeCallOnSignInCallback_()
      );
      return;
    }
    let currentUser = this.storage && this.storage.get('currentUser');
    if (currentUser) {
      this.currentUser = this.makeUserAuthFromData(currentUser);
    }
  }

  /**
	 * Removes fragment from url by performing a push state to the current path.
	 * @protected
	 */
  removeUrlFragmentCompletely_() {
    globals.window.history.pushState(
      {},
      '',
      window.location.pathname + window.location.search
    );
  }

  /**
	 * Resolves auth scope from last login or api helper.
	 * @return {Auth}
	 */
  resolveAuthScope() {
    if (this.helperAuthScope) {
      return this.helperAuthScope;
    }
    return this.currentUser;
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
      .then(user => {
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
    globals.window.location.href = provider.makeAuthorizationUrl(
      this.wedeployClient.authUrl_
    );
  }

  /**
	 * Signs out <code>currentUser</code> and removes from
	 *   <code>localStorage</code>.
	 * @return {CancellablePromise}
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
	 */
  unloadCurrentUser_() {
    this.currentUser = null;
    if (this.storage) {
      this.storage.remove('currentUser');
    }
    this.deleteAccessTokenCookie();
  }

  /**
	 * Method for verifying tokens. If the provided token has the correct
	 * format, is not expired, and is properly signed, the method returns the
	 * decoded token.
	 * @param {!string} token
	 * @return {CancellablePromise}
	 */
  verifyToken(token) {
    assertDefAndNotNull(token, 'Token must be specified');
    return this.wedeployClient
      .url(this.wedeployClient.authUrl_)
      .path('/oauth/tokeninfo')
      .param('token', token)
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
	 * Method for verifying user by token. If the provided token has the correct
	 * format, is not expired, and is properly signed, the method returns the
	 * user payload.
	 * @param {!string} tokenOrEmail Either an authorization token,
	 * or the email.
	 * @param {string=} opt_password If a email is given as the first param,
	 * this should be the password.
	 * @return {CancellablePromise}
	 */
  verifyUser(tokenOrEmail, opt_password) {
    assertDefAndNotNull(tokenOrEmail, 'Token or email must be specified');
    return this.wedeployClient
      .url(this.wedeployClient.authUrl_)
      .path('/user')
      .auth(tokenOrEmail, opt_password)
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => {
        let data = response.body();
        if (opt_password) {
          data.token = null;
          data.email = tokenOrEmail;
          data.password = opt_password;
        } else {
          data.token = tokenOrEmail;
        }
        return this.makeUserAuthFromData(data);
      });
  }
}

/**
 * Asserts a passed sign-in provider is supported.
 * Throws an exception if the passed provider is not one of:
 * - FacebookAuthProvider.PROVIDER
 * - GithubAuthProvider.PROVIDER
 * - GoogleAuthProvider.PROVIDER
 * @param {!string} provider
 */
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
