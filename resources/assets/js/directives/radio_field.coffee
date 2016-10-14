radioField = ($http) ->
  directive = {
    restrict: 'EA'
    templateUrl: '/views/directives/radio_field.html'
    controllerAs: 'vm',
    controller: '@'
    name: 'ctrl',
    bindToController: true
    scope: {
      ngModel: "=ngModel"
      label: '=label'
      attrName: '=attrName'
      attrValue: '=attrValue'
      ngChecked: '=?ngChecked'
    }
    link: (scope, element, attr)->
      scope.vm.ngModel = scope.vm.attrValue

      element.bind('change', ()->
        scope.vm.ngModel = scope.vm.attrValue
      )
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'radioField', radioField