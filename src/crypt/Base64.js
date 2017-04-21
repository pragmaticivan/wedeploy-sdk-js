'use strict';

/**
 * Abstraction layer for string to base64 conversion
 * reference: https://github.com/nodejs/node/issues/3462
 */
class Base64 {
  /**
	 * Creates a base-64 encoded ASCII string from a "string" of binary data.
	 * @param {string} string to be encoded.
	 * @return {string}
	 * @static
	 */
  static encodeString(string) {
    if (typeof btoa === 'function') {
      return btoa(string);
    }

    return new Buffer(string.toString(), 'binary').toString('base64');
  }
}

export default Base64;
