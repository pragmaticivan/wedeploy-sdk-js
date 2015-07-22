'use strict';

import core from 'bower:metal/src/core';
import Embodied from './Embodied';

/**
 * Class responsible for building range objects to be used by `SearchFilter`.
 */
class Range extends Embodied {
	/**
	 * Constructs a Range instance.
	 * @param {*} from
	 * @param {*} opt_to
	 * @constructor
	 */
	constructor(from, opt_to) {
		super();
		if (core.isDefAndNotNull(from)) {
			this.body_.from = from;
		}
		if (core.isDefAndNotNull(opt_to)) {
			this.body_.to = opt_to;
		}
	}

	/**
	 * Constructs a Range instance.
	 * @param {*} from
	 * @return {!Range}
	 * @static
	 */
	static from(from) {
		return new Range(from);
	}

	/**
	 * Constructs a Range instance.
	 * @param {*} from
	 * @param {*} to
	 * @return {!Range}
	 * @static
	 */
	static range(from, to) {
		return new Range(from, to);
	}

	/**
	 * Constructs a Range instance.
	 * @param {*} to
	 * @return {!Range}
	 * @static
	 */
	static to(to) {
		return new Range(null, to);
	}
}

export default Range;
