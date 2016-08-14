app.directive 'checkboxField', () ->
  restrict: 'AE'
  templateUrl: '/views/directives/checkbox_field.html'
  scope:
    label: '=label'
    attrName: '=attrName'
    attrClass: '=?attrClass'
    attrValue: '=attrValue'
    checked: '=checked'

  link: (scope, element, attrs) ->
