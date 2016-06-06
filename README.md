# WeDeploy api client for JavaScript [![Build Status](http://img.shields.io/travis/wedeploy/api.js/master.svg?style=flat)](https://travis-ci.org/wedeploy/api.js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/launchpad-api.svg)](https://travis-ci.org/wedeploy/api-js)

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
