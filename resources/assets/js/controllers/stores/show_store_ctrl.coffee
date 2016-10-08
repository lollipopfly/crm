ShowStoreCtrl = ($http, $stateParams, $state) ->
  vm = this
  vm.id = $stateParams.id

  $http.get('api/stores/'+vm.id).then((response) ->
    vm.data = response.data
    return
  , (error) ->
    vm.error = error.data
    return
  )

  vm.deleteStore = (id) ->
    confirmation = confirm('Are you sure?')

    if confirmation
      $http.delete('api/stores/' + id).then ((response) ->
        $state.go 'stores', { flashSuccess: 'Store deleted!' }
        return
      )

    return
  return

'use strict'
angular
  .module('app')
  .controller('ShowStoreCtrl', ShowStoreCtrl)