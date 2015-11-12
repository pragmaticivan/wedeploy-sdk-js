'use strict';

/**
 * Class responsible for storing an object that will be printed as JSON
 * when the `toString` method is called.
 */
class Embodied {
	/**
	 * Constructs a Embodied instance.
	 * @constructor
	 */
	constructor() {
		this.body_ = {};
	}

	/**
	 * Gets the json object that represents this instance.
	 * @return {!Object}
	 */
	body() {
		return this.body_;
	}

	/**
	 * If the given object is an instance of Embodied, this will
	 * return its body content. Otherwise this will return the
	 * original object.
	 * @param {*} obj
	 * @return {*}
	 * @static
	 */
	static toBody(obj) {
		return (obj instanceof Embodied) ? obj.body() : obj;
	}

	/**
	 * Gets the json string that represents this instance.
	 * @return {string}
	 */
	toString() {
		return JSON.stringify(this.body());
	}
}

export default Embodied;
