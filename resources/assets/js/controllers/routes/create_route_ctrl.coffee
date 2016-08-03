app.controller 'createRouteCtrl', ($scope) ->
  $scope.pointForms = []

  $scope.addPoint = () ->
    $scope.pointForms.push({})

  $scope.removePoint = (index) ->
    $scope.pointForms.splice(index, 1)



