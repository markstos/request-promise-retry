# request-promise-retry
A retry wrapper above request-promise

## Usage

```js
const requestPromise = require( 'request-promise' );
const requestPromiseRetry = require( 'request-promise-retry' );

const httpClient = requestPromiseRetry( requestPromise );

const req = {
    method: 'GET',
    url: 'http://test.org/test'
};

httpClient( req );
```
