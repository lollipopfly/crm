fileField = () ->
  directive = {
    restrict: 'AE',
    templateUrl: 'views/directives/file_field.html',
    scope: {
      attrId: '=',
      ngModel: '=ngModel',
      removeAvatar: '=?removedAvatar',
    },
    link: (scope, element, attr) ->
      element.bind 'change', (changeEvent) ->
        scope.ngModel = event.target.files
        scope.removeAvatar = false # for delete_avatar directive
        files = event.target.files
        fileName = files[0].name

        element[0]
          .querySelector('input[type=text]')
          .setAttribute('value', fileName)
  }

  return directive

'use strict'

angular
  .module('app')
  .directive 'fileField', fileField
