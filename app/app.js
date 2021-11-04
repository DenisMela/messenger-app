'use strict';

/**
 * @ngdoc overview
 * @name myApp
 * @description
 * # myApp
 *
 * Main module of the application.
 */
angular.module('myApp', [
    'firebase',
    'angular-md5',
    'ui.router',
    'myApp.controllers',
    'myApp.users.service',
    'myApp.auth.service',
    'myApp.channels.service',
    'myApp.messages.service',
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(auth){
              $state.go('channels');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('login', {
        url: '/login',
        controller: 'AuthController as authController',
        templateUrl: 'views/login.html',
        resolve: {
          requireNoAuthorization: function($state, Auth) {
            return Auth.$requireSignIn().then(function() {
              $state.go('home');
            }).catch(function(error) {
              console.log(error)
              return;
            })
          }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthController as authController',
        templateUrl: 'views/register.html',
        resolve: {
          requireNoAuthorization: function($state, Auth) {
            return Auth.$requireSignIn().then(function() {
              $state.go('home');
            }).catch(function(error) {
              console.log(error)
              return;
            })
          }
        }
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileController as profileController',
        templateUrl: 'views/profile.html',
        resolve: {
          auth: function($state, Auth) {
            return Auth.$requireSignIn().catch(function() {
              $state.go('home');
            });
          },
          profile: function(Users, Auth)  {
            return Auth.$requireSignIn().then(function(auth) {
              return Users.getProfile(auth.uid).$loaded();
            }).catch(function(error) {
              console.log(error)
              return;
            });
          }
        }
      })
      .state('channels', {
        url: '/channels',
        controller: 'ChannelsController as channelsController',
        templateUrl: 'views/channels/index.html',
        resolve: {
          channels: function (Channels){
            return Channels.$loaded();
          },
          profile: function ($state, Auth, Users){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded().then(function (profile){
                if(profile.displayName){
                  return profile;
                } else {
                  $state.go('profile');
                }
              });
            }, function(error){
              $state.go('home');
            });
          }
        }
      })
      .state('channels.create', {
        url: '/create',
        templateUrl: 'views/channels/create.html',
        controller: 'ChannelsController as channelsController'
      })
      .state('channels.messages', {
        url: '/{channelId}/messages',
        templateUrl: 'views/channels/messages.html',
        controller: 'MessagesController as messagesController',
        resolve: {
          messages: function($stateParams, Messages){
            return Messages.forChannel($stateParams.channelId).$loaded();
          },
          channelName: function($stateParams, channels){
            return '#' + channels.$getRecord($stateParams.channelId).name;
          }
        }
      })
      .state('channels.direct', {
        url: '/{uid}/messages/direct',
        templateUrl: 'views/channels/messages.html',
        controller: 'MessagesController as messagesController',
        resolve: {
          messages: function($stateParams, Messages, profile){
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          },
          channelName: function($stateParams, Users){
            return Users.all.$loaded().then(function(){
              return '@'+Users.getDisplayName($stateParams.uid);
            });
          }
        }
      });

    $urlRouterProvider.otherwise('/');

    var config = {
      apiKey: "AIzaSyBKgMlPkPldMUqhr5LXuOxqP_DpxnyB7q8",
      authDomain: "angularjs-app-9c6ec.firebaseapp.com",
      databaseURL: "https://angularjs-app-9c6ec-default-rtdb.firebaseio.com",
      projectId: "angularjs-app-9c6ec",
      storageBucket: "angularjs-app-9c6ec.appspot.com",
      messagingSenderId: "19186869268",
      appId: "1:19186869268:web:987b5d7fd56080ce86f301",
      measurementId: "G-5KLV02CGW0"
    };
    firebase.initializeApp(config);
  })