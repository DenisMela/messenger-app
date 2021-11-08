angular.module('myApp.controllers', [])

.controller('AuthController', function(Auth, $state){
  const authController = this;

  authController.user = {
    email: '',
    password: ''
  }

  authController.login = function (){
    Auth.$signInWithEmailAndPassword(authController.user.email, authController.user.password)
    .then(function(auth) {
      $state.go('channels');
    }).catch(function(error) {
      authController.error = error;
    })
  };

  authController.register = function (){
    return Auth.$createUserWithEmailAndPassword(authController.user.email, authController.user.password).then(function (user){
      $state.go('channels');
    }, function (error){
      authController.error = error;
    });
  };

})
.controller('ProfileController', function($state, auth, md5, profile){
  const profileController = this;
  
  profileController.profile = profile;

  profileController.updateProfile = function() {
    profileController.profile.emailHash = md5.createHash(auth.email);
    profileController.profile.$save().then(function()  {
      $state.go('channels');
    });
  };

})
.controller('ChannelsController', function($state, Auth, Users, profile, channels){
  const channelsController = this;

  channelsController.profile = profile;
  channelsController.channels = channels;
  channelsController.getDisplayName = Users.getDisplayName;
  channelsController.getIcon = Users.getIcon;
  channelsController.users = Users.all;
  channelsController.newChannel = {
    name: ''
  };

  channelsController.logout = function() {
    Auth.$signOut().then(function() {
      $state.go('home');
    });
  };

  channelsController.createChannel = function() {
    channelsController.channels.$add(channelsController.newChannel).then(function(ref) {
      $state.go('channels.messages', {channelId: ref.key});
    });
  };
})
.controller('MessagesController', function(profile, channelName, messages){
  const messagesController = this;

  messagesController.messages = messages;
  messagesController.channelName = channelName;
  messagesController.message = '';

  messagesController.sendMessage = function (){
    
    if(messagesController.message.length > 0){
      messagesController.messages.$add({
        uid: profile.$id,
        body: messagesController.message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
      .then(function() {
        messagesController.message = '';
      });
    }
  };

});