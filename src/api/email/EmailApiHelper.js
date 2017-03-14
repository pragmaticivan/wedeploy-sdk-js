'use strict';

import ApiHelper from '../ApiHelper';
import { assertDefAndNotNull, assertResponseSucceeded } from '../assertions';

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
		this.params_ = {};
	}

	/**
	 * Set from attribute on params to be send on email request.
	 * @param  {string} from
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself, so calls can be chained.
	 * @chainable
	 */
	from(from) {
		assertDefAndNotNull(from, '"from" must be specified');

		this.params_.from = from;

		return this;
	}

	/**
	 * Set bcc attribute on params to be send on email request.
	 * @param  {string} bcc
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself, so calls can be chained.
	 * @chainable
	 */
	bcc(bcc) {
		assertDefAndNotNull(bcc, '"bcc" must be specified');

		this.params_.bcc = bcc;

		return this;
	}

	/**
	 * Set cc attribute on params to be send on email request.
	 * @param  {string} cc
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself, so calls can be chained.
	 * @chainable
	 */
	cc(cc) {
		assertDefAndNotNull(cc, '"cc" must be specified');

		this.params_.cc = cc;

		return this;
	}

	/**
	 * Set message attribute on params to be send on email request.
	 * @param  {string} message
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself, so calls can be chained.
	 * @chainable
	 */
	message(message) {
		assertDefAndNotNull(message, '"message" must be specified');

		this.params_.message = message;

		return this;
	}

	/**
	 * Set priority attribute on params to be send on email request.
	 * @param  {string} priority
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself, so calls can be chained.
	 * @chainable
	 */
	priority(priority) {
		assertDefAndNotNull(priority, '"priority" must be specified');

		this.params_.priority = priority;

		return this;
	}

	/**
	 * Set replyTo attribute on params to be send on email request.
	 * @param  {string} replyTo
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself, so calls can be chained.
	 * @chainable
	 */
	replyTo(replyTo) {
		assertDefAndNotNull(replyTo, '"replyTo" must be specified');

		this.params_.replyTo = replyTo;

		return this;
	}

	/**
	 * Set to attribute on params to be send on email request.
	 * @param  {string} to
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself, so calls can be chained.
	 * @chainable
	 */
	to(to) {
		assertDefAndNotNull(to, '"to" must be specified');

		this.params_.to = to;

		return this;
	}

	/**
	 * Set subject attribute on params to be send on email request.
	 * @param  {string} subject
	 * @return {EmailApiHelper} Returns the {@link EmailApiHelper} object itself, so calls can be chained.
	 * @chainable
	 */
	subject(subject) {
		assertDefAndNotNull(subject, '"subject" must be specified');

		this.params_.subject = subject;

		return this;
	}

	/**
	 * Sends an email based on given params.
	 * @return {!CancellablePromise}
	 */
	send() {
		const client = this.wedeployClient
			.url(this.wedeployClient.emailUrl_);

		const clientWithParams = this.setParams_(client);
		this.params_ = null;

		return clientWithParams
			.auth(this.helperAuthScope)
			.path(this.emailPath_())
			.post()
			.then((response) => assertResponseSucceeded(response))
			.then((response) => response.body());
	}

	/**
	 * Check the status of an email.
	 * @param  {string} emailId
	 * @return {!CancellablePromise}
	 */
	status(emailId) {
		assertDefAndNotNull(emailId, '"emailId" param must be specified');

		return this.wedeployClient
			.url(this.wedeployClient.emailUrl_)
			.auth(this.helperAuthScope)
			.path(this.emailPath_(), emailId, this.statusPath_())
			.get()
			.then((response) => assertResponseSucceeded(response))
			.then((response) => response.body());
	}

	/**
	 * Set params on wedeploy client.
	 * @param  {WeDeploy} wedeployClient
	 * @return {WeDeploy}
	 */
	setParams_(wedeployClient) {
		let client = wedeployClient;

		const keys = Object.keys(this.params_);

		if (keys.length === 0) {
			return client;
		}

		keys.forEach((key) => {
			client = client.form(key, this.params_[key]);
		});

		return client;
	}

	/**
	 * Email path
	 * @return {string}
	 */
	emailPath_() {
		return 'emails';
	}

	/**
	 * Status path
	 * @return {string}
	 */
	statusPath_() {
		return 'status';
	}

}

export default EmailApiHelper;
