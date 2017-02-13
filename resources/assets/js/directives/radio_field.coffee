radioField = ($http) ->
  directive = {
    restrict: 'EA',
    templateUrl: '/views/directives/radio_field.html',
    scope: {
      ngModel: "=ngModel",
      label: '=label',
      attrName: '=attrName',
      attrValue: '=attrValue',
      ngChecked: '=?ngChecked',
    },
    link: (scope, element, attr) ->
      scope.ngModel = scope.attrValue

      element.bind('change', () ->
        scope.ngModel = scope.attrValue
      )
  }

  return directive

'use strict'

angular
  .module('app')
  .directive 'radioField', radioField
