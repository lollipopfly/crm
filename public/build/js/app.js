var app, dependencies;

dependencies = ["ui.bootstrap", "ngLodash", "ngMask", "angularMoment"];

app = angular.module('app', dependencies);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxZQUFBLEdBQWUsQ0FDWCxjQURXLEVBRVgsVUFGVyxFQUdYLFFBSFcsRUFJWCxlQUpXOztBQU9mLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBUixDQUFlLEtBQWYsRUFBc0IsWUFBdEIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZGVwZW5kZW5jaWVzID0gW1xuICAgIFwidWkuYm9vdHN0cmFwXCIsXG4gICAgXCJuZ0xvZGFzaFwiLFxuICAgIFwibmdNYXNrXCIsXG4gICAgXCJhbmd1bGFyTW9tZW50XCJcbl1cblxuYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIGRlcGVuZGVuY2llcykiXX0=

app.directive('checkboxField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/checkbox_field.html',
    scope: {
      label: '=label',
      attrName: '=attrName',
      attrClass: '=?attrClass',
      attrValue: '=attrValue',
      checked: '=checked'
    },
    link: function(scope, element, attrs) {}
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY2hlY2tib3hfZmllbGQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxTQUFKLENBQWMsZUFBZCxFQUErQixTQUFBO1NBQzdCO0lBQUEsUUFBQSxFQUFVLElBQVY7SUFDQSxXQUFBLEVBQWEsdUNBRGI7SUFFQSxLQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sUUFBUDtNQUNBLFFBQUEsRUFBVSxXQURWO01BRUEsU0FBQSxFQUFXLGFBRlg7TUFHQSxTQUFBLEVBQVcsWUFIWDtNQUlBLE9BQUEsRUFBUyxVQUpUO0tBSEY7SUFTQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQixHQUFBLENBVE47O0FBRDZCLENBQS9CIiwiZmlsZSI6ImRpcmVjdGl2ZXMvY2hlY2tib3hfZmllbGQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuZGlyZWN0aXZlICdjaGVja2JveEZpZWxkJywgKCkgLT5cbiAgcmVzdHJpY3Q6ICdBRSdcbiAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9jaGVja2JveF9maWVsZC5odG1sJ1xuICBzY29wZTpcbiAgICBsYWJlbDogJz1sYWJlbCdcbiAgICBhdHRyTmFtZTogJz1hdHRyTmFtZSdcbiAgICBhdHRyQ2xhc3M6ICc9P2F0dHJDbGFzcydcbiAgICBhdHRyVmFsdWU6ICc9YXR0clZhbHVlJ1xuICAgIGNoZWNrZWQ6ICc9Y2hlY2tlZCdcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSAtPlxuIl19

app.directive('datetimepicker', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/datetimepicker.html',
    scope: {
      model: "=model",
      label: "=?label",
      attrName: "=attrName",
      attrValue: "=?attrValue"
    },
    link: function(scope, element, attrs) {
      return scope.open = function() {
        return scope.date_opened = true;
      };
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxTQUFKLENBQWMsZ0JBQWQsRUFBZ0MsU0FBQTtTQUM5QjtJQUFBLFFBQUEsRUFBVSxJQUFWO0lBQ0EsV0FBQSxFQUFhLHVDQURiO0lBRUEsS0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFFBQVA7TUFDQSxLQUFBLEVBQU8sU0FEUDtNQUVBLFFBQUEsRUFBVSxXQUZWO01BR0EsU0FBQSxFQUFXLGFBSFg7S0FIRjtJQVFBLElBQUEsRUFBTSxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCO2FBQ0osS0FBSyxDQUFDLElBQU4sR0FBYSxTQUFBO2VBQ1gsS0FBSyxDQUFDLFdBQU4sR0FBb0I7TUFEVDtJQURULENBUk47O0FBRDhCLENBQWhDIiwiZmlsZSI6ImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuZGlyZWN0aXZlICdkYXRldGltZXBpY2tlcicsICgpIC0+XG4gIHJlc3RyaWN0OiAnQUUnXG4gIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuaHRtbCdcbiAgc2NvcGU6XG4gICAgbW9kZWw6IFwiPW1vZGVsXCJcbiAgICBsYWJlbDogXCI9P2xhYmVsXCJcbiAgICBhdHRyTmFtZTogXCI9YXR0ck5hbWVcIlxuICAgIGF0dHJWYWx1ZTogXCI9P2F0dHJWYWx1ZVwiXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICBzY29wZS5vcGVuID0gKCkgLT5cbiAgICAgIHNjb3BlLmRhdGVfb3BlbmVkID0gdHJ1ZVxuXG5cblxuIl19

app.directive('deleteAvatar', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/delete_avatar.html',
    scope: {
      imgName: '=imgName'
    },
    link: function(scope, element, attrs) {
      return scope.remove = function() {
        scope.imgName = 'default.jpg';
        return element[0].querySelector('input').setAttribute('value', 'removed');
      };
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGVsZXRlX2F2YXRhci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBRyxDQUFDLFNBQUosQ0FBYyxjQUFkLEVBQThCLFNBQUE7U0FDNUI7SUFBQSxRQUFBLEVBQVUsSUFBVjtJQUNBLFdBQUEsRUFBYSxzQ0FEYjtJQUVBLEtBQUEsRUFDRTtNQUFBLE9BQUEsRUFBUyxVQUFUO0tBSEY7SUFLQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQjthQUNKLEtBQUssQ0FBQyxNQUFOLEdBQWUsU0FBQTtRQUNiLEtBQUssQ0FBQyxPQUFOLEdBQWdCO2VBQ2hCLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUFYLENBQXlCLE9BQXpCLENBQWlDLENBQUMsWUFBbEMsQ0FBK0MsT0FBL0MsRUFBd0QsU0FBeEQ7TUFGYTtJQURYLENBTE47O0FBRDRCLENBQTlCIiwiZmlsZSI6ImRpcmVjdGl2ZXMvZGVsZXRlX2F2YXRhci5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImFwcC5kaXJlY3RpdmUgJ2RlbGV0ZUF2YXRhcicsICgpIC0+XG4gIHJlc3RyaWN0OiAnQUUnXG4gIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvZGVsZXRlX2F2YXRhci5odG1sJ1xuICBzY29wZTpcbiAgICBpbWdOYW1lOiAnPWltZ05hbWUnXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICBzY29wZS5yZW1vdmUgPSAoKSAtPlxuICAgICAgc2NvcGUuaW1nTmFtZSA9ICdkZWZhdWx0LmpwZydcbiAgICAgIGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignaW5wdXQnKS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ3JlbW92ZWQnKVxuXG5cblxuIl19

app.directive('fileField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/file_field.html',
    scope: {
      attrId: '=?attrId',
      attrName: '=attrName'
    },
    link: function(scope, element, attrs) {
      if (scope.attrId === void 0) {
        scope.attrId = 'default-file-id';
      }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZmlsZV9maWVsZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBRyxDQUFDLFNBQUosQ0FBYyxXQUFkLEVBQTJCLFNBQUE7U0FDekI7SUFBQSxRQUFBLEVBQVUsSUFBVjtJQUNBLFdBQUEsRUFBYSxtQ0FEYjtJQUVBLEtBQUEsRUFDRTtNQUFBLE1BQUEsRUFBUSxVQUFSO01BQ0EsUUFBQSxFQUFVLFdBRFY7S0FIRjtJQU1BLElBQUEsRUFBTSxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCO01BQ0osSUFBRyxLQUFLLENBQUMsTUFBTixLQUFnQixNQUFuQjtRQUNJLEtBQUssQ0FBQyxNQUFOLEdBQWUsa0JBRG5COzthQUVBLE9BQU8sQ0FBQyxJQUFSLENBQWEsUUFBYixFQUF1QixTQUFDLFdBQUQ7QUFDckIsWUFBQTtRQUFBLEtBQUssQ0FBQyxPQUFOLEdBQWdCO1FBQ2hCLEtBQUEsR0FBUSxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3JCLFFBQUEsR0FBVyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUM7ZUFDcEIsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQVgsQ0FBeUIsa0JBQXpCLENBQTRDLENBQUMsWUFBN0MsQ0FBMEQsT0FBMUQsRUFBbUUsUUFBbkU7TUFKcUIsQ0FBdkI7SUFISSxDQU5OOztBQUR5QixDQUEzQiIsImZpbGUiOiJkaXJlY3RpdmVzL2ZpbGVfZmllbGQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuZGlyZWN0aXZlICdmaWxlRmllbGQnLCAoKSAtPlxuICByZXN0cmljdDogJ0FFJ1xuICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2ZpbGVfZmllbGQuaHRtbCdcbiAgc2NvcGU6XG4gICAgYXR0cklkOiAnPT9hdHRySWQnXG4gICAgYXR0ck5hbWU6ICc9YXR0ck5hbWUnXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICBpZiBzY29wZS5hdHRySWQgPT0gdW5kZWZpbmVkXG4gICAgICAgIHNjb3BlLmF0dHJJZCA9ICdkZWZhdWx0LWZpbGUtaWQnXG4gICAgZWxlbWVudC5iaW5kICdjaGFuZ2UnLCAoY2hhbmdlRXZlbnQpIC0+XG4gICAgICBzY29wZS5lbGVtZW50ID0gZWxlbWVudFxuICAgICAgZmlsZXMgPSBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgICBmaWxlTmFtZSA9IGZpbGVzWzBdLm5hbWU7XG4gICAgICBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9dGV4dF0nKS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgZmlsZU5hbWUpXG4iXX0=

app.directive('radioField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/radio_field.html',
    scope: {
      label: '=label',
      attrName: '=attrName',
      attrValue: '=attrValue',
      checked: '=?cheked'
    },
    link: function(scope, element, attrs) {}
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvcmFkaW9fZmllbGQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxTQUFKLENBQWMsWUFBZCxFQUE0QixTQUFBO1NBQzFCO0lBQUEsUUFBQSxFQUFVLElBQVY7SUFDQSxXQUFBLEVBQWEsb0NBRGI7SUFFQSxLQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sUUFBUDtNQUNBLFFBQUEsRUFBVSxXQURWO01BRUEsU0FBQSxFQUFXLFlBRlg7TUFHQSxPQUFBLEVBQVMsVUFIVDtLQUhGO0lBUUEsSUFBQSxFQUFNLFNBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakIsR0FBQSxDQVJOOztBQUQwQixDQUE1QiIsImZpbGUiOiJkaXJlY3RpdmVzL3JhZGlvX2ZpZWxkLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiYXBwLmRpcmVjdGl2ZSAncmFkaW9GaWVsZCcsICgpIC0+XG4gIHJlc3RyaWN0OiAnQUUnXG4gIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvcmFkaW9fZmllbGQuaHRtbCdcbiAgc2NvcGU6XG4gICAgbGFiZWw6ICc9bGFiZWwnXG4gICAgYXR0ck5hbWU6ICc9YXR0ck5hbWUnXG4gICAgYXR0clZhbHVlOiAnPWF0dHJWYWx1ZSdcbiAgICBjaGVja2VkOiAnPT9jaGVrZWQnXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiJdfQ==

app.directive('timepicker', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/timepicker.html',
    require: 'ngModel',
    scope: {
      label: "=?label",
      attrName: "@",
      model: "=ngModel"
    },
    link: function(scope, element, attrs) {
      scope.hstep = 1;
      scope.mstep = 5;
      return scope.ismeridian = true;
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvdGltZXBpY2tlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBRyxDQUFDLFNBQUosQ0FBYyxZQUFkLEVBQTRCLFNBQUE7U0FDMUI7SUFBQSxRQUFBLEVBQVUsSUFBVjtJQUNBLFdBQUEsRUFBYSxtQ0FEYjtJQUVBLE9BQUEsRUFBUyxTQUZUO0lBR0EsS0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFNBQVA7TUFDQSxRQUFBLEVBQVUsR0FEVjtNQUVBLEtBQUEsRUFBTyxVQUZQO0tBSkY7SUFRQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQjtNQUNKLEtBQUssQ0FBQyxLQUFOLEdBQWM7TUFDZCxLQUFLLENBQUMsS0FBTixHQUFjO2FBQ2QsS0FBSyxDQUFDLFVBQU4sR0FBbUI7SUFIZixDQVJOOztBQUQwQixDQUE1QiIsImZpbGUiOiJkaXJlY3RpdmVzL3RpbWVwaWNrZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuZGlyZWN0aXZlICd0aW1lcGlja2VyJywgKCkgLT5cbiAgcmVzdHJpY3Q6ICdBRSdcbiAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy90aW1lcGlja2VyLmh0bWwnXG4gIHJlcXVpcmU6ICduZ01vZGVsJ1xuICBzY29wZTpcbiAgICBsYWJlbDogXCI9P2xhYmVsXCJcbiAgICBhdHRyTmFtZTogXCJAXCJcbiAgICBtb2RlbDogXCI9bmdNb2RlbFwiXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICBzY29wZS5oc3RlcCA9IDFcbiAgICBzY29wZS5tc3RlcCA9IDVcbiAgICBzY29wZS5pc21lcmlkaWFuID0gdHJ1ZVxuXG5cblxuIl19

app.controller('createRouteCtrl', function($scope) {
  $scope.pointForms = [];
  $scope.addPoint = function() {
    return $scope.pointForms.push({});
  };
  return $scope.removePoint = function(index) {
    return $scope.pointForms.splice(index, 1);
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3JvdXRlcy9jcmVhdGVfcm91dGVfY3RybC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBRyxDQUFDLFVBQUosQ0FBZSxpQkFBZixFQUFrQyxTQUFDLE1BQUQ7RUFDaEMsTUFBTSxDQUFDLFVBQVAsR0FBb0I7RUFFcEIsTUFBTSxDQUFDLFFBQVAsR0FBa0IsU0FBQTtXQUNoQixNQUFNLENBQUMsVUFBVSxDQUFDLElBQWxCLENBQXVCLEVBQXZCO0VBRGdCO1NBR2xCLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFNBQUMsS0FBRDtXQUNuQixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQWxCLENBQXlCLEtBQXpCLEVBQWdDLENBQWhDO0VBRG1CO0FBTlcsQ0FBbEMiLCJmaWxlIjoiY29udHJvbGxlcnMvcm91dGVzL2NyZWF0ZV9yb3V0ZV9jdHJsLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiYXBwLmNvbnRyb2xsZXIgJ2NyZWF0ZVJvdXRlQ3RybCcsICgkc2NvcGUpIC0+XG4gICRzY29wZS5wb2ludEZvcm1zID0gW11cblxuICAkc2NvcGUuYWRkUG9pbnQgPSAoKSAtPlxuICAgICRzY29wZS5wb2ludEZvcm1zLnB1c2goe30pXG5cbiAgJHNjb3BlLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgICRzY29wZS5wb2ludEZvcm1zLnNwbGljZShpbmRleCwgMSlcblxuXG5cbiJdfQ==

app.controller('editRouteCtrl', function($scope, $http) {
  $scope.pathArr = window.location.pathname.split('/', 3);
  $scope.id = $scope.pathArr[$scope.pathArr.length - 1];
  $scope.count = 1;
  $http({
    method: 'GET',
    url: '/routes/getpoints/' + $scope.id
  }).then((function(response) {
    $scope.pointForms = response.data;
  }));
  $scope.addPoint = function() {
    $scope.pointForms.push({
      id: $scope.count + '_new'
    });
    $scope.count++;
  };
  return $scope.removePoint = function(index) {
    return $scope.pointForms.splice(index, 1);
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3JvdXRlcy9lZGl0X3JvdXRlX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxVQUFKLENBQWUsZUFBZixFQUFnQyxTQUFDLE1BQUQsRUFBUyxLQUFUO0VBQzlCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQXpCLENBQStCLEdBQS9CLEVBQW1DLENBQW5DO0VBQ2pCLE1BQU0sQ0FBQyxFQUFQLEdBQVksTUFBTSxDQUFDLE9BQVEsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWYsR0FBd0IsQ0FBeEI7RUFDM0IsTUFBTSxDQUFDLEtBQVAsR0FBZTtFQUVmLEtBQUEsQ0FDRTtJQUFBLE1BQUEsRUFBUSxLQUFSO0lBQ0EsR0FBQSxFQUFLLG9CQUFBLEdBQXVCLE1BQU0sQ0FBQyxFQURuQztHQURGLENBRXdDLENBQUMsSUFGekMsQ0FFOEMsQ0FBQyxTQUFDLFFBQUQ7SUFDM0MsTUFBTSxDQUFDLFVBQVAsR0FBb0IsUUFBUSxDQUFDO0VBRGMsQ0FBRCxDQUY5QztFQU9BLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFNBQUE7SUFDaEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFsQixDQUF1QjtNQUNyQixFQUFBLEVBQUksTUFBTSxDQUFDLEtBQVAsR0FBZSxNQURFO0tBQXZCO0lBR0EsTUFBTSxDQUFDLEtBQVA7RUFKZ0I7U0FPbEIsTUFBTSxDQUFDLFdBQVAsR0FBcUIsU0FBQyxLQUFEO1dBQ25CLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBbEIsQ0FBeUIsS0FBekIsRUFBZ0MsQ0FBaEM7RUFEbUI7QUFuQlMsQ0FBaEMiLCJmaWxlIjoiY29udHJvbGxlcnMvcm91dGVzL2VkaXRfcm91dGVfY3RybC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImFwcC5jb250cm9sbGVyICdlZGl0Um91dGVDdHJsJywgKCRzY29wZSwgJGh0dHApIC0+XG4gICRzY29wZS5wYXRoQXJyID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJywzKVxuICAkc2NvcGUuaWQgPSAkc2NvcGUucGF0aEFyclskc2NvcGUucGF0aEFyci5sZW5ndGggLSAxXVxuICAkc2NvcGUuY291bnQgPSAxO1xuXG4gICRodHRwKFxuICAgIG1ldGhvZDogJ0dFVCdcbiAgICB1cmw6ICcvcm91dGVzL2dldHBvaW50cy8nICsgJHNjb3BlLmlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAkc2NvcGUucG9pbnRGb3JtcyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHJldHVyblxuICApXG5cbiAgJHNjb3BlLmFkZFBvaW50ID0gKCkgLT5cbiAgICAkc2NvcGUucG9pbnRGb3Jtcy5wdXNoKHtcbiAgICAgIGlkOiAkc2NvcGUuY291bnQgKyAnX25ldydcbiAgICB9KVxuICAgICRzY29wZS5jb3VudCsrXG4gICAgcmV0dXJuXG5cbiAgJHNjb3BlLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgICRzY29wZS5wb2ludEZvcm1zLnNwbGljZShpbmRleCwgMSlcblxuXG4iXX0=

app.controller('indexRouteCtrl', function($scope, $http) {
  return $scope.deleteRoute = function(id) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      $http({
        method: 'DELETE',
        url: '/routes/' + id
      }).then((function(response) {
        window.location.reload();
      }));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3JvdXRlcy9pbmRleF9yb3V0ZV9jdHJsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxHQUFHLENBQUMsVUFBSixDQUFlLGdCQUFmLEVBQWlDLFNBQUMsTUFBRCxFQUFTLEtBQVQ7U0FDL0IsTUFBTSxDQUFDLFdBQVAsR0FBcUIsU0FBQyxFQUFEO0FBQ2pCLFFBQUE7SUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVI7SUFFZixJQUFHLFlBQUg7TUFDSSxLQUFBLENBQ0k7UUFBQSxNQUFBLEVBQVEsUUFBUjtRQUNBLEdBQUEsRUFBSyxVQUFBLEdBQWEsRUFEbEI7T0FESixDQUV5QixDQUFDLElBRjFCLENBRStCLENBQUMsU0FBQyxRQUFEO1FBQzFCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBaEIsQ0FBQTtNQUQwQixDQUFELENBRi9CLEVBREo7O0VBSGlCO0FBRFUsQ0FBakMiLCJmaWxlIjoiY29udHJvbGxlcnMvcm91dGVzL2luZGV4X3JvdXRlX2N0cmwuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuY29udHJvbGxlciAnaW5kZXhSb3V0ZUN0cmwnLCAoJHNjb3BlLCAkaHR0cCkgLT5cbiAgJHNjb3BlLmRlbGV0ZVJvdXRlID0gKGlkKSAtPlxuICAgICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgICAgICRodHRwKFxuICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgICAgICAgICAgIHVybDogJy9yb3V0ZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgKVxuXG4gICAgICByZXR1cm5cblxuXG4iXX0=

app.controller('showRouteCtrl', function($scope, $http) {
  var init;
  $scope.pointForms = [];
  $scope.pathArr = window.location.pathname.split('/', 3);
  $scope.id = $scope.pathArr[$scope.pathArr.length - 1];
  $http({
    method: 'GET',
    url: '/routes/getpoints/' + $scope.id
  }).then((function(response) {
    $scope.pointForms = response.data;
  }));
  $scope.deleteRoute = function(id) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      return $http({
        method: 'DELETE',
        url: '/routes/' + id
      }).then((function(response) {
        document.location.href = '/routes/';
      }));
    }
  };
  init = function() {
    var map, mapElement, mapOptions, marker;
    mapOptions = {
      zoom: 12,
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      center: new google.maps.LatLng(40.6700, -73.9400),
      styles: [
        {
          'featureType': 'water',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#e9e9e9'
            }, {
              'lightness': 17
            }
          ]
        }, {
          'featureType': 'landscape',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#f5f5f5'
            }, {
              'lightness': 20
            }
          ]
        }, {
          'featureType': 'road.highway',
          'elementType': 'geometry.fill',
          'stylers': [
            {
              'color': '#ffffff'
            }, {
              'lightness': 17
            }
          ]
        }, {
          'featureType': 'road.highway',
          'elementType': 'geometry.stroke',
          'stylers': [
            {
              'color': '#ffffff'
            }, {
              'lightness': 29
            }, {
              'weight': 0.2
            }
          ]
        }, {
          'featureType': 'road.arterial',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#ffffff'
            }, {
              'lightness': 18
            }
          ]
        }, {
          'featureType': 'road.local',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#ffffff'
            }, {
              'lightness': 16
            }
          ]
        }, {
          'featureType': 'poi',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#f5f5f5'
            }, {
              'lightness': 21
            }
          ]
        }, {
          'featureType': 'poi.park',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#dedede'
            }, {
              'lightness': 21
            }
          ]
        }, {
          'elementType': 'labels.text.stroke',
          'stylers': [
            {
              'visibility': 'on'
            }, {
              'color': '#ffffff'
            }, {
              'lightness': 16
            }
          ]
        }, {
          'elementType': 'labels.text.fill',
          'stylers': [
            {
              'saturation': 36
            }, {
              'color': '#333333'
            }, {
              'lightness': 40
            }
          ]
        }, {
          'elementType': 'labels.icon',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        }, {
          'featureType': 'transit',
          'elementType': 'geometry',
          'stylers': [
            {
              'color': '#f2f2f2'
            }, {
              'lightness': 19
            }
          ]
        }, {
          'featureType': 'administrative',
          'elementType': 'geometry.fill',
          'stylers': [
            {
              'color': '#fefefe'
            }, {
              'lightness': 20
            }
          ]
        }, {
          'featureType': 'administrative',
          'elementType': 'geometry.stroke',
          'stylers': [
            {
              'color': '#fefefe'
            }, {
              'lightness': 17
            }, {
              'weight': 1.2
            }
          ]
        }
      ]
    };
    mapElement = document.getElementById('route-map');
    map = new google.maps.Map(mapElement, mapOptions);
    marker = new google.maps.Marker({
      icon: 'images/baloon.png',
      position: new google.maps.LatLng(40.6700, -73.9400),
      map: map,
      title: 'Snazzy!'
    });
  };
  return google.maps.event.addDomListener(window, 'load', init);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3JvdXRlcy9zaG93X3JvdXRlX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxVQUFKLENBQWUsZUFBZixFQUFnQyxTQUFDLE1BQUQsRUFBUyxLQUFUO0FBQzlCLE1BQUE7RUFBQSxNQUFNLENBQUMsVUFBUCxHQUFvQjtFQUNwQixNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUF6QixDQUErQixHQUEvQixFQUFtQyxDQUFuQztFQUNqQixNQUFNLENBQUMsRUFBUCxHQUFZLE1BQU0sQ0FBQyxPQUFRLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFmLEdBQXdCLENBQXhCO0VBRTNCLEtBQUEsQ0FDRTtJQUFBLE1BQUEsRUFBUSxLQUFSO0lBQ0EsR0FBQSxFQUFLLG9CQUFBLEdBQXVCLE1BQU0sQ0FBQyxFQURuQztHQURGLENBRXdDLENBQUMsSUFGekMsQ0FFOEMsQ0FBQyxTQUFDLFFBQUQ7SUFDM0MsTUFBTSxDQUFDLFVBQVAsR0FBb0IsUUFBUSxDQUFDO0VBRGMsQ0FBRCxDQUY5QztFQU9BLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFNBQUMsRUFBRDtBQUNuQixRQUFBO0lBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSO0lBRWYsSUFBRyxZQUFIO2FBQ0UsS0FBQSxDQUNFO1FBQUEsTUFBQSxFQUFRLFFBQVI7UUFDQSxHQUFBLEVBQUssVUFBQSxHQUFhLEVBRGxCO09BREYsQ0FFdUIsQ0FBQyxJQUZ4QixDQUU2QixDQUFDLFNBQUMsUUFBRDtRQUMxQixRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCO01BREMsQ0FBRCxDQUY3QixFQURGOztFQUhtQjtFQWNyQixJQUFBLEdBQU8sU0FBQTtBQUVMLFFBQUE7SUFBQSxVQUFBLEdBQ0U7TUFBQSxJQUFBLEVBQU0sRUFBTjtNQUNBLFdBQUEsRUFBYSxLQURiO01BRUEsY0FBQSxFQUFnQixL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Rk0sRUE4Rk47VUFDRSxhQUFBLEVBQWUsZ0JBRGpCO1VBRUUsYUFBQSxFQUFlLGVBRmpCO1VBR0UsU0FBQSxFQUFXO1lBQ1Q7Y0FBRSxPQUFBLEVBQVMsU0FBWDthQURTLEVBRVQ7Y0FBRSxXQUFBLEVBQWEsRUFBZjthQUZTO1dBSGI7U0E5Rk0sRUFzR047VUFDRSxhQUFBLEVBQWUsZ0JBRGpCO1VBRUUsYUFBQSxFQUFlLGlCQUZqQjtVQUdFLFNBQUEsRUFBVztZQUNUO2NBQUUsT0FBQSxFQUFTLFNBQVg7YUFEUyxFQUVUO2NBQUUsV0FBQSxFQUFhLEVBQWY7YUFGUyxFQUdUO2NBQUUsUUFBQSxFQUFVLEdBQVo7YUFIUztXQUhiO1NBdEdNO09BTlI7O0lBdUhGLFVBQUEsR0FBYSxRQUFRLENBQUMsY0FBVCxDQUF3QixXQUF4QjtJQUNiLEdBQUEsR0FBVSxJQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBYixDQUFrQixVQUFsQixFQUE4QixVQUE5QjtJQUVWLE1BQUEsR0FBYSxJQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBYixDQUNYO01BQUEsSUFBQSxFQUFNLG1CQUFOO01BQ0EsUUFBQSxFQUFjLElBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFiLENBQXFCLE9BQXJCLEVBQThCLENBQUMsT0FBL0IsQ0FEZDtNQUVBLEdBQUEsRUFBSyxHQUZMO01BR0EsS0FBQSxFQUFPLFNBSFA7S0FEVztFQTdIUjtTQXFJUCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFsQixDQUFpQyxNQUFqQyxFQUF5QyxNQUF6QyxFQUFpRCxJQUFqRDtBQS9KOEIsQ0FBaEMiLCJmaWxlIjoiY29udHJvbGxlcnMvcm91dGVzL3Nob3dfcm91dGVfY3RybC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImFwcC5jb250cm9sbGVyICdzaG93Um91dGVDdHJsJywgKCRzY29wZSwgJGh0dHApIC0+XG4gICRzY29wZS5wb2ludEZvcm1zID0gW11cbiAgJHNjb3BlLnBhdGhBcnIgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nLDMpXG4gICRzY29wZS5pZCA9ICRzY29wZS5wYXRoQXJyWyRzY29wZS5wYXRoQXJyLmxlbmd0aCAtIDFdXG5cbiAgJGh0dHAoXG4gICAgbWV0aG9kOiAnR0VUJ1xuICAgIHVybDogJy9yb3V0ZXMvZ2V0cG9pbnRzLycgKyAkc2NvcGUuaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICRzY29wZS5wb2ludEZvcm1zID0gcmVzcG9uc2UuZGF0YVxuICAgICAgcmV0dXJuXG4gIClcblxuICAkc2NvcGUuZGVsZXRlUm91dGUgPSAoaWQpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwKFxuICAgICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgICAgIHVybDogJy9yb3V0ZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9ICcvcm91dGVzLydcbiAgICAgICAgICByZXR1cm5cbiAgICAgIClcblxuXG5cbiAgIyBXaGVuIHRoZSB3aW5kb3cgaGFzIGZpbmlzaGVkIGxvYWRpbmcgY3JlYXRlIG91ciBnb29nbGUgbWFwIGJlbG93XG4gIGluaXQgPSAtPlxuICAgICMgQmFzaWMgb3B0aW9ucyBmb3IgYSBzaW1wbGUgR29vZ2xlIE1hcFxuICAgIG1hcE9wdGlvbnMgPVxuICAgICAgem9vbTogMTJcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZVxuICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlXG4gICAgICB6b29tQ29udHJvbE9wdGlvbnM6IHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9CT1RUT01cbiAgICAgIGNlbnRlcjogbmV3IChnb29nbGUubWFwcy5MYXRMbmcpKDQwLjY3MDAsIC03My45NDAwKVxuICAgICAgc3R5bGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnZmVhdHVyZVR5cGUnOiAnd2F0ZXInXG4gICAgICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICAgICAgeyAnY29sb3InOiAnI2U5ZTllOScgfVxuICAgICAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2xhbmRzY2FwZSdcbiAgICAgICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9XG4gICAgICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheSdcbiAgICAgICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICAgICAgeyAnd2VpZ2h0JzogMC4yIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmFydGVyaWFsJ1xuICAgICAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJ1xuICAgICAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaS5wYXJrJ1xuICAgICAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgICAgIHsgJ2NvbG9yJzogJyNkZWRlZGUnIH1cbiAgICAgICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnXG4gICAgICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgICAgIHsgJ3NhdHVyYXRpb24nOiAzNiB9XG4gICAgICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLmljb24nXG4gICAgICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnXG4gICAgICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuXG4gICAgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3V0ZS1tYXAnKVxuICAgIG1hcCA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFwKShtYXBFbGVtZW50LCBtYXBPcHRpb25zKVxuXG4gICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgaWNvbjogJ2ltYWdlcy9iYWxvb24ucG5nJ1xuICAgICAgcG9zaXRpb246IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg0MC42NzAwLCAtNzMuOTQwMClcbiAgICAgIG1hcDogbWFwXG4gICAgICB0aXRsZTogJ1NuYXp6eSEnKVxuICAgIHJldHVyblxuXG4gICAgIyBJbml0IG1hcFxuICBnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lciB3aW5kb3csICdsb2FkJywgaW5pdFxuXG4iXX0=

app.controller('createUserCtrl', [
  "$scope", "lodash", function($scope, lodash) {
    $scope.passInput = document.querySelector('.password-input');
    $scope.chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+ <>ABCDEFGHIJKLMNOP1234567890';
    return $scope.generatePass = function() {
      var i, passLength, x;
      $scope.pass = '';
      passLength = lodash.random(6, 15);
      x = 0;
      while (x < passLength) {
        i = Math.floor(Math.random() * $scope.chars.length);
        $scope.pass += $scope.chars.charAt(i);
        x++;
      }
      return $scope.pass;
    };
  }
]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3VzZXJzL2NyZWF0ZV91c2VyX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxVQUFKLENBQWUsZ0JBQWYsRUFBaUM7RUFBQyxRQUFELEVBQVcsUUFBWCxFQUFxQixTQUFDLE1BQUQsRUFBUyxNQUFUO0lBQ3BELE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFFBQVEsQ0FBQyxhQUFULENBQXVCLGlCQUF2QjtJQUNuQixNQUFNLENBQUMsS0FBUCxHQUFlO1dBR2YsTUFBTSxDQUFDLFlBQVAsR0FBc0IsU0FBQTtBQUNwQixVQUFBO01BQUEsTUFBTSxDQUFDLElBQVAsR0FBYztNQUNkLFVBQUEsR0FBYSxNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsRUFBZ0IsRUFBaEI7TUFDYixDQUFBLEdBQUk7QUFFSixhQUFNLENBQUEsR0FBSSxVQUFWO1FBQ0UsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBeEM7UUFDSixNQUFNLENBQUMsSUFBUCxJQUFlLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBYixDQUFvQixDQUFwQjtRQUNmLENBQUE7TUFIRjtBQUtBLGFBQU8sTUFBTSxDQUFDO0lBVk07RUFMOEIsQ0FBckI7Q0FBakMiLCJmaWxlIjoiY29udHJvbGxlcnMvdXNlcnMvY3JlYXRlX3VzZXJfY3RybC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImFwcC5jb250cm9sbGVyICdjcmVhdGVVc2VyQ3RybCcsIFtcIiRzY29wZVwiLCBcImxvZGFzaFwiLCAoJHNjb3BlLCBsb2Rhc2gpIC0+XG4gICRzY29wZS5wYXNzSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtaW5wdXQnKVxuICAkc2NvcGUuY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXohQCMkJV4mKigpLStcbiAgICAgICAgICAgICAgICAgIDw+QUJDREVGR0hJSktMTU5PUDEyMzQ1Njc4OTAnXG5cbiAgJHNjb3BlLmdlbmVyYXRlUGFzcyA9ICgpIC0+XG4gICAgJHNjb3BlLnBhc3MgPSAnJ1xuICAgIHBhc3NMZW5ndGggPSBsb2Rhc2gucmFuZG9tKDYsMTUpXG4gICAgeCA9IDBcblxuICAgIHdoaWxlIHggPCBwYXNzTGVuZ3RoXG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogJHNjb3BlLmNoYXJzLmxlbmd0aClcbiAgICAgICRzY29wZS5wYXNzICs9ICRzY29wZS5jaGFycy5jaGFyQXQoaSlcbiAgICAgIHgrK1xuXG4gICAgcmV0dXJuICRzY29wZS5wYXNzXG5dIl19

app.controller('indexUserCtrl', function($scope, $http) {
  return $scope.deleteUser = function(id) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      $http({
        method: 'DELETE',
        url: '/users/' + id
      }).then((function(response) {
        window.location.reload();
      }));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3VzZXJzL2luZGV4X3VzZXJfY3RybC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBRyxDQUFDLFVBQUosQ0FBZSxlQUFmLEVBQWdDLFNBQUMsTUFBRCxFQUFTLEtBQVQ7U0FDNUIsTUFBTSxDQUFDLFVBQVAsR0FBb0IsU0FBQyxFQUFEO0FBQ2hCLFFBQUE7SUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVI7SUFFZixJQUFHLFlBQUg7TUFDSSxLQUFBLENBQ0k7UUFBQSxNQUFBLEVBQVEsUUFBUjtRQUNBLEdBQUEsRUFBSyxTQUFBLEdBQVksRUFEakI7T0FESixDQUV3QixDQUFDLElBRnpCLENBRThCLENBQUMsU0FBQyxRQUFEO1FBQ3ZCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBaEIsQ0FBQTtNQUR1QixDQUFELENBRjlCLEVBREo7O0VBSGdCO0FBRFEsQ0FBaEMiLCJmaWxlIjoiY29udHJvbGxlcnMvdXNlcnMvaW5kZXhfdXNlcl9jdHJsLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiYXBwLmNvbnRyb2xsZXIgJ2luZGV4VXNlckN0cmwnLCAoJHNjb3BlLCAkaHR0cCkgLT5cbiAgICAkc2NvcGUuZGVsZXRlVXNlciA9IChpZCkgLT5cbiAgICAgICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICAgICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAgICAgICAkaHR0cChcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgICAgICAgICAgICAgdXJsOiAnL3VzZXJzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgcmV0dXJuXG5cbiJdfQ==

app.controller('createStoreCtrl', function($scope, $http) {
  return $scope.getLocation = function(address) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        language: 'en',
        components: 'country:UK|administrative_area:London'
      }
    }).then(function(response) {
      return response.data.results.map(function(item) {
        return item.formatted_address;
      });
    });
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3N0b3Jlcy9jcmVhdGVfc3RvcmVfY3RybC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBRyxDQUFDLFVBQUosQ0FBZSxpQkFBZixFQUFrQyxTQUFDLE1BQUQsRUFBUyxLQUFUO1NBQzlCLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFNBQUMsT0FBRDtXQUNuQixLQUFLLENBQUMsR0FBTixDQUFVLDZDQUFWLEVBQXlEO01BQUEsTUFBQSxFQUN2RDtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsUUFBQSxFQUFVLElBRFY7UUFFQSxVQUFBLEVBQVksdUNBRlo7T0FEdUQ7S0FBekQsQ0FJRCxDQUFDLElBSkEsQ0FJSyxTQUFDLFFBQUQ7YUFDSCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUF0QixDQUEwQixTQUFDLElBQUQ7ZUFDeEIsSUFBSSxDQUFDO01BRG1CLENBQTFCO0lBREcsQ0FKTDtFQURtQjtBQURTLENBQWxDIiwiZmlsZSI6ImNvbnRyb2xsZXJzL3N0b3Jlcy9jcmVhdGVfc3RvcmVfY3RybC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImFwcC5jb250cm9sbGVyICdjcmVhdGVTdG9yZUN0cmwnLCAoJHNjb3BlLCAkaHR0cCkgLT5cbiAgICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAgICRodHRwLmdldCgnLy9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbicsIHBhcmFtczpcbiAgICAgICAgYWRkcmVzczogYWRkcmVzc1xuICAgICAgICBsYW5ndWFnZTogJ2VuJ1xuICAgICAgICBjb21wb25lbnRzOiAnY291bnRyeTpVS3xhZG1pbmlzdHJhdGl2ZV9hcmVhOkxvbmRvbidcbiAgICApLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICAgIGl0ZW0uZm9ybWF0dGVkX2FkZHJlc3NcblxuIl19

app.controller('editStoreCtrl', function($scope, $http) {
  $scope.pathArr = window.location.pathname.split('/', 3);
  $scope.id = $scope.pathArr[$scope.pathArr.length - 1];
  $http({
    method: 'GET',
    url: '/stores/getstoreaddress/' + $scope.id
  }).then((function(response) {
    $scope.asyncSelected = response.data;
  }));
  return $scope.getLocation = function(address) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        language: 'en',
        components: 'country:UK|administrative_area:London'
      }
    }).then(function(response) {
      return response.data.results.map(function(item) {
        return item.formatted_address;
      });
    });
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3N0b3Jlcy9lZGl0X3N0b3JlX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxVQUFKLENBQWUsZUFBZixFQUFnQyxTQUFDLE1BQUQsRUFBUyxLQUFUO0VBQzVCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQXpCLENBQStCLEdBQS9CLEVBQW1DLENBQW5DO0VBQ2pCLE1BQU0sQ0FBQyxFQUFQLEdBQVksTUFBTSxDQUFDLE9BQVEsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWYsR0FBd0IsQ0FBeEI7RUFHM0IsS0FBQSxDQUNFO0lBQUEsTUFBQSxFQUFRLEtBQVI7SUFDQSxHQUFBLEVBQUssMEJBQUEsR0FBNkIsTUFBTSxDQUFDLEVBRHpDO0dBREYsQ0FFOEMsQ0FBQyxJQUYvQyxDQUVvRCxDQUFDLFNBQUMsUUFBRDtJQUNqRCxNQUFNLENBQUMsYUFBUCxHQUF1QixRQUFRLENBQUM7RUFEaUIsQ0FBRCxDQUZwRDtTQVFBLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFNBQUMsT0FBRDtXQUNuQixLQUFLLENBQUMsR0FBTixDQUFVLDZDQUFWLEVBQXlEO01BQUEsTUFBQSxFQUN2RDtRQUFBLE9BQUEsRUFBUyxPQUFUO1FBQ0EsUUFBQSxFQUFVLElBRFY7UUFFQSxVQUFBLEVBQVksdUNBRlo7T0FEdUQ7S0FBekQsQ0FJRCxDQUFDLElBSkEsQ0FJSyxTQUFDLFFBQUQ7YUFDSCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUF0QixDQUEwQixTQUFDLElBQUQ7ZUFDeEIsSUFBSSxDQUFDO01BRG1CLENBQTFCO0lBREcsQ0FKTDtFQURtQjtBQWJPLENBQWhDIiwiZmlsZSI6ImNvbnRyb2xsZXJzL3N0b3Jlcy9lZGl0X3N0b3JlX2N0cmwuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuY29udHJvbGxlciAnZWRpdFN0b3JlQ3RybCcsICgkc2NvcGUsICRodHRwKSAtPlxuICAgICRzY29wZS5wYXRoQXJyID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJywzKVxuICAgICRzY29wZS5pZCA9ICRzY29wZS5wYXRoQXJyWyRzY29wZS5wYXRoQXJyLmxlbmd0aCAtIDFdXG5cbiAgICAjIEdldCBhZGRyZXMgZm9yIHR5cGVoZWFkIGRpcmVjdGl2ZVxuICAgICRodHRwKFxuICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgICAgdXJsOiAnL3N0b3Jlcy9nZXRzdG9yZWFkZHJlc3MvJyArICRzY29wZS5pZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc2NvcGUuYXN5bmNTZWxlY3RlZCA9IHJlc3BvbnNlLmRhdGFcblxuICAgICAgICByZXR1cm5cbiAgICApXG5cbiAgICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAgICRodHRwLmdldCgnLy9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbicsIHBhcmFtczpcbiAgICAgICAgYWRkcmVzczogYWRkcmVzc1xuICAgICAgICBsYW5ndWFnZTogJ2VuJ1xuICAgICAgICBjb21wb25lbnRzOiAnY291bnRyeTpVS3xhZG1pbmlzdHJhdGl2ZV9hcmVhOkxvbmRvbidcbiAgICApLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICAgIGl0ZW0uZm9ybWF0dGVkX2FkZHJlc3NcblxuIl19

app.controller('indexStoreCtrl', function($scope, $http) {
  return $scope.deleteStore = function(id) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      $http({
        method: 'DELETE',
        url: '/stores/' + id
      }).then((function(response) {
        window.location.reload();
      }));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3N0b3Jlcy9pbmRleF9zdG9yZV9jdHJsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxHQUFHLENBQUMsVUFBSixDQUFlLGdCQUFmLEVBQWlDLFNBQUMsTUFBRCxFQUFTLEtBQVQ7U0FDN0IsTUFBTSxDQUFDLFdBQVAsR0FBcUIsU0FBQyxFQUFEO0FBQ2pCLFFBQUE7SUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVI7SUFFZixJQUFHLFlBQUg7TUFDSSxLQUFBLENBQ0k7UUFBQSxNQUFBLEVBQVEsUUFBUjtRQUNBLEdBQUEsRUFBSyxVQUFBLEdBQWEsRUFEbEI7T0FESixDQUV5QixDQUFDLElBRjFCLENBRStCLENBQUMsU0FBQyxRQUFEO1FBQ3hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBaEIsQ0FBQTtNQUR3QixDQUFELENBRi9CLEVBREo7O0VBSGlCO0FBRFEsQ0FBakMiLCJmaWxlIjoiY29udHJvbGxlcnMvc3RvcmVzL2luZGV4X3N0b3JlX2N0cmwuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuY29udHJvbGxlciAnaW5kZXhTdG9yZUN0cmwnLCAoJHNjb3BlLCAkaHR0cCkgLT5cbiAgICAkc2NvcGUuZGVsZXRlU3RvcmUgPSAoaWQpIC0+XG4gICAgICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgICAgICAgJGh0dHAoXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgICAgICAgICAgICAgIHVybDogJy9zdG9yZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICByZXR1cm5cblxuIl19

app.controller('showStoreCtrl', function($scope, $http) {
  return $scope.deleteStore = function(id) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      $http({
        method: 'DELETE',
        url: '/stores/' + id
      }).then((function(response) {
        document.location.href = '/stores/';
      }));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3N0b3Jlcy9zaG93X3N0b3JlX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxVQUFKLENBQWUsZUFBZixFQUFnQyxTQUFDLE1BQUQsRUFBUyxLQUFUO1NBQzVCLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFNBQUMsRUFBRDtBQUNqQixRQUFBO0lBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSO0lBRWYsSUFBRyxZQUFIO01BQ0ksS0FBQSxDQUNJO1FBQUEsTUFBQSxFQUFRLFFBQVI7UUFDQSxHQUFBLEVBQUssVUFBQSxHQUFhLEVBRGxCO09BREosQ0FFeUIsQ0FBQyxJQUYxQixDQUUrQixDQUFDLFNBQUMsUUFBRDtRQUN4QixRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCO01BREQsQ0FBRCxDQUYvQixFQURKOztFQUhpQjtBQURPLENBQWhDIiwiZmlsZSI6ImNvbnRyb2xsZXJzL3N0b3Jlcy9zaG93X3N0b3JlX2N0cmwuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuY29udHJvbGxlciAnc2hvd1N0b3JlQ3RybCcsICgkc2NvcGUsICRodHRwKSAtPlxuICAgICRzY29wZS5kZWxldGVTdG9yZSA9IChpZCkgLT5cbiAgICAgICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICAgICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAgICAgICAkaHR0cChcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnXG4gICAgICAgICAgICAgICAgdXJsOiAnL3N0b3Jlcy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9ICcvc3RvcmVzLydcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgcmV0dXJuXG5cbiJdfQ==
