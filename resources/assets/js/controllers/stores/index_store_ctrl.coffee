app.controller 'indexStoreCtrl', ($scope, $http) ->
    $scope.deleteStore = (id) ->
        confirmation = confirm('Are you sure?')

        if confirmation
            $http(
                method: 'DELETE'
                url: '/stores/' + id).then ((response) ->
                    window.location.reload()
                    return
            )

        return

