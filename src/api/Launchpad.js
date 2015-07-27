'use strict';

import core from 'bower:metal/src/core';
import Embodied from '../api-query/Embodied';
import Filter from '../api-query/Filter';
import Query from '../api-query/Query';
import TransportFactory from './TransportFactory';
import ClientRequest from './ClientRequest';
import Util from './Util';
import MultiMap from './MultiMap';

/**
 * Base client contains code that is same for all transports.
 * @interface
 */
class Launchpad {

	constructor() {
		if (arguments.length === 0) {
			throw new Error('Invalid arguments, try `new Launchpad(baseUrl, url)`');
		}

		this.url_ = Util.joinPaths(arguments[0] || '', arguments[1] || '');
		this.headers_ = new MultiMap();
		this.params_ = new MultiMap();

		this.header('Content-Type', 'application/json');
		this.header('X-PJAX', 'true');
		this.header('X-Requested-With', 'XMLHttpRequest');
	}

	/**
	 * Static factory for creating launchpad client.
	 */
	static url(url) {
		return new Launchpad(url).use(this.customTransport_);
	}

	/**
	 * Specifies {@link Transport} implementation.
	 */
	use(transport) {
		this.customTransport_ = transport;
		return this;
	}

	/**
	 * Creates new socket.io instance. The parameters passed to socket.io
	 * constructor will be provided:
	 *
	 *   Launchpad.url('http://domain:8080/path').connect({ foo: true });
	 *     -> io('domain:8080', { path: '/path', foo: true });
	 *
	 * @param {object} opt_options
	 */
	connect(opt_options) {
		if (typeof io === 'undefined') {
			throw new Error('Socket.io client not loaded');
		}

		var url = Util.parseUrl(this.url());
		opt_options = opt_options || {};
		opt_options.path = url[1];

		return io(url[0], opt_options);
	}

	/**
	 * Creates new {@link LaunchpadBaseClient}.
	 */
	path(path) {
		return new Launchpad(this.url(), path).use(this.customTransport_);
	}

	/**
	 * Sends message with DELETE http verb.
	 * @param {string} opt_body
	 * @return {Promise}
	 */
	delete(opt_body) {
		return this.sendAsync('DELETE', opt_body);
	}

	/**
	 * Sends message with GET http verb.
	 * @param {*} opt_params Optional params to be added to the request url.
	 * @return {Promise}
	 */
	get(opt_params) {
		var params = opt_params || {};
		if (core.isString(params)) {
			params = {
				body: params
			};
		} else if (params instanceof Embodied) {
			params = this.wrapWithQuery_(params).body();
		}
		Object.keys(params).forEach(name => this.param(name, params[name]));
		return this.sendAsync('GET');
	}

	/**
	 * Sends message with PATCH http verb.
	 * @param {string} opt_body
	 * @return {Promise}
	 */
	patch(opt_body) {
		return this.sendAsync('PATCH', opt_body);
	}

	/**
	 * Sends message with POST http verb.
	 * @param {string} opt_body
	 * @return {Promise}
	 */
	post(opt_body) {
		return this.sendAsync('POST', opt_body);
	}

	/**
	 * Sends message with PUT http verb.
	 * @param {string} opt_body
	 * @return {Promise}
	 */
	put(opt_body) {
		return this.sendAsync('PUT', opt_body);
	}

	/**
	 * Adds a header. If the header with the same name already exists, it will
	 * not be overwritten, but new value will be stored. The order is preserved.
	 */
	header(name, value) {
		if (arguments.length !== 2) {
			throw new Error('Invalid arguments');
		}
		this.headers_.set(name, value);
		return this;
	}

	/**
	 * Gets the headers.
	 * @return {MultiMap}
	 */
	headers() {
		return this.headers_;
	}

	/**
	 * Adds a query. If the query with the same name already exists, it will not
	 * be overwritten, but new value will be stored. The order is preserved.
	 */
	param(name, value) {
		if (arguments.length !== 2) {
			throw new Error('Invalid arguments');
		}
		if (value instanceof Embodied) {
			value = value.toString();
		} else if (core.isObject(value) || (value instanceof Array)) {
			value = JSON.stringify(value);
		}
		this.params_.set(name, value);
		return this;
	}

	/**
	 * Gets the query strings map.
	 * @return {MultiMap}
	 */
	params() {
		return this.params_;
	}

	/**
	 * Returns the URL.
	 * TODO: Renames on api.java as well.
	 */
	url() {
		return this.url_;
	}

	/**
	 * Uses transport to send request with given method name and body
	 * asynchronously.
	 * @param {string} method The HTTP method to be used when sending data.
	 * @param {string} body
	 * @return {Promise} Deferred request.
	 */
	sendAsync(method, body) {
		var transport = this.customTransport_ || TransportFactory.instance().getDefault();

		var clientRequest = new ClientRequest();
		clientRequest.body(body);
		clientRequest.method(method);
		clientRequest.headers(this.headers());
		clientRequest.params(this.params());
		clientRequest.url(this.url());

		this.encode(clientRequest);

		return transport.send(clientRequest).then(this.decode);
	}

	/**
	 * Wraps the given `Embodied` instance with a `Query` instance if needed.
	 * @param {Embodied} embodied
	 * @return {Embodied}
	 * @protected
	 */
	wrapWithQuery_(embodied) {
		if (embodied instanceof Filter) {
			embodied = Query.builder().filter(embodied);
		}
		return embodied;
	}

	/**
	 * Encodes clientRequest body.
	 * @param {ClientRequest} clientRequest
	 * @return {ClientRequest}
	 */
	encode(clientRequest) {
		var body = clientRequest.body();

		if (core.isElement(body)) {
			body = new FormData(body);
			clientRequest.body(body);
		}

		if (body instanceof FormData) {
			clientRequest.headers().remove('content-type');
		} else if (body instanceof Embodied) {
			clientRequest.body(this.wrapWithQuery_(body).toString());
		} else if (Launchpad.isContentTypeJson(clientRequest)) {
			clientRequest.body(JSON.stringify(clientRequest.body()));
		}
		return clientRequest;
	}

	/**
	 * Decodes clientResponse body.
	 * @param {ClientResponse} clientResponse
	 * @return {ClientResponse}
	 */
	decode(clientResponse) {
		if (Launchpad.isContentTypeJson(clientResponse)) {
			try {
				clientResponse.body(JSON.parse(clientResponse.body()));
			} catch (err) {}
		}
		return clientResponse;
	}

}

Launchpad.isContentTypeJson = function(clientMessage) {
	var contentType = clientMessage.headers().get('content-type') || '';
	return contentType.indexOf('application/json') === 0;
};

if (typeof window !== undefined) {
	window.Launchpad = Launchpad;
}

export default Launchpad;
