import core from 'metaljs/src/core';

/**
 */
class ClientMessage {

  constructor() {
    this.headers_ = [];
  }

  /**
   * Fluent getter and setter for request body.
   * @param {string} opt_body Request body to be set.
   * @return {string} Returns request body.
   * @chainable Chainable when used for setter.
   */
  body(opt_body) {
    if (core.isDef(opt_body)) {
      this.body_ = opt_body;
      return this;
    }
    return this.body_;
  }

  /**
   * Adds a header. If the header with the same name already exists, it will
   * not be overwritten, but new value will be stored. The order is preserved.
   * @param {string} name
   * @param {string} value
   * @chainable
   */
  header(name, value) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }

    this.headers_.push({
      name: name,
      value: value
    });
    return this;
  }

  /**
   * Fluent getter and setter for request headers.
   * @param {array.<object.<string, string>>} opt_queries Request headers
   *     list to be set.
   * @return {array.<object.<string, string>>} Returns request headers
   *     list.
   * @chainable Chainable when used for setter.
   */
  headers(opt_headers) {
    if (core.isDef(opt_headers)) {
      this.headers_ = opt_headers;
      return this;
    }
    return this.headers_;
  }

}

export default ClientMessage;
