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
			var request = AjaxRequestMock.fakeServer.requests[0];
			convertEvents_(request);
			return request;
		}
	}

	static setup() {
		AjaxRequestMock.fakeServer = sinon.fakeServer.create();
		AjaxRequestMock.addedEvents = false;
		async.nextTick(() => {
			convertEvents_(AjaxRequestMock.get());
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

/**
 * The most recent version of sinon is dealing with XMLHttpRequest events in a
 * very weird way. They fire `error` or status codes that the browser fires
 * `load` for, and fire `abort` for cases where the browser fires `error`.
 * This is a simple hack converting the events to the ones expected as coming
 * from the browser.
 */
function convertEvents_(request) {
	if (!AjaxRequestMock.addedEvents && request) {
		AjaxRequestMock.addedEvents = true;
		request.addEventListener('error', function(event) {
			event.stopPropagation();
			request.dispatchEvent(new sinon.ProgressEvent('load', event, request));
		});
		request.addEventListener('abort', function(event) {
			event.stopPropagation();
			request.dispatchEvent(new sinon.ProgressEvent('error', event, request));
		});
	}
}

export default AjaxRequestMock;
