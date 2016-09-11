# WeDeploy SDK for JavaScript
[![Build Status][build-status-svg]][build-status-link]
[![Test Coverage][coverage-status-svg]][coverage-status-link]
[![License][license-svg]][license-link]
[![Npm Version][npm-svg]][npm-link]

[![Sauce Test Status](https://saucelabs.com/browser-matrix/launchpad-api.svg)](https://travis-ci.org/wedeploy/api-js)

An SDK that gives you access to the powerful WeDeploy cloud platforma from your JavaScript app. For more information on WeDeploy and its features, see [the website](https://wedeploy.com) or [the JavaScript guide](https://wedeploy.com/docs).

## Getting Started

The easiest way to integrate the WeDeploy SDK into your JavaScript project is through the [npm module](https://npmjs.org/wedeploy).
However, if you want to use a pre-compiled file, you can fetch it from [npmcdn](https://npmcdn.com). The development version is available at [https://npmcdn.com/wedeploy/dist/wedeploy.js](https://npmcdn.com/wedeploy/dist/wedeploy.js), and the minified production version is at [https://npmcdn.com/wedeploy/dist/wedeploy.min.js](https://npmcdn.com/wedeploy/dist/wedeploy.min.js).

### Using WeDeploy on Different Platforms

The JavaScript ecosystem is wide and incorporates a large number of platforms and execution environments. To handle this, the Parse npm module contains special versions of the SDK tailored to use in Node.js and browser environments. Not all features make sense in all environments, so using the appropriate package will ensure that items like local storage, user sessions, and HTTP requests use appropriate dependencies.

## Usage

Post

```javascript
WeDeploy
  .url('/data/tasks')
  .post({ desc: 'Buy milk' });
```

Get

```javascript
WeDeploy
	.url('/data/tasks')
	.get()
	.then(function(clientResponse) {
	  console.log(clientResponse.body());
	});
```

Data

```javascript
WeDeploy
	.data('http://mydata.dataproject.wedeploy.io')
	.get('movies')
	.then(function(movies) {
	  console.log(movies);
	});
```

## Setup

```
npm install
```

## Build

```
gulp build
```

```
gulp watch
```

## Test

### Test on node.js

```
gulp test:node
```


### Test on browsers

```
gulp test
```

```
gulp test:watch
```

## License

```
Copyright (c) 2016-present, Liferay Inc
All rights reserved.

This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. An additional grant 
of patent rights can be found in the PATENTS file in the same directory.
```


[build-status-svg]: http://img.shields.io/travis/wedeploy/api-js/master.svg?style=flat&branch=master
[build-status-link]: https://travis-ci.org/wedeploy/api-js

[coverage-status-svg]: http://codecov.io/github/wedeploy/api-js/coverage.svg?branch=master
[coverage-status-link]: http://codecov.io/github/wedeploy/api-js?branch=master

[license-svg]: https://img.shields.io/badge/license-BSD-lightgrey.svg
[license-link]: https://github.com/wedeploy/api-js/blob/master/LICENSE.md

[npm-svg]: https://badge.fury.io/js/wedeploy.svg
[npm-link]: https://npmjs.org/wedeploy
