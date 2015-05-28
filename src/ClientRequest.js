import core from 'bower:metaljs/src/core';
import ClientMessage from './ClientMessage';

/**
 */
class ClientRequest extends ClientMessage {

  constructor() {
    super();
    this.queries_ = [];
  }

  /**
   * Fluent getter and setter for request method.
   * @param {string} opt_method Request method to be set.
   * @return {string} Returns request method.
   * @chainable Chainable when used for setter.
   */
  method(opt_method) {
    if (core.isDef(opt_method)) {
      this.method_ = opt_method;
      return this;
    }
    return this.method_ || ClientRequest.DEFAULT_METHOD;
  }

  /**
   * Adds a query. If the query with the same name already exists, it will not
   * be overwritten, but new value will be stored. The order is preserved.
   * @param {string} name
   * @param {string} value
   * @chainable
   */
  query(name, value) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }

    this.queries_.push({
      name: name,
      value: value
    });
    return this;
  }

  /**
   * Fluent getter and setter for request query string.
   * @param {array.<object.<string, string>>} opt_queries Request query string
   *     list to be set.
   * @return {array.<object.<string, string>>} Returns request query string
   *     list.
   * @chainable Chainable when used for setter.
   */
  queries(opt_queries) {
    if (core.isDef(opt_queries)) {
      this.queries_ = opt_queries;
      return this;
    }
    return this.queries_;
  }

  /**
   * Fluent getter and setter for request url.
   * @param {string} opt_url Request url to be set.
   * @return {string} Returns request url.
   * @chainable Chainable when used for setter.
   * TODO: Renames on api.java as well.
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
