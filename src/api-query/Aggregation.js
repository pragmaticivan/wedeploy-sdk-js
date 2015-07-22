'use strict';

import Embodied from './Embodied';
import Range from './Range';

/**
 * Class that represents a search aggregation.
 */
class Aggregation {
	/**
	 * Constructs an `Aggregation` instance.
	 * @param {string} field The aggregation field.
	 * @param {string} operator The aggregation operator.
	 * @param {*} opt_value The aggregation value.
	 * @constructor
	 */
	constructor(field, operator, opt_value) {
		this.field_ = field;
		this.operator_ = operator;
		this.value_ = opt_value;
	}

	/**
	 * Creates an `Aggregation` instance with the "avg" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static avg(field) {
		return Aggregation.of(field, 'avg');
	}

	/**
	 * Creates an `Aggregation` instance with the "count" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static count(field) {
		return Aggregation.of(field, 'count');
	}

	/**
	 * Creates an `Aggregation.DistanceAggregation` instance with the "geo_distance" operator.
	 * @param {string} field The aggregation field.
	 * @param {*} location The aggregation location.
	 * @param {...!Range} ranges The aggregation ranges.
	 * @return {!Aggregation.DistanceAggregation}
	 * @static
	 */
	static distance(field, location, ...ranges) {
		return new Aggregation.DistanceAggregation(field, location, ...ranges);
	}

	/**
	 * Creates an `Aggregation` instance with the "extended_stats" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static extendedStats(field) {
		return Aggregation.of(field, 'extended_stats');
	}

	/**
	 * Gets this aggregation's field.
	 * @return {string}
	 */
	getField() {
		return this.field_;
	}

	/**
	 * Gets this aggregation's operator.
	 * @return {string}
	 */
	getOperator() {
		return this.operator_;
	}

	/**
	 * Gets this aggregation's value.
	 * @return {*}
	 */
	getValue() {
		return this.value_;
	}

	/**
	 * Creates an `Aggregation` instance with the "histogram" operator.
	 * @param {string} field The aggregation field.
	 * @param {number} interval The histogram's interval.
	 * @return {!Aggregation}
	 * @static
	 */
	static histogram(field, interval) {
		return new Aggregation(field, 'histogram', interval);
	}

	/**
	 * Creates an `Aggregation` instance with the "max" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static max(field) {
		return Aggregation.of(field, 'max');
	}

	/**
	 * Creates an `Aggregation` instance with the "min" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static min(field) {
		return Aggregation.of(field, 'min');
	}

	/**
	 * Creates an `Aggregation` instance with the "missing" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static missing(field) {
		return Aggregation.of(field, 'missing');
	}

	/**
	 * Creates a new `Aggregation` instance.
	 * @param {string} field The aggregation field.
	 * @param {string} operator The aggregation operator.
	 * @return {!Aggregation}
	 * @static
	 */
	static of(field, operator) {
		return new Aggregation(field, operator);
	}

	/**
	 * Creates an `Aggregation.RangeAggregation` instance with the "range" operator.
	 * @param {string} field The aggregation field.
	 * @param {...!Range} ranges The aggregation ranges.
	 * @return {!Aggregation.RangeAggregation}
	 * @static
	 */
	static range(field, ...ranges) {
		return new Aggregation.RangeAggregation(field, ...ranges);
	}

	/**
	 * Creates an `Aggregation` instance with the "stats" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static stats(field) {
		return Aggregation.of(field, 'stats');
	}

	/**
	 * Creates an `Aggregation` instance with the "sum" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static sum(field) {
		return Aggregation.of(field, 'sum');
	}

	/**
	 * Creates an `Aggregation` instance with the "terms" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static terms(field) {
		return Aggregation.of(field, 'terms');
	}
}

/**
 * Class that represents a distance aggregation.
 */
class DistanceAggregation extends Aggregation {
	/**
	 * Constructs an `DistanceAggregation` instance.
	 * @param {string} field The aggregation field.
	 * @param {*} location The aggregation location.
	 * @param {...!Range} ranges The aggregation ranges.
	 * @constructor
	 */
	constructor(field, location, ...ranges) {
		super(field, 'geo_distance', {});
		this.value_.location = Embodied.toBody(location);
		this.value_.ranges = ranges.map(range => range.body());
	}

	/**
	 * Adds a range to this aggregation.
	 * @param {*} rangeOrFrom
	 * @param {*} opt_to
	 * @chainnable
	 */
	range(rangeOrFrom, opt_to) {
		var range = rangeOrFrom;
		if (!(range instanceof Range)) {
			range = Range.range(rangeOrFrom, opt_to);
		}
		this.value_.ranges.push(range.body());
		return this;
	}

	/**
	 * Sets this aggregation's unit.
	 * @param {string} unit
	 * @chainnable
	 */
	unit(unit) {
		this.value_.unit = unit;
		return this;
	}
}
Aggregation.DistanceAggregation = DistanceAggregation;

/**
 * Class that represents a range aggregation.
 */
class RangeAggregation extends Aggregation {
	/**
	 * Constructs an `RangeAggregation` instance.
	 * @param {string} field The aggregation field.
	 * @param {...!Range} ranges The aggregation ranges.
	 * @constructor
	 */
	constructor(field, ...ranges) {
		super(field, 'range');
		this.value_ = ranges.map(range => range.body());
	}

	/**
	 * Adds a range to this aggregation.
	 * @param {*} rangeOrFrom
	 * @param {*} opt_to
	 * @chainnable
	 */
	range(rangeOrFrom, opt_to) {
		var range = rangeOrFrom;
		if (!(range instanceof Range)) {
			range = Range.range(rangeOrFrom, opt_to);
		}
		this.value_.push(range.body());
		return this;
	}
}
Aggregation.RangeAggregation = RangeAggregation;

export default Aggregation;
