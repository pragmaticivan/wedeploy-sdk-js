'use strict';

import http from 'http';
import request from 'request';
import CancellablePromise from 'metal-promise';
import ClientResponse from '../ClientResponse';
import Transport from '../Transport';
import Uri from 'metal-uri';
import FormData from 'form-data';

/**
 * Provides a convenient interface for data transport.
 * @interface
 */
class NodeTransport extends Transport {
  /**
	 * @inheritDoc
	 */
  send(clientRequest) {
    let deferred = this.request(
      clientRequest.url(),
      clientRequest.method(),
      clientRequest.body(),
      clientRequest.headers(),
      clientRequest.params(),
      null,
      false
    );

    return deferred.then(function(response) {
      let clientResponse = new ClientResponse(clientRequest);
      clientResponse.body(response.body);
      clientResponse.statusCode(response.statusCode);
      clientResponse.statusText(http.STATUS_CODES[response.statusCode]);

      Object.keys(response.headers).forEach(function(name) {
        clientResponse.header(name, response.headers[name]);
      });

      return clientResponse;
    });
  }

  /**
	 * Requests the url using XMLHttpRequest.
	 * @param {!string} url
	 * @param {!string} method
	 * @param {?string} body
	 * @param {MultiMap} opt_headers
	 * @param {MultiMap} opt_params
	 * @param {number=} opt_timeout
	 * @return {CancellablePromise} Deferred ajax request.
	 * @protected
	 */
  request(url, method, body, opt_headers, opt_params, opt_timeout) {
    url = new Uri(url);

    if (url.isUsingDefaultProtocol()) {
      url.setProtocol('https:');
    }

    if (opt_params) {
      url.addParametersFromMultiMap(opt_params);
    }

    url = url.toString();

    let options = {
      method: method,
      uri: url,
    };

    if (opt_headers) {
      let headers = {};
      opt_headers.names().forEach(function(name) {
        headers[name] = opt_headers.getAll(name).join(', ');
      });

      options.headers = headers;
    }

    let isFormData = false;
    if (body) {
      if (body instanceof FormData) {
        isFormData = true;
      } else {
        options.body = body;
      }
    }

    if (opt_timeout) {
      options.timeout = opt_timeout;
    }

    let connection;

    return new CancellablePromise((resolve, reject) => {
      connection = request(options, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });

      // TODO: Request doesn't handle multipart/form-data very well.
      // So the function .form() or the param formData doesn't work as expected.
      // That's a path to overwrite the private attribute _form to bind the
      // FormData to the request
      // (https://github.com/request/request/blob/master/request.js#L1269)
      // by default the package request uses `multipart` in a different function
      // and scope, instead using FormData package by default.
      if (isFormData) {
        connection._form = body;
      }
    }).thenCatch(reason => {
      connection.abort();
      throw reason;
    });
  }
}

export default NodeTransport;
