UserController = ($http, $state, $auth, $rootScope) ->
  vm = this

  vm.getUsers = ->
    # This request will hit the index method in the AuthenticateController
    # on the Laravel side and will return the list of users
    $http.get('api/authenticate').success((users) ->
      vm.users = users

      return
    ).error (error) ->
      vm.error = error

      return

    return

  vm.logout = ->
    $auth.logout().then () ->
      # Remove the authenticated user from local storage
      localStorage.removeItem 'user'
      # Flip authenticated to false so that we no longer
      # show UI elements dependant on the user being logged in
      $rootScope.authenticated = false
      # Remove the current user info from rootscope
      $rootScope.currentUser = null
      $state.go 'sign_in'

      return

    return

  return

'use strict'

angular
  .module('app')
  .controller('UserController', UserController)
