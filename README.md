# WeDeploy SDK for JavaScript
[![Build Status][build-status-svg]][build-status-link]
[![Test Coverage][coverage-status-svg]][coverage-status-link]
[![License][license-svg]][license-link]
[![Npm Version][npm-svg]][npm-link]

An SDK that gives you access to the powerful WeDeploy cloud platforma from your JavaScript app. For more information on WeDeploy and its features, see [the website](https://wedeploy.com) or [the JavaScript guide](https://wedeploy.com/docs).

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
        console.log(clientResponse.body())
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


[build-status-svg]: http://img.shields.io/travis/wedeploy/api-js/master.svg?style=flat&branch=master
[build-status-link]: https://travis-ci.org/wedeploy/api-js

[coverage-status-svg]: http://codecov.io/github/wedeploy/api-js/coverage.svg?branch=master
[coverage-status-link]: http://codecov.io/github/wedeploy/api-js?branch=master

[license-svg]: https://img.shields.io/badge/license-BSD-lightgrey.svg
[license-link]: https://github.com/wedeploy/api-js/blob/master/LICENSE.md

[npm-svg]: https://badge.fury.io/js/wedeploy.svg
[npm-link]: https://npmjs.org/wedeploy
