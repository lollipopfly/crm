app.controller 'showStoreCtrl', ($scope, $http) ->
    $scope.deleteStore = (id) ->
        confirmation = confirm('Are you sure?')

        if confirmation
            $http(
                method: 'DELETE'
                url: '/stores/' + id).then ((response) ->
                    document.location.href = '/stores/'
                    return
            )

        return

