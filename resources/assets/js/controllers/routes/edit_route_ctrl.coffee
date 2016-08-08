app.controller 'editRouteCtrl', ($scope, $http) ->
  $scope.pathArr = window.location.pathname.split('/',3)
  $scope.id = $scope.pathArr[$scope.pathArr.length - 1]
  $scope.count = 1;

  $http(
    method: 'GET'
    url: '/routes/getpoints/' + $scope.id).then ((response) ->
      $scope.pointForms = response.data
      return
  )

  $scope.addPoint = () ->
    $scope.pointForms.push({
      id: $scope.count + '_new'
    })
    $scope.count++
    return

  $scope.removePoint = (index) ->
    $scope.pointForms.splice(index, 1)


