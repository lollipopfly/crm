app.controller 'showRouteCtrl', ($scope, $http) ->
  $scope.pointForms = []
  $scope.pathArr = window.location.pathname.split('/',3)
  $scope.id = $scope.pathArr[$scope.pathArr.length - 1]

  $http(
    method: 'GET'
    url: '/routes/getpoints/' + $scope.id).then ((response) ->
      $scope.pointForms = response.data
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

  return

