'use strict';

import Query from '../../api-query/Query';
import { assertNotNull, assertObject, assertDefAndNotNull, assertResponseSucceeded } from '../assertions';

/**
 * Class responsible for encapsulate data api calls.
 */
class DataApiHelper {
	/**
	 * Constructs an {@link DataApiHelper} instance.
	 * @param {@link WeDeploy} instance.
	 * @constructor
	 */
	constructor(wedeployClient) {
		assertDefAndNotNull(wedeployClient, 'WeDeploy client reference must be specified');
		this.wedeployClient = wedeployClient;
	}

	/**
	 * Adds a search to this request's {@link Query} instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments are
	 * passed to this function, this should be either a `Filter` instance or a
	 * text to be used in a match filter. In both cases the filter will be
	 * applied to all fields. Another option is to pass this as a field name
	 * instead, together with other arguments so the filter can be created.
	 * @param {string=} opt_textOrOperator Either a text to be used in a match
	 * filter, or the operator that should be used.
	 * @param {*=} opt_value The value to be used by the filter. Should only be
	 * passed if an operator was passed as the second argument.
	 * @chainable
	 */
	search(filterOrTextOrField, opt_textOrOperator, opt_value) {
		this.getOrCreateQuery_().search(filterOrTextOrField, opt_textOrOperator, opt_value);
		return this;
	}

	/**
	 * Adds a filter to this request's {@link Query}.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 * name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainable
	 */
	where(fieldOrFilter, opt_operatorOrValue, opt_value) {
		this.getOrCreateQuery_().filter(fieldOrFilter, opt_operatorOrValue, opt_value);
		return this;
	}

	/**
	 * Sets the limit for this request's {@link Query}.
	 * @param {number} limit The max amount of entries that this request should return.
	 * @chainable
	 */
	limit(limit) {
		this.getOrCreateQuery_().limit(limit);
		return this;
	}

	/**
	 * Sets the offset for this request's {@link Query}.
	 * @param {number} offset The index of the first entry that should be
	 * returned by this query.
	 * @chainable
	 */
	offset(offset) {
		this.getOrCreateQuery_().offset(offset);
		return this;
	}

	/**
	 * Adds a highlight entry to this request's {@link Query} instance.
	 * @param {string} field The field's name.
	 * @chainable
	 */
	highlight(field) {
		this.getOrCreateQuery_().highlight(field);
		return this;
	}

	/**
	 * Adds an aggregation to this {@link Query} instance.
	 * @param {string} name The aggregation name.
	 * @param {!Aggregation|string} aggregationOrField Either an {@link
	 * Aggregation} instance or the name of the aggregation field.
	 * @param {string=} opt_operator The aggregation operator.
	 * @chainable
	 */
	aggregate(name, aggregationOrField, opt_operator) {
		this.getOrCreateQuery_().aggregate(name, aggregationOrField, opt_operator);
		return this;
	}

	/**
	 * Sets this request's query type to 'count'.
	 * @chainnable
	 */
	count() {
		this.getOrCreateQuery_().type('count');
		return this;
	}

	/**
	 * Adds a sort query to this request's body.
	 * @param {string} field The field that the query should be sorted by.
	 * @param {string=} opt_direction The direction the sort operation should
	 * use. If none is given, 'asc' is used by default.
	 * @chainnable
	 */
	orderBy(field, opt_direction) {
		this.getOrCreateQuery_().sort(field, opt_direction);
		return this;
	}

	/**
	 * Creates an object (or multiple objects) and saves it to WeDeploy data. If
	 * there's a validation registered in the collection and the request is
	 * successful, the resulting object (or array of objects) is returned. The
	 * data parameter can be either an Object or an Array of Objects.
	 * These Objects describe the attributes on the objects that are to be created.
	 * ```javascript
	 * var data = WeDeploy.data('http://demodata.wedeploy.io');
	 *
	 * data.create('movies', {'title'=> 'Star Wars: Episode I – The Phantom Menace'})
	 * 		 .then(function(movie){
	 * 			 console.log(movie)
	 *     });
	 *
	 * data.create('movies', [{'title'=> 'Star Wars: Episode II – Attack of the Clones'},
	 * 												{'title'=> 'Star Wars: Episode III – Revenge of the Sith'})
	 * 		 .then(function(movies){
	 * 			 console.log(movies)
	 *     });
	 * ```
	 * @param {string} collection Collection (key) used to create the new data.
	 * @param {Object} data Attributes on the object that is to be created.
	 * @return {!CancellablePromise}
	 */
	create(collection, data) {
		assertNotNull(collection, 'Collection key must be specified.');
		assertObject(data, 'Data can\'t be empty.');

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(collection)
			.post(data)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Update the attributes of a document form the passed-in object and saves
	 * the record. If the object is invalid, the saving will fail and an error
	 * object will be returned.
	 *
	 * ```javascript
	 * var data = WeDeploy.data('http://demodata.wedeploy.io');
	 *
	 * data.update('movies/1019112353', {'title'=> 'Star Wars: Episode I'})
	 * 		 .then(function(movie){
	 * 			 console.log(movie)
	 *     });
	 * ```
	 * @param {string} document Key used to update the document.
	 * @param {Object} data Attributes on the object that is to be updated.
	 * @return {!CancellablePromise}
	 */
	update(document, data) {
		assertNotNull(document, 'Document key must be specified.');
		assertObject(data, 'Data must be specified.');

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(document)
			.put(data)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Deletes a [document/field/collection].
	 * @param {string} collection
	 * @return {!CancellablePromise}
	 */
	delete(key) {
		assertNotNull(key, 'Document/Field/Collection key must be specified');

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(key)
			.delete()
			.then(response => assertResponseSucceeded(response))
			.then(response => undefined);
	}

	/**
	 * get/findclear
	 * @param {string} collection [description]
	 * @return {!CancellablePromise}            [description]
	 */
	get(collection) {
		assertNotNull(collection, 'Collection key must be specified');

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(collection)
			.get(this.query_)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Creates new socket.io instance. Monitor the arrival of new broadcasted data
	 * @param  {string} collection key/collection used to find organized data.
	 * @param  {Object=} opt_options Object with Socket IO options.
	 * @return {!io} Socket IO reference. Server events can be listened on it.
	 */
	watch(collection, opt_options) {
		assertNotNull(collection, 'Collection key must be specified');
		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(collection)
			.watch(this.query_, opt_options);
	}

	/**
	 * Gets the currently used {@link Query} object. If none exists yet,
	 * a new one is created.
	 * @return {!Query}
	 * @protected
	 */
	getOrCreateQuery_() {
		if (!this.query_) {
			this.query_ = new Query();
		}
		return this.query_;
	}

}

export default DataApiHelper;
