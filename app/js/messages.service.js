angular.module('myApp.messages.service', [])
  .factory('Messages', function($firebaseArray){
    const channelMessagesRef = firebase.database().ref('channelMessages');
    const userMessagesRef = firebase.database().ref('userMessages')


    return {
      forChannel: function(channelId){
        return $firebaseArray(channelMessagesRef.child(channelId));
      },
      forUsers: function(user1_id, user2_id){
        const path = user1_id < user2_id ? user1_id + '/' + user2_id : user2_id + '/' +user1_id;
    
        return $firebaseArray(userMessagesRef.child(path));
      }
    };
  });