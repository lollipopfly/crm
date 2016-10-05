CreateStoreCtrl = ($scope, $http) ->
    $scope.getLocation = (address) ->
      $http.get('//maps.googleapis.com/maps/api/geocode/json', params:
        address: address
        language: 'en'
        components: 'country:UK|administrative_area:London'
    ).then (response) ->
        response.data.results.map (item) ->
          item.formatted_address

'use strict'
angular
  .module('app')
  .controller('CreateStoreCtrl', CreateStoreCtrl)

