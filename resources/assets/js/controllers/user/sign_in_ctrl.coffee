SignInController = ($auth, $state, $http, $rootScope) ->
  vm = this
  vm.login = () ->
    credentials =
      email: vm.email
      password: vm.password

    $auth.login(credentials).then (->
      # Return an $http request for the now authenticated
      # user so that we can flatten the promise chain
      $http.get('api/authenticate/get_user').then (response) ->
        user = JSON.stringify(response.data.user)
        localStorage.setItem 'user', user
        $rootScope.authenticated = true
        $rootScope.currentUser = response.data.user

        $state.go 'users'
        return
    ), (error) ->
      vm.loginErrorText = error.data.error
      return
  return

'use strict'
angular
  .module('app')
  .controller('SignInController', SignInController)