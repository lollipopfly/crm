CreateRouteCtrl = ($http, $state) ->
  vm = this
  vm.pointForms = []

  $http.post('/api/routes/getUsersAndStores')
    .then (response) ->
      vm.obj = response.data
    , (error) ->
      vm.error = error.data

  vm.createRoute = () ->
    if vm.date != undefined
      vm.newData = moment(vm.date).format('DD.MM.YYYY')

    vm.route =
      user_id: vm.user_id
      date: vm.newData
      points: vm.pointForms

    $http.post('/api/routes', vm.route)
      .then (response) ->
        vm.data = response.data
        $state.go 'routes', { flashSuccess: 'New route has been added!' }
      , (error) ->
        vm.error = error.data
        console.log(vm.error);

    return

  vm.addPoint = () ->
    vm.pointForms.push({})

  vm.removePoint = (index) ->
    vm.pointForms.splice(index, 1)

  return

'use strict'
angular
  .module('app')
  .controller('CreateRouteCtrl', CreateRouteCtrl)