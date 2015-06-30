import AjaxTransport from '../src/AjaxTransport';
import Request from '../src/Request';

describe('AjaxTransport', function() {

	beforeEach(function() {
		this.xhr = sinon.useFakeXMLHttpRequest();

		var requests = this.requests = [];

		this.xhr.onCreate = function(xhr) {
			requests.push(xhr);
		};
	});

	afterEach(function() {
		this.xhr.restore();
	});

	it('should send request to an url', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		transport.send(request).then(function(response) {
			assert.strictEqual('/url', response.request().url());
			done();
		});
		this.requests[0].respond(200);
	});

	it('should send request with different http method', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		request.method('POST');
		transport.send(request).then(function(response) {
			assert.strictEqual('POST', response.request().method());
			done();
		});
		this.requests[0].respond(200);
	});

	it('should send request with body', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		request.body('requestBody');
		transport.send(request).then(function(response) {
			assert.strictEqual('requestBody', response.request().body());
			assert.strictEqual('responseBody', response.body());
			done();
		});
		this.requests[0].respond(200, null, 'responseBody');
	});

	it('should send request with query string', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		request.query('query', 1);
		transport.send(request).then(function(response) {
			assert.strictEqual('{"query":[1]}', response.request().queries().toString());
			done();
		});
		this.requests[0].respond(200);
	});

	it('should send request with header', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		request.header('content-type', 'application/json');
		transport.send(request).then(function(response) {
			assert.strictEqual('{"content-type":["application/json"]}', response.request().headers().toString());
			done();
		});
		this.requests[0].respond(200);
	});

	it('should send request with multiple header of same name', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		var headers = request.headers();
		headers.add('content-type', 'application/json');
		headers.add('content-type', 'text/html');
		transport.send(request).then(function(response) {
			assert.strictEqual('{"content-type":["application/json","text/html"]}', response.request().headers().toString());
			done();
		});
		this.requests[0].respond(200);
	});

	it('should response with headers', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		transport.send(request).then(function(response) {
			assert.strictEqual('{"content-type":["application/json"]}', response.headers().toString());
			done();
		});
		this.requests[0].respond(200, {
			'content-type': 'application/json'
		});
	});

	it('should response success with status code 200', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		transport.send(request).then(function(response) {
			assert.strictEqual(200, response.statusCode());
			done();
		});
		this.requests[0].respond(200);
	});

	it('should response success with status code 204', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		transport.send(request).then(function(response) {
			assert.strictEqual(204, response.statusCode());
			done();
		});
		this.requests[0].respond(204);
	});

	it('should response success with status code 304', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		transport.send(request).then(function(response) {
			assert.strictEqual(304, response.statusCode());
			done();
		});
		this.requests[0].respond(304);
	});

	it('should error with any other status code than 200 or 304', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url');
		transport.send(request).catch(function(reason) {
			assert.ok(reason instanceof Error);
			done();
		});
		this.requests[0].respond(500);
	});

	it('should parse request query string', function(done) {
		var transport = new AjaxTransport();
		var request = new Request();
		request.url('/url?foo=1');
		request.queries().add('query', 1);
		request.queries().add('query', ' ');
		transport.request(
			request.url(), request.method(), null, null,
			request.queries(), null, false).then(function(xhrResponse) {
			assert.strictEqual('/url?foo=1&query=1&query=%20', xhrResponse.url);
			done();
		});
		this.requests[0].respond(200);
	});

});
