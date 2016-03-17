'use strict';

const chai = require( 'chai' );
chai.use( require( 'chai-as-promised' ) );
const assert = chai.assert;

const nock = require( 'nock' );
const requestPromise = require( 'request-promise' );
const requestPromiseRetry = require( '..' );

const httpClient = requestPromiseRetry( requestPromise );

const nockOptions = {
    allowUnmocked: false
};

describe( 'request-promise-retry', function() {

    describe( 'when successful', function() {
        it( 'should return normally', function() {

            const result = { hello: 'world' };

            const req = nock( 'http://test.org', nockOptions )
                .get( '/test' )
                .reply( 200, result );

            const res = httpClient( { method: 'GET', url: 'http://test.org/test', json: true } );

            return assert.becomes( res, result )
                .then( () => {
                    req.done();
                } );
        } );
    } );

    [ 'ECONNRESET', 'ETIMEDOUT' ].forEach( function( code ) {

        describe( `when ${ code }`, function() {
            it( 'should retry', function() {

                const resetErr = {
                    code: code,
                    syscall: 'read'
                };

                const req = nock( 'http://test.org', nockOptions )
                    .get( '/test' )
                    .times( 5 )
                    .replyWithError( resetErr );

                const res = httpClient( { method: 'GET', url: 'http://test.org/test' } );

                return assert.isRejected( res )
                    .then( err => {
                        assert.equal( err.name, 'RequestError' );
                        assert.equal( err.cause, resetErr, 'should have been rejected with error' );
                        req.done();
                    } );
            } );
        } );
    } );

    describe( 'when ENOTFOUND', function() {
        it( 'should not retry', function() {

            const notFoundErr = {
                code: 'ENOTFOUND',
                errno: 'ENOTFOUND',
                syscall: 'getaddrinfo',
                hostname: 'test.org',
                host: 'test.org',
                port: 80
            };

            const req = nock( 'http://test.org', nockOptions )
                .get( '/test' )
                .replyWithError( notFoundErr );

            const res = httpClient( { method: 'GET', url: 'http://test.org/test' } );

            return assert.isRejected( res )
                .then( err => {
                    assert.equal( err.name, 'RequestError' );
                    assert.equal( err.cause, notFoundErr, 'should have been rejected with error' );
                    req.done();
                } );
        } );
    } );
} );
