IndexUserCtrl = ($http, $filter, $rootScope, $stateParams) ->
  vm = this
  vm.sortReverse = null
  vm.pagiApiUrl = '/api/users'
  orderBy = $filter('orderBy')
  # Flash from others pages
  if $stateParams.flashSuccess
    vm.flashSuccess = $stateParams.flashSuccess

  $http.get('api/users').then((response) ->
    vm.users = response.data.data
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
      $('#'+predicate).removeClass('active-desc').addClass('active-asc');

    vm.predicate = predicate
    vm.reverse = if (vm.predicate == predicate) then !vm.reverse else false
    vm.users = orderBy(vm.users, predicate, vm.reverse)

    return

  vm.deleteUser = (id, index) ->
    confirmation = confirm('Are you sure?')

    if confirmation
      $http.delete('/api/users/' + id).then ((response) ->
        # Delete from scope
        vm.users.splice(index, 1)
        vm.flashSuccess = 'User deleted!'

        return
      ), (error) ->
        vm.error = error
    return

  return

'use strict'
angular
  .module('app')
  .controller('IndexUserCtrl', IndexUserCtrl)
