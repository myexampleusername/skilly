/* global angular */
'use strict';

let domain = window.location.href.slice(0, -1);

let skillyApp = angular.module('skillyApp', [
  'ngRoute',
  'skillyController',
  'userService',
  'promiseFactory'
]);

skillyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardController'
      })
      .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
      })
      .when('/user/:id/profile', {
        templateUrl: 'templates/user-profile.html',
        controller: 'UserProfileController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
  
