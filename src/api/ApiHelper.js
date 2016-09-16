'use strict';

import Auth from './auth/Auth';
import { assertDefAndNotNull } from './assertions';

class ApiHelper {

	/**
	 * Constructs an {@link ApiHelper} instance.
	 * @constructor
	 */
	constructor(wedeployClient) {
		assertDefAndNotNull(wedeployClient, 'WeDeploy client reference must be specified');
		this.wedeployClient = wedeployClient;
	}

	/**
	 * Adds authorization information to this request.
	 * @param {!Auth|string} authOrTokenOrEmail Either an {@link Auth} instance,
	 * an authorization token, or the email.
	 * @param {string=} opt_password If a email is given as the first param,
	 * this should be the password.
	 * @chainable
	 */
	auth(authOrTokenOrEmail, opt_password) {
		this.helperAuthScope = authOrTokenOrEmail;
		if (!(this.helperAuthScope instanceof Auth)) {
			this.helperAuthScope = Auth.create(authOrTokenOrEmail, opt_password);
		}
		return this;
	}

}

export default ApiHelper;
