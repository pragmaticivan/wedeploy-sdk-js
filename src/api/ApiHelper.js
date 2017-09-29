'use strict';

import {assertDefAndNotNull} from './assertions';
import {MultiMap} from 'metal-structs';
import Auth from './auth/Auth';

/**
 * Class responsible for encapsulating API calls.
 */
class ApiHelper {
  /**
	 * Constructs an {@link ApiHelper} instance.
	 * @param {!WeDeploy} wedeployClient {@link WeDeploy} client reference.
	 * @constructor
	 */
  constructor(wedeployClient) {
    assertDefAndNotNull(
      wedeployClient,
      'WeDeploy client reference must be specified'
    );
    this.wedeployClient = wedeployClient;
    this.headers_ = new MultiMap();
    this.withCredentials_ = true;
  }

  /**
	 * Adds a header. If a header with the same name already exists, it will not
	 * be overwritten, but the new value will be stored as well. The order is
	 * preserved.
	 * @param {string} name
	 * @param {string} value
	 * @return {!ApiHelper} Returns the {@link ApiHelper}
	 *   object itself, so calls can be chained.
	 * @chainable
	 */
  header(name, value) {
    if (arguments.length !== 2) {
      throw new Error('Invalid arguments');
    }
    this.headers_.set(name, value);
    return this;
  }

  /**
	 * Adds authorization information to this request.
	 * @param {!Auth|string} authOrTokenOrEmail Either an {@link Auth} instance,
	 * an authorization token, or the email.
	 * @param {string=} opt_password If a email is given as the first param,
	 * this should be the password.
	 * @return {ApiHelper}
	 * @chainable
	 */
  auth(authOrTokenOrEmail, opt_password) {
    this.helperAuthScope = Auth.create(authOrTokenOrEmail, opt_password);
    this.helperAuthScope.wedeployClient = this.wedeployClient;
    return this;
  }

  /**
   * Assigns the passed value to the internal with credentials option.
   * @param {boolean} withCredentials
   * @return {ApiHelper} Returns the {@link ApiHelper} object itself, so calls
   *   can be chained.
   * @chainable
   */
  withCredentials(withCredentials) {
    this.withCredentials_ = !!withCredentials;
    return this;
  }
}

export default ApiHelper;
