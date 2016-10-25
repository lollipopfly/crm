IndexProfileCtrl = ($http) ->
  vm = this

  $http.get('/api/profile')
    .then (response) ->
      vm.user = response.data.user
      vm.points = response.data.points

      if vm.user.avatar == 'default_avatar.jpg'
        vm.user.avatar = '/images/' + vm.user.avatar
      else
        vm.user.avatar = 'uploads/avatars/' + vm.user.avatar

      vm.user.bday = moment(new Date(vm.user.bday)).format('DD.MM.YYYY')
    , (error) ->
      vm.error = error.data

  vm.updatePoints = () ->
    $http.put('/api/profile/updatepoints', vm.points)
      .then (response) ->
        vm.flashSuccess = 'Points updated!'
      , (error) ->
        vm.error = error.data

  return

'use strict'
angular
  .module('app')
  .controller('IndexProfileCtrl', IndexProfileCtrl)