app.controller 'indexRouteCtrl', ($scope, $http) ->
  $scope.deleteRoute = (id) ->
      confirmation = confirm('Are you sure?')

      if confirmation
          $http(
              method: 'DELETE'
              url: '/routes/' + id).then ((response) ->
                  window.location.reload()
                  return
          )

      return


