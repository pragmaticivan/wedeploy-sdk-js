'use strict';

import Filter from './Filter';
import Range from './Range';

/**
 * Class responsible for building search filters.
 */
class SearchFilter extends Filter {
	/**
	 * Composes all the given Filter instances with the "disMax" operator.
	 * @param {...*} filters A variable amount of filters to be composed.
	 * @return {!Filter}
	 * @static
	 */
	static disMaxOf(...filters) {
		return filters[0].addMany.apply(filters[0], ['disMax'].concat(filters.slice(1)));
	}

	/**
	 * Returns a SearchFilter instance that uses the "exists" operator.
	 * @param {string} field The field's name.
	 * @return {!Filter}
	 * @static
	 */
	static exists(field) {
		return Filter.of(field, 'exists', null);
	}

	/**
	 * Returns a SearchFilter instance that uses the "missing" operator.
	 * @param {string} field The field's name.
	 * @return {!Filter}
	 * @static
	 */
	static missing(field) {
		return Filter.of(field, 'missing', null);
	}

	/**
	 * Returns a SearchFilter instance that uses the "pre" operator.
	 * @param {string} fieldOrQuery If no second argument is given, this should
	 *   be the query string, in which case all fields will be matched. Otherwise,
	 *   this should be the name of the field to match.
	 * @param {string} opt_query The query string.
	 * @return {!Filter}
   * @static
	 */
	static prefix(fieldOrQuery, opt_query) {
		var field = opt_query ? fieldOrQuery : SearchFilter.ALL;
		var query = opt_query ? opt_query : fieldOrQuery;
		return Filter.of(field, 'pre', query);
	}

	/**
	 * Returns a SearchFilter instance that uses the "range" operator.
	 * @param {string} field The field's name.
	 * @param {*} rangeOrMin Either a `Range` instance or a the range's min value.
	 * @param {*} opt_max The range's max value.
	 * @return {!Filter}
	 * @static
	 */
	static range(field, rangeOrMin, opt_max) {
		var range = rangeOrMin;
		if (!(range instanceof Range)) {
			range = Range.range(rangeOrMin, opt_max);
		}
		return Filter.of(field, 'range', range);
	}
}

/**
 * String constant that represents all fields.
 * @type {string}
 * @static
 */
SearchFilter.ALL = '*';

export default SearchFilter;
