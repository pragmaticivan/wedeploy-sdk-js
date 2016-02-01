'use strict';

import { async } from 'metal';

class AjaxRequestMock {
	static intercept() {
		return this;
	}

	static reply(status, body, headers) {
		AjaxRequestMock.status = status;
		AjaxRequestMock.headers = headers;
		AjaxRequestMock.body = body;
	}

	static get() {
		if (AjaxRequestMock.fakeServer.requests) {
			return AjaxRequestMock.fakeServer.requests[0];
		}
	}

	static setup() {
		AjaxRequestMock.fakeServer = sinon.fakeServer.create();
		async.nextTick(() => {
			AjaxRequestMock.fakeServer.respondWith([
				AjaxRequestMock.status,
				AjaxRequestMock.headers,
				AjaxRequestMock.body || ''
			]);
			AjaxRequestMock.fakeServer.respond();
		});
	}

	static teardown() {
		AjaxRequestMock.fakeServer.restore();
	}
}

export default AjaxRequestMock;
