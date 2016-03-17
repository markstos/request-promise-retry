'use strict';

const promiseRetry = require( 'promise-retry' );
const RequestError = require( 'request-promise/errors' ).RequestError;

const retryableCodes = [
    'ECONNRESET',
    'ETIMEDOUT'
];

module.exports = function( requestPromise ) {
    return function( req ) {

        return promiseRetry(
            function( retry ) {

                return requestPromise( req )
                    .catch( RequestError, function( err ) {

                        const retryable = retryableCodes.indexOf( err.cause.code ) >= 0;
                        if( !retryable ) {
                            throw err;
                        }

                        return retry( err );
                    } );
            },
            {
                retries: 4,
                minTimeout: 10,
                maxTimeout: 1000,
                randomize: true
            }
        );
    };
};
