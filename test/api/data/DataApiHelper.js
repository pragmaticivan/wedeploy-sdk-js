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

	describe('query formation', function () {
		it('creates the and add virtual filters into the query', function () {

			var client = WeDeploy.data();

		  client.where('age','>','18')
				.or('points','>','7')
				.orderBy('id', 'asc')
				.limit(10)
				.offset(2)

			client.addFiltersToQuery_();

			var body = {"body_":{"sort":[{"id":"asc"}],"limit":10,"offset":2,"filter":[{"or":[{"and":[{"age":{"operator":">","value":"18"}}]},{"points":{"operator":">","value":"7"}}]}]}};

			assert.strictEqual(JSON.stringify(body), JSON.stringify(client.query_));

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
		it('sends request with query limit in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 1, "ping": "pong1"}]');

			WeDeploy
				.data()
				.limit(1)
				.get("collection")
				.then( response => {
					assert.strictEqual('[{"id": 1, "ping": "pong1"}]', response);
					done();
				});
		});

		it('builds the limit into the query body', function () {
			var dataClient = WeDeploy
												.data()
												.limit(99);

			assert.strictEqual(dataClient.query_.body_.limit, 99);
		});
	});

	describe('.count()', function () {
		it('sends request with query count in the body', function(done) {
			RequestMock.intercept().reply(200, '5');

			WeDeploy
				.data()
				.count()
				.get('food').then(function(response) {
					assert.strictEqual('5', response);
					done();
				});

		});

		it('builds the count type into the query body', function () {
			var dataClient = WeDeploy
												.data()
												.count();

			assert.strictEqual(dataClient.query_.body_.type, "count");
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

		it('builds the offset into the query body', function () {
			var dataClient = WeDeploy
												.data()
												.offset(2);

			assert.strictEqual(dataClient.query_.body_.offset, 2);
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

		it('builds the highlight into the query body', function () {
			var dataClient = WeDeploy
												.data()
												.highlight("highlighted");

			assert.deepEqual(dataClient.query_.body_.highlight, ["highlighted"]);
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

		it('builds the orderBy into the query body', function () {
			var dataClient = WeDeploy
												.data()
												.orderBy('id', 'asc');

			assert.deepEqual(dataClient.query_.body_.sort,[{"id":"asc"}]);
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

		it('builds the none query into the query body', function () {
			var dataClient = WeDeploy
												.data()
												.none('name','cuscuz','tapioca');
			dataClient.addFiltersToQuery_();

			var body = {"body_":{"filter":[{"and":[{"name":{"operator":"none","value":["cuscuz","tapioca"]}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the match query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.match('name','cuscuz');
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"name":{"operator":"match","value":"cuscuz"}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the similar query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.similar('name','cusc');
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"name":{"operator":"similar","value":{"query":"cusc"}}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the lt query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.lt('size',30);
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"size":{"operator":"<","value":30}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the lte query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.lte('size',30);
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"size":{"operator":"<=","value":30}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the any query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.any('name','cuscuz','tapioca');
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"name":{"operator":"any","value":["cuscuz","tapioca"]}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the boundingBox query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.boundingBox('shape', Geo.boundingBox('20,0', [0, 20]));
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"shape":{"operator":"gp","value":["20,0",[0,20]]}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the distance query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.distance('point', Geo.circle([0, 0], 2));
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"point":{"operator":"gd","value":{"location":[0,0],"max":2}}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the range query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.range('points', 12, 15);
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"points":{"operator":"range","value":{"from":12,"to":15}}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the filter query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.where('name', '=', 'foo');
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"and":[{"name":{"operator":"=","value":"foo"}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the or query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.where('name', '=', 'foo')
												.or('name', '!=', 'bar');
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"filter":[{"or":[{"and":[{"name":{"operator":"=","value":"foo"}}]},{"name":{"operator":"!=","value":"bar"}}]}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
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

		it('builds the aggregate query into the query body', function(){
			var dataClient = WeDeploy
												.data()
												.aggregate('name', 'field');
			dataClient.addFiltersToQuery_();

			const body = {"body_":{"aggregation":[{"field":{"name":"name"}}]}};

			assert.strictEqual(JSON.stringify(dataClient.query_), JSON.stringify(body));
		});
	});

	describe('.search()', function () {
		context('when using invalid params', function(){
			it('fails trying to search data without specifing the collection', function () {
				WeDeploy.socket();
				var data = WeDeploy.data();
				assert.throws(function() {
					data.search(null);
				}, Error);
			});

			it('builds the query without any conditional on search and throws an error', function () {
				var data = WeDeploy.data();
					assert.throws(function() {
						data.search('collection');
					}, Error);
			});
		});

		context('when using valid params', function(){
			it('sends request with query search in the body', function(done) {
				RequestMock.intercept().reply(200, '{"total":1,"documents":[{"id":2,"ping":"pong1"}],"scores":{"2":0.13102644681930542},"queryTime":1}');

				WeDeploy
					.data()
					.where('name', '=', 'foo')
					.where('name', '=', 'bar')
					.search('food')
					.then(function(response) {
						assert.strictEqual('{"total":1,"documents":[{"id":2,"ping":"pong1"}],"scores":{"2":0.13102644681930542},"queryTime":1}', response);
						done();
					});
			});

			it('builds the query as search type', function () {
				const client = WeDeploy
					.data()
					.where('name', '=', 'foo')
					.where('name', '=', 'bar')
					.onSearch_()
					.addFiltersToQuery_();

				const body = '{"body_":{"search":[{"and":[{"name":{"operator":"=","value":"foo"}},{"name":{"operator":"=","value":"bar"}}]}]}}';
				assert.strictEqual(body, JSON.stringify(client.query_));
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

});
