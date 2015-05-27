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

}

export default Util;
