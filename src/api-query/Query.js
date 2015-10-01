'use strict';

import Embodied from './Embodied';
import Filter from './Filter';
import Search from './Search';

/**
 * Class responsible for building queries.
 */
class Query extends Embodied {
	/**
	 * Creates a new `Query` instance.
	 * @return {!Query}
	 * @static
	 */
	static builder() {
		return new Query();
	}

	/**
	 * Sets this query's type to "count".
	 * @chainnable
	 */
	count() {
		return this.type('count');
	}

	/**
	 * Sets this query's type to "fetch".
	 * @chainnable
	 */
	fetch() {
		return this.type('fetch');
	}

	/**
	 * Adds a filter to this Query.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*} operatorOrValue Either the field's operator or its value.
	 * @param {*} opt_value The filter's value.
	 * @chainnable
	 */
	filter(fieldOrFilter, opt_operatorOrValue, opt_value) {
		var filter = Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value);
		if (!this.body_.filter) {
			this.body_.filter = [];
		}
		this.body_.filter.push(filter.body());
		return this;
	}

	/**
	 * Sets the query offset.
	 * @param {number} offset The index of the first entry that should be returned
	 *   by this query.
	 * @chainnable
	 */
	from(offset) {
		this.body_.offset = offset;
		return this;
	}

	/**
	 * Sets the query limit.
	 * @param {number} limit The max amount of entries that this query should return.
	 * @chainnable
	 */
	limit(limit) {
		this.body_.limit = limit;
		return this;
	}

	/**
	 * Adds a search entry to this `Query`.
	 * @param {!Search|!Filter|string} searchOrFilterOrTextOrField If no other
	 *   arguments are passed to this function, this should be either a `Search`
	 *   or `Filter` instance or a text to be used in a match filter. In the
	 *   last two cases the filter will be applied to all fields. Another option
	 *   is to pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @chainnable
	 */
	search(searchOrFilterOrTextOrField, opt_textOrOperator, opt_value) {
		var search = searchOrFilterOrTextOrField;
		if (!(search instanceof Search)) {
			search = Search.builder().query(searchOrFilterOrTextOrField, opt_textOrOperator, opt_value);
		}
		this.body_.search = search.body();
		return this;
	}

	/**
	 * Adds a sort entry to this query, specifying the field this query should be
	 * sorted by and, optionally, the sort direction.
	 * @param {string} field The field that the query should be sorted by.
	 * @param {string} opt_direction The direction the sort operation should use.
	 *   If none is given, "asc" is used by default.
	 * @chainnable
	 */
	sort(field, opt_direction) {
		if (!this.body_.sort) {
			this.body_.sort = [];
		}
		var sortEntry = {};
		sortEntry[field] = opt_direction || 'asc';
		this.body_.sort.push(sortEntry);
		return this;
	}

	/**
	 * Sets the query type.
	 * @param {string} type The query's type. For example: "count", "fetch".
	 * @chainnable
	 */
	type(type) {
		this.body_.type = type;
		return this;
	}
}

export default Query;
