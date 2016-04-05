/* global $ _ angular */
'use strict';

// controllers for the skilly app //
var skillyController = angular.module('skillyController', []);

skillyController.controller('HomeController', ['$scope', 'User',
  function($scope, User) {
    User.get().then(onUsers, onError);
    
    $scope.getNameForUser = function (user) {
      return user.nameFirst ? `${user.nameFirst} ${user.nameLast}` : user.username;
    };
    
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
    
    $scope.getNameForUser = function (user) {
      console.log(user);
      return user.nameFirst ? `${user.nameFirst} ${user.nameLast}` : user.username;
    };
    
    function onProfile(response) { 
      $scope.profile = response.data; 
      $scope.name = $scope.getNameForUser(response.data);
    }
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

    function onUser(user) { $scope.user = user.data; }
    function onDeauth() { $scope.user = null; }
    function onError(err) { console.dir(err); }
  }
]);
