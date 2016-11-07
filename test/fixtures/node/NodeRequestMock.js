'use strict';

import nock from 'nock';
import url from 'url';

let defVerb_;
let defAddress_;

class NodeRequestMock {
	static inject(name, module) {
		NodeRequestMock[name] = module;
	}

	static intercept(verb = defVerb_, address = defAddress_, requestBody = undefined, reqMeta = undefined) {
		var u = url.parse(address);

		NodeRequestMock.scope = nock(u.protocol + '//' + u.hostname, reqMeta)
			.intercept(u.path, verb, requestBody);

		return NodeRequestMock.scope;
	}

	static socketDelay(time) {
		NodeRequestMock.scope.socketDelay(time);
		return NodeRequestMock.scope;
	}

	static reply(status, body, headers) {
		NodeRequestMock.scope.reply(status, body, headers);
		return NodeRequestMock.scope;
	}

	static get() {
		return NodeRequestMock.scope;
	}

	static setup(defVerb = 'GET', defAddress = 'http://localhost/users') {
		defVerb_ = defVerb;
		defAddress_ = defAddress;
	}

	static teardown() {
		NodeRequestMock.scope = undefined;
		nock.cleanAll();
	}
}

export default NodeRequestMock;
