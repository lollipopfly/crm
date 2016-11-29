IndexHomeCtrl = ($http, $timeout, $filter, $rootScope) ->
  vm = this

  # Routes
  vm.sortReverse = null
  vm.pagiApiUrl = '/api/home'
  orderBy = $filter('orderBy')

  # Map
  apiKey = 'a303d3a44a01c9f8a5cb0107b033efbe';
  vm.markers = []


  ###  ROUTES  ###
  if $rootScope.currentUser.user_group == 'admin'
    $http.get('/api/home').then((response) ->
      vm.routes = response.data.data
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
      $('#'+predicate).removeClass('active-desc').addClass('active-asc')

    vm.predicate = predicate
    vm.reverse = if (vm.predicate == predicate) then !vm.reverse else false
    vm.routes = orderBy(vm.routes, predicate, vm.reverse)

    return

  ###  MAP  ###
  # Get points JSON
  $http(
    method: 'GET'
    url: '/api/home/getpoints').then ((response) ->
      vm.points = response.data

      return
  )

  initMap = ->
    mapOptions =
      zoom: 12
      scrollwheel: false,
      mapTypeControl: false
      streetViewControl: false
      zoomControlOptions: position: google.maps.ControlPosition.LEFT_BOTTOM
      center: new (google.maps.LatLng)(51.5073509, -0.1277583)
      styles: vm.styles

    mapElement = document.getElementById('map')
    map = new (google.maps.Map)(mapElement, mapOptions)
    prevInfoWindow =false

    # Set locations
    angular.forEach( vm.points, (value, key) ->
      console.log(value);
      address = value.store.address
      # Geocode Addresses by address name
      apiUrl = "https://api.opencagedata.com/geocode/v1/json?q="+address+"&pretty=1&key=" + apiKey;
      req = new XMLHttpRequest();

      req.onload = () ->
        if (req.readyState == 4 && req.status == 200)
          response = JSON.parse(this.responseText)
          position = response.results[0].geometry

          if (response.status.code == 200)
            contentString = '<div class="marker-content">' + value.store.address + '</div>'
            infoWindow = new (google.maps.InfoWindow)(content: contentString) # popup

            # select icons by status (green or red)
            if parseInt value.status
              vm.baloonName = 'images/balloon_shiped.png'
            else
              vm.baloonName = 'images/balloon.png'

            marker = new (google.maps.Marker)(
              map: map
              icon: vm.baloonName
              position: position
            )

            # Click by other marker
            google.maps.event.addListener(marker, 'click', ->
              if( prevInfoWindow )
                prevInfoWindow.close()

              prevInfoWindow = infoWindow
              map.panTo(marker.getPosition()) # animate move between markers
              infoWindow.open map, marker

              return
            )

            # Click by empty map area
            google.maps.event.addListener(map, 'click', ->
              infoWindow.close()

              return
            )

            # Add new marker to array for outside map links (ordered by id in backend)
            vm.markers.push(marker)
      req.open("GET", apiUrl, true);
      req.send();
    )

    return

  vm.styles = [
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

  # Go to point after click outside map link
  vm.goToPoint = (id) ->
    google.maps.event.trigger(vm.markers[id], 'click')

  # Init map
  $timeout (()->
    initMap()
    console.log('init');
    return
  ), 300

  return

'use strict'
angular
  .module('app')
  .controller('IndexHomeCtrl', IndexHomeCtrl)