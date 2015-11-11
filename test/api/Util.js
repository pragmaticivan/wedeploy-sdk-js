'use strict';

import Util from '../../src/api/Util';

describe('Util', function() {

	it('should parse urls', function() {
		assert.deepEqual(['localhost:8080', '/path/a', ''], Util.parseUrl('http://localhost:8080/path/a'));
		assert.deepEqual(['localhost:8080', '/path/a', ''], Util.parseUrl('//localhost:8080/path/a'));
		assert.deepEqual(['localhost:8080', '/path/a', ''], Util.parseUrl('localhost:8080/path/a'));
		assert.deepEqual(['', '/path/a', ''], Util.parseUrl('/path/a'));
		assert.deepEqual(['', '/path/a', '?foo=1'], Util.parseUrl('/path/a?foo=1'));
		assert.deepEqual(['localhost:8080', '/', ''], Util.parseUrl('localhost:8080'));
		assert.deepEqual(['localhost:8080', '/', ''], Util.parseUrl('localhost:8080/'));
	});

	it('should join paths', function() {
		assert.strictEqual('foo', Util.joinPaths('foo', ''));
		assert.strictEqual('/foo', Util.joinPaths('', 'foo'));
		assert.strictEqual('foo', Util.joinPaths('foo/', ''));
		assert.strictEqual('/foo', Util.joinPaths('', 'foo/'));
		assert.strictEqual('foo/bar', Util.joinPaths('foo/', '/bar'));
		assert.strictEqual('foo/bar', Util.joinPaths('foo/', 'bar'));
		assert.strictEqual('foo/bar', Util.joinPaths('foo', 'bar'));
		assert.strictEqual('foo/bar', Util.joinPaths('foo', '/bar'));
		assert.strictEqual('foo/bar/bazz', Util.joinPaths('foo', '/bar', 'bazz'));
	});

	it('should join paths with full urls', function() {
		assert.strictEqual('http://localhost:123', Util.joinPaths('http://localhost:123', ''));
	});

	it('should parse response headers', function() {
		var headers = 'Name\u003a\u0020Value\u000d\u000aName\u003a\u0020Value';
		assert.deepEqual([{
			name: 'Name',
			value: 'Value'
		}, {
			name: 'Name',
			value: 'Value'
		}], Util.parseResponseHeaders(headers));
	});
});
