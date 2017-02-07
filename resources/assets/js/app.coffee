'use strict'
angular
  .module('app', [
    'app.pusherNotifications',
    'ui.router',
    'satellizer',
    'ui.bootstrap',
    'ngLodash',
    'ngMask',
    'angularMoment',
    'easypiechart',
    'ngFileUpload',
  ]).config((
    $stateProvider,
    $urlRouterProvider,
    $authProvider,
    $locationProvider
  ) ->
    $locationProvider.html5Mode true
    console.log(12);

    # Satellizer configuration that specifies which API
    # route the JWT should be retrieved from
    $authProvider.loginUrl = '/api/authenticate'
    $authProvider.signupUrl = '/api/authenticate/register'
    $urlRouterProvider.otherwise '/user/sign_in'

    $stateProvider
      .state('/',
        url: '/'
        templateUrl: '../views/pages/home.html'
        controller: 'IndexHomeCtrl as home'
      )

      # USER
      .state('sign_in',
        url: '/user/sign_in'
        templateUrl: '../views/user/sign_in.html'
        controller: 'SignInController as auth'
      )
      .state('sign_up',
        url: '/user/sign_up'
        templateUrl: '../views/user/sign_up.html'
        controller: 'SignUpController as register'
      )
      .state('sign_up_success',
        url: '/user/sign_up_success'
        templateUrl: '../views/user/sign_up_success.html'
      )
      .state('forgot_password',
        url: '/user/forgot_password'
        templateUrl: '../views/user/forgot_password.html'
        controller: 'ForgotPasswordController as forgotPassword'
      )
      .state('reset_password',
        url: '/user/reset_password/:reset_password_code'
        templateUrl: '../views/user/reset_password.html'
        controller: 'ResetPasswordController as resetPassword'
      )
      .state('confirm',
        url: '/user/confirm/:confirmation_code'
        controller: 'ConfirmController'
      )

      # Profile
      .state('profile',
        url: '/profile'
        templateUrl: '../views/profile/index.html'
        controller: 'IndexProfileCtrl as profile'
      )
      .state('profile_edit',
        url: '/profile/edit'
        templateUrl: '../views/profile/edit.html'
        controller: 'EditProfileCtrl as profile'
      )

      # Stores
      .state('stores',
        url: '/stores'
        templateUrl: '../views/stores/index.html'
        controller: 'IndexStoreCtrl as stores'
        params:
          flashSuccess: null
      )
      .state('stores_create',
        url: '/stores/create'
        templateUrl: '../views/stores/create.html'
        controller: 'CreateStoreCtrl as store'
      )
      .state('stores_edit',
        url: '/stores/:id/edit'
        templateUrl: '../views/stores/edit.html'
        controller: 'EditStoreCtrl as store'
      )
      .state('stores_show',
        url: '/stores/:id'
        templateUrl: '../views/stores/show.html'
        controller: 'ShowStoreCtrl as store'
      )

      # Users
      .state('users',
        url: '/users'
        templateUrl: '../views/users/index.html'
        controller: 'IndexUserCtrl as users'
        params:
          flashSuccess: null
      )
      .state('users_create',
        url: '/users/create'
        templateUrl: '../views/users/create.html'
        controller: 'CreateUserCtrl as user'
      )
      .state('users_show',
        url: '/users/:id'
        templateUrl: '../views/users/show.html'
        controller: 'ShowUserCtrl as user'
      )

      # Routes
      .state('routes',
        url: '/routes'
        templateUrl: '../views/routes/index.html'
        controller: 'IndexRouteCtrl as routes'
        params:
          flashSuccess: null
      )
      .state('routes_create',
        url: '/routes/create'
        templateUrl: '../views/routes/create.html'
        controller: 'CreateRouteCtrl as route'
      )
      .state('routes_edit',
        url: '/routes/:id/edit'
        templateUrl: '../views/routes/edit.html'
        controller: 'EditRouteCtrl as route'
      )
      .state('routes_show',
        url: '/routes/:id'
        templateUrl: '../views/routes/show.html'
        controller: 'ShowRouteCtrl as route'
      )

      # Map
      .state('map',
        url: '/map'
        templateUrl: '../views/map/index.html'
        controller: 'IndexMapCtrl as map'
      )

    return

  ).run ($auth, $http, $location, $q, $rootScope, $state, $timeout) ->
    publicRoutes = [
      'sign_up',
      'confirm',
      'forgot_password',
      'reset_password',
    ]

    $timeout(()->
      $rootScope.currentState = $state.current.name

      # if not logged
      if !$auth.isAuthenticated() &&
      publicRoutes.indexOf($rootScope.currentState) == -1
        $location.path 'user/sign_in'

      # if logged
      if $auth.isAuthenticated &&
      (publicRoutes.indexOf($rootScope.currentState) == 0 ||
      $rootScope.currentState == 'sign_in')
        $location.path '/'
    , 0)

    $rootScope.$on '$stateChangeStart', (event, toState) ->
      user = JSON.parse(localStorage.getItem('user'))

      if user && $auth.isAuthenticated()
        $rootScope.authenticated = true
        $rootScope.currentUser = user

        if $rootScope.currentUser.avatar == 'default_avatar.jpg'
          $rootScope.currentUser.avatar = '/images/' + $rootScope.currentUser.avatar
        else
          $rootScope.currentUser.avatar = 'uploads/avatars/' + $rootScope.currentUser.avatar

      $rootScope.logout = ->
        $auth.logout().then ->
          localStorage.removeItem 'user'
          $rootScope.authenticated = false
          $rootScope.currentUser = null

          $state.go 'sign_in'

          return

        return

    return