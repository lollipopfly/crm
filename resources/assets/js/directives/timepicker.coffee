timepicker = () ->
  directive = {
    restrict: 'AE'
    templateUrl: '/views/directives/timepicker.html'
    controllerAs: 'vm',
    controller: '@'
    name: 'ctrl',
    bindToController: true
    scope: {
      model: "=ngModel"
      label: "=?label"
      attrName: "@"
    }
    link: (scope, element, attr) ->
      scope.vm.hstep = 1
      scope.vm.mstep = 5
      scope.vm.ismeridian = true
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'timepicker', timepicker