deleteAvatar = ($timeout) ->
  directive = {
    restrict: 'EA'
    templateUrl: '/views/directives/delete_avatar.html'
    scope:
      removeAvatar: '=ngModel'
    link: (scope, element, attrs) ->
      $timeout(()->
        scope.imgName = attrs.imgName
      ,150)
      scope.remove = () ->
        scope.imgName = 'images/default_avatar.jpg'
        # If removeAvatar = false, we have new image. If null - initial val
        if scope.removeAvatar == null
          scope.removeAvatar = true
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'deleteAvatar', deleteAvatar