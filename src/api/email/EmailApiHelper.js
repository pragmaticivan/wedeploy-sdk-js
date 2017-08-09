'use strict';

import {assertDefAndNotNull, assertResponseSucceeded} from '../assertions';
import {MultiMap} from 'metal-structs';
import ApiHelper from '../ApiHelper';

/**
 * Class responsible for encapsulate email api calls.
 */
class EmailApiHelper extends ApiHelper {
  /**
	 * Constructs an {@link EmailApiHelper} instance.
	 * @param {!WeDeploy} wedeployClient {@link WeDeploy} client reference.
	 * @param {!string} emailUrl
	 * @constructor
	 */
  constructor(wedeployClient, emailUrl) {
    super(wedeployClient);
    this.emailUrl = emailUrl;
    this.params = new MultiMap();
  }

  /**
	 * Set from attribute on params to be send on email request.
	 * @param  {string} from
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
	 *   so calls can be chained.
	 * @chainable
	 */
  from(from) {
    assertDefAndNotNull(from, 'Parameter "from" must be specified');

    this.params.set('from', from);

    return this;
  }

  /**
	 * Set bcc attribute on params to be send on email request.
	 * @param  {string} bcc
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
	 *   so calls can be chained.
	 * @chainable
	 */
  bcc(bcc) {
    assertDefAndNotNull(bcc, 'Parameter "bcc" must be specified');

    this.params.add('bcc', bcc);

    return this;
  }

  /**
	 * Set cc attribute on params to be send on email request.
	 * @param  {string} cc
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
	 *   so calls can be chained.
	 * @chainable
	 */
  cc(cc) {
    assertDefAndNotNull(cc, 'Parameter "cc" must be specified');

    this.params.add('cc', cc);

    return this;
  }

  /**
	 * Set message attribute on params to be send on email request.
	 * @param  {string} message
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
	 *   so calls can be chained.
	 * @chainable
	 */
  message(message) {
    assertDefAndNotNull(message, 'Parameter "message" must be specified');

    this.params.set('message', message);

    return this;
  }

  /**
	 * Set priority attribute on params to be send on email request.
	 * @param  {string} priority
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
	 *   so calls can be chained.
	 * @chainable
	 */
  priority(priority) {
    assertDefAndNotNull(priority, 'Parameter "priority" must be specified');

    this.params.set('priority', priority);

    return this;
  }

  /**
	 * Set replyTo attribute on params to be send on email request.
	 * @param  {string} replyTo
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
	 *   so calls can be chained.
	 * @chainable
	 */
  replyTo(replyTo) {
    assertDefAndNotNull(replyTo, 'Parameter "replyTo" must be specified');

    this.params.set('replyTo', replyTo);

    return this;
  }

  /**
	 * Set to attribute on params to be send on email request.
	 * @param  {string} to
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
	 *   so calls can be chained.
	 * @chainable
	 */
  to(to) {
    assertDefAndNotNull(to, 'Parameter "to" must be specified');

    this.params.add('to', to);

    return this;
  }

  /**
	 * Set subject attribute on params to be send on email request.
	 * @param  {string} subject
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself,
	 *   so calls can be chained.
	 * @chainable
	 */
  subject(subject) {
    assertDefAndNotNull(subject, 'Parameter "subject" must be specified');

    this.params.set('subject', subject);

    return this;
  }

  /**
	 * Sends an email based on given params.
	 * @return {!CancellablePromise}
	 */
  send() {
    const client = this.buildUrl_().path('emails');

    this.params.names().forEach(name => {
      const values = this.params.getAll(name);

      values.forEach(value => {
        client.form(name, value);
      });
    });

    this.params.clear();
    this.headers_.clear();

    return client
      .post()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
	 * Checks the status of an email.
	 * @param  {string} emailId
	 * @return {!CancellablePromise}
	 */
  status(emailId) {
    assertDefAndNotNull(emailId, 'Parameter "emailId" param must be specified');

    return this.buildUrl_()
      .path('emails', emailId, 'status')
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
   * Builds URL by joining the headers and auth.
   * @return {WeDeploy} Returns the {@link WeDeploy} object itself, so calls can
   *   be chained.
   * @chainable
   */
  buildUrl_() {
    return this.wedeployClient
      .url(this.emailUrl)
      .headers(this.headers_)
      .auth(this.helperAuthScope);
  }
}

export default EmailApiHelper;
