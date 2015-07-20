'use strict';

import core from 'bower:metal/src/core';

/**
 * Class responsible for storing and handling the body contents
 * of a Filter instance.
 */
class FilterBody {
	/**
	 * Constructs a FilterBody instance.
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
	 * Adds a filter to be composed with this filter body using the given operator.
	 * @param {string} operator
	 * @param {!BaseFilter} filter
	 */
	add(operator, filter) {
		if (!(this.body_[operator] instanceof Array)) {
			var filterBody = this.body_;
			this.body_ = {};
			this.body_[operator] = [filterBody];
		}
		this.body_[operator].push(filter.body());
	}

	/**
	 * Adds filters to be composed with this filter body using the given operator.
	 * @param {string} operator
	 * @param {...*} filters A variable amount of filters to be composed.
	 */
	addMany(operator, ...filters) {
		for (var i = 0; i < filters.length; i++) {
			this.add(operator, filters[i]);
		}
	}

	/**
	 * Gets the json object that represents this filter's body.
	 * @return {!Object}
	 */
	getObject() {
		return this.body_;
	}
}

export default FilterBody;
