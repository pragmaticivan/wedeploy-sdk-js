'use strict';

import Ajax from 'metal-ajax';
import ClientResponse from '../ClientResponse';
import Transport from '../Transport';
import Uri from 'metal-uri';

/**
 * The implementation of an ajax transport to be used with {@link WeDeploy}.
 * @extends {Transport}
 */
class AjaxTransport extends Transport {
  /**
	 * @inheritDoc
	 */
  send(clientRequest) {
    let url = new Uri(clientRequest.url());

    if (url.isUsingDefaultProtocol()) {
      url.setProtocol('https:');
    }

    let deferred = Ajax.request(
      url.toString(),
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
