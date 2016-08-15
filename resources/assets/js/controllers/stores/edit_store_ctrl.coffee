app.controller 'editStoreCtrl', ($scope, $http) ->
    $scope.pathArr = window.location.pathname.split('/',3)
    $scope.id = $scope.pathArr[$scope.pathArr.length - 1]

    # Get addres for typehead directive
    $http(
      method: 'GET'
      url: '/stores/getstoreaddress/' + $scope.id).then ((response) ->
        $scope.asyncSelected = response.data

        return
    )

    $scope.getLocation = (address) ->
      $http.get('//maps.googleapis.com/maps/api/geocode/json', params:
        address: address
        language: 'en'
        components: 'country:UK|administrative_area:London'
    ).then (response) ->
        response.data.results.map (item) ->
          item.formatted_address

