'use strict';

import { core } from 'metal';

import { assertDefAndNotNull, assertObject, assertResponseSucceeded } from '../assertions';

/**
 * Class responsible for storing authorization information.
 */
class Auth {
	/**
	 * Constructs an {@link Auth} instance.
	 * @param {string} tokenOrEmail Either the authorization token, or
	 *   the username.
	 * @param {string=} opt_password If a username is given as the first param,
	 *   this should be the password.
	 * @constructor
	 */
	constructor(tokenOrEmail, opt_password = null) {
		this.token = core.isString(opt_password) ? null : tokenOrEmail;
		this.email = core.isString(opt_password) ? tokenOrEmail : null;
		this.password = opt_password;

		this.createdAt = null;
		this.id = null;
		this.name = null;
		this.photoUrl = null;
		this.wedeployClient = null;
	}

	/**
	 * Constructs an {@link Auth} instance.
	 * @param {string} tokenOrUsername Either the authorization token, or
	 *   the username.
	 * @param {string=} opt_password If a username is given as the first param,
	 *   this should be the password.
	 * @return {!Auth}
	 */
	static create(tokenOrUsername, opt_password) {
		return new Auth(tokenOrUsername, opt_password);
	}

	/**
	 * Gets the created at date.
	 * @return {string}
	 */
	getCreatedAt() {
		return this.createdAt;
	}

	/**
	 * Gets the email.
	 * @return {string}
	 */
	getEmail() {
		return this.email;
	}

	/**
	 * Gets the id.
	 * @return {string}
	 */
	getId() {
		return this.id;
	}

	/**
	 * Gets the name.
	 * @return {string}
	 */
	getName() {
		return this.name;
	}

	/**
	 * Gets the password.
	 * @return {string}
	 */
	getPassword() {
		return this.password;
	}

	/**
	 * Gets the photo url.
	 * @return {string}
	 */
	getPhotoUrl() {
		return this.photoUrl;
	}

	/**
	 * Gets the token.
	 * @return {string}
	 */
	getToken() {
		return this.token;
	}

	/**
	 * Checks if created at is set.
	 * @return {boolean}
	 */
	hasCreatedAt() {
		return core.isDefAndNotNull(this.createdAt);
	}

	/**
	 * Checks if the email is set.
	 * @return {boolean}
	 */
	hasEmail() {
		return core.isDefAndNotNull(this.email);
	}

	/**
	 * Checks if the id is set.
	 * @return {boolean}
	 */
	hasId() {
		return core.isDefAndNotNull(this.id);
	}

	/**
	 * Checks if the name is set.
	 * @return {boolean}
	 */
	hasName() {
		return core.isDefAndNotNull(this.name);
	}

	/**
	 * Checks if the password is set.
	 * @return {boolean}
	 */
	hasPassword() {
		return core.isDefAndNotNull(this.password);
	}

	/**
	 * Checks if the photo url is set.
	 * @return {boolean}
	 */
	hasPhotoUrl() {
		return core.isDefAndNotNull(this.photoUrl);
	}

	/**
	 * Checks if the token is set.
	 * @return {boolean}
	 */
	hasToken() {
		return core.isDefAndNotNull(this.token);
	}

	/**
	 * Sets created at.
	 * @param {string} createdAt
	 */
	setCreatedAt(createdAt) {
		this.createdAt = createdAt;
	}

	/**
	 * Sets the email.
	 * @param {string} email
	 */
	setEmail(email) {
		this.email = email;
	}

	/**
	 * Sets the id.
	 * @param {string} id
	 */
	setId(id) {
		this.id = id;
	}

	/**
	 * Sets the name.
	 * @param {string} name
	 */
	setName(name) {
		this.name = name;
	}

	/**
	 * Sets the password.
	 * @param {string} password
	 */
	setPassword(password) {
		this.password = password;
	}

	/**
	 * Sets the photo url.
	 * @param {string} photoUrl
	 */
	setPhotoUrl(photoUrl) {
		this.photoUrl = photoUrl;
	}

	/**
	 * Sets the token.
	 * @param {string} token
	 */
	setToken(token) {
		this.token = token;
	}

	setWedeployClient(wedeployClient) {
		this.wedeployClient = wedeployClient;
	}

	updateUser(data) {
		assertObject(data, 'User data must be specified as object');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/users')
			.auth(this)
			.patch(data)
			.then(response => assertResponseSucceeded(response));
	}

	deleteUser() {
		assertDefAndNotNull(this.id, 'Cannot delete user without id');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/users', this.id)
			.auth(this)
			.delete()
			.then(response => assertResponseSucceeded(response));
	}
}

export default Auth;
