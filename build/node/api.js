'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var io = _interopDefault(require('socket.io-client'));
var metal = require('metal');
var Uri = _interopDefault(require('metal-uri'));
var metalStorage = require('metal-storage');
var Ajax = _interopDefault(require('metal-ajax'));
var metalStructs = require('metal-structs');
var http = _interopDefault(require('http'));
var _request = _interopDefault(require('request'));
var CancellablePromise = _interopDefault(require('metal-promise'));

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
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
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
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

var inherits = function (subClass, superClass) {
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
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Class responsible for storing an object that will be printed as JSON
 * when the `toString` method is called.
 */

var Embodied = function () {
	/**
  * Constructs a Embodied instance.
  * @constructor
  */
	function Embodied() {
		classCallCheck(this, Embodied);

		this.body_ = {};
	}

	/**
  * Gets the json object that represents this instance.
  * @return {!Object}
  */


	createClass(Embodied, [{
		key: 'body',
		value: function body() {
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

	}, {
		key: 'toString',


		/**
   * Gets the json string that represents this instance.
   * @return {string}
   */
		value: function toString() {
			return JSON.stringify(this.body());
		}
	}], [{
		key: 'toBody',
		value: function toBody(obj) {
			return obj instanceof Embodied ? obj.body() : obj;
		}
	}]);
	return Embodied;
}();

/**
 * Class responsible for storing and handling the body contents
 * of a Filter instance.
 */

var FilterBody = function () {
	/**
  * Constructs a {@link FilterBody} instance.
  * @param {string} field The name of the field to filter by.
  * @param {*} operatorOrValue If a third param is given, this should
  *   be the filter's operator (like ">="). Otherwise, this will be
  *   used as the filter's value, and the filter's operator will be "=".
  * @param {*=} opt_value The filter's value.
  * @constructor
  */
	function FilterBody(field, operatorOrValue, opt_value) {
		classCallCheck(this, FilterBody);

		var obj = {
			operator: metal.core.isDef(opt_value) ? operatorOrValue : '='
		};

		var value = metal.core.isDef(opt_value) ? opt_value : operatorOrValue;

		if (metal.core.isDefAndNotNull(value)) {
			if (value instanceof Embodied) {
				value = value.body();
			}
			obj.value = value;
		}

		if (metal.core.isDefAndNotNull(field)) {
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


	createClass(FilterBody, [{
		key: 'add',
		value: function add(operator, opt_filter) {
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

	}, {
		key: 'addArrayOperator_',
		value: function addArrayOperator_(operator, filter) {
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

	}, {
		key: 'addMany',
		value: function addMany(operator) {
			for (var _len = arguments.length, filters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				filters[_key - 1] = arguments[_key];
			}

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

	}, {
		key: 'createBody_',
		value: function createBody_(key, value) {
			this.body_ = {};
			this.body_[key] = value;
		}

		/**
   * Gets the json object that represents this filter's body.
   * @return {!Object}
   */

	}, {
		key: 'getObject',
		value: function getObject() {
			return this.body_;
		}
	}]);
	return FilterBody;
}();

/**
 * Class responsible for building different types of geometric
 * shapes.
 */

var Geo = function () {
	function Geo() {
		classCallCheck(this, Geo);
	}

	createClass(Geo, null, [{
		key: 'boundingBox',

		/**
   * Creates a new {@link BoundingBox} instance.
   * @param {*} upperLeft The upper left point.
   * @param {*} lowerRight The lower right point.
   * @return {!BoundingBox}
   * @static
   */
		value: function boundingBox(upperLeft, lowerRight) {
			return new Geo.BoundingBox(upperLeft, lowerRight);
		}

		/**
   * Creates a new {@link Circle} instance.
   * @param {*} center The circle's center coordinate.
   * @param {string} radius The circle's radius.
   * @return {!Circle}
   * @static
   */

	}, {
		key: 'circle',
		value: function circle(center, radius) {
			return new Geo.Circle(center, radius);
		}

		/**
   * Creates a new {@link Line} instance.
   * @param {...*} points This line's points.
   * @return {!Line}
   * @static
   */

	}, {
		key: 'line',
		value: function line() {
			for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
				points[_key] = arguments[_key];
			}

			return new (Function.prototype.bind.apply(Geo.Line, [null].concat(points)))();
		}

		/**
   * Creates a new {@link Point} instance.
   * @param {number} lat The latitude coordinate
   * @param {number} lon The longitude coordinate
   * @return {!Point}
   * @static
   */

	}, {
		key: 'point',
		value: function point(lat, lon) {
			return new Geo.Point(lat, lon);
		}

		/**
   * Creates a new {@link Polygon} instance.
   * @param {...*} points This polygon's points.
   * @return {!Polygon}
   * @static
   */

	}, {
		key: 'polygon',
		value: function polygon() {
			for (var _len2 = arguments.length, points = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				points[_key2] = arguments[_key2];
			}

			return new (Function.prototype.bind.apply(Geo.Polygon, [null].concat(points)))();
		}
	}]);
	return Geo;
}();

/**
 * Class that represents a point coordinate.
 * @extends {Embodied}
 */


var Point = function (_Embodied) {
	inherits(Point, _Embodied);

	/**
  * Constructs a {@link Point} instance.
  * @param {number} lat The latitude coordinate
  * @param {number} lon The longitude coordinate
  * @constructor
  */
	function Point(lat, lon) {
		classCallCheck(this, Point);

		var _this = possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).call(this));

		_this.body_ = [lat, lon];
		return _this;
	}

	return Point;
}(Embodied);

Geo.Point = Point;

/**
 * Class that represents a line.
 * @extends {Embodied}
 */

var Line = function (_Embodied2) {
	inherits(Line, _Embodied2);

	/**
  * Constructs a {@link Line} instance.
  * @param {...*} points This line's points.
  * @constructor
  */
	function Line() {
		classCallCheck(this, Line);

		var _this2 = possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this));

		for (var _len3 = arguments.length, points = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			points[_key3] = arguments[_key3];
		}

		_this2.body_ = {
			type: 'linestring',
			coordinates: points.map(function (point) {
				return Embodied.toBody(point);
			})
		};
		return _this2;
	}

	return Line;
}(Embodied);

Geo.Line = Line;

/**
 * Class that represents a bounding box.
 * @extends {Embodied}
 */

var BoundingBox = function (_Embodied3) {
	inherits(BoundingBox, _Embodied3);

	/**
  * Constructs a {@link BoundingBox} instance.
  * @param {*} upperLeft The upper left point.
  * @param {*} lowerRight The lower right point.
  * @constructor
  */
	function BoundingBox(upperLeft, lowerRight) {
		classCallCheck(this, BoundingBox);

		var _this3 = possibleConstructorReturn(this, (BoundingBox.__proto__ || Object.getPrototypeOf(BoundingBox)).call(this));

		_this3.body_ = {
			type: 'envelope',
			coordinates: [Embodied.toBody(upperLeft), Embodied.toBody(lowerRight)]
		};
		return _this3;
	}

	/**
  * Gets this bounding box's points.
  * @return {!Array}
  */


	createClass(BoundingBox, [{
		key: 'getPoints',
		value: function getPoints() {
			return this.body_.coordinates;
		}
	}]);
	return BoundingBox;
}(Embodied);

Geo.BoundingBox = BoundingBox;

/**
 * Class that represents a circle.
 * @extends {Embodied}
 */

var Circle = function (_Embodied4) {
	inherits(Circle, _Embodied4);

	/**
  * Constructs a {@link Circle} instance.
  * @param {*} center The circle's center coordinate.
  * @param {string} radius The circle's radius.
  * @constructor
  */
	function Circle(center, radius) {
		classCallCheck(this, Circle);

		var _this4 = possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this));

		_this4.body_ = {
			type: 'circle',
			coordinates: Embodied.toBody(center),
			radius: radius
		};
		return _this4;
	}

	/**
  * Gets this circle's center coordinate.
  * @return {*}
  */


	createClass(Circle, [{
		key: 'getCenter',
		value: function getCenter() {
			return this.body_.coordinates;
		}

		/**
   * Gets this circle's radius.
   * @return {string}
   */

	}, {
		key: 'getRadius',
		value: function getRadius() {
			return this.body_.radius;
		}
	}]);
	return Circle;
}(Embodied);

Geo.Circle = Circle;

/**
 * Class that represents a polygon.
 * @extends {Embodied}
 */

var Polygon = function (_Embodied5) {
	inherits(Polygon, _Embodied5);

	/**
  * Constructs a {@link Polygon} instance.
  * @param {...*} points This polygon's points.
  * @constructor
  */
	function Polygon() {
		classCallCheck(this, Polygon);

		var _this5 = possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this));

		_this5.body_ = {
			type: 'polygon',
			coordinates: []
		};
		_this5.addCoordinates_.apply(_this5, arguments);
		return _this5;
	}

	/**
  * Adds the given points as coordinates for this polygon.
  * @param {...*} points
  * @protected
  */


	createClass(Polygon, [{
		key: 'addCoordinates_',
		value: function addCoordinates_() {
			for (var _len4 = arguments.length, points = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				points[_key4] = arguments[_key4];
			}

			this.body_.coordinates.push(points.map(function (point) {
				return Embodied.toBody(point);
			}));
		}

		/**
   * Adds the given points as a hole inside this polygon.
   * @param  {...*} points
   * @chainnable
   */

	}, {
		key: 'hole',
		value: function hole() {
			this.addCoordinates_.apply(this, arguments);
			return this;
		}
	}]);
	return Polygon;
}(Embodied);

Geo.Polygon = Polygon;

/**
 * Class responsible for building range objects to be used by `Filter`.
 * @extends {Embodied}
 */

var Range = function (_Embodied) {
	inherits(Range, _Embodied);

	/**
  * Constructs a {@link Range} instance.
  * @param {*} from
  * @param {*} opt_to
  * @constructor
  */
	function Range(from, opt_to) {
		classCallCheck(this, Range);

		var _this = possibleConstructorReturn(this, (Range.__proto__ || Object.getPrototypeOf(Range)).call(this));

		if (metal.core.isDefAndNotNull(from)) {
			_this.body_.from = from;
		}
		if (metal.core.isDefAndNotNull(opt_to)) {
			_this.body_.to = opt_to;
		}
		return _this;
	}

	/**
  * Constructs a {@link Range} instance.
  * @param {*} from
  * @return {!Range}
  * @static
  */


	createClass(Range, null, [{
		key: 'from',
		value: function from(_from) {
			return new Range(_from);
		}

		/**
   * Constructs a {@link Range} instance.
   * @param {*} from
   * @param {*} to
   * @return {!Range}
   * @static
   */

	}, {
		key: 'range',
		value: function range(from, to) {
			return new Range(from, to);
		}

		/**
   * Constructs a {@link Range} instance.
   * @param {*} to
   * @return {!Range}
   * @static
   */

	}, {
		key: 'to',
		value: function to(_to) {
			return new Range(null, _to);
		}
	}]);
	return Range;
}(Embodied);

/**
 * Class responsible for building filters.
 * @extends {Embodied}
 */

var Filter = function (_Embodied) {
	inherits(Filter, _Embodied);

	/**
  * Constructs a {@link Filter} instance.
  * @param {string} field The name of the field to filter by.
  * @param {*} operatorOrValue If a third param is given, this should
  *   be the filter's operator (like ">="). Otherwise, this will be
  *   used as the filter's value, and the filter's operator will be "=".
  * @param {*=} opt_value The filter's value.
  * @constructor
  */
	function Filter(field, operatorOrValue, opt_value) {
		classCallCheck(this, Filter);

		var _this = possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this));

		_this.body_ = new FilterBody(field, operatorOrValue, opt_value);
		return _this;
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


	createClass(Filter, [{
		key: 'add',
		value: function add(operator, fieldOrFilter, opt_operatorOrValue, opt_value) {
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

	}, {
		key: 'addMany',
		value: function addMany(operator) {
			var _body_;

			for (var _len = arguments.length, filters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				filters[_key - 1] = arguments[_key];
			}

			(_body_ = this.body_).addMany.apply(_body_, [operator].concat(filters));
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

	}, {
		key: 'and',
		value: function and(fieldOrFilter, opt_operatorOrValue, opt_value) {
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

	}, {
		key: 'body',


		/**
   * Gets the json object that represents this filter.
   * @return {!Object}
   */
		value: function body() {
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

	}, {
		key: 'or',


		/**
   * Adds a filter to be composed with this filter using the "or" operator.
   * @param {!Filter|string} fieldOrFilter Either a {@link Filter} instance or
   * the name of the field to filter by.
   * @param {*=} opt_operatorOrValue Either the field's operator or its value.
   * @param {*=} opt_value The filter's value.
   * @chainnable
   */
		value: function or(fieldOrFilter, opt_operatorOrValue, opt_value) {
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

	}], [{
		key: 'any',
		value: function any(field) {
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

	}, {
		key: 'boundingBox',
		value: function boundingBox(field, boxOrUpperLeft, opt_lowerRight) {
			if (boxOrUpperLeft instanceof Geo.BoundingBox) {
				return Filter.polygon.apply(Filter, [field].concat(toConsumableArray(boxOrUpperLeft.getPoints())));
			} else {
				return Filter.polygon(field, boxOrUpperLeft, opt_lowerRight);
			}
		}
	}, {
		key: 'distance',
		value: function distance(field, locationOrCircle, opt_rangeOrDistance) {
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

	}, {
		key: 'distanceInternal_',
		value: function distanceInternal_(field, location, range) {
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

	}, {
		key: 'equal',
		value: function equal(field, value) {
			return new Filter(field, '=', value);
		}

		/**
   * Returns a {@link Filter} instance that uses the "exists" operator.
   * @param {string} field The field's name.
   * @return {!Filter}
   * @static
   */

	}, {
		key: 'exists',
		value: function exists(field) {
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

	}, {
		key: 'fuzzy',
		value: function fuzzy(fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness) {
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

	}, {
		key: 'fuzzyInternal_',
		value: function fuzzyInternal_(operator, fieldOrQuery, opt_queryOrFuzziness, opt_fuzziness) {
			var arg2IsString = metal.core.isString(opt_queryOrFuzziness);

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

	}, {
		key: 'gt',
		value: function gt(field, value) {
			return new Filter(field, '>', value);
		}

		/**
   * Returns a {@link Filter} instance that uses the ">=" operator.
   * @param {string} field The name of the field to filter by.
   * @param {*} value The filter's value.
   * @return {!Filter}
    * @static
   */

	}, {
		key: 'gte',
		value: function gte(field, value) {
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

	}, {
		key: 'match',
		value: function match(fieldOrQuery, opt_query) {
			var field = metal.core.isString(opt_query) ? fieldOrQuery : Filter.ALL;
			var query = metal.core.isString(opt_query) ? opt_query : fieldOrQuery;
			return Filter.field(field, 'match', query);
		}

		/**
   * Returns a {@link Filter} instance that uses the "missing" operator.
   * @param {string} field The field's name.
   * @return {!Filter}
   * @static
   */

	}, {
		key: 'missing',
		value: function missing(field) {
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

	}, {
		key: 'phrase',
		value: function phrase(fieldOrQuery, opt_query) {
			var field = metal.core.isString(opt_query) ? fieldOrQuery : Filter.ALL;
			var query = metal.core.isString(opt_query) ? opt_query : fieldOrQuery;
			return Filter.field(field, 'phrase', query);
		}

		/**
   * Returns a {@link Filter} instance that uses the "gp" operator.
   * @param {string} field The name of the field.
   * @param {...!Object} points Objects representing points in the polygon.
   * @return {!Filter}
   * @static
   */

	}, {
		key: 'polygon',
		value: function polygon(field) {
			for (var _len2 = arguments.length, points = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				points[_key2 - 1] = arguments[_key2];
			}

			points = points.map(function (point) {
				return Embodied.toBody(point);
			});
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

	}, {
		key: 'prefix',
		value: function prefix(fieldOrQuery, opt_query) {
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

	}, {
		key: 'range',
		value: function range(field, rangeOrMin, opt_max) {
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

	}, {
		key: 'regex',
		value: function regex(field, value) {
			return new Filter(field, '~', value);
		}

		/**
   * Returns a {@link Filter} instance that uses the "gs" operator.
   * @param {string} field The field's name.
   * @param {...!Object} shapes Objects representing shapes.
   * @return {!Filter}
   * @static
   */

	}, {
		key: 'shape',
		value: function shape(field) {
			for (var _len3 = arguments.length, shapes = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				shapes[_key3 - 1] = arguments[_key3];
			}

			shapes = shapes.map(function (shape) {
				return Embodied.toBody(shape);
			});
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

	}, {
		key: 'similar',
		value: function similar(fieldOrQuery, query) {
			var field = metal.core.isString(query) ? fieldOrQuery : Filter.ALL;
			var value = {
				query: metal.core.isString(query) ? query : fieldOrQuery
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

	}, {
		key: 'lt',
		value: function lt(field, value) {
			return new Filter(field, '<', value);
		}

		/**
   * Returns a {@link Filter} instance that uses the "<=" operator.
   * @param {string} field The name of the field to filter by.
   * @param {*} value The filter's value.
   * @return {!Filter}
    * @static
   */

	}, {
		key: 'lte',
		value: function lte(field, value) {
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

	}, {
		key: 'none',
		value: function none(field) {
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

	}, {
		key: 'notEqual',
		value: function notEqual(field, value) {
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

	}, {
		key: 'not',
		value: function not(fieldOrFilter, opt_operatorOrValue, opt_value) {
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

	}, {
		key: 'field',
		value: function field(_field, operatorOrValue, opt_value) {
			return new Filter(_field, operatorOrValue, opt_value);
		}
	}, {
		key: 'toFilter',
		value: function toFilter(fieldOrFilter, opt_operatorOrValue, opt_value) {
			var filter = fieldOrFilter;
			if (!(filter instanceof Filter)) {
				filter = Filter.field(fieldOrFilter, opt_operatorOrValue, opt_value);
			}
			return filter;
		}
	}]);
	return Filter;
}(Embodied);

/**
 * String constant that represents all fields.
 * @type {string}
 * @static
 */


Filter.ALL = '*';

/**
 * Class that represents a search aggregation.
 */

var Aggregation = function () {
	/**
  * Constructs an {@link Aggregation} instance.
  * @param {string} field The aggregation field.
  * @param {string} operator The aggregation operator.
  * @param {*=} opt_value The aggregation value.
  * @constructor
  */
	function Aggregation(field, operator, opt_value) {
		classCallCheck(this, Aggregation);

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


	createClass(Aggregation, [{
		key: 'getField',


		/**
   * Gets this aggregation's field.
   * @return {string}
   */
		value: function getField() {
			return this.field_;
		}

		/**
   * Gets this aggregation's operator.
   * @return {string}
   */

	}, {
		key: 'getOperator',
		value: function getOperator() {
			return this.operator_;
		}

		/**
   * Gets this aggregation's value.
   * @return {*}
   */

	}, {
		key: 'getValue',
		value: function getValue() {
			return this.value_;
		}

		/**
   * Creates an {@link Aggregation} instance with the "histogram" operator.
   * @param {string} field The aggregation field.
   * @param {number} interval The histogram's interval.
   * @return {!Aggregation}
   * @static
   */

	}], [{
		key: 'avg',
		value: function avg(field) {
			return Aggregation.field(field, 'avg');
		}

		/**
   * Creates an {@link Aggregation} instance with the "count" operator.
   * @param {string} field The aggregation field.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'count',
		value: function count(field) {
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

	}, {
		key: 'distance',
		value: function distance(field, location) {
			for (var _len = arguments.length, ranges = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				ranges[_key - 2] = arguments[_key];
			}

			return new (Function.prototype.bind.apply(Aggregation.DistanceAggregation, [null].concat([field, location], ranges)))();
		}

		/**
   * Creates an {@link Aggregation} instance with the "extendedStats" operator.
   * @param {string} field The aggregation field.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'extendedStats',
		value: function extendedStats(field) {
			return Aggregation.field(field, 'extendedStats');
		}
	}, {
		key: 'histogram',
		value: function histogram(field, interval) {
			return new Aggregation(field, 'histogram', interval);
		}

		/**
   * Creates an {@link Aggregation} instance with the "max" operator.
   * @param {string} field The aggregation field.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'max',
		value: function max(field) {
			return Aggregation.field(field, 'max');
		}

		/**
   * Creates an {@link Aggregation} instance with the "min" operator.
   * @param {string} field The aggregation field.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'min',
		value: function min(field) {
			return Aggregation.field(field, 'min');
		}

		/**
   * Creates an {@link Aggregation} instance with the "missing" operator.
   * @param {string} field The aggregation field.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'missing',
		value: function missing(field) {
			return Aggregation.field(field, 'missing');
		}

		/**
   * Creates a new {@link Aggregation} instance.
   * @param {string} field The aggregation field.
   * @param {string} operator The aggregation operator.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'field',
		value: function field(_field, operator) {
			return new Aggregation(_field, operator);
		}

		/**
   * Creates an {@link RangeAggregation} instance with the "range" operator.
   * @param {string} field The aggregation field.
   * @param {...!Range} ranges The aggregation ranges.
   * @return {!RangeAggregation}
   * @static
   */

	}, {
		key: 'range',
		value: function range(field) {
			for (var _len2 = arguments.length, ranges = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				ranges[_key2 - 1] = arguments[_key2];
			}

			return new (Function.prototype.bind.apply(Aggregation.RangeAggregation, [null].concat([field], ranges)))();
		}

		/**
   * Creates an {@link Aggregation} instance with the "stats" operator.
   * @param {string} field The aggregation field.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'stats',
		value: function stats(field) {
			return Aggregation.field(field, 'stats');
		}

		/**
   * Creates an {@link Aggregation} instance with the "sum" operator.
   * @param {string} field The aggregation field.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'sum',
		value: function sum(field) {
			return Aggregation.field(field, 'sum');
		}

		/**
   * Creates an {@link Aggregation} instance with the "terms" operator.
   * @param {string} field The aggregation field.
   * @return {!Aggregation}
   * @static
   */

	}, {
		key: 'terms',
		value: function terms(field) {
			return Aggregation.field(field, 'terms');
		}
	}]);
	return Aggregation;
}();

/**
 * Class that represents a distance aggregation.
 * @extends {Aggregation}
 */


var DistanceAggregation = function (_Aggregation) {
	inherits(DistanceAggregation, _Aggregation);

	/**
  * Constructs an {@link DistanceAggregation} instance.
  * @param {string} field The aggregation field.
  * @param {*} location The aggregation location.
  * @param {...!Range} ranges The aggregation ranges.
  * @constructor
  */
	function DistanceAggregation(field, location) {
		classCallCheck(this, DistanceAggregation);

		var _this = possibleConstructorReturn(this, (DistanceAggregation.__proto__ || Object.getPrototypeOf(DistanceAggregation)).call(this, field, 'geoDistance', {}));

		_this.value_.location = Embodied.toBody(location);

		for (var _len3 = arguments.length, ranges = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
			ranges[_key3 - 2] = arguments[_key3];
		}

		_this.value_.ranges = ranges.map(function (range) {
			return range.body();
		});
		return _this;
	}

	/**
  * Adds a range to this aggregation.
  * @param {*} rangeOrFrom
  * @param {*=} opt_to
  * @chainnable
  */


	createClass(DistanceAggregation, [{
		key: 'range',
		value: function range(rangeOrFrom, opt_to) {
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

	}, {
		key: 'unit',
		value: function unit(_unit) {
			this.value_.unit = _unit;
			return this;
		}
	}]);
	return DistanceAggregation;
}(Aggregation);

Aggregation.DistanceAggregation = DistanceAggregation;

/**
 * Class that represents a range aggregation.
 * @extends {Aggregation}
 */

var RangeAggregation = function (_Aggregation2) {
	inherits(RangeAggregation, _Aggregation2);

	/**
  * Constructs an {@link RangeAggregation} instance.
  * @param {string} field The aggregation field.
  * @param {...!Range} ranges The aggregation ranges.
  * @constructor
  */
	function RangeAggregation(field) {
		classCallCheck(this, RangeAggregation);

		var _this2 = possibleConstructorReturn(this, (RangeAggregation.__proto__ || Object.getPrototypeOf(RangeAggregation)).call(this, field, 'range'));

		for (var _len4 = arguments.length, ranges = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
			ranges[_key4 - 1] = arguments[_key4];
		}

		_this2.value_ = ranges.map(function (range) {
			return range.body();
		});
		return _this2;
	}

	/**
  * Adds a range to this aggregation.
  * @param {*} rangeOrFrom
  * @param {*=} opt_to
  * @chainnable
  */


	createClass(RangeAggregation, [{
		key: 'range',
		value: function range(rangeOrFrom, opt_to) {
			var range = rangeOrFrom;
			if (!(range instanceof Range)) {
				range = Range.range(rangeOrFrom, opt_to);
			}
			this.value_.push(range.body());
			return this;
		}
	}]);
	return RangeAggregation;
}(Aggregation);

Aggregation.RangeAggregation = RangeAggregation;

/**
 * Class responsible for building queries.
 * @extends {Embodied}
 */

var Query = function (_Embodied) {
	inherits(Query, _Embodied);

	function Query() {
		classCallCheck(this, Query);
		return possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).apply(this, arguments));
	}

	createClass(Query, [{
		key: 'aggregate',


		/**
   * Adds an aggregation to this {@link Query} instance.
   * @param {string} name The aggregation name.
   * @param {!Aggregation|string} aggregationOrField Either an
   *   {@link Aggregation} instance or the name of the aggregation field.
   * @param {string=} opt_operator The aggregation operator.
   * @chainnable
   */
		value: function aggregate(name, aggregationOrField, opt_operator) {
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
			if (metal.core.isDefAndNotNull(aggregation.getValue())) {
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

	}, {
		key: 'count',
		value: function count() {
			return this.type('count');
		}

		/**
   * Sets this query's type to "fetch".
   * @chainnable
   */

	}, {
		key: 'fetch',
		value: function fetch() {
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

	}, {
		key: 'filter',
		value: function filter(fieldOrFilter, opt_operatorOrValue, opt_value) {
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

	}, {
		key: 'offset',
		value: function offset(_offset2) {
			this.body_.offset = _offset2;
			return this;
		}

		/**
   * Adds a highlight entry to this {@link Query} instance.
   * @param {string} field The field's name.
   * @chainnable
   */

	}, {
		key: 'highlight',
		value: function highlight(field) {
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

	}, {
		key: 'limit',
		value: function limit(_limit2) {
			this.body_.limit = _limit2;
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

	}, {
		key: 'search',
		value: function search(filterOrTextOrField, opt_textOrOperator, opt_value) {
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

			if (metal.core.isDefAndNotNull(filterOrTextOrField)) {
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

	}, {
		key: 'sort',
		value: function sort(field, opt_direction) {
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

	}, {
		key: 'type',
		value: function type(_type2) {
			this.body_.type = _type2;
			return this;
		}
	}], [{
		key: 'aggregate',

		/**
   * Adds an aggregation to this {@link Query} instance.
   * @param {string} name The aggregation name.
   * @param {!Aggregation|string} aggregationOrField Either an
   *   {@link Aggregation} instance or the name of the aggregation field.
   * @param {string=} opt_operator The aggregation operator.
   * @return {!Query}
   * @static
   */
		value: function aggregate(name, aggregationOrField, opt_operator) {
			return new Query().aggregate(name, aggregationOrField, opt_operator);
		}

		/**
   * Sets this query's type to "count".
   * @return {!Query}
   * @static
   */

	}, {
		key: 'count',
		value: function count() {
			return new Query().type('count');
		}

		/**
   * Sets this query's type to "fetch".
   * @return {!Query}
   * @static
   */

	}, {
		key: 'fetch',
		value: function fetch() {
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

	}, {
		key: 'filter',
		value: function filter(fieldOrFilter, opt_operatorOrValue, opt_value) {
			return new Query().filter(fieldOrFilter, opt_operatorOrValue, opt_value);
		}

		/**
   * Sets the query offset.
   * @param {number} offset The index of the first entry that should be returned
   *   by this query.
   * @return {!Query}
   * @static
   */

	}, {
		key: 'offset',
		value: function offset(_offset) {
			return new Query().offset(_offset);
		}

		/**
   * Adds a highlight entry to this {@link Query} instance.
   * @param {string} field The field's name.
   * @return {!Query}
   * @static
   */

	}, {
		key: 'highlight',
		value: function highlight(field) {
			return new Query().highlight(field);
		}

		/**
   * Sets the query limit.
   * @param {number} limit The max amount of entries that this query should return.
   * @return {!Query}
   * @static
   */

	}, {
		key: 'limit',
		value: function limit(_limit) {
			return new Query().limit(_limit);
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

	}, {
		key: 'search',
		value: function search(filterOrTextOrField, opt_textOrOperator, opt_value) {
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

	}, {
		key: 'sort',
		value: function sort(field, opt_direction) {
			return new Query().sort(field, opt_direction);
		}

		/**
   * Sets the query type.
   * @param {string} type The query's type. For example: "count", "fetch".
   * @return {!Query}
   * @static
   */

	}, {
		key: 'type',
		value: function type(_type) {
			return new Query().type(_type);
		}
	}]);
	return Query;
}(Embodied);

var globals = {};

if (typeof window !== 'undefined') {
	globals.window = window;
}

if (typeof document !== 'undefined') {
	globals.document = document;
}

function assertBrowserEnvironment() {
	if (!globals.window) {
		throw new Error('Sign-in type not supported in this environment');
	}
}

function assertDefAndNotNull(value, errorMessage) {
	if (!metal.core.isDefAndNotNull(value)) {
		throw new Error(errorMessage);
	}
}

function assertFunction(value, errorMessage) {
	if (!metal.core.isFunction(value)) {
		throw new Error(errorMessage);
	}
}

function assertObject(value, errorMessage) {
	if (!metal.core.isObject(value)) {
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
	if (!metal.core.isDefAndNotNull(user)) {
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

var Auth = function () {
	/**
  * Constructs an {@link Auth} instance.
  * @param {string} tokenOrEmail Either the authorization token, or
  *   the username.
  * @param {string=} opt_password If a username is given as the first param,
  *   this should be the password.
  * @constructor
  */
	function Auth(tokenOrEmail) {
		var opt_password = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		classCallCheck(this, Auth);

		this.token = metal.core.isString(opt_password) ? null : tokenOrEmail;
		this.email = metal.core.isString(opt_password) ? tokenOrEmail : null;
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


	createClass(Auth, [{
		key: 'getCreatedAt',


		/**
   * Gets the created at date.
   * @return {string}
   */
		value: function getCreatedAt() {
			return this.createdAt;
		}

		/**
   * Gets the email.
   * @return {string}
   */

	}, {
		key: 'getEmail',
		value: function getEmail() {
			return this.email;
		}

		/**
   * Gets the id.
   * @return {string}
   */

	}, {
		key: 'getId',
		value: function getId() {
			return this.id;
		}

		/**
   * Gets the name.
   * @return {string}
   */

	}, {
		key: 'getName',
		value: function getName() {
			return this.name;
		}

		/**
   * Gets the password.
   * @return {string}
   */

	}, {
		key: 'getPassword',
		value: function getPassword() {
			return this.password;
		}

		/**
   * Gets the photo url.
   * @return {string}
   */

	}, {
		key: 'getPhotoUrl',
		value: function getPhotoUrl() {
			return this.photoUrl;
		}

		/**
   * Gets the token.
   * @return {string}
   */

	}, {
		key: 'getToken',
		value: function getToken() {
			return this.token;
		}

		/**
   * Checks if created at is set.
   * @return {boolean}
   */

	}, {
		key: 'hasCreatedAt',
		value: function hasCreatedAt() {
			return metal.core.isDefAndNotNull(this.createdAt);
		}

		/**
   * Checks if the email is set.
   * @return {boolean}
   */

	}, {
		key: 'hasEmail',
		value: function hasEmail() {
			return metal.core.isDefAndNotNull(this.email);
		}

		/**
   * Checks if the id is set.
   * @return {boolean}
   */

	}, {
		key: 'hasId',
		value: function hasId() {
			return metal.core.isDefAndNotNull(this.id);
		}

		/**
   * Checks if the name is set.
   * @return {boolean}
   */

	}, {
		key: 'hasName',
		value: function hasName() {
			return metal.core.isDefAndNotNull(this.name);
		}

		/**
   * Checks if the password is set.
   * @return {boolean}
   */

	}, {
		key: 'hasPassword',
		value: function hasPassword() {
			return metal.core.isDefAndNotNull(this.password);
		}

		/**
   * Checks if the photo url is set.
   * @return {boolean}
   */

	}, {
		key: 'hasPhotoUrl',
		value: function hasPhotoUrl() {
			return metal.core.isDefAndNotNull(this.photoUrl);
		}

		/**
   * Checks if the token is set.
   * @return {boolean}
   */

	}, {
		key: 'hasToken',
		value: function hasToken() {
			return metal.core.isDefAndNotNull(this.token);
		}

		/**
   * Sets created at.
   * @param {string} createdAt
   */

	}, {
		key: 'setCreatedAt',
		value: function setCreatedAt(createdAt) {
			this.createdAt = createdAt;
		}

		/**
   * Sets the email.
   * @param {string} email
   */

	}, {
		key: 'setEmail',
		value: function setEmail(email) {
			this.email = email;
		}

		/**
   * Sets the id.
   * @param {string} id
   */

	}, {
		key: 'setId',
		value: function setId(id) {
			this.id = id;
		}

		/**
   * Sets the name.
   * @param {string} name
   */

	}, {
		key: 'setName',
		value: function setName(name) {
			this.name = name;
		}

		/**
   * Sets the password.
   * @param {string} password
   */

	}, {
		key: 'setPassword',
		value: function setPassword(password) {
			this.password = password;
		}

		/**
   * Sets the photo url.
   * @param {string} photoUrl
   */

	}, {
		key: 'setPhotoUrl',
		value: function setPhotoUrl(photoUrl) {
			this.photoUrl = photoUrl;
		}

		/**
   * Sets the token.
   * @param {string} token
   */

	}, {
		key: 'setToken',
		value: function setToken(token) {
			this.token = token;
		}
	}, {
		key: 'setWedeployClient',
		value: function setWedeployClient(wedeployClient) {
			this.wedeployClient = wedeployClient;
		}

		/**
   * Updates the user.
   * @param {!object} data
   * @return {CompletableFuture}
   */

	}, {
		key: 'updateUser',
		value: function updateUser(data) {
			assertObject(data, 'User data must be specified as object');
			return this.wedeployClient.url(this.wedeployClient.authUrl_).path('/users').auth(this).patch(data).then(function (response) {
				return assertResponseSucceeded(response);
			});
		}

		/**
   * Deletes the current user.
   * @return {CompletableFuture}
   */

	}, {
		key: 'deleteUser',
		value: function deleteUser() {
			assertDefAndNotNull(this.id, 'Cannot delete user without id');
			return this.wedeployClient.url(this.wedeployClient.authUrl_).path('/users', this.id).auth(this).delete().then(function (response) {
				return assertResponseSucceeded(response);
			});
		}
	}], [{
		key: 'create',
		value: function create(tokenOrUsername, opt_password) {
			return new Auth(tokenOrUsername, opt_password);
		}
	}]);
	return Auth;
}();

var ApiHelper = function () {

	/**
  * Constructs an {@link ApiHelper} instance.
  * @constructor
  */
	function ApiHelper(wedeployClient) {
		classCallCheck(this, ApiHelper);

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


	createClass(ApiHelper, [{
		key: 'auth',
		value: function auth(authOrTokenOrEmail, opt_password) {
			this.helperAuthScope = authOrTokenOrEmail;
			if (!(this.helperAuthScope instanceof Auth)) {
				this.helperAuthScope = Auth.create(authOrTokenOrEmail, opt_password);
			}
			return this;
		}
	}]);
	return ApiHelper;
}();

/**
 * Class responsible for encapsulate provider information.
 */

var AuthProvider = function () {
	/**
  * Constructs an {@link AuthProvider} instance.
  * @constructor
  */
	function AuthProvider() {
		classCallCheck(this, AuthProvider);

		this.provider = null;
		this.providerScope = null;
		this.redirectUri = null;
		this.scope = null;
	}

	/**
  * Checks if provider is defined and not null.
  * @return {boolean}
  */


	createClass(AuthProvider, [{
		key: 'hasProvider',
		value: function hasProvider() {
			return metal.core.isDefAndNotNull(this.provider);
		}

		/**
   * Checks if scope is defined and not null.
   * @return {boolean}
   */

	}, {
		key: 'hasProviderScope',
		value: function hasProviderScope() {
			return metal.core.isDefAndNotNull(this.providerScope);
		}

		/**
   * Checks if redirect uri is defined and not null.
   * @return {boolean}
   */

	}, {
		key: 'hasRedirectUri',
		value: function hasRedirectUri() {
			return metal.core.isDefAndNotNull(this.redirectUri);
		}

		/**
   * Checks if scope is defined and not null.
   * @return {boolean}
   */

	}, {
		key: 'hasScope',
		value: function hasScope() {
			return metal.core.isDefAndNotNull(this.scope);
		}

		/**
   * Makes authorization url.
   * @return {string=} Authorization url.
   */

	}, {
		key: 'makeAuthorizationUrl',
		value: function makeAuthorizationUrl(opt_authUrl) {
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

	}, {
		key: 'getProvider',
		value: function getProvider() {
			return this.provider;
		}

		/**
   * Gets provider scope.
   * @return {string=} String with scopes.
   */

	}, {
		key: 'getProviderScope',
		value: function getProviderScope() {
			return this.providerScope;
		}

		/**
   * Gets redirect uri.
   * @return {string=}.
   */

	}, {
		key: 'getRedirectUri',
		value: function getRedirectUri() {
			return this.redirectUri;
		}

		/**
   * Gets scope.
   * @return {string=} String with scopes.
   */

	}, {
		key: 'getScope',
		value: function getScope() {
			return this.scope;
		}

		/**
   * Sets provider scope.
   * @param {string=} scope Scope string. Separate by space for multiple
   *   scopes, e.g. "scope1 scope2".
   */

	}, {
		key: 'setProviderScope',
		value: function setProviderScope(providerScope) {
			assertStringIfDefAndNotNull(providerScope, 'Provider scope must be a string');
			this.providerScope = providerScope;
		}

		/**
   * Sets redirect uri.
   * @param {string=} redirectUri.
   */

	}, {
		key: 'setRedirectUri',
		value: function setRedirectUri(redirectUri) {
			assertStringIfDefAndNotNull(redirectUri, 'Redirect uri must be a string');
			this.redirectUri = redirectUri;
		}

		/**
   * Sets scope.
   * @param {string=} scope Scope string. Separate by space for multiple
   *   scopes, e.g. "scope1 scope2".
   */

	}, {
		key: 'setScope',
		value: function setScope(scope) {
			assertStringIfDefAndNotNull(scope, 'Scope must be a string');
			this.scope = scope;
		}
	}]);
	return AuthProvider;
}();

function assertStringIfDefAndNotNull(value, errorMessage) {
	if (metal.core.isDefAndNotNull(value) && !metal.core.isString(value)) {
		throw new Error(errorMessage);
	}
}

/**
 * Facebook auth provider implementation.
 */

var FacebookAuthProvider = function (_AuthProvider) {
	inherits(FacebookAuthProvider, _AuthProvider);

	/**
  * Constructs an {@link FacebookAuthProvider} instance.
  * @constructor
  */
	function FacebookAuthProvider() {
		classCallCheck(this, FacebookAuthProvider);

		var _this = possibleConstructorReturn(this, (FacebookAuthProvider.__proto__ || Object.getPrototypeOf(FacebookAuthProvider)).call(this));

		_this.provider = FacebookAuthProvider.PROVIDER;
		return _this;
	}

	return FacebookAuthProvider;
}(AuthProvider);

FacebookAuthProvider.PROVIDER = 'facebook';

/**
 * Github auth provider implementation.
 */

var GithubAuthProvider = function (_AuthProvider) {
	inherits(GithubAuthProvider, _AuthProvider);

	/**
  * Constructs an {@link GithubAuthProvider} instance.
  * @constructor
  */
	function GithubAuthProvider() {
		classCallCheck(this, GithubAuthProvider);

		var _this = possibleConstructorReturn(this, (GithubAuthProvider.__proto__ || Object.getPrototypeOf(GithubAuthProvider)).call(this));

		_this.provider = GithubAuthProvider.PROVIDER;
		return _this;
	}

	return GithubAuthProvider;
}(AuthProvider);

GithubAuthProvider.PROVIDER = 'github';

/**
 * Google auth provider implementation.
 */

var GoogleAuthProvider = function (_AuthProvider) {
	inherits(GoogleAuthProvider, _AuthProvider);

	/**
  * Constructs an {@link GoogleAuthProvider} instance.
  * @constructor
  */
	function GoogleAuthProvider() {
		classCallCheck(this, GoogleAuthProvider);

		var _this = possibleConstructorReturn(this, (GoogleAuthProvider.__proto__ || Object.getPrototypeOf(GoogleAuthProvider)).call(this));

		_this.provider = GoogleAuthProvider.PROVIDER;
		return _this;
	}

	return GoogleAuthProvider;
}(AuthProvider);

GoogleAuthProvider.PROVIDER = 'google';

/**
 * Class responsible for encapsulate auth api calls.
 */

var AuthApiHelper = function (_ApiHelper) {
	inherits(AuthApiHelper, _ApiHelper);

	/**
  * Constructs an {@link AuthApiHelper} instance.
  * @constructor
  */
	function AuthApiHelper(wedeployClient) {
		classCallCheck(this, AuthApiHelper);

		var _this = possibleConstructorReturn(this, (AuthApiHelper.__proto__ || Object.getPrototypeOf(AuthApiHelper)).call(this, wedeployClient));

		_this.currentUser = null;
		_this.onSignInCallback = null;
		_this.onSignOutCallback = null;
		if (metalStorage.LocalStorageMechanism.isSupported()) {
			_this.storage = new metalStorage.Storage(new metalStorage.LocalStorageMechanism());
		}

		_this.processSignIn_();

		_this.provider = {
			Facebook: FacebookAuthProvider,
			Google: GoogleAuthProvider,
			Github: GithubAuthProvider
		};
		return _this;
	}

	/**
  * Creates user.
  * @param {!object} data The data to be used to create the user.
  * @return {CancellablePromise}
  */


	createClass(AuthApiHelper, [{
		key: 'createUser',
		value: function createUser(data) {
			var _this2 = this;

			assertObject(data, 'User data must be specified as object');
			return this.wedeployClient.url(this.wedeployClient.authUrl_).path('/users').post(data).then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function (response) {
				return _this2.makeUserAuthFromData(response.body());
			});
		}

		/**
   * Gets the current browser url without the fragment part.
   * @return {!string}
   * @protected
   */

	}, {
		key: 'getHrefWithoutFragment_',
		value: function getHrefWithoutFragment_() {
			var location = globals.window.location;
			return location.protocol + '//' + location.host + location.pathname + (location.search ? location.search : '');
		}

		/**
   * Gets the access token from the url fragment and removes it.
   * @return {?string}
   * @protected
   */

	}, {
		key: 'getRedirectAccessToken_',
		value: function getRedirectAccessToken_() {
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

	}, {
		key: 'getUser',
		value: function getUser(userId) {
			var _this3 = this;

			assertDefAndNotNull(userId, 'User userId must be specified');
			assertUserSignedIn(this.currentUser);
			return this.wedeployClient.url(this.wedeployClient.authUrl_).path('/users', userId).auth(this.resolveAuthScope().token).get().then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function (response) {
				return _this3.makeUserAuthFromData(response.body());
			});
		}

		/**
   * Loads current user. Requires a user token as argument.
   * @param {!string} token
   * @return {CancellablePromise}
   */

	}, {
		key: 'loadCurrentUser',
		value: function loadCurrentUser(token) {
			var _this4 = this;

			assertDefAndNotNull(token, 'User token must be specified');
			return this.wedeployClient.url(this.wedeployClient.authUrl_).path('/user').auth(token).get().then(function (response) {
				var data = response.body();
				data.token = token;
				_this4.currentUser = _this4.makeUserAuthFromData(data);
				if (_this4.storage) {
					_this4.storage.set('currentUser', data);
				}
				return _this4.currentUser;
			});
		}

		/**
   * Makes user Auth from data object.
   * @param {object} data
   * @return {Auth}
   * @protected
   */

	}, {
		key: 'makeUserAuthFromData',
		value: function makeUserAuthFromData(data) {
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

	}, {
		key: 'maybeCallOnSignInCallback_',
		value: function maybeCallOnSignInCallback_() {
			if (this.onSignInCallback) {
				this.onSignInCallback.call(this, this.currentUser);
			}
		}

		/**
   * Calls the on sign out callback if set.
   * @protected
   */

	}, {
		key: 'maybeCallOnSignOutCallback_',
		value: function maybeCallOnSignOutCallback_() {
			if (this.onSignOutCallback) {
				this.onSignOutCallback.call(this, this.currentUser);
			}
		}

		/**
   * Fires passed callback when a user sign-in. Note that it keeps only the
   * last callback passed.
   * @param {!Function} callback
   */

	}, {
		key: 'onSignIn',
		value: function onSignIn(callback) {
			assertFunction(callback, 'Sign-in callback must be a function');
			this.onSignInCallback = callback;
		}

		/**
   * Fires passed callback when a user sign-out. Note that it keeps only the
   * last callback passed.
   * @param {!Function} callback
   */

	}, {
		key: 'onSignOut',
		value: function onSignOut(callback) {
			assertFunction(callback, 'Sign-out callback must be a function');
			this.onSignOutCallback = callback;
		}

		/**
   * Processes sign-in by detecting a presence of a fragment
   * <code>#access_token=</code> in the url or, alternatively, by local
   * storage current user.
   */

	}, {
		key: 'processSignIn_',
		value: function processSignIn_() {
			var _this5 = this;

			var redirectAccessToken = this.getRedirectAccessToken_();
			if (redirectAccessToken) {
				this.removeUrlFragmentCompletely_();
				this.loadCurrentUser(redirectAccessToken).then(function () {
					return _this5.maybeCallOnSignInCallback_();
				});
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

	}, {
		key: 'removeUrlFragmentCompletely_',
		value: function removeUrlFragmentCompletely_() {
			globals.window.history.pushState({}, document.title, window.location.pathname + window.location.search);
		}

		/**
   * Resolves auth scope from last login or api helper.
   * @return {Auth}
   */

	}, {
		key: 'resolveAuthScope',
		value: function resolveAuthScope() {
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

	}, {
		key: 'sendPasswordResetEmail',
		value: function sendPasswordResetEmail(email) {
			assertDefAndNotNull(email, 'Send password reset email must be specified');
			return this.wedeployClient.url(this.wedeployClient.authUrl_).path('/user/recover').param('email', email).post().then(function (response) {
				return assertResponseSucceeded(response);
			});
		}

		/**
   * Signs in using email and password.
   * @param {!string} email
   * @param {!string} password
   * @return {CancellablePromise}
   */

	}, {
		key: 'signInWithEmailAndPassword',
		value: function signInWithEmailAndPassword(email, password) {
			var _this6 = this;

			assertDefAndNotNull(email, 'Sign-in email must be specified');
			assertDefAndNotNull(password, 'Sign-in password must be specified');

			return this.wedeployClient.url(this.wedeployClient.authUrl_).path('/oauth/token').param('grant_type', 'password').param('username', email).param('password', password).get().then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function (response) {
				return _this6.loadCurrentUser(response.body().access_token);
			}).then(function (user) {
				_this6.maybeCallOnSignInCallback_();
				return user;
			});
		}

		/**
   * Signs in with redirect. Some providers and environment may not support
   * this flow.
   * @param {AuthProvider} provider
   */

	}, {
		key: 'signInWithRedirect',
		value: function signInWithRedirect(provider) {
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

	}, {
		key: 'signOut',
		value: function signOut() {
			var _this7 = this;

			assertUserSignedIn(this.currentUser);
			return this.wedeployClient.url(this.wedeployClient.authUrl_).path('/oauth/revoke').param('token', this.currentUser.token).get().then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function (response) {
				_this7.maybeCallOnSignOutCallback_();
				_this7.unloadCurrentUser_();
				return response;
			});
		}

		/**
   * Unloads all information for <code>currentUser</code> and removes from
   * <code>localStorage</code> if present.
   * @return {[type]} [description]
   */

	}, {
		key: 'unloadCurrentUser_',
		value: function unloadCurrentUser_() {
			this.currentUser = null;
			if (this.storage) {
				this.storage.remove('currentUser');
			}
		}
	}]);
	return AuthApiHelper;
}(ApiHelper);

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
 * Class responsible for encapsulate data api calls.
 */

var DataApiHelper = function (_ApiHelper) {
	inherits(DataApiHelper, _ApiHelper);

	/**
  * Constructs an {@link DataApiHelper} instance.
  * @param {@link WeDeploy} instance.
  * @constructor
  */
	function DataApiHelper(wedeployClient) {
		classCallCheck(this, DataApiHelper);
		return possibleConstructorReturn(this, (DataApiHelper.__proto__ || Object.getPrototypeOf(DataApiHelper)).call(this, wedeployClient));
	}

	/**
  * Adds a filter to this request's {@link Query}.
  * @param {!Filter|string} fieldOrFilter Either a Filter instance or the
  *   name of the field to filter by.
  * @param {*=} opt_operatorOrValue Either the field's operator or its value.
  * @param {*=} opt_value The filter's value.
  * @chainable
  */


	createClass(DataApiHelper, [{
		key: 'where',
		value: function where(fieldOrFilter, opt_operatorOrValue, opt_value) {
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

	}, {
		key: 'or',
		value: function or(fieldOrFilter, opt_operatorOrValue, opt_value) {
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

	}, {
		key: 'none',
		value: function none(field) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

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

	}, {
		key: 'match',
		value: function match(field, value) {
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

	}, {
		key: 'similar',
		value: function similar(fieldOrQuery, query) {
			return this.where(Filter.similar(fieldOrQuery, query));
		}

		/**
   * Returns a {@link Filter} instance that uses the "<" operator.
   * @param {string} field The name of the field to filter by.
   * @param {*} value The filter's value.
   * @return {!Filter}
    * @static
   */

	}, {
		key: 'lt',
		value: function lt(field, value) {
			return this.where(Filter.lt(field, value));
		}

		/**
   * Returns a {@link Filter} instance that uses the "<=" operator.
   * @param {string} field The name of the field to filter by.
   * @param {*} value The filter's value.
   * @return {!Filter}
    * @static
   */

	}, {
		key: 'lte',
		value: function lte(field, value) {
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

	}, {
		key: 'any',
		value: function any(field) {
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

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

	}, {
		key: 'boundingBox',
		value: function boundingBox(field, boxOrUpperLeft, opt_lowerRight) {
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

	}, {
		key: 'distance',
		value: function distance(field, locationOrCircle, opt_rangeOrDistance) {
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

	}, {
		key: 'range',
		value: function range(field, rangeOrMin, opt_max) {
			return this.where(Filter.range(field, rangeOrMin, opt_max));
		}

		/**
   * Sets the limit for this request's {@link Query}.
   * @param {number} limit The max amount of entries that this request should return.
   * @chainable
   */

	}, {
		key: 'limit',
		value: function limit(_limit) {
			this.getOrCreateQuery_().limit(_limit);
			return this;
		}

		/**
   * Sets the offset for this request's {@link Query}.
   * @param {number} offset The index of the first entry that should be
   * returned by this query.
   * @chainable
   */

	}, {
		key: 'offset',
		value: function offset(_offset) {
			this.getOrCreateQuery_().offset(_offset);
			return this;
		}

		/**
   * Adds a highlight entry to this request's {@link Query} instance.
   * @param {string} field The field's name.
   * @chainable
   */

	}, {
		key: 'highlight',
		value: function highlight(field) {
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

	}, {
		key: 'aggregate',
		value: function aggregate(name, aggregationOrField, opt_operator) {
			this.getOrCreateQuery_().aggregate(name, aggregationOrField, opt_operator);
			return this;
		}

		/**
   * Sets this request's query type to 'count'.
   * @chainnable
   */

	}, {
		key: 'count',
		value: function count() {
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

	}, {
		key: 'orderBy',
		value: function orderBy(field, opt_direction) {
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

	}, {
		key: 'create',
		value: function create(collection, data) {
			assertDefAndNotNull(collection, 'Collection key must be specified.');
			assertObject(data, 'Data can\'t be empty.');

			return this.wedeployClient.url(this.wedeployClient.dataUrl_).auth(this.helperAuthScope).path(collection).post(data).then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function (response) {
				return response.body();
			});
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

	}, {
		key: 'update',
		value: function update(document, data) {
			assertDefAndNotNull(document, 'Document key must be specified.');
			assertObject(data, 'Data must be specified.');

			return this.wedeployClient.url(this.wedeployClient.dataUrl_).auth(this.helperAuthScope).path(document).put(data).then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function (response) {
				return response.body();
			});
		}

		/**
   * Deletes a [document/field/collection].
   * @param {string} key Key used to delete the
   * document/field/collection.
   * @return {!CancellablePromise}
   */

	}, {
		key: 'delete',
		value: function _delete(key) {
			assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

			return this.wedeployClient.url(this.wedeployClient.dataUrl_).auth(this.helperAuthScope).path(key).delete().then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function () {
				return undefined;
			});
		}

		/**
   * Retrieve data from a [document/field/collection].
   * @param {string} key Key used to delete the document/field/collection.
   * @return {!CancellablePromise}
   */

	}, {
		key: 'get',
		value: function get(key) {
			assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

			this.addFiltersToQuery_();

			return this.wedeployClient.url(this.wedeployClient.dataUrl_).auth(this.helperAuthScope).path(key).get(this.query_).then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function (response) {
				return response.body();
			});
		}

		/**
   * Retrieve data from a [document/field/collection] and put it in a search
   * format.
   * @param {string} key Key used to delete the document/field/collection.
   * @return {!CancellablePromise}
   */

	}, {
		key: 'search',
		value: function search(key) {
			assertDefAndNotNull(key, 'Document/Field/Collection key must be specified');

			this.onSearch_();

			this.addFiltersToQuery_();

			return this.wedeployClient.url(this.wedeployClient.dataUrl_).auth(this.helperAuthScope).path(key).get(this.query_).then(function (response) {
				return assertResponseSucceeded(response);
			}).then(function (response) {
				return response.body();
			});
		}

		/**
   * Creates new socket.io instance. Monitor the arrival of new broadcasted
   * data.
   * @param  {string} collection key/collection used to find organized data.
   * @param  {Object=} opt_options Object with Socket IO options.
   * @return {!io} Socket IO reference. Server events can be listened on it.
   */

	}, {
		key: 'watch',
		value: function watch(collection, opt_options) {
			assertDefAndNotNull(collection, 'Collection key must be specified');

			this.addFiltersToQuery_();

			return this.wedeployClient.url(this.wedeployClient.dataUrl_).auth(this.helperAuthScope).path(collection).watch(this.query_, opt_options);
		}

		/**
   * Gets the currentl used main {@link Filter} object. If none exists yet, a
   * new one is created.
   * @return {!Query}
   * @protected
   */

	}, {
		key: 'getOrCreateFilter_',
		value: function getOrCreateFilter_() {
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

	}, {
		key: 'getOrCreateQuery_',
		value: function getOrCreateQuery_() {
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

	}, {
		key: 'addFiltersToQuery_',
		value: function addFiltersToQuery_() {
			if (metal.core.isDef(this.filter_) && this.toSearch_ !== true) {
				this.getOrCreateQuery_().filter(this.filter_);
			}
			return this;
		}

		/**
   * Adds a search to this request's {@link Query} instance.
   * @chainable
   * @protected
   */

	}, {
		key: 'onSearch_',
		value: function onSearch_() {
			if (metal.core.isDef(this.filter_)) {
				this.getOrCreateQuery_().search(this.getOrCreateFilter_());
			} else {
				throw Error('It\'s required to have a condition before using an \'search()\' for the first time.');
			}
			this.toSearch_ = true;
			return this;
		}
	}]);
	return DataApiHelper;
}(ApiHelper);

/**
 * Abstraction layer for string to base64 conversion
 * reference: https://github.com/nodejs/node/issues/3462
 */

var Base64 = function () {
	function Base64() {
		classCallCheck(this, Base64);
	}

	createClass(Base64, null, [{
		key: 'encodeString',

		/**
   * Creates a base-64 encoded ASCII string from a "string" of binary data.
   * @param {string} string to be encoded.
   * @return {string}
   * @static
   */
		value: function encodeString(string) {
			if (typeof btoa === 'function') {
				return btoa(string);
			}

			return new Buffer(string.toString(), 'binary');
		}
	}]);
	return Base64;
}();

/**
 * Provides a convenient interface for data transport.
 * @interface
 */

var Transport = function () {
	function Transport() {
		classCallCheck(this, Transport);
	}

	createClass(Transport, [{
		key: 'send',


		/**
   * Sends a message for the specified client.
   * @param {!ClientRequest} clientRequest
   * @return {!Promise} Deferred request.
   */
		value: function send() {}
	}]);
	return Transport;
}();

/**
 * Represents a client message (e.g. a request or a response).
 */

var ClientMessage = function () {
	function ClientMessage() {
		classCallCheck(this, ClientMessage);

		this.headers_ = new metalStructs.MultiMap();
	}

	/**
  * Fluent getter and setter for request body.
  * @param {*=} opt_body Request body to be set. If none is given,
  *   the current value of the body will be returned.
  * @return {*} Returns request body if no body value was given. Otherwise
  *   returns the {@link ClientMessage} object itself, so calls can be chained.
  * @chainable Chainable when used as setter.
  */


	createClass(ClientMessage, [{
		key: 'body',
		value: function body(opt_body) {
			if (metal.core.isDef(opt_body)) {
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

	}, {
		key: 'header',
		value: function header(name, value) {
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

	}, {
		key: 'headers',
		value: function headers(opt_headers) {
			if (metal.core.isDef(opt_headers)) {
				if (opt_headers instanceof metalStructs.MultiMap) {
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

	}, {
		key: 'removeBody',
		value: function removeBody() {
			this.body_ = undefined;
		}
	}]);
	return ClientMessage;
}();

/**
 * Represents a client response object.
 * @extends {ClientMessage}
 */

var ClientResponse = function (_ClientMessage) {
	inherits(ClientResponse, _ClientMessage);

	function ClientResponse(clientRequest) {
		classCallCheck(this, ClientResponse);

		var _this = possibleConstructorReturn(this, (ClientResponse.__proto__ || Object.getPrototypeOf(ClientResponse)).call(this));

		if (!clientRequest) {
			throw new Error('Can\'t create response without request');
		}
		_this.clientRequest_ = clientRequest;
		return _this;
	}

	/**
  * Returns request that created this response.
  * @return {!ClientRequest}
  */


	createClass(ClientResponse, [{
		key: 'request',
		value: function request() {
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

	}, {
		key: 'statusCode',
		value: function statusCode(opt_statusCode) {
			if (metal.core.isDef(opt_statusCode)) {
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

	}, {
		key: 'statusText',
		value: function statusText(opt_statusText) {
			if (metal.core.isDef(opt_statusText)) {
				this.statusText_ = opt_statusText;
				return this;
			}
			return this.statusText_;
		}

		/**
   * Checks if response succeeded. Any status code 2xx or 3xx is considered valid.
   * @return {boolean}
   */

	}, {
		key: 'succeeded',
		value: function succeeded() {
			return this.statusCode() >= 200 && this.statusCode() <= 399;
		}
	}]);
	return ClientResponse;
}(ClientMessage);

/**
 * The implementation of an ajax transport to be used with {@link WeDeploy}.
 * @extends {Transport}
 */

var AjaxTransport = function (_Transport) {
	inherits(AjaxTransport, _Transport);

	function AjaxTransport() {
		classCallCheck(this, AjaxTransport);
		return possibleConstructorReturn(this, (AjaxTransport.__proto__ || Object.getPrototypeOf(AjaxTransport)).apply(this, arguments));
	}

	createClass(AjaxTransport, [{
		key: 'send',

		/**
   * @inheritDoc
   */
		value: function send(clientRequest) {
			var deferred = Ajax.request(clientRequest.url(), clientRequest.method(), clientRequest.body(), clientRequest.headers(), clientRequest.params(), null, false, clientRequest.withCredentials());

			return deferred.then(function (response) {
				var clientResponse = new ClientResponse(clientRequest);
				clientResponse.body(response.responseText);
				clientResponse.statusCode(response.status);
				clientResponse.statusText(response.statusText);
				Ajax.parseResponseHeaders(response.getAllResponseHeaders()).forEach(function (header) {
					clientResponse.header(header.name, header.value);
				});
				return clientResponse;
			});
		}
	}]);
	return AjaxTransport;
}(Transport);

/**
 * Provides a factory for data transport.
 */

var TransportFactory = function () {
	function TransportFactory() {
		classCallCheck(this, TransportFactory);

		this.transports = {};
		this.transports[TransportFactory.DEFAULT_TRANSPORT_NAME] = TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME];
	}

	/**
  * Returns {@link TransportFactory} instance.
  */


	createClass(TransportFactory, [{
		key: 'get',


		/**
   * Gets an instance of the transport implementation with the given name.
   * @param {string} implementationName
   * @return {!Transport}
   */
		value: function get(implementationName) {
			var TransportClass = this.transports[implementationName];

			if (!TransportClass) {
				throw new Error('Invalid transport name: ' + implementationName);
			}

			try {
				return new TransportClass();
			} catch (err) {
				throw new Error('Can\'t create transport', err);
			}
		}

		/**
   * Returns the default transport implementation.
   * @return {!Transport}
   */

	}, {
		key: 'getDefault',
		value: function getDefault() {
			return this.get(TransportFactory.DEFAULT_TRANSPORT_NAME);
		}
	}], [{
		key: 'instance',
		value: function instance() {
			if (!TransportFactory.instance_) {
				TransportFactory.instance_ = new TransportFactory();
			}
			return TransportFactory.instance_;
		}
	}]);
	return TransportFactory;
}();

TransportFactory.DEFAULT_TRANSPORT_NAME = 'default';

TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME] = AjaxTransport;

/**
 * Represents a client request object.
 * @extends {ClientMessage}
 */

var ClientRequest = function (_ClientMessage) {
	inherits(ClientRequest, _ClientMessage);

	function ClientRequest() {
		classCallCheck(this, ClientRequest);

		var _this = possibleConstructorReturn(this, (ClientRequest.__proto__ || Object.getPrototypeOf(ClientRequest)).call(this));

		_this.params_ = new metalStructs.MultiMap();
		_this.withCredentials_ = true;
		return _this;
	}

	/**
  * Fluent getter and setter for with credentials option.
  * @param {boolean=} opt_withCredentials
  * @chainable Chainable when used as setter.
  */


	createClass(ClientRequest, [{
		key: 'withCredentials',
		value: function withCredentials(opt_withCredentials) {
			if (metal.core.isDef(opt_withCredentials)) {
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

	}, {
		key: 'method',
		value: function method(opt_method) {
			if (metal.core.isDef(opt_method)) {
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

	}, {
		key: 'param',
		value: function param(name, value) {
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

	}, {
		key: 'params',
		value: function params(opt_params) {
			if (metal.core.isDef(opt_params)) {
				if (opt_params instanceof metalStructs.MultiMap) {
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

	}, {
		key: 'url',
		value: function url(opt_url) {
			if (metal.core.isDef(opt_url)) {
				this.url_ = opt_url;
				return this;
			}
			return this.url_;
		}
	}]);
	return ClientRequest;
}(ClientMessage);

ClientRequest.DEFAULT_METHOD = 'GET';

var io$1;

// Optimistic initialization of `io` reference from global `globals.window.io`.
if (typeof globals.window !== 'undefined') {
	io$1 = globals.window.io;
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

var WeDeploy$1 = function () {
	/**
  * WeDeploy constructor function.
  * @param {string} url The base url.
  * @param {...string} paths Any amount of paths to be appended to the base
  * url.
  * @constructor
  */
	function WeDeploy(url) {
		for (var _len = arguments.length, paths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			paths[_key - 1] = arguments[_key];
		}

		classCallCheck(this, WeDeploy);

		if (arguments.length === 0) {
			throw new Error('Invalid arguments, try `new WeDeploy(baseUrl, url)`');
		}

		this.auth_ = null;
		this.body_ = null;
		this.url_ = Uri.joinPaths.apply(Uri, [url || ''].concat(paths));
		this.headers_ = new metalStructs.MultiMap();
		this.params_ = new metalStructs.MultiMap();
		this.withCredentials_ = true;

		this.header('Content-Type', 'application/json');
		this.header('X-Requested-With', 'XMLHttpRequest');
	}

	/**
  * Static factory for creating WeDeploy data for the given url.
  * @param {string=} opt_dataUrl The url that points to the data services.
  * @return @return {data} WeDeploy data instance.
  */


	createClass(WeDeploy, [{
		key: 'auth',


		/**
   * Adds authorization information to this request.
   * @param {!Auth|string} authOrTokenOrEmail Either an {@link Auth} instance,
   * an authorization token, or the email.
   * @param {string=} opt_password If a email is given as the first param,
   * this should be the password.
   * @chainable
   */
		value: function auth(authOrTokenOrEmail, opt_password) {
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

	}, {
		key: 'body',


		/**
   * Sets the body that will be sent with this request.
   * @param {*} body
   * @chainable
   */
		value: function body(_body) {
			this.body_ = _body;
			return this;
		}

		/**
   * Converts the given body object to query params.
   * @param {!ClientRequest} clientRequest Client request.
   * @param {*} body
   * @protected
   */

	}, {
		key: 'convertBodyToParams_',
		value: function convertBodyToParams_(clientRequest, body) {
			if (metal.core.isString(body)) {
				body = {
					body: body
				};
			} else if (body instanceof Embodied) {
				body = body.body();
			}
			Object.keys(body || {}).forEach(function (name) {
				return clientRequest.param(name, body[name]);
			});
		}

		/**
   * Creates client request and encode.
   * @param {string} method
   * @param {*} body
   * @return {!ClientRequest} Client request.
   * @protected
   */

	}, {
		key: 'createClientRequest_',
		value: function createClientRequest_(method, body) {
			var clientRequest = new ClientRequest();

			clientRequest.body(body || this.body_);

			if (!metal.core.isDefAndNotNull(clientRequest.body())) {
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

	}, {
		key: 'decode',
		value: function decode(clientResponse) {
			if (WeDeploy.isContentTypeJson(clientResponse)) {
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

	}, {
		key: 'delete',
		value: function _delete(opt_body) {
			return this.sendAsync('DELETE', opt_body);
		}

		/**
   * Encodes the given {@link ClientRequest}, converting its body to an
   * appropriate format for example.
   * @param {!ClientRequest} clientRequest The request object to encode.
   * @return {!ClientRequest} The encoded request.
   */

	}, {
		key: 'encode',
		value: function encode(clientRequest) {
			var body = clientRequest.body();

			if (metal.core.isElement(body)) {
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
			} else if (WeDeploy.isContentTypeJson(clientRequest)) {
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

	}, {
		key: 'encodeParams_',
		value: function encodeParams_(clientRequest) {
			var params = clientRequest.params();
			params.names().forEach(function (name) {
				var values = params.getAll(name);
				values.forEach(function (value, index) {
					if (value instanceof Embodied) {
						value = value.toString();
					} else if (metal.core.isObject(value) || value instanceof Array) {
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

	}, {
		key: 'form',
		value: function form(name, value) {
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

	}, {
		key: 'get',
		value: function get(opt_params) {
			return this.sendAsync('GET', opt_params);
		}

		/**
   * Adds a header. If the header with the same name already exists, it will
   * not be overwritten, but new value will be stored. The order is preserved.
   * @param {string} name Header key.
   * @param {*} value Header value.
   * @chainable
   */

	}, {
		key: 'header',
		value: function header(name, value) {
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

	}, {
		key: 'headers',
		value: function headers() {
			return this.headers_;
		}

		/**
   * Wraps the given `Embodied` instance with a {@link Query} instance if needed.
   * @param {Embodied} embodied
   * @return {Embodied}
   * @protected
   */

	}, {
		key: 'maybeWrapWithQuery_',
		value: function maybeWrapWithQuery_(embodied) {
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

	}, {
		key: 'param',
		value: function param(name, value) {
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

	}, {
		key: 'params',
		value: function params() {
			return this.params_;
		}

		/**
   * Sends message with the PATCH http verb.
   * @param {string=} opt_body Content to be sent as the request's body.
   * @return {!CancellablePromise}
   */

	}, {
		key: 'patch',
		value: function patch(opt_body) {
			return this.sendAsync('PATCH', opt_body);
		}

		/**
   * Creates a new {@link WeDeploy} instance for handling the url resulting in the
   * union of the current url with the given paths.
   * @param {...string} paths Any number of paths.
   * @return {!WeDeploy} A new {@link WeDeploy} instance for handling the given paths.
   */

	}, {
		key: 'path',
		value: function path() {
			for (var _len2 = arguments.length, paths = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				paths[_key2] = arguments[_key2];
			}

			var wedeployClient = new (Function.prototype.bind.apply(WeDeploy, [null].concat([this.url()], paths)))();

			if (metal.core.isDefAndNotNull(this.auth_)) {
				wedeployClient.auth(this.auth_);
			}

			return wedeployClient.use(this.customTransport_);
		}

		/**
   * Sends message with the POST http verb.
   * @param {string=} opt_body Content to be sent as the request's body.
   * @return {!CancellablePromise}
   */

	}, {
		key: 'post',
		value: function post(opt_body) {
			return this.sendAsync('POST', opt_body);
		}

		/**
   * Sends message with the PUT http verb.
   * @param {string=} opt_body Content to be sent as the request's body.
   * @return {!CancellablePromise}
   */

	}, {
		key: 'put',
		value: function put(opt_body) {
			return this.sendAsync('PUT', opt_body);
		}

		/**
   * Adds the authentication information to the request.
   * @param {!ClientRequest} clientRequest
   * @protected
   */

	}, {
		key: 'resolveAuthentication_',
		value: function resolveAuthentication_(clientRequest) {
			if (!this.auth_) {
				return;
			}
			if (this.auth_.hasToken()) {
				clientRequest.header('Authorization', 'Bearer ' + this.auth_.token);
			} else {
				var credentials = this.auth_.email + ':' + this.auth_.password;
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

	}, {
		key: 'sendAsync',
		value: function sendAsync(method, body) {
			var transport = this.customTransport_ || TransportFactory.instance().getDefault();

			var clientRequest = this.createClientRequest_(method, body);

			return transport.send(clientRequest).then(this.decode);
		}

		/**
   * Sets the socket transport
   * @param {Object} socket implementation object.
   */

	}, {
		key: 'url',


		/**
   * Returns the URL used by this client.
   */
		value: function url() {
			return this.url_;
		}

		/**
   * Specifies {@link Transport} implementation.
   * @param {!Transport} transport The transport implementation that should be
   * used.
   */

	}, {
		key: 'use',
		value: function use(transport) {
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

	}, {
		key: 'watch',
		value: function watch(opt_params, opt_options) {
			if (typeof io$1 === 'undefined') {
				throw new Error('Socket.io client not loaded');
			}

			var clientRequest = this.createClientRequest_('GET', opt_params);
			var uri = new Uri(clientRequest.url());
			uri.addParametersFromMultiMap(clientRequest.params());

			opt_options = opt_options || {
				forceNew: true
			};
			opt_options.query = 'url=' + encodeURIComponent(uri.getPathname() + uri.getSearch());
			opt_options.path = opt_options.path || uri.getPathname();

			return io$1(uri.getHost(), opt_options);
		}

		/**
   * @param {boolean} opt_withCredentials
   */

	}, {
		key: 'withCredentials',
		value: function withCredentials(_withCredentials) {
			this.withCredentials_ = !!_withCredentials;
			return this;
		}
	}], [{
		key: 'data',
		value: function data(opt_dataUrl) {
			assertUriWithNoPath(opt_dataUrl, 'The data url should not have a path');

			if (metal.core.isString(opt_dataUrl)) {
				WeDeploy.dataUrl_ = opt_dataUrl;
			}

			var data = new DataApiHelper(WeDeploy);

			data.auth(WeDeploy.auth().currentUser);

			return data;
		}
	}, {
		key: 'auth',
		value: function auth(opt_authUrl) {
			if (metal.core.isString(opt_authUrl)) {
				WeDeploy.authUrl_ = opt_authUrl;
			}
			if (!WeDeploy.auth_) {
				WeDeploy.auth_ = new AuthApiHelper(WeDeploy);
			}
			return WeDeploy.auth_;
		}
	}, {
		key: 'socket',
		value: function socket(_socket) {
			io$1 = _socket;
		}

		/**
   * Static factory for creating WeDeploy client for the given url.
   * @param {string} url The url that the client should use for sending requests.
   */

	}, {
		key: 'url',
		value: function url(_url) {
			return new WeDeploy(_url).use(this.customTransport_);
		}
	}]);
	return WeDeploy;
}();

WeDeploy$1.isContentTypeJson = function (clientMessage) {
	var contentType = clientMessage.headers().get('content-type') || '';
	return contentType.indexOf('application/json') === 0;
};

WeDeploy$1.auth_ = null;
WeDeploy$1.authUrl_ = '';
WeDeploy$1.data_ = null;
WeDeploy$1.dataUrl_ = '';

/**
 * Provides a convenient interface for data transport.
 * @interface
 */

var NodeTransport = function (_Transport) {
	inherits(NodeTransport, _Transport);

	function NodeTransport() {
		classCallCheck(this, NodeTransport);
		return possibleConstructorReturn(this, (NodeTransport.__proto__ || Object.getPrototypeOf(NodeTransport)).apply(this, arguments));
	}

	createClass(NodeTransport, [{
		key: 'send',

		/**
   * @inheritDoc
   */
		value: function send(clientRequest) {
			var deferred = this.request(clientRequest.url(), clientRequest.method(), clientRequest.body(), clientRequest.headers(), clientRequest.params(), null, false);

			return deferred.then(function (response) {
				var clientResponse = new ClientResponse(clientRequest);
				clientResponse.body(response.body);
				clientResponse.statusCode(response.statusCode);
				clientResponse.statusText(http.STATUS_CODES[response.statusCode]);

				Object.keys(response.headers).forEach(function (name) {
					clientResponse.header(name, response.headers[name]);
				});

				return clientResponse;
			});
		}

		/**
   * Requests the url using XMLHttpRequest.
   * @param {!string} url
   * @param {!string} method
   * @param {?string} body
   * @param {MultiMap} opt_headers
   * @param {MultiMap} opt_params
   * @param {number=} opt_timeout
   * @return {CancellablePromise} Deferred ajax request.
   * @protected
   */

	}, {
		key: 'request',
		value: function request(url, method, body, opt_headers, opt_params, opt_timeout) {
			if (opt_params) {
				url = new Uri(url).addParametersFromMultiMap(opt_params).toString();
			}

			var options = {
				method: method,
				uri: url
			};

			if (opt_headers) {
				(function () {
					var headers = {};
					opt_headers.names().forEach(function (name) {
						headers[name] = opt_headers.getAll(name).join(', ');
					});

					options.headers = headers;
				})();
			}

			if (body) {
				options.body = body;
			}

			if (opt_timeout) {
				options.timeout = opt_timeout;
			}

			var connection;

			return new CancellablePromise(function (resolve, reject) {
				connection = _request(options, function (error, response) {
					if (error) {
						reject(error);
						return;
					}

					resolve(response);
				});
			}).thenCatch(function (reason) {
				connection.abort();
				throw reason;
			});
		}
	}]);
	return NodeTransport;
}(Transport);

TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME] = NodeTransport;
WeDeploy$1.socket(io);

WeDeploy$1.Filter = Filter;
WeDeploy$1.Geo = Geo;
WeDeploy$1.Query = Query;
WeDeploy$1.Range = Range;

// This is for backwards compatibility for previous versions that were using
// named exports.
WeDeploy$1.WeDeploy = WeDeploy$1;

module.exports = WeDeploy$1;

//# sourceMappingURL=api.js.map
