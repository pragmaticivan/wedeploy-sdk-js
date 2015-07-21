'use strict';

import core from 'bower:metal/src/core';
import Filter from './Filter';
import Range from './Range';

/**
 * Class responsible for building search filters.
 */
class SearchFilter extends Filter {
	/**
	 * Returns a SearchFilter instance that uses the "common" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string|number=} opt_queryOrThreshold If this is a string, it should
	 *   be the query, otherwise it should be the threshold value.
	 * @param {number=} opt_threshold The threshold value.
	 * @return {!Filter}
	 * @static
	 */
	static common(fieldOrQuery, opt_queryOrThreshold, opt_threshold) {
		var arg2IsString = core.isString(opt_queryOrThreshold);

		var value = {
			query: arg2IsString ? opt_queryOrThreshold : fieldOrQuery
		};
		var threshold = arg2IsString ? opt_threshold : opt_queryOrThreshold;
		if (threshold) {
			value.threshold = threshold;
		}

		var field = arg2IsString ? fieldOrQuery : SearchFilter.ALL;
		return Filter.of(field, 'common', value);
	}

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
	 * Returns a SearchFilter instance that uses the "fuzzy" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string|number=} opt_queryOrFuzziness If this is a string, it should
	 *   be the query, otherwise it should be the fuzziness value.
	 * @param {number=} opt_fuzziness The fuzziness value.
	 * @return {!Filter}
	 * @static
	 */
	static fuzzy(fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness) {
		return SearchFilter.fuzzyInternal_('fuzzy', fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness);
	}

	/**
	 * Returns a SearchFilter instance that uses the "flt" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string|number=} opt_queryOrFuzziness If this is a string, it should
	 *   be the query, otherwise it should be the fuzziness value.
	 * @param {number=} opt_fuzziness The fuzziness value.
	 * @return {!Filter}
	 * @static
	 */
	static fuzzyLikeThis(fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness) {
		return SearchFilter.fuzzyInternal_('flt', fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness);
	}

	/**
	 * Returns a SearchFilter instance that uses the given fuzzy operator. This
	 * is an internal implementation used by both the `SearchFilter.fuzzy` and
	 * the `SearchFilter.fuzzyLikeThis` methods.
	 * @param {string} operator The fuzzy operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string|number=} opt_queryOrFuzziness If this is a string, it should
	 *   be the query, otherwise it should be the fuzziness value.
	 * @param {number=} opt_fuzziness The fuzziness value.
	 * @return {!Filter}
	 * @protected
	 * @static
	 */
	static fuzzyInternal_(operator, fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness) {
		var arg2IsString = core.isString(opt_queryOrFuzziness);

		var value = {
			query: arg2IsString ? opt_queryOrFuzziness : fieldOrQuery
		};
		var fuzziness = arg2IsString ? opt_fuzziness : opt_queryOrFuzziness;
		if (fuzziness) {
			value.fuzziness = fuzziness;
		}

		var field = arg2IsString ? fieldOrQuery : SearchFilter.ALL;
		return Filter.of(field, operator, value);
	}

	/**
	 * Returns a SearchFilter instance that uses the "match" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static match(fieldOrQuery, opt_query) {
		return SearchFilter.matchInternal_(fieldOrQuery, opt_query);
	}

	/**
	 * Returns a SearchFilter instance that uses the "match" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {?string} opt_query The query string.
	 * @param {string=} opt_type The match type.
	 * @return {!Filter}
	 * @protected
	 * @static
	 */
	static matchInternal_(fieldOrQuery, query, opt_type) {
		var field = core.isString(query) ? fieldOrQuery : SearchFilter.ALL;
		var value = {
			query: core.isString(query) ? query : fieldOrQuery
		};
		if (opt_type) {
			value.type = opt_type;
		}
		return Filter.of(field, 'match', value);
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
	 * Returns a SearchFilter instance that uses the "mlt" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {?string} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static moreLikeThis(fieldOrQuery, query) {
		var field = core.isString(query) ? fieldOrQuery : SearchFilter.ALL;
		var value = {
			query: core.isString(query) ? query : fieldOrQuery
		};
		return Filter.of(field, 'mlt', value);
	}

	/**
	 * Returns a SearchFilter instance that uses the "phrase" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static phrase(fieldOrQuery, opt_query) {
		return SearchFilter.matchInternal_(fieldOrQuery, opt_query, 'phrase');
	}

	/**
	 * Returns a SearchFilter instance that uses the "phrase-prefix" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static phrasePrefix(fieldOrQuery, opt_query) {
		return SearchFilter.matchInternal_(fieldOrQuery, opt_query, 'phrase_prefix');
	}

	/**
	 * Returns a SearchFilter instance that uses the "gp" operator.
	 * @param {string} field The name of the field.
	 * @param {...!Object} points Objects representing points in the polygon.
	 * @return {!Filter}
	 * @static
	 */
	static polygon(field, ...points) {
		return Filter.of(field, 'gp', points);
	}

	/**
	 * Returns a SearchFilter instance that uses the "pre" operator.
	 * @param {string} fieldOrQuery If no second argument is given, this should
	 *   be the query string, in which case all fields will be matched. Otherwise,
	 *   this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
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

	/**
	 * Returns a SearchFilter instance that uses the "gs" operator.
	 * @param {string} field The field's name.
	 * @param {...!Object} shapes Objects representing shapes.
	 * @return {!Filter}
	 * @static
	 */
	static shape(field, ...shapes) {
		var value = {
			type: 'geometrycollection',
			geometries: shapes
		};
		return Filter.of(field, 'gs', value);
	}
}

/**
 * String constant that represents all fields.
 * @type {string}
 * @static
 */
SearchFilter.ALL = '*';

export default SearchFilter;
