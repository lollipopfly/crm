timepicker = () ->
  directive = {
    restrict: 'AE'
    templateUrl: '/views/directives/timepicker.html'
    scope: {
      model: "=ngModel"
      label: "=?label"
      attrName: "@"
    }
    link: (scope, element, attr) ->
      scope.hstep = 1
      scope.mstep = 5
      scope.ismeridian = true
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'timepicker', timepicker
