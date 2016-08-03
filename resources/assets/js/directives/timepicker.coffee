app.directive 'timepicker', () ->
  restrict: 'AE'
  templateUrl: '/views/directives/timepicker.html'
  scope:
    label: "=?label"
    attrName: "@"
    model: "=ngModel"

  link: (scope, element, attrs) ->
    scope.hstep = 1
    scope.mstep = 5
    scope.ismeridian = true



