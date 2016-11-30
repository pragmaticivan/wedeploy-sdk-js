'use strict';

import Geo from '../../src/api-query/Geo';

describe('Geo', function() {
	describe('Geo.point', function() {
		it('should create a Geo.Point instance', function() {
			const point = Geo.point(10, 20);
			assert.ok(point instanceof Geo.Point);
			assert.deepEqual([10, 20], point.body());
			assert.deepEqual('[10,20]', point.toString());
		});
	});

	describe('Geo.line', function() {
		it('should create a Geo.Line instance', function() {
			const line = Geo.line('10,20', [10, 30], Geo.point(10, 40));
			assert.ok(line instanceof Geo.Line);

			const body = {
				type: 'linestring',
				coordinates: ['10,20', [10, 30], [10, 40]]
			};
			assert.deepEqual(body, line.body());

			const bodyStr = '{"type":"linestring","coordinates":["10,20",[10,30],[10,40]]}';
			assert.deepEqual(bodyStr, line.toString());
		});
	});

	describe('Geo.boundingBox', function() {
		it('should create a Geo.BoundingBox instance', function() {
			const boundingBox = Geo.boundingBox('0,20', Geo.point(20, 0));
			assert.ok(boundingBox instanceof Geo.BoundingBox);
			assert.deepEqual(['0,20', [20, 0]], boundingBox.getPoints());

			const body = {
				type: 'envelope',
				coordinates: ['0,20', [20, 0]]
			};
			assert.deepEqual(body, boundingBox.body());

			const bodyStr = '{"type":"envelope","coordinates":["0,20",[20,0]]}';
			assert.deepEqual(bodyStr, boundingBox.toString());
		});
	});

	describe('Geo.circle', function() {
		it('should create a Geo.Circle instance', function() {
			const circle = Geo.circle(Geo.point(20, 0), '2km');
			assert.ok(circle instanceof Geo.Circle);
			assert.deepEqual([20, 0], circle.getCenter());
			assert.strictEqual('2km', circle.getRadius());

			const body = {
				type: 'circle',
				coordinates: [20, 0],
				radius: '2km'
			};
			assert.deepEqual(body, circle.body());

			const bodyStr = '{"type":"circle","coordinates":[20,0],"radius":"2km"}';
			assert.deepEqual(bodyStr, circle.toString());
		});
	});

	describe('Geo.polygon', function() {
		it('should create a Geo.Polygon instance', function() {
			const polygon = Geo.polygon('0,0', [0, 30], Geo.point(40, 0))
				.hole('5,5', [5, 8], Geo.point(9, 5));
			assert.ok(polygon instanceof Geo.Polygon);

			const body = {
				type: 'polygon',
				coordinates: [['0,0', [0, 30], [40, 0]], ['5,5', [5, 8], [9, 5]]]
			};
			assert.deepEqual(body, polygon.body());

			const bodyStr = '{' +
				'"type":"polygon",' +
				'"coordinates":[["0,0",[0,30],[40,0]],["5,5",[5,8],[9,5]]]' +
				'}';
			assert.deepEqual(bodyStr, polygon.toString());
		});
	});
});
