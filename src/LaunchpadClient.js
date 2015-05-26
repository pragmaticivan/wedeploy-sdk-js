import TransportFactory from './TransportFactory';
import ClientRequest from './ClientRequest';

/**
 * Base client contains code that is same for all transports.
 * @interface
 */
class LaunchpadClient {

  constructor() {
    if (arguments.length === 0) {
      throw new Error('Invalid arguments, try `new LaunchpadClient(baseUrl, url)`');
    }

    var baseUrl = (arguments.length > 1) ? arguments[0] : '';
    var url = arguments[arguments.length - 1];
    this.url_ = baseUrl + url;

    this.headers_ = [];
    this.queries_ = [];
  }

  /**
   * Static factory for creating launchpad client.
   */
  static url(url) {
    return new LaunchpadClient(url);
  }

  /**
   * Creates new {@link LaunchpadBaseClient}.
   */
  path(path) {
    return new LaunchpadClient(this.url(), path);
  }

  /**
   * Sends message with DELETE http verb.
   * @return {Promise}
   */
  delete() {
    return this.sendAsync('DELETE');
  }

  /**
   * Sends message with GET http verb.
   * @return {Promise}
   */
  get() {
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

    this.headers_.push({
      name: name,
      value: value
    });
    return this;
  }

  /**
   * Gets the headers.
   * @return {array.<object.<string, string>>}
   */
  headers() {
    return this.headers_;
  }

  /**
   * Adds a query. If the query with the same name already exists, it will not
   * be overwritten, but new value will be stored. The order is preserved.
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
   * Gets the query strings.
   * @return {array.<object.<string, string>>}
   */
  queries() {
    return this.queries_;
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
    var transport = TransportFactory.instance().getDefault();

    var clientRequest = new ClientRequest();
    clientRequest.body(body);
    clientRequest.method(method);
    clientRequest.headers(this.headers());
    clientRequest.queries(this.queries());
    clientRequest.url(this.url());

    return transport.send(clientRequest);
  }

}

export default LaunchpadClient;
