import TransportFactory from './TransportFactory';
import ClientRequest from './ClientRequest';
import Util from './Util';

/**
 * Base client contains code that is same for all transports.
 * @interface
 */
class LaunchpadClient {

  constructor() {
    if (arguments.length === 0) {
      throw new Error('Invalid arguments, try `new LaunchpadClient(baseUrl, url)`');
    }

    this.url_ = Util.joinPaths(arguments[0] || '', arguments[1] || '');
    this.headers_ = [];
    this.queries_ = [];

    this.header('Content-Type', 'application/json');
  }

  /**
   * Static factory for creating launchpad client.
   */
  static url(url) {
    return new LaunchpadClient(url).use(this.customTransport_);
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
   *   LaunchpadClient.url('http://domain:8080/path').connect({ foo: true });
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
    return new LaunchpadClient(this.url(), path).use(this.customTransport_);
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
    var transport = this.customTransport_ || TransportFactory.instance().getDefault();

    var clientRequest = new ClientRequest();
    clientRequest.body(body);
    clientRequest.method(method);
    clientRequest.headers(this.headers());
    clientRequest.queries(this.queries());
    clientRequest.url(this.url());

    this.encode(clientRequest);

    return transport.send(clientRequest).then(this.decode);
  }

  /**
   * Encodes clientRequest body.
   * @param {ClientRequest} clientRequest
   * @return {ClientRequest}
   */
  encode(clientRequest) {
    if (LaunchpadClient.TEMP_isContentTypeJson(clientRequest)) {
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
    if (LaunchpadClient.TEMP_isContentTypeJson(clientResponse)) {
      try {
        clientResponse.body(JSON.parse(clientResponse.body()));
      } catch(err) {}
    }
    return clientResponse;
  }

}

LaunchpadClient.TEMP_isContentTypeJson = function(clientMessage) {
  var items = clientMessage.headers();
  for (var i = items.length - 1; i >= 0 ; i--) {
    if ('content-type' === items[i].name.toLowerCase()) {
      return items[i].value.toLowerCase().indexOf('application/json') === 0;
    }
  }
  return false;
};

if (typeof window !== undefined) {
  window.LaunchpadClient = LaunchpadClient;
}

export default LaunchpadClient;
