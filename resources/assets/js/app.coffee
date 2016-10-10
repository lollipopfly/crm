'use strict'

angular
  .module('app', [
    'ui.router'
    'satellizer'
    "ui.bootstrap"
    "ngLodash"
    "ngMask"
    "angularMoment"
    "easypiechart"
  ]).config(($stateProvider, $urlRouterProvider, $authProvider, $locationProvider) ->
    $locationProvider.html5Mode true

    # Satellizer configuration that specifies which API
    # route the JWT should be retrieved from
    $authProvider.loginUrl = '/api/authenticate'
    $authProvider.signupUrl = '/api/authenticate/register'
    $urlRouterProvider.otherwise '/user/sign_in'

    $stateProvider
      .state('/',
        url: '/'
        templateUrl: '../views/pages/home.html'
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
      # .state('users_create',
      #   url: '/users/create'
      #   templateUrl: '../views/users/create.html'
      #   controller: 'CreateUserCtrl as user'
      # )
      # .state('users_edit',
      #   url: '/users/:id/edit'
      #   templateUrl: '../views/users/edit.html'
      #   controller: 'EditUserCtrl as user'
      # )
      .state('users_show',
        url: '/users/:id'
        templateUrl: '../views/users/show.html'
        controller: 'ShowUserCtrl as user'
      )

    return
  ).run ($q, $rootScope, $state, $auth, $location, $timeout) ->
    publicRoutes = [
      'sign_up'
      'confirm'
      'forgot_password'
      'reset_password',
    ]

    # if not logged
    $timeout(() ->
      $rootScope.currentState = $state.current.name

      if !$auth.isAuthenticated() && publicRoutes.indexOf($rootScope.currentState) == -1
        $location.path 'user/sign_in'
    )

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