import core from 'bower:metal/src/core';
import ClientMessage from './ClientMessage';

/**
 */
class Response extends ClientMessage {

	constructor(request) {
		super();
		if (!request) {
			throw new Error('Can\'t create response without request');
		}
		this.request_ = request;
	}

	/**
	 * Returns request that created this response.
	 * @return {ClientRequest}
	 */
	request() {
		return this.request_;
	}

	/**
	 * Fluent getter and setter for response status code.
	 * @param {number} opt_statusCode Request status code to be set.
	 * @return {number} Returns response status code.
	 */
	statusCode(opt_statusCode) {
		if (core.isDef(opt_statusCode)) {
			this.statusCode_ = opt_statusCode;
			return this;
		}
		return this.statusCode_;
	}

}

export default Response;
