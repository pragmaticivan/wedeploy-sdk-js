'use strict';

import Embodied from './Embodied';

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
      coordinates: points.map(point => Embodied.toBody(point)),
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
      coordinates: [Embodied.toBody(upperLeft), Embodied.toBody(lowerRight)],
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
      radius: radius,
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
      coordinates: [],
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
	 * @param {...*} points
	 * @return {Polygon} Returns the {@link Polygon} object itself, so calls can
	 *   be chained.
	 * @chainable
	 */
  hole(...points) {
    this.addCoordinates_(...points);
    return this;
  }
}
Geo.Polygon = Polygon;

export default Geo;
