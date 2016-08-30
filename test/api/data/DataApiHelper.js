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

		// context('when creating with one object adding a new key', function() {

		// });

		// context('when creating with one array with a new object key', function() {

		// });

	});

	describe('.limit()', function () {
		it('should send request with query limit in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 1, "ping": "pong1"}]');

			var data = WeDeploy.data();

			data.limit(0)
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

			WeDeploy.data()
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

			WeDeploy.data().offset(2).get('food').then(response => {
				assert.strictEqual('[{"id": 1, "ping": "pong1"}]', response);
				done();
			});
		});
	});

	describe('.search()', function () {
		it('should send request with query search in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy.data().search('name', '=', 'foo').get('food').then(function(response) {
				assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
				done();
			});
		});
	});

	describe('.where()', function () {
		it('should send request with query filter in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy.data().where('name', '=', 'foo').get('food').then(function(response) {
				assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
				done();
			});
		});
	});

	describe('.highlight()', function () {
		it('should send request with query highlight in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy.data().highlight('field').get('food').then(function(response) {
				assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
				done();
			});
		});
	});

	describe('.aggregate()', function () {
		it('should send request with query aggregate in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy.data().aggregate('name', 'field').get('food').then(function(response) {
				assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
				done();
			});
		});
	});

	describe('.orderBy()', function(){
		it('sends request with query sort in the body', function(done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			WeDeploy.data().orderBy('id', 'asc').get('food').then(function(response) {
				assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
				done();
			});
		});
	});


	describe.only('.get()', function () {
		it('returns all data of a collection', function (done) {
			RequestMock.intercept().reply(200, '[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]');

			var data = WeDeploy.data("http://data.datademo.wedeploy.me");
			data.get("food").then(response => {
				assert.strictEqual('[{"id": 2, "ping": "pong1"}, {"id": 3, "ping": "pong2"}]', response);
				done();
			});
		});
	});

});
