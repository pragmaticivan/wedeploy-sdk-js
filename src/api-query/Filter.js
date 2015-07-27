'use strict';

import Embodied from './Embodied';
import FilterBody from './FilterBody';

/**
 * Class responsible for building filters.
 */
class Filter extends Embodied {
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
		super();
		this.body_ = new FilterBody(field, operatorOrValue, opt_value);
	}

	/**
	 * Adds a filter to be composed with this filter using the given operator.
	 * @param {string} operator
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*} opt_value The filter's value.
	 * @chainnable
	 */
	add(operator, fieldOrFilter, opt_operatorOrValue, opt_value) {
		var filter = fieldOrFilter ? Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value) : null;
		this.body_.add(operator, filter);
		return this;
	}

	/**
	 * Adds filters to be composed with this filter using the given operator.
	 * @param {string} operator
	 * @param {...*} filters A variable amount of filters to be composed.
	 * @chainnable
	 */
	addMany(operator, ...filters) {
		this.body_.addMany(operator, ...filters);
		return this;
	}

	/**
	 * Adds a filter to be composed with this filter using the "and" operator.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*} opt_value The filter's value.
	 * @chainnable
	 */
	and(fieldOrFilter, opt_operatorOrValue, opt_value) {
		return this.add('and', fieldOrFilter, opt_operatorOrValue, opt_value);
	}

	/**
	 * Composes all the given Filter instances with the "and" operator.
	 * @param {...*} filters A variable amount of filters to be composed.
	 * @return {!Filter}
	 * @static
	 */
	static and(...filters) {
		return filters[0].addMany.apply(filters[0], ['and'].concat(filters.slice(1)));
	}

	/**
	 * Returns a Filter instance that uses the "any" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {...*} value A variable amount of values to be used with
	 *   the "any" operator.
	 * @return {!Filter}
	 * @static
	 */
	static any(field) {
		return new Filter(field, 'any', Array.prototype.slice.call(arguments, 1));
	}

	/**
	 * Gets the json object that represents this filter.
	 * @return {!Object}
	 */
	body() {
		return this.body_.getObject();
	}

	/**
	 * Adds a filter to be composed with this filter using the "disMax" operator.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*} opt_value The filter's value.
	 * @chainnable
	 */
	disMax(fieldOrFilter, opt_operatorOrValue, opt_value) {
		return this.add('disMax', fieldOrFilter, opt_operatorOrValue, opt_value);
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
	 * Returns a Filter instance that uses the "~" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static regex(field, value) {
		return new Filter(field, '~', value);
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
	 * Returns a Filter instance that uses the "none" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {...*} value A variable amount of values to be used with
	 *   the "none" operator.
	 * @return {!Filter}
	 * @static
	 */
	static none(field) {
		return new Filter(field, 'none', Array.prototype.slice.call(arguments, 1));
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
	 * Returns a Filter instance that uses the "not" operator.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*} opt_value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
	static not(fieldOrFilter, opt_operatorOrValue, opt_value) {
		return Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value).add('not');
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
	 * Adds a filter to be composed with this filter using the "or" operator.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*} opt_value The filter's value.
	 * @chainnable
	 */
	or(fieldOrFilter, opt_operatorOrValue, opt_value) {
		return this.add('or', fieldOrFilter, opt_operatorOrValue, opt_value);
	}

	/**
	 * Composes all the given Filter instances with the "or" operator.
	 * @param {...*} filters A variable amount of filters to be composed.
	 * @return {!Filter}
	 * @static
	 */
	static or(...filters) {
		return filters[0].addMany.apply(filters[0], ['or'].concat(filters.slice(1)));
	}

	/**
	 * Converts the given arguments into a Filter instance.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*} opt_value The filter's value.
	 * @return {!Filter}
	 */
	static toFilter(fieldOrFilter, opt_operatorOrValue, opt_value) {
		var filter = fieldOrFilter;
		if (!(filter instanceof Filter)) {
			filter = Filter.of(fieldOrFilter, opt_operatorOrValue, opt_value);
		}
		return filter;
	}
}

export default Filter;
