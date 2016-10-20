datetimepicker = () ->
  directive = {
    restrict: 'AE'
    templateUrl: '/views/directives/datetimepicker.html'
    controllerAs: 'vm',
    controller: '@'
    name: 'ctrl',
    bindToController: true
    scope: {
      ngModel: "=ngModel"
      label: "=?label"
      attrValue: "=?attrValue"
    }
    link: (scope, element, attr) ->
      scope.vm.open = () ->
        scope.vm.date_opened = true
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'datetimepicker', datetimepicker