app.controller 'indexUserCtrl', ($scope, $rootScope, $http, $uibModal) ->
    $scope.deleteUser = (id) ->
        confirmation = confirm('Are you sure?')

        if confirmation
            $http(
                method: 'DELETE'
                url: '/users/' + id).then ((response) ->
                    window.location.reload()
                    return
            )

        return

