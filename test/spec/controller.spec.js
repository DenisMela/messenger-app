
function createDefaultUserInput() {
  return {
    email: 'goodemail@gmail.com',
    password: 'goodpassword'
  }
}

describe('AuthController', function() {
  beforeEach(module('myApp'));
  beforeEach(module('myApp.controllers'));
  beforeEach(module('myApp.auth.service'));

  var $controller, $state, Auth, AuthController, $scope;

  beforeEach(inject(function(_$controller_, _$state_, _Auth_, _$firebaseAuth_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $state = _$state_;
    $scope = _$rootScope_.$new();

    Auth = function() {
      const auth = _$firebaseAuth_();
      return auth;
    }
    AuthController = function() {
      return $controller('AuthController', {
      'Auth': Auth(),
      '$state': $state
    })};
  }));

  describe('AuthController', function() {


    it('should be defined', function() {
      var authController = AuthController();
      expect(authController).toBeDefined();
    });

    it('should allow user to register and log in', function() {
      var authController = AuthController();
      authController.user = createDefaultUserInput();

      var auth = Auth();

      auth.$createUserWithEmailAndPassword(authController.user.email, authController.user.password)

      authController.register().then(function(data) {
        console.log(data)
        expect(data).toBeDefined();
      });
    });

  });
});