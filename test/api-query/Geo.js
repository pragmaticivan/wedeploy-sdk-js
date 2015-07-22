'use strict';

import Geo from '../../src/api-query/Geo';

describe('Geo', function() {
	describe('Geo.point', function() {
		it('should create a Geo.Point instance', function() {
			var point = Geo.point(10, 20);
			assert.ok(point instanceof Geo.Point);
			assert.deepEqual([10, 20], point.body());
			assert.deepEqual('[10,20]', point.toString());
		});
	});

	describe('Geo.line', function() {
		it('should create a Geo.Line instance', function() {
			var line = Geo.line('10,20', [10, 30], Geo.point(10, 40));
			assert.ok(line instanceof Geo.Line);

			var body = {
				type: 'linestring',
				coordinates: ['10,20', [10, 30], [10, 40]]
			};
			assert.deepEqual(body, line.body());

			var bodyStr = '{"type":"linestring","coordinates":["10,20",[10,30],[10,40]]}';
			assert.deepEqual(bodyStr, line.toString());
		});
	});

	describe('Geo.bbox', function() {
		it('should create a Geo.BoundingBox instance', function() {
			var bbox = Geo.bbox('0,20', Geo.point(20, 0));
			assert.ok(bbox instanceof Geo.BoundingBox);

			var body = {
				type: 'envelope',
				coordinates: ['0,20', [20, 0]]
			};
			assert.deepEqual(body, bbox.body());

			var bodyStr = '{"type":"envelope","coordinates":["0,20",[20,0]]}';
			assert.deepEqual(bodyStr, bbox.toString());
		});
	});

	describe('Geo.circle', function() {
		it('should create a Geo.Circle instance', function() {
			var circle = Geo.circle(Geo.point(20, 0), '2km');
			assert.ok(circle instanceof Geo.Circle);
			assert.deepEqual([20, 0], circle.getCenter());
			assert.strictEqual('2km', circle.getRadius());

			var body = {
				type: 'circle',
				coordinates: [20, 0],
				radius: '2km'
			};
			assert.deepEqual(body, circle.body());

			var bodyStr = '{"type":"circle","coordinates":[20,0],"radius":"2km"}';
			assert.deepEqual(bodyStr, circle.toString());
		});
	});

	describe('Geo.polygon', function() {
		it('should create a Geo.Polygon instance', function() {
			var polygon = Geo.polygon('0,0', [0, 30], Geo.point(40, 0))
				.hole('5,5', [5, 8], Geo.point(9, 5));
			assert.ok(polygon instanceof Geo.Polygon);

			var body = {
				type: 'polygon',
				coordinates: [['0,0', [0, 30], [40, 0]], ['5,5', [5, 8], [9, 5]]]
			};
			assert.deepEqual(body, polygon.body());

			var bodyStr = '{' +
				'"type":"polygon",' +
				'"coordinates":[["0,0",[0,30],[40,0]],["5,5",[5,8],[9,5]]]' +
				'}';
			assert.deepEqual(bodyStr, polygon.toString());
		});
	});
});
