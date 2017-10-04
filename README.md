# WeDeploy SDK for JavaScript
[![Build Status][build-status-svg]][build-status-link]
[![License][license-svg]][license-link]
[![Npm Version][npm-svg]][npm-link]

[![Build Status](https://saucelabs.com/browser-matrix/ivansantos.svg)](https://saucelabs.com/beta/builds/8a24c731fc704e2c835033bcbc2faa2e)

An SDK that gives you access to the powerful WeDeploy cloud platforma from your JavaScript app. For more information on WeDeploy and its features, see [the website](https://wedeploy.com) or [the JavaScript guide](https://wedeploy.com/docs).

## Getting Started

The easiest way to integrate the WeDeploy SDK into your JavaScript project is through the [npm module](https://npmjs.org/wedeploy) or you can fetch it from our [CDN](http://cdn.wedeploy.com/api/latest/wedeploy.js).

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
npm run build
```

```
npm run build:watch
```

## Test

### Test on node.js

```
npm run test:node
```

```
npm run test:node:watch
```

### Test on browser

```
npm run test:browser
```

```
npm run test:browser:watch
```

### Test on both browser and node

```
npm run test
```

### Test on browser with code coverage

```
npm run test:coverage
```

## Release

```
npm run release
```

## License

[BSD-3-Clause] © Liferay, inc.


[build-status-svg]: https://travis-ci.com/wedeploy/api-js.svg?token=a51FNuiJPYZtHhup9q1V&branch=master
[build-status-link]: https://travis-ci.com/wedeploy/api-js

[license-svg]: https://img.shields.io/badge/license-BSD-lightgrey.svg
[license-link]: https://github.com/wedeploy/api-js/blob/master/LICENSE.md

[npm-svg]: https://img.shields.io/npm/v/wedeploy.svg
[npm-link]: https://npmjs.org/wedeploy

[bsd-3-clause]: https://spdx.org/licenses/BSD-3-Clause.html
