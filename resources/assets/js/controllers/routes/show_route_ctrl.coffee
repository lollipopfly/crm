ShowRouteCtrl = ($http, $stateParams, $state) ->
  vm = this
  vm.id = $stateParams.id

  # Map
  apiKey = 'a303d3a44a01c9f8a5cb0107b033efbe'
  vm.markers = []

  # Get points
  $http.get('/api/routes/' + vm.id)
    .then (response) ->
      vm.route = response.data.route
      vm.stores = response.data.stores
      vm.points = response.data.points
      vm.route.date = moment(new Date(vm.route.date)).format('DD.MM.YYYY')

      # Init map
      initMap()

      return
    , (error) ->
      vm.error = error.data
      console.log(error)

  vm.deleteRoute = (id) ->
    confirmation = confirm('Are you sure?')

    if confirmation
      $http.delete('/api/routes/' + id).then ((response) ->
        $state.go 'routes', { flashSuccess: 'Route Deleted!' }

        return
      ), (error) ->
        vm.error = error

  # When the window has finished loading create our google map below
  initMap = () ->
    # Basic options for a simple Google Map
    mapOptions = {
      zoom: 12,
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
      center: new (google.maps.LatLng)(51.500152, -0.126236),
      styles:vm.styles,
    }

    mapElement = document.getElementById('route-map')
    map = new (google.maps.Map)(mapElement, mapOptions)
    prevInfoWindow =false

    # Set locations
    angular.forEach(vm.points, (value, key) ->
      address = value.store.address
      # Geocode Addresses by address name
      apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + address +
        "&pretty=1&key=" + apiKey
      req = new XMLHttpRequest()

      req.onload = () ->
        if (req.readyState == 4 && req.status == 200)
          response = JSON.parse(this.responseText)
          position = response.results[0].geometry

          if response.status.code == 200
            contentString =
              '<div class="marker-content">' +
                '<div><span class="maker-content__title">' +
                  'Address:</span> ' + value.store.address + '</div>' +
                '<div><span class="maker-content__title">' +
                  'Phone:</span> ' + value.store.phone + '</div>' +
              '</div>'
            # popup
            infoWindow = new (google.maps.InfoWindow)(content: contentString)

            # select icons by status (green or red)
            if parseInt value.status
              vm.baloonName = 'images/balloon_shiped.png'
            else
              vm.baloonName = 'images/balloon.png'

            marker = new (google.maps.Marker)(
              map: map,
              icon: vm.baloonName,
              position: position,
            )

            # Click by other marker
            google.maps.event.addListener(marker, 'click', () ->
              if prevInfoWindow
                prevInfoWindow.close()

              prevInfoWindow = infoWindow
              map.panTo(marker.getPosition()) # animate move between markers
              infoWindow.open map, marker

              return
            )

            # Click by empty map area
            google.maps.event.addListener(map, 'click', () ->
              infoWindow.close()

              return
            )

            # Add new marker to array for outside map links -
            # - (ordered by id in backend)
            vm.markers.push(marker)

      req.open("GET", apiUrl, true)
      req.send()
    )

    return

  vm.styles = [
    {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [
        { 'color': '#e9e9e9' },
        { 'lightness': 17 },
      ]
    },
    {
      'featureType': 'landscape',
      'elementType': 'geometry',
      'stylers': [
        { 'color': '#f5f5f5' },
        { 'lightness': 20 },
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry.fill',
      'stylers': [
        { 'color': '#ffffff' },
        { 'lightness': 17 },
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry.stroke',
      'stylers': [
        { 'color': '#ffffff' },
        { 'lightness': 29 },
        { 'weight': 0.2 },
      ]
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'geometry',
      'stylers': [
        { 'color': '#ffffff' },
        { 'lightness': 18 },
      ]
    },
    {
      'featureType': 'road.local',
      'elementType': 'geometry',
      'stylers': [
        { 'color': '#ffffff' },
        { 'lightness': 16 },
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'geometry',
      'stylers': [
        { 'color': '#f5f5f5' },
        { 'lightness': 21 },
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry',
      'stylers': [
        { 'color': '#dedede' },
        { 'lightness': 21 },
      ]
    },
    {
      'elementType': 'labels.text.stroke',
      'stylers': [
        { 'visibility': 'on' },
        { 'color': '#ffffff' },
        { 'lightness': 16 },
      ]
    },
    {
      'elementType': 'labels.text.fill',
      'stylers': [
        { 'saturation': 36 },
        { 'color': '#333333' },
        { 'lightness': 40 },
      ]
    },
    {
      'elementType': 'labels.icon',
      'stylers': [ { 'visibility': 'off' } ]
    }
    {
      'featureType': 'transit',
      'elementType': 'geometry',
      'stylers': [
        { 'color': '#f2f2f2' },
        { 'lightness': 19 },
      ]
    }
    {
      'featureType': 'administrative',
      'elementType': 'geometry.fill',
      'stylers': [
        { 'color': '#fefefe' },
        { 'lightness': 20 },
      ]
    },
    {
      'featureType': 'administrative',
      'elementType': 'geometry.stroke',
      'stylers': [
        { 'color': '#fefefe' },
        { 'lightness': 17 },
        { 'weight': 1.2 },
      ]
    }
  ]

  # Go to point after click outside map link
  vm.goToPoint = (id) ->
    google.maps.event.trigger(vm.markers[id], 'click')

  return

'use strict'

angular
  .module('app')
  .controller('ShowRouteCtrl', ShowRouteCtrl)
