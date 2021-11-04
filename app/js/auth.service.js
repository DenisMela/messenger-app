angular.module('myApp.auth.service', [])

.factory('Auth', function($firebaseAuth){

  const auth = $firebaseAuth();

  return auth;

});