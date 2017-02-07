ShowUserCtrl = ($http, $stateParams, $state) ->
  vm = this
  vm.id = $stateParams.id
  vm.settings =
    lineWidth: 5,
    trackColor: '#e8eff0',
    barColor: '#27c24c',
    scaleColor: false,
    color: '#3a3f51',
    size: 134,
    lineCap: 'butt',
    rotate: -90,
    animate: 1000

  $http.get('api/users/'+vm.id).then((response) ->
    vm.obj = response.data
    if vm.obj.avatar == 'default_avatar.jpg'
      vm.obj.avatar = '/images/' + vm.obj.avatar
    else
      vm.obj.avatar = 'uploads/avatars/' + vm.obj.avatar
    vm.obj.bday = moment(new Date(vm.obj.bday)).format('DD.MM.YYYY')
    return
  , (error) ->
    vm.error = error.data
    return
  )

  return

'use strict'
angular
  .module('app')
  .controller('ShowUserCtrl', ShowUserCtrl)
