import ClientMessage from '../src/ClientMessage';
import Request from '../src/Request';
import Response from '../src/Response';

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

describe('Request', function() {
	it('should set/get url', function() {
		var request = new Request();
		assert.strictEqual(undefined, request.url());
		request.url('/url');
		assert.strictEqual('/url', request.url());
	});

	it('should set/get method', function() {
		var request = new Request();
		assert.strictEqual(Request.DEFAULT_METHOD, request.method());
		request.method('POST');
		assert.strictEqual('POST', request.method());
	});

	it('should set/get query', function() {
		var request = new Request();
		request.query('name', 'value');
		request.query('name', 'value');
		assert.strictEqual('{"name":["value"]}', request.queries().toString());
	});

	it('should set/get headers', function() {
		var request = new Request();
		request.queries({
			'name': ['value', 'value']
		});
		assert.strictEqual('{"name":["value","value"]}', request.queries().toString());
	});

	it('should throws exception for invalid query arguments', function() {
		assert.throws(function() {
			var request = new Request();
			request.query();
		}, Error);

		assert.throws(function() {
			var request = new Request();
			request.query('name');
		}, Error);
	});
});

describe('Response', function() {
	it('should set/get status code', function() {
		var response = new Response(new Request());
		assert.strictEqual(undefined, response.statusCode());
		response.statusCode(200);
		assert.strictEqual(200, response.statusCode());
	});

	it('should set/get client request', function() {
		var request = new Request();
		var response = new Response(request);
		assert.strictEqual(request, response.request());
	});

	it('should throws exception for empty constructor', function() {
		assert.throws(function() {
			new Response();
		}, Error);
	});
});
