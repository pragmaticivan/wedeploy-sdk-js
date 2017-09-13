'use strict';

import ApiHelper from '../ApiHelper';
import Query from '../../api-query/Query';
import Filter from '../../api-query/Filter';
import {
  assertDefAndNotNull,
  assertObject,
  assertResponseSucceeded,
} from '../assertions';
import {core} from 'metal';

/**
 * Class responsible for encapsulate data api calls.
 */
class DataApiHelper extends ApiHelper {
  /**
	 * Constructs an {@link DataApiHelper} instance.
	 * @param {!WeDeploy} wedeployClient {@link WeDeploy} client reference.
	 * @param {!string} dataUrl
	 * @constructor
	 */
  constructor(wedeployClient, dataUrl) {
    super(wedeployClient);

    this.isSearch_ = false;
    this.dataUrl = dataUrl;
  }

  /**
	 * Adds a filter to this request's {@link Query}.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainable
	 */
  where(fieldOrFilter, opt_operatorOrValue, opt_value) {
    this.getOrCreateFilter_().and(
      fieldOrFilter,
      opt_operatorOrValue,
      opt_value
    );
    return this;
  }

  /**
	 * Adds a filter to be composed with this filter using the "or" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 *   the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  or(fieldOrFilter, opt_operatorOrValue, opt_value) {
    if (this.getOrCreateFilter_().body().and.length === 0) {
      throw Error(
        'It\'s required to have a condition before using an \'or()\' ' +
          'for the first time.'
      );
    }
    this.getOrCreateFilter_().or(fieldOrFilter, opt_operatorOrValue, opt_value);
    return this;
  }

  /**
	 * Adds a filter to be compose with this filter using "none" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|*)} args A variable amount of values to be used with
	 * the "none" operator. Can be passed either as a single array or as
	 * separate params.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  none(field, ...args) {
    return this.where(Filter.none(field, args));
  }

  /**
	 * Adds a filter to be compose with this filter using "exists" operator.
	 * @param {!string} field The name of the field to filter by.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  exists(field) {
    return this.where(Filter.exists(field));
  }

  /**
	 * Adds a filter to be compose with this filter using "match" operator.
	 * @param {string} field If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  match(field, opt_query) {
    return this.where(Filter.match(field, opt_query));
  }

  /**
	 * Adds a filter to be compose with this filter using "prefix" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {string=} opt_query The query string.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  prefix(field, opt_query) {
    return this.where(Filter.prefix(field, opt_query));
  }

  /**
	 * Adds a filter to be compose with this filter using "similar" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 * should be the query string, in which case all fields will be matched.
	 * Otherwise, this should be the name of the field to match.
	 * @param {?string} query The query string.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  similar(fieldOrQuery, query) {
    return this.where(Filter.similar(fieldOrQuery, query));
  }

  /**
	 * Returns a {@link Filter} instance that uses the "<" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  lt(field, value) {
    return this.where(Filter.lt(field, value));
  }

  /**
	 * Returns a {@link Filter} instance that uses the "<=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  lte(field, value) {
    return this.where(Filter.lte(field, value));
  }

  /**
	 * Returns a {@link Filter} instance that uses the ">" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  gt(field, value) {
    return this.where(Filter.gt(field, value));
  }

  /**
	 * Returns a {@link Filter} instance that uses the ">=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  gte(field, value) {
    return this.where(Filter.gte(field, value));
  }

  /**
	 * Adds a filter to be compose with this filter using "any" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|*)} args A variable amount of values to be used with
	 * the "none" operator. Can be passed either as a single array or as
	 * separate params.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
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
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  boundingBox(field, boxOrUpperLeft, opt_lowerRight) {
    return this.where(
      Filter.boundingBox(field, boxOrUpperLeft, opt_lowerRight)
    );
  }

  /**
	 * Adds a filter to be compose with this filter using "gd" operator.
	 * @param {string} field The field's name.
	 * @param {*} locationOrCircle Either a `Geo.Circle` instance or a
	 * coordinate.
	 * @param {Range|string=} opt_rangeOrDistance Either a `Range` instance or
	 * the distance value.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  distance(field, locationOrCircle, opt_rangeOrDistance) {
    return this.where(
      Filter.distance(field, locationOrCircle, opt_rangeOrDistance)
    );
  }

  /**
	 * Adds a filter to be compose with this filter using "range" operator.
	 * @param {string} field The field's name.
	 * @param {*} rangeOrMin Either a `Range` instance or a the range's min
	 * value.
	 * @param {*=} opt_max The range's max value.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  range(field, rangeOrMin, opt_max) {
    return this.where(Filter.range(field, rangeOrMin, opt_max));
  }

  /**
	 * Sets the limit for this request's {@link Query}.
	 * @param {number} limit The max amount of entries that this request should
	 *   return.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  limit(limit) {
    this.getOrCreateQuery_().limit(limit);
    return this;
  }

  /**
	 * Sets the offset for this request's {@link Query}.
	 * @param {number} offset The index of the first entry that should be
	 * returned by this query.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  offset(offset) {
    this.getOrCreateQuery_().offset(offset);
    return this;
  }

  /**
	 * Adds a highlight entry to this request's {@link Query} instance.
	 * @param {string} field The field's name.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
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
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
	 * @chainnable
	 */
  aggregate(name, aggregationOrField, opt_operator) {
    this.getOrCreateQuery_().aggregate(name, aggregationOrField, opt_operator);
    return this;
  }

  /**
	 * Sets this request's query type to 'count'.
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
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
	 * @return {DataApiHelper} Returns the {@link DataApiHelper} object itself, so
	 *   calls can be chained.
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
	 * These Objects describe the attributes on the objects that are to be
	 *   created.
	 * ```javascript
	 * var data = WeDeploy.data('http://demodata.wedeploy.io');
	 *
	 * data.create(
	 *   'movies', {'title'=> 'Star Wars: Episode I – The Phantom Menace'})
	 * 	 .then(function(movie){
	 *     console.log(movie)
	 *   });
	 *
	 * data.create(
	 *   'movies', [{'title'=> 'Star Wars: Episode II – Attack of the Clones'},
	 * 						  {'title'=> 'Star Wars: Episode III – Revenge of the Sith'})
	 * 		 .then(function(movies){
	 * 			 console.log(movies)
	 *     });
	 * ```
	 * @param {string} collection Collection (key) used to create the new data.
	 * @param {Object} data Attributes on the object that is to be created.
	 * @return {!CancellablePromise}
	 */
  create(collection, data) {
    assertDefAndNotNull(collection, 'Collection key must be specified.');
    assertObject(data, 'Data can\'t be empty.');

    return this.buildUrl_()
      .path(collection)
      .post(data)
      .then(response => assertResponseSucceeded(response))
      .then(response => response.body());
  }

  /**
	 * Replaces the attributes of a document form the passed-in object and saves
	 * the record. If the object is invalid, the saving will fail and an error
	 * object will be returned.
	 *
	 * ```javascript
	 * var data = WeDeploy.data('http://demodata.wedeploy.io');
	 *
	 * data.replace('movies/1019112353', {'title'=> 'Star Wars: Episode I'})
	 * 		 .then(function(movie){
	 * 			 console.log(movie)
	 *     });
	 * ```
	 * @param {string} doc Key used to update the document.
	 * @param {Object} data Attributes on the object that is to be updated.
	 * @return {!CancellablePromise}
	 */
  replace(doc, data) {
    assertDefAndNotNull(doc, 'Document key must be specified.');
    assertObject(data, 'Data must be specified.');

    return this.buildUrl_()
      .path(doc)
      .put(data)
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
	 * @param {string} doc Key used to update the document.
	 * @param {Object} data Attributes on the object that is to be updated.
	 * @return {!CancellablePromise}
	 */
  update(doc, data) {
    assertDefAndNotNull(doc, 'Document key must be specified.');
    assertObject(data, 'Data must be specified.');

    return this.buildUrl_()
      .path(doc)
      .patch(data)
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
    assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

    return this.buildUrl_()
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
    assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

    return this.buildUrl_()
      .path(key)
      .get(this.processAndResetQueryState())
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
    assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

    this.isSearch_ = true;

    return this.buildUrl_()
      .path(key)
      .get(this.processAndResetQueryState())
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
    assertDefAndNotNull(collection, 'Collection key must be specified');

    return this.buildUrl_()
      .path(collection)
      .watch(this.processAndResetQueryState(), opt_options);
  }

  /**
	* Builds URL by joining the headers and auth.
	* @return {WeDeploy} Returns the {@link WeDeploy} object itself, so calls can
	*   be chained.
	* @chainable
	*/
  buildUrl_() {
    return this.wedeployClient
      .url(this.dataUrl)
      .headers(this.headers_)
      .auth(this.helperAuthScope);
  }

  /**
	 * Gets the currently used main {@link Filter} object. If none exists yet, a
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
	 * Aggregate filters into query and return its latest value. Query and
	 * filters are cleaned after aggregation.
	 * @return {Query}
	 * @protected
	 */
  processAndResetQueryState() {
    let filter;

    if (core.isDefAndNotNull(this.filter_)) {
      filter = this.getOrCreateFilter_();
    }

    if (this.isSearch_) {
      this.getOrCreateQuery_().search(filter);
    } else if (filter) {
      this.getOrCreateQuery_().filter(filter);
    }

    const query = this.query_;
    this.headers_.clear();
    this.filter_ = null;
    this.isSearch_ = false;
    this.query_ = null;
    return query;
  }
}

export default DataApiHelper;
