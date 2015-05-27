import LaunchpadClient from '../src/LaunchpadClient';
import Transport from '../src/Transport';

describe('LaunchpadClient', function () {

  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();

    var requests = this.requests = [];

    this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
    };
  });

  afterEach(function() {
    this.xhr.restore();
  });

  it('should throws exception when socket.io is not loaded', function() {
    assert.throws(function() {
      LaunchpadClient.url('/url').connect();
    }, Error);
  });

  it('should socket.io use path from client url', function(done) {
    window.io = function(url, opts) {
      assert.strictEqual('domain:8080', url);
      assert.deepEqual({ path: '/path' }, opts);
      done();
    }
    LaunchpadClient.url('http://domain:8080/path').connect();
    delete window.io;
  });

  it('should socket.io use path from client url and ignore from options', function(done) {
    window.io = function(url, opts) {
      assert.strictEqual('domain:8080', url);
      assert.deepEqual({ path: '/path' }, opts);
      done();
    }
    LaunchpadClient.url('http://domain:8080/path').connect({ path: '/ignore' });
    delete window.io;
  });

  it('should use different transport', function() {
    var transport = new Transport();
    var client = LaunchpadClient.url().use(transport);
    assert.strictEqual(transport, client.customTransport_);
    assert.ok(client instanceof LaunchpadClient);
  });

  it('should inherit parent transport', function() {
    var transport = new Transport();
    var parent = LaunchpadClient.url().use(transport);
    var child = parent.path('/path');
    assert.strictEqual(parent.customTransport_, child.customTransport_);
  });

  it('should send DELETE request', function(done) {
    LaunchpadClient.url('/url').delete().then(function(response) {
      assert.strictEqual('/url', response.request().url());
      assert.strictEqual('DELETE', response.request().method());
      assert.ok(!response.request().body());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send GET request', function(done) {
    LaunchpadClient.url('/url').get().then(function(response) {
      assert.strictEqual('/url', response.request().url());
      assert.strictEqual('GET', response.request().method());
      assert.ok(!response.request().body());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send POST request with body', function(done) {
    LaunchpadClient.url('/url').post('body').then(function(response) {
      assert.strictEqual('/url', response.request().url());
      assert.strictEqual('POST', response.request().method());
      assert.strictEqual('"body"', response.request().body());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send PUT request with body', function(done) {
    LaunchpadClient.url('/url').put('body').then(function(response) {
      assert.strictEqual('/url', response.request().url());
      assert.strictEqual('PUT', response.request().method());
      assert.strictEqual('"body"', response.request().body());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send PATCH request with body', function(done) {
    LaunchpadClient.url('/url').patch('body').then(function(response) {
      assert.strictEqual('/url', response.request().url());
      assert.strictEqual('PATCH', response.request().method());
      assert.strictEqual('"body"', response.request().body());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should create new client instance based on parent client', function() {
    var books = LaunchpadClient.url('/books');
    var book1 = books.path('/1');
    assert.notStrictEqual(book1, books);
    assert.strictEqual('/books', books.url());
    assert.strictEqual('/books/1', book1.url());
  });

  it('should send request to url without path', function(done) {
    LaunchpadClient.url('/url').get().then(function(response) {
      assert.strictEqual('/url', response.request().url());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send request to url with path', function(done) {
    LaunchpadClient.url('/url/a').get().then(function(response) {
      assert.strictEqual('/url/a', response.request().url());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send request with query string', function (done) {
    LaunchpadClient.url('/url/a')
      .query('query', 1)
      .get()
      .then(function(response) {
        assert.deepEqual([{name: 'query', value: 1}], response.request().queries());
        done();
      });
    this.requests[0].respond(200);
  });

  it('should send request with header string', function (done) {
    LaunchpadClient.url('/url/a')
      .header('header', 1)
      .get()
      .then(function(response) {
        assert.deepEqual([{name: 'Content-Type', value: 'application/json'}, {name: 'header', value: 1}], response.request().headers());
        done();
      });
    this.requests[0].respond(200);
  });

  it('should send request with multiple header of same name', function (done) {
    LaunchpadClient.url('/url/a')
      .header('header', 1)
      .header('header', 2)
      .get()
      .then(function(response) {
        assert.deepEqual([{name: 'Content-Type', value: 'application/json'}, {name: 'header', value: 1}, {name: 'header', value: 2}], response.request().headers());
        done();
      });
    this.requests[0].respond(200);
  });

  it('should serialize body of json requests', function(done) {
    LaunchpadClient.url('/url').header('Content-Type', 'application/json').post({ foo: 1 }).then(function(response) {
      assert.strictEqual('{"foo":1}', response.request().body());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should deserialize body of json responses', function(done) {
    LaunchpadClient.url('/url').get().then(function(response) {
      assert.deepEqual({ foo: 1 }, response.body());
      done();
    });
    this.requests[0].respond(200, { 'Content-Type': 'application/json' }, '{"foo": 1}');
  });

  it('should throws exception for invalid constructor', function() {
    assert.throws(function() {
      new LaunchpadClient();
    }, Error);
  });

  it('should throws exception for invalid query arguments', function() {
    assert.throws(function() {
      LaunchpadClient.url('/url').query();
    }, Error);

    assert.throws(function() {
      LaunchpadClient.url('/url').query('name');
    }, Error);
  });

  it('should throws exception for invalid header arguments', function() {
    assert.throws(function() {
      LaunchpadClient.url('/url').header();
    }, Error);

    assert.throws(function() {
      LaunchpadClient.url('/url').header('name');
    }, Error);
  });

  it('should throws exception for invalid header arguments', function() {
    assert.throws(function() {
      LaunchpadClient.url('/url').header();
    }, Error);

    assert.throws(function() {
      LaunchpadClient.url('/url').header('name');
    }, Error);
  });
});
