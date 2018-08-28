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
## Retry Logic

This module will retry a maximum of 4 times if the error is `ETIMEDOUT` or `ECONNRESET`.

We will wait a minimum of 10 milliseconds between calls and a maximum of 1000 seconds, with the actual values chosen by random.

The retry logic not configurable.

The promise will rejected if the error is not retryable or all the retries fail. 
