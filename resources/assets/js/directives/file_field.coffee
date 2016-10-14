fileField = () ->
  directive = {
    restrict: 'AE'
    templateUrl: 'views/directives/file_field.html'
    controllerAs: 'vm',
    controller: '@'
    name: 'ctrl',
    bindToController: true
    scope: {
      attrId: '='
      ngModel: '=ngModel'
    }
    link: (scope, element, attr) ->
      element.bind 'change', (changeEvent) ->
        scope.vm.ngModel = event.target.files;
        files = event.target.files;
        fileName = files[0].name;
        element[0].querySelector('input[type=text]').setAttribute('value', fileName)
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'fileField', fileField