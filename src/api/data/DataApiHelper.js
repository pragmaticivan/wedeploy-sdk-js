'use strict';

import globals from '../../globals/globals';
import { assertNotNull, assertObject, assertDefAndNotNull, assertResponseSucceeded } from '../assertions';
import Query from '../../api-query/Query';

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

		// sandbox
		this.wedeployClientInstance = wedeployClient.url(this.wedeployClient.dataUrl_);
		this.result = null;
	}

	/**
	 * Sets the limit for this request's {@link Query}.
	 * @param {number} limit The max amount of entries that this request should return.
	 * @chainable
	 */
	limit(limit) {
		this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.getOrCreateQuery()
			.limit(limit);

		return this;
	}


	limit(limit) {
		this.getOrCreateQuery().limit(limit);
		return this;
	}

	/**
	 * [sandbox]
	 * Gets the currently used {@link Query} object. If none exists yet,
	 * a new one is created.
	 * @return {!Query}
	 */
	getOrCreateQuery() {
		if (!this.wedeployClientInstance.query_) {
			this.wedeployClientInstance.query_ = new Query();
		}
		return this.wedeployClientInstance.query_;
	}

	/**
	 * Adds a search to this request's {@link Query} instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a `Filter`
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string=} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*=} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @chainable
	 */
	search(filterOrTextOrField, opt_textOrOperator, opt_value) {
		this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.getOrCreateQuery()
			.search(filterOrTextOrField, opt_textOrOperator, opt_value);

		return this.wedeployClient;
	}


	/**
	 * Sets the offset for this request's {@link Query}.
	 * @param {number} offset The index of the first entry that should be returned
	 *   by this query.
	 * @chainable
	 */
	offset(offset) {
		this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.getOrCreateQuery()
			.offset(offset);

		return this.wedeployClient;
	}

	/**
	 * Adds a filter to this request's {@link Query}.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainable
	 */
	where(fieldOrFilter, opt_operatorOrValue, opt_value) {
		this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.getOrCreateQuery()
			.filter(fieldOrFilter, opt_operatorOrValue, opt_value);

		return this.wedeployClient;
	}

	/**
	 * Adds a highlight entry to this request's {@link Query} instance.
	 * @param {string} field The field's name.
	 * @chainable
	 */
	highlight(field) {
		this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.getOrCreateQuery()
			.highlight(field);

		return this.wedeployClient;
	}

	/**
	 * Adds an aggregation to this {@link Query} instance.
	 * @param {string} name The aggregation name.
	 * @param {!Aggregation|string} aggregationOrField Either an
	 *   {@link Aggregation} instance or the name of the aggregation field.
	 * @param {string=} opt_operator The aggregation operator.
	 * @chainable
	 */
	aggregate(name, aggregationOrField, opt_operator) {
		this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.getOrCreateQuery()
			.aggregate(name, aggregationOrField, opt_operator);

		return this.wedeployClient;
	}

	/**
	 * Sets this request's query type to "count".
	 * @chainnable
	 */
	count() {
		this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.getOrCreateQuery()
			.type('count');

		return this.wedeployClient;
	}

	/**
	 * Adds a sort query to this request's body.
	 * @param {string} field The field that the query should be sorted by.
	 * @param {string=} opt_direction The direction the sort operation should use.
	 *   If none is given, "asc" is used by default.
	 * @chainnable
	 */
	orderBy(field, opt_direction) {
		this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.getOrCreateQuery()
			.sort(field, opt_direction)

		return this.wedeployClient;
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
	 * get/findclear
	 * @param  {string} collection [description]
	 * @return {!CancellablePromise}            [description]
	 */
	get(collection) {
		assertNotNull(collection, "Collection key must be specified");

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(collection)
			.get()
			.then(response => assertResponseSucceeded(response))
			.then(response => {
				return response.body();
			});
	}

	/**
	 * TO DO
	 * @param  {[type]} collection [description]
	 * @return {[type]}            [description]
	 */
	all(collection) {

	}

	urlInstance() {
		if (this.wedeployClient instanceof WeDeploy) {
			return this.wedeployClient;
		} else {
			return this.wedeployClient.url(this.wedeployClient.dataUrl_);
		}
	}

	/**
	 * TO DO
	 * @return {[type]} [description]
	 */
	range() {

	}

	/**
	 * TO DO
	 * @return {[type]} [description]
	 */
	first() {

	}

	/**
	 * TO DO
	 * @return {[type]} [description]
	 */
	last() {

	}


}

export default DataApiHelper;
