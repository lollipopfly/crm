var app, dependencies;

dependencies = [];

app = angular.module('app', dependencies);

app.directive('checkboxField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/checkbox_field.html',
    scope: {
      label: '=label',
      attrName: '=attrName'
    },
    link: function(scope, element, attrs) {}
  };
});

app.directive('fileField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/file_field.html',
    scope: {
      attrId: '=attrId',
      attrName: '=attrName'
    },
    link: function(scope, element, attrs) {
      return element.bind('change', function(changeEvent) {
        var fileName, files;
        scope.element = element;
        files = event.target.files;
        fileName = files[0].name;
        return element[0].querySelector('input[type=text]').setAttribute('value', fileName);
      });
    }
  };
});
