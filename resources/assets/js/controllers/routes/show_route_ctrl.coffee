app.controller 'showRouteCtrl', ($scope, $http) ->
  $scope.pointForms = []
  $scope.pathArr = window.location.pathname.split('/',3)
  $scope.id = $scope.pathArr[$scope.pathArr.length - 1]

  $http(
    method: 'GET'
    url: '/routes/getpointsjson/' + $scope.id).then ((response) ->
      $scope.points = response.data
      console.log($scope.points);
      return
  )

  $scope.deleteRoute = (id) ->
    confirmation = confirm('Are you sure?')

    if confirmation
      $http(
        method: 'DELETE'
        url: '/routes/' + id).then ((response) ->
          document.location.href = '/routes/'
          return
      )

  # When the window has finished loading create our google map below
  init = ->
    # Basic options for a simple Google Map
    mapOptions =
      zoom: 12
      scrollwheel: false,
      mapTypeControl: false
      streetViewControl: false
      zoomControlOptions: position: google.maps.ControlPosition.LEFT_BOTTOM
      center: new (google.maps.LatLng)(51.500152, -0.126236)
      styles: $scope.styles

    mapElement = document.getElementById('route-map')
    map = new (google.maps.Map)(mapElement, mapOptions)

    marker = new (google.maps.Marker)(
      icon: 'images/baloon.svg'
      position: new (google.maps.LatLng)(51.500152, -0.126236)
      map: map
      title: 'Snazzy!')
    return

  $scope.styles = [
    {
      'featureType': 'water'
      'elementType': 'geometry'
      'stylers': [
        { 'color': '#e9e9e9' }
        { 'lightness': 17 }
      ]
    }
    {
      'featureType': 'landscape'
      'elementType': 'geometry'
      'stylers': [
        { 'color': '#f5f5f5' }
        { 'lightness': 20 }
      ]
    }
    {
      'featureType': 'road.highway'
      'elementType': 'geometry.fill'
      'stylers': [
        { 'color': '#ffffff' }
        { 'lightness': 17 }
      ]
    }
    {
      'featureType': 'road.highway'
      'elementType': 'geometry.stroke'
      'stylers': [
        { 'color': '#ffffff' }
        { 'lightness': 29 }
        { 'weight': 0.2 }
      ]
    }
    {
      'featureType': 'road.arterial'
      'elementType': 'geometry'
      'stylers': [
        { 'color': '#ffffff' }
        { 'lightness': 18 }
      ]
    }
    {
      'featureType': 'road.local'
      'elementType': 'geometry'
      'stylers': [
        { 'color': '#ffffff' }
        { 'lightness': 16 }
      ]
    }
    {
      'featureType': 'poi'
      'elementType': 'geometry'
      'stylers': [
        { 'color': '#f5f5f5' }
        { 'lightness': 21 }
      ]
    }
    {
      'featureType': 'poi.park'
      'elementType': 'geometry'
      'stylers': [
        { 'color': '#dedede' }
        { 'lightness': 21 }
      ]
    }
    {
      'elementType': 'labels.text.stroke'
      'stylers': [
        { 'visibility': 'on' }
        { 'color': '#ffffff' }
        { 'lightness': 16 }
      ]
    }
    {
      'elementType': 'labels.text.fill'
      'stylers': [
        { 'saturation': 36 }
        { 'color': '#333333' }
        { 'lightness': 40 }
      ]
    }
    {
      'elementType': 'labels.icon'
      'stylers': [ { 'visibility': 'off' } ]
    }
    {
      'featureType': 'transit'
      'elementType': 'geometry'
      'stylers': [
        { 'color': '#f2f2f2' }
        { 'lightness': 19 }
      ]
    }
    {
      'featureType': 'administrative'
      'elementType': 'geometry.fill'
      'stylers': [
        { 'color': '#fefefe' }
        { 'lightness': 20 }
      ]
    }
    {
      'featureType': 'administrative'
      'elementType': 'geometry.stroke'
      'stylers': [
        { 'color': '#fefefe' }
        { 'lightness': 17 }
        { 'weight': 1.2 }
      ]
    }
  ]

  # Init map
  google.maps.event.addDomListener window, 'load', init