SignUpController = ($auth, $state) ->
  vm = this

  vm.register = (form)->
    vm.spinnerDone = true
    if vm.user
      credentials =
        name: vm.user.name
        email: vm.user.email
        password: vm.user.password
        password_confirmation: vm.user.password_confirmation

    $auth.signup(credentials).then((response) ->
      vm.spinnerDone = false
      $state.go 'sign_up_success'
      return
    ).catch (error) ->
      console.log(error);
      vm.spinnerDone = false
      vm.error = error.data
      return
    return
  return

'use strict'
angular
  .module('app')
  .controller('SignUpController', SignUpController)