EditRouteCtrl = ($scope, $http, $state, $stateParams) ->
  vm = this
  vm.id = $stateParams.id
  vm.count = 1

  $http.get('/api/routes/edit/'+ vm.id)
    .then (response) ->
      vm.obj = response.data

      return
    , (error) ->
      vm.error = error.data

  vm.update = () ->
    route = {
      user_id: vm.obj.user_id,
      date: vm.obj.date,
      points: vm.obj.points,
    }

    $http.patch('/api/routes/' + vm.id, route)
      .then (response) ->
        $state.go 'routes', { flashSuccess: 'Route Updated!' }
      , (error) ->
        vm.error = error.data
        console.log(vm.error)

  vm.addPoint = () ->
    vm.obj.points.push({
      id: vm.count + '_new'
    })

    vm.count++

    return

  vm.removePoint = (index) ->
    vm.obj.points.splice(index, 1)

  return

'use strict'

angular
  .module('app')
  .controller('EditRouteCtrl', EditRouteCtrl)
