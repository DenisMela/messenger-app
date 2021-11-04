angular.module('myApp.users.service', [])

.factory('Users', function($firebaseArray, $firebaseObject) {

  const usersReference = firebase.database().ref('users');
  const users = $firebaseArray(usersReference);

  const Users = {
    getProfile: function(uid) {
      return $firebaseObject(usersReference.child(uid))
    },
    getDisplayName: function(uid) {
      return users.$getRecord(uid).displayName;
    },
    getIcon: function(uid) {
      return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
    },
    all: users
  };

  return Users;


});