checkboxField = () ->
  directive = {
    restrict: 'EA',
    templateUrl: '/views/directives/checkbox_field.html',
    scope: {
      label: '=label',
      attrClass: '=?attrClass',
      ngChecked: '=?ngChecked',
      model: '=model',
    },
    link: (scope, element, attr) ->
      if scope.model == '1'
        scope.model = true
      else if scope.model == '0'
        scope.model = false

      return
  }

  return directive

'use strict'

angular
  .module('app')
  .directive 'checkboxField', checkboxField
