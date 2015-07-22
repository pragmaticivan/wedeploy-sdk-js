'use strict';

import Embodied from './Embodied';

/**
 * Class responsible for building different types of geometric
 * shapes.
 */
class Geo {
	/**
	 * Creates a new `Geo.BoundingBox` instance.
	 * @param {*} upperLeft The upper left point.
	 * @param {*} lowerRight The lower right point.
	 * @return {Geo.BoundingBox}
	 * @static
	 */
	static bbox(upperLeft, lowerRight) {
		return new Geo.BoundingBox(upperLeft, lowerRight);
	}

	/**
	 * Creates a new `Geo.Circle` instance.
	 * @param {*} center The circle's center coordinate.
	 * @param {string} radius The circle's radius.
	 * @return {Geo.Circle}
	 * @static
	 */
	static circle(center, radius) {
		return new Geo.Circle(center, radius);
	}

	/**
	 * Creates a new `Geo.Line` instance.
	 * @param {...*} points This line's points.
	 * @return {Geo.Line}
	 * @static
	 */
	static line(...points) {
		return new Geo.Line(...points);
	}

	/**
	 * Creates a new `Geo.Point` instance.
	 * @param {number} lat The latitude coordinate
	 * @param {number} lon The longitude coordinate
	 * @return {Geo.Point}
	 * @static
	 */
	static point(lat, lon) {
		return new Geo.Point(lat, lon);
	}

	/**
	 * Creates a new `Geo.Polygon` instance.
	 * @param {...*} points This polygon's points.
	 * @return {Geo.Polygon}
	 * @static
	 */
	static polygon(...points) {
		return new Geo.Polygon(...points);
	}
}

/**
 * Class that represents a point coordinate.
 */
class Point extends Embodied {
	/**
	 * Constructs a `Geo.Point` instance.
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
 */
class Line extends Embodied {
	/**
	 * Constructs a `Geo.Line` instance.
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
 */
class BoundingBox extends Embodied {
	/**
	 * Constructs a `Geo.BoundingBox` instance.
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
 */
class Circle extends Embodied {
	/**
	 * Constructs a `Geo.Circle` instance.
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
 */
class Polygon extends Embodied {
	/**
	 * Constructs a `Geo.Polygon` instance.
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

export default Geo;
