/* global angular */
'use strict';

let skillyApp = angular.module('skillyApp', [
  'ngRoute',
  'skillyController',
  'userService',
  'promiseFactory'
]);

skillyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
      })
      .when('/dashboard', {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardController'
      })
      .when('/user/:id/profile', {
        templateUrl: 'templates/user-profile.html',
        controller: 'UserProfileController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
  
