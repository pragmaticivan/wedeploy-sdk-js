'use strict';

import Ajax from 'metal-ajax';
import Transport from '../Transport';
import ClientResponse from '../ClientResponse';

/**
 * The implementation of an ajax transport to be used with {@link WeDeploy}.
 * @extends {Transport}
 */
class AjaxTransport extends Transport {
  /**
	 * @inheritDoc
	 */
  send(clientRequest) {
    let deferred = Ajax.request(
      clientRequest.url(),
      clientRequest.method(),
      clientRequest.body(),
      clientRequest.headers(),
      clientRequest.params(),
      null,
      false,
      clientRequest.withCredentials()
    );

    return deferred.then(function(response) {
      let clientResponse = new ClientResponse(clientRequest);
      clientResponse.body(response.responseText);
      clientResponse.statusCode(response.status);
      clientResponse.statusText(response.statusText);
      Ajax.parseResponseHeaders(
        response.getAllResponseHeaders()
      ).forEach(function(header) {
        clientResponse.header(header.name, header.value);
      });
      return clientResponse;
    });
  }
}

export default AjaxTransport;
