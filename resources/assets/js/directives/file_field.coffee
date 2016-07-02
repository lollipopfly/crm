app.directive 'fileField', () ->
  restrict: 'AE'
  templateUrl: '/views/directives/file_field.html'
  scope:
    attrId: '=?attrId'
    attrName: '=attrName'

  link: (scope, element, attrs) ->
    if scope.attrId == undefined
        scope.attrId = 'default-file-id'
    element.bind 'change', (changeEvent) ->
      scope.element = element
      files = event.target.files;
      fileName = files[0].name;
      element[0].querySelector('input[type=text]').setAttribute('value', fileName)
