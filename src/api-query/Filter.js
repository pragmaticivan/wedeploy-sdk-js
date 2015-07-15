'use strict';

import core from 'bower:metal/src/core';
import SimpleFilter from './SimpleFilter';

/**
 * Object with helper functions for creating different types
 * of filters.
 */
var Filter = {
	/**
	 * Returns a SimpleFilter instance that uses the "=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!SimpleFilter}
	 */
	equal: function(field, value) {
		return new SimpleFilter(field, '=', value);
	},

	/**
	 * Returns a SimpleFilter instance that uses the ">" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!SimpleFilter}
	 */
	gt: function(field, value) {
		return new SimpleFilter(field, '>', value);
	},

	/**
	 * Returns a SimpleFilter instance that uses the ">=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!SimpleFilter}
	 */
	gte: function(field, value) {
		return new SimpleFilter(field, '>=', value);
	},

	/**
	 * Returns a SimpleFilter instance that uses the "in" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {...*} value A variable amount of values to be used with
	 *   the "in" operator.
	 * @return {!SimpleFilter}
	 */
	in: function(field) {
		return new SimpleFilter(field, 'in', Array.prototype.slice.call(arguments, 1));
	},

	/**
	 * Returns a SimpleFilter instance that uses the "like" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!SimpleFilter}
	 */
	like: function(field, value) {
		return new SimpleFilter(field, 'like', value);
	},

	/**
	 * Returns a SimpleFilter instance that uses the "<" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!SimpleFilter}
	 */
	lt: function(field, value) {
		return new SimpleFilter(field, '<', value);
	},

	/**
	 * Returns a SimpleFilter instance that uses the "<=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!SimpleFilter}
	 */
	lte: function(field, value) {
		return new SimpleFilter(field, '<=', value);
	},

	/**
	 * Returns a SimpleFilter instance that uses the "!=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!SimpleFilter}
	 */
	notEqual: function(field, value) {
		return new SimpleFilter(field, '!=', value);
	},

	/**
	 * Returns a SimpleFilter instance.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} operatorOrValue If a third param is given, this should
	 *   be the filter's operator (like ">="). Otherwise, this will be
	 *   used as the filter's value, and the filter's operator will be "=".
	 * @param {*} opt_value The filter's value.
	 * @return {!SimpleFilter}
	 */
	of: function(field, operatorOrValue, opt_value) {
		if (core.isDef(opt_value)) {
			return new SimpleFilter(field, operatorOrValue, opt_value);
		} else {
			return Filter.equal(field, operatorOrValue);
		}
	}
};

export default Filter;
