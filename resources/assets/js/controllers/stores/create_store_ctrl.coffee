CreateStoreCtrl = ($scope, $http, $state) ->
  vm = this

  vm.create = () ->
    store =
      name: vm.storeName
      owner_name: vm.ownerName
      address: vm.address
      phone: vm.phone
      email: vm.email

    $http.post('/api/stores', store)
      .then (response) ->
        $state.go 'stores', { flashSuccess: 'New store created!' }
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
  .controller('CreateStoreCtrl', CreateStoreCtrl)