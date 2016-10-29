deleteAvatar = ($timeout) ->
  directive = {
    restrict: 'EA'
    templateUrl: '/views/directives/delete_avatar.html'
    scope:
      removeAvatar: '=ngModel'
    link: (scope, element, attrs) ->
      attrs.$observe 'imgName', (value) ->
        scope.imgName = value
        return

      scope.remove = () ->
        $timeout(()->
          scope.imgName = 'images/default_avatar.jpg'
        )
        # If removeAvatar = false, we have new image. If null - initial val
        if scope.removeAvatar == null
          scope.removeAvatar = true
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'deleteAvatar', deleteAvatar