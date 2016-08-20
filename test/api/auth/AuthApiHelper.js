'use strict';

import globals from '../../../src/globals/globals';
import Auth from '../../../src/api/auth/Auth';
import CancellablePromise from 'metal-promise';
import GithubAuthProvider from '../../../src/api/auth/GithubAuthProvider';
import GoogleAuthProvider from '../../../src/api/auth/GoogleAuthProvider';
import WeDeploy from '../../../src/api/WeDeploy';

describe('AuthApiHelper', function() {
	afterEach(function() {
		WeDeploy.auth_ = null;
		globals.window = window;
		RequestMock.teardown();
	});

	beforeEach(function() {
		RequestMock.setup();
	});

	it('should WeDeploy.auth() returns same instance', function() {
		var auth = WeDeploy.auth();
		assert.strictEqual(auth, WeDeploy.auth());
	});

	it('should map providers', function() {
		var auth = WeDeploy.auth();
		assert.ok(auth.provider.Google);
		assert.ok(auth.provider.Github);
	});

	it('should throws exception when signin-in with redirect using null provider', function() {
		var auth = WeDeploy.auth();
		assert.throws(function() {
			auth.signInWithRedirect(null);
		}, Error);
	});

	it('should throws exception signing-in with redirect using not supported sign-in type for the environment', function() {
		var auth = WeDeploy.auth();
		assert.throws(function() {
			auth.signInWithRedirect(undefined);
		}, Error);
	});

	it('should fail sign-in with redirect using not supported provider', function() {
		var auth = WeDeploy.auth();
		assert.throws(function() {
			auth.signInWithRedirect({});
		}, Error);
	});

	it('should not fail sign-in with redirect using Github provider', function() {
		var auth = WeDeploy.auth();
		globals.window = {
			location: {
				href: ''
			}
		};
		assert.doesNotThrow(function() {
			auth.signInWithRedirect(new GithubAuthProvider());
		});
	});

	it('should not fail sign-in with redirect using Google provider', function() {
		var auth = WeDeploy.auth();
		globals.window = {
			location: {
				href: ''
			}
		};
		assert.doesNotThrow(function() {
			auth.signInWithRedirect(new GoogleAuthProvider());
		});
	});

	it('should sign-in with redirect forward location to provider authorization url with current url without hash as redirect uri', function() {
		var auth = WeDeploy.auth();
		globals.window = {
			location: {
				protocol: 'http:',
				host: 'currentUrl',
				pathname: '/',
				search: '?q=1',
				hash: '#hash'
			}
		};
		var provider = new GithubAuthProvider();
		assert.notOk(provider.hasRedirectUri());
		auth.signInWithRedirect(provider);
		assert.strictEqual('http://currentUrl/?q=1', provider.getRedirectUri());
		assert.strictEqual(provider.makeAuthorizationUrl(), globals.window.location.href);
	});

	it('should sign-in with redirect forward location to provider authorization url and preserve redirect uri', function() {
		var auth = WeDeploy.auth();
		globals.window = {
			location: {
				href: 'http://currentUrl'
			}
		};
		var provider = new GithubAuthProvider();
		provider.setRedirectUri('http://customUrl');
		auth.signInWithRedirect(provider);
		assert.strictEqual('http://customUrl', provider.getRedirectUri());
		assert.strictEqual(provider.makeAuthorizationUrl(), globals.window.location.href);
	});

	it('should throws exception when calling when sending password reset with email not specified', function() {
		assert.throws(() => WeDeploy.auth().sendPasswordResetEmail(), Error);
	});

	it('should call send password reset email successfully', function(done) {
		var auth = WeDeploy.auth();
		RequestMock.intercept().reply(200);
		auth
			.sendPasswordResetEmail('email@domain.com')
			.then(() => done());
	});

	it('should call send password reset email unsuccessfully', function(done) {
		var auth = WeDeploy.auth();
		RequestMock.intercept().reply(400);
		auth
			.sendPasswordResetEmail('email@domain.com')
			.catch(() => done());
	});

	it('should call send password reset email with email as parameter', function(done) {
		var auth = WeDeploy.auth();
		RequestMock.intercept().reply(200);
		auth
			.sendPasswordResetEmail('email@domain.com')
			.then((response) => {
				assert.strictEqual('email@domain.com', response.request().params().get('email'));
				done();
			});
	});

	it('should call send password reset email unsuccessfully with error response as reason', function(done) {
		var auth = WeDeploy.auth();
		var responseErrorObject = {
			error: true
		};
		RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
			'content-type': 'application/json'
		});
		auth
			.sendPasswordResetEmail('email@domain.com')
			.catch((reason) => {
				assert.deepEqual(responseErrorObject, reason);
				done();
			});
	});

	it('should throws exception when calling create user with user data not specified', function() {
		assert.throws(() => WeDeploy.auth().createUser(), Error);
	});

	it('should throws exception when calling create user with user data not an object', function() {
		assert.throws(() => WeDeploy.auth().createUser(''), Error);
	});

	it('should call create user successfully', function(done) {
		var auth = WeDeploy.auth('http://auth');
		RequestMock.intercept().reply(200);
		auth
			.createUser({})
			.then((user) => {
				assert.ok(user instanceof Auth);
				done();
			});
	});

	it('should call create user unsuccessfully', function(done) {
		var auth = WeDeploy.auth();
		RequestMock.intercept().reply(400);
		auth
			.createUser({})
			.catch(() => done());
	});

	it('should call create user unsuccessfully with error response as reason', function(done) {
		var auth = WeDeploy.auth();
		var responseErrorObject = {
			error: true
		};
		RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
			'content-type': 'application/json'
		});
		auth
			.createUser({})
			.catch((reason) => {
				assert.deepEqual(responseErrorObject, reason);
				done();
			});
	});

	it('should throws exception when calling sign-in with email and password when email not specified', function() {
		assert.throws(() => WeDeploy.auth().signInWithEmailAndPassword(), Error);
	});

	it('should throws exception when calling sign-in with email and password when password not specified', function() {
		assert.throws(() => WeDeploy.auth().signInWithEmailAndPassword('email@domain.com'), Error);
	});

	it('should call sign-in with email and password successfully', function(done) {
		var auth = WeDeploy.auth();
		auth.loadCurrentUser = () => new Auth();
		var authData = {
			access_token: 'xyz'
		};
		RequestMock.intercept().reply(200, JSON.stringify(authData), {
			'content-type': 'application/json'
		});
		auth
			.signInWithEmailAndPassword('email@domain.com', 'password')
			.then((user) => {
				assert.ok(user instanceof Auth);
				done();
			});
	});

	it('should call sign-in with email and password unsuccessfully', function(done) {
		var auth = WeDeploy.auth();
		RequestMock.intercept().reply(400);
		auth
			.signInWithEmailAndPassword('email@domain.com', 'wrongPassword')
			.catch(() => done());
	});

	it('should call sign-in with email and password unsuccessfully with error response as reason', function(done) {
		var auth = WeDeploy.auth();
		var responseErrorObject = {
			error: true
		};
		RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
			'content-type': 'application/json'
		});
		auth
			.signInWithEmailAndPassword('email@domain.com', 'wrongPassword')
			.catch((reason) => {
				assert.deepEqual(responseErrorObject, reason);
				done();
			});
	});

	it('should throws exception when calling sign-out without being signed-in', function() {
		assert.throws(() => WeDeploy.auth().signOut(), Error);
	});

	it('should call sign-out successfully', function(done) {
		var auth = WeDeploy.auth();
		auth.currentUser = {};
		RequestMock.intercept().reply(200);
		auth
			.signOut()
			.then(() => done());
	});

	it('should call sign-out unsuccessfully', function(done) {
		var auth = WeDeploy.auth();
		auth.currentUser = {};
		RequestMock.intercept().reply(400);
		auth
			.signOut()
			.catch(() => done());
	});

	it('should call sign-out unsuccessfully with error response as reason', function(done) {
		var auth = WeDeploy.auth();
		auth.currentUser = {};
		var responseErrorObject = {
			error: true
		};
		RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
			'content-type': 'application/json'
		});
		auth
			.signOut()
			.catch((reason) => {
				assert.deepEqual(responseErrorObject, reason);
				done();
			});
	});

	it('should throws exception when calling getUser without user id', function() {
		assert.throws(() => WeDeploy.auth().getUser(), Error);
	});

	it('should throws exception when calling getUser without being signed-in', function() {
		assert.throws(() => WeDeploy.auth().getUser('userId'), Error);
	});

	it('should call getUser successfully', function(done) {
		var auth = WeDeploy.auth();
		auth.currentUser = {};
		RequestMock.intercept().reply(200);
		auth
			.getUser('userId')
			.then(() => done());
	});

	it('should call getUser unsuccessfully', function(done) {
		var auth = WeDeploy.auth();
		auth.currentUser = {};
		RequestMock.intercept().reply(400);
		auth
			.getUser('userId')
			.catch(() => done());
	});

	it('should call getUser unsuccessfully with error response as reason', function(done) {
		var auth = WeDeploy.auth();
		auth.currentUser = {};
		var responseErrorObject = {
			error: true
		};
		RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
			'content-type': 'application/json'
		});
		auth
			.getUser('userId')
			.catch((reason) => {
				assert.deepEqual(responseErrorObject, reason);
				done();
			});
	});

	it('should load current user', function(done) {
		var auth = WeDeploy.auth('http://auth');
		var data = {
			createdAt: 'createdAt',
			email: 'email',
			id: 'id',
			name: 'name',
			photoUrl: 'photoUrl'
		};
		RequestMock.intercept().reply(200, JSON.stringify(data), {
			'content-type': 'application/json'
		});
		auth
			.loadCurrentUser('token')
			.then((user) => {
				assert.ok(user instanceof Auth);
				assert.strictEqual('createdAt', user.createdAt);
				assert.strictEqual('email', user.email);
				assert.strictEqual('id', user.id);
				assert.strictEqual('name', user.name);
				assert.strictEqual('photoUrl', user.photoUrl);
				assert.strictEqual('token', user.token);
				done();
			});
	});

	it('should throws exception when calling onSignIn without function callback', function() {
		assert.throws(() => WeDeploy.auth().signIn(), Error);
		assert.throws(() => WeDeploy.auth().signIn({}), Error);
	});

	it('should invokes callback when after a sign-in redirect', function() {
		globals.window = {
			location: {
				protocol: 'http:',
				host: 'currentUrl',
				pathname: '/',
				search: '?q=1',
				hash: '#access_token=xyz'
			},
			history: {
				pushState: () => {
					globals.window.location.hash = '';
				}
			}
		};
		assert.strictEqual('#access_token=xyz', globals.window.location.hash);
		WeDeploy.auth();
		assert.strictEqual('', globals.window.location.hash);
	});

	it('should not invoke callback without sign-in redirect', function() {
		globals.window = {
			location: {
				hash: ''
			}
		};
		var auth = WeDeploy.auth();
		auth.onSignIn(() => assert.fail());
	});

	it('should invokes callback when calling onSignIn after a signInWithEmailAndPassword', function(done) {
		var auth = WeDeploy.auth();
		auth.loadCurrentUser = (token) => Auth.create(token);
		var callback = sinon.stub();
		auth.onSignIn(callback);
		var data = {
			access_token: 'xyz'
		};
		RequestMock.intercept().reply(200, JSON.stringify(data), {
			'content-type': 'application/json'
		});
		auth
			.signInWithEmailAndPassword('email@domain.com', 'password')
			.then(() => {
				assert.strictEqual(1, callback.callCount);
				done();
			});
	});
});
