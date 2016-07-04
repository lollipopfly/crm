var app, dependencies;

dependencies = ["ui.bootstrap", "ngLodash"];

app = angular.module('app', dependencies);

app.directive('checkboxField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/checkbox_field.html',
    scope: {
      label: '=label',
      attrName: '=attrName',
      attrValue: "=?attrValue"
    },
    link: function(scope, element, attrs) {}
  };
});

app.directive('confirmModal', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/confirm_modal.html',
    scope: true,
    link: function(scope, element, attrs) {}
  };
});

app.directive('datetimepicker', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/datetimepicker.html',
    scope: {
      label: "=?label",
      attrName: "=attrName",
      attrValue: "=?attrValue"
    },
    link: function(scope, element, attrs) {
      return scope.open = function() {
        return scope.date_opened = true;
      };
    }
  };
});

app.directive('deleteAvatar', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/delete_avatar.html',
    scope: {
      imgName: '=imgName'
    },
    link: function(scope, element, attrs) {
      return scope.remove = function() {
        scope.imgName = 'default.jpg';
        return element[0].querySelector('input').setAttribute('value', 'removed');
      };
    }
  };
});

app.directive('fileField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/file_field.html',
    scope: {
      attrId: '=?attrId',
      attrName: '=attrName'
    },
    link: function(scope, element, attrs) {
      if (scope.attrId === void 0) {
        scope.attrId = 'default-file-id';
      }
      return element.bind('change', function(changeEvent) {
        var fileName, files;
        scope.element = element;
        files = event.target.files;
        fileName = files[0].name;
        return element[0].querySelector('input[type=text]').setAttribute('value', fileName);
      });
    }
  };
});

app.directive('radioField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/radio_field.html',
    scope: {
      label: '=label',
      attrName: '=attrName',
      attrValue: '=attrValue',
      checked: '=?cheked'
    },
    link: function(scope, element, attrs) {}
  };
});

app.controller('confirmDeleteUserCtrl', function($scope, $rootScope, $uibModalInstance) {
  $scope.modalTitle = 'Delete user';
  $scope.modalText = 'Are you sure?';
  $scope.ok = function() {
    $uibModalInstance.close();
  };
  return $scope.cancel = function() {
    $uibModalInstance.dismiss();
  };
});

app.controller('createUserCtrl', [
  "$scope", "lodash", function($scope, lodash) {
    $scope.passInput = document.querySelector('.password-input');
    $scope.chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ <>ABCDEFGHIJKLMNOP1234567890';
    return $scope.generatePass = function() {
      var i, passLength, x;
      $scope.pass = '';
      passLength = lodash.random(6, 15);
      x = 0;
      while (x < passLength) {
        i = Math.floor(Math.random() * $scope.chars.length);
        $scope.pass += $scope.chars.charAt(i);
        x++;
      }
      return $scope.pass;
    };
  }
]);

app.controller('indexUserCtrl', function($scope, $rootScope, $http, $uibModal) {
  return $scope.deleteUser = function(id) {
    $uibModal.open({
      templateUrl: 'confirmModal.html',
      controller: 'confirmDeleteUserCtrl',
      size: 'md'
    }).result.then((function() {
      $http({
        method: 'DELETE',
        url: '/users/' + id
      }).then((function(response) {
        window.location.reload();
      }), function(response) {});
    }), function(res) {});
  };
});
