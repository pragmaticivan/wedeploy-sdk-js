import ClientMessage from '../src/ClientMessage';
import ClientRequest from '../src/ClientRequest';
import ClientResponse from '../src/ClientResponse';

describe('ClientMessage', function() {
	it('should set/get body', function() {
		var clientMessage = new ClientMessage();
		assert.strictEqual(undefined, clientMessage.body());
		clientMessage.body('body');
		assert.strictEqual('body', clientMessage.body());
	});

	it('should set/get header', function() {
		var clientMessage = new ClientMessage();
		clientMessage.header('name', '');
		clientMessage.header('name', 'value');
		assert.strictEqual('{"name":["value"]}', clientMessage.headers().toString());
	});

	it('should set/get headers', function() {
		var clientMessage = new ClientMessage();
		clientMessage.headers({
			'name': ['value', 'value']
		});
		assert.strictEqual('{"name":["value","value"]}', clientMessage.headers().toString());
	});

	it('should throws exception for invalid header arguments', function() {
		assert.throws(function() {
			var clientMessage = new ClientMessage();
			clientMessage.header();
		}, Error);

		assert.throws(function() {
			var clientMessage = new ClientMessage();
			clientMessage.header('name');
		}, Error);
	});
});

describe('ClientRequest', function() {
	it('should set/get url', function() {
		var clientRequest = new ClientRequest();
		assert.strictEqual(undefined, clientRequest.url());
		clientRequest.url('/url');
		assert.strictEqual('/url', clientRequest.url());
	});

	it('should set/get method', function() {
		var clientRequest = new ClientRequest();
		assert.strictEqual(ClientRequest.DEFAULT_METHOD, clientRequest.method());
		clientRequest.method('POST');
		assert.strictEqual('POST', clientRequest.method());
	});

	it('should set/get query', function() {
		var clientRequest = new ClientRequest();
		clientRequest.query('name', 'value');
		clientRequest.query('name', 'value');
		assert.strictEqual('{"name":["value"]}', clientRequest.queries().toString());
	});

	it('should set/get headers', function() {
		var clientRequest = new ClientRequest();
		clientRequest.queries({
			'name': ['value', 'value']
		});
		assert.strictEqual('{"name":["value","value"]}', clientRequest.queries().toString());
	});

	it('should throws exception for invalid query arguments', function() {
		assert.throws(function() {
			var clientRequest = new ClientRequest();
			clientRequest.query();
		}, Error);

		assert.throws(function() {
			var clientRequest = new ClientRequest();
			clientRequest.query('name');
		}, Error);
	});
});

describe('ClientResponse', function() {
	it('should set/get status code', function() {
		var clientResponse = new ClientResponse(new ClientRequest());
		assert.strictEqual(undefined, clientResponse.statusCode());
		clientResponse.statusCode(200);
		assert.strictEqual(200, clientResponse.statusCode());
	});

	it('should set/get client request', function() {
		var clientRequest = new ClientRequest();
		var clientResponse = new ClientResponse(clientRequest);
		assert.strictEqual(clientRequest, clientResponse.request());
	});

	it('should throws exception for empty constructor', function() {
		assert.throws(function() {
			new ClientResponse();
		}, Error);
	});
});
