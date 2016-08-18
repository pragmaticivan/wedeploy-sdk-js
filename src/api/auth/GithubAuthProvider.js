'use strict';

import AuthProvider from './AuthProvider';

/**
 * Github auth provider implementation.
 */
class GithubAuthProvider extends AuthProvider {
	/**
	 * Constructs an {@link GithubAuthProvider} instance.
	 * @constructor
	 */
	constructor() {
		super();
		this.provider = GithubAuthProvider.PROVIDER;
	}
}

GithubAuthProvider.PROVIDER = 'github';

export default GithubAuthProvider;
