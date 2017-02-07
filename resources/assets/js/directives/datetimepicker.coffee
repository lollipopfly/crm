datetimepicker = ($timeout) ->
  directive = {
    restrict: 'AE'
    templateUrl: '/views/directives/datetimepicker.html'
    require: 'ngModel'
    scope: {
      label: "=?label"
    }
    link: (scope, element, attr, ngModel) ->
      scope.open = () ->
        scope.date_opened = true

      $timeout(
        (() ->
          scope.model = Date.parse(ngModel.$viewValue)
        ), 400
      )

      scope.selectDate = ((model) ->
          ngModel.$setViewValue(model)
      )
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'datetimepicker', datetimepicker
