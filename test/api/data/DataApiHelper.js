'use strict';

import WeDeploy from '../../../src/api/WeDeploy';

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
		it('raises an error if the data url has a path', function () {
			assert.throws(function(){
				var data = WeDeploy.data("http://data.project.wedeploy.me/extrapath");
			}, Error);
		});
	});

	describe('.delete()', function () {
		it('fails trying to create data without specifing the collection', function () {
			var data = WeDeploy.data();
			assert.throws(function() {
				data.delete(null);
			}, Error);
		});

		it('deletes a field', function (done) {
			RequestMock.intercept().reply(204);

			var data = WeDeploy.data();

			data.delete("collection/1/title")
				.then(response => {
					assert.strictEqual(204, response.statusCode());
					done();
				});

		});

		it('deletes a data rown', function (done) {
			RequestMock.intercept().reply(204);

			var data = WeDeploy.data();

			data.delete("collection/1")
				.then(response => {
					assert.strictEqual(204, response.statusCode());
					done();
				});
		});

		it('deletes a collection', function (done) {
			RequestMock.intercept().reply(204);

			var data = WeDeploy.data();

			data.delete("collection/1")
				.then(response => {
					assert.strictEqual(204, response.statusCode());
					done();
				});
		});

	});

	describe('.update()', function(){
		context('when using invalid params', function(){
			it('fails trying to create data without specifing the collection', function () {
				var data = WeDeploy.data();
				assert.throws(function() {
					data.update(null, {"ping": "pong"});
				}, Error);
			});

			it('fails trying to create data without specifying the data param', function () {
				var data = WeDeploy.data();
				assert.throws(function() {
					data.update("collection", null);
				}, Error);
			});
		});

		context('when updating with one object', function(){
			it('updates an object', function (done) {
				RequestMock.intercept().reply(200, '{"id": 1, "ping": "pongUpdated"}');

				var data = WeDeploy.data();

				data.update("collection/1", {"ping": "pongUpdated"})
					.then(response => {
						assert.strictEqual('{"id": 1, "ping": "pongUpdated"}', response);
						done();
					});
			});
		});

		context('when updating with one object and a new key', function(){
			it('updates a value and adds the new key to the object', function (done) {
				RequestMock.intercept().reply(200, '{"id": 1, "ping": "pongUpdated", "newKey": "newValue"}');

				var data = WeDeploy.data();

				data.update("collection/1", {"ping": "pongUpdated", "newKey": "newValue"})
					.then(response => {
						assert.strictEqual('{"id": 1, "ping": "pongUpdated", "newKey": "newValue"}', response);
						done();
					});
			});
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

		context('when creating with one object', function() {
			it('creates new data', function (done) {
				RequestMock.intercept().reply(200, '{"id": 1, "ping": "pong"}');

				var data = WeDeploy.data();

				data.create("collection", {"ping": "pong"})
					.then(response => {
						assert.strictEqual('{"id": 1, "ping": "pong"}', response);
						done();
					});
			});
		});

		context('when creating with one array', function() {
			it('creates multiple data', function (done) {
				RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

				var data = WeDeploy.data();

				data.create("collection", [
					{"ping": "pong1"},
					{"ping": "pong2"}
				])
				.then( response => {
					assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
					done();
				});
			});
		});

		context('when creating with one object adding a new key', function() {

		});

		context('when creating with one array with a new object key', function() {

		});

	});

	describe('.get()', function () {
		it('should do what...', function (done) {
			// RequestMock.intercept().reply(200, '{"id": 1, "ping": "pong"}');

			var data = WeDeploy.data("http://data.datademo.wedeploy.me");
			data.limit(1).get("food").then(response => {
				console.log(response);
				done();
			});
		});
	});


	describe('.limit()', function () {
		// it('should send request with query limit in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"limit":0}');
		// 	WeDeploy.url('http://localhost/url').limit(0).post().then(function(response) {
		// 		assert.strictEqual('{"limit":0}', response.request().body());
		// 		done();
		// 	});
		// });

		// it('should send request with multiple queries in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"offset":0,"limit":50}');
		// 	WeDeploy.url('http://localhost/url').offset(0).limit(50).post().then(function(response) {
		// 		assert.strictEqual('{"offset":0,"limit":50}', response.request().body());
		// 		done();
		// 	});
		// });
	});


	describe('.count()', function () {
		// it('should send request with query count in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"type":"count"}');
		// 	WeDeploy.url('http://localhost/url').count().post().then(function(response) {
		// 		assert.strictEqual('{"type":"count"}', response.request().body());
		// 		done();
		// 	});
		// });
	});

	describe('.orderBy()', function(){
		// * prioritize body instead of query
		// it('sends a request and prioritize the body instead of query in the body', function (done) {
		// 	RequestMock.intercept().reply(200, '"body"');
		// 	WeDeploy.data().orderBy('id', 'desc').post('body').then(function(response) {
		// 		assert.strictEqual('"body"', response.request().body());
		// 		done();
		// 	});
		// });

		// * send with query sort
		// * send with one param
		// * send with two params
		// * get
		// * post

		// it('sends request with query sort in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"sort":[{"id":"desc"}]}');
		// 	WeDeploy.data().orderBy('id', 'desc').post().then(function(response) {
		// 		assert.strictEqual('{"sort":[{"id":"desc"}]}', response.request().body());
		// 		done();
		// 	});
		// });

		// it('orders using one param', function () {
		// 	RequestMock.intercept().reply(200, '[{"id": 1, "ping": "pong1"}, {"id": 2, "ping": "pong2"}]');

		// 	var data = WeDeploy.data();

		// 	console.log(data.orderBy("id", "asc"));
		// });
	});

	describe('.offset()', function () {
		// it('should send request with query offset in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"offset":0}');
		// 	WeDeploy.url('http://localhost/url').offset(0).post().then(function(response) {
		// 		assert.strictEqual('{"offset":0}', response.request().body());
		// 		done();
		// 	});
		// });
	});

	describe('.search()', function () {
		// it('should send request with query search in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"search":[{"name":{"operator":"=","value":"foo"}}]}');
		// 	WeDeploy.url('http://localhost/url').search('name', '=', 'foo').post().then(function(response) {
		// 		assert.strictEqual('{"search":[{"name":{"operator":"=","value":"foo"}}]}', response.request().body());
		// 		done();
		// 	});
		// });
	});

	describe('.where()', function () {
		// it('should send request with query filter in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"filter":[{"name":{"operator":"=","value":"foo"}}]}');
		// 	WeDeploy.url('http://localhost/url').filter('name', '=', 'foo').post().then(function(response) {
		// 		assert.strictEqual('{"filter":[{"name":{"operator":"=","value":"foo"}}]}', response.request().body());
		// 		done();
		// 	});
		// });
	});

	describe('.highlight()', function () {
		// it('should send request with query highlight in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"highlight":["field"]}');
		// 	WeDeploy.url('http://localhost/url').highlight('field').post().then(function(response) {
		// 		assert.strictEqual('{"highlight":["field"]}', response.request().body());
		// 		done();
		// 	});
		// });
	});

	describe('.aggregate()', function () {
		// it('should send request with query aggregate in the body', function(done) {
		// 	RequestMock.intercept().reply(200, '{"aggregation":[{"field":{"name":"name"}}]}');
		// 	WeDeploy.url('http://localhost/url').aggregate('name', 'field').post().then(function(response) {
		// 		assert.strictEqual('{"aggregation":[{"field":{"name":"name"}}]}', response.request().body());
		// 		done();
		// 	});
		// });
		it('sends a request with query aggregate as param');
	});

});
