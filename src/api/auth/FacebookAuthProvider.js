'use strict';

import AuthProvider from './AuthProvider';

/**
 * Facebook auth provider implementation.
 */
class FacebookAuthProvider extends AuthProvider {
	/**
	 * Constructs an {@link FacebookAuthProvider} instance.
	 * @constructor
	 */
	constructor() {
		super();
		this.provider = FacebookAuthProvider.PROVIDER;
	}
}

FacebookAuthProvider.PROVIDER = 'facebook';

export default FacebookAuthProvider;
