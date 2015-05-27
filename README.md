Launchpad api client for JavaScript
===============

## Usage

Post

```javascript
LaunchpadClient
    .url('/data/tasks')
    .post({ desc: 'Buy milk' });
```

Get

```javascript
LaunchpadClient
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

```
bower install
```

## Build

```
gulp build
```

```
gulp watch
```

## Test

```
gulp test
```

```
gulp test:watch
```
