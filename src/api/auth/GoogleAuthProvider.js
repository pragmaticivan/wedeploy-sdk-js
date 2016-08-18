'use strict';

import AuthProvider from './AuthProvider';

/**
 * Google auth provider implementation.
 */
class GoogleAuthProvider extends AuthProvider {
	/**
	 * Constructs an {@link GoogleAuthProvider} instance.
	 * @constructor
	 */
	constructor() {
		super();
		this.provider = GoogleAuthProvider.PROVIDER;
	}
}

GoogleAuthProvider.PROVIDER = 'google';

export default GoogleAuthProvider;
