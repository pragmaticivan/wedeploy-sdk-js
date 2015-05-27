import Util from '../src/Util';

describe('Util', function() {

  it('should parse urls', function() {
    assert.deepEqual(['localhost:8080', '/path/a'], Util.parseUrl('http://localhost:8080/path/a'));
    assert.deepEqual(['localhost:8080', '/path/a'], Util.parseUrl('//localhost:8080/path/a'));
    assert.deepEqual(['localhost:8080', '/path/a'], Util.parseUrl('localhost:8080/path/a'));
    assert.deepEqual(['', '/path/a'], Util.parseUrl('/path/a'));
  });

  it('should join paths', function() {
    assert.strictEqual('foo/bar', Util.joinPaths('foo/', '/bar'));
    assert.strictEqual('foo/bar', Util.joinPaths('foo/', 'bar'));
    assert.strictEqual('foo/bar', Util.joinPaths('foo', 'bar'));
    assert.strictEqual('foo/bar', Util.joinPaths('foo', '/bar'));
  });

});
