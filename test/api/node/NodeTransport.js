'use strict';

import ClientRequest from '../../../src/api/ClientRequest';
import { MultiMap } from 'metal-structs';
import NodeTransport from '../../../src/api/node/NodeTransport';

describe('NodeTransport', function() {
	beforeEach(function() {
		RequestMock.setup('GET', 'http://localhost/url');
	});
	afterEach(RequestMock.teardown);

	it('should cancel send request to an url', function(done) {
		RequestMock.intercept().reply(200);
		var transport = new NodeTransport();
		var clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		transport.send(clientRequest)
			.then(function() {
				assert.fail();
			})
			.catch(function() {
				// assert that connection.abort was called as well
				done();
			})
			.cancel();
	});

	it('should send request with body', function(done) {
		RequestMock.intercept().reply(200, 'responseBody');
		var transport = new NodeTransport();
		var clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		clientRequest.body('requestBody');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('requestBody', response.request().body());
			assert.strictEqual('responseBody', response.body());
			done();
		});
	});

	it('should send request with header', function(done) {
		RequestMock.intercept().reply(200);
		var transport = new NodeTransport();
		var clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		clientRequest.header('content-type', 'application/json');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('{"content-type":["application/json"]}', response.request().headers().toString());
			done();
		});
	});

	it('should send request with multiple headers with same name', function(done) {
		RequestMock.intercept().reply(200, undefined, {
			'content-type': 'application/json'
		});

		var headers = new MultiMap();
		headers.add('content-type', 'application/json');
		headers.add('content-type', 'text/html');

		var transport = new NodeTransport();
		transport.request('http://localhost/url', 'get', null, headers)
			.then(function() {
				done();
			});
	});

	it('should response with headers', function(done) {
		RequestMock.intercept().reply(200, undefined, {
			'content-type': 'application/json'
		});
		var transport = new NodeTransport();
		var clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('{"content-type":["application/json"]}', response.headers().toString());
			done();
		});
	});

	it('should parse request query string', function(done) {
		RequestMock.intercept('GET', 'http://xyz/url?foo=1&query=1&query=%20').reply(200);
		var transport = new NodeTransport();
		var clientRequest = new ClientRequest();
		clientRequest.url('http://xyz/url?foo=1');
		clientRequest.params().add('query', 1);
		clientRequest.params().add('query', ' ');
		transport.request(
			clientRequest.url(), clientRequest.method(), null, null,
			clientRequest.params(), null, false)
			.then(function(xhrResponse) {
				assert.strictEqual(xhrResponse.request.uri.href, 'http://xyz/url?foo=1&query=1&query=%20');
				done();
			});
	});

	it('should parse request query string without params', function(done) {
		RequestMock.intercept('GET', 'http://localhost/url?foo=1').reply(200);
		var transport = new NodeTransport();
		var clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url?foo=1');
		transport.request(clientRequest.url(), clientRequest.method()).then(function(xhrResponse) {
			assert.strictEqual('http://localhost/url?foo=1', xhrResponse.request.uri.href);
			done();
		});
	});

	it('should cancel request if given timeout is reached', function(done) {
		RequestMock.intercept('GET', 'http://localhost/url?foo=1').socketDelay(5).reply(200);

		var transport = new NodeTransport();
		var clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url?foo=1');
		transport.request(
			clientRequest.url(),
			clientRequest.method(),
			null,
			null,
			null,
			1
		).then(function() {
			assert.fail();
		})
			.catch(function(e) {
				assert.strictEqual('ESOCKETTIMEDOUT', e.code);
				done();
			});
	});
});
