app.controller 'indexStoreCtrl', ($scope, $rootScope, $http, $uibModal) ->
    $scope.deleteStore = (id) ->
        $uibModal.open(
            templateUrl: 'confirmModal.html'
            controller: 'confirmDeleteStoreCtrl'
            size: 'md'
        ).result.then (->
            $http(
                method: 'DELETE'
                url: '/stores/' + id).then ((response) ->
                    window.location.reload()
                    return
            ), (response) ->
                return
            return
        ), (res)->
            return
        return

