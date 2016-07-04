app.controller 'confirmDeleteUserCtrl', ($scope, $rootScope, $uibModalInstance) ->
    $scope.modalTitle = 'Delete user'
    $scope.modalText = 'Are you sure?'

    $scope.ok = ->
        $uibModalInstance.close()
        return

    $scope.cancel = ->
        $uibModalInstance.dismiss()
        return