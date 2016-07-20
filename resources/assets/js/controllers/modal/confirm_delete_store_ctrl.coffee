app.controller 'confirmDeleteStoreCtrl', ($scope, $rootScope, $uibModalInstance) ->
    $scope.modalTitle = 'Delete store'
    $scope.modalText = 'Are you sure?'

    $scope.ok = ->
        $uibModalInstance.close()
        return

    $scope.cancel = ->
        $uibModalInstance.dismiss()
        return