app.directive 'radioField', () ->
  restrict: 'AE'
  templateUrl: '/views/directives/radio_field.html'
  scope:
    label: '=label'
    attrName: '=attrName'
    attrValue: '=attrValue'
    checked: '=?cheked'

  link: (scope, element, attrs) ->
