'use strict';

import globals from '../globals/globals';
import { core } from 'metal';
import Auth from './auth/Auth';
import AuthApiHelper from './auth/AuthApiHelper';
import DataApiHelper from './data/DataApiHelper';
import Base64 from '../crypt/Base64';
import Embodied from '../api-query/Embodied';
import Query from '../api-query/Query';
import Filter from '../api-query/Filter';
import TransportFactory from './TransportFactory';
import ClientRequest from './ClientRequest';
import { MultiMap } from 'metal-structs';
import Uri from 'metal-uri';
import { assertUriWithNoPath } from './assertions';


var io;

// Optimistic initialization of `io` reference from global `globals.window.io`.
if (typeof globals.window !== 'undefined') {
	io = globals.window.io;
}

/**
 * The main class for making api requests. Sending requests returns a promise
 * that is resolved when the response arrives. Usage example:
 * ```javascript
 * WeDeploy
 *   .url('/data/tasks')
 *   .post({desc: 'Buy milkl'})
 *   .then(function(response) {
 *     // Handle response here.
 *     console.log(response.body())
 *   });
 * ```
 */
class WeDeploy {
	/**
	 * WeDeploy constructor function.
	 * @param {string} url The base url.
	 * @param {...string} paths Any amount of paths to be appended to the base
	 * url.
	 * @constructor
	 */
	constructor(url, ...paths) {
		if (arguments.length === 0) {
			throw new Error('Invalid arguments, try `new WeDeploy(baseUrl, url)`');
		}

		this.auth_ = null;
		this.body_ = null;
		this.url_ = Uri.joinPaths(url || '', ...paths);
		this.headers_ = new MultiMap();
		this.params_ = new MultiMap();
		this.withCredentials_ = true;

		this.header('Content-Type', 'application/json');
		this.header('X-Requested-With', 'XMLHttpRequest');
	}

	/**
	 * Static factory for creating WeDeploy data for the given url.
	 * @param {string=} opt_dataUrl The url that points to the data services.
	 * @return @return {data} WeDeploy data instance.
	 */
	static data(opt_dataUrl) {
		assertUriWithNoPath(opt_dataUrl, 'The data url should not have a path');

		if (core.isString(opt_dataUrl)) {
			WeDeploy.dataUrl_ = opt_dataUrl;
		}

		let data = new DataApiHelper(WeDeploy);

		data.auth(WeDeploy.auth().currentUser);

		return data;
	}

	/**
	 * Adds authorization information to this request.
	 * @param {!Auth|string} authOrTokenOrEmail Either an {@link Auth} instance,
	 * an authorization token, or the email.
	 * @param {string=} opt_password If a email is given as the first param,
	 * this should be the password.
	 * @chainable
	 */
	auth(authOrTokenOrEmail, opt_password) {
		this.auth_ = authOrTokenOrEmail;
		if (!(this.auth_ instanceof Auth)) {
			this.auth_ = Auth.create(authOrTokenOrEmail, opt_password);
		}
		return this;
	}

	/**
	 * Static factory for creating WeDeploy auth for the given url.
	 * @param {string=} opt_authUrl The url that points to the auth service.
	 */
	static auth(opt_authUrl) {
		if (core.isString(opt_authUrl)) {
			WeDeploy.authUrl_ = opt_authUrl;
		}
		if (!WeDeploy.auth_) {
			WeDeploy.auth_ = new AuthApiHelper(WeDeploy);
		}
		return WeDeploy.auth_;
	}

	/**
	 * Sets the body that will be sent with this request.
	 * @param {*} body
	 * @chainable
	 */
	body(body) {
		this.body_ = body;
		return this;
	}

	/**
	 * Converts the given body object to query params.
	 * @param {!ClientRequest} clientRequest Client request.
	 * @param {*} body
	 * @protected
	 */
	convertBodyToParams_(clientRequest, body) {
		if (core.isString(body)) {
			body = {
				body: body
			};
		} else if (body instanceof Embodied) {
			body = body.body();
		}
		Object.keys(body || {}).forEach(name => clientRequest.param(name, body[name]));
	}

	/**
	 * Creates client request and encode.
	 * @param {string} method
	 * @param {*} body
	 * @return {!ClientRequest} Client request.
	 * @protected
	 */
	createClientRequest_(method, body) {
		const clientRequest = new ClientRequest();

		clientRequest.body(body || this.body_);

		if (!core.isDefAndNotNull(clientRequest.body())) {
			if (this.formData_) {
				clientRequest.body(this.formData_);
			}
		}

		clientRequest.method(method);
		clientRequest.headers(this.headers());
		clientRequest.params(this.params());
		clientRequest.url(this.url());
		clientRequest.withCredentials(this.withCredentials_);

		this.encode(clientRequest);

		return clientRequest;
	}

	/**
	 * Decodes clientResponse body, parsing the body for example.
	 * @param {!ClientResponse} clientResponse The response object to be
	 * decoded.
	 * @return {!ClientResponse} The decoded response.
	 */
	decode(clientResponse) {
		if (WeDeploy.isContentTypeJson(clientResponse)) {
			try {
				clientResponse.body(JSON.parse(clientResponse.body()));
			} catch (err) {}
		}
		return clientResponse;
	}

	/**
	 * Sends message with the DELETE http verb.
	 * @param {string=} opt_body Content to be sent as the request's body.
	 * @return {!CancellablePromise}
	 */
	delete(opt_body) {
		return this.sendAsync('DELETE', opt_body);
	}

	/**
	 * Encodes the given {@link ClientRequest}, converting its body to an
	 * appropriate format for example.
	 * @param {!ClientRequest} clientRequest The request object to encode.
	 * @return {!ClientRequest} The encoded request.
	 */
	encode(clientRequest) {
		let body = clientRequest.body();

		if (core.isElement(body)) {
			body = new FormData(body);
			clientRequest.body(body);
		}

		body = this.maybeWrapWithQuery_(body);
		if (clientRequest.method() === 'GET') {
			this.convertBodyToParams_(clientRequest, body);
			clientRequest.removeBody();
			body = null;
		}

		if (typeof FormData !== 'undefined' && body instanceof FormData) {
			clientRequest.headers().remove('content-type');
		} else if (body instanceof Embodied) {
			clientRequest.body(body.toString());
		} else if (WeDeploy.isContentTypeJson(clientRequest)) {
			clientRequest.body(JSON.stringify(clientRequest.body()));
		}

		this.encodeParams_(clientRequest);
		this.resolveAuthentication_(clientRequest);

		return clientRequest;
	}

	/**
	 * Encodes the params for the given request, according to their types.
	 * @param {!ClientRequest} clientRequest
	 * @protected
	 */
	encodeParams_(clientRequest) {
		let params = clientRequest.params();
		params.names().forEach(function(name) {
			let values = params.getAll(name);
			values.forEach(function(value, index) {
				if (value instanceof Embodied) {
					value = value.toString();
				} else if (core.isObject(value) || (value instanceof Array)) {
					value = JSON.stringify(value);
				}
				values[index] = value;
			});
		});
	}

	/**
	 * Adds a key/value pair to be sent via the body in a `multipart/form-data` format.
	 * If the body is set by other means (for example, through the `body` method), this
	 * will be ignored.
	 * @param {string} name
	 * @param {*} value
	 * @chainable
	 */
	form(name, value) {
		if (typeof FormData === 'undefined') {
			throw new Error('form() is only available when FormData API is available.');
		}

		if (!this.formData_) {
			this.formData_ = new FormData();
		}
		this.formData_.append(name, value);
		return this;
	}

	/**
	 * Sends message with the GET http verb.
	 * @param {*=} opt_params Params to be added to the request url.
	 * @return {!CancellablePromise}
	 */
	get(opt_params) {
		return this.sendAsync('GET', opt_params);
	}

	/**
	 * Adds a header. If the header with the same name already exists, it will
	 * not be overwritten, but new value will be stored. The order is preserved.
	 * @param {string} name Header key.
	 * @param {*} value Header value.
	 * @chainable
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
	 * @return {!MultiMap}
	 */
	headers() {
		return this.headers_;
	}

	/**
	 * Wraps the given `Embodied` instance with a {@link Query} instance if needed.
	 * @param {Embodied} embodied
	 * @return {Embodied}
	 * @protected
	 */
	maybeWrapWithQuery_(embodied) {
		if (embodied instanceof Filter) {
			embodied = Query.filter(embodied);
		}
		return embodied;
	}

	/**
	 * Adds a query. If the query with the same name already exists, it will not
	 * be overwritten, but new value will be stored. The order is preserved.
	 * @param {string} name Param key.
	 * @param {*} value Param value.
	 * @chainable
	 */
	param(name, value) {
		if (arguments.length !== 2) {
			throw new Error('Invalid arguments');
		}
		this.params_.set(name, value);
		return this;
	}

	/**
	 * Gets the query strings map.
	 * @return {!MultiMap}
	 */
	params() {
		return this.params_;
	}

	/**
	 * Sends message with the PATCH http verb.
	 * @param {string=} opt_body Content to be sent as the request's body.
	 * @return {!CancellablePromise}
	 */
	patch(opt_body) {
		return this.sendAsync('PATCH', opt_body);
	}

	/**
	 * Creates a new {@link WeDeploy} instance for handling the url resulting in the
	 * union of the current url with the given paths.
	 * @param {...string} paths Any number of paths.
	 * @return {!WeDeploy} A new {@link WeDeploy} instance for handling the given paths.
	 */
	path(...paths) {
		return new WeDeploy(this.url(), ...paths).use(this.customTransport_);
	}

	/**
	 * Sends message with the POST http verb.
	 * @param {string=} opt_body Content to be sent as the request's body.
	 * @return {!CancellablePromise}
	 */
	post(opt_body) {
		return this.sendAsync('POST', opt_body);
	}

	/**
	 * Sends message with the PUT http verb.
	 * @param {string=} opt_body Content to be sent as the request's body.
	 * @return {!CancellablePromise}
	 */
	put(opt_body) {
		return this.sendAsync('PUT', opt_body);
	}

	/**
	 * Adds the authentication information to the request.
	 * @param {!ClientRequest} clientRequest
	 * @protected
	 */
	resolveAuthentication_(clientRequest) {
		if (!this.auth_) {
			return;
		}
		if (this.auth_.hasToken()) {
			clientRequest.header('Authorization', 'Bearer ' + this.auth_.token);
		} else {
			const credentials = this.auth_.email + ':' + this.auth_.password;
			clientRequest.header('Authorization', 'Basic ' + Base64.encodeString(credentials));
		}
	}

	/**
	 * Uses transport to send request with given method name and body
	 * asynchronously.
	 * @param {string} method The HTTP method to be used when sending data.
	 * @param {string} body Content to be sent as the request's body.
	 * @return {!CancellablePromise} Deferred request.
	 */
	sendAsync(method, body) {
		const transport = this.customTransport_ || TransportFactory.instance().getDefault();

		const clientRequest = this.createClientRequest_(method, body);

		return transport.send(clientRequest).then(this.decode);
	}

	/**
	 * Sets the socket transport
	 * @param {Object} socket implementation object.
	 */
	static socket(socket) {
		io = socket;
	}

	/**
	 * Static factory for creating WeDeploy client for the given url.
	 * @param {string} url The url that the client should use for sending requests.
	 */
	static url(url) {
		return new WeDeploy(url).use(this.customTransport_);
	}

	/**
	 * Returns the URL used by this client.
	 */
	url() {
		return this.url_;
	}

	/**
	 * Specifies {@link Transport} implementation.
	 * @param {!Transport} transport The transport implementation that should be
	 * used.
	 */
	use(transport) {
		this.customTransport_ = transport;
		return this;
	}

	/**
	 * Creates new socket.io instance. The parameters passed to socket.io
	 * constructor will be provided:
	 *
	 * ```javascript
	 * WeDeploy.url('http://domain:8080/path/a').watch({id: 'myId'}, {foo: true});
	 * // Equals:
	 * io('domain:8080/?url=path%2Fa%3Fid%3DmyId', {foo: true});
	 * ```
	 *
	 * @param {Object=} opt_params Params to be sent with the Socket IO request.
	 * @param {Object=} opt_options Object with Socket IO options.
	 * @return {!io} Socket IO reference. Server events can be listened on it.
	 */
	watch(opt_params, opt_options) {
		if (typeof io === 'undefined') {
			throw new Error('Socket.io client not loaded');
		}

		const clientRequest = this.createClientRequest_('GET', opt_params);
		const uri = new Uri(clientRequest.url());
		uri.addParametersFromMultiMap(clientRequest.params());

		opt_options = opt_options || {
			forceNew: true
		};
		opt_options.query = 'url=' + encodeURIComponent(uri.getPathname() + uri.getSearch());
		opt_options.path = opt_options.path || uri.getPathname();

		return io(uri.getHost(), opt_options);
	}
}

WeDeploy.isContentTypeJson = function(clientMessage) {
	const contentType = clientMessage.headers().get('content-type') || '';
	return contentType.indexOf('application/json') === 0;
};

WeDeploy.auth_ = null;
WeDeploy.authUrl_ = '';
WeDeploy.data_ = null;
WeDeploy.dataUrl_ = '';

export default WeDeploy;
