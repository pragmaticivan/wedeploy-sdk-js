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

});
