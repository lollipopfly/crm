IndexStoreCtrl = ($scope, $http, $filter) ->
  vm = this
  vm.sortReverse = null
  vm.pagiApiUrl = '/api/stores'
  orderBy = $filter('orderBy')

  $http.get('api/stores').then((response) ->
    vm.stores = response.data.data
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
    vm.stores = orderBy(vm.stores, predicate, vm.reverse)

    return

  vm.deleteStore = (id, index) ->
    confirmation = confirm('Are you sure?')

    if confirmation
      $http.delete('/api/stores/' + id).then ((response) ->
        # Delete from scope
        vm.stores.splice(index, 1)
        vm.successMessage = 'Store deleted!'

        return
      ), (error) ->
        vm.error = error
    return

  return
'use strict'
angular
  .module('app')
  .controller('IndexStoreCtrl', IndexStoreCtrl)