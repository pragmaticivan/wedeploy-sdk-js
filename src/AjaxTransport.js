import core from 'metaljs/src/core';
import Transport from './Transport';
import ClientResponse from './ClientResponse';
import {CancellablePromise as Promise} from 'metal-promise/src/promise/Promise';

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
      clientRequest.url(), clientRequest.method(), clientRequest.headers(),
      clientRequest.queries(), null, false);

    return deferred.then(function(response) {
      var clientResponse = new ClientResponse(clientRequest);
      clientResponse.body(response.responseText);
      clientResponse.statusCode(response.status);
      clientResponse.headers(self.parseResponseHeaders(response.getAllResponseHeaders()));
      return clientResponse;
    });
  }

  /**
   * XmlHttpRequest's getAllResponseHeaders() method returns a string of
   * response headers according to the format described on the spec:
   * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
   * This method parses that string into a user-friendly name/value pair
   * object.
   * @param {string} allHeaders All headers as string.
   * @return {array.<object<string, string>>=}
   */
  parseResponseHeaders(allHeaders) {
    var headers = [];
    if (!allHeaders) {
      return headers;
    }
    var pairs = allHeaders.split('\u000d\u000a');
    for (var i = 0; i < pairs.length; i++) {
      var index = pairs[i].indexOf('\u003a\u0020');
      if (index > 0) {
        var name = pairs[i].substring(0, index);
        var value = pairs[i].substring(index + 2);
        headers.push({ name: name, value: value });
      }
    }
    return headers;
  }

  /**
   * Requests the url using XMLHttpRequest.
   * @param {!string} url
   * @param {!string} method
   * @param {array.<object<string, string>>=} opt_headers
   * @param {array.<object<string, string>>=} opt_queries
   * @param {number=} opt_timeout
   * @param {boolean=} opt_sync
   * @return {Promise} Deferred ajax request.
   * @protected
   */
  request(url, method, opt_headers, opt_queries, opt_timeout, opt_sync) {
    var request = new XMLHttpRequest();

    var promise = new Promise(function(resolve, reject) {
      request.onload = function() {
        if (request.status === 200 || request.status === 304) {
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
      opt_queries.forEach(function(query) {
        querystring += query.name + '=' + encodeURIComponent(query.value) + '&';
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
      opt_headers.forEach(function(header) {
        headers[header.name] = (headers[header.name] ? headers[header.name] + ',' : '') + header.value;
        request.setRequestHeader(header.name, headers[header.name]);
      });
    }

    request.send(null);

    if (core.isDefAndNotNull(opt_timeout)) {
      var timeout = setTimeout(function() {
        promise.cancel('Request timeout');
      }, opt_timeout);
    }

    return promise;
  }

}

export default AjaxTransport;
