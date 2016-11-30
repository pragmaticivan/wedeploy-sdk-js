'use strict';

import AjaxTransport from '../../../src/api/browser/AjaxTransport';
import ClientRequest from '../../../src/api/ClientRequest';

describe('AjaxTransport', function() {
	beforeEach(RequestMock.setup);
	afterEach(RequestMock.teardown);

	it('should cancel send request to an url', function(done) {
		RequestMock.intercept().reply(200);
		const transport = new AjaxTransport();
		const clientRequest = new ClientRequest();
		clientRequest.url('/url');
		transport.send(clientRequest)
			.then(function() {
				assert.fail();
			})
			.catch(function() {
				assert.ok(RequestMock.get().aborted);
				done();
			})
			.cancel();
	});

	it('should fail on transport error', function(done) {
		RequestMock.intercept().reply(200);
		const transport = new AjaxTransport();
		const clientRequest = new ClientRequest();
		clientRequest.url('/url');
		transport.send(clientRequest).catch(function(reason) {
			assert.ok(reason instanceof Error);
			done();
		});
		RequestMock.get().abort();
	});
});
