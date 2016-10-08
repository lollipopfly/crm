EditStoreCtrl = ($scope, $http, $stateParams, $state) ->
  vm = this
  vm.id = $stateParams.id

  $http.get('api/stores/'+vm.id).then((response) ->
    vm.data = response.data
    return
  , (error) ->
    vm.error = error.data
    return
  )

  vm.update = () ->
    store =
      name: vm.data.name
      owner_name: vm.data.owner_name
      address: vm.data.address
      phone: vm.data.phone
      email: vm.data.email

    $http.patch('/api/stores/' + vm.id, store)
      .then (response) ->
        $state.go 'stores', { flashSuccess: 'Store Updated!' }
      , (error) ->
        vm.error = error.data

  $scope.getLocation = (address) ->
    $http.get('//maps.googleapis.com/maps/api/geocode/json',
      params:
        address: address
        language: 'en'
        components: 'country:UK|administrative_area:London'
      skipAuthorization: true # for erroe of .. is not allowed by Access-Control-Allow-Headers
    ).then (response) ->
      response.data.results.map (item) ->
        item.formatted_address

  return

'use strict'
angular
  .module('app')
  .controller('EditStoreCtrl', EditStoreCtrl)