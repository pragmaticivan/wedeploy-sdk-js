'use strict';

import Query from '../../api-query/Query';
import Filter from '../../api-query/Filter';
import { assertNotNull, assertObject, assertDefAndNotNull, assertResponseSucceeded } from '../assertions';
import { core } from 'metal';

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
	 * Adds a filter to this request's {@link Query}.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainable
	 */
	where(fieldOrFilter, opt_operatorOrValue, opt_value) {
		this.getOrCreateFilter_().and(fieldOrFilter, opt_operatorOrValue, opt_value);
		return this;
	}

	/**
	 * Adds a filter to be composed with this filter using the "or" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 *   the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainnable
	 */
	or(fieldOrFilter, opt_operatorOrValue, opt_value) {
		if (this.getOrCreateFilter_().body().and.length === 0) {
			throw Error('It\'s required to have a condition before using an \'or()\' for the first time.');
		}
		this.getOrCreateFilter_().or(fieldOrFilter, opt_operatorOrValue, opt_value);
		return this;
	}

	/**
	 * Adds a filter to be compose with this filter using "none" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|...*)} args A variable amount of values to be used with
	 * the "none" operator. Can be passed either as a single array or as
	 * separate params.
	 * @chainnable
	 */
	none(field, ...args) {
		return this.where(Filter.none(field, args));
	}

	/**
	 * Adds a filter to be compose with this filter using "match" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 * should be the query string, in which case all fields will be matched.
	 * Otherwise, this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @chainnable
	 */
	match(field, value) {
		return this.where(Filter.match(field, value));
	}

	/**
	 * Adds a filter to be compose with this filter using "similar" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 * should be the query string, in which case all fields will be matched.
	 * Otherwise, this should be the name of the field to match.
	 * @param {?string} query The query string.
	 * @chainnable
	 */
	similar(fieldOrQuery, query) {
		return this.where(Filter.similar(fieldOrQuery, query));
	}

	/**
	 * Returns a {@link Filter} instance that uses the "<" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	lt(field, value) {
		return this.where(Filter.lt(field, value));
	}

	/**
	 * Returns a {@link Filter} instance that uses the "<=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	lte(field, value) {
		return this.where(Filter.lte(field, value));
	}


	/**
	 * Adds a filter to be compose with this filter using "any" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|...*)} args A variable amount of values to be used with
	 * the "none" operator. Can be passed either as a single array or as
	 * separate params.
	 * @chainnable
	 */
	any(field, ...args) {
		return this.where(Filter.any(field, args));
	}

	/**
	 * Adds a filter to be compose with this filter using "gp" operator. This is a
	 * special use case of `Filter.polygon` for bounding boxes.
	 * @param {string} field The field's name.
	 * @param {*} boxOrUpperLeft Either a `Geo.BoundingBox` instance, or a
	 * bounding box's upper left coordinate.
	 * @param {*=} opt_lowerRight A bounding box's lower right coordinate.
	 * @chainnable
	 */
	boundingBox(field, boxOrUpperLeft, opt_lowerRight) {
		return this.where(Filter.boundingBox(field, boxOrUpperLeft, opt_lowerRight));
	}

	/**
	 * Adds a filter to be compose with this filter using "gd" operator.
	 * @param {string} field The field's name.
	 * @param {*} locationOrCircle Either a `Geo.Circle` instance or a
	 * coordinate.
	 * @param {Range|string=} opt_rangeOrDistance Either a `Range` instance or
	 * the distance value.
	 * @return {!Filter}
	 * @chainnable
	 */
	distance(field, locationOrCircle, opt_rangeOrDistance) {
		return this.where(Filter.distance(field, locationOrCircle, opt_rangeOrDistance));
	}

	/**
	 * Adds a filter to be compose with this filter using "range" operator.
	 * @param {string} field The field's name.
	 * @param {*} rangeOrMin Either a `Range` instance or a the range's min
	 * value.
	 * @param {*=} opt_max The range's max value.
	 * @return {!Filter}
	 * @chainnable
	 */
	range(field, rangeOrMin, opt_max) {
		return this.where(Filter.range(field, rangeOrMin, opt_max));
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
	 * @param {string} key Key used to delete the
	 * document/field/collection.
	 * @return {!CancellablePromise}
	 */
	delete(key) {
		assertNotNull(key, 'Document/Field/Collection key must be specified');

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(key)
			.delete()
			.then(response => assertResponseSucceeded(response))
			.then(() => undefined);
	}

	/**
	 * Retrieve data from a [document/field/collection].
	 * @param {string} key Key used to delete the document/field/collection.
	 * @return {!CancellablePromise}
	 */
	get(key) {
		assertNotNull(key, 'Document/Field/Collection key must be specified');

		this.addFiltersToQuery_();

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(key)
			.get(this.query_)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Retrieve data from a [document/field/collection] and put it in a search
	 * format.
	 * @param {string} key Key used to delete the document/field/collection.
	 * @return {!CancellablePromise}
	 */
	search(key) {
		assertNotNull(key, 'Document/Field/Collection key must be specified');

		this.onSearch_();

		this.addFiltersToQuery_();

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(key)
			.get(this.query_)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Creates new socket.io instance. Monitor the arrival of new broadcasted
	 * data.
	 * @param  {string} collection key/collection used to find organized data.
	 * @param  {Object=} opt_options Object with Socket IO options.
	 * @return {!io} Socket IO reference. Server events can be listened on it.
	 */
	watch(collection, opt_options) {
		assertNotNull(collection, 'Collection key must be specified');

		this.addFiltersToQuery_();

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.path(collection)
			.watch(this.query_, opt_options);
	}

	/**
	 * Gets the currentl used main {@link Filter} object. If none exists yet, a
	 * new one is created.
	 * @return {!Query}
	 * @protected
	 */
	getOrCreateFilter_() {
		if (!this.filter_) {
			this.filter_ = new Filter();
		}
		return this.filter_;
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

	/**
	 * Load the currently used main {@link Filter} object into the currently
	 * used {@link Query}.
	 * @chainable
	 * @protected
	 */
	addFiltersToQuery_() {
		if (core.isDef(this.filter_) && this.toSearch_ !== true) {
			this.getOrCreateQuery_().filter(this.filter_);
		}
		return this;
	}

	/**
	 * Adds a search to this request's {@link Query} instance.
	 * @chainable
	 * @protected
	 */
	onSearch_() {
		if (core.isDef(this.filter_)) {
			this.getOrCreateQuery_().search(this.getOrCreateFilter_());
		} else {
			throw Error('It\'s required to have a condition before using an \'search()\' for the first time.');
		}
		this.toSearch_ = true;
		return this;
	}

}

export default DataApiHelper;
