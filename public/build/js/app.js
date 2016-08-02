var app, dependencies;

dependencies = ["ui.bootstrap", "ngLodash", "ngMask"];

app = angular.module('app', dependencies);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxZQUFBLEdBQWUsQ0FDWCxjQURXLEVBRVgsVUFGVyxFQUdYLFFBSFc7O0FBTWYsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsS0FBZixFQUFzQixZQUF0QiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJkZXBlbmRlbmNpZXMgPSBbXG4gICAgXCJ1aS5ib290c3RyYXBcIixcbiAgICBcIm5nTG9kYXNoXCIsXG4gICAgXCJuZ01hc2tcIixcbl1cblxuYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIGRlcGVuZGVuY2llcykiXX0=

app.directive('checkboxField', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/checkbox_field.html',
    scope: {
      label: '=label',
      attrName: '=attrName',
      attrValue: "=?attrValue"
    },
    link: function(scope, element, attrs) {}
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvY2hlY2tib3hfZmllbGQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxTQUFKLENBQWMsZUFBZCxFQUErQixTQUFBO1NBQzdCO0lBQUEsUUFBQSxFQUFVLElBQVY7SUFDQSxXQUFBLEVBQWEsdUNBRGI7SUFFQSxLQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sUUFBUDtNQUNBLFFBQUEsRUFBVSxXQURWO01BRUEsU0FBQSxFQUFXLGFBRlg7S0FIRjtJQU9BLElBQUEsRUFBTSxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLEdBQUEsQ0FQTjs7QUFENkIsQ0FBL0IiLCJmaWxlIjoiZGlyZWN0aXZlcy9jaGVja2JveF9maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImFwcC5kaXJlY3RpdmUgJ2NoZWNrYm94RmllbGQnLCAoKSAtPlxuICByZXN0cmljdDogJ0FFJ1xuICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmh0bWwnXG4gIHNjb3BlOlxuICAgIGxhYmVsOiAnPWxhYmVsJ1xuICAgIGF0dHJOYW1lOiAnPWF0dHJOYW1lJ1xuICAgIGF0dHJWYWx1ZTogXCI9P2F0dHJWYWx1ZVwiXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiJdfQ==

app.directive('datetimepicker', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/datetimepicker.html',
    scope: {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEdBQUcsQ0FBQyxTQUFKLENBQWMsZ0JBQWQsRUFBZ0MsU0FBQTtTQUM5QjtJQUFBLFFBQUEsRUFBVSxJQUFWO0lBQ0EsV0FBQSxFQUFhLHVDQURiO0lBRUEsS0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFNBQVA7TUFDQSxRQUFBLEVBQVUsV0FEVjtNQUVBLFNBQUEsRUFBVyxhQUZYO0tBSEY7SUFPQSxJQUFBLEVBQU0sU0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQjthQUNKLEtBQUssQ0FBQyxJQUFOLEdBQWEsU0FBQTtlQUNYLEtBQUssQ0FBQyxXQUFOLEdBQW9CO01BRFQ7SUFEVCxDQVBOOztBQUQ4QixDQUFoQyIsImZpbGUiOiJkaXJlY3RpdmVzL2RhdGV0aW1lcGlja2VyLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiYXBwLmRpcmVjdGl2ZSAnZGF0ZXRpbWVwaWNrZXInLCAoKSAtPlxuICByZXN0cmljdDogJ0FFJ1xuICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2RhdGV0aW1lcGlja2VyLmh0bWwnXG4gIHNjb3BlOlxuICAgIGxhYmVsOiBcIj0/bGFiZWxcIlxuICAgIGF0dHJOYW1lOiBcIj1hdHRyTmFtZVwiXG4gICAgYXR0clZhbHVlOiBcIj0/YXR0clZhbHVlXCJcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSAtPlxuICAgIHNjb3BlLm9wZW4gPSAoKSAtPlxuICAgICAgc2NvcGUuZGF0ZV9vcGVuZWQgPSB0cnVlXG5cblxuXG5cbiJdfQ==

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
    scope: {
      label: "=?label",
      attrName: "=?attrName",
      model: "=ngModel"
    },
    link: function(scope, element, attrs) {
      scope.hstep = 1;
      scope.mstep = 5;
      return scope.ismeridian = true;
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvdGltZXBpY2tlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBRyxDQUFDLFNBQUosQ0FBYyxZQUFkLEVBQTRCLFNBQUE7U0FDMUI7SUFBQSxRQUFBLEVBQVUsSUFBVjtJQUNBLFdBQUEsRUFBYSxtQ0FEYjtJQUVBLEtBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxTQUFQO01BQ0EsUUFBQSxFQUFVLFlBRFY7TUFFQSxLQUFBLEVBQU8sVUFGUDtLQUhGO0lBT0EsSUFBQSxFQUFNLFNBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakI7TUFDSixLQUFLLENBQUMsS0FBTixHQUFjO01BQ2QsS0FBSyxDQUFDLEtBQU4sR0FBYzthQUNkLEtBQUssQ0FBQyxVQUFOLEdBQW1CO0lBSGYsQ0FQTjs7QUFEMEIsQ0FBNUIiLCJmaWxlIjoiZGlyZWN0aXZlcy90aW1lcGlja2VyLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiYXBwLmRpcmVjdGl2ZSAndGltZXBpY2tlcicsICgpIC0+XG4gIHJlc3RyaWN0OiAnQUUnXG4gIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvdGltZXBpY2tlci5odG1sJ1xuICBzY29wZTpcbiAgICBsYWJlbDogXCI9P2xhYmVsXCJcbiAgICBhdHRyTmFtZTogXCI9P2F0dHJOYW1lXCJcbiAgICBtb2RlbDogXCI9bmdNb2RlbFwiXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICBzY29wZS5oc3RlcCA9IDFcbiAgICBzY29wZS5tc3RlcCA9IDVcbiAgICBzY29wZS5pc21lcmlkaWFuID0gdHJ1ZVxuXG5cblxuIl19

app.controller('createRouteCtrl', function($scope) {});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xsZXJzL3JvdXRlcy9jcmVhdGVfcm91dGVfY3RybC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsR0FBRyxDQUFDLFVBQUosQ0FBZSxpQkFBZixFQUFrQyxTQUFDLE1BQUQsR0FBQSxDQUFsQyIsImZpbGUiOiJjb250cm9sbGVycy9yb3V0ZXMvY3JlYXRlX3JvdXRlX2N0cmwuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuY29udHJvbGxlciAnY3JlYXRlUm91dGVDdHJsJywgKCRzY29wZSkgLT5cblxuXG5cbiJdfQ==

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
