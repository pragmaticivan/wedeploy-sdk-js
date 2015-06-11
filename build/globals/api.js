this.launchpad = {};
this.launchpadNamed = {};
(function (global) {
  var babelHelpers = global.babelHelpers = {};

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  babelHelpers.createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  babelHelpers.get = function get(object, property, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
})(typeof global === "undefined" ? self : global);
(function () {
	'use strict';

	/**
  * A collection of core utility functions.
  * @const
  */

	var core = (function () {
		function core() {
			babelHelpers.classCallCheck(this, core);
		}

		babelHelpers.createClass(core, null, [{
			key: 'abstractMethod',

			/**
    * When defining a class Foo with an abstract method bar(), you can do:
    * Foo.prototype.bar = core.abstractMethod
    *
    * Now if a subclass of Foo fails to override bar(), an error will be thrown
    * when bar() is invoked.
    *
    * @type {!Function}
    * @throws {Error} when invoked to indicate the method should be overridden.
    */
			value: function abstractMethod() {
				throw Error('Unimplemented abstract method');
			}
		}, {
			key: 'collectSuperClassesProperty',

			/**
    * Loops constructor super classes collecting its properties values. If
    * property is not available on the super class `undefined` will be
    * collected as value for the class hierarchy position.
    * @param {!function()} constructor Class constructor.
    * @param {string} propertyName Property name to be collected.
    * @return {Array.<*>} Array of collected values.
    * TODO(*): Rethink superclass loop.
    */
			value: function collectSuperClassesProperty(constructor, propertyName) {
				var propertyValues = [constructor[propertyName]];
				while (constructor.__proto__ && !constructor.__proto__.isPrototypeOf(Function)) {
					constructor = constructor.__proto__;
					propertyValues.push(constructor[propertyName]);
				}
				return propertyValues;
			}
		}, {
			key: 'getUid',

			/**
    * Gets an unique id. If `opt_object` argument is passed, the object is
    * mutated with an unique id. Consecutive calls with the same object
    * reference won't mutate the object again, instead the current object uid
    * returns. See {@link core.UID_PROPERTY}.
    * @type {opt_object} Optional object to be mutated with the uid. If not
    *     specified this method only returns the uid.
    * @throws {Error} when invoked to indicate the method should be overridden.
    */
			value: function getUid(opt_object) {
				if (opt_object) {
					return opt_object[core.UID_PROPERTY] || (opt_object[core.UID_PROPERTY] = core.uniqueIdCounter_++);
				}
				return core.uniqueIdCounter_++;
			}
		}, {
			key: 'identityFunction',

			/**
    * The identity function. Returns its first argument.
    * @param {*=} opt_returnValue The single value that will be returned.
    * @return {?} The first argument.
    */
			value: function identityFunction(opt_returnValue) {
				return opt_returnValue;
			}
		}, {
			key: 'isBoolean',

			/**
    * Returns true if the specified value is a boolean.
    * @param {?} val Variable to test.
    * @return {boolean} Whether variable is boolean.
    */
			value: function isBoolean(val) {
				return typeof val === 'boolean';
			}
		}, {
			key: 'isDef',

			/**
    * Returns true if the specified value is not undefined.
    * @param {?} val Variable to test.
    * @return {boolean} Whether variable is defined.
    */
			value: function isDef(val) {
				return val !== undefined;
			}
		}, {
			key: 'isDefAndNotNull',

			/**
    * Returns true if value is not undefined or null.
    * @param {*} val
    * @return {Boolean}
    */
			value: function isDefAndNotNull(val) {
				return core.isDef(val) && !core.isNull(val);
			}
		}, {
			key: 'isDocument',

			/**
    * Returns true if value is a document.
    * @param {*} val
    * @return {Boolean}
    */
			value: function isDocument(val) {
				return val && typeof val === 'object' && val.nodeType === 9;
			}
		}, {
			key: 'isElement',

			/**
    * Returns true if value is a dom element.
    * @param {*} val
    * @return {Boolean}
    */
			value: function isElement(val) {
				return val && typeof val === 'object' && val.nodeType === 1;
			}
		}, {
			key: 'isFunction',

			/**
    * Returns true if the specified value is a function.
    * @param {?} val Variable to test.
    * @return {boolean} Whether variable is a function.
    */
			value: function isFunction(val) {
				return typeof val === 'function';
			}
		}, {
			key: 'isNull',

			/**
    * Returns true if value is null.
    * @param {*} val
    * @return {Boolean}
    */
			value: function isNull(val) {
				return val === null;
			}
		}, {
			key: 'isNumber',

			/**
    * Returns true if the specified value is a number.
    * @param {?} val Variable to test.
    * @return {boolean} Whether variable is a number.
    */
			value: function isNumber(val) {
				return typeof val === 'number';
			}
		}, {
			key: 'isWindow',

			/**
    * Returns true if value is a window.
    * @param {*} val
    * @return {Boolean}
    */
			value: function isWindow(val) {
				return val !== null && val === val.window;
			}
		}, {
			key: 'isObject',

			/**
    * Returns true if the specified value is an object. This includes arrays
    * and functions.
    * @param {?} val Variable to test.
    * @return {boolean} Whether variable is an object.
    */
			value: function isObject(val) {
				var type = typeof val;
				return type === 'object' && val !== null || type === 'function';
			}
		}, {
			key: 'isString',

			/**
    * Returns true if value is a string.
    * @param {*} val
    * @return {Boolean}
    */
			value: function isString(val) {
				return typeof val === 'string';
			}
		}, {
			key: 'mergeSuperClassesProperty',

			/**
    * Merges the values of a static property a class with the values of that
    * property for all its super classes, and stores it as a new static
    * property of that class. If the static property already existed, it won't
    * be recalculated.
    * @param {!function()} constructor Class constructor.
    * @param {string} propertyName Property name to be collected.
    * @param {function(*, *):*=} opt_mergeFn Function that receives an array filled
    *   with the values of the property for the current class and all its super classes.
    *   Should return the merged value to be stored on the current class.
    * @return {boolean} Returns true if merge happens, false otherwise.
    */
			value: function mergeSuperClassesProperty(constructor, propertyName, opt_mergeFn) {
				var mergedName = propertyName + '_MERGED';
				if (constructor.hasOwnProperty(mergedName)) {
					return false;
				}

				var merged = core.collectSuperClassesProperty(constructor, propertyName);
				if (opt_mergeFn) {
					merged = opt_mergeFn(merged);
				}
				constructor[mergedName] = merged;
				return true;
			}
		}, {
			key: 'nullFunction',

			/**
    * Null function used for default values of callbacks, etc.
    * @return {void} Nothing.
    */
			value: function nullFunction() {}
		}]);
		return core;
	})();

	/**
  * Unique id property prefix.
  * @type {String}
  * @protected
  */
	core.UID_PROPERTY = 'core_' + (Math.random() * 1000000000 >>> 0);

	/**
  * Counter for unique id.
  * @type {Number}
  * @private
  */
	core.uniqueIdCounter_ = 1;

	this.launchpad.core = core;
}).call(this);
(function () {
  /**
   * Provides a convenient interface for data transport.
   * @interface
   */
  "use strict";

  var Transport = (function () {
    function Transport() {
      babelHelpers.classCallCheck(this, Transport);
    }

    babelHelpers.createClass(Transport, [{
      key: "send",

      /**
       * Sends a message for the specified client.
       * @param {ClientRequest} clientRequest
       * @return {Promise} Deferred request.
       */
      value: function send(clientRequest) {}
    }]);
    return Transport;
  })();

  this.launchpad.Transport = Transport;
}).call(this);
(function () {
  /**
   * Provides a convenient interface for data transport.
   * @interface
   */
  'use strict';

  var Util = (function () {
    function Util() {
      babelHelpers.classCallCheck(this, Util);
    }

    babelHelpers.createClass(Util, null, [{
      key: 'parseUrl',

      /**
       * Parses the url separating the domain and port from the path.
       * @param {string} url
       * @return {array} Array containing the url domain and path.
       * @protected
       */
      value: function parseUrl(url) {
        var base;
        var path;
        var domainAt = url.indexOf('//');
        if (domainAt > -1) {
          url = url.substring(domainAt + 2);
        }
        base = url.substring(0, url.indexOf('/'));
        path = url.substring(url.indexOf('/'));
        return [base, path];
      }
    }, {
      key: 'joinPaths',

      /**
       * Joins two paths.
       * @param {string} basePath
       * @param {string} path
       */
      value: function joinPaths(basePath, path) {
        if (basePath.charAt(basePath.length - 1) === '/') {
          basePath = basePath.substring(0, basePath.length - 1);
        }
        if (path.charAt(0) === '/') {
          path = path.substring(1);
        }
        return [basePath, path].join('/');
      }
    }, {
      key: 'parseResponseHeaders',

      /**
       * XmlHttpRequest's getAllResponseHeaders() method returns a string of
       * response headers according to the format described on the spec:
       * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
       * This method parses that string into a user-friendly name/value pair
       * object.
       * @param {string} allHeaders All headers as string.
       * @return {array.<object<string, string>>=}
       */
      value: function parseResponseHeaders(allHeaders) {
        var headers = [];
        if (!allHeaders) {
          return headers;
        }
        var pairs = allHeaders.split('\r\n');
        for (var i = 0; i < pairs.length; i++) {
          var index = pairs[i].indexOf(': ');
          if (index > 0) {
            var name = pairs[i].substring(0, index);
            var value = pairs[i].substring(index + 2);
            headers.push({ name: name, value: value });
          }
        }
        return headers;
      }
    }]);
    return Util;
  })();

  this.launchpad.Util = Util;
}).call(this);
(function () {
  'use strict';

  var core = this.launchpad.core;

  /**
   */

  var ClientMessage = (function () {
    function ClientMessage() {
      babelHelpers.classCallCheck(this, ClientMessage);

      this.headers_ = [];
    }

    babelHelpers.createClass(ClientMessage, [{
      key: 'body',

      /**
       * Fluent getter and setter for request body.
       * @param {string} opt_body Request body to be set.
       * @return {string} Returns request body.
       * @chainable Chainable when used for setter.
       */
      value: function body(opt_body) {
        if (core.isDef(opt_body)) {
          this.body_ = opt_body;
          return this;
        }
        return this.body_;
      }
    }, {
      key: 'header',

      /**
       * Adds a header. If the header with the same name already exists, it will
       * not be overwritten, but new value will be stored. The order is preserved.
       * @param {string} name
       * @param {string} value
       * @chainable
       */
      value: function header(name, value) {
        if (arguments.length !== 2) {
          throw new Error('Invalid arguments');
        }

        this.headers_.push({
          name: name,
          value: value
        });
        return this;
      }
    }, {
      key: 'headers',

      /**
       * Fluent getter and setter for request headers.
       * @param {array.<object.<string, string>>} opt_queries Request headers
       *     list to be set.
       * @return {array.<object.<string, string>>} Returns request headers
       *     list.
       * @chainable Chainable when used for setter.
       */
      value: function headers(opt_headers) {
        if (core.isDef(opt_headers)) {
          this.headers_ = opt_headers;
          return this;
        }
        return this.headers_;
      }
    }]);
    return ClientMessage;
  })();

  this.launchpad.ClientMessage = ClientMessage;
}).call(this);
(function () {
  'use strict';

  var core = this.launchpad.core;
  var ClientMessage = this.launchpad.ClientMessage;

  /**
   */

  var ClientResponse = (function (_ClientMessage) {
    function ClientResponse(clientRequest) {
      babelHelpers.classCallCheck(this, ClientResponse);

      babelHelpers.get(Object.getPrototypeOf(ClientResponse.prototype), 'constructor', this).call(this);
      if (!clientRequest) {
        throw new Error('Can\'t create response without request');
      }
      this.clientRequest_ = clientRequest;
    }

    babelHelpers.inherits(ClientResponse, _ClientMessage);
    babelHelpers.createClass(ClientResponse, [{
      key: 'request',

      /**
       * Returns request that created this response.
       * @return {ClientRequest}
       */
      value: function request() {
        return this.clientRequest_;
      }
    }, {
      key: 'statusCode',

      /**
       * Fluent getter and setter for response status code.
       * @param {number} opt_statusCode Request status code to be set.
       * @return {number} Returns response status code.
       */
      value: function statusCode(opt_statusCode) {
        if (core.isDef(opt_statusCode)) {
          this.statusCode_ = opt_statusCode;
          return this;
        }
        return this.statusCode_;
      }
    }]);
    return ClientResponse;
  })(ClientMessage);

  this.launchpad.ClientResponse = ClientResponse;
}).call(this);
(function () {
  /*!
   * Promises polyfill from Google's Closure Library.
   *
   *      Copyright 2013 The Closure Library Authors. All Rights Reserved.
   *
   * NOTE(eduardo): Promise support is not ready on all supported browsers,
   * therefore core.js is temporarily using Google's promises as polyfill. It
   * supports cancellable promises and has clean and fast implementation.
   */

  'use strict';

  var core = this.launchpad.core;

  /**
   * Provides a more strict interface for Thenables in terms of
   * http://promisesaplus.com for interop with {@see CancellablePromise}.
   *
   * @interface
   * @extends {IThenable.<TYPE>}
   * @template TYPE
   */
  var Thenable = function Thenable() {};

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
  Thenable.prototype.then = function () {};

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
  Thenable.addImplementation = function (ctor) {
    ctor.prototype.then = ctor.prototype.then;
    ctor.prototype.$goog_Thenable = true;
  };

  /**
   * @param {*} object
   * @return {boolean} Whether a given instance implements {@code Thenable}.
   *     The class/superclass of the instance must call {@code addImplementation}.
   */
  Thenable.isImplementedBy = function (object) {
    if (!object) {
      return false;
    }
    try {
      return !!object.$goog_Thenable;
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
  var partial = function partial(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
      // Clone the array (with slice()) and append additional arguments
      // to the existing arguments.
      var newArgs = args.slice();
      newArgs.push.apply(newArgs, arguments);
      return fn.apply(this, newArgs);
    };
  };

  var async = {};

  /**
   * Throw an item without interrupting the current execution context.  For
   * example, if processing a group of items in a loop, sometimes it is useful
   * to report an error while still allowing the rest of the batch to be
   * processed.
   * @param {*} exception
   */
  async.throwException = function (exception) {
    // Each throw needs to be in its own context.
    async.nextTick(function () {
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
  async.run = function (callback, opt_context) {
    if (!async.run.workQueueScheduled_) {
      // Nothing is currently scheduled, schedule it now.
      async.nextTick(async.run.processWorkQueue);
      async.run.workQueueScheduled_ = true;
    }

    async.run.workQueue_.push(new async.run.WorkItem_(callback, opt_context));
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
  async.run.processWorkQueue = function () {
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
  async.run.WorkItem_ = function (fn, scope) {
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
  async.nextTick = function (callback, opt_context) {
    var cb = callback;
    if (opt_context) {
      cb = callback.bind(opt_context);
    }
    cb = async.nextTick.wrapCallback_(cb);
    // Introduced and currently only supported by IE10.
    if (core.isFunction(window.setImmediate)) {
      window.setImmediate(cb);
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
  async.nextTick.getSetImmediateEmulator_ = function () {
    // Create a private message channel and use it to postMessage empty messages
    // to ourselves.
    var Channel = window.MessageChannel;
    // If MessageChannel is not available and we are in a browser, implement
    // an iframe based polyfill in browsers that have postMessage and
    // document.addEventListener. The latter excludes IE8 because it has a
    // synchronous postMessage implementation.
    if (typeof Channel === 'undefined' && typeof window !== 'undefined' && window.postMessage && window.addEventListener) {
      /** @constructor */
      Channel = function () {
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
        var onmessage = (function (e) {
          // Validate origin and message to make sure that this message was
          // intended for us.
          if (e.origin !== origin && e.data !== message) {
            return;
          }
          this.port1.onmessage();
        }).bind(this);
        win.addEventListener('message', onmessage, false);
        this.port1 = {};
        this.port2 = {
          postMessage: function postMessage() {
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
      channel.port1.onmessage = function () {
        head = head.next;
        var cb = head.cb;
        head.cb = null;
        cb();
      };
      return function (cb) {
        tail.next = {
          cb: cb
        };
        tail = tail.next;
        channel.port2.postMessage(0);
      };
    }
    // Implementation for IE6-8: Script elements fire an asynchronous
    // onreadystatechange event when inserted into the DOM.
    if (typeof document !== 'undefined' && 'onreadystatechange' in document.createElement('script')) {
      return function (cb) {
        var script = document.createElement('script');
        script.onreadystatechange = function () {
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
    return function (cb) {
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
  async.nextTick.wrapCallback_ = function (opt_returnValue) {
    return opt_returnValue;
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
  var CancellablePromise = function CancellablePromise(resolver, opt_context) {
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
      resolver.call(opt_context, function (value) {
        self.resolve_(CancellablePromise.State_.FULFILLED, value);
      }, function (reason) {
        self.resolve_(CancellablePromise.State_.REJECTED, reason);
      });
    } catch (e) {
      this.resolve_(CancellablePromise.State_.REJECTED, e);
    }
  };

  /**
   * @define {number} The delay in milliseconds before a rejected Promise's reason
   * is passed to the rejection handler. By default, the rejection handler
   * rethrows the rejection reason so that it appears in the developer console or
   * {@code window.onerror} handler.
   *
   * Rejections are rethrown as quickly as possible by default. A negative value
   * disables rejection handling entirely.
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
  CancellablePromise.resolve = function (opt_value) {
    return new CancellablePromise(function (resolve) {
      resolve(opt_value);
    });
  };

  /**
   * @param {*=} opt_reason
   * @return {!CancellablePromise} A new Promise that is immediately rejected with the
   *     given reason.
   */
  CancellablePromise.reject = function (opt_reason) {
    return new CancellablePromise(function (resolve, reject) {
      reject(opt_reason);
    });
  };

  /**
   * @param {!Array.<!(Thenable.<TYPE>|Thenable)>} promises
   * @return {!CancellablePromise.<TYPE>} A Promise that receives the result of the
   *     first Promise (or Promise-like) input to complete.
   * @template TYPE
   */
  CancellablePromise.race = function (promises) {
    return new CancellablePromise(function (resolve, reject) {
      if (!promises.length) {
        resolve(undefined);
      }
      for (var i = 0, promise; promise = promises[i]; i++) {
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
  CancellablePromise.all = function (promises) {
    return new CancellablePromise(function (resolve, reject) {
      var toFulfill = promises.length;
      var values = [];

      if (!toFulfill) {
        resolve(values);
        return;
      }

      var onFulfill = function onFulfill(index, value) {
        toFulfill--;
        values[index] = value;
        if (toFulfill === 0) {
          resolve(values);
        }
      };

      var onReject = function onReject(reason) {
        reject(reason);
      };

      for (var i = 0, promise; promise = promises[i]; i++) {
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
  CancellablePromise.firstFulfilled = function (promises) {
    return new CancellablePromise(function (resolve, reject) {
      var toReject = promises.length;
      var reasons = [];

      if (!toReject) {
        resolve(undefined);
        return;
      }

      var onFulfill = function onFulfill(value) {
        resolve(value);
      };

      var onReject = function onReject(index, reason) {
        toReject--;
        reasons[index] = reason;
        if (toReject === 0) {
          reject(reasons);
        }
      };

      for (var i = 0, promise; promise = promises[i]; i++) {
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
  CancellablePromise.prototype.then = function (opt_onFulfilled, opt_onRejected, opt_context) {
    return this.addChildPromise_(core.isFunction(opt_onFulfilled) ? opt_onFulfilled : null, core.isFunction(opt_onRejected) ? opt_onRejected : null, opt_context);
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
  CancellablePromise.prototype.thenAlways = function (onResolved, opt_context) {
    var callback = function callback() {
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
  CancellablePromise.prototype.thenCatch = function (onRejected, opt_context) {
    return this.addChildPromise_(null, onRejected, opt_context);
  };

  /**
   * Alias of {@link CancellablePromise.prototype.thenCatch}
   */
  CancellablePromise.prototype['catch'] = CancellablePromise.prototype.thenCatch;

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
  CancellablePromise.prototype.cancel = function (opt_message) {
    if (this.state_ === CancellablePromise.State_.PENDING) {
      async.run(function () {
        var err = new CancellablePromise.CancellationError(opt_message);
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
  CancellablePromise.prototype.cancelInternal_ = function (err) {
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
  CancellablePromise.prototype.cancelChild_ = function (childPromise, err) {
    if (!this.callbackEntries_) {
      return;
    }
    var childCount = 0;
    var childIndex = -1;

    // Find the callback entry for the childPromise, and count whether there are
    // additional child Promises.
    for (var i = 0, entry; entry = this.callbackEntries_[i]; i++) {
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
        this.executeCallback_(callbackEntry, CancellablePromise.State_.REJECTED, err);
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
  CancellablePromise.prototype.addCallbackEntry_ = function (callbackEntry) {
    if ((!this.callbackEntries_ || !this.callbackEntries_.length) && (this.state_ === CancellablePromise.State_.FULFILLED || this.state_ === CancellablePromise.State_.REJECTED)) {
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
  CancellablePromise.prototype.addChildPromise_ = function (onFulfilled, onRejected, opt_context) {

    var callbackEntry = {
      child: null,
      onFulfilled: null,
      onRejected: null
    };

    callbackEntry.child = new CancellablePromise(function (resolve, reject) {
      // Invoke onFulfilled, or resolve with the parent's value if absent.
      callbackEntry.onFulfilled = onFulfilled ? function (value) {
        try {
          var result = onFulfilled.call(opt_context, value);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      } : resolve;

      // Invoke onRejected, or reject with the parent's reason if absent.
      callbackEntry.onRejected = onRejected ? function (reason) {
        try {
          var result = onRejected.call(opt_context, reason);
          if (!core.isDef(result) && reason instanceof CancellablePromise.CancellationError) {
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
    this.addCallbackEntry_(callbackEntry);
    return callbackEntry.child;
  };

  /**
   * Unblocks the Promise and fulfills it with the given value.
   *
   * @param {TYPE} value
   * @private
   */
  CancellablePromise.prototype.unblockAndFulfill_ = function (value) {
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
  CancellablePromise.prototype.unblockAndReject_ = function (reason) {
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
  CancellablePromise.prototype.resolve_ = function (state, x) {
    if (this.state_ !== CancellablePromise.State_.PENDING) {
      return;
    }

    if (this === x) {
      state = CancellablePromise.State_.REJECTED;
      x = new TypeError('CancellablePromise cannot resolve to itself');
    } else if (Thenable.isImplementedBy(x)) {
      x = x;
      this.state_ = CancellablePromise.State_.BLOCKED;
      x.then(this.unblockAndFulfill_, this.unblockAndReject_, this);
      return;
    } else if (core.isObject(x)) {
      try {
        var then = x.then;
        if (core.isFunction(then)) {
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

    if (state === CancellablePromise.State_.REJECTED && !(x instanceof CancellablePromise.CancellationError)) {
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
  CancellablePromise.prototype.tryThen_ = function (thenable, then) {
    this.state_ = CancellablePromise.State_.BLOCKED;
    var promise = this;
    var called = false;

    var resolve = function resolve(value) {
      if (!called) {
        called = true;
        promise.unblockAndFulfill_(value);
      }
    };

    var reject = function reject(reason) {
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
  CancellablePromise.prototype.scheduleCallbacks_ = function () {
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
  CancellablePromise.prototype.executeCallbacks_ = function () {
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
  CancellablePromise.prototype.executeCallback_ = function (callbackEntry, state, result) {
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
  CancellablePromise.prototype.removeUnhandledRejection_ = function () {
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
  CancellablePromise.addUnhandledRejection_ = function (promise, reason) {
    if (CancellablePromise.UNHANDLED_REJECTION_DELAY > 0) {
      promise.unhandledRejectionId_ = setTimeout(function () {
        CancellablePromise.handleRejection_.call(null, reason);
      }, CancellablePromise.UNHANDLED_REJECTION_DELAY);
    } else if (CancellablePromise.UNHANDLED_REJECTION_DELAY === 0) {
      promise.hadUnhandledRejection_ = true;
      async.run(function () {
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
  CancellablePromise.setUnhandledRejectionHandler = function (handler) {
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
  CancellablePromise.CancellationError = (function (_Error) {
    var _class = function (opt_message) {
      babelHelpers.classCallCheck(this, _class);

      babelHelpers.get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, opt_message);

      if (opt_message) {
        this.message = opt_message;
      }
    };

    babelHelpers.inherits(_class, _Error);
    return _class;
  })(Error);

  /** @override */
  CancellablePromise.CancellationError.prototype.name = 'cancel';

  if (typeof window.Promise === 'undefined') {
    window.Promise = CancellablePromise;
  }

  this.launchpadNamed.Promise = {};
  this.launchpadNamed.Promise.CancellablePromise = CancellablePromise;
  this.launchpadNamed.Promise.async = async;
}).call(this);

/** @type {CancellablePromise.CallbackEntry_} */ /** @type {!Thenable} */
(function () {
  'use strict';

  var core = this.launchpad.core;
  var Transport = this.launchpad.Transport;
  var Util = this.launchpad.Util;
  var ClientResponse = this.launchpad.ClientResponse;
  var Promise = this.launchpadNamed.Promise.CancellablePromise;

  /**
   * Provides a convenient interface for data transport.
   * @interface
   */

  var AjaxTransport = (function (_Transport) {
    function AjaxTransport() {
      babelHelpers.classCallCheck(this, AjaxTransport);

      babelHelpers.get(Object.getPrototypeOf(AjaxTransport.prototype), 'constructor', this).call(this);
    }

    babelHelpers.inherits(AjaxTransport, _Transport);
    babelHelpers.createClass(AjaxTransport, [{
      key: 'send',

      /**
       * @inheritDoc
       */
      value: function send(clientRequest) {
        var self = this;

        var deferred = this.request(clientRequest.url(), clientRequest.method(), clientRequest.body(), clientRequest.headers(), clientRequest.queries(), null, false);

        return deferred.then(function (response) {
          var clientResponse = new ClientResponse(clientRequest);
          clientResponse.body(response.responseText);
          clientResponse.statusCode(response.status);
          clientResponse.headers(Util.parseResponseHeaders(response.getAllResponseHeaders()));
          return clientResponse;
        });
      }
    }, {
      key: 'request',

      /**
       * Requests the url using XMLHttpRequest.
       * @param {!string} url
       * @param {!string} method
       * @param {?string} body
       * @param {array.<object<string, string>>=} opt_headers
       * @param {array.<object<string, string>>=} opt_queries
       * @param {number=} opt_timeout
       * @param {boolean=} opt_sync
       * @return {Promise} Deferred ajax request.
       * @protected
       */
      value: function request(url, method, body, opt_headers, opt_queries, opt_timeout, opt_sync) {
        var request = new XMLHttpRequest();

        var promise = new Promise(function (resolve, reject) {
          request.onload = function () {
            if (request.status === 200 || request.status === 204 || request.status === 304) {
              resolve(request);
              return;
            }
            request.onerror();
          };
          request.onerror = function () {
            var error = new Error('Request error');
            error.request = request;
            reject(error);
          };
        }).thenCatch(function (reason) {
          throw reason;
        }).thenAlways(function () {
          clearTimeout(timeout);
        });

        if (opt_queries) {
          var querystring = '';
          opt_queries.forEach(function (query) {
            querystring += query.name + '=' + encodeURIComponent(query.value) + '&';
          });
          querystring = querystring.slice(0, -1);
          if (querystring) {
            url += url.indexOf('?') > -1 ? '&' : '?';
            url += querystring;
          }
        }

        request.open(method, url, !opt_sync);

        if (opt_headers) {
          var headers = {};
          opt_headers.forEach(function (header) {
            headers[header.name] = (headers[header.name] ? headers[header.name] + ',' : '') + header.value;
            request.setRequestHeader(header.name, headers[header.name]);
          });
        }

        request.send(core.isDef(body) ? body : null);

        if (core.isDefAndNotNull(opt_timeout)) {
          var timeout = setTimeout(function () {
            promise.cancel('Request timeout');
          }, opt_timeout);
        }

        return promise;
      }
    }]);
    return AjaxTransport;
  })(Transport);

  this.launchpad.AjaxTransport = AjaxTransport;
}).call(this);
(function () {
  'use strict';

  var core = this.launchpad.core;
  var ClientMessage = this.launchpad.ClientMessage;

  /**
   */

  var ClientRequest = (function (_ClientMessage) {
    function ClientRequest() {
      babelHelpers.classCallCheck(this, ClientRequest);

      babelHelpers.get(Object.getPrototypeOf(ClientRequest.prototype), 'constructor', this).call(this);
      this.queries_ = [];
    }

    babelHelpers.inherits(ClientRequest, _ClientMessage);
    babelHelpers.createClass(ClientRequest, [{
      key: 'method',

      /**
       * Fluent getter and setter for request method.
       * @param {string} opt_method Request method to be set.
       * @return {string} Returns request method.
       * @chainable Chainable when used for setter.
       */
      value: function method(opt_method) {
        if (core.isDef(opt_method)) {
          this.method_ = opt_method;
          return this;
        }
        return this.method_ || ClientRequest.DEFAULT_METHOD;
      }
    }, {
      key: 'query',

      /**
       * Adds a query. If the query with the same name already exists, it will not
       * be overwritten, but new value will be stored. The order is preserved.
       * @param {string} name
       * @param {string} value
       * @chainable
       */
      value: function query(name, value) {
        if (arguments.length !== 2) {
          throw new Error('Invalid arguments');
        }

        this.queries_.push({
          name: name,
          value: value
        });
        return this;
      }
    }, {
      key: 'queries',

      /**
       * Fluent getter and setter for request query string.
       * @param {array.<object.<string, string>>} opt_queries Request query string
       *     list to be set.
       * @return {array.<object.<string, string>>} Returns request query string
       *     list.
       * @chainable Chainable when used for setter.
       */
      value: function queries(opt_queries) {
        if (core.isDef(opt_queries)) {
          this.queries_ = opt_queries;
          return this;
        }
        return this.queries_;
      }
    }, {
      key: 'url',

      /**
       * Fluent getter and setter for request url.
       * @param {string} opt_url Request url to be set.
       * @return {string} Returns request url.
       * @chainable Chainable when used for setter.
       * TODO: Renames on api.java as well.
       */
      value: function url(opt_url) {
        if (core.isDef(opt_url)) {
          this.url_ = opt_url;
          return this;
        }
        return this.url_;
      }
    }]);
    return ClientRequest;
  })(ClientMessage);

  ClientRequest.DEFAULT_METHOD = 'GET';

  this.launchpad.ClientRequest = ClientRequest;
}).call(this);
(function () {
  'use strict';

  var AjaxTransport = this.launchpad.AjaxTransport;

  /**
   * Provides a factory for data transport.
   */

  var TransportFactory = (function () {
    function TransportFactory() {
      babelHelpers.classCallCheck(this, TransportFactory);

      this.transports = {};
      this.transports[TransportFactory.DEFAULT_TRANSPORT_NAME] = AjaxTransport;
    }

    babelHelpers.createClass(TransportFactory, [{
      key: 'get',
      value: function get(implementationName) {
        var transportClass = this.transports[implementationName];

        if (transportClass == null) {
          throw new Error('Invalid transport name: ' + implementationName);
        }

        try {
          return new transportClass();
        } catch (err) {
          throw new Error('Can\'t create transport', err);
        }
      }
    }, {
      key: 'getDefault',

      /**
       * Returns default transport.
       */
      value: function getDefault() {
        return this.get(TransportFactory.DEFAULT_TRANSPORT_NAME);
      }
    }], [{
      key: 'instance',

      /**
       * Returns {@code TransportFactory} instance.
       */
      value: function instance() {
        if (!TransportFactory.instance_) {
          TransportFactory.instance_ = new TransportFactory();
        }
        return TransportFactory.instance_;
      }
    }]);
    return TransportFactory;
  })();

  TransportFactory.DEFAULT_TRANSPORT_NAME = 'default';

  this.launchpad.TransportFactory = TransportFactory;
}).call(this);
(function () {
  'use strict';

  var TransportFactory = this.launchpad.TransportFactory;
  var ClientRequest = this.launchpad.ClientRequest;
  var Util = this.launchpad.Util;

  /**
   * Base client contains code that is same for all transports.
   * @interface
   */

  var LaunchpadClient = (function () {
    function LaunchpadClient() {
      babelHelpers.classCallCheck(this, LaunchpadClient);

      if (arguments.length === 0) {
        throw new Error('Invalid arguments, try `new LaunchpadClient(baseUrl, url)`');
      }

      this.url_ = Util.joinPaths(arguments[0] || '', arguments[1] || '');
      this.headers_ = [];
      this.queries_ = [];

      this.header('Content-Type', 'application/json');
    }

    babelHelpers.createClass(LaunchpadClient, [{
      key: 'use',

      /**
       * Specifies {@link Transport} implementation.
       */
      value: function use(transport) {
        this.customTransport_ = transport;
        return this;
      }
    }, {
      key: 'connect',

      /**
       * Creates new socket.io instance. The parameters passed to socket.io
       * constructor will be provided:
       *
       *   LaunchpadClient.url('http://domain:8080/path').connect({ foo: true });
       *     -> io('domain:8080', { path: '/path', foo: true });
       *
       * @param {object} opt_options
       */
      value: function connect(opt_options) {
        if (typeof io === 'undefined') {
          throw new Error('Socket.io client not loaded');
        }

        var url = Util.parseUrl(this.url());
        opt_options = opt_options || {};
        opt_options.path = url[1];

        return io(url[0], opt_options);
      }
    }, {
      key: 'path',

      /**
       * Creates new {@link LaunchpadBaseClient}.
       */
      value: function path(_path) {
        return new LaunchpadClient(this.url(), _path).use(this.customTransport_);
      }
    }, {
      key: 'delete',

      /**
       * Sends message with DELETE http verb.
       * @return {Promise}
       */
      value: function _delete() {
        return this.sendAsync('DELETE');
      }
    }, {
      key: 'get',

      /**
       * Sends message with GET http verb.
       * @return {Promise}
       */
      value: function get() {
        return this.sendAsync('GET');
      }
    }, {
      key: 'patch',

      /**
       * Sends message with PATCH http verb.
       * @param {string} opt_body
       * @return {Promise}
       */
      value: function patch(opt_body) {
        return this.sendAsync('PATCH', opt_body);
      }
    }, {
      key: 'post',

      /**
       * Sends message with POST http verb.
       * @param {string} opt_body
       * @return {Promise}
       */
      value: function post(opt_body) {
        return this.sendAsync('POST', opt_body);
      }
    }, {
      key: 'put',

      /**
       * Sends message with PUT http verb.
       * @param {string} opt_body
       * @return {Promise}
       */
      value: function put(opt_body) {
        return this.sendAsync('PUT', opt_body);
      }
    }, {
      key: 'header',

      /**
       * Adds a header. If the header with the same name already exists, it will
       * not be overwritten, but new value will be stored. The order is preserved.
       */
      value: function header(name, value) {
        if (arguments.length !== 2) {
          throw new Error('Invalid arguments');
        }

        this.headers_.push({
          name: name,
          value: value
        });
        return this;
      }
    }, {
      key: 'headers',

      /**
       * Gets the headers.
       * @return {array.<object.<string, string>>}
       */
      value: function headers() {
        return this.headers_;
      }
    }, {
      key: 'query',

      /**
       * Adds a query. If the query with the same name already exists, it will not
       * be overwritten, but new value will be stored. The order is preserved.
       */
      value: function query(name, value) {
        if (arguments.length !== 2) {
          throw new Error('Invalid arguments');
        }

        this.queries_.push({
          name: name,
          value: value
        });
        return this;
      }
    }, {
      key: 'queries',

      /**
       * Gets the query strings.
       * @return {array.<object.<string, string>>}
       */
      value: function queries() {
        return this.queries_;
      }
    }, {
      key: 'url',

      /**
       * Returns the URL.
       * TODO: Renames on api.java as well.
       */
      value: function url() {
        return this.url_;
      }
    }, {
      key: 'sendAsync',

      /**
       * Uses transport to send request with given method name and body
       * asynchronously.
       * @param {string} method The HTTP method to be used when sending data.
       * @param {string} body
       * @return {Promise} Deferred request.
       */
      value: function sendAsync(method, body) {
        var transport = this.customTransport_ || TransportFactory.instance().getDefault();

        var clientRequest = new ClientRequest();
        clientRequest.body(body);
        clientRequest.method(method);
        clientRequest.headers(this.headers());
        clientRequest.queries(this.queries());
        clientRequest.url(this.url());

        this.encode(clientRequest);

        return transport.send(clientRequest).then(this.decode);
      }
    }, {
      key: 'encode',

      /**
       * Encodes clientRequest body.
       * @param {ClientRequest} clientRequest
       * @return {ClientRequest}
       */
      value: function encode(clientRequest) {
        if (LaunchpadClient.TEMP_isContentTypeJson(clientRequest)) {
          clientRequest.body(JSON.stringify(clientRequest.body()));
        }
        return clientRequest;
      }
    }, {
      key: 'decode',

      /**
       * Decodes clientResponse body.
       * @param {ClientResponse} clientResponse
       * @return {ClientResponse}
       */
      value: function decode(clientResponse) {
        if (LaunchpadClient.TEMP_isContentTypeJson(clientResponse)) {
          try {
            clientResponse.body(JSON.parse(clientResponse.body()));
          } catch (err) {}
        }
        return clientResponse;
      }
    }], [{
      key: 'url',

      /**
       * Static factory for creating launchpad client.
       */
      value: function url(_url) {
        return new LaunchpadClient(_url).use(this.customTransport_);
      }
    }]);
    return LaunchpadClient;
  })();

  LaunchpadClient.TEMP_isContentTypeJson = function (clientMessage) {
    var items = clientMessage.headers();
    for (var i = items.length - 1; i >= 0; i--) {
      if ('content-type' === items[i].name.toLowerCase()) {
        return items[i].value.toLowerCase().indexOf('application/json') === 0;
      }
    }
    return false;
  };

  if (typeof window !== undefined) {
    window.LaunchpadClient = LaunchpadClient;
  }

  this.launchpad.LaunchpadClient = LaunchpadClient;
}).call(this);
//# sourceMappingURL=api.js.map