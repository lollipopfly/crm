ResetPasswordController = ($auth, $state, $http, $stateParams) ->
  vm = this
  vm.minlength = 8

  vm.restorePassword = (form) ->
    data = {
      reset_password_code: $stateParams.reset_password_code
      password: vm.password
      password_confirmation: vm.password_confirmation
    }

    $http.post('api/authenticate/reset_password', data).success((data, status, headers, config) ->
      if(data)
        vm.successRestorePassword = true
    ).error (error, status, header, config) ->
      console.log(error);
      vm.error = error
    return
  return

'use strict'
angular
  .module('app')
  .controller('ResetPasswordController', ResetPasswordController)