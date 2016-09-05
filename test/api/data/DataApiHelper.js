'use strict';

import WeDeploy from '../../../src/api/WeDeploy';
import Geo from '../../../src/api-query/Geo';
import Range from '../../../src/api-query/Range';

describe('DataApiHelper', function() {
	afterEach(function() {
		WeDeploy.data_ = null;
		RequestMock.teardown();
	});

	beforeEach(function() {
		RequestMock.setup();
	});

	describe('WeDeploy.data()', function() {
		it('returns same instance', function() {
			var data = WeDeploy.data();
			assert.strictEqual(data, WeDeploy.data());
		});

		it('returns instance with url filled', function () {
			var data = WeDeploy.data("http://host");
			assert.strictEqual(data, WeDeploy.data("http://host"));
		});

		it('raises an error if the data url has a path', function () {
			assert.throws(function(){
				var data = WeDeploy.data("http://data.project.wedeploy.me/extrapath");
			}, Error);
		});
	});

	describe('.create()', function(){
		context('when using invalid params', function(){
			it('fails trying to create data without specifing the collection', function () {
				var data = WeDeploy.data();
				assert.throws(function() {
					data.create(null, {"ping": "pong"});
				}, Error);
			});

			it('fails trying to create data without specifying the data param', function () {
				var data = WeDeploy.data();
				assert.throws(function() {
					data.create("collection", null);
				}, Error);
			});
		});

		context('when creating and it returns an error', function(){
			it('fails updating because of an server error ', function (done) {
				RequestMock.intercept().reply(500, '{"error": "Error 500"}');

				WeDeploy
					.data()
					.create("collection", {"ping": "pong"})
					.catch(error => {
						assert.strictEqual('{"error": "Error 500"}', error);
						done();
					});
			});
		});

		context('when creating with one object', function() {
			it('creates new data', function (done) {
				RequestMock.intercept().reply(200, '{"id": 1, "ping": "pong"}');

				WeDeploy
					.data()
					.create("collection", {"ping": "pong"})
					.then(response => {
						assert.strictEqual('{"id": 1, "ping": "pong"}', response);
						done();
					});
			});
		});

		context('when creating with one array', function() {
			it('creates multiple data', function (done) {
				RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

				WeDeploy
					.data()
					.create("collection", [
						{"ping": "pong1"},
						{"ping": "pong2"}
					])
					.then( response => {
						assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
						done();
					});
			});
		});
	});

	describe('.update()', function(){
		context('when using invalid params', function(){
			it('fails trying to updating data without specifing the collection', function () {
				assert.throws(function() {
					WeDeploy.data().update(null, {"ping": "pong"});
				}, Error);
			});

			it('fails trying to update data without specifying the data param', function () {
				assert.throws(function() {
					WeDeploy.data().update("collection", null);
				}, Error);
			});
		});

		context('when updating and it returns an error', function(){
			it('fails updating because of an server error ', function (done) {
				RequestMock.intercept().reply(500, '{"error": "Error 500"}');

				WeDeploy
					.data()
					.update("collection/242424", {"ping": "pong"})
					.catch(error => {
						assert.strictEqual('{"error": "Error 500"}', error);
						done();
					});
			});

			it('fails updating because the row doesn\'t exist', function (done) {
				RequestMock.intercept().reply(404, '{"error": "Error 404"}');

				WeDeploy
					.data()
					.update("collection/242424", {"ping": "pong"})
					.catch(error => {
						assert.strictEqual('{"error": "Error 404"}', error);
						done();
					});
			});
		});

		context('when updating with one object', function(){
			it('updates an object', function (done) {
				RequestMock.intercept().reply(200, '{"id": 1, "ping": "pongUpdated"}');

				WeDeploy
					.data()
					.update("collection/1", {"ping": "pongUpdated"})
					.then(response => {
						assert.strictEqual('{"id": 1, "ping": "pongUpdated"}', response);
						done();
					});
			});
		});

		context('when updating with one object and a new key', function(){
			it('updates a value and adds the new key to the object', function (done) {
				RequestMock.intercept().reply(200, '{"id": 1, "ping": "pongUpdated", "newKey": "newValue"}');

				WeDeploy
					.data()
					.update("collection/1", {"ping": "pongUpdated", "newKey": "newValue"})
					.then(response => {
						assert.strictEqual('{"id": 1, "ping": "pongUpdated", "newKey": "newValue"}', response);
						done();
					});
			});
		});
	});

	describe('.delete()', function () {
		context('when using invalid params', function() {
			it('fails trying to create data without specifying the collection', function () {
				assert.throws(function() {
					WeDeploy.data().delete(null);
				}, Error);
			});
		});

		context('when updating and it returns an error', function() {
			it('fails updating because of an server error ', function (done) {
				RequestMock.intercept().reply(500, '{"error": "Error 500"}');

				WeDeploy
					.data()
					.delete("collection/242424", {"ping": "pong"})
					.catch(error => {
						assert.strictEqual('{"error": "Error 500"}', error);
						done();
					});
			});

			it('fails updating because the row doesn\'t exist', function (done) {
				RequestMock.intercept().reply(404, '{"error": "Error 404"}');

				WeDeploy
					.data()
					.delete("collection/242424", {"ping": "pong"})
					.catch(error => {
						assert.strictEqual('{"error": "Error 404"}', error);
						done();
					});
			});
		});

		context('when successfuly deletes data', function() {
			it('deletes a field', function (done) {
				RequestMock.intercept().reply(204);

				WeDeploy
					.data()
					.delete("collection/1/title")
					.then(response => {
						assert.strictEqual(undefined, undefined);
						done();
					});

			});

			it('deletes a data rown', function (done) {
				RequestMock.intercept().reply(204);

				WeDeploy
					.data()
					.delete("collection/1")
					.then(response => {
						assert.strictEqual(undefined, undefined);
						done();
					});
			});

			it('deletes a collection', function (done) {
				RequestMock.intercept().reply(204);

				WeDeploy
					.data()
					.delete("collection/1")
					.then(response => {
						assert.strictEqual(undefined, undefined);
						done();
					});
			});
		});
	});

	describe('.limit()', function () {
		it('should send request with query limit in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 1, "ping": "pong1"}]');

			WeDeploy
				.data()
				.limit(0)
				.get("collection")
				.then( response => {
					assert.strictEqual('[{"id": 1, "ping": "pong1"}]', response);
					done();
				});
		});
	});

	describe('.count()', function () {
		it('should send request with query count in the body', function(done) {
			RequestMock.intercept().reply(200, '5');

			WeDeploy
				.data()
				.count()
				.get('food').then(function(response) {
					assert.strictEqual('5', response);
					done();
				});

		});
	});

	describe('.offset()', function () {
		it('should send request with query offset in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 1, "ping": "pong1"}]');

			WeDeploy
				.data()
				.offset(2)
				.get('food')
				.then(response => {
					assert.strictEqual('[{"id": 1, "ping": "pong1"}]', response);
					done();
				});
		});
	});

	describe('.onSearch()', function () {
		it('should send request with query search in the body', function(done) {
			RequestMock.intercept().reply(200, '{"total":1,"documents":[{"id":2,"ping":"pong1"}],"scores":{"2":0.13102644681930542},"queryTime":1}');

			WeDeploy
				.data()
				.where('name', '=', 'foo')
				.where('name', '=', 'bar')
				.onSearch()
				.get('food')
				.then(function(response) {
					assert.strictEqual('{"total":1,"documents":[{"id":2,"ping":"pong1"}],"scores":{"2":0.13102644681930542},"queryTime":1}', response);
					done();
				});
		});

		it('should build the query as search type', function () {
			const client = WeDeploy
				.data()
				.where('name', '=', 'foo')
				.where('name', '=', 'bar')
				.onSearch()
				.addFiltersToQuery_();

			const body = '{"body_":{"search":[{"and":[{"name":{"operator":"=","value":"foo"}},{"name":{"operator":"=","value":"bar"}}]}]}}';
			assert.strictEqual(body, JSON.stringify(client.query_));
		});
	});

	describe('.where()', function () {
		it('should send request with query where in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy
				.data()
				.where('name', '=', 'foo')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
					done();
				});
		});
	});

	describe('.or()', function () {
		it('should thrown an error when using or without any conditional before', function () {
			assert.throws(function(){
				WeDeploy
				.data()
				.or('name', '!=', 'bar');
			}, Error);
		});
		it('should send request with query or in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "foo"}]');
			WeDeploy
				.data()
				.where('name', '=', 'foo')
				.or('name', '!=', 'bar')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "foo"}]', response);
					done();
				});
		});
	});

	describe('.highlight()', function () {
		it('should send request with query highlight in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy
				.data()
				.highlight('field')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
					done();
				});
		});
	});

	describe('.aggregate()', function () {
		it('should send request with query aggregate in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy
				.data()
				.aggregate('name', 'field')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
					done();
				});
		});
	});

	describe('.orderBy()', function(){
		it('sends request with query sort in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy
				.data()
				.orderBy('id', 'asc')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
					done();
				});
		});
	});

	describe('.get()', function () {
		context('when using invalid params', function(){
			it('fails trying to retrieve data without specifing the collection', function () {
				var data = WeDeploy.data();
				assert.throws(function() {
					data.get(null);
				}, Error);
			});
		});

		context('when using valid params', function(){
			it('returns all data of a collection', function (done) {
				RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

				WeDeploy
					.data()
					.get("food")
					.then(response => {
						assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
						done();
					});
			});
		});
	});

	describe('query formation', function () {
		it('creates the and add virtual filters into the query', function () {

			var client = WeDeploy.data();

		  client.where('age','>','18')
				.match('name','tester')
				.or('points','>','7')
				.any('category', 'student', 'team1')
				.orderBy('id', 'asc')
				.limit(10)
				.offset(2)

			client.addFiltersToQuery_();

			var body = {"body_":{"sort":[{"id":"asc"}],"limit":10,"offset":2,"filter":[{"and":[{"or":[{"and":[{"age":{"operator":">","value":"18"}},{"name":{"operator":"match","value":"tester"}}]},{"points":{"operator":">","value":"7"}}]},{"category":{"operator":"any","value":["student","team1"]}}]}]}};

			assert.strictEqual(JSON.stringify(body), JSON.stringify(client.query_));

		});
	});

	describe('.watch()', function () {
		context('when using invalid params', function(){
			it('fails trying to watch data without specifing the collection', function () {
				WeDeploy.socket();
				var data = WeDeploy.data();
				assert.throws(function() {
					data.watch(null);
				}, Error);
			});
		});

		context('when using valid params', function(){
			it('returns all data of a collection', function (done) {

				WeDeploy.socket(function(url, opts) {
					assert.deepEqual({
						forceNew: true,
						path: '/fruits',
						query: 'url=' + encodeURIComponent('/fruits')
					}, opts);
					done();
				});

				WeDeploy.data().watch('fruits');
				WeDeploy.socket();
			});
		});
	});

	describe('.none()', function () {
		it('should send request with query none in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "melancia"}]');

			WeDeploy
				.data()
				.none('name','cuscuz','tapioca')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "melancia"}]', response);
					done();
				});
		});
	});

	describe('.match()', function () {
		it('should send request with query match in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "cuscuz"}]');

			WeDeploy
				.data()
				.match('name','cuscuz')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "cuscuz"}]', response);
					done();
				});
		});
	});

	describe('.similar()', function () {
		it('should send request with query similar in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "cuscuz"}]');

			WeDeploy
				.data()
				.similar('name','cusc')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "cuscuz"}]', response);
					done();
				});
		});
	});

	describe('.lt()', function () {
		it('should send request with query lt in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "cuscuz", "size": 10}]');

			WeDeploy
				.data()
				.lt('size',30)
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "cuscuz", "size": 10}]', response);
					done();
				});
		});
	});

	describe('.lte()', function () {
		it('should send request with query lte in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "cuscuz", "size": 10}]');

			WeDeploy
				.data()
				.lte('size',30)
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "cuscuz", "size": 10}]', response);
					done();
				});
		});
	});

	describe('.any()', function () {
		it('should send request with query any in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "cuscuz"}]');

			WeDeploy
				.data()
				.any('name','cuscuz','tapioca')
				.get('food')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "cuscuz"}]', response);
					done();
				});
		});
	});

	describe('.boundingBox()', function () {
		it('should send request with query boundingBox in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "cuscuzeria"}]');

			WeDeploy
				.data()
				.boundingBox('shape', Geo.boundingBox('20,0', [0, 20]))
				.get('restaurants')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "cuscuzeria"}]', response);
					done();
				});
		});
	});

	describe('.distance()', function () {
		it('should send request with query distance in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "cuscuzeria"}]');

			WeDeploy
				.data()
				.distance('point', Geo.circle([0, 0], 2))
				.get('restaurants')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "cuscuzeria"}]', response);
					done();
				});
		});
	});

	describe('.range()', function () {
		it('should send request with query distance in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "name": "cuscuzeria", "points": 13}]');

			WeDeploy
				.data()
				.range('points', 12, 15)
				.get('restaurants')
				.then(function(response) {
					assert.strictEqual('[{"id": 2, "name": "cuscuzeria", "points": 13}]', response);
					done();
				});
		});
	});

});
