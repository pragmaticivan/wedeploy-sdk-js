'use strict';

import ApiHelper from '../ApiHelper';
import {assertDefAndNotNull, assertResponseSucceeded} from '../assertions';

/**
 * Class responsible for encapsulate email api calls.
 */
class EmailApiHelper extends ApiHelper {
  /**
	 * Constructs an {@link EmailApiHelper} instance.
	 * @param {!WeDeploy} wedeployClient {@link WeDeploy} client reference.
	 * @constructor
	 */
  constructor(wedeployClient) {
    super(wedeployClient);
    this.params = {};
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

    this.params.from = from;

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

    this.params.bcc = bcc;

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

    this.params.cc = cc;

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

    this.params.message = message;

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

    this.params.priority = priority;

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

    this.params.replyTo = replyTo;

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

    this.params.to = to;

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

    this.params.subject = subject;

    return this;
  }

  /**
	 * Sends an email based on given params.
	 * @return {!CancellablePromise}
	 */
  send() {
    const client = this.wedeployClient
      .url(this.wedeployClient.emailUrl_)
      .auth(this.helperAuthScope)
      .path('emails');

    Object.keys(this.params).forEach(key => client.form(key, this.params[key]));

    this.params = {};

    return client
      .post()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
	 * Check the status of an email.
	 * @param  {string} emailId
	 * @return {!CancellablePromise}
	 */
  status(emailId) {
    assertDefAndNotNull(emailId, 'Parameter "emailId" param must be specified');

    return this.wedeployClient
      .url(this.wedeployClient.emailUrl_)
      .auth(this.helperAuthScope)
      .path('emails', emailId, 'status')
      .get()
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }
}

export default EmailApiHelper;
