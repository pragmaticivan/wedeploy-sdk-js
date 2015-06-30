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
		if (basePath.charAt(basePath.length - 1) === '/') {
			basePath = basePath.substring(0, basePath.length - 1);
		}
		if (path.charAt(0) === '/') {
			path = path.substring(1);
		}
		return [basePath, path].join('/');
	}

	/**
	 * XmlHttpRequest's getAllResponseHeaders() method returns a string of
	 * response headers according to the format described on the spec:
	 * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
	 * This method parses that string into a user-friendly name/value pair
	 * object.
	 * @param {string} allHeaders All headers as string.
	 * @return {array.<object<string, string>>=}
	 */
	static parseResponseHeaders(allHeaders) {
		var headers = [];
		if (!allHeaders) {
			return headers;
		}
		var pairs = allHeaders.split('\u000d\u000a');
		for (var i = 0; i < pairs.length; i++) {
			var index = pairs[i].indexOf('\u003a\u0020');
			if (index > 0) {
				var name = pairs[i].substring(0, index);
				var value = pairs[i].substring(index + 2);
				headers.push({
					name: name,
					value: value
				});
			}
		}
		return headers;
	}

}

export default Util;
