'use strict';

import core from 'bower:metal/src/core';
import Embodied from './Embodied';
import Filter from './Filter';
import Geo from './Geo';
import Range from './Range';

/**
 * Class responsible for building search filters.
 */
class SearchFilter extends Filter {
	/**
	 * Returns a SearchFilter instance that uses the "gp" operator.
	 * This is a special use case of `SearchFilter.polygon` for bounding
	 * boxes.
	 * @param {string} field The field's name.
	 * @param {*} boxOrUpperLeft Either a `Geo.BoundingBox` instance, or
	 *   a bounding box's upper left coordinate.
	 * @param {*} opt_lowerRight A bounding box's lower right coordinate.
	 * @return {!Filter}
	 * @static
	 */
	static bbox(field, boxOrUpperLeft, opt_lowerRight) {
		if (boxOrUpperLeft instanceof Geo.BoundingBox) {
			return SearchFilter.polygon(field, ...boxOrUpperLeft.getPoints());
		} else {
			return SearchFilter.polygon(field, boxOrUpperLeft, opt_lowerRight);
		}
	}

	/**
	 * Returns a SearchFilter instance that uses the "gd" operator.
	 * @param {string} field The field's name.
	 * @param {*} locationOrCircle Either a `Geo.Circle` instance or a coordinate.
	 * @param {Range|string=} opt_rangeOrDistance Either a `Range` instance or
	 *   the distance value.
	 * @return {!Filter}
	 * @static
	 */
	static distance(field, locationOrCircle, opt_rangeOrDistance) {
		var location = locationOrCircle;
		var range = opt_rangeOrDistance;
		if (locationOrCircle instanceof Geo.Circle) {
			location = locationOrCircle.getCenter();
			range = Range.to(locationOrCircle.getRadius());
		} else if (!(opt_rangeOrDistance instanceof Range)) {
			range = Range.to(opt_rangeOrDistance);
		}
		return SearchFilter.distanceInternal_(field, location, range);
	}

	/**
	 * Returns a SearchFilter instance that uses the "gd" operator. This
	 * is just an internal helper used by `SearchFilter.distance`.
	 * @param {string} field The field's name.
	 * @param {*} location A location coordinate.
	 * @param {Range} range A `Range` instance.
	 * @return {!Filter}
	 * @protected
	 * @static
	 */
	static distanceInternal_(field, location, range) {
		var value = {
			location: Embodied.toBody(location)
		};
		range = range.body();
		if (range.from) {
			value.min = range.from;
		}
		if (range.to) {
			value.max = range.to;
		}
		return Filter.field(field, 'gp', value);
	}

	/**
	 * Returns a SearchFilter instance that uses the "exists" operator.
	 * @param {string} field The field's name.
	 * @return {!Filter}
	 * @static
	 */
	static exists(field) {
		return Filter.field(field, 'exists', null);
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
		return Filter.field(field, operator, value);
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
		var field = core.isString(opt_query) ? fieldOrQuery : SearchFilter.ALL;
		var query = core.isString(opt_query) ? opt_query : fieldOrQuery;
		return Filter.field(field, 'match', query);
	}

	/**
	 * Returns a SearchFilter instance that uses the "missing" operator.
	 * @param {string} field The field's name.
	 * @return {!Filter}
	 * @static
	 */
	static missing(field) {
		return Filter.field(field, 'missing', null);
	}

	/**
	 * Returns a SearchFilter instance that uses the "similar" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {?string} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static similar(fieldOrQuery, query) {
		var field = core.isString(query) ? fieldOrQuery : SearchFilter.ALL;
		var value = {
			query: core.isString(query) ? query : fieldOrQuery
		};
		return Filter.field(field, 'similar', value);
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
		var field = core.isString(opt_query) ? fieldOrQuery : SearchFilter.ALL;
		var query = core.isString(opt_query) ? opt_query : fieldOrQuery;
		return Filter.field(field, 'phrase', query);
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
		var field = core.isString(opt_query) ? fieldOrQuery : SearchFilter.ALL;
		var query = core.isString(opt_query) ? opt_query : fieldOrQuery;
		return Filter.field(field, 'phrasePrefix', query);
	}

	/**
	 * Returns a SearchFilter instance that uses the "gp" operator.
	 * @param {string} field The name of the field.
	 * @param {...!Object} points Objects representing points in the polygon.
	 * @return {!Filter}
	 * @static
	 */
	static polygon(field, ...points) {
		points = points.map(point => Embodied.toBody(point));
		return Filter.field(field, 'gp', points);
	}

	/**
	 * Returns a SearchFilter instance that uses the "prefix" operator.
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
		return Filter.field(field, 'prefix', query);
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
		return Filter.field(field, 'range', range);
	}

	/**
	 * Returns a SearchFilter instance that uses the "gs" operator.
	 * @param {string} field The field's name.
	 * @param {...!Object} shapes Objects representing shapes.
	 * @return {!Filter}
	 * @static
	 */
	static shape(field, ...shapes) {
		shapes = shapes.map(shape => Embodied.toBody(shape));
		var value = {
			type: 'geometrycollection',
			geometries: shapes
		};
		return Filter.field(field, 'gs', value);
	}
}

/**
 * String constant that represents all fields.
 * @type {string}
 * @static
 */
SearchFilter.ALL = '*';

export default SearchFilter;
