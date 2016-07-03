app.directive 'checkboxField', () ->
  restrict: 'AE'
  templateUrl: '/views/directives/checkbox_field.html'
  scope:
    label: '=label'
    attrName: '=attrName'
    attrValue: "=?attrValue"

  link: (scope, element, attrs) ->
