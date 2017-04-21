'use strict';

import Auth from '../../../src/api/auth/Auth';
import WeDeploy from '../../../src/api/WeDeploy';

describe('EmailApiHelper', function() {
  afterEach(function() {
    WeDeploy.email_ = null;
    RequestMock.teardown();
  });

  beforeEach(function() {
    RequestMock.setup();
    WeDeploy.email('http://localhost');
  });

  describe('WeDeploy.email()', function() {
    it('should return the same instance', function() {
      let email = WeDeploy.email();
      assert.deepEqual(email, WeDeploy.email());
    });

    it('should return the instance with url filled', function() {
      let email = WeDeploy.email('http://host.com');
      assert.strictEqual(email.wedeployClient.emailUrl_, 'http://host.com');
    });

    it('should raise an error if the email url has a path', function() {
      assert.throws(function() {
        WeDeploy.email('http://email.project.wedeploy.me/extrapath');
      }, Error);
    });

    it('should return the instance of scoped auth', function() {
      WeDeploy.auth().currentUser = Auth.create('token');
      assert.strictEqual(
        WeDeploy.auth().currentUser,
        WeDeploy.email().helperAuthScope
      );
    });
  });

  describe('.from()', function() {
    it('should add "from" param into post form', function() {
      const email = WeDeploy.email().from('test@test.com');
      assert.deepEqual(
        {
          from: 'test@test.com',
        },
        email.params
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.from(null);
      }, Error);
    });
  });

  describe('.bcc()', function() {
    it('should add "bcc" param into post form', function() {
      const email = WeDeploy.email().bcc('test@test.com');
      assert.deepEqual(
        {
          bcc: 'test@test.com',
        },
        email.params
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.bcc(null);
      }, Error);
    });
  });

  describe('.cc()', function() {
    it('should add "cc" param into post form', function() {
      const email = WeDeploy.email().cc('test@test.com');
      assert.deepEqual(
        {
          cc: 'test@test.com',
        },
        email.params
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.cc(null);
      }, Error);
    });
  });

  describe('.message()', function() {
    it('should add "message" param into post form', function() {
      const email = WeDeploy.email().message('message');
      assert.deepEqual(
        {
          message: 'message',
        },
        email.params
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.message(null);
      }, Error);
    });
  });

  describe('.priority()', function() {
    it('should add "priority" param into post form', function() {
      const email = WeDeploy.email().priority('1');
      assert.deepEqual(
        {
          priority: '1',
        },
        email.params
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.priority(null);
      }, Error);
    });
  });

  describe('.replyTo()', function() {
    it('should add "replyTo" param into post form', function() {
      const email = WeDeploy.email().replyTo('test@test.com');
      assert.deepEqual(
        {
          replyTo: 'test@test.com',
        },
        email.params
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.replyTo(null);
      }, Error);
    });
  });

  describe('.to()', function() {
    it('should add "to" param into post form', function() {
      const email = WeDeploy.email().to('test@test.com');
      assert.deepEqual(
        {
          to: 'test@test.com',
        },
        email.params
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.to(null);
      }, Error);
    });
  });

  describe('.subject()', function() {
    it('should add subject param into post form', function() {
      const email = WeDeploy.email().subject('subject');
      assert.deepEqual(
        {
          subject: 'subject',
        },
        email.params
      );
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.subject(null);
      }, Error);
    });
  });

  describe('.send()', function() {
    it('should send an http request to the email path', function(done) {
      RequestMock.intercept('POST', 'http://localhost/emails').reply(
        200,
        '{"sent": "ok"}'
      );

      WeDeploy.email().from('test@test.com').send().then(result => {
        assert.equal('{"sent": "ok"}', result);
        done();
      });
    });
  });

  describe('.status()', function() {
    it('should send an http request to check the status of an email', function(
      done
    ) {
      RequestMock.intercept('GET', 'http://localhost/emails/xyz/status').reply(
        200,
        '{"sent": "ok"}'
      );

      WeDeploy.email().status('xyz').then(result => {
        assert.equal('{"sent": "ok"}', result);
        done();
      });
    });

    it('should fail if param is not specified', function() {
      const email = WeDeploy.email();
      assert.throws(function() {
        email.status(null);
      }, Error);
    });
  });
});
