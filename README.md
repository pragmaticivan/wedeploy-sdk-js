# Launchpad api client for JavaScript [![Build Status](http://img.shields.io/travis/launchpad-project/api.js/master.svg?style=flat)](https://travis-ci.org/launchpad-project/api.js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/launchpad-api.svg)](https://travis-ci.org/launchpad-project/launchpad-client)

## Usage

Post

```javascript
Launchpad
    .url('/data/tasks')
    .post({ desc: 'Buy milk' });
```

Get

```javascript
Launchpad
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
