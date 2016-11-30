'use strict';

import ClientRequest from '../../src/api/ClientRequest';
import TransportFactory from '../../src/api/TransportFactory';

describe('Transport Tests', function() {
	beforeEach(function() {
		RequestMock.setup('GET', 'http://localhost/url');
	});
	afterEach(RequestMock.teardown);

	it('should send request to an url', function(done) {
		RequestMock.intercept().reply(200);
		const transport = TransportFactory.instance().getDefault();
		const clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('http://localhost/url', response.request().url());
			done();
		});
	});

	it('should send request with different http method', function(done) {
		RequestMock.intercept('POST', 'http://localhost/url').reply(200);
		const transport = TransportFactory.instance().getDefault();
		const clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		clientRequest.method('POST');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('POST', response.request().method());
			done();
		});
	});

	it('should send request with body', function(done) {
		RequestMock.intercept().reply(200, 'responseBody');
		const transport = TransportFactory.instance().getDefault();
		const clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		clientRequest.body('requestBody');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('requestBody', response.request().body());
			assert.strictEqual('responseBody', response.body());
			done();
		});
	});

	it('should send request with query string', function(done) {
		RequestMock.intercept('GET', 'http://localhost/url?query=1').reply(200);
		const transport = TransportFactory.instance().getDefault();
		const clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		clientRequest.param('query', 1);
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('{"query":[1]}', response.request().params().toString());
			done();
		});
	});

	it('should send request with header', function(done) {
		RequestMock.intercept().reply(200);
		const transport = TransportFactory.instance().getDefault();
		const clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		clientRequest.header('content-type', 'application/json');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('{"content-type":["application/json"]}', response.request().headers().toString());
			done();
		});
	});

	it('should send request with multiple header of same name', function(done) {
		RequestMock.intercept().reply(200);
		const transport = TransportFactory.instance().getDefault();
		const clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		const headers = clientRequest.headers();
		headers.add('content-type', 'application/json');
		headers.add('content-type', 'text/html');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('{"content-type":["application/json","text/html"]}', response.request().headers().toString());
			done();
		});
	});

	it('should response with headers', function(done) {
		RequestMock.intercept().reply(200, undefined, {
			'content-type': 'application/json'
		});
		const transport = TransportFactory.instance().getDefault();
		const clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual('{"content-type":["application/json"]}', response.headers().toString());
			done();
		});
	});

	it('should response success with any status code', function(done) {
		RequestMock.intercept().reply(500);
		const transport = TransportFactory.instance().getDefault();
		const clientRequest = new ClientRequest();
		clientRequest.url('http://localhost/url');
		transport.send(clientRequest).then(function(response) {
			assert.strictEqual(500, response.statusCode());
			assert.strictEqual('Internal Server Error', response.statusText());
			done();
		});
	});
});
