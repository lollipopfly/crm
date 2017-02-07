ConfirmController = ($auth, $state, $http, $rootScope, $stateParams) ->
  vm = this
  vm.data =
    confirmation_code: $stateParams.confirmation_code

  $http.post('api/authenticate/confirm', vm.data).success((data, status, headers, config) ->
    # Save token
    $auth.setToken(data.token)

    # Save user in localStorage
    user = JSON.stringify(data)
    localStorage.setItem 'user', user
    $rootScope.authenticated = true
    $rootScope.currentUser = data

    $state.go '/'
  ).error (data, status, header, config) ->
    $state.go 'sign_in'

  return

'use strict'
angular
  .module('app')
  .controller('ConfirmController', ConfirmController)

