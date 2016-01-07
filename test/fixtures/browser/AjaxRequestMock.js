'use strict';

class AjaxRequestMock {
	static intercept() {
		return this;
	}

	static timeout() {
		AjaxRequestMock.timeout_ = true;
	}

	static reply(status, body, headers) {
		AjaxRequestMock.status = status;
		AjaxRequestMock.headers = headers;
		AjaxRequestMock.body = body || '';
	}

	static get() {
		var xhr = AjaxRequestMock.fakeServer.requests;
		return xhr && xhr[0];
	}

	static setup() {
		AjaxRequestMock.fakeServer = sinon.fakeServer.create();

		// must wait reaching each test to get what to respond to the mocked request
		setTimeout(() => {
			if (AjaxRequestMock.status && !AjaxRequestMock.timeout_) {
				AjaxRequestMock.fakeServer.respondWith([
					AjaxRequestMock.status,
					AjaxRequestMock.headers,
					AjaxRequestMock.body
				]);
				AjaxRequestMock.fakeServer.respond();
			}
		}, 0);
	}

	static teardown() {
		AjaxRequestMock.timeout_ = undefined;
		AjaxRequestMock.fakeServer.restore();
	}
}

export default AjaxRequestMock;
