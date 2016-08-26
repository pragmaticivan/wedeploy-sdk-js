'use strict';

import globals from '../../globals/globals';
import { assertNotNull, assertObject, assertDefAndNotNull, assertResponseSucceeded } from '../assertions';

/**
 * Class responsible for encapsulate data api calls.
 */
class DataApiHelper {

	/**
	 * Constructs an {@link DataApiHelper} instance.
	 * @constructor
	 */
	constructor(wedeployClient) {
		assertDefAndNotNull(wedeployClient, 'WeDeploy client reference must be specified');
		this.wedeployClient = wedeployClient;
	}

	/**
	 * Insert data.
	 * @param {string} collection
	 * @param {Object} data
	 * @return {!CancellablePromise}
	 */
	create(collection, data) {
		assertNotNull(collection, "Collection key must be specified");
		assertObject(data, "Data can't be empty");

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(collection)
			.post(data)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Update data.
	 * @param {string} collection
	 * @param {Object} data
	 * @return {!CancellablePromise}
	 */
	update(collection, data) {
		assertNotNull(collection, "Collection key must be specified");
		assertObject(data, "Data must be specified");

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(collection)
			.put(data)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Delete data
	 * @param {string} collection
	 * @return {!CancellablePromise}
	 */
	delete(collection) {
		assertNotNull(collection, "Collection key must be specified");

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(collection)
			.delete();
	}

	/**
	 * [WIP]
	 * @param  {[type]} collection [description]
	 * @return {[type]}            [description]
	 */
	get(collection) {
		assertNotNull(collection, "Collection key must be specified");

		return this.wedeployClient
		.path(collection)
		.get()

	}

	first() {

	}

	last() {

	}

	// SQL

	/**
	 * WIP
	 * Sets the limit for this request's {@link Query}.
	 * @param {number} limit The max amount of entries that this request should return.
	 * @chainable
	 */
	limit(limit) {
		this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.limit(limit);
		return this;
	}

	/**
	 * WIP
	 * Sets the offset for this request's {@link Query}.
	 * @param {number} offset The index of the first entry that should be returned
	 *   by this query.
	 * @chainable
	 */
	offset(offset) {
		this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.limit(limit);
		return this;
	}

}

export default DataApiHelper;
