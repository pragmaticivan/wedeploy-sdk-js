import core from 'bower:metal/src/core';
import Transport from './Transport';
import Util from './Util';
import ClientResponse from './ClientResponse';
import {CancellablePromise as Promise} from 'bower:metal-promise/src/promise/Promise';

/**
 * Provides a convenient interface for data transport.
 * @interface
 */
class AjaxTransport extends Transport {

  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  send(clientRequest) {
    var self = this;

    var deferred = this.request(
      clientRequest.url(), clientRequest.method(), clientRequest.body(),
      clientRequest.headers(), clientRequest.queries(), null, false);

    return deferred.then(function(response) {
      var clientResponse = new ClientResponse(clientRequest);
      clientResponse.body(response.responseText);
      clientResponse.statusCode(response.status);
      Util.parseResponseHeaders(response.getAllResponseHeaders()).forEach(function(header) {
        clientResponse.header(header.name, header.value);
      });
      return clientResponse;
    });
  }

  /**
   * Requests the url using XMLHttpRequest.
   * @param {!string} url
   * @param {!string} method
   * @param {?string} body
   * @param {array.<object<string, string>>=} opt_headers
   * @param {array.<object<string, string>>=} opt_queries
   * @param {number=} opt_timeout
   * @param {boolean=} opt_sync
   * @return {Promise} Deferred ajax request.
   * @protected
   */
  request(url, method, body, opt_headers, opt_queries, opt_timeout, opt_sync) {
    var request = new XMLHttpRequest();

    var promise = new Promise(function(resolve, reject) {
      request.onload = function() {
        if (request.status === 200 || request.status === 204 || request.status === 304) {
          resolve(request);
          return;
        }
        request.onerror();
      };
      request.onerror = function() {
        var error = new Error('Request error');
        error.request = request;
        reject(error);
      };
    }).thenCatch(function(reason) {
      throw reason;
    }).thenAlways(function() {
      clearTimeout(timeout);
    });

    if (opt_queries) {
      var querystring = '';
      opt_queries.names().forEach(function(name) {
        opt_queries.getAll(name).forEach(function(value) {
          querystring += name + '=' + encodeURIComponent(value) + '&';
        });
      });
      querystring = querystring.slice(0, -1);
      if (querystring) {
        url += (url.indexOf('?') > -1) ? '&' : '?';
        url += querystring;
      }
    }

    request.open(method, url, !opt_sync);

    if (opt_headers) {
      var headers = {};
      opt_headers.names().forEach(function(name) {
        request.setRequestHeader(name, opt_headers.getAll(name).join(', '));
      });
    }

    request.send(core.isDef(body) ? body : null);

    if (core.isDefAndNotNull(opt_timeout)) {
      var timeout = setTimeout(function() {
        promise.cancel('Request timeout');
      }, opt_timeout);
    }

    return promise;
  }

}

export default AjaxTransport;
