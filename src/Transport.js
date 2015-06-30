/**
 * Provides a convenient interface for data transport.
 * @interface
 */
class Transport {

	/**
	 * Sends a message for the specified client.
	 * @param {Request} request
	 * @return {Promise} Deferred request.
	 */
	send(request) {}

}

export default Transport;
