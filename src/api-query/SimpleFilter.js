'use strict';

/**
 * Class that can handle simple filters, related to a single
 * field, operator and value. For example: age >= 12.
 */
class SimpleFilter {
	/**
	 * Constructs a SimpleFilter instance.
	 * @param {string} field
	 * @param {string} operator
	 * @param {*} value
	 * @constructor
	 */
	constructor(field, operator, value) {
		this.body_ = {};
		this.body_[field] = {
			operator: operator,
			value: value
		};
	}

	/**
	 * Gets the json object that represents this filter.
	 * @return {!Object}
	 */
	body() {
		return this.body_;
	}

	/**
	 * Gets the json string that represents this filter.
	 * @return {string}
	 */
	toString() {
		return JSON.stringify(this.body());
	}
}

export default SimpleFilter;
