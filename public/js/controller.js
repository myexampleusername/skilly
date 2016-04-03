/* global $ _ angular */
'use strict';

// controllers for the skilly app //
var skillyController = angular.module('skillyController', []);

skillyController.controller('HomeController', ['$scope', 'User',
  function($scope, User) {
    User.get().then(onUsers, onError);
    
    function onUsers(users) { $scope.users = users.data; }
    function onError(err) { console.dir(err); }
  }
]);

skillyController.controller('DashboardController', ['$scope', '$http',
  function($scope, $http) {
    $http.get('/profile').success(function(data) {
      $scope.profile = data;
    });
  }
]);

skillyController.controller('UserProfileController', ['$scope', '$routeParams', 'User',
  function($scope, $routeParams, User) {
    User.profile($routeParams.id).then(onProfile, onError);
    
    function onProfile(response) { $scope.profile = response.data; }
    function onError(err) { console.dir(err); }
  }
]);

skillyController.controller('NavController', ['$scope', '$http', 'User',
  function($scope, $http, User) {
    User.current().then(onUser, onError);

    $scope.signin = function() {
      console.log('Signing in...');
      let creds = _.object($("#form-signin").serializeArray().map(function(v) {
        return [v.name, v.value];
      }));
      $('#btn-close-auth').trigger('click');
      User.auth(creds).then(onUser, onError);
    };
    
    $scope.signup = function() {
    };

    $scope.signout = function() {
      console.log('Logging out...');
      User.deauth().then(onDeauth, onError);
    };

    function onUser(user) { $scope.user = user; }
    function onDeauth() { $scope.user = null; }
    function onError(err) { console.dir(err); }
  }
]);
