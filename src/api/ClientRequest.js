'use strict';

import {core} from 'metal';
import ClientMessage from './ClientMessage';
import {MultiMap} from 'metal-structs';

/**
 * Represents a client request object.
 * @extends {ClientMessage}
 */
class ClientRequest extends ClientMessage {
  /**
	 * Constructs an {@link ClientRequest} instance.
	 * @constructor
	 */
  constructor() {
    super();
    this.params_ = new MultiMap();
    this.withCredentials_ = true;
  }

  /**
	 * Fluent getter and setter for with credentials option.
	 * @param {boolean=} opt_withCredentials
	 * @return {!ClientRequest|boolean} Returns the {@link ClientMessage} object
	 *   itself when used as setter, otherwise returns the current value of with
	 *   credentials option.
	 * @chainable Chainable when used as setter.
	 */
  withCredentials(opt_withCredentials) {
    if (core.isDef(opt_withCredentials)) {
      this.withCredentials_ = !!opt_withCredentials;
      return this;
    }
    return this.withCredentials_;
  }

  /**
	 * Fluent getter and setter for request method.
	 * @param {string=} opt_method Request method to be set. If none is given,
	 *   the current method value will be returned.
	 * @return {!ClientMessage|string} Returns request method if no new value was
	 *   given. Otherwise returns the {@link ClientMessage} object itself, so
	 *   calls can be chained.
	 * @chainable Chainable when used as setter.
	 */
  method(opt_method) {
    if (core.isDef(opt_method)) {
      this.method_ = opt_method;
      return this;
    }
    return this.method_ || ClientRequest.DEFAULT_METHOD;
  }

  /**
	 * Adds a query. If a query with the same name already exists, it will not
	 * be overwritten, but new value will be stored as well. The order is
	 * preserved.
	 * @param {string} name
	 * @param {string} value
	 * @return {!ClientMessage} Returns the {@link ClientMessage} object itself,
	 *   so calls can be chained.
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
	 * Fluent getter and setter for request querystring.
	 * @param {MultiMap|Object=} opt_params Request querystring map to be set.
	 *   If none is given the current value of the params will be returned.
	 * @return {!MultiMap|ClientMessage} Returns map of request querystring if
	 *   no new value was given. Otherwise returns the {@link ClientMessage}
	 *   object itself, so calls can be chained.
	 */
  params(opt_params) {
    if (core.isDef(opt_params)) {
      if (opt_params instanceof MultiMap) {
        this.params_ = opt_params;
      } else {
        this.params_.values = opt_params;
      }
      return opt_params;
    }
    return this.params_;
  }

  /**
	 * Fluent getter and setter for request url.
	 * @param {string=} opt_url Request url to be set. If none is given,
	 *   the current value of the url will be returned.
	 * @return {!ClientMessage|string} Returns request url if no new value was
	 *  given.
	 *  Otherwise returns the {@link ClientMessage} object itself, so calls can be
	 *  chained.
	 * @chainable Chainable when used as setter.
	 */
  url(opt_url) {
    if (core.isDef(opt_url)) {
      this.url_ = opt_url;
      return this;
    }
    return this.url_;
  }
}

ClientRequest.DEFAULT_METHOD = 'GET';

export default ClientRequest;
