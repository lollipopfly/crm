app.directive 'deleteAvatar', () ->
  restrict: 'AE'
  templateUrl: '/views/directives/delete_avatar.html'
  scope:
    imgName: '=imgName'

  link: (scope, element, attrs) ->
    scope.remove = () ->
      scope.imgName = 'default.jpg'
      element[0].querySelector('input').setAttribute('value', 'removed')



