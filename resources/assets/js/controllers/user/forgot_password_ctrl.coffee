ForgotPasswordController = ($http) ->
  vm = this

  vm.restorePassword = ()->
    vm.spinnerDone = true
    data = {
      email: vm.email
    }
    $http.post('api/authenticate/send_reset_code', data).success((data, status, headers, config) ->
      vm.spinnerDone = false
      if(data)
        vm.successSendingEmail = true
    ).error (error, status, header, config) ->
      vm.error = error
      vm.spinnerDone = false
    return
  return

'use strict'
angular
  .module('app')
  .controller('ForgotPasswordController', ForgotPasswordController)