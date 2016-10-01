ForgotPasswordController = ($scope, $http) ->
  vm = this

  vm.restorePassword = ()->
    data = {
      email: vm.email
    }

    $http.post('api/authenticate/send_reset_code', data).success((data, status, headers, config) ->
      if(data)
        vm.successSendingEmail = true
    ).error (data, status, header, config) ->
      vm.emailErrorText = data.error
    return
  return

'use strict'
angular
  .module('app')
  .controller('ForgotPasswordController', ForgotPasswordController)