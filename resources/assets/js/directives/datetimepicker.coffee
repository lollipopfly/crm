app.directive 'datetimepicker', () ->
  restrict: 'AE'
  templateUrl: '/views/directives/datetimepicker.html'
  scope:
    label: "=?label"
    attrName: "=attrName"
    attrValue: "=?attrValue"

  link: (scope, element, attrs) ->
    scope.open = () ->
      scope.date_opened = true




