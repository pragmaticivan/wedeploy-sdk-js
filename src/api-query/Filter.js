'use strict';

import core from 'bower:metal/src/core';

/**
 * Class responsible for building filters.
 */
class Filter {
	/**
	 * Constructs a Filter instance.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} operatorOrValue If a third param is given, this should
	 *   be the filter's operator (like ">="). Otherwise, this will be
	 *   used as the filter's value, and the filter's operator will be "=".
	 * @param {*} opt_value The filter's value.
	 * @constructor
	 */
	constructor(field, operatorOrValue, opt_value) {
		var valueIsDef = core.isDef(opt_value);
		this.body_ = {};
		this.body_[field] = {
			operator: valueIsDef ? operatorOrValue : '=',
			value: valueIsDef ? opt_value : operatorOrValue
		};
	}

	/**
	 * Adds a filter to be composed with this filter through the given operator.
	 * @param {string} operator
	 * @param {!BaseFilter} filter
	 * @chainnable
	 */
	add(operator, filter) {
		if (!(this.body_[operator] instanceof Array)) {
			var filterBody = this.body_;
			this.body_ = {};
			this.body_[operator] = [filterBody];
		}
		this.body_[operator].push(filter.body());
		return this;
	}

	/**
	 * Returns a Filter instance that uses the "in" operator.
	 * @param {...*} filters A variable amount of filters to be composed
	 *   with the "and" operator.
	 * @return {!Filter}
	 * @static
	 */
	static andOf(...filters) {
		var filter = filters[0];
		for (var i = 1; i < filters.length; i++) {
			filter.add('and', filters[i]);
		}
		;
		return filter;
	}

	/**
	 * Gets the json object that represents this filter.
	 * @return {!Object}
	 */
	body() {
		return this.body_;
	}

	/**
	 * Returns a Filter instance that uses the "=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static equal(field, value) {
		return new Filter(field, '=', value);
	}

	/**
	 * Returns a Filter instance that uses the ">" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static gt(field, value) {
		return new Filter(field, '>', value);
	}

	/**
	 * Returns a Filter instance that uses the ">=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static gte(field, value) {
		return new Filter(field, '>=', value);
	}

	/**
	 * Returns a Filter instance that uses the "in" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {...*} value A variable amount of values to be used with
	 *   the "in" operator.
	 * @return {!Filter}
   * @static
	 */
	static in(field) {
		return new Filter(field, 'in', Array.prototype.slice.call(arguments, 1));
	}

	/**
	 * Returns a Filter instance that uses the "like" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static like(field, value) {
		return new Filter(field, 'like', value);
	}

	/**
	 * Returns a Filter instance that uses the "<" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static lt(field, value) {
		return new Filter(field, '<', value);
	}

	/**
	 * Returns a Filter instance that uses the "<=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static lte(field, value) {
		return new Filter(field, '<=', value);
	}

	/**
	 * Returns a Filter instance that uses the "!=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static notEqual(field, value) {
		return new Filter(field, '!=', value);
	}

	/**
	 * Returns a Filter instance.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} operatorOrValue If a third param is given, this should
	 *   be the filter's operator (like ">="). Otherwise, this will be
	 *   used as the filter's value, and the filter's operator will be "=".
	 * @param {*} opt_value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static of(field, operatorOrValue, opt_value) {
		return new Filter(field, operatorOrValue, opt_value);
	}

	/**
	 * Gets the json string that represents this filter.
	 * @return {string}
	 */
	toString() {
		return JSON.stringify(this.body());
	}
}

export default Filter;
