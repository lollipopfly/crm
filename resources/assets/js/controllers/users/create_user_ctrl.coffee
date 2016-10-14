CreateUserCtrl = ($http, $state, Upload, lodash) ->
  vm = this
  vm.chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890'

  $http.get('/api/users/create')
    .then (response) ->
      vm.enums = response.data
    , (error) ->
      vm.error = error.data
  vm.addUser = () ->
    if vm.bday != undefined
      vm.bday = moment(vm.bday).format('YYYY-MM-DD')

    vm.data =
      name: vm.name
      last_name: vm.last_name
      initials: vm.initials
      avatar: vm.avatar
      bday: vm.bday
      job_title: vm.job_title
      user_group: vm.user_group
      country: vm.country
      city: vm.city
      phone: vm.phone
      email: vm.email
      password: vm.password

    Upload.upload(
      url: '/api/users'
      method: 'Post'
      data: vm.data
    ).then ((resp) ->
      $state.go 'users', { flashSuccess: 'New user has been added!' }
      return
    ), ((error) ->
      vm.error = error.data
      return
    )

    return

  vm.generatePass = () ->
    vm.password = ''
    passLength = lodash.random(8,15)
    x = 0

    while x < passLength
      i = Math.floor(Math.random() * vm.chars.length)
      vm.password += vm.chars.charAt(i)
      x++
    return vm.password

  return

'use strict'
angular
  .module('app')
  .controller('CreateUserCtrl', CreateUserCtrl)