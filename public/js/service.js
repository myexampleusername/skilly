/* global angular */
'use strict';

// a module exposing user services //
var userService = angular.module('userService', []);

userService.service('User', ['request',
  function (request) {
    return {
      current: function() {
        return request.promise('/user/current', request.get);
      },
      get: function(id) {
        return request.promise(id ? `user/${id}` : 'user', request.get);
      },
      profile: function(id) {
        return request.promise(`user/${id}/profile`, request.get);
      },
      auth: function(creds) {
        return request.promise('user/auth', request.post, creds);
      },
      deauth: function() {
        return request.promise('user/deauth', request.post);
      }
    };
}]);
