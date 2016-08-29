'use strict';

import Auth from '../../src/api/auth/Auth';
import Embodied from '../../src/api-query/Embodied';
import Filter from '../../src/api-query/Filter';
import WeDeploy from '../../src/api/WeDeploy';
import Transport from '../../src/api/Transport';

describe('WeDeploy', function() {
	beforeEach(RequestMock.setup);
	afterEach(RequestMock.teardown);

	it('should throw exception when socket.io is not loaded', function() {
		WeDeploy.socket();
		assert.throws(function() {
			WeDeploy.url('http://localhost/url').watch();
		}, Error);
	});

	it('should socket.io use path from client url', function(done) {
		WeDeploy.socket(function(url, opts) {
			assert.strictEqual('domain:8080', url);
			assert.deepEqual({
				forceNew: true,
				path: '/path/a',
				query: 'url=' + encodeURIComponent('/path/a?foo=1')
			}, opts);
			done();
		});
		WeDeploy.url('http://domain:8080/path/a?foo=1').watch();
		WeDeploy.socket();
	});

	it('should socket.io ignore path from client url and use from options', function(done) {
		WeDeploy.socket(function(url, opts) {
			assert.strictEqual('domain:8080', url);
			assert.deepEqual({
				path: '/new',
				query: 'url=' + encodeURIComponent('/path/a')
			}, opts);
			done();
		});
		WeDeploy.url('http://domain:8080/path/a').watch(null, {
			path: '/new'
		});
		WeDeploy.socket();
	});

	it('should use different transport', function() {
		var transport = new Transport();
		var client = WeDeploy.url().use(transport);
		assert.strictEqual(transport, client.customTransport_);
		assert.ok(client instanceof WeDeploy);
	});

	it('should change full url', function() {
		var transport = new Transport();
		var parent = WeDeploy.url('http://other:123').use(transport);
		assert.strictEqual('http://other:123', parent.url());
	});

	it('should inherit parent transport', function() {
		var transport = new Transport();
		var parent = WeDeploy.url().use(transport);
		var child = parent.path('/path');
		assert.strictEqual(parent.customTransport_, child.customTransport_);
	});

	it('should send DELETE request', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url')
			.delete('body')
			.then(function(response) {
				assert.strictEqual('http://localhost/url', response.request().url());
				assert.strictEqual('DELETE', response.request().method());
				assert.strictEqual('"body"', response.request().body());
				done();
			});
	});

	it('should send GET request', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').get().then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('GET', response.request().method());
			assert.ok(!response.request().body());
			done();
		});
	});

	it('should send GET request with params as object', function(done) {
		RequestMock.intercept().reply(200);
		var params = {
			foo: 'foo',
			bar: 'bar'
		};
		WeDeploy.url('http://localhost/url').get(params).then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('GET', response.request().method());
			assert.ok(!response.request().body());
			assert.strictEqual('{"foo":["foo"],"bar":["bar"]}', response.request().params().toString());
			done();
		});
	});

	it('should send GET request with params as Embodied', function(done) {
		class TestParams extends Embodied {
			constructor() {
				super();
				this.body_.foo = 'foo';
				this.body_.bar = ['bar1', 'bar2'];
			}
		}

		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').get(new TestParams()).then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('GET', response.request().method());
			assert.ok(!response.request().body());
			assert.strictEqual('{"foo":["foo"],"bar":["[\\"bar1\\",\\"bar2\\"]"]}', response.request().params().toString());
			done();
		});
	});

	it('should transform Filter into Query when sending via GET', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').get(Filter.field('name', 'foo')).then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('GET', response.request().method());
			assert.ok(!response.request().body());
			var paramsStr = '{"filter":["[{\\"name\\":{\\"operator\\":\\"=\\",\\"value\\":\\"foo\\"}}]"]}';
			assert.strictEqual(paramsStr, response.request().params().toString());
			done();
		});
	});

	it('should send GET request with params as string', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').get('strBody').then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('GET', response.request().method());
			assert.ok(!response.request().body());
			assert.strictEqual('{"body":["strBody"]}', response.request().params().toString());
			done();
		});
	});

	it('should send POST request with body', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').post('body').then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('POST', response.request().method());
			assert.strictEqual('"body"', response.request().body());
			done();
		});
	});

	it('should send PUT request with body', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').put('body').then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('PUT', response.request().method());
			assert.strictEqual('"body"', response.request().body());
			done();
		});
	});

	it('should send PATCH request with body', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').patch('body').then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('PATCH', response.request().method());
			assert.strictEqual('"body"', response.request().body());
			done();
		});
	});

	it('should send request with body that was previously set through "body" function', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').body('body').post().then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('POST', response.request().method());
			assert.strictEqual('"body"', response.request().body());
			done();
		});
	});

	it('should give precedence to body passed to the request call', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').body('body').post('postBody').then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			assert.strictEqual('POST', response.request().method());
			assert.strictEqual('"postBody"', response.request().body());
			done();
		});
	});

	it('should create new client instance based on parent client', function() {
		var books = WeDeploy.url('http://localhost/books');
		var book1 = books.path('/1', '/2', '3');
		assert.notStrictEqual(book1, books);
		assert.strictEqual('http://localhost/books', books.url());
		assert.strictEqual('http://localhost/books/1/2/3', book1.url());
	});

	it('should send request to url without path', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').get().then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			done();
		});
	});

	it('should send request to url with path', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url/a').get().then(function(response) {
			assert.strictEqual('http://localhost/url/a', response.request().url());
			done();
		});
	});

	it('should send request with query string', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url/a')
			.param('query', 1)
			.get()
			.then(function(response) {
				assert.strictEqual('{"query":[1]}', response.request().params().toString());
				done();
			});
	});

	it('should send request with query as Embodied', function(done) {
		class TestParam extends Embodied {
			constructor() {
				super();
				this.body_.foo = 'foo';
			}
		}
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url/a')
			.param('query', new TestParam())
			.get()
			.then(function(response) {
				assert.strictEqual('{"query":["{\\"foo\\":\\"foo\\"}"]}', response.request().params().toString());
				done();
			});
	});

	it('should send request with header string', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url/a')
			.header('header', 1)
			.get()
			.then(function(response) {
				assert.strictEqual('{"content-type":["application/json"],"x-requested-with":["XMLHttpRequest"],"header":[1]}', response.request().headers().toString());
				done();
			});
	});

	it('should send request with multiple header of same name', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url/a')
			.header('header', 1)
			.header('header', 2)
			.get()
			.then(function(response) {
				assert.strictEqual('{"content-type":["application/json"],"x-requested-with":["XMLHttpRequest"],"header":[2]}', response.request().headers().toString());
				done();
			});
	});

	it('should send request with authorization token', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url/a')
			.auth('My Token')
			.get()
			.then(function(response) {
				assert.strictEqual('Bearer My Token', response.request().headers().get('Authorization'));
				done();
			});
	});

	it('should send request with authorization username and password', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url/a')
			.auth('username', 'password')
			.get()
			.then(function(response) {
				assert.strictEqual(0, response.request().headers().get('Authorization').indexOf('Basic '));
				done();
			});
	});

	it('should send request with authorization info from Auth instance', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url/a')
			.auth(Auth.create('My Token'))
			.get()
			.then(function(response) {
				assert.strictEqual('Bearer My Token', response.request().headers().get('Authorization'));
				done();
			});
	});

	it('should serialize body of json requests', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').header('content-type', 'application/json').post({
			foo: 1
		}).then(function(response) {
			assert.strictEqual('{"foo":1}', response.request().body());
			done();
		});
	});

	it('should deserialize body of json responses', function(done) {
		RequestMock.intercept().reply(200, '{"foo": 1}', {
			'content-type': 'application/json'
		});
		WeDeploy.url('http://localhost/url').get().then(function(response) {
			assert.deepEqual({
				foo: 1
			}, response.body());
			done();
		});
	});

	it('should support FormData as request body', function(done) {
		if (typeof window === 'undefined') {
			done();
			return;
		}

		RequestMock.intercept().reply(200);
		var formData = new FormData();
		WeDeploy.url('http://localhost/url').post(formData).then(function(response) {
			assert.strictEqual(formData, response.request().body());
			assert.strictEqual(undefined, response.request().headers().get('content-type'));
			done();
		});
	});

	it('should support Embodied as request body', function(done) {
		class TestBody extends Embodied {
			constructor() {
				super();
				this.body_ = {
					foo: 'foo'
				};
			}
		}

		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').post(new TestBody()).then(function(response) {
			assert.strictEqual('{"foo":"foo"}', response.request().body());
			done();
		});
	});

	it('should wrap Filter in query when passed as request body', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').post(Filter.field('name', 'foo')).then(function(response) {
			var bodyStr = '{"filter":[{"name":{"operator":"=","value":"foo"}}]}';
			assert.strictEqual(bodyStr, response.request().body());
			done();
		});
	});

	it('should wrap dom element request body as form data', function(done) {
		if (typeof window === 'undefined') {
			done();
			return;
		}

		RequestMock.intercept().reply(200);
		var form = document.createElement('form');
		WeDeploy.url('http://localhost/url').post(form).then(function(response) {
			assert.ok(response.request().body() instanceof FormData);
			done();
		});
	});

	it('should send data passed through "form" method as FormData object via the body', function(done) {
		if (typeof window === 'undefined') {
			done();
			return;
		}

		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').form('age', 12).form('weight', 100).post().then(function(response) {
			var body = response.request().body();
			assert.ok(body instanceof FormData);
			assert.strictEqual(undefined, response.request().headers().get('content-type'));
			done();
		});
	});

	it('should not allow FormData when it is not implemented (such as on Node)', function(done) {
		if (typeof FormData === 'undefined') {
			assert.throws(function() {
				WeDeploy.url('http://localhost/url').form('a', 'b');
			}, Error);
			done();
			return;
		}

		done();
	});

	it('should not send data passed through "form" method via the body if the body is already set', function(done) {
		if (typeof window === 'undefined') {
			done();
			return;
		}

		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').form('age', 12).post({}).then(function(response) {
			var body = response.request().body();
			assert.ok(!(body instanceof FormData));
			assert.strictEqual('{}', body);
			done();
		});
	});

	it('should response succeeded for status codes 2xx', function(done) {
		RequestMock.intercept().reply(200);
		WeDeploy.url('http://localhost/url').get().then(function(response) {
			assert.ok(response.succeeded());
			done();
		});
	});

	it('should response succeeded for status codes 3xx', function(done) {
		RequestMock.intercept().reply(300);
		WeDeploy.url('http://localhost/url').get().then(function(response) {
			assert.ok(response.succeeded());
			done();
		});
	});

	it('should response not succeeded for status codes 4xx', function(done) {
		RequestMock.intercept().reply(400);
		WeDeploy.url('http://localhost/url').get().then(function(response) {
			assert.ok(!response.succeeded());
			done();
		});
	});

	it('should response not succeeded for status codes 5xx', function(done) {
		RequestMock.intercept().reply(500);
		WeDeploy.url('http://localhost/url').get().then(function(response) {
			assert.ok(!response.succeeded());
			done();
		});
	});

	it('should throws exception for invalid constructor', function() {
		assert.throws(function() {
			new WeDeploy();
		}, Error);
	});

	it('should throws exception for invalid query arguments', function() {
		assert.throws(function() {
			WeDeploy.url('http://localhost/url').param();
		}, Error);

		assert.throws(function() {
			WeDeploy.url('http://localhost/url').param('name');
		}, Error);
	});

	it('should throws exception for invalid header arguments', function() {
		assert.throws(function() {
			WeDeploy.url('http://localhost/url').header();
		}, Error);

		assert.throws(function() {
			WeDeploy.url('http://localhost/url').header('name');
		}, Error);
	});

	it('should throws exception for invalid header arguments', function() {
		assert.throws(function() {
			WeDeploy.url('http://localhost/url').header();
		}, Error);

		assert.throws(function() {
			WeDeploy.url('http://localhost/url').header('name');
		}, Error);
	});
});
