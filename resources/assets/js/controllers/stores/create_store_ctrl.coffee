app.controller 'createStoreCtrl', ($scope, $http) ->
    # _selected = undefined
    # $scope.selected = undefined

    $scope.getLocation = (val) ->
      $http.get('//maps.googleapis.com/maps/api/geocode/json', params:
        address: val
        language: 'en'
        components: 'country:UK|administrative_area:London'
        ).then (response) ->
        response.data.results.map (item) ->
          item.formatted_address

