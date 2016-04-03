/* global angular */
'use strict';

var promiseFactory = angular.module('promiseFactory', []);

/**
 * The Request factory returns an API to create $q promisified $http requests.
 * 
 * method: promise returns a $q promise wrapping an $http request.
 * Request also contains an enumeration of http verbs, get, post, etc, to avoid 
 * use of Strings throughout the application.
 */
promiseFactory.factory('request', ['$q', '$http',
  function($q, $http) {
    /**
     * promise: returns a $q promise wrapping an $http request. The promise 
     * will be rejected with an error if the http request fails. Otherwise, it 
     * will resolve with the response.
     * 
     * @param resource: The path to the resource.
     * @param verb: The http method.
     * @param body: The body for the http request.
     */
    function promise(resource, verb, body) {
      return $q(function(resolve, reject) {
        $http[verb.toLowerCase()](resource, body).then(function(response) {
          resolve(response);
        }, function(err) {
          reject(err);
        });
      });
    }
    return {
      promise: promise,
      get: 'get',
      post: 'post',
      put: 'put',
      delete: 'delete',
      head: 'head',
      patch: 'patch'
    };
  }
]);