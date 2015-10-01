'use strict';

import Aggregation from '../../src/api-query/Aggregation';
import Geo from '../../src/api-query/Geo';
import Range from '../../src/api-query/Range';

describe('Aggregation', function() {
	it('should get field, operator and value', function() {
		var aggregation = new Aggregation('myField', 'myOperator', 'myValue');
		assert.strictEqual('myField', aggregation.getField());
		assert.strictEqual('myOperator', aggregation.getOperator());
		assert.strictEqual('myValue', aggregation.getValue());
	});

	describe('Aggregation.avg', function() {
		it('should create an aggregation with the "avg" operator', function() {
			var aggregation = Aggregation.avg('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('avg', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.count', function() {
		it('should create an aggregation with the "count" operator', function() {
			var aggregation = Aggregation.count('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('count', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.distance', function() {
		it('should create an aggregation with the "geoDistance" operator from location and ranges', function() {
			var aggregation = Aggregation.distance(
				'myField',
				Geo.point(10, 10),
				Range.range(0, 100),
				Range.from(200)
			);

			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('geoDistance', aggregation.getOperator());

			var value = {
				location: [10, 10],
				ranges: [
					{
						from: 0,
						to: 100
					},
					{
						from: 200
					}
				]
			};
			assert.deepEqual(value, aggregation.getValue());
		});

		it('should add ranges through the "range" function', function() {
			var aggregation = Aggregation.distance(
				'myField',
				Geo.point(10, 10),
				Range.range(0, 100)
			);
			aggregation.range(Range.from(200))
				.range(-200, -100);

			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('geoDistance', aggregation.getOperator());

			var value = {
				location: [10, 10],
				ranges: [
					{
						from: 0,
						to: 100
					},
					{
						from: 200
					},
					{
						from: -200,
						to: -100
					}
				]
			};
			assert.deepEqual(value, aggregation.getValue());
		});

		it('should set the aggregation unit through the "unit" function', function() {
			var aggregation = Aggregation.distance(
				'myField',
				Geo.point(10, 10),
				Range.range(0, 100)
			);
			aggregation.unit('km');

			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('geoDistance', aggregation.getOperator());

			var value = {
				location: [10, 10],
				ranges: [{
					from: 0,
					to: 100
				}],
				unit: 'km'
			};
			assert.deepEqual(value, aggregation.getValue());
		});
	});

	describe('Aggregation.extendedStats', function() {
		it('should create an aggregation with the "extendedStats" operator', function() {
			var aggregation = Aggregation.extendedStats('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('extendedStats', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.histogram', function() {
		it('should create an aggregation with the "histogram" operator', function() {
			var aggregation = Aggregation.histogram('myField', 10);
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('histogram', aggregation.getOperator());
			assert.strictEqual(10, aggregation.getValue());
		});
	});

	describe('Aggregation.max', function() {
		it('should create an aggregation with the "max" operator', function() {
			var aggregation = Aggregation.max('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('max', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.min', function() {
		it('should create an aggregation with the "min" operator', function() {
			var aggregation = Aggregation.min('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('min', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.missing', function() {
		it('should create an aggregation with the "missing" operator', function() {
			var aggregation = Aggregation.missing('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('missing', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.range', function() {
		it('should create an aggregation with the "range" operator from ranges', function() {
			var aggregation = Aggregation.range(
				'myField',
				Range.range(0, 100),
				Range.from(200)
			);

			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('range', aggregation.getOperator());

			var value = [
				{
					from: 0,
					to: 100
				},
				{
					from: 200
				}
			];
			assert.deepEqual(value, aggregation.getValue());
		});

		it('should add ranges through the "range" function', function() {
			var aggregation = Aggregation.range('myField', Range.range(0, 100))
				.range(Range.from(200))
				.range(-200, -100);

			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('range', aggregation.getOperator());

			var value = [
				{
					from: 0,
					to: 100
				},
				{
					from: 200
				},
				{
					from: -200,
					to: -100
				}
			];
			assert.deepEqual(value, aggregation.getValue());
		});
	});

	describe('Aggregation.stats', function() {
		it('should create an aggregation with the "stats" operator', function() {
			var aggregation = Aggregation.stats('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('stats', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.sum', function() {
		it('should create an aggregation with the "sum" operator', function() {
			var aggregation = Aggregation.sum('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('sum', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.terms', function() {
		it('should create an aggregation with the "terms" operator', function() {
			var aggregation = Aggregation.terms('myField');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('terms', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});

	describe('Aggregation.field', function() {
		it('should create an aggregation', function() {
			var aggregation = Aggregation.field('myField', 'myOperator');
			assert.strictEqual('myField', aggregation.getField());
			assert.strictEqual('myOperator', aggregation.getOperator());
			assert.ok(!aggregation.getValue());
		});
	});
});
