# WeDeploy SDK for JavaScript
[![Build Status][build-status-svg]][build-status-link]
[![Test Coverage][coverage-status-svg]][coverage-status-link]
[![Npm Version][npm-svg]][npm-link]
[![License][license-svg]][license-link]

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
