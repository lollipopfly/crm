app.directive 'checkboxField', () ->
  restrict: 'AE'
  templateUrl: '/views/directives/checkbox_field.html'
  scope:
    label: '=label'
    attrName: '=attrName'

  link: (scope, element, attrs) ->
