var globals = {};

if (typeof window !== 'undefined') {
	globals.window = window;
}

if (typeof document !== 'undefined') {
	globals.document = document;
}

/**
 * A collection of core utility functions.
 * @const
 */

let compatibilityModeData_;

/**
 * Counter for unique id.
 * @type {Number}
 * @private
 */
let uniqueIdCounter_ = 1;

/**
 * Unique id property prefix.
 * @type {String}
 * @protected
 */
const UID_PROPERTY = 'core_' + ((Math.random() * 1e9) >>> 0);

/**
 * When defining a class Foo with an abstract method bar(), you can do:
 * Foo.prototype.bar = abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error will be thrown
 * when bar() is invoked.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be overridden.
 */
function abstractMethod() {
	throw Error('Unimplemented abstract method');
}

/**
 * Loops constructor super classes collecting its properties values. If
 * property is not available on the super class `undefined` will be
 * collected as value for the class hierarchy position.
 * @param {!function()} constructor Class constructor.
 * @param {string} propertyName Property name to be collected.
 * @return {Array.<*>} Array of collected values.
 * TODO(*): Rethink superclass loop.
 */
function collectSuperClassesProperty(constructor, propertyName) {
	var propertyValues = [constructor[propertyName]];
	while (constructor.__proto__ && !constructor.__proto__.isPrototypeOf(Function)) {
		constructor = constructor.__proto__;
		propertyValues.push(constructor[propertyName]);
	}
	return propertyValues;
}

/**
 * Disables Metal.js's compatibility mode.
 */
function disableCompatibilityMode() {
	compatibilityModeData_ = null;
}

/**
 * Enables Metal.js's compatibility mode with the following features from rc
 * and 1.x versions:
 *     - Using "key" to reference component instances. In the current version
 *       this should be done via "ref" instead. This allows old code still
 *       using "key" to keep working like before. NOTE: this may cause
 *       problems, since "key" is meant to be used differently. Only use this
 *       if it's not possible to upgrade the code to use "ref" instead.
 * @param {Object=} opt_data Optional object with data to specify more
 *     details, such as:
 *         - renderers {Array} the template renderers that should be in
 *           compatibility mode, either their constructors or strings
 *           representing them (e.g. 'soy' or 'jsx'). By default, all the ones
 *           that extend from IncrementalDomRenderer.
 * @type {Object}
 */
function enableCompatibilityMode(opt_data = {}) {
	compatibilityModeData_ = opt_data;
}

/**
 * Returns the data used for compatibility mode, or nothing if it hasn't been
 * enabled.
 * @return {Object}
 */
function getCompatibilityModeData() {
	// Compatibility mode can be set via the __METAL_COMPATIBILITY__ global var.
	if (!compatibilityModeData_) {
		if (typeof window !== 'undefined' && window.__METAL_COMPATIBILITY__) {
			enableCompatibilityMode(window.__METAL_COMPATIBILITY__);
		}
	}
	return compatibilityModeData_;
}

/**
 * Gets the name of the given function. If the current browser doesn't
 * support the `name` property, this will calculate it from the function's
 * content string.
 * @param {!function()} fn
 * @return {string}
 */
function getFunctionName(fn) {
	if (!fn.name) {
		var str = fn.toString();
		fn.name = str.substring(9, str.indexOf('('));
	}
	return fn.name;
}

/**
 * Gets an unique id. If `opt_object` argument is passed, the object is
 * mutated with an unique id. Consecutive calls with the same object
 * reference won't mutate the object again, instead the current object uid
 * returns. See {@link UID_PROPERTY}.
 * @param {Object=} opt_object Optional object to be mutated with the uid. If
 *     not specified this method only returns the uid.
 * @param {boolean=} opt_noInheritance Optional flag indicating if this
 *     object's uid property can be inherited from parents or not.
 * @throws {Error} when invoked to indicate the method should be overridden.
 */
function getUid(opt_object, opt_noInheritance) {
	if (opt_object) {
		var id = opt_object[UID_PROPERTY];
		if (opt_noInheritance && !opt_object.hasOwnProperty(UID_PROPERTY)) {
			id = null;
		}
		return id || (opt_object[UID_PROPERTY] = uniqueIdCounter_++);
	}
	return uniqueIdCounter_++;
}

/**
 * The identity function. Returns its first argument.
 * @param {*=} opt_returnValue The single value that will be returned.
 * @return {?} The first argument.
 */
function identityFunction(opt_returnValue) {
	return opt_returnValue;
}

/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
function isBoolean(val) {
	return typeof val === 'boolean';
}

/**
 * Returns true if the specified value is not undefined.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
function isDef(val) {
	return val !== undefined;
}

/**
 * Returns true if value is not undefined or null.
 * @param {*} val
 * @return {boolean}
 */
function isDefAndNotNull(val) {
	return isDef(val) && !isNull(val);
}

/**
 * Returns true if value is a document.
 * @param {*} val
 * @return {boolean}
 */
function isDocument(val) {
	return val && typeof val === 'object' && val.nodeType === 9;
}

/**
 * Returns true if value is a dom element.
 * @param {*} val
 * @return {boolean}
 */
function isElement(val) {
	return val && typeof val === 'object' && val.nodeType === 1;
}

/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
function isFunction(val) {
	return typeof val === 'function';
}

/**
 * Returns true if value is null.
 * @param {*} val
 * @return {boolean}
 */
function isNull(val) {
	return val === null;
}

/**
 * Returns true if the specified value is a number.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
function isNumber(val) {
	return typeof val === 'number';
}

/**
 * Returns true if value is a window.
 * @param {*} val
 * @return {boolean}
 */
function isWindow(val) {
	return val !== null && val === val.window;
}

/**
 * Returns true if the specified value is an object. This includes arrays
 * and functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
function isObject(val) {
	var type = typeof val;
	return type === 'object' && val !== null || type === 'function';
}

/**
 * Returns true if value is a Promise.
 * @param {*} val
 * @return {boolean}
 */
function isPromise(val) {
	return val && typeof val === 'object' && typeof val.then === 'function';
}

/**
 * Returns true if value is a string.
 * @param {*} val
 * @return {boolean}
 */
function isString(val) {
	return typeof val === 'string' || val instanceof String;
}

/**
 * Merges the values of a export function property a class with the values of that
 * property for all its super classes, and stores it as a new static
 * property of that class. If the export function property already existed, it won't
 * be recalculated.
 * @param {!function()} constructor Class constructor.
 * @param {string} propertyName Property name to be collected.
 * @param {function(*, *):*=} opt_mergeFn Function that receives an array filled
 *   with the values of the property for the current class and all its super classes.
 *   Should return the merged value to be stored on the current class.
 * @return {boolean} Returns true if merge happens, false otherwise.
 */
function mergeSuperClassesProperty(constructor, propertyName, opt_mergeFn) {
	var mergedName = propertyName + '_MERGED';
	if (constructor.hasOwnProperty(mergedName)) {
		return false;
	}

	var merged = collectSuperClassesProperty(constructor, propertyName);
	if (opt_mergeFn) {
		merged = opt_mergeFn(merged);
	}
	constructor[mergedName] = merged;
	return true;
}

/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
function nullFunction() {}


var core$2 = Object.freeze({
	UID_PROPERTY: UID_PROPERTY,
	abstractMethod: abstractMethod,
	collectSuperClassesProperty: collectSuperClassesProperty,
	disableCompatibilityMode: disableCompatibilityMode,
	enableCompatibilityMode: enableCompatibilityMode,
	getCompatibilityModeData: getCompatibilityModeData,
	getFunctionName: getFunctionName,
	getUid: getUid,
	identityFunction: identityFunction,
	isBoolean: isBoolean,
	isDef: isDef,
	isDefAndNotNull: isDefAndNotNull,
	isDocument: isDocument,
	isElement: isElement,
	isFunction: isFunction,
	isNull: isNull,
	isNumber: isNumber,
	isWindow: isWindow,
	isObject: isObject,
	isPromise: isPromise,
	isString: isString,
	mergeSuperClassesProperty: mergeSuperClassesProperty,
	nullFunction: nullFunction
});

// This file exists just for backwards compatibility, making sure that old
// default imports for this file still work. It's best to use the named exports
// for each function instead though, since that allows bundlers like Rollup to
// reduce the bundle size by removing unused code.

class array {
	/**
	 * Checks if the given arrays have the same content.
	 * @param {!Array<*>} arr1
	 * @param {!Array<*>} arr2
	 * @return {boolean}
	 */
	static equal(arr1, arr2) {
		if (arr1.length !== arr2.length) {
			return false;
		}
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Returns the first value in the given array that isn't undefined.
	 * @param {!Array} arr
	 * @return {*}
	 */
	static firstDefinedValue(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] !== undefined) {
				return arr[i];
			}
		}
	}

	/**
	 * Transforms the input nested array to become flat.
	 * @param {Array.<*|Array.<*>>} arr Nested array to flatten.
	 * @param {Array.<*>} opt_output Optional output array.
	 * @return {Array.<*>} Flat array.
	 */
	static flatten(arr, opt_output) {
		var output = opt_output || [];
		for (var i = 0; i < arr.length; i++) {
			if (Array.isArray(arr[i])) {
				array.flatten(arr[i], output);
			} else {
				output.push(arr[i]);
			}
		}
		return output;
	}

	/**
	 * Removes the first occurrence of a particular value from an array.
	 * @param {Array.<T>} arr Array from which to remove value.
	 * @param {T} obj Object to remove.
	 * @return {boolean} True if an element was removed.
	 * @template T
	 */
	static remove(arr, obj) {
		var i = arr.indexOf(obj);
		var rv;
		if ( (rv = i >= 0) ) {
			array.removeAt(arr, i);
		}
		return rv;
	}

	/**
	 * Removes from an array the element at index i
	 * @param {Array} arr Array or array like object from which to remove value.
	 * @param {number} i The index to remove.
	 * @return {boolean} True if an element was removed.
	 */
	static removeAt(arr, i) {
		return Array.prototype.splice.call(arr, i, 1).length === 1;
	}

	/**
	 * Slices the given array, just like Array.prototype.slice, but this
	 * is faster and working on all array-like objects (like arguments).
	 * @param {!Object} arr Array-like object to slice.
	 * @param {number} start The index that should start the slice.
	 * @param {number=} opt_end The index where the slice should end, not
	 *   included in the final array. If not given, all elements after the
	 *   start index will be included.
	 * @return {!Array}
	 */
	static slice(arr, start, opt_end) {
		var sliced = [];
		var end = isDef(opt_end) ? opt_end : arr.length;
		for (var i = start; i < end; i++) {
			sliced.push(arr[i]);
		}
		return sliced;
	}
}

/*!
 * Polyfill from Google's Closure Library.
 * Copyright 2013 The Closure Library Authors. All Rights Reserved.
 */

var async = {};


/**
 * Throw an item without interrupting the current execution context.  For
 * example, if processing a group of items in a loop, sometimes it is useful
 * to report an error while still allowing the rest of the batch to be
 * processed.
 * @param {*} exception
 */
async.throwException = function(exception) {
	// Each throw needs to be in its own context.
	async.nextTick(function() {
		throw exception;
	});
};


/**
 * Fires the provided callback just before the current callstack unwinds, or as
 * soon as possible after the current JS execution context.
 * @param {function(this:THIS)} callback
 * @param {THIS=} opt_context Object to use as the "this value" when calling
 *     the provided function.
 * @template THIS
 */
async.run = function(callback, opt_context) {
	if (!async.run.workQueueScheduled_) {
		// Nothing is currently scheduled, schedule it now.
		async.nextTick(async.run.processWorkQueue);
		async.run.workQueueScheduled_ = true;
	}

	async.run.workQueue_.push(
		new async.run.WorkItem_(callback, opt_context));
};


/** @private {boolean} */
async.run.workQueueScheduled_ = false;


/** @private {!Array.<!async.run.WorkItem_>} */
async.run.workQueue_ = [];

/**
 * Run any pending async.run work items. This function is not intended
 * for general use, but for use by entry point handlers to run items ahead of
 * async.nextTick.
 */
async.run.processWorkQueue = function() {
	// NOTE: additional work queue items may be pushed while processing.
	while (async.run.workQueue_.length) {
		// Don't let the work queue grow indefinitely.
		var workItems = async.run.workQueue_;
		async.run.workQueue_ = [];
		for (var i = 0; i < workItems.length; i++) {
			var workItem = workItems[i];
			try {
				workItem.fn.call(workItem.scope);
			} catch (e) {
				async.throwException(e);
			}
		}
	}

	// There are no more work items, reset the work queue.
	async.run.workQueueScheduled_ = false;
};


/**
 * @constructor
 * @final
 * @struct
 * @private
 *
 * @param {function()} fn
 * @param {Object|null|undefined} scope
 */
async.run.WorkItem_ = function(fn, scope) {
	/** @const */
	this.fn = fn;
	/** @const */
	this.scope = scope;
};


/**
 * Fires the provided callbacks as soon as possible after the current JS
 * execution context. setTimeout(…, 0) always takes at least 5ms for legacy
 * reasons.
 * @param {function(this:SCOPE)} callback Callback function to fire as soon as
 *     possible.
 * @param {SCOPE=} opt_context Object in whose scope to call the listener.
 * @template SCOPE
 */
async.nextTick = function(callback, opt_context) {
	var cb = callback;
	if (opt_context) {
		cb = callback.bind(opt_context);
	}
	cb = async.nextTick.wrapCallback_(cb);
	// Introduced and currently only supported by IE10.
	// Verify if variable is defined on the current runtime (i.e., node, browser).
	// Can't use typeof enclosed in a function (such as core.isFunction) or an
	// exception will be thrown when the function is called on an environment
	// where the variable is undefined.
	if (typeof setImmediate === 'function') {
		setImmediate(cb);
		return;
	}
	// Look for and cache the custom fallback version of setImmediate.
	if (!async.nextTick.setImmediate_) {
		async.nextTick.setImmediate_ = async.nextTick.getSetImmediateEmulator_();
	}
	async.nextTick.setImmediate_(cb);
};


/**
 * Cache for the setImmediate implementation.
 * @type {function(function())}
 * @private
 */
async.nextTick.setImmediate_ = null;


/**
 * Determines the best possible implementation to run a function as soon as
 * the JS event loop is idle.
 * @return {function(function())} The "setImmediate" implementation.
 * @private
 */
async.nextTick.getSetImmediateEmulator_ = function() {
	// Create a private message channel and use it to postMessage empty messages
	// to ourselves.
	var Channel;

	// Verify if variable is defined on the current runtime (i.e., node, browser).
	// Can't use typeof enclosed in a function (such as core.isFunction) or an
	// exception will be thrown when the function is called on an environment
	// where the variable is undefined.
	if (typeof MessageChannel === 'function') {
		Channel = MessageChannel;
	}

	// If MessageChannel is not available and we are in a browser, implement
	// an iframe based polyfill in browsers that have postMessage and
	// document.addEventListener. The latter excludes IE8 because it has a
	// synchronous postMessage implementation.
	if (typeof Channel === 'undefined' && typeof window !== 'undefined' &&
		window.postMessage && window.addEventListener) {
		/** @constructor */
		Channel = function() {
			// Make an empty, invisible iframe.
			var iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.src = '';
			document.documentElement.appendChild(iframe);
			var win = iframe.contentWindow;
			var doc = win.document;
			doc.open();
			doc.write('');
			doc.close();
			var message = 'callImmediate' + Math.random();
			var origin = win.location.protocol + '//' + win.location.host;
			var onmessage = function(e) {
				// Validate origin and message to make sure that this message was
				// intended for us.
				if (e.origin !== origin && e.data !== message) {
					return;
				}
				this.port1.onmessage();
			}.bind(this);
			win.addEventListener('message', onmessage, false);
			this.port1 = {};
			this.port2 = {
				postMessage: function() {
					win.postMessage(message, origin);
				}
			};
		};
	}
	if (typeof Channel !== 'undefined') {
		var channel = new Channel();
		// Use a fifo linked list to call callbacks in the right order.
		var head = {};
		var tail = head;
		channel.port1.onmessage = function() {
			head = head.next;
			var cb = head.cb;
			head.cb = null;
			cb();
		};
		return function(cb) {
			tail.next = {
				cb: cb
			};
			tail = tail.next;
			channel.port2.postMessage(0);
		};
	}
	// Implementation for IE6-8: Script elements fire an asynchronous
	// onreadystatechange event when inserted into the DOM.
	if (typeof document !== 'undefined' && 'onreadystatechange' in
		document.createElement('script')) {
		return function(cb) {
			var script = document.createElement('script');
			script.onreadystatechange = function() {
				// Clean up and call the callback.
				script.onreadystatechange = null;
				script.parentNode.removeChild(script);
				script = null;
				cb();
				cb = null;
			};
			document.documentElement.appendChild(script);
		};
	}
	// Fall back to setTimeout with 0. In browsers this creates a delay of 5ms
	// or more.
	return function(cb) {
		setTimeout(cb, 0);
	};
};


/**
 * Helper function that is overrided to protect callbacks with entry point
 * monitor if the application monitors entry points.
 * @param {function()} callback Callback function to fire as soon as possible.
 * @return {function()} The wrapped callback.
 * @private
 */
async.nextTick.wrapCallback_ = function(opt_returnValue) {
	return opt_returnValue;
};

/**
 * Disposable utility. When inherited provides the `dispose` function to its
 * subclass, which is responsible for disposing of any object references
 * when an instance won't be used anymore. Subclasses should override
 * `disposeInternal` to implement any specific disposing logic.
 * @constructor
 */
class Disposable {
	constructor() {
		/**
		 * Flag indicating if this instance has already been disposed.
		 * @type {boolean}
		 * @protected
		 */
		this.disposed_ = false;
	}

	/**
	 * Disposes of this instance's object references. Calls `disposeInternal`.
	 */
	dispose() {
		if (!this.disposed_) {
			this.disposeInternal();
			this.disposed_ = true;
		}
	}

	/**
	 * Subclasses should override this method to implement any specific
	 * disposing logic (like clearing references and calling `dispose` on other
	 * disposables).
	 */
	disposeInternal() {}

	/**
	 * Checks if this instance has already been disposed.
	 * @return {boolean}
	 */
	isDisposed() {
		return this.disposed_;
	}
}

class string {
	/**
	 * Removes the breaking spaces from the left and right of the string and
	 * collapses the sequences of breaking spaces in the middle into single spaces.
	 * The original and the result strings render the same way in HTML.
	 * @param {string} str A string in which to collapse spaces.
	 * @return {string} Copy of the string with normalized breaking spaces.
	 */
	static collapseBreakingSpaces(str) {
		return str.replace(/[\t\r\n ]+/g, ' ').replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, '');
	}

	/**
	* Escapes characters in the string that are not safe to use in a RegExp.
	* @param {*} str The string to escape. If not a string, it will be casted
	*     to one.
	* @return {string} A RegExp safe, escaped copy of {@code s}.
	*/
	static escapeRegex(str) {
		return String(str)
			.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
			.replace(/\x08/g, '\\x08');
	}

	/**
	* Returns a string with at least 64-bits of randomness.
	* @return {string} A random string, e.g. sn1s7vb4gcic.
	*/
	static getRandomString() {
		var x = 2147483648;
		return Math.floor(Math.random() * x).toString(36) +
			Math.abs(Math.floor(Math.random() * x) ^ Date.now()).toString(36);
	}

	/**
	 * Calculates the hashcode for a string. The hashcode value is computed by
	 * the sum algorithm: s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]. A nice
	 * property of using 31 prime is that the multiplication can be replaced by
	 * a shift and a subtraction for better performance: 31*i == (i<<5)-i.
	 * Modern VMs do this sort of optimization automatically.
	 * @param {String} val Target string.
	 * @return {Number} Returns the string hashcode.
	 */
	static hashCode(val) {
		var hash = 0;
		for (var i = 0, len = val.length; i < len; i++) {
			hash = 31 * hash + val.charCodeAt(i);
			hash %= 0x100000000;
		}
		return hash;
	}

	/**
	 * Replaces interval into the string with specified value, e.g.
	 * `replaceInterval("abcde", 1, 4, "")` returns "ae".
	 * @param {string} str The input string.
	 * @param {Number} start Start interval position to be replaced.
	 * @param {Number} end End interval position to be replaced.
	 * @param {string} value The value that replaces the specified interval.
	 * @return {string}
	 */
	static replaceInterval(str, start, end, value) {
		return str.substring(0, start) + value + str.substring(end);
	}
}

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

/**
 * Class responsible for storing and handling the body contents
 * of a Filter instance.
 */
class FilterBody {
	/**
	 * Constructs a {@link FilterBody} instance.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} operatorOrValue If a third param is given, this should
	 *   be the filter's operator (like ">="). Otherwise, this will be
	 *   used as the filter's value, and the filter's operator will be "=".
	 * @param {*=} opt_value The filter's value.
	 * @constructor
	 */
	constructor(field, operatorOrValue, opt_value) {
		var obj = {
			operator: isDef(opt_value) ? operatorOrValue : '='
		};

		var value = isDef(opt_value) ? opt_value : operatorOrValue;

		if (isDefAndNotNull(value)) {
			if (value instanceof Embodied) {
				value = value.body();
			}
			obj.value = value;
		}

		if (isDefAndNotNull(field)) {
			this.createBody_(field, obj);
		} else {
			this.createBody_('and', []);
		}

	}

	/**
	 * Composes the current filter with the given operator.
	 * @param {string} operator
	 * @param {Filter=} opt_filter Another filter to compose this filter with,
	 *   if the operator is not unary.
	 */
	add(operator, opt_filter) {
		if (opt_filter) {
			this.addArrayOperator_(operator, opt_filter);
		} else {
			this.createBody_(operator, this.body_);
		}
	}

	/**
	 * Composes the current filter with an operator that stores its values in an array.
	 * @param {string} operator
	 * @param {!Filter} filter
	 * @protected
	 */
	addArrayOperator_(operator, filter) {
		if (!(this.body_[operator] instanceof Array)) {
			this.createBody_(operator, [this.body_]);
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
	 * Creates a new body object, setting the requestd key to the given value.
	 * @param {string} key The key to set in the new body object
	 * @param {*} value The value the requested key should have in the new body object.
	 * @protected
	 */
	createBody_(key, value) {
		this.body_ = {};
		this.body_[key] = value;
	}

	/**
	 * Gets the json object that represents this filter's body.
	 * @return {!Object}
	 */
	getObject() {
		return this.body_;
	}
}

/**
 * Class responsible for building different types of geometric
 * shapes.
 */
class Geo {
	/**
	 * Creates a new {@link BoundingBox} instance.
	 * @param {*} upperLeft The upper left point.
	 * @param {*} lowerRight The lower right point.
	 * @return {!BoundingBox}
	 * @static
	 */
	static boundingBox(upperLeft, lowerRight) {
		return new Geo.BoundingBox(upperLeft, lowerRight);
	}

	/**
	 * Creates a new {@link Circle} instance.
	 * @param {*} center The circle's center coordinate.
	 * @param {string} radius The circle's radius.
	 * @return {!Circle}
	 * @static
	 */
	static circle(center, radius) {
		return new Geo.Circle(center, radius);
	}

	/**
	 * Creates a new {@link Line} instance.
	 * @param {...*} points This line's points.
	 * @return {!Line}
	 * @static
	 */
	static line(...points) {
		return new Geo.Line(...points);
	}

	/**
	 * Creates a new {@link Point} instance.
	 * @param {number} lat The latitude coordinate
	 * @param {number} lon The longitude coordinate
	 * @return {!Point}
	 * @static
	 */
	static point(lat, lon) {
		return new Geo.Point(lat, lon);
	}

	/**
	 * Creates a new {@link Polygon} instance.
	 * @param {...*} points This polygon's points.
	 * @return {!Polygon}
	 * @static
	 */
	static polygon(...points) {
		return new Geo.Polygon(...points);
	}
}

/**
 * Class that represents a point coordinate.
 * @extends {Embodied}
 */
class Point extends Embodied {
	/**
	 * Constructs a {@link Point} instance.
	 * @param {number} lat The latitude coordinate
	 * @param {number} lon The longitude coordinate
	 * @constructor
	 */
	constructor(lat, lon) {
		super();
		this.body_ = [lat, lon];
	}
}
Geo.Point = Point;

/**
 * Class that represents a line.
 * @extends {Embodied}
 */
class Line extends Embodied {
	/**
	 * Constructs a {@link Line} instance.
	 * @param {...*} points This line's points.
	 * @constructor
	 */
	constructor(...points) {
		super();
		this.body_ = {
			type: 'linestring',
			coordinates: points.map(point => Embodied.toBody(point))
		};
	}
}
Geo.Line = Line;

/**
 * Class that represents a bounding box.
 * @extends {Embodied}
 */
class BoundingBox extends Embodied {
	/**
	 * Constructs a {@link BoundingBox} instance.
	 * @param {*} upperLeft The upper left point.
	 * @param {*} lowerRight The lower right point.
	 * @constructor
	 */
	constructor(upperLeft, lowerRight) {
		super();
		this.body_ = {
			type: 'envelope',
			coordinates: [Embodied.toBody(upperLeft), Embodied.toBody(lowerRight)]
		};
	}

	/**
	 * Gets this bounding box's points.
	 * @return {!Array}
	 */
	getPoints() {
		return this.body_.coordinates;
	}
}
Geo.BoundingBox = BoundingBox;

/**
 * Class that represents a circle.
 * @extends {Embodied}
 */
class Circle extends Embodied {
	/**
	 * Constructs a {@link Circle} instance.
	 * @param {*} center The circle's center coordinate.
	 * @param {string} radius The circle's radius.
	 * @constructor
	 */
	constructor(center, radius) {
		super();
		this.body_ = {
			type: 'circle',
			coordinates: Embodied.toBody(center),
			radius: radius
		};
	}

	/**
	 * Gets this circle's center coordinate.
	 * @return {*}
	 */
	getCenter() {
		return this.body_.coordinates;
	}

	/**
	 * Gets this circle's radius.
	 * @return {string}
	 */
	getRadius() {
		return this.body_.radius;
	}
}
Geo.Circle = Circle;

/**
 * Class that represents a polygon.
 * @extends {Embodied}
 */
class Polygon extends Embodied {
	/**
	 * Constructs a {@link Polygon} instance.
	 * @param {...*} points This polygon's points.
	 * @constructor
	 */
	constructor(...points) {
		super();
		this.body_ = {
			type: 'polygon',
			coordinates: []
		};
		this.addCoordinates_(...points);
	}

	/**
	 * Adds the given points as coordinates for this polygon.
	 * @param {...*} points
	 * @protected
	 */
	addCoordinates_(...points) {
		this.body_.coordinates.push(points.map(point => Embodied.toBody(point)));
	}

	/**
	 * Adds the given points as a hole inside this polygon.
	 * @param  {...*} points
	 * @chainnable
	 */
	hole(...points) {
		this.addCoordinates_(...points);
		return this;
	}
}
Geo.Polygon = Polygon;

/**
 * Class responsible for building range objects to be used by `Filter`.
 * @extends {Embodied}
 */
class Range extends Embodied {
	/**
	 * Constructs a {@link Range} instance.
	 * @param {*} from
	 * @param {*} opt_to
	 * @constructor
	 */
	constructor(from, opt_to) {
		super();
		if (isDefAndNotNull(from)) {
			this.body_.from = from;
		}
		if (isDefAndNotNull(opt_to)) {
			this.body_.to = opt_to;
		}
	}

	/**
	 * Constructs a {@link Range} instance.
	 * @param {*} from
	 * @return {!Range}
	 * @static
	 */
	static from(from) {
		return new Range(from);
	}

	/**
	 * Constructs a {@link Range} instance.
	 * @param {*} from
	 * @param {*} to
	 * @return {!Range}
	 * @static
	 */
	static range(from, to) {
		return new Range(from, to);
	}

	/**
	 * Constructs a {@link Range} instance.
	 * @param {*} to
	 * @return {!Range}
	 * @static
	 */
	static to(to) {
		return new Range(null, to);
	}
}

/**
 * Class responsible for building filters.
 * @extends {Embodied}
 */
class Filter extends Embodied {
	/**
	 * Constructs a {@link Filter} instance.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} operatorOrValue If a third param is given, this should
	 *   be the filter's operator (like ">="). Otherwise, this will be
	 *   used as the filter's value, and the filter's operator will be "=".
	 * @param {*=} opt_value The filter's value.
	 * @constructor
	 */
	constructor(field, operatorOrValue, opt_value) {
		super();
		this.body_ = new FilterBody(field, operatorOrValue, opt_value);
	}

	/**
	 * Adds a filter to be composed with this filter using the given operator.
	 * @param {string} operator
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainnable
	 */
	add(operator, fieldOrFilter, opt_operatorOrValue, opt_value) {
		var filter = fieldOrFilter ? Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value) : null;
		this.body_.add(operator, filter);
		return this;
	}

	/**
	 * Adds filters to be composed with this filter using the given operator.
	 * @param {string} operator
	 * @param {...*} filters A variable amount of filters to be composed.
	 * @chainnable
	 */
	addMany(operator, ...filters) {
		this.body_.addMany(operator, ...filters);
		return this;
	}

	/**
	 * Adds a filter to be composed with this filter using the "and" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainnable
	 */
	and(fieldOrFilter, opt_operatorOrValue, opt_value) {
		return this.add('and', fieldOrFilter, opt_operatorOrValue, opt_value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "any" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|...*)} values A variable amount of values to be used with
	 *   the "none" operator. Can be passed either as a single array or as
	 *   separate params.
	 * @return {!Filter}
	 * @static
	 */
	static any(field) {
		var values = Array.prototype.slice.call(arguments, 1);
		if (values.length === 1 && values[0] instanceof Array) {
			values = values[0];
		}
		return new Filter(field, 'any', values);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "gp" operator.
	 * This is a special use case of `Filter.polygon` for bounding
	 * boxes.
	 * @param {string} field The field's name.
	 * @param {*} boxOrUpperLeft Either a `Geo.BoundingBox` instance, or
	 *   a bounding box's upper left coordinate.
	 * @param {*=} opt_lowerRight A bounding box's lower right coordinate.
	 * @return {!Filter}
	 * @static
	 */
	static boundingBox(field, boxOrUpperLeft, opt_lowerRight) {
		if (boxOrUpperLeft instanceof Geo.BoundingBox) {
			return Filter.polygon(field, ...boxOrUpperLeft.getPoints());
		} else {
			return Filter.polygon(field, boxOrUpperLeft, opt_lowerRight);
		}
	}

	/**
	 * Gets the json object that represents this filter.
	 * @return {!Object}
	 */
	body() {
		return this.body_.getObject();
	}

	/**
	 * Returns a {@link Filter} instance that uses the "gd" operator.
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
		return Filter.distanceInternal_(field, location, range);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "gd" operator. This
	 * is just an internal helper used by `Filter.distance`.
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
		return Filter.field(field, 'gd', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static equal(field, value) {
		return new Filter(field, '=', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "exists" operator.
	 * @param {string} field The field's name.
	 * @return {!Filter}
	 * @static
	 */
	static exists(field) {
		return Filter.field(field, 'exists', null);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "fuzzy" operator.
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
		return Filter.fuzzyInternal_('fuzzy', fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness);
	}

	/**
	 * Returns a {@link Filter} instance that uses the given fuzzy operator. This
	 * is an internal implementation used by the `Filter.fuzzy` method.
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
		var arg2IsString = isString(opt_queryOrFuzziness);

		var value = {
			query: arg2IsString ? opt_queryOrFuzziness : fieldOrQuery
		};
		var fuzziness = arg2IsString ? opt_fuzziness : opt_queryOrFuzziness;
		if (fuzziness) {
			value.fuzziness = fuzziness;
		}

		var field = arg2IsString ? fieldOrQuery : Filter.ALL;
		return Filter.field(field, operator, value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the ">" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static gt(field, value) {
		return new Filter(field, '>', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the ">=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static gte(field, value) {
		return new Filter(field, '>=', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "match" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static match(fieldOrQuery, opt_query) {
		var field = isString(opt_query) ? fieldOrQuery : Filter.ALL;
		var query = isString(opt_query) ? opt_query : fieldOrQuery;
		return Filter.field(field, 'match', query);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "missing" operator.
	 * @param {string} field The field's name.
	 * @return {!Filter}
	 * @static
	 */
	static missing(field) {
		return Filter.field(field, 'missing', null);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "phrase" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static phrase(fieldOrQuery, opt_query) {
		var field = isString(opt_query) ? fieldOrQuery : Filter.ALL;
		var query = isString(opt_query) ? opt_query : fieldOrQuery;
		return Filter.field(field, 'phrase', query);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "gp" operator.
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
	 * Returns a {@link Filter} instance that uses the "prefix" operator.
	 * @param {string} fieldOrQuery If no second argument is given, this should
	 *   be the query string, in which case all fields will be matched. Otherwise,
	 *   this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static prefix(fieldOrQuery, opt_query) {
		var field = opt_query ? fieldOrQuery : Filter.ALL;
		var query = opt_query ? opt_query : fieldOrQuery;
		return Filter.field(field, 'prefix', query);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "range" operator.
	 * @param {string} field The field's name.
	 * @param {*} rangeOrMin Either a `Range` instance or a the range's min value.
	 * @param {*=} opt_max The range's max value.
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
	 * Returns a {@link Filter} instance that uses the "~" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static regex(field, value) {
		return new Filter(field, '~', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "gs" operator.
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

	/**
	 * Returns a {@link Filter} instance that uses the "similar" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 *   should be the query string, in which case all fields will be matched.
	 *   Otherwise, this should be the name of the field to match.
	 * @param {?string} query The query string.
	 * @return {!Filter}
	 * @static
	 */
	static similar(fieldOrQuery, query) {
		var field = isString(query) ? fieldOrQuery : Filter.ALL;
		var value = {
			query: isString(query) ? query : fieldOrQuery
		};
		return Filter.field(field, 'similar', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "<" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static lt(field, value) {
		return new Filter(field, '<', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "<=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	static lte(field, value) {
		return new Filter(field, '<=', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "none" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|...*)} value A variable amount of values to be used with
	 * the "none" operator. Can be passed either as a single array or as
	 * separate params.
	 * @return {!Filter}
	 * @static
	 */
	static none(field) {
		var values = Array.prototype.slice.call(arguments, 1);
		if (values.length === 1 && values[0] instanceof Array) {
			values = values[0];
		}
		return new Filter(field, 'none', values);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "!=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
	static notEqual(field, value) {
		return new Filter(field, '!=', value);
	}

	/**
	 * Returns a {@link Filter} instance that uses the "not" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 * the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
	static not(fieldOrFilter, opt_operatorOrValue, opt_value) {
		return Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value).add('not');
	}

	/**
	 * Returns a {@link Filter} instance.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} operatorOrValue If a third param is given, this should be the
	 * filter's operator (like ">="). Otherwise, this will be used as the
	 * filter's value, and the filter's operator will be "=".
	 * @param {*=} opt_value The filter's value.
	 * @return {!Filter}
	 * @static
	 */
	static field(field, operatorOrValue, opt_value) {
		return new Filter(field, operatorOrValue, opt_value);
	}

	/**
	 * Adds a filter to be composed with this filter using the "or" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 * the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainnable
	 */
	or(fieldOrFilter, opt_operatorOrValue, opt_value) {
		return this.add('or', fieldOrFilter, opt_operatorOrValue, opt_value);
	}

	/**
	 * Converts the given arguments into a {@link Filter} instance.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 * the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {!Filter}
	 */
	static toFilter(fieldOrFilter, opt_operatorOrValue, opt_value) {
		var filter = fieldOrFilter;
		if (!(filter instanceof Filter)) {
			filter = Filter.field(fieldOrFilter, opt_operatorOrValue, opt_value);
		}
		return filter;
	}
}

/**
 * String constant that represents all fields.
 * @type {string}
 * @static
 */
Filter.ALL = '*';

/**
 * Parses the given uri string into an object.
 * @param {*=} opt_uri Optional string URI to parse
 */
function parseFromAnchor(opt_uri) {
	var link = document.createElement('a');
	link.href = opt_uri;
	return {
		hash: link.hash,
		hostname: link.hostname,
		password: link.password,
		pathname: link.pathname[0] === '/' ? link.pathname : '/' + link.pathname,
		port: link.port,
		protocol: link.protocol,
		search: link.search,
		username: link.username
	};
}

/**
 * Parses the given uri string into an object. The URL function will be used
 * when present, otherwise we'll fall back to the anchor node element.
 * @param {*=} opt_uri Optional string URI to parse
 */
function parse(opt_uri) {
	if (isFunction(URL) && URL.length) {
		return new URL(opt_uri);
	} else {
		return parseFromAnchor(opt_uri);
	}
}

/**
 * A cached reference to the create function.
 */
var create = Object.create;

/**
 * Case insensitive string Multimap implementation. Allows multiple values for
 * the same key name.
 * @extends {Disposable}
 */
class MultiMap extends Disposable {
	constructor() {
		super();
		this.keys = create(null);
		this.values = create(null);
	}

	/**
	 * Adds value to a key name.
	 * @param {string} name
	 * @param {*} value
	 * @chainable
	 */
	add(name, value) {
		this.keys[name.toLowerCase()] = name;
		this.values[name.toLowerCase()] = this.values[name.toLowerCase()] || [];
		this.values[name.toLowerCase()].push(value);
		return this;
	}

	/**
	 * Clears map names and values.
	 * @chainable
	 */
	clear() {
		this.keys = create(null);
		this.values = create(null);
		return this;
	}

	/**
	 * Checks if map contains a value to the key name.
	 * @param {string} name
	 * @return {boolean}
	 * @chainable
	 */
	contains(name) {
		return name.toLowerCase() in this.values;
	}

	/**
	 * @inheritDoc
	 */
	disposeInternal() {
		this.values = null;
	}

	/**
	 * Creates a `MultiMap` instance from the given object.
	 * @param {!Object} obj
	 * @return {!MultiMap}
	 */
	static fromObject(obj) {
		var map = new MultiMap();
		var keys = Object.keys(obj);
		for (var i = 0; i < keys.length; i++) {
			map.set(keys[i], obj[keys[i]]);
		}
		return map;
	}

	/**
	 * Gets the first added value from a key name.
	 * @param {string} name
	 * @return {*}
	 * @chainable
	 */
	get(name) {
		var values = this.values[name.toLowerCase()];
		if (values) {
			return values[0];
		}
	}

	/**
	 * Gets all values from a key name.
	 * @param {string} name
	 * @return {Array.<*>}
	 */
	getAll(name) {
		return this.values[name.toLowerCase()];
	}

	/**
	 * Returns true if the map is empty, false otherwise.
	 * @return {boolean}
	 */
	isEmpty() {
		return this.size() === 0;
	}

	/**
	 * Gets array of key names.
	 * @return {Array.<string>}
	 */
	names() {
		return Object.keys(this.values).map((key) => this.keys[key]);
	}

	/**
	 * Removes all values from a key name.
	 * @param {string} name
	 * @chainable
	 */
	remove(name) {
		delete this.keys[name.toLowerCase()];
		delete this.values[name.toLowerCase()];
		return this;
	}

	/**
	 * Sets the value of a key name. Relevant to replace the current values with
	 * a new one.
	 * @param {string} name
	 * @param {*} value
	 * @chainable
	 */
	set(name, value) {
		this.keys[name.toLowerCase()] = name;
		this.values[name.toLowerCase()] = [value];
		return this;
	}

	/**
	 * Gets the size of the map key names.
	 * @return {number}
	 */
	size() {
		return this.names().length;
	}

	/**
	 * Returns the parsed values as a string.
	 * @return {string}
	 */
	toString() {
		return JSON.stringify(this.values);
	}
}

/**
 * Asserts that child has no parent.
 * @param {TreeNode} child A child.
 * @private
 */
const assertChildHasNoParent = function(child) {
	if (child.getParent()) {
		throw new Error('Cannot add child with parent.');
	}
};

var parseFn_ = parse;

class Uri {

	/**
	 * This class contains setters and getters for the parts of the URI.
	 * The following figure displays an example URIs and their component parts.
	 *
	 *                                  path
	 *	                             ┌───┴────┐
	 *	  abc://example.com:123/path/data?key=value#fragid1
	 *	  └┬┘   └────┬────┘ └┬┘           └───┬───┘ └──┬──┘
	 * protocol  hostname  port            search    hash
	 *          └──────┬───────┘
	 *                host
	 *
	 * @param {*=} opt_uri Optional string URI to parse
	 * @constructor
	 */
	constructor(opt_uri = '') {
		this.url = Uri.parse(this.maybeAddProtocolAndHostname_(opt_uri));
	}

	/**
	 * Adds parameters to uri from a <code>MultiMap</code> as source.
	 * @param {MultiMap} multimap The <code>MultiMap</code> containing the
	 *   parameters.
	 * @protected
	 * @chainable
	 */
	addParametersFromMultiMap(multimap) {
		multimap.names().forEach((name) => {
			multimap.getAll(name).forEach((value) => {
				this.addParameterValue(name, value);
			});
		});
		return this;
	}

	/**
	 * Adds the value of the named query parameters.
	 * @param {string} key The parameter to set.
	 * @param {*} value The new value. Will be explicitly casted to String.
	 * @chainable
	 */
	addParameterValue(name, value) {
		this.ensureQueryInitialized_();
		if (isDef(value)) {
			value = String(value);
		}
		this.query.add(name, value);
		return this;
	}

	/**
	 * Adds the values of the named query parameter.
	 * @param {string} key The parameter to set.
	 * @param {*} value The new value.
	 * @chainable
	 */
	addParameterValues(name, values) {
		values.forEach((value) => this.addParameterValue(name, value));
		return this;
	}

	/**
	 * Ensures query internal map is initialized and synced with initial value
	 * extracted from URI search part.
	 * @protected
	 */
	ensureQueryInitialized_() {
		if (this.query) {
			return;
		}
		this.query = new MultiMap();
		var search = this.url.search;
		if (search) {
			search.substring(1).split('&').forEach((param) => {
				var [key, value] = param.split('=');
				if (isDef(value)) {
					value = Uri.urlDecode(value);
				}
				this.addParameterValue(key, value);
			});
		}
	}

	/**
	 * Gets the hash part of uri.
	 * @return {string}
	 */
	getHash() {
		return this.url.hash || '';
	}

	/**
	 * Gets the host part of uri. E.g. <code>[hostname]:[port]</code>.
	 * @return {string}
	 */
	getHost() {
		var host = this.getHostname();
		if (host) {
			var port = this.getPort();
			if (port && port !== '80') {
				host += ':' + port;
			}
		}
		return host;
	}

	/**
	 * Gets the hostname part of uri without protocol and port.
	 * @return {string}
	 */
	getHostname() {
		var hostname = this.url.hostname;
		if (hostname === Uri.HOSTNAME_PLACEHOLDER) {
			return '';
		}
		return hostname;
	}

	/**
	 * Gets the origin part of uri. E.g. <code>http://[hostname]:[port]</code>.
	 * @return {string}
	 */
	getOrigin() {
		var host = this.getHost();
		if (host) {
			return this.getProtocol() + '//' + host;
		}
		return '';
	}

	/**
	 * Returns the first value for a given parameter or undefined if the given
	 * parameter name does not appear in the query string.
	 * @param {string} paramName Unescaped parameter name.
	 * @return {string|undefined} The first value for a given parameter or
	 *   undefined if the given parameter name does not appear in the query
	 *   string.
	 */
	getParameterValue(name) {
		this.ensureQueryInitialized_();
		return this.query.get(name);
	}

	/**
	 * Returns the value<b>s</b> for a given parameter as a list of decoded
	 * query parameter values.
	 * @param {string} name The parameter to get values for.
	 * @return {!Array<?>} The values for a given parameter as a list of decoded
	 *   query parameter values.
	 */
	getParameterValues(name) {
		this.ensureQueryInitialized_();
		return this.query.getAll(name);
	}

	/**
	 * Returns the name<b>s</b> of the parameters.
	 * @return {!Array<string>} The names for the parameters as a list of
	 *   strings.
	 */
	getParameterNames() {
		this.ensureQueryInitialized_();
		return this.query.names();
	}

	/**
	 * Gets the function currently being used to parse URIs.
	 * @return {!function()}
	 */
	static getParseFn() {
		return parseFn_;
	}

	/**
	 * Gets the pathname part of uri.
	 * @return {string}
	 */
	getPathname() {
		return this.url.pathname;
	}

	/**
	 * Gets the port number part of uri as string.
	 * @return {string}
	 */
	getPort() {
		return this.url.port;
	}

	/**
	 * Gets the protocol part of uri. E.g. <code>http:</code>.
	 * @return {string}
	 */
	getProtocol() {
		return this.url.protocol;
	}

	/**
	 * Gets the search part of uri. Search value is retrieved from query
	 * parameters.
	 * @return {string}
	 */
	getSearch() {
		var search = '';
		var querystring = '';
		this.getParameterNames().forEach((name) => {
			this.getParameterValues(name).forEach((value) => {
				querystring += name;
				if (isDef(value)) {
					querystring += '=' + encodeURIComponent(value);
				}
				querystring += '&';
			});
		});
		querystring = querystring.slice(0, -1);
		if (querystring) {
			search += '?' + querystring;
		}
		return search;
	}

	/**
	 * Checks if uri contains the parameter.
	 * @param {string} name
	 * @return {boolean}
	 */
	hasParameter(name) {
		this.ensureQueryInitialized_();
		return this.query.contains(name);
	}

	/**
	 * Makes this URL unique by adding a random param to it. Useful for avoiding
	 * cache.
	 */
	makeUnique() {
		this.setParameterValue(Uri.RANDOM_PARAM, string.getRandomString());
		return this;
	}

	/**
	 * Maybe adds protocol and a hostname placeholder on a parial URI if needed.
	 * Relevent for compatibility with <code>URL</code> native object.
	 * @param {string=} opt_uri
	 * @return {string} URI with protocol and hostname placeholder.
	 */
	maybeAddProtocolAndHostname_(opt_uri) {
		var url = opt_uri;
		if (opt_uri.indexOf('://') === -1 &&
			opt_uri.indexOf('javascript:') !== 0) { // jshint ignore:line

			url = Uri.DEFAULT_PROTOCOL;
			if (opt_uri[0] !== '/' || opt_uri[1] !== '/') {
				url += '//';
			}

			switch (opt_uri.charAt(0)) {
				case '.':
				case '?':
				case '#':
					url += Uri.HOSTNAME_PLACEHOLDER;
					url += '/';
					url += opt_uri;
					break;
				case '':
				case '/':
					if (opt_uri[1] !== '/') {
						url += Uri.HOSTNAME_PLACEHOLDER;
					}
					url += opt_uri;
					break;
				default:
					url += opt_uri;
			}
		}
		return url;
	}

	/**
	 * Normalizes the parsed object to be in the expected standard.
	 * @param {!Object}
	 */
	static normalizeObject(parsed) {
		var length = parsed.pathname ? parsed.pathname.length : 0;
		if (length > 1 && parsed.pathname[length - 1] === '/') {
			parsed.pathname = parsed.pathname.substr(0, length - 1);
		}
		return parsed;
	}

	/**
	 * Parses the given uri string into an object.
	 * @param {*=} opt_uri Optional string URI to parse
	 */
	static parse(opt_uri) {
		return Uri.normalizeObject(parseFn_(opt_uri));
	}

	/**
	 * Removes the named query parameter.
	 * @param {string} name The parameter to remove.
	 * @chainable
	 */
	removeParameter(name) {
		this.ensureQueryInitialized_();
		this.query.remove(name);
		return this;
	}

	/**
	 * Removes uniqueness parameter of the uri.
	 * @chainable
	 */
	removeUnique() {
		this.removeParameter(Uri.RANDOM_PARAM);
		return this;
	}

	/**
	 * Sets the hash.
	 * @param {string} hash
	 * @chainable
	 */
	setHash(hash) {
		this.url.hash = hash;
		return this;
	}

	/**
	 * Sets the hostname.
	 * @param {string} hostname
	 * @chainable
	 */
	setHostname(hostname) {
		this.url.hostname = hostname;
		return this;
	}

	/**
	 * Sets the value of the named query parameters, clearing previous values
	 * for that key.
	 * @param {string} key The parameter to set.
	 * @param {*} value The new value.
	 * @chainable
	 */
	setParameterValue(name, value) {
		this.removeParameter(name);
		this.addParameterValue(name, value);
		return this;
	}

	/**
	 * Sets the values of the named query parameters, clearing previous values
	 * for that key.
	 * @param {string} key The parameter to set.
	 * @param {*} value The new value.
	 * @chainable
	 */
	setParameterValues(name, values) {
		this.removeParameter(name);
		values.forEach((value) => this.addParameterValue(name, value));
		return this;
	}

	/**
	 * Sets the pathname.
	 * @param {string} pathname
	 * @chainable
	 */
	setPathname(pathname) {
		this.url.pathname = pathname;
		return this;
	}

	/**
	 * Sets the port number.
	 * @param {*} port Port number.
	 * @chainable
	 */
	setPort(port) {
		this.url.port = port;
		return this;
	}

	/**
	 * Sets the function that will be used for parsing the original string uri
	 * into an object.
	 * @param {!function()} parseFn
	 */
	static setParseFn(parseFn) {
		parseFn_ = parseFn;
	}

	/**
	 * Sets the protocol. If missing <code>http:</code> is used as default.
	 * @param {string} protocol
	 * @chainable
	 */
	setProtocol(protocol) {
		this.url.protocol = protocol;
		if (this.url.protocol[this.url.protocol.length - 1] !== ':') {
			this.url.protocol += ':';
		}
		return this;
	}

	/**
	 * @return {string} The string form of the url.
	 * @override
	 */
	toString() {
		var href = '';
		var host = this.getHost();
		if (host) {
			href += this.getProtocol() + '//';
		}
		href += host + this.getPathname() + this.getSearch() + this.getHash();
		return href;
	}

	/**
	 * Joins the given paths.
	 * @param {string} basePath
	 * @param {...string} ...paths Any number of paths to be joined with the base url.
	 * @static
	 */
	static joinPaths(basePath, ...paths) {
		if (basePath.charAt(basePath.length - 1) === '/') {
			basePath = basePath.substring(0, basePath.length - 1);
		}
		paths = paths.map(path => path.charAt(0) === '/' ? path.substring(1) : path);
		return [basePath].concat(paths).join('/').replace(/\/$/, '');
	}

	/**
	 * URL-decodes the string. We need to specially handle '+'s because
	 * the javascript library doesn't convert them to spaces.
	 * @param {string} str The string to url decode.
	 * @return {string} The decoded {@code str}.
	 */
	static urlDecode(str) {
		return decodeURIComponent(str.replace(/\+/g, ' '));
	}

}

/**
 * Default protocol value.
 * @type {string}
 * @default http:
 * @static
 */
Uri.DEFAULT_PROTOCOL = 'http:';

/**
 * Hostname placeholder. Relevant to internal usage only.
 * @type {string}
 * @static
 */
Uri.HOSTNAME_PLACEHOLDER = 'hostname' + Date.now();

/**
 * Name used by the param generated by `makeUnique`.
 * @type {string}
 * @static
 */
Uri.RANDOM_PARAM = 'zx';

function assertBrowserEnvironment() {
	if (!globals.window) {
		throw new Error('Sign-in type not supported in this environment');
	}
}

function assertDefAndNotNull(value, errorMessage) {
	if (!isDefAndNotNull(value)) {
		throw new Error(errorMessage);
	}
}

function assertFunction(value, errorMessage) {
	if (!isFunction(value)) {
		throw new Error(errorMessage);
	}
}

function assertObject(value, errorMessage) {
	if (!isObject(value)) {
		throw new Error(errorMessage);
	}
}

function assertResponseSucceeded(response) {
	if (!response.succeeded()) {
		throw response.body();
	}
	return response;
}

function assertUserSignedIn(user) {
	if (!isDefAndNotNull(user)) {
		throw new Error('You must be signed-in to perform this operation');
	}
}

function assertUriWithNoPath(url, message) {
	var uri = new Uri(url);
	if (uri.getPathname().length > 1) {
		throw new Error(message);
	}
}

/**
 * Class responsible for storing authorization information.
 */
class Auth {
	/**
	 * Constructs an {@link Auth} instance.
	 * @param {string} tokenOrEmail Either the authorization token, or
	 *   the username.
	 * @param {string=} opt_password If a username is given as the first param,
	 *   this should be the password.
	 * @constructor
	 */
	constructor(tokenOrEmail, opt_password = null) {
		this.token = isString(opt_password) ? null : tokenOrEmail;
		this.email = isString(opt_password) ? tokenOrEmail : null;
		this.password = opt_password;

		this.createdAt = null;
		this.id = null;
		this.name = null;
		this.photoUrl = null;
		this.wedeployClient = null;
	}

	/**
	 * Constructs an {@link Auth} instance.
	 * @param {string} tokenOrUsername Either the authorization token, or
	 *   the username.
	 * @param {string=} opt_password If a username is given as the first param,
	 *   this should be the password.
	 * @return {!Auth}
	 */
	static create(tokenOrUsername, opt_password) {
		return new Auth(tokenOrUsername, opt_password);
	}

	/**
	 * Gets the created at date.
	 * @return {string}
	 */
	getCreatedAt() {
		return this.createdAt;
	}

	/**
	 * Gets the email.
	 * @return {string}
	 */
	getEmail() {
		return this.email;
	}

	/**
	 * Gets the id.
	 * @return {string}
	 */
	getId() {
		return this.id;
	}

	/**
	 * Gets the name.
	 * @return {string}
	 */
	getName() {
		return this.name;
	}

	/**
	 * Gets the password.
	 * @return {string}
	 */
	getPassword() {
		return this.password;
	}

	/**
	 * Gets the photo url.
	 * @return {string}
	 */
	getPhotoUrl() {
		return this.photoUrl;
	}

	/**
	 * Gets the token.
	 * @return {string}
	 */
	getToken() {
		return this.token;
	}

	/**
	 * Checks if created at is set.
	 * @return {boolean}
	 */
	hasCreatedAt() {
		return isDefAndNotNull(this.createdAt);
	}

	/**
	 * Checks if the email is set.
	 * @return {boolean}
	 */
	hasEmail() {
		return isDefAndNotNull(this.email);
	}

	/**
	 * Checks if the id is set.
	 * @return {boolean}
	 */
	hasId() {
		return isDefAndNotNull(this.id);
	}

	/**
	 * Checks if the name is set.
	 * @return {boolean}
	 */
	hasName() {
		return isDefAndNotNull(this.name);
	}

	/**
	 * Checks if the password is set.
	 * @return {boolean}
	 */
	hasPassword() {
		return isDefAndNotNull(this.password);
	}

	/**
	 * Checks if the photo url is set.
	 * @return {boolean}
	 */
	hasPhotoUrl() {
		return isDefAndNotNull(this.photoUrl);
	}

	/**
	 * Checks if the token is set.
	 * @return {boolean}
	 */
	hasToken() {
		return isDefAndNotNull(this.token);
	}

	/**
	 * Sets created at.
	 * @param {string} createdAt
	 */
	setCreatedAt(createdAt) {
		this.createdAt = createdAt;
	}

	/**
	 * Sets the email.
	 * @param {string} email
	 */
	setEmail(email) {
		this.email = email;
	}

	/**
	 * Sets the id.
	 * @param {string} id
	 */
	setId(id) {
		this.id = id;
	}

	/**
	 * Sets the name.
	 * @param {string} name
	 */
	setName(name) {
		this.name = name;
	}

	/**
	 * Sets the password.
	 * @param {string} password
	 */
	setPassword(password) {
		this.password = password;
	}

	/**
	 * Sets the photo url.
	 * @param {string} photoUrl
	 */
	setPhotoUrl(photoUrl) {
		this.photoUrl = photoUrl;
	}

	/**
	 * Sets the token.
	 * @param {string} token
	 */
	setToken(token) {
		this.token = token;
	}

	setWedeployClient(wedeployClient) {
		this.wedeployClient = wedeployClient;
	}

	/**
	 * Updates the user.
	 * @param {!object} data
	 * @return {CompletableFuture}
	 */
	updateUser(data) {
		assertObject(data, 'User data must be specified as object');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/users')
			.auth(this)
			.patch(data)
			.then(response => assertResponseSucceeded(response));
	}

	/**
	 * Deletes the current user.
	 * @return {CompletableFuture}
	 */
	deleteUser() {
		assertDefAndNotNull(this.id, 'Cannot delete user without id');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/users', this.id)
			.auth(this)
			.delete()
			.then(response => assertResponseSucceeded(response));
	}
}

class ApiHelper {

	/**
	 * Constructs an {@link ApiHelper} instance.
	 * @constructor
	 */
	constructor(wedeployClient) {
		assertDefAndNotNull(wedeployClient, 'WeDeploy client reference must be specified');
		this.wedeployClient = wedeployClient;
	}

	/**
	 * Adds authorization information to this request.
	 * @param {!Auth|string} authOrTokenOrEmail Either an {@link Auth} instance,
	 * an authorization token, or the email.
	 * @param {string=} opt_password If a email is given as the first param,
	 * this should be the password.
	 * @chainable
	 */
	auth(authOrTokenOrEmail, opt_password) {
		this.helperAuthScope = authOrTokenOrEmail;
		if (!(this.helperAuthScope instanceof Auth)) {
			this.helperAuthScope = Auth.create(authOrTokenOrEmail, opt_password);
		}
		return this;
	}

}

/**
 * Class responsible for encapsulate provider information.
 */
class AuthProvider {
	/**
	 * Constructs an {@link AuthProvider} instance.
	 * @constructor
	 */
	constructor() {
		this.provider = null;
		this.providerScope = null;
		this.redirectUri = null;
		this.scope = null;
	}

	/**
	 * Checks if provider is defined and not null.
	 * @return {boolean}
	 */
	hasProvider() {
		return isDefAndNotNull(this.provider);
	}

	/**
	 * Checks if scope is defined and not null.
	 * @return {boolean}
	 */
	hasProviderScope() {
		return isDefAndNotNull(this.providerScope);
	}

	/**
	 * Checks if redirect uri is defined and not null.
	 * @return {boolean}
	 */
	hasRedirectUri() {
		return isDefAndNotNull(this.redirectUri);
	}

	/**
	 * Checks if scope is defined and not null.
	 * @return {boolean}
	 */
	hasScope() {
		return isDefAndNotNull(this.scope);
	}

	/**
	 * Makes authorization url.
	 * @return {string=} Authorization url.
	 */
	makeAuthorizationUrl(opt_authUrl) {
		var uri = new Uri(opt_authUrl);

		uri.setPathname('/oauth/authorize');

		if (this.hasProvider()) {
			uri.setParameterValue('provider', this.getProvider());
		}
		if (this.hasProviderScope()) {
			uri.setParameterValue('provider_scope', this.getProviderScope());
		}
		if (this.hasRedirectUri()) {
			uri.setParameterValue('redirect_uri', this.getRedirectUri());
		}
		if (this.hasScope()) {
			uri.setParameterValue('scope', this.getScope());
		}

		return uri.toString();
	}

	/**
	 * Gets provider name.
	 * @return {string=} Provider name.
	 */
	getProvider() {
		return this.provider;
	}

	/**
	 * Gets provider scope.
	 * @return {string=} String with scopes.
	 */
	getProviderScope() {
		return this.providerScope;
	}

	/**
	 * Gets redirect uri.
	 * @return {string=}.
	 */
	getRedirectUri() {
		return this.redirectUri;
	}

	/**
	 * Gets scope.
	 * @return {string=} String with scopes.
	 */
	getScope() {
		return this.scope;
	}

	/**
	 * Sets provider scope.
	 * @param {string=} scope Scope string. Separate by space for multiple
	 *   scopes, e.g. "scope1 scope2".
	 */
	setProviderScope(providerScope) {
		assertStringIfDefAndNotNull(providerScope, 'Provider scope must be a string');
		this.providerScope = providerScope;
	}

	/**
	 * Sets redirect uri.
	 * @param {string=} redirectUri.
	 */
	setRedirectUri(redirectUri) {
		assertStringIfDefAndNotNull(redirectUri, 'Redirect uri must be a string');
		this.redirectUri = redirectUri;
	}

	/**
	 * Sets scope.
	 * @param {string=} scope Scope string. Separate by space for multiple
	 *   scopes, e.g. "scope1 scope2".
	 */
	setScope(scope) {
		assertStringIfDefAndNotNull(scope, 'Scope must be a string');
		this.scope = scope;
	}
}

function assertStringIfDefAndNotNull(value, errorMessage) {
	if (isDefAndNotNull(value) && !isString(value)) {
		throw new Error(errorMessage);
	}
}

/**
 * Facebook auth provider implementation.
 */
class FacebookAuthProvider extends AuthProvider {
	/**
	 * Constructs an {@link FacebookAuthProvider} instance.
	 * @constructor
	 */
	constructor() {
		super();
		this.provider = FacebookAuthProvider.PROVIDER;
	}
}

FacebookAuthProvider.PROVIDER = 'facebook';

/**
 * Github auth provider implementation.
 */
class GithubAuthProvider extends AuthProvider {
	/**
	 * Constructs an {@link GithubAuthProvider} instance.
	 * @constructor
	 */
	constructor() {
		super();
		this.provider = GithubAuthProvider.PROVIDER;
	}
}

GithubAuthProvider.PROVIDER = 'github';

/**
 * Google auth provider implementation.
 */
class GoogleAuthProvider extends AuthProvider {
	/**
	 * Constructs an {@link GoogleAuthProvider} instance.
	 * @constructor
	 */
	constructor() {
		super();
		this.provider = GoogleAuthProvider.PROVIDER;
	}
}

GoogleAuthProvider.PROVIDER = 'google';

/* jshint ignore:start */

/**
 * Abstract interface for storing and retrieving data using some persistence
 * mechanism.
 * @constructor
 */
class StorageMechanism {
	/**
	 * Clear all items from the data storage.
	 */
	clear() {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Sets an item in the data storage.
	 * @param {string} key The key to set.
	 * @param {*} value The value to serialize to a string and save.
	 */
	set(key, value) {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Gets an item from the data storage.
	 * @param {string} key The key to get.
	 * @return {*} Deserialized value or undefined if not found.
	 */
	get(key) {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Checks if this mechanism is supported in the current environment.
	 * Subclasses should override this when necessary.
	 */
	static isSupported() {
		return true;
	}

	/**
	 * Returns the list of keys stored in the Storage object.
	 * @param {!Array<string>} keys
	 */
	keys() {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Removes an item from the data storage.
	 * @param {string} key The key to remove.
	 */
	remove(key) {
		throw Error('Unimplemented abstract method');
	}

	/**
	 * Returns the number of data items stored in the Storage object.
	 * @return {number}
	 */
	size() {
		throw Error('Unimplemented abstract method');
	}
}



/* jshint ignore:end */

class Storage {

	/**
	 * Provides a convenient API for data persistence using a selected data
	 * storage mechanism.
	 * @param {!StorageMechanism} mechanism The underlying storage mechanism.
	 * @constructor
	 */
	constructor(mechanism) {
		assertMechanismDefAndNotNull(mechanism);
		assertMechanismIntanceOf(mechanism);

		/**
		 * The mechanism used to persist key-value pairs.
		 * @type {StorageMechanism}
		 * @protected
		 */
		this.mechanism = mechanism;
	}

	/**
	 * Clear all items from the data storage.
	 */
	clear() {
		this.mechanism.clear();
	}

	/**
	 * Sets an item in the data storage.
	 * @param {string} key The key to set.
	 * @param {*} value The value to serialize to a string and save.
	 */
	set(key, value) {
		if (!core$2.isDef(value)) {
			this.mechanism.remove(key);
			return;
		}
		this.mechanism.set(key, JSON.stringify(value));
	}

	/**
	 * Gets an item from the data storage.
	 * @param {string} key The key to get.
	 * @return {*} Deserialized value or undefined if not found.
	 */
	get(key) {
		var json;
		try {
			json = this.mechanism.get(key);
		} catch (e) {
			return undefined;
		}
		if (core$2.isNull(json)) {
			return undefined;
		}
		try {
			return JSON.parse(json);
		} catch (e) {
			throw Storage.ErrorCode.INVALID_VALUE;
		}
	}

	/**
	 * Returns the list of keys stored in the Storage object.
	 * @param {!Array<string>} keys
	 */
	keys() {
		return this.mechanism.keys();
	}

	/**
	 * Removes an item from the data storage.
	 * @param {string} key The key to remove.
	 */
	remove(key) {
		this.mechanism.remove(key);
	}

	/**
	 * Returns the number of data items stored in the Storage object.
	 * @return {number}
	 */
	size() {
		return this.mechanism.size();
	}

	/**
	 * Returns the list of values stored in the Storage object.
	 * @param {!Array<string>} values
	 */
	values() {
		return this.keys().map((key) => this.get(key));
	}
}

/**
 * Errors thrown by the storage.
 * @enum {string}
 */
Storage.ErrorCode = {
	INVALID_VALUE: 'Storage: Invalid value was encountered'
};

function assertMechanismDefAndNotNull(mechanism) {
	if (!core$2.isDefAndNotNull(mechanism)) {
		throw Error('Storage mechanism is required');
	}
}

function assertMechanismIntanceOf(mechanism) {
	if (!(mechanism instanceof StorageMechanism)) {
		throw Error('Storage mechanism must me an implementation of StorageMechanism');
	}
}

/**
 * Abstract interface for storing and retrieving data using some persistence
 * mechanism.
 * @constructor
 */
class LocalStorageMechanism extends StorageMechanism {
	/**
	 * Returns reference for global local storage. by default
	 */
	storage() {
		return LocalStorageMechanism.globals.localStorage;
	}

	/**
	 * @inheritDoc
	 */
	clear() {
		this.storage().clear();
	}

	/**
	 * @inheritDoc
	 */
	keys() {
		return Object.keys(this.storage());
	}

	/**
	 * @inheritDoc
	 */
	get(key) {
		return this.storage().getItem(key);
	}

	/**
	 * @inheritDoc
	 */
	static isSupported() {
		return typeof window !== 'undefined';
	}

	/**
	 * @inheritDoc
	 */
	remove(key) {
		this.storage().removeItem(key);
	}

	/**
	 * @inheritDoc
	 */
	set(key, value) {
		this.storage().setItem(key, value);
	}

	/**
	 * @inheritDoc
	 */
	size() {
		return this.storage().length;
	}
}

if (LocalStorageMechanism.isSupported()) {
	LocalStorageMechanism.globals = {
		localStorage: window.localStorage
	};
}

/**
 * Class responsible for encapsulate auth api calls.
 */
class AuthApiHelper extends ApiHelper {
	/**
	 * Constructs an {@link AuthApiHelper} instance.
	 * @constructor
	 */
	constructor(wedeployClient) {
		super(wedeployClient);

		this.currentUser = null;
		this.onSignInCallback = null;
		this.onSignOutCallback = null;
		if (LocalStorageMechanism.isSupported()) {
			this.storage = new Storage(new LocalStorageMechanism());
		}

		this.processSignIn_();

		this.provider = {
			Facebook: FacebookAuthProvider,
			Google: GoogleAuthProvider,
			Github: GithubAuthProvider
		};
	}

	/**
	 * Creates user.
	 * @param {!object} data The data to be used to create the user.
	 * @return {CancellablePromise}
	 */
	createUser(data) {
		assertObject(data, 'User data must be specified as object');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/users')
			.post(data)
			.then(response => assertResponseSucceeded(response))
			.then(response => this.makeUserAuthFromData(response.body()));
	}

	/**
	 * Gets the current browser url without the fragment part.
	 * @return {!string}
	 * @protected
	 */
	getHrefWithoutFragment_() {
		var location = globals.window.location;
		return location.protocol + '//' + location.host + location.pathname + (location.search ? location.search : '');
	}

	/**
	 * Gets the access token from the url fragment and removes it.
	 * @return {?string}
	 * @protected
	 */
	getRedirectAccessToken_() {
		if (globals.window) {
			var fragment = globals.window.location.hash;
			if (fragment.indexOf('#access_token=') === 0) {
				return fragment.substring(14);
			}
		}
		return null;
	}

	/**
	 * Gets user by id.
	 * @param {!string} userId
	 * @return {CancellablePromise}
	 */
	getUser(userId) {
		assertDefAndNotNull(userId, 'User userId must be specified');
		assertUserSignedIn(this.currentUser);
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/users', userId)
			.auth(this.resolveAuthScope().token)
			.get()
			.then(response => assertResponseSucceeded(response))
			.then(response => this.makeUserAuthFromData(response.body()));
	}

	/**
	 * Loads current user. Requires a user token as argument.
	 * @param {!string} token
	 * @return {CancellablePromise}
	 */
	loadCurrentUser(token) {
		assertDefAndNotNull(token, 'User token must be specified');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/user')
			.auth(token)
			.get()
			.then(response => {
				var data = response.body();
				data.token = token;
				this.currentUser = this.makeUserAuthFromData(data);
				if (this.storage) {
					this.storage.set('currentUser', data);
				}
				return this.currentUser;
			});
	}

	/**
	 * Makes user Auth from data object.
	 * @param {object} data
	 * @return {Auth}
	 * @protected
	 */
	makeUserAuthFromData(data) {
		var auth = new Auth();
		auth.setWedeployClient(this.wedeployClient);
		auth.setCreatedAt(data.createdAt);
		auth.setEmail(data.email);
		auth.setId(data.id);
		auth.setName(data.name);
		auth.setPhotoUrl(data.photoUrl);
		auth.setToken(data.token);
		return auth;
	}

	/**
	 * Calls the on sign in callback if set.
	 * @protected
	 */
	maybeCallOnSignInCallback_() {
		if (this.onSignInCallback) {
			this.onSignInCallback.call(this, this.currentUser);
		}
	}

	/**
	 * Calls the on sign out callback if set.
	 * @protected
	 */
	maybeCallOnSignOutCallback_() {
		if (this.onSignOutCallback) {
			this.onSignOutCallback.call(this, this.currentUser);
		}
	}

	/**
	 * Fires passed callback when a user sign-in. Note that it keeps only the
	 * last callback passed.
	 * @param {!Function} callback
	 */
	onSignIn(callback) {
		assertFunction(callback, 'Sign-in callback must be a function');
		this.onSignInCallback = callback;
	}

	/**
	 * Fires passed callback when a user sign-out. Note that it keeps only the
	 * last callback passed.
	 * @param {!Function} callback
	 */
	onSignOut(callback) {
		assertFunction(callback, 'Sign-out callback must be a function');
		this.onSignOutCallback = callback;
	}

	/**
	 * Processes sign-in by detecting a presence of a fragment
	 * <code>#access_token=</code> in the url or, alternatively, by local
	 * storage current user.
	 */
	processSignIn_() {
		var redirectAccessToken = this.getRedirectAccessToken_();
		if (redirectAccessToken) {
			this.removeUrlFragmentCompletely_();
			this.loadCurrentUser(redirectAccessToken)
				.then(() => this.maybeCallOnSignInCallback_());
			return;
		}
		var currentUser = this.storage && this.storage.get('currentUser');
		if (currentUser) {
			this.currentUser = this.makeUserAuthFromData(currentUser);
		}
	}

	/**
	 * Removes fragment from url by performing a push state to the current path.
	 * @protected
	 */
	removeUrlFragmentCompletely_() {
		globals.window.history.pushState({}, document.title, window.location.pathname + window.location.search);
	}

	/**
	 * Resolves auth scope from last login or api helper.
	 * @return {Auth}
	 */
	resolveAuthScope() {
		if (this.helperAuthScope) {
			return this.helperAuthScope;
		}
		return this.currentUser;
	}

	/**
	 * Sends password reset email to the specified email if found in database.
	 * For security reasons call do not fail if email not found.
	 * @param {!string} email
	 * @return {CancellablePromise}
	 */
	sendPasswordResetEmail(email) {
		assertDefAndNotNull(email, 'Send password reset email must be specified');
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/user/recover')
			.param('email', email)
			.post()
			.then(response => assertResponseSucceeded(response));
	}

	/**
	 * Signs in using email and password.
	 * @param {!string} email
	 * @param {!string} password
	 * @return {CancellablePromise}
	 */
	signInWithEmailAndPassword(email, password) {
		assertDefAndNotNull(email, 'Sign-in email must be specified');
		assertDefAndNotNull(password, 'Sign-in password must be specified');

		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/oauth/token')
			.param('grant_type', 'password')
			.param('username', email)
			.param('password', password)
			.get()
			.then(response => assertResponseSucceeded(response))
			.then(response => this.loadCurrentUser(response.body().access_token))
			.then((user) => {
				this.maybeCallOnSignInCallback_();
				return user;
			});
	}

	/**
	 * Signs in with redirect. Some providers and environment may not support
	 * this flow.
	 * @param {AuthProvider} provider
	 */
	signInWithRedirect(provider) {
		assertBrowserEnvironment();
		assertDefAndNotNull(provider, 'Sign-in provider must be defined');
		assertSupportedProvider(provider);

		if (!provider.hasRedirectUri()) {
			provider.setRedirectUri(this.getHrefWithoutFragment_());
		}
		globals.window.location.href = provider.makeAuthorizationUrl(this.wedeployClient.authUrl_);
	}

	/**
	 * Signs out <code>currentUser</code> and removes from <code>localStorage</code>.
	 * @return {[type]} [description]
	 */
	signOut() {
		assertUserSignedIn(this.currentUser);
		return this.wedeployClient
			.url(this.wedeployClient.authUrl_)
			.path('/oauth/revoke')
			.param('token', this.currentUser.token)
			.get()
			.then(response => assertResponseSucceeded(response))
			.then(response => {
				this.maybeCallOnSignOutCallback_();
				this.unloadCurrentUser_();
				return response;
			});
	}

	/**
	 * Unloads all information for <code>currentUser</code> and removes from
	 * <code>localStorage</code> if present.
	 * @return {[type]} [description]
	 */
	unloadCurrentUser_() {
		this.currentUser = null;
		if (this.storage) {
			this.storage.remove('currentUser');
		}
	}
}

function assertSupportedProvider(provider) {
	switch (provider.constructor.PROVIDER) {
		case FacebookAuthProvider.PROVIDER:
		case GithubAuthProvider.PROVIDER:
		case GoogleAuthProvider.PROVIDER:
			break;
		default:
			throw new Error('Sign-in provider not supported');
	}
}

/**
 * Class that represents a search aggregation.
 */
class Aggregation {
	/**
	 * Constructs an {@link Aggregation} instance.
	 * @param {string} field The aggregation field.
	 * @param {string} operator The aggregation operator.
	 * @param {*=} opt_value The aggregation value.
	 * @constructor
	 */
	constructor(field, operator, opt_value) {
		this.field_ = field;
		this.operator_ = operator;
		this.value_ = opt_value;
	}

	/**
	 * Creates an {@link Aggregation} instance with the "avg" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static avg(field) {
		return Aggregation.field(field, 'avg');
	}

	/**
	 * Creates an {@link Aggregation} instance with the "count" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static count(field) {
		return Aggregation.field(field, 'count');
	}

	/**
	 * Creates an {@link DistanceAggregation} instance with the "geoDistance" operator.
	 * @param {string} field The aggregation field.
	 * @param {*} location The aggregation location.
	 * @param {...!Range} ranges The aggregation ranges.
	 * @return {!DistanceAggregation}
	 * @static
	 */
	static distance(field, location, ...ranges) {
		return new Aggregation.DistanceAggregation(field, location, ...ranges);
	}

	/**
	 * Creates an {@link Aggregation} instance with the "extendedStats" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static extendedStats(field) {
		return Aggregation.field(field, 'extendedStats');
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
	 * Creates an {@link Aggregation} instance with the "histogram" operator.
	 * @param {string} field The aggregation field.
	 * @param {number} interval The histogram's interval.
	 * @return {!Aggregation}
	 * @static
	 */
	static histogram(field, interval) {
		return new Aggregation(field, 'histogram', interval);
	}

	/**
	 * Creates an {@link Aggregation} instance with the "max" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static max(field) {
		return Aggregation.field(field, 'max');
	}

	/**
	 * Creates an {@link Aggregation} instance with the "min" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static min(field) {
		return Aggregation.field(field, 'min');
	}

	/**
	 * Creates an {@link Aggregation} instance with the "missing" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static missing(field) {
		return Aggregation.field(field, 'missing');
	}

	/**
	 * Creates a new {@link Aggregation} instance.
	 * @param {string} field The aggregation field.
	 * @param {string} operator The aggregation operator.
	 * @return {!Aggregation}
	 * @static
	 */
	static field(field, operator) {
		return new Aggregation(field, operator);
	}

	/**
	 * Creates an {@link RangeAggregation} instance with the "range" operator.
	 * @param {string} field The aggregation field.
	 * @param {...!Range} ranges The aggregation ranges.
	 * @return {!RangeAggregation}
	 * @static
	 */
	static range(field, ...ranges) {
		return new Aggregation.RangeAggregation(field, ...ranges);
	}

	/**
	 * Creates an {@link Aggregation} instance with the "stats" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static stats(field) {
		return Aggregation.field(field, 'stats');
	}

	/**
	 * Creates an {@link Aggregation} instance with the "sum" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static sum(field) {
		return Aggregation.field(field, 'sum');
	}

	/**
	 * Creates an {@link Aggregation} instance with the "terms" operator.
	 * @param {string} field The aggregation field.
	 * @return {!Aggregation}
	 * @static
	 */
	static terms(field) {
		return Aggregation.field(field, 'terms');
	}
}

/**
 * Class that represents a distance aggregation.
 * @extends {Aggregation}
 */
class DistanceAggregation extends Aggregation {
	/**
	 * Constructs an {@link DistanceAggregation} instance.
	 * @param {string} field The aggregation field.
	 * @param {*} location The aggregation location.
	 * @param {...!Range} ranges The aggregation ranges.
	 * @constructor
	 */
	constructor(field, location, ...ranges) {
		super(field, 'geoDistance', {});
		this.value_.location = Embodied.toBody(location);
		this.value_.ranges = ranges.map(range => range.body());
	}

	/**
	 * Adds a range to this aggregation.
	 * @param {*} rangeOrFrom
	 * @param {*=} opt_to
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
 * @extends {Aggregation}
 */
class RangeAggregation extends Aggregation {
	/**
	 * Constructs an {@link RangeAggregation} instance.
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
	 * @param {*=} opt_to
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

/**
 * Class responsible for building queries.
 * @extends {Embodied}
 */
class Query extends Embodied {
	/**
	 * Adds an aggregation to this {@link Query} instance.
	 * @param {string} name The aggregation name.
	 * @param {!Aggregation|string} aggregationOrField Either an
	 *   {@link Aggregation} instance or the name of the aggregation field.
	 * @param {string=} opt_operator The aggregation operator.
	 * @return {!Query}
	 * @static
	 */
	static aggregate(name, aggregationOrField, opt_operator) {
		return new Query().aggregate(name, aggregationOrField, opt_operator);
	}

	/**
	 * Sets this query's type to "count".
	 * @return {!Query}
	 * @static
	 */
	static count() {
		return new Query().type('count');
	}

	/**
	 * Sets this query's type to "fetch".
	 * @return {!Query}
	 * @static
	 */
	static fetch() {
		return new Query().type('fetch');
	}

	/**
	 * Adds a filter to this Query.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @return {!Query}
	 * @static
	 */
	static filter(fieldOrFilter, opt_operatorOrValue, opt_value) {
		return new Query().filter(fieldOrFilter, opt_operatorOrValue, opt_value);
	}

	/**
	 * Sets the query offset.
	 * @param {number} offset The index of the first entry that should be returned
	 *   by this query.
	 * @return {!Query}
	 * @static
	 */
	static offset(offset) {
		return new Query().offset(offset);
	}

	/**
	 * Adds a highlight entry to this {@link Query} instance.
	 * @param {string} field The field's name.
	 * @return {!Query}
	 * @static
	 */
	static highlight(field) {
		return new Query().highlight(field);
	}

	/**
	 * Sets the query limit.
	 * @param {number} limit The max amount of entries that this query should return.
	 * @return {!Query}
	 * @static
	 */
	static limit(limit) {
		return new Query().limit(limit);
	}

	/**
	 * Adds a search to this {@link Query} instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a {@link Filter}
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string=} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*=} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @return {!Query}
	 * @static
	 */
	static search(filterOrTextOrField, opt_textOrOperator, opt_value) {
		return new Query().search(filterOrTextOrField, opt_textOrOperator, opt_value);
	}

	/**
	 * Adds a sort entry to this query, specifying the field this query should be
	 * sorted by and, optionally, the sort direction.
	 * @param {string} field The field that the query should be sorted by.
	 * @param {string=} opt_direction The direction the sort operation should use.
	 *   If none is given, "asc" is used by default.
	 * @return {!Query}
	 * @static
	 */
	static sort(field, opt_direction) {
		return new Query().sort(field, opt_direction);
	}

	/**
	 * Sets the query type.
	 * @param {string} type The query's type. For example: "count", "fetch".
	 * @return {!Query}
	 * @static
	 */
	static type(type) {
		return new Query().type(type);
	}

	/**
	 * Adds an aggregation to this {@link Query} instance.
	 * @param {string} name The aggregation name.
	 * @param {!Aggregation|string} aggregationOrField Either an
	 *   {@link Aggregation} instance or the name of the aggregation field.
	 * @param {string=} opt_operator The aggregation operator.
	 * @chainnable
	 */
	aggregate(name, aggregationOrField, opt_operator) {
		var aggregation = aggregationOrField;
		if (!(aggregation instanceof Aggregation)) {
			aggregation = Aggregation.field(aggregationOrField, opt_operator);
		}

		var field = aggregation.getField();
		var value = {};
		value[field] = {
			name: name,
			operator: aggregation.getOperator()
		};
		if (isDefAndNotNull(aggregation.getValue())) {
			value[field].value = aggregation.getValue();
		}

		if (!this.body_.aggregation) {
			this.body_.aggregation = [];
		}
		this.body_.aggregation.push(value);
		return this;
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
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainnable
	 */
	filter(fieldOrFilter, opt_operatorOrValue, opt_value) {
		let filter = Filter.toFilter(fieldOrFilter, opt_operatorOrValue, opt_value);
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
	offset(offset) {
		this.body_.offset = offset;
		return this;
	}

	/**
	 * Adds a highlight entry to this {@link Query} instance.
	 * @param {string} field The field's name.
	 * @chainnable
	 */
	highlight(field) {
		if (!this.body_.highlight) {
			this.body_.highlight = [];
		}

		this.body_.highlight.push(field);
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
	 * Adds a search to this {@link Query} instance.
	 * @param {!Filter|string} filterOrTextOrField If no other arguments
	 *   are passed to this function, this should be either a {@link Filter}
	 *   instance or a text to be used in a match filter. In both cases
	 *   the filter will be applied to all fields. Another option is to
	 *   pass this as a field name instead, together with other arguments
	 *   so the filter can be created.
	 * @param {string=} opt_textOrOperator Either a text to be used in a
	 *   match filter, or the operator that should be used.
	 * @param {*=} opt_value The value to be used by the filter. Should
	 *   only be passed if an operator was passed as the second argument.
	 * @chainnable
	 */
	search(filterOrTextOrField, opt_textOrOperator, opt_value) {
		var filter = filterOrTextOrField;

		if (opt_value) {
			filter = Filter.field(filterOrTextOrField, opt_textOrOperator, opt_value);
		} else if (opt_textOrOperator) {
			filter = Filter.match(filterOrTextOrField, opt_textOrOperator);
		} else if (!(filter instanceof Filter)) {
			filter = Filter.match(filterOrTextOrField);
		}

		if (!this.body_.search) {
			this.body_.search = [];
		}

		if (isDefAndNotNull(filterOrTextOrField)) {
			this.body_.search.push(filter.body());
		} else {
			this.body_.search.push({});
		}

		return this;
	}

	/**
	 * Adds a sort entry to this query, specifying the field this query should be
	 * sorted by and, optionally, the sort direction.
	 * @param {string} field The field that the query should be sorted by.
	 * @param {string=} opt_direction The direction the sort operation should use.
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

/**
 * Class responsible for encapsulate data api calls.
 */
class DataApiHelper extends ApiHelper {
	/**
	 * Constructs an {@link DataApiHelper} instance.
	 * @param {@link WeDeploy} instance.
	 * @constructor
	 */
	constructor(wedeployClient) {
		super(wedeployClient);
	}

	/**
	 * Adds a filter to this request's {@link Query}.
	 * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
	 *   name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainable
	 */
	where(fieldOrFilter, opt_operatorOrValue, opt_value) {
		this.getOrCreateFilter_().and(fieldOrFilter, opt_operatorOrValue, opt_value);
		return this;
	}

	/**
	 * Adds a filter to be composed with this filter using the "or" operator.
	 * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
	 *   the name of the field to filter by.
	 * @param {*=} opt_operatorOrValue Either the field's operator or its value.
	 * @param {*=} opt_value The filter's value.
	 * @chainnable
	 */
	or(fieldOrFilter, opt_operatorOrValue, opt_value) {
		if (this.getOrCreateFilter_().body().and.length === 0) {
			throw Error('It\'s required to have a condition before using an \'or()\' for the first time.');
		}
		this.getOrCreateFilter_().or(fieldOrFilter, opt_operatorOrValue, opt_value);
		return this;
	}

	/**
	 * Adds a filter to be compose with this filter using "none" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|...*)} args A variable amount of values to be used with
	 * the "none" operator. Can be passed either as a single array or as
	 * separate params.
	 * @chainnable
	 */
	none(field, ...args) {
		return this.where(Filter.none(field, args));
	}

	/**
	 * Adds a filter to be compose with this filter using "match" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 * should be the query string, in which case all fields will be matched.
	 * Otherwise, this should be the name of the field to match.
	 * @param {string=} opt_query The query string.
	 * @chainnable
	 */
	match(field, value) {
		return this.where(Filter.match(field, value));
	}

	/**
	 * Adds a filter to be compose with this filter using "similar" operator.
	 * @param {string} fieldOrQuery If no second string argument is given, this
	 * should be the query string, in which case all fields will be matched.
	 * Otherwise, this should be the name of the field to match.
	 * @param {?string} query The query string.
	 * @chainnable
	 */
	similar(fieldOrQuery, query) {
		return this.where(Filter.similar(fieldOrQuery, query));
	}

	/**
	 * Returns a {@link Filter} instance that uses the "<" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	lt(field, value) {
		return this.where(Filter.lt(field, value));
	}

	/**
	 * Returns a {@link Filter} instance that uses the "<=" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {*} value The filter's value.
	 * @return {!Filter}
   * @static
	 */
	lte(field, value) {
		return this.where(Filter.lte(field, value));
	}


	/**
	 * Adds a filter to be compose with this filter using "any" operator.
	 * @param {string} field The name of the field to filter by.
	 * @param {!(Array|...*)} args A variable amount of values to be used with
	 * the "none" operator. Can be passed either as a single array or as
	 * separate params.
	 * @chainnable
	 */
	any(field, ...args) {
		return this.where(Filter.any(field, args));
	}

	/**
	 * Adds a filter to be compose with this filter using "gp" operator. This is a
	 * special use case of `Filter.polygon` for bounding boxes.
	 * @param {string} field The field's name.
	 * @param {*} boxOrUpperLeft Either a `Geo.BoundingBox` instance, or a
	 * bounding box's upper left coordinate.
	 * @param {*=} opt_lowerRight A bounding box's lower right coordinate.
	 * @chainnable
	 */
	boundingBox(field, boxOrUpperLeft, opt_lowerRight) {
		return this.where(Filter.boundingBox(field, boxOrUpperLeft, opt_lowerRight));
	}

	/**
	 * Adds a filter to be compose with this filter using "gd" operator.
	 * @param {string} field The field's name.
	 * @param {*} locationOrCircle Either a `Geo.Circle` instance or a
	 * coordinate.
	 * @param {Range|string=} opt_rangeOrDistance Either a `Range` instance or
	 * the distance value.
	 * @return {!Filter}
	 * @chainnable
	 */
	distance(field, locationOrCircle, opt_rangeOrDistance) {
		return this.where(Filter.distance(field, locationOrCircle, opt_rangeOrDistance));
	}

	/**
	 * Adds a filter to be compose with this filter using "range" operator.
	 * @param {string} field The field's name.
	 * @param {*} rangeOrMin Either a `Range` instance or a the range's min
	 * value.
	 * @param {*=} opt_max The range's max value.
	 * @return {!Filter}
	 * @chainnable
	 */
	range(field, rangeOrMin, opt_max) {
		return this.where(Filter.range(field, rangeOrMin, opt_max));
	}

	/**
	 * Sets the limit for this request's {@link Query}.
	 * @param {number} limit The max amount of entries that this request should return.
	 * @chainable
	 */
	limit(limit) {
		this.getOrCreateQuery_().limit(limit);
		return this;
	}

	/**
	 * Sets the offset for this request's {@link Query}.
	 * @param {number} offset The index of the first entry that should be
	 * returned by this query.
	 * @chainable
	 */
	offset(offset) {
		this.getOrCreateQuery_().offset(offset);
		return this;
	}

	/**
	 * Adds a highlight entry to this request's {@link Query} instance.
	 * @param {string} field The field's name.
	 * @chainable
	 */
	highlight(field) {
		this.getOrCreateQuery_().highlight(field);
		return this;
	}

	/**
	 * Adds an aggregation to this {@link Query} instance.
	 * @param {string} name The aggregation name.
	 * @param {!Aggregation|string} aggregationOrField Either an {@link
	 * Aggregation} instance or the name of the aggregation field.
	 * @param {string=} opt_operator The aggregation operator.
	 * @chainable
	 */
	aggregate(name, aggregationOrField, opt_operator) {
		this.getOrCreateQuery_().aggregate(name, aggregationOrField, opt_operator);
		return this;
	}

	/**
	 * Sets this request's query type to 'count'.
	 * @chainnable
	 */
	count() {
		this.getOrCreateQuery_().type('count');
		return this;
	}

	/**
	 * Adds a sort query to this request's body.
	 * @param {string} field The field that the query should be sorted by.
	 * @param {string=} opt_direction The direction the sort operation should
	 * use. If none is given, 'asc' is used by default.
	 * @chainnable
	 */
	orderBy(field, opt_direction) {
		this.getOrCreateQuery_().sort(field, opt_direction);
		return this;
	}

	/**
	 * Creates an object (or multiple objects) and saves it to WeDeploy data. If
	 * there's a validation registered in the collection and the request is
	 * successful, the resulting object (or array of objects) is returned. The
	 * data parameter can be either an Object or an Array of Objects.
	 * These Objects describe the attributes on the objects that are to be created.
	 * ```javascript
	 * var data = WeDeploy.data('http://demodata.wedeploy.io');
	 *
	 * data.create('movies', {'title'=> 'Star Wars: Episode I – The Phantom Menace'})
	 * 		 .then(function(movie){
	 * 			 console.log(movie)
	 *     });
	 *
	 * data.create('movies', [{'title'=> 'Star Wars: Episode II – Attack of the Clones'},
	 * 												{'title'=> 'Star Wars: Episode III – Revenge of the Sith'})
	 * 		 .then(function(movies){
	 * 			 console.log(movies)
	 *     });
	 * ```
	 * @param {string} collection Collection (key) used to create the new data.
	 * @param {Object} data Attributes on the object that is to be created.
	 * @return {!CancellablePromise}
	 */
	create(collection, data) {
		assertDefAndNotNull(collection, 'Collection key must be specified.');
		assertObject(data, 'Data can\'t be empty.');

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.auth(this.helperAuthScope)
			.path(collection)
			.post(data)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Update the attributes of a document form the passed-in object and saves
	 * the record. If the object is invalid, the saving will fail and an error
	 * object will be returned.
	 *
	 * ```javascript
	 * var data = WeDeploy.data('http://demodata.wedeploy.io');
	 *
	 * data.update('movies/1019112353', {'title'=> 'Star Wars: Episode I'})
	 * 		 .then(function(movie){
	 * 			 console.log(movie)
	 *     });
	 * ```
	 * @param {string} document Key used to update the document.
	 * @param {Object} data Attributes on the object that is to be updated.
	 * @return {!CancellablePromise}
	 */
	update(document, data) {
		assertDefAndNotNull(document, 'Document key must be specified.');
		assertObject(data, 'Data must be specified.');

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.auth(this.helperAuthScope)
			.path(document)
			.put(data)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Deletes a [document/field/collection].
	 * @param {string} key Key used to delete the
	 * document/field/collection.
	 * @return {!CancellablePromise}
	 */
	delete(key) {
		assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.auth(this.helperAuthScope)
			.path(key)
			.delete()
			.then(response => assertResponseSucceeded(response))
			.then(() => undefined);
	}

	/**
	 * Retrieve data from a [document/field/collection].
	 * @param {string} key Key used to delete the document/field/collection.
	 * @return {!CancellablePromise}
	 */
	get(key) {
		assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

		this.addFiltersToQuery_();

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.auth(this.helperAuthScope)
			.path(key)
			.get(this.query_)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Retrieve data from a [document/field/collection] and put it in a search
	 * format.
	 * @param {string} key Key used to delete the document/field/collection.
	 * @return {!CancellablePromise}
	 */
	search(key) {
		assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

		this.onSearch_();

		this.addFiltersToQuery_();

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.auth(this.helperAuthScope)
			.path(key)
			.get(this.query_)
			.then(response => assertResponseSucceeded(response))
			.then(response => response.body());
	}

	/**
	 * Creates new socket.io instance. Monitor the arrival of new broadcasted
	 * data.
	 * @param  {string} collection key/collection used to find organized data.
	 * @param  {Object=} opt_options Object with Socket IO options.
	 * @return {!io} Socket IO reference. Server events can be listened on it.
	 */
	watch(collection, opt_options) {
		assertDefAndNotNull(collection, 'Collection key must be specified');

		this.addFiltersToQuery_();

		return this.wedeployClient
			.url(this.wedeployClient.dataUrl_)
			.auth(this.helperAuthScope)
			.path(collection)
			.watch(this.query_, opt_options);
	}

	/**
	 * Gets the currentl used main {@link Filter} object. If none exists yet, a
	 * new one is created.
	 * @return {!Query}
	 * @protected
	 */
	getOrCreateFilter_() {
		if (!this.filter_) {
			this.filter_ = new Filter();
		}
		return this.filter_;
	}

	/**
	 * Gets the currently used {@link Query} object. If none exists yet,
	 * a new one is created.
	 * @return {!Query}
	 * @protected
	 */
	getOrCreateQuery_() {
		if (!this.query_) {
			this.query_ = new Query();
		}
		return this.query_;
	}

	/**
	 * Load the currently used main {@link Filter} object into the currently
	 * used {@link Query}.
	 * @chainable
	 * @protected
	 */
	addFiltersToQuery_() {
		if (isDef(this.filter_) && this.toSearch_ !== true) {
			this.getOrCreateQuery_().filter(this.filter_);
		}
		return this;
	}

	/**
	 * Adds a search to this request's {@link Query} instance.
	 * @chainable
	 * @protected
	 */
	onSearch_() {
		if (isDef(this.filter_)) {
			this.getOrCreateQuery_().search(this.getOrCreateFilter_());
		} else {
			throw Error('It\'s required to have a condition before using an \'search()\' for the first time.');
		}
		this.toSearch_ = true;
		return this;
	}

}

/**
 * Abstraction layer for string to base64 conversion
 * reference: https://github.com/nodejs/node/issues/3462
 */
class Base64 {
	/**
	 * Creates a base-64 encoded ASCII string from a "string" of binary data.
	 * @param {string} string to be encoded.
	 * @return {string}
	 * @static
	 */
	static encodeString(string) {
		if (typeof btoa === 'function') {
			return btoa(string);
		}

		return new Buffer(string.toString(), 'binary');
	}
}

/*!
 * Promises polyfill from Google's Closure Library.
 *
 *      Copyright 2013 The Closure Library Authors. All Rights Reserved.
 *
 * NOTE(eduardo): Promise support is not ready on all supported browsers,
 * therefore metal-promise is temporarily using Google's promises as polyfill.
 * It supports cancellable promises and has clean and fast implementation.
 */

/**
 * Provides a more strict interface for Thenables in terms of
 * http://promisesaplus.com for interop with {@see CancellablePromise}.
 *
 * @interface
 * @extends {IThenable.<TYPE>}
 * @template TYPE
 */
var Thenable = function() {};

/**
 * Adds callbacks that will operate on the result of the Thenable, returning a
 * new child Promise.
 *
 * If the Thenable is fulfilled, the {@code onFulfilled} callback will be
 * invoked with the fulfillment value as argument, and the child Promise will
 * be fulfilled with the return value of the callback. If the callback throws
 * an exception, the child Promise will be rejected with the thrown value
 * instead.
 *
 * If the Thenable is rejected, the {@code onRejected} callback will be invoked
 * with the rejection reason as argument, and the child Promise will be rejected
 * with the return value of the callback or thrown value.
 *
 * @param {?(function(this:THIS, TYPE):
 *             (RESULT|IThenable.<RESULT>|Thenable))=} opt_onFulfilled A
 *     function that will be invoked with the fulfillment value if the Promise
 *     is fullfilled.
 * @param {?(function(*): *)=} opt_onRejected A function that will be invoked
 *     with the rejection reason if the Promise is rejected.
 * @param {THIS=} opt_context An optional context object that will be the
 *     execution context for the callbacks. By default, functions are executed
 *     with the default this.
 * @return {!CancellablePromise.<RESULT>} A new Promise that will receive the
 *     result of the fulfillment or rejection callback.
 * @template RESULT,THIS
 */
Thenable.prototype.then = function() {};


/**
 * An expando property to indicate that an object implements
 * {@code Thenable}.
 *
 * {@see addImplementation}.
 *
 * @const
 */
Thenable.IMPLEMENTED_BY_PROP = '$goog_Thenable';


/**
 * Marks a given class (constructor) as an implementation of Thenable, so
 * that we can query that fact at runtime. The class must have already
 * implemented the interface.
 * Exports a 'then' method on the constructor prototype, so that the objects
 * also implement the extern {@see Thenable} interface for interop with
 * other Promise implementations.
 * @param {function(new:Thenable,...[?])} ctor The class constructor. The
 *     corresponding class must have already implemented the interface.
 */
Thenable.addImplementation = function(ctor) {
  ctor.prototype.then = ctor.prototype.then;
  ctor.prototype.$goog_Thenable = true;
};


/**
 * @param {*} object
 * @return {boolean} Whether a given instance implements {@code Thenable}.
 *     The class/superclass of the instance must call {@code addImplementation}.
 */
Thenable.isImplementedBy = function(object$$1) {
  if (!object$$1) {
    return false;
  }
  try {
    return !!object$$1.$goog_Thenable;
  } catch (e) {
    // Property access seems to be forbidden.
    return false;
  }
};


/**
 * Like bind(), except that a 'this object' is not required. Useful when the
 * target function is already bound.
 *
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 */
var partial = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Clone the array (with slice()) and append additional arguments
    // to the existing arguments.
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};

/**
 * Promises provide a result that may be resolved asynchronously. A Promise may
 * be resolved by being fulfilled or rejected with a value, which will be known
 * as the fulfillment value or the rejection reason. Whether fulfilled or
 * rejected, the Promise result is immutable once it is set.
 *
 * Promises may represent results of any type, including undefined. Rejection
 * reasons are typically Errors, but may also be of any type. Closure Promises
 * allow for optional type annotations that enforce that fulfillment values are
 * of the appropriate types at compile time.
 *
 * The result of a Promise is accessible by calling {@code then} and registering
 * {@code onFulfilled} and {@code onRejected} callbacks. Once the Promise
 * resolves, the relevant callbacks are invoked with the fulfillment value or
 * rejection reason as argument. Callbacks are always invoked in the order they
 * were registered, even when additional {@code then} calls are made from inside
 * another callback. A callback is always run asynchronously sometime after the
 * scope containing the registering {@code then} invocation has returned.
 *
 * If a Promise is resolved with another Promise, the first Promise will block
 * until the second is resolved, and then assumes the same result as the second
 * Promise. This allows Promises to depend on the results of other Promises,
 * linking together multiple asynchronous operations.
 *
 * This implementation is compatible with the Promises/A+ specification and
 * passes that specification's conformance test suite. A Closure Promise may be
 * resolved with a Promise instance (or sufficiently compatible Promise-like
 * object) created by other Promise implementations. From the specification,
 * Promise-like objects are known as "Thenables".
 *
 * @see http://promisesaplus.com/
 *
 * @param {function(
 *             this:RESOLVER_CONTEXT,
 *             function((TYPE|IThenable.<TYPE>|Thenable)),
 *             function(*)): void} resolver
 *     Initialization function that is invoked immediately with {@code resolve}
 *     and {@code reject} functions as arguments. The Promise is resolved or
 *     rejected with the first argument passed to either function.
 * @param {RESOLVER_CONTEXT=} opt_context An optional context for executing the
 *     resolver function. If unspecified, the resolver function will be executed
 *     in the default scope.
 * @constructor
 * @struct
 * @final
 * @implements {Thenable.<TYPE>}
 * @template TYPE,RESOLVER_CONTEXT
 */
var CancellablePromise = function(resolver, opt_context) {
  /**
   * The internal state of this Promise. Either PENDING, FULFILLED, REJECTED, or
   * BLOCKED.
   * @private {CancellablePromise.State_}
   */
  this.state_ = CancellablePromise.State_.PENDING;

  /**
   * The resolved result of the Promise. Immutable once set with either a
   * fulfillment value or rejection reason.
   * @private {*}
   */
  this.result_ = undefined;

  /**
   * For Promises created by calling {@code then()}, the originating parent.
   * @private {CancellablePromise}
   */
  this.parent_ = null;

  /**
   * The list of {@code onFulfilled} and {@code onRejected} callbacks added to
   * this Promise by calls to {@code then()}.
   * @private {Array.<CancellablePromise.CallbackEntry_>}
   */
  this.callbackEntries_ = null;

  /**
   * Whether the Promise is in the queue of Promises to execute.
   * @private {boolean}
   */
  this.executing_ = false;

  if (CancellablePromise.UNHANDLED_REJECTION_DELAY > 0) {
    /**
     * A timeout ID used when the {@code UNHANDLED_REJECTION_DELAY} is greater
     * than 0 milliseconds. The ID is set when the Promise is rejected, and
     * cleared only if an {@code onRejected} callback is invoked for the
     * Promise (or one of its descendants) before the delay is exceeded.
     *
     * If the rejection is not handled before the timeout completes, the
     * rejection reason is passed to the unhandled rejection handler.
     * @private {number}
     */
    this.unhandledRejectionId_ = 0;
  } else if (CancellablePromise.UNHANDLED_REJECTION_DELAY === 0) {
    /**
     * When the {@code UNHANDLED_REJECTION_DELAY} is set to 0 milliseconds, a
     * boolean that is set if the Promise is rejected, and reset to false if an
     * {@code onRejected} callback is invoked for the Promise (or one of its
     * descendants). If the rejection is not handled before the next timestep,
     * the rejection reason is passed to the unhandled rejection handler.
     * @private {boolean}
     */
    this.hadUnhandledRejection_ = false;
  }

  try {
    var self = this;
    resolver.call(
      opt_context, function(value) {
        self.resolve_(CancellablePromise.State_.FULFILLED, value);
      }, function(reason) {
        self.resolve_(CancellablePromise.State_.REJECTED, reason);
      });
  } catch (e) {
    this.resolve_(CancellablePromise.State_.REJECTED, e);
  }
};

/**
 * The delay in milliseconds before a rejected Promise's reason is passed to
 * the rejection handler. By default, the rejection handler rethrows the
 * rejection reason so that it appears in the developer console or
 * {@code window.onerror} handler.
 * Rejections are rethrown as quickly as possible by default. A negative value
 * disables rejection handling entirely.
 * @type {number}
 */
CancellablePromise.UNHANDLED_REJECTION_DELAY = 0;


/**
 * The possible internal states for a Promise. These states are not directly
 * observable to external callers.
 * @enum {number}
 * @private
 */
CancellablePromise.State_ = {
  /** The Promise is waiting for resolution. */
  PENDING: 0,

  /** The Promise is blocked waiting for the result of another Thenable. */
  BLOCKED: 1,

  /** The Promise has been resolved with a fulfillment value. */
  FULFILLED: 2,

  /** The Promise has been resolved with a rejection reason. */
  REJECTED: 3
};


/**
 * Typedef for entries in the callback chain. Each call to {@code then},
 * {@code thenCatch}, or {@code thenAlways} creates an entry containing the
 * functions that may be invoked once the Promise is resolved.
 *
 * @typedef {{
 *   child: CancellablePromise,
 *   onFulfilled: function(*),
 *   onRejected: function(*)
 * }}
 * @private
 */
CancellablePromise.CallbackEntry_ = null;


/**
 * @param {(TYPE|Thenable.<TYPE>|Thenable)=} opt_value
 * @return {!CancellablePromise.<TYPE>} A new Promise that is immediately resolved
 *     with the given value.
 * @template TYPE
 */
CancellablePromise.resolve = function(opt_value) {
  return new CancellablePromise(function(resolve) {
      resolve(opt_value);
    });
};


/**
 * @param {*=} opt_reason
 * @return {!CancellablePromise} A new Promise that is immediately rejected with the
 *     given reason.
 */
CancellablePromise.reject = function(opt_reason) {
  return new CancellablePromise(function(resolve, reject) {
      reject(opt_reason);
    });
};


/**
 * @param {!Array.<!(Thenable.<TYPE>|Thenable)>} promises
 * @return {!CancellablePromise.<TYPE>} A Promise that receives the result of the
 *     first Promise (or Promise-like) input to complete.
 * @template TYPE
 */
CancellablePromise.race = function(promises) {
  return new CancellablePromise(function(resolve, reject) {
      if (!promises.length) {
        resolve(undefined);
      }
      for (var i = 0, promise; (promise = promises[i]); i++) {
        promise.then(resolve, reject);
      }
    });
};


/**
 * @param {!Array.<!(Thenable.<TYPE>|Thenable)>} promises
 * @return {!CancellablePromise.<!Array.<TYPE>>} A Promise that receives a list of
 *     every fulfilled value once every input Promise (or Promise-like) is
 *     successfully fulfilled, or is rejected by the first rejection result.
 * @template TYPE
 */
CancellablePromise.all = function(promises) {
  return new CancellablePromise(function(resolve, reject) {
      var toFulfill = promises.length;
      var values = [];

      if (!toFulfill) {
        resolve(values);
        return;
      }

      var onFulfill = function(index, value) {
        toFulfill--;
        values[index] = value;
        if (toFulfill === 0) {
          resolve(values);
        }
      };

      var onReject = function(reason) {
        reject(reason);
      };

      for (var i = 0, promise; (promise = promises[i]); i++) {
        promise.then(partial(onFulfill, i), onReject);
      }
    });
};


/**
 * @param {!Array.<!(Thenable.<TYPE>|Thenable)>} promises
 * @return {!CancellablePromise.<TYPE>} A Promise that receives the value of
 *     the first input to be fulfilled, or is rejected with a list of every
 *     rejection reason if all inputs are rejected.
 * @template TYPE
 */
CancellablePromise.firstFulfilled = function(promises) {
  return new CancellablePromise(function(resolve, reject) {
      var toReject = promises.length;
      var reasons = [];

      if (!toReject) {
        resolve(undefined);
        return;
      }

      var onFulfill = function(value) {
        resolve(value);
      };

      var onReject = function(index, reason) {
        toReject--;
        reasons[index] = reason;
        if (toReject === 0) {
          reject(reasons);
        }
      };

      for (var i = 0, promise; (promise = promises[i]); i++) {
        promise.then(onFulfill, partial(onReject, i));
      }
    });
};


/**
 * Adds callbacks that will operate on the result of the Promise, returning a
 * new child Promise.
 *
 * If the Promise is fulfilled, the {@code onFulfilled} callback will be invoked
 * with the fulfillment value as argument, and the child Promise will be
 * fulfilled with the return value of the callback. If the callback throws an
 * exception, the child Promise will be rejected with the thrown value instead.
 *
 * If the Promise is rejected, the {@code onRejected} callback will be invoked
 * with the rejection reason as argument, and the child Promise will be rejected
 * with the return value (or thrown value) of the callback.
 *
 * @override
 */
CancellablePromise.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
  return this.addChildPromise_(
    isFunction(opt_onFulfilled) ? opt_onFulfilled : null,
    isFunction(opt_onRejected) ? opt_onRejected : null,
    opt_context);
};
Thenable.addImplementation(CancellablePromise);


/**
 * Adds a callback that will be invoked whether the Promise is fulfilled or
 * rejected. The callback receives no argument, and no new child Promise is
 * created. This is useful for ensuring that cleanup takes place after certain
 * asynchronous operations. Callbacks added with {@code thenAlways} will be
 * executed in the same order with other calls to {@code then},
 * {@code thenAlways}, or {@code thenCatch}.
 *
 * Since it does not produce a new child Promise, cancellation propagation is
 * not prevented by adding callbacks with {@code thenAlways}. A Promise that has
 * a cleanup handler added with {@code thenAlways} will be canceled if all of
 * its children created by {@code then} (or {@code thenCatch}) are canceled.
 *
 * @param {function(this:THIS): void} onResolved A function that will be invoked
 *     when the Promise is resolved.
 * @param {THIS=} opt_context An optional context object that will be the
 *     execution context for the callbacks. By default, functions are executed
 *     in the global scope.
 * @return {!CancellablePromise.<TYPE>} This Promise, for chaining additional calls.
 * @template THIS
 */
CancellablePromise.prototype.thenAlways = function(onResolved, opt_context) {
  var callback = function() {
    try {
      // Ensure that no arguments are passed to onResolved.
      onResolved.call(opt_context);
    } catch (err) {
      CancellablePromise.handleRejection_.call(null, err);
    }
  };

  this.addCallbackEntry_({
    child: null,
    onRejected: callback,
    onFulfilled: callback
  });
  return this;
};


/**
 * Adds a callback that will be invoked only if the Promise is rejected. This
 * is equivalent to {@code then(null, onRejected)}.
 *
 * @param {!function(this:THIS, *): *} onRejected A function that will be
 *     invoked with the rejection reason if the Promise is rejected.
 * @param {THIS=} opt_context An optional context object that will be the
 *     execution context for the callbacks. By default, functions are executed
 *     in the global scope.
 * @return {!CancellablePromise} A new Promise that will receive the result of the
 *     callback.
 * @template THIS
 */
CancellablePromise.prototype.thenCatch = function(onRejected, opt_context) {
  return this.addChildPromise_(null, onRejected, opt_context);
};

/**
 * Alias of {@link CancellablePromise.prototype.thenCatch}
 */
CancellablePromise.prototype.catch = CancellablePromise.prototype.thenCatch;


/**
 * Cancels the Promise if it is still pending by rejecting it with a cancel
 * Error. No action is performed if the Promise is already resolved.
 *
 * All child Promises of the canceled Promise will be rejected with the same
 * cancel error, as with normal Promise rejection. If the Promise to be canceled
 * is the only child of a pending Promise, the parent Promise will also be
 * canceled. Cancellation may propagate upward through multiple generations.
 *
 * @param {string=} opt_message An optional debugging message for describing the
 *     cancellation reason.
 */
CancellablePromise.prototype.cancel = function(opt_message) {
  if (this.state_ === CancellablePromise.State_.PENDING) {
    async.run(function() {
      var err = new CancellablePromise.CancellationError(opt_message);
      err.IS_CANCELLATION_ERROR = true;
      this.cancelInternal_(err);
    }, this);
  }
};


/**
 * Cancels this Promise with the given error.
 *
 * @param {!Error} err The cancellation error.
 * @private
 */
CancellablePromise.prototype.cancelInternal_ = function(err) {
  if (this.state_ === CancellablePromise.State_.PENDING) {
    if (this.parent_) {
      // Cancel the Promise and remove it from the parent's child list.
      this.parent_.cancelChild_(this, err);
    } else {
      this.resolve_(CancellablePromise.State_.REJECTED, err);
    }
  }
};


/**
 * Cancels a child Promise from the list of callback entries. If the Promise has
 * not already been resolved, reject it with a cancel error. If there are no
 * other children in the list of callback entries, propagate the cancellation
 * by canceling this Promise as well.
 *
 * @param {!CancellablePromise} childPromise The Promise to cancel.
 * @param {!Error} err The cancel error to use for rejecting the Promise.
 * @private
 */
CancellablePromise.prototype.cancelChild_ = function(childPromise, err) {
  if (!this.callbackEntries_) {
    return;
  }
  var childCount = 0;
  var childIndex = -1;

  // Find the callback entry for the childPromise, and count whether there are
  // additional child Promises.
  for (var i = 0, entry; (entry = this.callbackEntries_[i]); i++) {
    var child = entry.child;
    if (child) {
      childCount++;
      if (child === childPromise) {
        childIndex = i;
      }
      if (childIndex >= 0 && childCount > 1) {
        break;
      }
    }
  }

  // If the child Promise was the only child, cancel this Promise as well.
  // Otherwise, reject only the child Promise with the cancel error.
  if (childIndex >= 0) {
    if (this.state_ === CancellablePromise.State_.PENDING && childCount === 1) {
      this.cancelInternal_(err);
    } else {
      var callbackEntry = this.callbackEntries_.splice(childIndex, 1)[0];
      this.executeCallback_(
        callbackEntry, CancellablePromise.State_.REJECTED, err);
    }
  }
};


/**
 * Adds a callback entry to the current Promise, and schedules callback
 * execution if the Promise has already been resolved.
 *
 * @param {CancellablePromise.CallbackEntry_} callbackEntry Record containing
 *     {@code onFulfilled} and {@code onRejected} callbacks to execute after
 *     the Promise is resolved.
 * @private
 */
CancellablePromise.prototype.addCallbackEntry_ = function(callbackEntry) {
  if ((!this.callbackEntries_ || !this.callbackEntries_.length) &&
    (this.state_ === CancellablePromise.State_.FULFILLED ||
    this.state_ === CancellablePromise.State_.REJECTED)) {
    this.scheduleCallbacks_();
  }
  if (!this.callbackEntries_) {
    this.callbackEntries_ = [];
  }
  this.callbackEntries_.push(callbackEntry);
};


/**
 * Creates a child Promise and adds it to the callback entry list. The result of
 * the child Promise is determined by the state of the parent Promise and the
 * result of the {@code onFulfilled} or {@code onRejected} callbacks as
 * specified in the Promise resolution procedure.
 *
 * @see http://promisesaplus.com/#the__method
 *
 * @param {?function(this:THIS, TYPE):
 *          (RESULT|CancellablePromise.<RESULT>|Thenable)} onFulfilled A callback that
 *     will be invoked if the Promise is fullfilled, or null.
 * @param {?function(this:THIS, *): *} onRejected A callback that will be
 *     invoked if the Promise is rejected, or null.
 * @param {THIS=} opt_context An optional execution context for the callbacks.
 *     in the default calling context.
 * @return {!CancellablePromise} The child Promise.
 * @template RESULT,THIS
 * @private
 */
CancellablePromise.prototype.addChildPromise_ = function(
onFulfilled, onRejected, opt_context) {

  var callbackEntry = {
    child: null,
    onFulfilled: null,
    onRejected: null
  };

  callbackEntry.child = new CancellablePromise(function(resolve, reject) {
    // Invoke onFulfilled, or resolve with the parent's value if absent.
    callbackEntry.onFulfilled = onFulfilled ? function(value) {
      try {
        var result = onFulfilled.call(opt_context, value);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    } : resolve;

    // Invoke onRejected, or reject with the parent's reason if absent.
    callbackEntry.onRejected = onRejected ? function(reason) {
      try {
        var result = onRejected.call(opt_context, reason);
        if (!isDef(result) && reason.IS_CANCELLATION_ERROR) {
          // Propagate cancellation to children if no other result is returned.
          reject(reason);
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    } : reject;
  });

  callbackEntry.child.parent_ = this;
  this.addCallbackEntry_(
    /** @type {CancellablePromise.CallbackEntry_} */ (callbackEntry));
  return callbackEntry.child;
};


/**
 * Unblocks the Promise and fulfills it with the given value.
 *
 * @param {TYPE} value
 * @private
 */
CancellablePromise.prototype.unblockAndFulfill_ = function(value) {
  if (this.state_ !== CancellablePromise.State_.BLOCKED) {
    throw new Error('CancellablePromise is not blocked.');
  }
  this.state_ = CancellablePromise.State_.PENDING;
  this.resolve_(CancellablePromise.State_.FULFILLED, value);
};


/**
 * Unblocks the Promise and rejects it with the given rejection reason.
 *
 * @param {*} reason
 * @private
 */
CancellablePromise.prototype.unblockAndReject_ = function(reason) {
  if (this.state_ !== CancellablePromise.State_.BLOCKED) {
    throw new Error('CancellablePromise is not blocked.');
  }
  this.state_ = CancellablePromise.State_.PENDING;
  this.resolve_(CancellablePromise.State_.REJECTED, reason);
};


/**
 * Attempts to resolve a Promise with a given resolution state and value. This
 * is a no-op if the given Promise has already been resolved.
 *
 * If the given result is a Thenable (such as another Promise), the Promise will
 * be resolved with the same state and result as the Thenable once it is itself
 * resolved.
 *
 * If the given result is not a Thenable, the Promise will be fulfilled or
 * rejected with that result based on the given state.
 *
 * @see http://promisesaplus.com/#the_promise_resolution_procedure
 *
 * @param {CancellablePromise.State_} state
 * @param {*} x The result to apply to the Promise.
 * @private
 */
CancellablePromise.prototype.resolve_ = function(state, x) {
  if (this.state_ !== CancellablePromise.State_.PENDING) {
    return;
  }

  if (this === x) {
    state = CancellablePromise.State_.REJECTED;
    x = new TypeError('CancellablePromise cannot resolve to itself');

  } else if (Thenable.isImplementedBy(x)) {
    x = /** @type {!Thenable} */ (x);
    this.state_ = CancellablePromise.State_.BLOCKED;
    x.then(this.unblockAndFulfill_, this.unblockAndReject_, this);
    return;

  } else if (isObject(x)) {
    try {
      var then = x.then;
      if (isFunction(then)) {
        this.tryThen_(x, then);
        return;
      }
    } catch (e) {
      state = CancellablePromise.State_.REJECTED;
      x = e;
    }
  }

  this.result_ = x;
  this.state_ = state;
  this.scheduleCallbacks_();

  if (state === CancellablePromise.State_.REJECTED && !x.IS_CANCELLATION_ERROR) {
    CancellablePromise.addUnhandledRejection_(this, x);
  }
};


/**
 * Attempts to call the {@code then} method on an object in the hopes that it is
 * a Promise-compatible instance. This allows interoperation between different
 * Promise implementations, however a non-compliant object may cause a Promise
 * to hang indefinitely. If the {@code then} method throws an exception, the
 * dependent Promise will be rejected with the thrown value.
 *
 * @see http://promisesaplus.com/#point-70
 *
 * @param {Thenable} thenable An object with a {@code then} method that may be
 *     compatible with the Promise/A+ specification.
 * @param {!Function} then The {@code then} method of the Thenable object.
 * @private
 */
CancellablePromise.prototype.tryThen_ = function(thenable, then) {
  this.state_ = CancellablePromise.State_.BLOCKED;
  var promise = this;
  var called = false;

  var resolve = function(value) {
    if (!called) {
      called = true;
      promise.unblockAndFulfill_(value);
    }
  };

  var reject = function(reason) {
    if (!called) {
      called = true;
      promise.unblockAndReject_(reason);
    }
  };

  try {
    then.call(thenable, resolve, reject);
  } catch (e) {
    reject(e);
  }
};


/**
 * Executes the pending callbacks of a resolved Promise after a timeout.
 *
 * Section 2.2.4 of the Promises/A+ specification requires that Promise
 * callbacks must only be invoked from a call stack that only contains Promise
 * implementation code, which we accomplish by invoking callback execution after
 * a timeout. If {@code startExecution_} is called multiple times for the same
 * Promise, the callback chain will be evaluated only once. Additional callbacks
 * may be added during the evaluation phase, and will be executed in the same
 * event loop.
 *
 * All Promises added to the waiting list during the same browser event loop
 * will be executed in one batch to avoid using a separate timeout per Promise.
 *
 * @private
 */
CancellablePromise.prototype.scheduleCallbacks_ = function() {
  if (!this.executing_) {
    this.executing_ = true;
    async.run(this.executeCallbacks_, this);
  }
};


/**
 * Executes all pending callbacks for this Promise.
 *
 * @private
 */
CancellablePromise.prototype.executeCallbacks_ = function() {
  while (this.callbackEntries_ && this.callbackEntries_.length) {
    var entries = this.callbackEntries_;
    this.callbackEntries_ = [];

    for (var i = 0; i < entries.length; i++) {
      this.executeCallback_(entries[i], this.state_, this.result_);
    }
  }
  this.executing_ = false;
};


/**
 * Executes a pending callback for this Promise. Invokes an {@code onFulfilled}
 * or {@code onRejected} callback based on the resolved state of the Promise.
 *
 * @param {!CancellablePromise.CallbackEntry_} callbackEntry An entry containing the
 *     onFulfilled and/or onRejected callbacks for this step.
 * @param {CancellablePromise.State_} state The resolution status of the Promise,
 *     either FULFILLED or REJECTED.
 * @param {*} result The resolved result of the Promise.
 * @private
 */
CancellablePromise.prototype.executeCallback_ = function(
callbackEntry, state, result) {
  if (state === CancellablePromise.State_.FULFILLED) {
    callbackEntry.onFulfilled(result);
  } else {
    this.removeUnhandledRejection_();
    callbackEntry.onRejected(result);
  }
};


/**
 * Marks this rejected Promise as having being handled. Also marks any parent
 * Promises in the rejected state as handled. The rejection handler will no
 * longer be invoked for this Promise (if it has not been called already).
 *
 * @private
 */
CancellablePromise.prototype.removeUnhandledRejection_ = function() {
  var p;
  if (CancellablePromise.UNHANDLED_REJECTION_DELAY > 0) {
    for (p = this; p && p.unhandledRejectionId_; p = p.parent_) {
      clearTimeout(p.unhandledRejectionId_);
      p.unhandledRejectionId_ = 0;
    }
  } else if (CancellablePromise.UNHANDLED_REJECTION_DELAY === 0) {
    for (p = this; p && p.hadUnhandledRejection_; p = p.parent_) {
      p.hadUnhandledRejection_ = false;
    }
  }
};


/**
 * Marks this rejected Promise as unhandled. If no {@code onRejected} callback
 * is called for this Promise before the {@code UNHANDLED_REJECTION_DELAY}
 * expires, the reason will be passed to the unhandled rejection handler. The
 * handler typically rethrows the rejection reason so that it becomes visible in
 * the developer console.
 *
 * @param {!CancellablePromise} promise The rejected Promise.
 * @param {*} reason The Promise rejection reason.
 * @private
 */
CancellablePromise.addUnhandledRejection_ = function(promise, reason) {
  if (CancellablePromise.UNHANDLED_REJECTION_DELAY > 0) {
    promise.unhandledRejectionId_ = setTimeout(function() {
      CancellablePromise.handleRejection_.call(null, reason);
    }, CancellablePromise.UNHANDLED_REJECTION_DELAY);

  } else if (CancellablePromise.UNHANDLED_REJECTION_DELAY === 0) {
    promise.hadUnhandledRejection_ = true;
    async.run(function() {
      if (promise.hadUnhandledRejection_) {
        CancellablePromise.handleRejection_.call(null, reason);
      }
    });
  }
};


/**
 * A method that is invoked with the rejection reasons for Promises that are
 * rejected but have no {@code onRejected} callbacks registered yet.
 * @type {function(*)}
 * @private
 */
CancellablePromise.handleRejection_ = async.throwException;


/**
 * Sets a handler that will be called with reasons from unhandled rejected
 * Promises. If the rejected Promise (or one of its descendants) has an
 * {@code onRejected} callback registered, the rejection will be considered
 * handled, and the rejection handler will not be called.
 *
 * By default, unhandled rejections are rethrown so that the error may be
 * captured by the developer console or a {@code window.onerror} handler.
 *
 * @param {function(*)} handler A function that will be called with reasons from
 *     rejected Promises. Defaults to {@code async.throwException}.
 */
CancellablePromise.setUnhandledRejectionHandler = function(handler) {
  CancellablePromise.handleRejection_ = handler;
};



/**
 * Error used as a rejection reason for canceled Promises.
 *
 * @param {string=} opt_message
 * @constructor
 * @extends {Error}
 * @final
 */
CancellablePromise.CancellationError = class extends Error {
  constructor(opt_message) {
     super(opt_message);

     if (opt_message) {
       this.message = opt_message;
     }
   }
};

/** @override */
CancellablePromise.CancellationError.prototype.name = 'cancel';

class Ajax {

	/**
	 * XmlHttpRequest's getAllResponseHeaders() method returns a string of
	 * response headers according to the format described on the spec:
	 * {@link http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method}.
	 * This method parses that string into a user-friendly name/value pair
	 * object.
	 * @param {string} allHeaders All headers as string.
	 * @return {!Array.<Object<string, string>>}
	 */
	static parseResponseHeaders(allHeaders) {
		var headers = [];
		if (!allHeaders) {
			return headers;
		}
		var pairs = allHeaders.split('\u000d\u000a');
		for (var i = 0; i < pairs.length; i++) {
			var index = pairs[i].indexOf('\u003a\u0020');
			if (index > 0) {
				var name = pairs[i].substring(0, index);
				var value = pairs[i].substring(index + 2);
				headers.push({
					name: name,
					value: value
				});
			}
		}
		return headers;
	}

	/**
	 * Requests the url using XMLHttpRequest.
	 * @param {!string} url
	 * @param {!string} method
	 * @param {?string} body
	 * @param {MultiMap=} opt_headers
	 * @param {MultiMap=} opt_params
	 * @param {number=} opt_timeout
	 * @param {boolean=} opt_sync
	 * @param {boolean=} opt_withCredentials
	 * @return {Promise} Deferred ajax request.
	 * @protected
	 */
	static request(url, method, body, opt_headers, opt_params, opt_timeout, opt_sync, opt_withCredentials) {
		url = url || '';
		method = method || 'GET';

		var request = new XMLHttpRequest();

		var promise = new CancellablePromise(function(resolve, reject) {
			request.onload = function() {
				if (request.aborted) {
					request.onerror();
					return;
				}
				resolve(request);
			};
			request.onerror = function() {
				var error = new Error('Request error');
				error.request = request;
				reject(error);
			};
		}).thenCatch(function(reason) {
			request.abort();
			throw reason;
		}).thenAlways(function() {
			clearTimeout(timeout);
		});

		if (opt_params) {
			url = new Uri(url).addParametersFromMultiMap(opt_params).toString();
		}

		request.open(method, url, !opt_sync);

		if (opt_withCredentials) {
			request.withCredentials = true;
		}

		if (opt_headers) {
			opt_headers.names().forEach(function(name) {
				request.setRequestHeader(name, opt_headers.getAll(name).join(', '));
			});
		}

		request.send(isDef(body) ? body : null);

		if (isDefAndNotNull(opt_timeout)) {
			var timeout = setTimeout(function() {
				promise.cancel('Request timeout');
			}, opt_timeout);
		}

		return promise;
	}

}

/**
 * Provides a convenient interface for data transport.
 * @interface
 */
class Transport {

	/**
	 * Sends a message for the specified client.
	 * @param {!ClientRequest} clientRequest
	 * @return {!Promise} Deferred request.
	 */
	send() {}

}

/**
 * Represents a client message (e.g. a request or a response).
 */
class ClientMessage {
	constructor() {
		this.headers_ = new MultiMap();
	}

	/**
	 * Fluent getter and setter for request body.
	 * @param {*=} opt_body Request body to be set. If none is given,
	 *   the current value of the body will be returned.
	 * @return {*} Returns request body if no body value was given. Otherwise
	 *   returns the {@link ClientMessage} object itself, so calls can be chained.
	 * @chainable Chainable when used as setter.
	 */
	body(opt_body) {
		if (isDef(opt_body)) {
			this.body_ = opt_body;
			return this;
		}
		return this.body_;
	}

	/**
	 * Adds a header. If a header with the same name already exists, it will not be
	 * overwritten, but the new value will be stored as well. The order is preserved.
	 * @param {string} name
	 * @param {string} value
	 * @chainable
	 */
	header(name, value) {
		if (arguments.length !== 2) {
			throw new Error('Invalid arguments');
		}
		this.headers_.set(name, value);
		return this;
	}

	/**
	 * Fluent getter and setter for request headers.
	 * @param {MultiMap|Object=} opt_headers Request headers list to
	 *   be set. If none is given the current value of the headers will
	 *   be returned.
	 * @return {!MultiMap|ClientMessage} Returns map of request headers
	 *   if no new value was given. Otherwise returns the {@link ClientMessage}
	 *   object itself, so calls can be chained.
	 * @chainable Chainable when used as setter.
	 */
	headers(opt_headers) {
		if (isDef(opt_headers)) {
			if (opt_headers instanceof MultiMap) {
				this.headers_ = opt_headers;
			} else {
				this.headers_.values = opt_headers;
			}
			return opt_headers;
		}
		return this.headers_;
	}

	/**
	 * Removes the body.
	 */
	removeBody() {
		this.body_ = undefined;
	}
}

/**
 * Represents a client response object.
 * @extends {ClientMessage}
 */
class ClientResponse extends ClientMessage {
	constructor(clientRequest) {
		super();
		if (!clientRequest) {
			throw new Error('Can\'t create response without request');
		}
		this.clientRequest_ = clientRequest;
	}

	/**
	 * Returns request that created this response.
	 * @return {!ClientRequest}
	 */
	request() {
		return this.clientRequest_;
	}

	/**
	 * Fluent getter and setter for response status code.
	 * @param {number=} opt_statusCode Request status code to be set. If none is given,
	 *   the current status code value will be returned.
	 * @return {!ClientMessage|number} Returns response status code if no new value was
	 *   given. Otherwise returns the {@link ClientMessage} object itself, so calls can
	 *   be chained.
	 * @chainable Chainable when used as setter.
	 */
	statusCode(opt_statusCode) {
		if (isDef(opt_statusCode)) {
			this.statusCode_ = opt_statusCode;
			return this;
		}
		return this.statusCode_;
	}

	/**
	 * Fluent getter and setter for response status text.
	 * @param {string=} opt_statusText Request status text to be set. If none is given,
	 *   the current status text value will be returned.
	 * @return {!ClientMessage|number} Returns response status text if no new value was
	 *   given. Otherwise returns the {@link ClientMessage} object itself, so calls can
	 *   be chained.
	 * @chainable Chainable when used as setter.
	 */
	statusText(opt_statusText) {
		if (isDef(opt_statusText)) {
			this.statusText_ = opt_statusText;
			return this;
		}
		return this.statusText_;
	}

	/**
	 * Checks if response succeeded. Any status code 2xx or 3xx is considered valid.
	 * @return {boolean}
	 */
	succeeded() {
		return this.statusCode() >= 200 && this.statusCode() <= 399;
	}

}

/**
 * The implementation of an ajax transport to be used with {@link WeDeploy}.
 * @extends {Transport}
 */
class AjaxTransport extends Transport {
	/**
	 * @inheritDoc
	 */
	send(clientRequest) {
		var deferred = Ajax.request(
			clientRequest.url(), clientRequest.method(), clientRequest.body(),
			clientRequest.headers(), clientRequest.params(), null, false, clientRequest.withCredentials());

		return deferred.then(function(response) {
			var clientResponse = new ClientResponse(clientRequest);
			clientResponse.body(response.responseText);
			clientResponse.statusCode(response.status);
			clientResponse.statusText(response.statusText);
			Ajax.parseResponseHeaders(response.getAllResponseHeaders()).forEach(function(header) {
				clientResponse.header(header.name, header.value);
			});
			return clientResponse;
		});
	}
}

/**
 * Provides a factory for data transport.
 */
class TransportFactory {
	constructor() {
		this.transports = {};
		this.transports[TransportFactory.DEFAULT_TRANSPORT_NAME] = TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME];
	}

	/**
	 * Returns {@link TransportFactory} instance.
	 */
	static instance() {
		if (!TransportFactory.instance_) {
			TransportFactory.instance_ = new TransportFactory();
		}
		return TransportFactory.instance_;
	}

	/**
	 * Gets an instance of the transport implementation with the given name.
	 * @param {string} implementationName
	 * @return {!Transport}
	 */
	get(implementationName) {
		var TransportClass = this.transports[implementationName];

		if (!TransportClass) {
			throw new Error('Invalid transport name: ' + implementationName);
		}

		try {
			return new (TransportClass)();
		} catch (err) {
			throw new Error('Can\'t create transport', err);
		}
	}

	/**
	 * Returns the default transport implementation.
	 * @return {!Transport}
	 */
	getDefault() {
		return this.get(TransportFactory.DEFAULT_TRANSPORT_NAME);
	}
}

TransportFactory.DEFAULT_TRANSPORT_NAME = 'default';

TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME] = AjaxTransport;

/**
 * Represents a client request object.
 * @extends {ClientMessage}
 */
class ClientRequest extends ClientMessage {
	constructor() {
		super();
		this.params_ = new MultiMap();
		this.withCredentials_ = true;
	}

	/**
	 * Fluent getter and setter for with credentials option.
	 * @param {boolean=} opt_withCredentials
	 * @chainable Chainable when used as setter.
	 */
	withCredentials(opt_withCredentials) {
		if (isDef(opt_withCredentials)) {
			this.withCredentials_ = !!opt_withCredentials;
			return this;
		}
		return this.withCredentials_;
	}

	/**
	 * Fluent getter and setter for request method.
	 * @param {string=} opt_method Request method to be set. If none is given,
	 *   the current method value will be returned.
	 * @return {!ClientMessage|string} Returns request method if no new value was
	 *   given. Otherwise returns the {@link ClientMessage} object itself, so
	 *   calls can be chained.
	 * @chainable Chainable when used as setter.
	 */
	method(opt_method) {
		if (isDef(opt_method)) {
			this.method_ = opt_method;
			return this;
		}
		return this.method_ || ClientRequest.DEFAULT_METHOD;
	}

	/**
	 * Adds a query. If a query with the same name already exists, it will not
	 * be overwritten, but new value will be stored as well. The order is preserved.
	 * @param {string} name
	 * @param {string} value
	 * @chainable
	 */
	param(name, value) {
		if (arguments.length !== 2) {
			throw new Error('Invalid arguments');
		}
		this.params_.set(name, value);
		return this;
	}

	/**
	 * Fluent getter and setter for request querystring.
	 * @param {MultiMap|Object=} opt_params Request querystring map to be set.
	 *   If none is given the current value of the params will be returned.
	 * @return {!MultiMap|ClientMessage} Returns map of request querystring if
	 *   no new value was given. Otherwise returns the {@link ClientMessage}
	 *   object itself, so calls can be chained.
	 */
	params(opt_params) {
		if (isDef(opt_params)) {
			if (opt_params instanceof MultiMap) {
				this.params_ = opt_params;
			} else {
				this.params_.values = opt_params;
			}
			return opt_params;
		}
		return this.params_;
	}

	/**
	 * Fluent getter and setter for request url.
	 * @param {string=} opt_url Request url to be set. If none is given,
	 *   the current value of the url will be returned.
	 * @return {!ClientMessage|string} Returns request url if no new value was given.
	 *   Otherwise returns the {@link ClientMessage} object itself, so calls can be
	 *   chained.
	 * @chainable Chainable when used as setter.
	 */
	url(opt_url) {
		if (isDef(opt_url)) {
			this.url_ = opt_url;
			return this;
		}
		return this.url_;
	}

}

ClientRequest.DEFAULT_METHOD = 'GET';

var io;

// Optimistic initialization of `io` reference from global `globals.window.io`.
if (typeof globals.window !== 'undefined') {
	io = globals.window.io;
}

/**
 * The main class for making api requests. Sending requests returns a promise
 * that is resolved when the response arrives. Usage example:
 * ```javascript
 * WeDeploy
 *   .url('/data/tasks')
 *   .post({desc: 'Buy milkl'})
 *   .then(function(response) {
 *     // Handle response here.
 *     console.log(response.body())
 *   });
 * ```
 */
class WeDeploy$1 {
	/**
	 * WeDeploy constructor function.
	 * @param {string} url The base url.
	 * @param {...string} paths Any amount of paths to be appended to the base
	 * url.
	 * @constructor
	 */
	constructor(url, ...paths) {
		if (arguments.length === 0) {
			throw new Error('Invalid arguments, try `new WeDeploy(baseUrl, url)`');
		}

		this.auth_ = null;
		this.body_ = null;
		this.url_ = Uri.joinPaths(url || '', ...paths);
		this.headers_ = new MultiMap();
		this.params_ = new MultiMap();
		this.withCredentials_ = true;

		this.header('Content-Type', 'application/json');
		this.header('X-Requested-With', 'XMLHttpRequest');
	}

	/**
	 * Static factory for creating WeDeploy data for the given url.
	 * @param {string=} opt_dataUrl The url that points to the data services.
	 * @return @return {data} WeDeploy data instance.
	 */
	static data(opt_dataUrl) {
		assertUriWithNoPath(opt_dataUrl, 'The data url should not have a path');

		if (isString(opt_dataUrl)) {
			WeDeploy$1.dataUrl_ = opt_dataUrl;
		}

		let data = new DataApiHelper(WeDeploy$1);

		data.auth(WeDeploy$1.auth().currentUser);

		return data;
	}

	/**
	 * Adds authorization information to this request.
	 * @param {!Auth|string} authOrTokenOrEmail Either an {@link Auth} instance,
	 * an authorization token, or the email.
	 * @param {string=} opt_password If a email is given as the first param,
	 * this should be the password.
	 * @chainable
	 */
	auth(authOrTokenOrEmail, opt_password) {
		this.auth_ = authOrTokenOrEmail;
		if (!(this.auth_ instanceof Auth)) {
			this.auth_ = Auth.create(authOrTokenOrEmail, opt_password);
		}
		return this;
	}

	/**
	 * Static factory for creating WeDeploy auth for the given url.
	 * @param {string=} opt_authUrl The url that points to the auth service.
	 */
	static auth(opt_authUrl) {
		if (isString(opt_authUrl)) {
			WeDeploy$1.authUrl_ = opt_authUrl;
		}
		if (!WeDeploy$1.auth_) {
			WeDeploy$1.auth_ = new AuthApiHelper(WeDeploy$1);
		}
		return WeDeploy$1.auth_;
	}

	/**
	 * Sets the body that will be sent with this request.
	 * @param {*} body
	 * @chainable
	 */
	body(body) {
		this.body_ = body;
		return this;
	}

	/**
	 * Converts the given body object to query params.
	 * @param {!ClientRequest} clientRequest Client request.
	 * @param {*} body
	 * @protected
	 */
	convertBodyToParams_(clientRequest, body) {
		if (isString(body)) {
			body = {
				body: body
			};
		} else if (body instanceof Embodied) {
			body = body.body();
		}
		Object.keys(body || {}).forEach(name => clientRequest.param(name, body[name]));
	}

	/**
	 * Creates client request and encode.
	 * @param {string} method
	 * @param {*} body
	 * @return {!ClientRequest} Client request.
	 * @protected
	 */
	createClientRequest_(method, body) {
		const clientRequest = new ClientRequest();

		clientRequest.body(body || this.body_);

		if (!isDefAndNotNull(clientRequest.body())) {
			if (this.formData_) {
				clientRequest.body(this.formData_);
			}
		}

		clientRequest.method(method);
		clientRequest.headers(this.headers());
		clientRequest.params(this.params());
		clientRequest.url(this.url());
		clientRequest.withCredentials(this.withCredentials_);

		this.encode(clientRequest);

		return clientRequest;
	}

	/**
	 * Decodes clientResponse body, parsing the body for example.
	 * @param {!ClientResponse} clientResponse The response object to be
	 * decoded.
	 * @return {!ClientResponse} The decoded response.
	 */
	decode(clientResponse) {
		if (WeDeploy$1.isContentTypeJson(clientResponse)) {
			try {
				clientResponse.body(JSON.parse(clientResponse.body()));
			} catch (err) {}
		}
		return clientResponse;
	}

	/**
	 * Sends message with the DELETE http verb.
	 * @param {string=} opt_body Content to be sent as the request's body.
	 * @return {!CancellablePromise}
	 */
	delete(opt_body) {
		return this.sendAsync('DELETE', opt_body);
	}

	/**
	 * Encodes the given {@link ClientRequest}, converting its body to an
	 * appropriate format for example.
	 * @param {!ClientRequest} clientRequest The request object to encode.
	 * @return {!ClientRequest} The encoded request.
	 */
	encode(clientRequest) {
		let body = clientRequest.body();

		if (isElement(body)) {
			body = new FormData(body);
			clientRequest.body(body);
		}

		body = this.maybeWrapWithQuery_(body);
		if (clientRequest.method() === 'GET') {
			this.convertBodyToParams_(clientRequest, body);
			clientRequest.removeBody();
			body = null;
		}

		if (typeof FormData !== 'undefined' && body instanceof FormData) {
			clientRequest.headers().remove('content-type');
		} else if (body instanceof Embodied) {
			clientRequest.body(body.toString());
		} else if (WeDeploy$1.isContentTypeJson(clientRequest)) {
			clientRequest.body(JSON.stringify(clientRequest.body()));
		}

		this.encodeParams_(clientRequest);
		this.resolveAuthentication_(clientRequest);

		return clientRequest;
	}

	/**
	 * Encodes the params for the given request, according to their types.
	 * @param {!ClientRequest} clientRequest
	 * @protected
	 */
	encodeParams_(clientRequest) {
		let params = clientRequest.params();
		params.names().forEach(function(name) {
			let values = params.getAll(name);
			values.forEach(function(value, index) {
				if (value instanceof Embodied) {
					value = value.toString();
				} else if (isObject(value) || (value instanceof Array)) {
					value = JSON.stringify(value);
				}
				values[index] = value;
			});
		});
	}

	/**
	 * Adds a key/value pair to be sent via the body in a `multipart/form-data` format.
	 * If the body is set by other means (for example, through the `body` method), this
	 * will be ignored.
	 * @param {string} name
	 * @param {*} value
	 * @chainable
	 */
	form(name, value) {
		if (typeof FormData === 'undefined') {
			throw new Error('form() is only available when FormData API is available.');
		}

		if (!this.formData_) {
			this.formData_ = new FormData();
		}
		this.formData_.append(name, value);
		return this;
	}

	/**
	 * Sends message with the GET http verb.
	 * @param {*=} opt_params Params to be added to the request url.
	 * @return {!CancellablePromise}
	 */
	get(opt_params) {
		return this.sendAsync('GET', opt_params);
	}

	/**
	 * Adds a header. If the header with the same name already exists, it will
	 * not be overwritten, but new value will be stored. The order is preserved.
	 * @param {string} name Header key.
	 * @param {*} value Header value.
	 * @chainable
	 */
	header(name, value) {
		if (arguments.length !== 2) {
			throw new Error('Invalid arguments');
		}
		this.headers_.set(name, value);
		return this;
	}

	/**
	 * Gets the headers.
	 * @return {!MultiMap}
	 */
	headers() {
		return this.headers_;
	}

	/**
	 * Wraps the given `Embodied` instance with a {@link Query} instance if needed.
	 * @param {Embodied} embodied
	 * @return {Embodied}
	 * @protected
	 */
	maybeWrapWithQuery_(embodied) {
		if (embodied instanceof Filter) {
			embodied = Query.filter(embodied);
		}
		return embodied;
	}

	/**
	 * Adds a query. If the query with the same name already exists, it will not
	 * be overwritten, but new value will be stored. The order is preserved.
	 * @param {string} name Param key.
	 * @param {*} value Param value.
	 * @chainable
	 */
	param(name, value) {
		if (arguments.length !== 2) {
			throw new Error('Invalid arguments');
		}
		this.params_.set(name, value);
		return this;
	}

	/**
	 * Gets the query strings map.
	 * @return {!MultiMap}
	 */
	params() {
		return this.params_;
	}

	/**
	 * Sends message with the PATCH http verb.
	 * @param {string=} opt_body Content to be sent as the request's body.
	 * @return {!CancellablePromise}
	 */
	patch(opt_body) {
		return this.sendAsync('PATCH', opt_body);
	}

	/**
	 * Creates a new {@link WeDeploy} instance for handling the url resulting in the
	 * union of the current url with the given paths.
	 * @param {...string} paths Any number of paths.
	 * @return {!WeDeploy} A new {@link WeDeploy} instance for handling the given paths.
	 */
	path(...paths) {
		return new WeDeploy$1(this.url(), ...paths).use(this.customTransport_);
	}

	/**
	 * Sends message with the POST http verb.
	 * @param {string=} opt_body Content to be sent as the request's body.
	 * @return {!CancellablePromise}
	 */
	post(opt_body) {
		return this.sendAsync('POST', opt_body);
	}

	/**
	 * Sends message with the PUT http verb.
	 * @param {string=} opt_body Content to be sent as the request's body.
	 * @return {!CancellablePromise}
	 */
	put(opt_body) {
		return this.sendAsync('PUT', opt_body);
	}

	/**
	 * Adds the authentication information to the request.
	 * @param {!ClientRequest} clientRequest
	 * @protected
	 */
	resolveAuthentication_(clientRequest) {
		if (!this.auth_) {
			return;
		}
		if (this.auth_.hasToken()) {
			clientRequest.header('Authorization', 'Bearer ' + this.auth_.token);
		} else {
			const credentials = this.auth_.email + ':' + this.auth_.password;
			clientRequest.header('Authorization', 'Basic ' + Base64.encodeString(credentials));
		}
	}

	/**
	 * Uses transport to send request with given method name and body
	 * asynchronously.
	 * @param {string} method The HTTP method to be used when sending data.
	 * @param {string} body Content to be sent as the request's body.
	 * @return {!CancellablePromise} Deferred request.
	 */
	sendAsync(method, body) {
		const transport = this.customTransport_ || TransportFactory.instance().getDefault();

		const clientRequest = this.createClientRequest_(method, body);

		return transport.send(clientRequest).then(this.decode);
	}

	/**
	 * Sets the socket transport
	 * @param {Object} socket implementation object.
	 */
	static socket(socket) {
		io = socket;
	}

	/**
	 * Static factory for creating WeDeploy client for the given url.
	 * @param {string} url The url that the client should use for sending requests.
	 */
	static url(url) {
		return new WeDeploy$1(url).use(this.customTransport_);
	}

	/**
	 * Returns the URL used by this client.
	 */
	url() {
		return this.url_;
	}

	/**
	 * Specifies {@link Transport} implementation.
	 * @param {!Transport} transport The transport implementation that should be
	 * used.
	 */
	use(transport) {
		this.customTransport_ = transport;
		return this;
	}

	/**
	 * Creates new socket.io instance. The parameters passed to socket.io
	 * constructor will be provided:
	 *
	 * ```javascript
	 * WeDeploy.url('http://domain:8080/path/a').watch({id: 'myId'}, {foo: true});
	 * // Equals:
	 * io('domain:8080/?url=path%2Fa%3Fid%3DmyId', {foo: true});
	 * ```
	 *
	 * @param {Object=} opt_params Params to be sent with the Socket IO request.
	 * @param {Object=} opt_options Object with Socket IO options.
	 * @return {!io} Socket IO reference. Server events can be listened on it.
	 */
	watch(opt_params, opt_options) {
		if (typeof io === 'undefined') {
			throw new Error('Socket.io client not loaded');
		}

		const clientRequest = this.createClientRequest_('GET', opt_params);
		const uri = new Uri(clientRequest.url());
		uri.addParametersFromMultiMap(clientRequest.params());

		opt_options = opt_options || {
			forceNew: true
		};
		opt_options.query = 'url=' + encodeURIComponent(uri.getPathname() + uri.getSearch());
		opt_options.path = opt_options.path || uri.getPathname();

		return io(uri.getHost(), opt_options);
	}

	/**
	 * @param {boolean} opt_withCredentials
	 */
	withCredentials(withCredentials) {
		this.withCredentials_ = !!withCredentials;
		return this;
	}
}

WeDeploy$1.isContentTypeJson = function(clientMessage) {
	const contentType = clientMessage.headers().get('content-type') || '';
	return contentType.indexOf('application/json') === 0;
};

WeDeploy$1.auth_ = null;
WeDeploy$1.authUrl_ = '';
WeDeploy$1.data_ = null;
WeDeploy$1.dataUrl_ = '';

globals.window.Filter = Filter;
globals.window.Geo = Geo;
globals.window.Query = Query;
globals.window.Range = Range;
globals.window.WeDeploy = WeDeploy$1;

export { Filter, Geo, Query, Range, WeDeploy$1 as WeDeploy };export default WeDeploy$1;

//# sourceMappingURL=api.js.map
