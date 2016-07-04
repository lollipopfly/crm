app.controller 'indexUserCtrl', ($scope, $rootScope, $http, $uibModal) ->
    $scope.deleteUser = (id) ->
        $uibModal.open(
            templateUrl: 'confirmModal.html'
            controller: 'confirmDeleteUserCtrl'
            size: 'md'
        ).result.then (->
            $http(
                method: 'DELETE'
                url: '/users/' + id).then ((response) ->
                    window.location.reload()
                    return
            ), (response) ->
                return
            return
        ), (res)->
            return
        return

