'use strict';

import globals from '../../../src/globals/globals';
import Auth from '../../../src/api/auth/Auth';
import GithubAuthProvider from '../../../src/api/auth/GithubAuthProvider';
import GoogleAuthProvider from '../../../src/api/auth/GoogleAuthProvider';
import WeDeploy from '../../../src/api/WeDeploy';

/* eslint-disable max-len,require-jsdoc */
describe('AuthApiHelper', function() {
  afterEach(function() {
    WeDeploy.auth_ = null;
    if (typeof window === 'undefined') {
      globals.window = null;
    } else {
      globals.window = window;
      globals.window.localStorage.currentUser = null;
    }
    if (typeof document === 'undefined') {
      globals.document = null;
    } else {
      globals.document = document;
    }
    RequestMock.teardown();
  });

  beforeEach(function() {
    WeDeploy.auth('http://localhost');
    RequestMock.setup('GET', 'http://localhost/users/id');
  });

  it('should WeDeploy.auth() returns same instance', function() {
    const auth = WeDeploy.auth();
    assert.strictEqual(auth, WeDeploy.auth());
  });

  it('should WeDeploy.auth() use current user information', function(done) {
    RequestMock.intercept().reply(200);
    WeDeploy.auth().currentUser = Auth.create('token1');
    WeDeploy.auth().getUser('id').then(() => {
      assert.strictEqual(getAuthorizationHeader_(), 'Bearer token1');
      done();
    });
  });

  it('should WeDeploy.auth() use auth scope instead of current user information', function(
    done
  ) {
    RequestMock.intercept().reply(200);
    WeDeploy.auth().currentUser = Auth.create('token1');
    WeDeploy.auth().auth('token2').getUser('id').then(() => {
      assert.strictEqual(getAuthorizationHeader_(), 'Bearer token2');
      done();
    });
  });

  it('should set header to WeDeploy.auth() when getUser is invoked', function(
    done
  ) {
    RequestMock.intercept().reply(200);
    WeDeploy.auth().currentUser = Auth.create('token1');
    WeDeploy.auth().header('TestHost', 'localhost').getUser('id').then(() => {
      assert.strictEqual(getTestHostHeader_(), 'localhost');
      done();
    });
  });

  it('should map providers', function() {
    const auth = WeDeploy.auth();
    assert.ok(auth.provider.Google);
    assert.ok(auth.provider.Github);
    assert.ok(auth.provider.Facebook);
  });

  describe(
    'Sign in with redirect',
    skipForNode_(function() {
      it('should throw exception when signin-in with redirect using null provider', function() {
        const auth = WeDeploy.auth();
        assert.throws(function() {
          auth.signInWithRedirect(null);
        }, Error);
      });

      it('should throw exception signing-in with redirect using not supported sign-in type for the environment', function() {
        const auth = WeDeploy.auth();
        assert.throws(function() {
          auth.signInWithRedirect(undefined);
        }, Error);
      });

      it('should fail sign-in with redirect using not supported provider', function() {
        const auth = WeDeploy.auth();
        assert.throws(function() {
          auth.signInWithRedirect({});
        }, Error);
      });

      it('should not fail sign-in with redirect using Github provider', function() {
        const auth = WeDeploy.auth();
        globals.window = {
          location: {
            href: '',
          },
        };
        assert.doesNotThrow(function() {
          auth.signInWithRedirect(new GithubAuthProvider());
        });
      });

      it('should not fail sign-in with redirect using Google provider', function() {
        const auth = WeDeploy.auth();
        globals.window = {
          location: {
            href: '',
          },
        };
        assert.doesNotThrow(function() {
          auth.signInWithRedirect(new GoogleAuthProvider());
        });
      });

      it('should sign-in with redirect forward location to provider authorization url with current url without hash as redirect uri', function() {
        const auth = WeDeploy.auth('http://currentUrl');
        globals.window = {
          location: {
            protocol: 'http:',
            host: 'currentUrl',
            pathname: '/',
            search: '?q=1',
            hash: '#hash',
          },
        };
        const provider = new GithubAuthProvider();
        assert.ok(!provider.hasRedirectUri());
        auth.signInWithRedirect(provider);
        assert.strictEqual('http://currentUrl/?q=1', provider.getRedirectUri());
        assert.strictEqual(
          provider.makeAuthorizationUrl('http://currentUrl'),
          globals.window.location.href
        );
      });

      it('should sign-in with redirect forward location to provider authorization url and preserve redirect uri', function() {
        const auth = WeDeploy.auth('http://currentUrl');
        globals.window = {
          location: {
            href: 'http://currentUrl',
          },
        };
        const provider = new GithubAuthProvider();
        provider.setRedirectUri('http://customUrl');
        auth.signInWithRedirect(provider);
        assert.strictEqual('http://customUrl', provider.getRedirectUri());
        assert.strictEqual(
          provider.makeAuthorizationUrl('http://currentUrl'),
          globals.window.location.href
        );
      });
    })
  );

  describe('Password reset', function() {
    beforeEach(function() {
      RequestMock.setup(
        'POST',
        'http://localhost/user/recover?email=email%40domain.com'
      );
    });

    it('should throw exception when calling when sending password reset with email not specified', function() {
      assert.throws(() => WeDeploy.auth().sendPasswordResetEmail(), Error);
    });

    it('should call send password reset email successfully', function(done) {
      const auth = WeDeploy.auth();
      RequestMock.intercept().reply(200);
      auth.sendPasswordResetEmail('email@domain.com').then(() => done());
    });

    it('should call send password reset email unsuccessfully', function(done) {
      const auth = WeDeploy.auth();
      RequestMock.intercept().reply(400);
      auth.sendPasswordResetEmail('email@domain.com').catch(() => done());
    });

    it('should call send password reset email with email as parameter', function(
      done
    ) {
      const auth = WeDeploy.auth();
      RequestMock.intercept().reply(200);
      auth.sendPasswordResetEmail('email@domain.com').then(response => {
        assert.strictEqual(
          'email@domain.com',
          response.request().params().get('email')
        );
        done();
      });
    });

    it('should call send password reset email unsuccessfully with error response as reason', function(
      done
    ) {
      const auth = WeDeploy.auth();
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
        'content-type': 'application/json',
      });
      auth.sendPasswordResetEmail('email@domain.com').catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });

    it('should set header on sending password reset email', function(done) {
      const auth = WeDeploy.auth().header('TestHost', 'localhost');
      RequestMock.intercept().reply(200);
      auth.sendPasswordResetEmail('email@domain.com').then(response => {
        assert.strictEqual(getTestHostHeader_(), 'localhost');

        done();
      });
    });
  });

  describe('Create user', function() {
    beforeEach(function() {
      RequestMock.setup('POST', 'http://localhost/users');
    });

    it('should throw exception when calling create user with user data not specified', function() {
      assert.throws(() => WeDeploy.auth().createUser(), Error);
    });

    it('should throw exception when calling create user with user data not an object', function() {
      assert.throws(() => WeDeploy.auth().createUser(''), Error);
    });

    it('should call create user successfully', function(done) {
      const auth = WeDeploy.auth('http://auth');
      RequestMock.intercept('POST', 'http://auth/users').reply(200);
      auth.createUser({}).then(user => {
        assert.ok(user instanceof Auth);
        done();
      });
    });

    it('should call create user successfully 123', function(done) {
      const auth = WeDeploy.auth('http://auth');
      RequestMock.intercept('POST', 'http://auth/users').reply(200);
      auth.auth('token1');
      auth.createUser({}).then(() => {
        assert.strictEqual(getAuthorizationHeader_(), 'Bearer token1');
        done();
      });
    });

    it('should call create user unsuccessfully', function(done) {
      const auth = WeDeploy.auth();
      RequestMock.intercept().reply(400);
      auth.createUser({}).catch(() => done());
    });

    it('should call create user unsuccessfully with error response as reason', function(
      done
    ) {
      const auth = WeDeploy.auth();
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
        'content-type': 'application/json',
      });
      auth.createUser({}).catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });

    it('should set header on create user', function(done) {
      const auth = WeDeploy.auth('http://auth');
      RequestMock.intercept('POST', 'http://auth/users').reply(200);
      auth.header('TestHost', 'localhost').createUser({}).then(user => {
        assert.strictEqual(getTestHostHeader_(), 'localhost');
        done();
      });
    });
  });

  describe('Sign in with email and password', function() {
    beforeEach(function() {
      RequestMock.setup(
        'GET',
        'http://localhost/oauth/token?grant_type=password' +
          '&username=email%40domain.com&password=password'
      );
    });

    it('should throw exception when calling sign-in with email and password when email not specified', function() {
      assert.throws(() => WeDeploy.auth().signInWithEmailAndPassword(), Error);
    });

    it('should throw exception when calling sign-in with email and password when password not specified', function() {
      assert.throws(
        () => WeDeploy.auth().signInWithEmailAndPassword('email@domain.com'),
        Error
      );
    });

    it('should call sign-in with email and password successfully', function(
      done
    ) {
      const auth = WeDeploy.auth();
      auth.loadCurrentUser = () => new Auth();
      const authData = {
        access_token: 'xyz',
      };
      RequestMock.intercept().reply(200, JSON.stringify(authData), {
        'content-type': 'application/json',
      });
      auth
        .signInWithEmailAndPassword('email@domain.com', 'password')
        .then(user => {
          assert.ok(user instanceof Auth);
          done();
        });
    });

    it('should set header on sign-in with email and password', function(done) {
      const auth = WeDeploy.auth();
      auth.loadCurrentUser = () => new Auth();
      const authData = {
        access_token: 'xyz',
      };
      RequestMock.intercept().reply(200, JSON.stringify(authData), {
        'content-type': 'application/json',
      });
      auth
        .header('TestHost', 'localhost')
        .signInWithEmailAndPassword('email@domain.com', 'password')
        .then(user => {
          assert.strictEqual(getTestHostHeader_(), 'localhost');
          done();
        });
    });

    it('should call sign-in with email and password unsuccessfully', function(
      done
    ) {
      const auth = WeDeploy.auth();
      RequestMock.intercept().reply(400);
      auth
        .signInWithEmailAndPassword('email@domain.com', 'password')
        .catch(() => done());
    });

    it('should call sign-in with email and password unsuccessfully with error response as reason', function(
      done
    ) {
      const auth = WeDeploy.auth();
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
        'content-type': 'application/json',
      });
      auth
        .signInWithEmailAndPassword('email@domain.com', 'password')
        .catch(reason => {
          assert.deepEqual(responseErrorObject, reason);
          done();
        });
    });
  });

  describe('Sign out', function() {
    beforeEach(function() {
      RequestMock.setup('GET', 'http://localhost/oauth/revoke?token');
    });

    it('should throw exception when calling sign-out without being signed-in', function() {
      assert.throws(() => WeDeploy.auth().signOut(), Error);
    });

    it('should call sign-out successfully', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      RequestMock.intercept().reply(200);
      auth.signOut().then(() => done());
    });

    it('should call sign-out unsuccessfully', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      RequestMock.intercept().reply(400);
      auth.signOut().catch(() => done());
    });

    it('should call sign-out unsuccessfully with error response as reason', function(
      done
    ) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
        'content-type': 'application/json',
      });
      auth.signOut().catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });

    it('should set header to sign-out', function(done) {
      const auth = WeDeploy.auth().header('TestHost', 'localhost');
      auth.currentUser = {};
      RequestMock.intercept().reply(200);
      auth.signOut().then(response => {
        assert.strictEqual(getTestHostHeader_(), 'localhost');
        done();
      });
    });
  });

  describe('Get user', function() {
    beforeEach(function() {
      RequestMock.setup('GET', 'http://localhost/users/userId');
    });

    it('should throw exception when calling getUser without user id', function() {
      assert.throws(() => WeDeploy.auth().getUser(), Error);
    });

    it('should throw exception when calling getUser without being signed-in', function() {
      assert.throws(() => WeDeploy.auth().getUser('userId'), Error);
    });

    it('should call getUser successfully', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      RequestMock.intercept().reply(200);
      auth.getUser('userId').then(user => {
        assert.ok(user instanceof Auth);
        done();
      });
    });

    it('should call getUser unsuccessfully', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      RequestMock.intercept().reply(400);
      auth.getUser('userId').catch(() => done());
    });

    it('should call getUser unsuccessfully with error response as reason', function(
      done
    ) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
        'content-type': 'application/json',
      });
      auth.getUser('userId').catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });

    it('should set headers on getUser', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      RequestMock.intercept().reply(200);
      auth.header('TestHost', 'localhost').getUser('userId').then(user => {
        assert.strictEqual(getTestHostHeader_(), 'localhost');
        done();
      });
    });
  });

  describe('Get all users', function() {
    beforeEach(function() {
      RequestMock.setup('GET', 'http://localhost/users');
    });

    it('should throw exception when calling getAllUsers without user id', function() {
      assert.throws(() => WeDeploy.auth().getAllUsers(), Error);
    });

    it('should throw exception when calling getAllUsers without being signed-in', function() {
      assert.throws(() => WeDeploy.auth().getAllUser(), Error);
    });

    it('should call getAllUsers successfully', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      const user1 = {
        createdAt: 'createdAt1',
        email: 'email1',
        id: 'id1',
        name: 'name1',
        photoUrl: 'photoUrl1',
        extra: 'extra1',
      };
      const user2 = {
        createdAt: 'createdAt2',
        email: 'email2',
        id: 'id2',
        name: 'name2',
        photoUrl: 'photoUrl2',
        extra: 'extra2',
      };
      RequestMock.intercept().reply(200, JSON.stringify([user1, user2]), {
        'content-type': 'application/json',
      });
      auth.getAllUsers().then(users => {
        assert.ok(users instanceof Array);
        assert.ok(users[0] instanceof Auth);
        assert.ok(users[1] instanceof Auth);
        done();
      });
    });

    it('should call getAllUsers unsuccessfully', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      RequestMock.intercept().reply(400);
      auth.getAllUsers().catch(() => done());
    });
  });

  describe('delete User', function() {
    beforeEach(function() {
      RequestMock.setup('DELETE', 'http://localhost/users/id');
    });

    it('should throws exception when calling deleteUser without user having id', function() {
      const auth = WeDeploy.auth();
      assert.throws(() => auth.deleteUser('id'), Error);
    });

    it('should call deleteUser successfully', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      RequestMock.intercept('DELETE', 'http://localhost/users/id').reply(200);
      auth.deleteUser('id').then(() => done());
    });

    it('should call deleteUser unsuccessfully', function(done) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      RequestMock.intercept('DELETE', 'http://localhost/users/id').reply(400);
      auth.deleteUser('id').catch(() => done());
    });

    it('should call deleteUser unsuccessfully with error response as reason', function(
      done
    ) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept(
        'DELETE',
        'http://localhost/users/id'
      ).reply(400, JSON.stringify(responseErrorObject), {
        'content-type': 'application/json',
      });
      auth.deleteUser('id').catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });
  });

  describe('Load current user', function() {
    beforeEach(function() {
      RequestMock.setup('GET', 'http://auth/user');
    });

    it('should load current user', function(done) {
      const auth = WeDeploy.auth('http://auth');
      const data = {
        createdAt: 'createdAt',
        email: 'email',
        id: 'id',
        name: 'name',
        photoUrl: 'photoUrl',
        extra: 'extra',
      };
      RequestMock.intercept().reply(200, JSON.stringify(data), {
        'content-type': 'application/json',
      });
      auth.loadCurrentUser('token').then(user => {
        assert.ok(user instanceof Auth);
        assert.strictEqual('createdAt', user.createdAt);
        assert.strictEqual('email', user.email);
        assert.strictEqual('id', user.id);
        assert.strictEqual('name', user.name);
        assert.strictEqual('photoUrl', user.photoUrl);
        assert.strictEqual('token', user.token);
        assert.strictEqual('extra', user.extra);
        done();
      });
    });

    it('should load current user and set access token cookie', function(done) {
      globals.document = {
        cookie: '',
      };
      globals.window = {
        location: {
          hostname: 'localhost',
        },
      };
      RequestMock.intercept().reply(200, JSON.stringify({}), {
        'content-type': 'application/json',
      });
      WeDeploy.auth('http://auth').loadCurrentUser('xyz').then(() => {
        assert.strictEqual(
          'access_token=xyz; Domain=localhost;',
          globals.document.cookie
        );
        done();
      });
    });

    it('should set header when load current user is invoked', function(done) {
      RequestMock.intercept().reply(200, JSON.stringify({}), {
        'content-type': 'application/json',
      });
      WeDeploy.auth('http://auth')
        .header('TestHost', 'localhost')
        .loadCurrentUser('xyz')
        .then(() => {
          assert.strictEqual(getTestHostHeader_(), 'localhost');
          done();
        });
    });
  });

  describe('onSignIn and onSignOut', function() {
    it('should throw exception when calling onSignIn without function callback', function() {
      assert.throws(() => WeDeploy.auth().onSignIn(), Error);
      assert.throws(() => WeDeploy.auth().onSignIn({}), Error);
    });

    it('should throw exception when calling onSignOut without function callback', function() {
      assert.throws(() => WeDeploy.auth().onSignOut(), Error);
      assert.throws(() => WeDeploy.auth().onSignOut({}), Error);
    });

    it(
      'should invokes callback when after a sign-in redirect',
      skipForNode_(function() {
        WeDeploy.auth_ = null;
        globals.window = {
          location: {
            protocol: 'http:',
            host: 'currentUrl',
            pathname: '/',
            search: '?q=1',
            hash: '#access_token=xyz',
          },
          history: {
            pushState: () => {
              globals.window.location.hash = '';
            },
          },
        };
        assert.strictEqual('#access_token=xyz', globals.window.location.hash);
        WeDeploy.auth();
        assert.strictEqual('', globals.window.location.hash);
      })
    );

    it('should not invoke callback without sign-in redirect', function() {
      globals.window = {
        location: {
          hash: '',
        },
      };
      const auth = WeDeploy.auth();
      auth.onSignIn(() => assert.fail());
    });

    it('should invokes callback when calling onSignIn after a signInWithEmailAndPassword', function(
      done
    ) {
      const auth = WeDeploy.auth();
      auth.loadCurrentUser = token => Auth.create(token);
      const callback = sinon.stub();
      auth.onSignIn(callback);
      const data = {
        access_token: 'xyz',
      };

      const url =
        'http://localhost/oauth/token?grant_type=password' +
        '&username=email%40domain.com&password=password';
      RequestMock.intercept('GET', url).reply(200, JSON.stringify(data), {
        'content-type': 'application/json',
      });
      auth
        .signInWithEmailAndPassword('email@domain.com', 'password')
        .then(() => {
          assert.strictEqual(1, callback.callCount);
          done();
        });
    });

    it('should invokes callback when calling onSignOut after a signOut', function(
      done
    ) {
      const auth = WeDeploy.auth();
      auth.currentUser = {};
      const callback = sinon.stub();
      auth.onSignOut(callback);
      RequestMock.intercept('GET', 'http://localhost/oauth/revoke?token').reply(
        200
      );
      auth.signOut().then(() => {
        assert.strictEqual(1, callback.callCount);
        done();
      });
    });
  });

  describe('Verify token', function() {
    beforeEach(function() {
      RequestMock.setup('GET', 'http://auth/oauth/tokeninfo?token=token');
    });

    it('should verify token', function(done) {
      const auth = WeDeploy.auth('http://auth');
      const data = {
        access_token: 'token',
      };
      RequestMock.intercept().reply(200, JSON.stringify(data), {
        'content-type': 'application/json',
      });
      auth.verifyToken('token').then(tokeninfo => {
        assert.strictEqual('token', tokeninfo.access_token);
        assert.strictEqual(
          'http://auth/oauth/tokeninfo?token=token',
          RequestMock.getUrl()
        );
        done();
      });
    });

    it('should verify token failure', function(done) {
      const auth = WeDeploy.auth('http://auth');
      RequestMock.intercept().reply(400);
      auth.verifyToken('token').catch(() => done());
    });

    it('should throw exception if token not specified', function() {
      assert.throws(function() {
        WeDeploy.auth('http://auth').verifyToken();
      }, Error);
    });

    it('should set header to verify token method', function(done) {
      const auth = WeDeploy.auth('http://auth').header('TestHost', 'localhost');
      const data = {
        access_token: 'token',
      };
      RequestMock.intercept().reply(200, JSON.stringify(data), {
        'content-type': 'application/json',
      });
      auth.verifyToken('token').then(response => {
        assert.strictEqual(getTestHostHeader_(), 'localhost');
        done();
      });
    });
  });

  describe('Verify user', function() {
    beforeEach(function() {
      RequestMock.setup('GET', 'http://auth/user');
    });

    it('should verify user by credentials and respond with email and password passed as parameters', function(
      done
    ) {
      const auth = WeDeploy.auth('http://auth');
      const data = {
        token: 'token',
      };
      RequestMock.intercept().reply(200, JSON.stringify(data), {
        'content-type': 'application/json',
      });
      auth.verifyUser('email@domain.com', 'password').then(user => {
        assert.strictEqual('email@domain.com', user.email);
        assert.strictEqual('password', user.password);
        assert.strictEqual(null, user.token);
        done();
      });
    });

    it('should verify user by token and respond with token', function(done) {
      const auth = WeDeploy.auth('http://auth');
      const data = {
        token: 'token',
      };
      RequestMock.intercept().reply(200, JSON.stringify(data), {
        'content-type': 'application/json',
      });
      auth.verifyUser('token').then(user => {
        assert.strictEqual('token', user.token);
        done();
      });
    });

    it('should verify user failure', function(done) {
      const auth = WeDeploy.auth('http://auth');
      RequestMock.intercept().reply(400);
      auth.verifyUser('token').catch(() => done());
    });

    it('should throw exception if token not specified', function() {
      assert.throws(function() {
        WeDeploy.auth('http://auth').verifyUser();
      }, Error);
    });
  });
});

/**
 * Gets the "Authorization" header from the request object. Manages different
 * mock formats (browser vs node).
 * @return {?string}
 * @protected
 */
function getAuthorizationHeader_() {
  const request = RequestMock.get();
  const headers = request.requestHeaders || request.req.headers;
  return headers.Authorization || headers.authorization;
}

/**
 * Gets the "TestHost" header from the request object. Manages different
 * mock formats (browser vs node).
 * @return {?string}
 * @protected
 */
function getTestHostHeader_() {
  const request = RequestMock.get();
  const headers = request.requestHeaders || request.req.headers;
  return headers.TestHost || headers.testhost;
}

/**
 * Skips the given function if in Node environment. This is used to skip tests
 * for features that are browser only.
 * @param  {Function} fn
 * @return {[type]}
 */
function skipForNode_(fn) {
  return typeof window === 'undefined' ? () => {} : fn;
}
