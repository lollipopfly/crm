IndexRouteCtrl = ($http, $filter, $rootScope, $stateParams) ->
  vm = this
  vm.sortReverse = null
  vm.pagiApiUrl = '/api/routes'
  orderBy = $filter('orderBy')

  # Flash from others pages
  if $stateParams.flashSuccess
    vm.flashSuccess = $stateParams.flashSuccess

  $http.get('/api/routes').then((response) ->
    vm.routes = response.data.data
    vm.pagiArr = response.data

    return
  , (error) ->
    vm.error = error.data

    return
  )

  vm.sortBy = (predicate) ->
    vm.sortReverse = !vm.sortReverse
    $('.sort-link').each () ->
      $(this).removeClass().addClass('sort-link c-p')

    if vm.sortReverse
      $('#'+predicate).removeClass('active-asc').addClass('active-desc')
    else
      $('#'+predicate).removeClass('active-desc').addClass('active-asc')

    vm.predicate = predicate
    vm.reverse = if (vm.predicate == predicate) then !vm.reverse else false
    vm.routes = orderBy(vm.routes, predicate, vm.reverse)

    return

  vm.deleteRoute = (id, index) ->
    confirmation = confirm('Are you sure?')

    if confirmation
      $http.delete('/api/routes/' + id).then ((response) ->
        # Delete from scope
        vm.routes.splice(index, 1)
        vm.flashSuccess = 'Route deleted!'

        return
      ), (error) ->
        vm.error = error
    return

  return

'use strict'
angular
  .module('app')
  .controller('IndexRouteCtrl', IndexRouteCtrl)
