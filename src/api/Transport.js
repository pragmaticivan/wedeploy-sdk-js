'use strict';

/**
 * Provides a convenient interface for data transport.
 * @interface
 */
class Transport {
  /**
	 * Sends a message for the specified client.
	 * @method send
	 * @param {!ClientRequest} clientRequest
	 * @return {!Promise} Deferred request.
	 */
}

export default Transport;
