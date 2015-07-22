'use strict';

import core from 'bower:metal/src/core';
import Aggregation from './Aggregation';
import Embodied from './Embodied';
import Filter from './Filter';
import SearchFilter from './SearchFilter';

/**
 * Class responsible for building search queries.
 */
class Search extends Embodied {
	/**
	 * Adds an aggregation to this `Search` instance.
	 * @param {string} name The aggregation name.
	 * @param {!Aggregation|string} aggregationOrField Either an
	 *   `Aggregation` instance or the name of the aggregation field.
	 * @param {string} opt_operator The aggregation operator.
	 * @chainnable
	 */
	aggregate(name, aggregationOrField, opt_operator) {
		var aggregation = aggregationOrField;
		if (!(aggregation instanceof Aggregation)) {
			aggregation = Aggregation.of(aggregationOrField, opt_operator);
		}

		var field = aggregation.getField();
		var value = {};
		value[field] = {
			name: name,
			operator: aggregation.getOperator()
		};
		if (core.isDefAndNotNull(aggregation.getValue())) {
			value[field].value = aggregation.getValue();
		}

		if (!this.body_.aggregation) {
			this.body_.aggregation = [];
		}
		this.body_.aggregation.push(value);
		return this;
	}

	/**
	 * Creates a new `Search` instance.
	 * @return {!Search}
	 * @static
	 */
	static builder() {
		return new Search();
	}

	/**
	 * Sets the cursor for this `Search` instance.
	 * @param {string} cursor
	 * @chainnable
	 */
	cursor(cursor) {
		this.body_.cursor = cursor;
		return this;
	}

	/**
	 * Adds a pre filter to this `Search` instance. Internal helper used by
	 * the `filter_` function.
	 * @param {!Filter} filter
	 * @param {string=} opt_filterType Type of the filter being added ('pre_filter',
	 *   'post_filter' or 'query'). Defaults to 'pre_filter'.
	 * @protected
	 */
	addFilter_(filter, opt_filterType) {
		var filterType = opt_filterType || 'pre_filter';
		if (!this.body_[filterType]) {
			this.body_[filterType] = [];
		}
		this.body_[filterType].push(filter.body());
	}

	/**
	 * Adds a filter to this `Search` instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a `Filter`
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @param {string=} opt_filterType Type of the filter being added ('pre_filter',
	 *   'post_filter' or 'query'). Defaults to 'pre_filter'.
	 * @protected
	 * @chainnable
	 */
	filter_(filterOrTextOrField, opt_textOrOperator, opt_value, opt_filterType) {
		var filter = filterOrTextOrField;
		if (opt_value) {
			filter = Filter.of(filterOrTextOrField, opt_textOrOperator, opt_value);
		} else if (opt_textOrOperator) {
			filter = SearchFilter.match(filterOrTextOrField, opt_textOrOperator);
		} else if (!(filter instanceof Filter)) {
			filter = SearchFilter.match(filterOrTextOrField);
		}
		this.addFilter_(filter, opt_filterType);
		return this;
	}

	/**
	 * Adds a highlight entry to this `Search` instance.
	 * @param {string} field The field's name.
	 * @param {number} opt_size The highlight size.
	 * @param {number} opt_count The highlight count.
	 * @chainnable
	 */
	highlight(field, opt_size, opt_count) {
		if (!this.body_.highlight) {
			this.body_.highlight = {};
		}

		this.body_.highlight[field] = {};
		if (opt_size) {
			this.body_.highlight[field].size = opt_size;
		}
		if (opt_count) {
			this.body_.highlight[field].count = opt_count;
		}
		return this;
	}

	/**
	 * Adds a post filter to this `Search` instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a `Filter`
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @chainnable
	 */
	postFilter(filterOrTextOrField, opt_textOrOperator, opt_value) {
		return this.filter_(filterOrTextOrField, opt_textOrOperator, opt_value, 'post_filter');
	}

	/**
	 * Adds a pre filter to this `Search` instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a `Filter`
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @chainnable
	 */
	preFilter(filterOrTextOrField, opt_textOrOperator, opt_value) {
		return this.filter_(filterOrTextOrField, opt_textOrOperator, opt_value);
	}

	/**
	 * Adds a query to this `Search` instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a `Filter`
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @chainnable
	 */
	query(filterOrTextOrField, opt_textOrOperator, opt_value) {
		return this.filter_(filterOrTextOrField, opt_textOrOperator, opt_value, 'query');
	}
}

export default Search;
