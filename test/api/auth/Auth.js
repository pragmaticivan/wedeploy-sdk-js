'use strict';

import Auth from '../../../src/api/auth/Auth';
import WeDeploy from '../../../src/api/WeDeploy';

describe('Auth', function() {
  before(function() {
    WeDeploy.auth('http://localhost');
  });

  beforeEach(function() {
    RequestMock.setup();
  });

  afterEach(function() {
    RequestMock.teardown();
  });

  describe('instance', function() {
    it('should create Auth instance with a token', function() {
      const auth = Auth.create('My Token');
      assert.ok(auth.hasToken());
      assert.strictEqual('My Token', auth.token);
      assert.strictEqual('My Token', auth.getToken());
    });

    it('should create Auth instance with email and password', function() {
      const auth = Auth.create('email', 'password');
      assert.ok(auth.hasEmail());
      assert.ok(auth.hasPassword());
      assert.strictEqual('email', auth.email);
      assert.strictEqual('email', auth.getEmail());
      assert.strictEqual('password', auth.password);
      assert.strictEqual('password', auth.getPassword());
    });

    it('should create Auth instance and set other fields', function() {
      const auth = Auth.create();
      auth.setCreatedAt('createdAt');
      auth.setId('id');
      auth.setName('name');
      auth.setPassword('password');
      auth.setPhotoUrl('photoUrl');
      auth.setSupportedScopes(['admin']);
      assert.ok(auth.hasCreatedAt());
      assert.ok(auth.hasId());
      assert.ok(auth.hasName());
      assert.ok(auth.hasPassword());
      assert.ok(auth.hasPhotoUrl());
      assert.ok(auth.hasSupportedScopes('admin'));
      assert.ok(auth.hasSupportedScopes(['admin']));
      assert.ok(!auth.hasSupportedScopes(['admin', 'invalid']));
      assert.strictEqual('createdAt', auth.createdAt);
      assert.strictEqual('id', auth.id);
      assert.strictEqual('name', auth.name);
      assert.strictEqual('password', auth.password);
      assert.strictEqual('photoUrl', auth.photoUrl);
      assert.strictEqual('createdAt', auth.getCreatedAt());
      assert.strictEqual('id', auth.getId());
      assert.strictEqual('name', auth.getName());
      assert.strictEqual('password', auth.getPassword());
      assert.strictEqual('photoUrl', auth.getPhotoUrl());
      assert.deepEqual(['admin'], auth.getSupportedScopes());
    });
  });

  describe('Auth.updateUser', function() {
    it('should throws exception when calling updateUser without data', function() {
      const auth = Auth.create();
      auth.setWedeployClient(WeDeploy);
      assert.throws(() => auth.updateUser(), Error);
    });

    it('should throws exception when calling updateUser without data', function() {
      const auth = Auth.create();
      auth.setWedeployClient(WeDeploy);
      assert.throws(() => auth.updateUser(), Error);
    });

    it('should call updateUser successfully', function(done) {
      const auth = Auth.create();
      auth.setId(3);

      auth.setWedeployClient(WeDeploy);
      RequestMock.intercept('PATCH', 'http://localhost/users/3').reply(200);
      auth.updateUser({}).then(() => done());
    });

    it('should call updateUser unsuccessfully', function(done) {
      const auth = Auth.create();
      auth.setId(3);

      auth.setWedeployClient(WeDeploy);
      RequestMock.intercept('PATCH', 'http://localhost/users/3').reply(400);
      auth.updateUser({}).catch(() => done());
    });

    it('should call updateUser unsuccessfully with error response as reason', function(
      done
    ) {
      const auth = Auth.create();
      auth.setId(3);

      auth.setWedeployClient(WeDeploy);
      auth.currentUser = {};
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept(
        'PATCH',
        'http://localhost/users/3'
      ).reply(400, JSON.stringify(responseErrorObject), {
        'content-type': 'application/json',
      });

      auth.updateUser({}).catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });
  });

  describe('Auth.deleteUser', function() {
    it('should throws exception when calling deleteUser without user having id', function() {
      const auth = Auth.create();
      auth.setWedeployClient(WeDeploy);
      assert.throws(() => auth.deleteUser(), Error);
    });

    it('should call deleteUser successfully', function(done) {
      const auth = Auth.create();
      auth.setId('id');
      auth.setWedeployClient(WeDeploy);
      RequestMock.intercept('DELETE', 'http://localhost/users/id').reply(200);
      auth.deleteUser().then(() => done());
    });

    it('should call deleteUser unsuccessfully', function(done) {
      const auth = Auth.create();
      auth.setId('id');
      auth.setWedeployClient(WeDeploy);
      RequestMock.intercept('DELETE', 'http://localhost/users/id').reply(400);
      auth.deleteUser().catch(() => done());
    });

    it('should call deleteUser unsuccessfully with error response as reason', function(
      done
    ) {
      const auth = Auth.create();
      auth.setId('id');
      auth.setWedeployClient(WeDeploy);
      const responseErrorObject = {
        error: true,
      };
      RequestMock.intercept(
        'DELETE',
        'http://localhost/users/id'
      ).reply(400, JSON.stringify(responseErrorObject), {
        'content-type': 'application/json',
      });
      auth.deleteUser().catch(reason => {
        assert.deepEqual(responseErrorObject, reason);
        done();
      });
    });
  });
});
