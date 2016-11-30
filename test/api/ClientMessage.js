'use strict';

import ClientMessage from '../../src/api/ClientMessage';
import ClientRequest from '../../src/api/ClientRequest';
import ClientResponse from '../../src/api/ClientResponse';

describe('ClientMessage', function() {
	it('should set/get body', function() {
		const clientMessage = new ClientMessage();
		assert.strictEqual(undefined, clientMessage.body());
		clientMessage.body('body');
		assert.strictEqual('body', clientMessage.body());
	});

	it('should remove body', function() {
		const clientMessage = new ClientMessage();
		clientMessage.body('body');
		clientMessage.removeBody();
		assert.strictEqual(undefined, clientMessage.body());
	});

	it('should set/get header', function() {
		const clientMessage = new ClientMessage();
		clientMessage.header('name', '');
		clientMessage.header('name', 'value');
		assert.strictEqual('{"name":["value"]}', clientMessage.headers().toString());
	});

	it('should set/get headers', function() {
		const clientMessage = new ClientMessage();
		clientMessage.headers({
			'name': ['value', 'value']
		});
		assert.strictEqual('{"name":["value","value"]}', clientMessage.headers().toString());
	});

	it('should throws exception for invalid header arguments', function() {
		assert.throws(function() {
			const clientMessage = new ClientMessage();
			clientMessage.header();
		}, Error);

		assert.throws(function() {
			const clientMessage = new ClientMessage();
			clientMessage.header('name');
		}, Error);
	});
});

describe('ClientRequest', function() {
	it('should set/get url', function() {
		const clientRequest = new ClientRequest();
		assert.strictEqual(undefined, clientRequest.url());
		clientRequest.url('/url');
		assert.strictEqual('/url', clientRequest.url());
	});

	it('should set/get method', function() {
		const clientRequest = new ClientRequest();
		assert.strictEqual(ClientRequest.DEFAULT_METHOD, clientRequest.method());
		clientRequest.method('POST');
		assert.strictEqual('POST', clientRequest.method());
	});

	it('should set/get query', function() {
		const clientRequest = new ClientRequest();
		clientRequest.param('name', 'value');
		clientRequest.param('name', 'value');
		assert.strictEqual('{"name":["value"]}', clientRequest.params().toString());
	});

	it('should set/get headers', function() {
		const clientRequest = new ClientRequest();
		clientRequest.params({
			'name': ['value', 'value']
		});
		assert.strictEqual('{"name":["value","value"]}', clientRequest.params().toString());
	});

	it('should throws exception for invalid query arguments', function() {
		assert.throws(function() {
			const clientRequest = new ClientRequest();
			clientRequest.param();
		}, Error);

		assert.throws(function() {
			const clientRequest = new ClientRequest();
			clientRequest.param('name');
		}, Error);
	});
});

describe('ClientResponse', function() {
	it('should set/get status code', function() {
		const clientResponse = new ClientResponse(new ClientRequest());
		assert.strictEqual(undefined, clientResponse.statusCode());
		clientResponse.statusCode(200);
		assert.strictEqual(200, clientResponse.statusCode());
	});

	it('should set/get client request', function() {
		const clientRequest = new ClientRequest();
		const clientResponse = new ClientResponse(clientRequest);
		assert.strictEqual(clientRequest, clientResponse.request());
	});

	it('should throws exception for empty constructor', function() {
		assert.throws(function() {
			new ClientResponse();
		}, Error);
	});

	it('should check response succeeded', function() {
		const clientRequest = new ClientRequest();
		const clientResponse = new ClientResponse(clientRequest);
		clientResponse.statusCode(0);
		assert.ok(!clientResponse.succeeded());
		clientResponse.statusCode(200);
		assert.ok(clientResponse.succeeded());
		clientResponse.statusCode(399);
		assert.ok(clientResponse.succeeded());
		clientResponse.statusCode(400);
		assert.ok(!clientResponse.succeeded());
	});
});
