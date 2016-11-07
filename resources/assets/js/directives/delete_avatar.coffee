deleteAvatar = ($timeout) ->
  directive = {
    restrict: 'EA'
    templateUrl: '/views/directives/delete_avatar.html'
    scope:
      removeAvatar: '=ngModel'
      file: "=file"
    link: (scope, element, attrs) ->
      attrs.$observe 'imgName', (value) ->
        scope.imgName = value
        return

      scope.remove = () ->
        $timeout(()->
          scope.imgName = 'images/default_avatar.jpg'
        )

        if scope.file != 'default_avatar.jpg'
          scope.removeAvatar = true
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'deleteAvatar', deleteAvatar