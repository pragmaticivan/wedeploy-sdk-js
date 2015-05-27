/**
 * Provides a convenient interface for data transport.
 * @interface
 */
class Util {

  /**
   * Parses the url separating the domain and port from the path.
   * @param {string} url
   * @return {array} Array containing the url domain and path.
   * @protected
   */
  static parseUrl(url) {
    var base;
    var path;
    var domainAt = url.indexOf('//');
    if (domainAt > -1) {
      url = url.substring(domainAt + 2);
    }
    base = url.substring(0, url.indexOf('/'));
    path = url.substring(url.indexOf('/'));
    return [base, path];
  }

  /**
   * Joins two paths.
   * @param {string} basePath
   * @param {string} path
   */
  static joinPaths(basePath, path) {
    if (basePath.charAt(basePath.length-1) === '/') {
      basePath = basePath.substring(0, basePath.length-1);
    }
    if (path.charAt(0) === '/') {
      path = path.substring(1);
    }
    return [basePath, path].join('/');
  }

}

export default Util;
