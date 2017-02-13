'use strict';
angular.module('app', ['app.pusherNotifications', 'ui.router', 'satellizer', 'ui.bootstrap', 'ngLodash', 'ngMask', 'angularMoment', 'easypiechart', 'ngFileUpload']).config(function($stateProvider, $urlRouterProvider, $authProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $authProvider.loginUrl = '/api/authenticate';
  $authProvider.signupUrl = '/api/authenticate/register';
  $urlRouterProvider.otherwise('/user/sign_in');
  $stateProvider.state('/', {
    url: '/',
    templateUrl: '../views/pages/home.html',
    controller: 'IndexHomeCtrl as home'
  }).state('sign_in', {
    url: '/user/sign_in',
    templateUrl: '../views/user/sign_in.html',
    controller: 'SignInController as auth'
  }).state('sign_up', {
    url: '/user/sign_up',
    templateUrl: '../views/user/sign_up.html',
    controller: 'SignUpController as register'
  }).state('sign_up_success', {
    url: '/user/sign_up_success',
    templateUrl: '../views/user/sign_up_success.html'
  }).state('forgot_password', {
    url: '/user/forgot_password',
    templateUrl: '../views/user/forgot_password.html',
    controller: 'ForgotPasswordController as forgotPassword'
  }).state('reset_password', {
    url: '/user/reset_password/:reset_password_code',
    templateUrl: '../views/user/reset_password.html',
    controller: 'ResetPasswordController as resetPassword'
  }).state('confirm', {
    url: '/user/confirm/:confirmation_code',
    controller: 'ConfirmController'
  }).state('profile', {
    url: '/profile',
    templateUrl: '../views/profile/index.html',
    controller: 'IndexProfileCtrl as profile'
  }).state('profile_edit', {
    url: '/profile/edit',
    templateUrl: '../views/profile/edit.html',
    controller: 'EditProfileCtrl as profile'
  }).state('stores', {
    url: '/stores',
    templateUrl: '../views/stores/index.html',
    controller: 'IndexStoreCtrl as stores',
    params: {
      flashSuccess: null
    }
  }).state('stores_create', {
    url: '/stores/create',
    templateUrl: '../views/stores/create.html',
    controller: 'CreateStoreCtrl as store'
  }).state('stores_edit', {
    url: '/stores/:id/edit',
    templateUrl: '../views/stores/edit.html',
    controller: 'EditStoreCtrl as store'
  }).state('stores_show', {
    url: '/stores/:id',
    templateUrl: '../views/stores/show.html',
    controller: 'ShowStoreCtrl as store'
  }).state('users', {
    url: '/users',
    templateUrl: '../views/users/index.html',
    controller: 'IndexUserCtrl as users',
    params: {
      flashSuccess: null
    }
  }).state('users_create', {
    url: '/users/create',
    templateUrl: '../views/users/create.html',
    controller: 'CreateUserCtrl as user'
  }).state('users_show', {
    url: '/users/:id',
    templateUrl: '../views/users/show.html',
    controller: 'ShowUserCtrl as user'
  }).state('routes', {
    url: '/routes',
    templateUrl: '../views/routes/index.html',
    controller: 'IndexRouteCtrl as routes',
    params: {
      flashSuccess: null
    }
  }).state('routes_create', {
    url: '/routes/create',
    templateUrl: '../views/routes/create.html',
    controller: 'CreateRouteCtrl as route'
  }).state('routes_edit', {
    url: '/routes/:id/edit',
    templateUrl: '../views/routes/edit.html',
    controller: 'EditRouteCtrl as route'
  }).state('routes_show', {
    url: '/routes/:id',
    templateUrl: '../views/routes/show.html',
    controller: 'ShowRouteCtrl as route'
  }).state('map', {
    url: '/map',
    templateUrl: '../views/map/index.html',
    controller: 'IndexMapCtrl as map'
  });
}).run(function($auth, $http, $location, $q, $rootScope, $state) {
  var publicRoutes;
  publicRoutes = ['sign_up', 'confirm', 'forgot_password', 'reset_password'];
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    var user;
    if (!$auth.isAuthenticated() && publicRoutes.indexOf(toState.name) === -1) {
      $location.path('user/sign_in');
      return false;
    }
    if ($auth.isAuthenticated() && (publicRoutes.indexOf(toState.name) === 0 || $rootScope.currentState === 'sign_in')) {
      $location.path('/');
    }
    user = JSON.parse(localStorage.getItem('user'));
    if (user && $auth.isAuthenticated()) {
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
      if ($rootScope.currentUser.avatar === 'default_avatar.jpg') {
        $rootScope.currentUser.avatar = '/images/' + $rootScope.currentUser.avatar;
      } else {
        $rootScope.currentUser.avatar = 'uploads/avatars/' + $rootScope.currentUser.avatar;
      }
    }
    return $rootScope.logout = function() {
      $auth.logout().then(function() {
        localStorage.removeItem('user');
        $rootScope.authenticated = false;
        $rootScope.currentUser = null;
        $state.go('sign_in');
      });
    };
  });
});

'use strict';
angular.module('app.pusherNotifications', ['notification']).run(function($notification, $rootScope) {
  var channel, newRouteMessage, pusher, redTruckIcon;
  newRouteMessage = 'YOU HAVE A NEW ROUTE.';
  redTruckIcon = 'images/balloon.png';
  pusher = new Pusher('6b58c1243df82028a788', {
    cluster: 'eu',
    encrypted: true
  });
  channel = pusher.subscribe('new-route-channel');
  channel.bind('App\\Events\\NewRoute', function(data) {
    if ($rootScope.currentUser.id === parseInt(data.userId)) {
      return $notification('New message!', {
        body: newRouteMessage,
        icon: redTruckIcon,
        vibrate: [200, 100, 200]
      });
    }
  });
});

var checkboxField;

checkboxField = function() {
  var directive;
  directive = {
    restrict: 'EA',
    templateUrl: '/views/directives/checkbox_field.html',
    scope: {
      label: '=label',
      attrClass: '=?attrClass',
      ngChecked: '=?ngChecked',
      model: '=model'
    },
    link: function(scope, element, attr) {
      if (scope.model === '1') {
        scope.model = true;
      } else if (scope.model === '0') {
        scope.model = false;
      }
    }
  };
  return directive;
};

'use strict';

angular.module('app').directive('checkboxField', checkboxField);

var datetimepicker;

datetimepicker = function($timeout) {
  var directive;
  directive = {
    restrict: 'AE',
    templateUrl: '/views/directives/datetimepicker.html',
    require: 'ngModel',
    scope: {
      label: "=?label"
    },
    link: function(scope, element, attr, ngModel) {
      scope.open = function() {
        return scope.date_opened = true;
      };
      $timeout((function() {
        return scope.model = Date.parse(ngModel.$viewValue);
      }), 400);
      return scope.selectDate = (function(model) {
        return ngModel.$setViewValue(model);
      });
    }
  };
  return directive;
};

'use strict';

angular.module('app').directive('datetimepicker', datetimepicker);

var deleteAvatar;

deleteAvatar = function($timeout) {
  var directive;
  directive = {
    restrict: 'EA',
    templateUrl: '/views/directives/delete_avatar.html',
    scope: {
      removeAvatar: '=ngModel',
      file: "=file"
    },
    link: function(scope, element, attrs) {
      attrs.$observe('imgName', function(value) {
        scope.imgName = value;
      });
      return scope.remove = function() {
        $timeout(function() {
          return scope.imgName = 'images/default_avatar.jpg';
        });
        if (scope.file !== 'default_avatar.jpg') {
          return scope.removeAvatar = true;
        }
      };
    }
  };
  return directive;
};

'use strict';

angular.module('app').directive('deleteAvatar', deleteAvatar);

var fileField;

fileField = function() {
  var directive;
  directive = {
    restrict: 'AE',
    templateUrl: 'views/directives/file_field.html',
    scope: {
      attrId: '=',
      ngModel: '=ngModel',
      removeAvatar: '=?removedAvatar'
    },
    link: function(scope, element, attr) {
      return element.bind('change', function(changeEvent) {
        var fileName, files;
        scope.ngModel = event.target.files;
        scope.removeAvatar = false;
        files = event.target.files;
        fileName = files[0].name;
        return element[0].querySelector('input[type=text]').setAttribute('value', fileName);
      });
    }
  };
  return directive;
};

'use strict';

angular.module('app').directive('fileField', fileField);

var pagination;

pagination = function($http) {
  var directive;
  directive = {
    restrict: 'EA',
    templateUrl: 'views/directives/pagination.html',
    scope: {
      pagiArr: '=',
      items: '=',
      pagiApiUrl: '='
    },
    link: function(scope, element, attr) {
      scope.$watch((function() {
        return scope.pagiArr;
      }), (function(newValue, oldValue) {
        if (!angular.equals(oldValue, newValue)) {
          scope.pagiArr = newValue;
          scope.totalPages = scope.pagiArr.last_page;
          scope.currentPage = scope.pagiArr.current_page;
          scope.total = scope.pagiArr.total;
          scope.perPage = scope.pagiArr.per_page;
          scope.painationRange(scope.totalPages);
        }
      }), true);
      scope.getPosts = function(pageNumber) {
        if (pageNumber === void 0) {
          pageNumber = '1';
        }
        $http.get(scope.pagiApiUrl + '?page=' + pageNumber).success(function(response) {
          scope.items = response.data;
          scope.totalPages = response.last_page;
          scope.currentPage = response.current_page;
          scope.painationRange(scope.totalPages);
        });
      };
      return scope.painationRange = function(totalPages) {
        var i, pages;
        pages = [];
        i = 1;
        while (i <= totalPages) {
          pages.push(i);
          i++;
        }
        return scope.range = pages;
      };
    }
  };
  return directive;
};

'use strict';

angular.module('app').directive('pagination', pagination);

var radioField;

radioField = function($http) {
  var directive;
  directive = {
    restrict: 'EA',
    templateUrl: '/views/directives/radio_field.html',
    scope: {
      ngModel: "=ngModel",
      label: '=label',
      attrName: '=attrName',
      attrValue: '=attrValue',
      ngChecked: '=?ngChecked'
    },
    link: function(scope, element, attr) {
      scope.ngModel = scope.attrValue;
      return element.bind('change', function() {
        return scope.ngModel = scope.attrValue;
      });
    }
  };
  return directive;
};

'use strict';

angular.module('app').directive('radioField', radioField);

var timepicker;

timepicker = function() {
  var directive;
  directive = {
    restrict: 'AE',
    templateUrl: '/views/directives/timepicker.html',
    scope: {
      model: "=ngModel",
      label: "=?label",
      attrName: "@"
    },
    link: function(scope, element, attr) {
      scope.hstep = 1;
      scope.mstep = 5;
      return scope.ismeridian = true;
    }
  };
  return directive;
};

'use strict';

angular.module('app').directive('timepicker', timepicker);

var IndexMapCtrl;

IndexMapCtrl = function($http) {
  var apiKey, initMap, vm;
  vm = this;
  apiKey = 'a303d3a44a01c9f8a5cb0107b033efbe';
  vm.markers = [];
  $http({
    method: 'GET',
    url: '/api/map'
  }).then((function(response) {
    vm.points = response.data;
    initMap();
  }));
  initMap = function() {
    var map, mapElement, mapOptions, prevInfoWindow;
    mapOptions = {
      zoom: 12,
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      center: new google.maps.LatLng(51.5073509, -0.1277583),
      styles: vm.styles
    };
    mapElement = document.getElementById('map');
    map = new google.maps.Map(mapElement, mapOptions);
    prevInfoWindow = false;
    angular.forEach(vm.points, function(value, key) {
      var address, apiUrl, req;
      address = value.store.address;
      apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + address + "&pretty=1&key=" + apiKey;
      req = new XMLHttpRequest();
      req.onload = function() {
        var contentString, infoWindow, marker, position, response;
        if (req.readyState === 4 && req.status === 200) {
          response = JSON.parse(this.responseText);
          position = response.results[0].geometry;
          if (response.status.code === 200) {
            contentString = '<div class="marker-content">' + '<div><span class="maker-content__title">' + 'Address:</span> ' + value.store.address + '</div>' + '<div><span class="maker-content__title">' + 'Phone:</span> ' + value.store.phone + '</div>' + '</div>';
            infoWindow = new google.maps.InfoWindow({
              content: contentString
            });
          }
          if (parseInt(value.status)) {
            vm.baloonName = 'images/balloon_shiped.png';
          } else {
            vm.baloonName = 'images/balloon.png';
          }
          marker = new google.maps.Marker({
            map: map,
            icon: vm.baloonName,
            position: position
          });
          google.maps.event.addListener(marker, 'click', function() {
            if (prevInfoWindow) {
              prevInfoWindow.close();
            }
            prevInfoWindow = infoWindow;
            map.panTo(marker.getPosition());
            infoWindow.open(map, marker);
          });
          google.maps.event.addListener(map, 'click', function() {
            infoWindow.close();
          });
          return vm.markers.push(marker);
        }
      };
      req.open("GET", apiUrl, true);
      return req.send();
    });
  };
  vm.styles = [
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
  ];
  vm.goToPoint = function(id) {
    return google.maps.event.trigger(vm.markers[id], 'click');
  };
};

'use strict';

angular.module('app').controller('IndexMapCtrl', IndexMapCtrl);

var IndexHomeCtrl;

IndexHomeCtrl = function($http, $filter, $rootScope) {
  var apiKey, initMap, orderBy, vm;
  vm = this;
  vm.sortReverse = null;
  vm.pagiApiUrl = '/api/home';
  orderBy = $filter('orderBy');
  apiKey = 'a303d3a44a01c9f8a5cb0107b033efbe';
  vm.markers = [];

  /*  ROUTES */
  if ($rootScope.currentUser.user_group === 'admin') {
    $http.get('/api/home').then(function(response) {
      console.log(response.data);
      vm.routes = response.data.data;
      vm.pagiArr = response.data;
    }, function(error) {
      vm.error = error.data;
    });
  }

  /*  MAP */
  $http({
    method: 'GET',
    url: '/api/home/getpoints'
  }).then((function(response) {
    vm.points = response.data;
    initMap();
  }));
  vm.sortBy = function(predicate) {
    vm.sortReverse = !vm.sortReverse;
    $('.sort-link').each(function() {
      return $(this).removeClass().addClass('sort-link c-p');
    });
    if (vm.sortReverse) {
      $('#' + predicate).removeClass('active-asc').addClass('active-desc');
    } else {
      $('#' + predicate).removeClass('active-desc').addClass('active-asc');
    }
    vm.predicate = predicate;
    vm.reverse = vm.predicate === predicate ? !vm.reverse : false;
    vm.routes = orderBy(vm.routes, predicate, vm.reverse);
  };
  initMap = function() {
    var map, mapElement, mapOptions, prevInfoWindow;
    mapOptions = {
      zoom: 12,
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      center: new google.maps.LatLng(51.5073509, -0.1277583),
      styles: vm.styles
    };
    mapElement = document.getElementById('map');
    map = new google.maps.Map(mapElement, mapOptions);
    prevInfoWindow = false;
    angular.forEach(vm.points, function(value, key) {
      var address, apiUrl, req;
      address = value.store.address;
      apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + address + "&pretty=1&key=" + apiKey;
      req = new XMLHttpRequest();
      req.onload = function() {
        var contentString, infoWindow, marker, position, response;
        if (req.readyState === 4 && req.status === 200) {
          response = JSON.parse(this.responseText);
          position = response.results[0].geometry;
          if (response.status.code === 200) {
            contentString = '<div class="marker-content">' + '<div><span class="maker-content__title">' + 'Address:</span> ' + value.store.address + '</div>' + '<div><span class="maker-content__title">' + 'Phone:</span> ' + value.store.phone + '</div>' + '</div>';
            infoWindow = new google.maps.InfoWindow({
              content: contentString
            });
            if (parseInt(value.status)) {
              vm.baloonName = 'images/balloon_shiped.png';
            } else {
              vm.baloonName = 'images/balloon.png';
            }
            marker = new google.maps.Marker({
              map: map,
              icon: vm.baloonName,
              position: position
            });
            google.maps.event.addListener(marker, 'click', function() {
              if (prevInfoWindow) {
                prevInfoWindow.close();
              }
              prevInfoWindow = infoWindow;
              map.panTo(marker.getPosition());
              infoWindow.open(map, marker);
            });
            google.maps.event.addListener(map, 'click', function() {
              infoWindow.close();
            });
            return vm.markers.push(marker);
          }
        }
      };
      req.open("GET", apiUrl, true);
      return req.send();
    });
  };
  vm.styles = [
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
  ];
  vm.goToPoint = function(id) {
    return google.maps.event.trigger(vm.markers[id], 'click');
  };
};

'use strict';

angular.module('app').controller('IndexHomeCtrl', IndexHomeCtrl);

var CreateRouteCtrl;

CreateRouteCtrl = function($http, $state) {
  var vm;
  vm = this;
  vm.pointForms = [];
  $http.post('/api/routes/getUsersAndStores').then(function(response) {
    return vm.obj = response.data;
  }, function(error) {
    return vm.error = error.data;
  });
  vm.createRoute = function() {
    vm.route = {
      user_id: vm.user_id,
      date: vm.date,
      points: vm.pointForms
    };
    $http.post('/api/routes', vm.route).then(function(response) {
      vm.data = response.data;
      return $state.go('routes', {
        flashSuccess: 'New route has been added!'
      });
    }, function(error) {
      vm.error = error.data;
      return console.log(vm.error);
    });
  };
  vm.addPoint = function() {
    return vm.pointForms.push({});
  };
  vm.removePoint = function(index) {
    return vm.pointForms.splice(index, 1);
  };
};

'use strict';

angular.module('app').controller('CreateRouteCtrl', CreateRouteCtrl);

var EditRouteCtrl;

EditRouteCtrl = function($http, $state, $stateParams) {
  var vm;
  vm = this;
  vm.id = $stateParams.id;
  vm.count = 1;
  $http.get('/api/routes/edit/' + vm.id).then(function(response) {
    vm.obj = response.data;
  }, function(error) {
    return vm.error = error.data;
  });
  vm.update = function() {
    var route;
    route = {
      user_id: vm.obj.user_id,
      date: vm.obj.date,
      points: vm.obj.points
    };
    return $http.patch('/api/routes/' + vm.id, route).then(function(response) {
      return $state.go('routes', {
        flashSuccess: 'Route Updated!'
      });
    }, function(error) {
      vm.error = error.data;
      return console.log(vm.error);
    });
  };
  vm.addPoint = function() {
    vm.obj.points.push({
      id: vm.count + '_new'
    });
    vm.count++;
  };
  vm.removePoint = function(index) {
    return vm.obj.points.splice(index, 1);
  };
};

'use strict';

angular.module('app').controller('EditRouteCtrl', EditRouteCtrl);

var IndexRouteCtrl;

IndexRouteCtrl = function($http, $filter, $stateParams) {
  var orderBy, vm;
  vm = this;
  vm.sortReverse = null;
  vm.pagiApiUrl = '/api/routes';
  orderBy = $filter('orderBy');
  if ($stateParams.flashSuccess) {
    vm.flashSuccess = $stateParams.flashSuccess;
  }
  $http.get('/api/routes').then(function(response) {
    vm.routes = response.data.data;
    vm.pagiArr = response.data;
  }, function(error) {
    vm.error = error.data;
  });
  vm.sortBy = function(predicate) {
    vm.sortReverse = !vm.sortReverse;
    $('.sort-link').each(function() {
      return $(this).removeClass().addClass('sort-link c-p');
    });
    if (vm.sortReverse) {
      $('#' + predicate).removeClass('active-asc').addClass('active-desc');
    } else {
      $('#' + predicate).removeClass('active-desc').addClass('active-asc');
    }
    vm.predicate = predicate;
    vm.reverse = vm.predicate === predicate ? !vm.reverse : false;
    vm.routes = orderBy(vm.routes, predicate, vm.reverse);
  };
  vm.deleteRoute = function(id, index) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      $http["delete"]('/api/routes/' + id).then((function(response) {
        vm.routes.splice(index, 1);
        vm.flashSuccess = 'Route deleted!';
      }), function(error) {
        return vm.error = error;
      });
    }
  };
};

'use strict';

angular.module('app').controller('IndexRouteCtrl', IndexRouteCtrl);

var ShowRouteCtrl;

ShowRouteCtrl = function($http, $stateParams, $state) {
  var apiKey, initMap, vm;
  vm = this;
  vm.id = $stateParams.id;
  apiKey = 'a303d3a44a01c9f8a5cb0107b033efbe';
  vm.markers = [];
  $http.get('/api/routes/' + vm.id).then(function(response) {
    vm.route = response.data.route;
    vm.stores = response.data.stores;
    vm.points = response.data.points;
    vm.route.date = moment(new Date(vm.route.date)).format('DD.MM.YYYY');
    initMap();
  }, function(error) {
    vm.error = error.data;
    return console.log(error);
  });
  vm.deleteRoute = function(id) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      return $http["delete"]('/api/routes/' + id).then((function(response) {
        $state.go('routes', {
          flashSuccess: 'Route Deleted!'
        });
      }), function(error) {
        return vm.error = error;
      });
    }
  };
  initMap = function() {
    var map, mapElement, mapOptions, prevInfoWindow;
    mapOptions = {
      zoom: 12,
      scrollwheel: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      center: new google.maps.LatLng(51.500152, -0.126236),
      styles: vm.styles
    };
    mapElement = document.getElementById('route-map');
    map = new google.maps.Map(mapElement, mapOptions);
    prevInfoWindow = false;
    angular.forEach(vm.points, function(value, key) {
      var address, apiUrl, req;
      address = value.store.address;
      apiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + address + "&pretty=1&key=" + apiKey;
      req = new XMLHttpRequest();
      req.onload = function() {
        var contentString, infoWindow, marker, position, response;
        if (req.readyState === 4 && req.status === 200) {
          response = JSON.parse(this.responseText);
          position = response.results[0].geometry;
          if (response.status.code === 200) {
            contentString = '<div class="marker-content">' + '<div><span class="maker-content__title">' + 'Address:</span> ' + value.store.address + '</div>' + '<div><span class="maker-content__title">' + 'Phone:</span> ' + value.store.phone + '</div>' + '</div>';
            infoWindow = new google.maps.InfoWindow({
              content: contentString
            });
            if (parseInt(value.status)) {
              vm.baloonName = 'images/balloon_shiped.png';
            } else {
              vm.baloonName = 'images/balloon.png';
            }
            marker = new google.maps.Marker({
              map: map,
              icon: vm.baloonName,
              position: position
            });
            google.maps.event.addListener(marker, 'click', function() {
              if (prevInfoWindow) {
                prevInfoWindow.close();
              }
              prevInfoWindow = infoWindow;
              map.panTo(marker.getPosition());
              infoWindow.open(map, marker);
            });
            google.maps.event.addListener(map, 'click', function() {
              infoWindow.close();
            });
            return vm.markers.push(marker);
          }
        }
      };
      req.open("GET", apiUrl, true);
      return req.send();
    });
  };
  vm.styles = [
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
  ];
  vm.goToPoint = function(id) {
    return google.maps.event.trigger(vm.markers[id], 'click');
  };
};

'use strict';

angular.module('app').controller('ShowRouteCtrl', ShowRouteCtrl);

var EditProfileCtrl;

EditProfileCtrl = function($http, $state, Upload, $rootScope) {
  var vm;
  vm = this;
  $http.get('/api/profile/edit').then(function(response) {
    vm.user = response.data;
    vm.user.remove_avatar = false;
    return vm.avatar = vm.makeAvatarLink(vm.user.avatar);
  }, function(error) {
    return vm.error = error.data;
  });
  vm.update = function() {
    var avatar;
    avatar = vm.user.avatar;
    if (vm.user.avatar === '/images/default_avatar.jpg') {
      vm.user.avatar = 'default_avatar.jpg';
      avatar = 'default_avatar.jpg';
    }
    vm.data({
      avatar: avatar,
      remove_avatar: vm.user.remove_avatar,
      name: vm.user.name,
      last_name: vm.user.last_name,
      initials: vm.user.initials,
      bday: vm.user.bday,
      email: vm.user.email,
      phone: vm.user.phone,
      job_title: vm.user.job_title,
      country: vm.user.country,
      city: vm.user.city
    });
    return Upload.upload({
      url: '/api/profile/' + vm.user.id,
      method: 'Post',
      data: vm.data
    }).then((function(response) {
      var fileName, storage;
      fileName = response.data;
      storage = localStorage.getItem('user');
      storage = JSON.parse(storage);
      if (typeof fileName === 'boolean' && vm.user.remove_avatar) {
        storage.avatar = 'default_avatar.jpg';
        $rootScope.currentUser.avatar = 'default_avatar.jpg';
      } else if (typeof fileName === 'string' && !vm.user.remove_avatar) {
        storage.avatar = fileName;
        $rootScope.currentUser.avatar = vm.makeAvatarLink(storage.avatar);
        storage.avatar = fileName;
      }
      localStorage.setItem('user', JSON.stringify(storage));
      return $state.go('profile', {
        flashSuccess: 'Profile updated!'
      });
    }), (function(error) {
      vm.error = error.data;
      console.log(vm.error);
    }));
  };
  vm.makeAvatarLink = function(avatarName) {
    if (avatarName === 'default_avatar.jpg') {
      avatarName = '/images/' + avatarName;
    } else {
      avatarName = '/uploads/avatars/' + avatarName;
    }
    return avatarName;
  };
};

'use strict';

angular.module('app').controller('EditProfileCtrl', EditProfileCtrl);

var IndexProfileCtrl;

IndexProfileCtrl = function($http) {
  var vm;
  vm = this;
  $http.get('/api/profile').then(function(response) {
    vm.user = response.data.user;
    vm.points = response.data.points;
    if (vm.user.avatar === 'default_avatar.jpg') {
      vm.user.avatar = '/images/' + vm.user.avatar;
    } else {
      vm.user.avatar = 'uploads/avatars/' + vm.user.avatar;
    }
    return vm.user.bday = moment(new Date(vm.user.bday)).format('DD.MM.YYYY');
  }, function(error) {
    return vm.error = error.data;
  });
  vm.updatePoints = function() {
    return $http.put('/api/profile/updatepoints', vm.points).then(function(response) {
      return vm.flashSuccess = 'Points updated!';
    }, function(error) {
      return vm.error = error.data;
    });
  };
};

'use strict';

angular.module('app').controller('IndexProfileCtrl', IndexProfileCtrl);

var CreateStoreCtrl;

CreateStoreCtrl = function($scope, $http, $state) {
  var vm;
  vm = this;
  vm.create = function() {
    var store;
    store = {
      name: vm.storeName,
      owner_name: vm.ownerName,
      address: vm.address,
      phone: vm.phone,
      email: vm.email
    };
    return $http.post('/api/stores', store).then(function(response) {
      return $state.go('stores', {
        flashSuccess: 'New store created!'
      });
    }, function(error) {
      return vm.error = error.data;
    });
  };
  $scope.getLocation = function(address) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        language: 'en',
        components: 'country:UK|administrative_area:London'
      },
      skipAuthorization: true
    }).then(function(response) {
      return response.data.results.map(function(item) {
        return item.formatted_address;
      });
    });
  };
};

'use strict';

angular.module('app').controller('CreateStoreCtrl', CreateStoreCtrl);

var EditStoreCtrl;

EditStoreCtrl = function($scope, $http, $stateParams, $state) {
  var vm;
  vm = this;
  vm.id = $stateParams.id;
  $http.get('api/stores/' + vm.id).then(function(response) {
    vm.data = response.data;
  }, function(error) {
    vm.error = error.data;
  });
  vm.update = function() {
    var store;
    store = {
      name: vm.data.name,
      owner_name: vm.data.owner_name,
      address: vm.data.address,
      phone: vm.data.phone,
      email: vm.data.email
    };
    return $http.patch('/api/stores/' + vm.id, store).then(function(response) {
      return $state.go('stores', {
        flashSuccess: 'Store Updated!'
      });
    }, function(error) {
      return vm.error = error.data;
    });
  };
  $scope.getLocation = function(address) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        language: 'en',
        components: 'country:UK|administrative_area:London'
      },
      skipAuthorization: true
    }).then(function(response) {
      return response.data.results.map(function(item) {
        return item.formatted_address;
      });
    });
  };
};

'use strict';

angular.module('app').controller('EditStoreCtrl', EditStoreCtrl);

var IndexStoreCtrl;

IndexStoreCtrl = function($http, $filter, $rootScope, $stateParams) {
  var orderBy, vm;
  vm = this;
  vm.sortReverse = null;
  vm.pagiApiUrl = '/api/stores';
  orderBy = $filter('orderBy');
  if ($stateParams.flashSuccess) {
    vm.flashSuccess = $stateParams.flashSuccess;
  }
  $http.get('api/stores').then(function(response) {
    vm.stores = response.data.data;
    vm.pagiArr = response.data;
  }, function(error) {
    vm.error = error.data;
  });
  vm.sortBy = function(predicate) {
    vm.sortReverse = !vm.sortReverse;
    $('.sort-link').each(function() {
      return $(this).removeClass().addClass('sort-link c-p');
    });
    if (vm.sortReverse) {
      $('#' + predicate).removeClass('active-asc').addClass('active-desc');
    } else {
      $('#' + predicate).removeClass('active-desc').addClass('active-asc');
    }
    vm.predicate = predicate;
    vm.reverse = vm.predicate === predicate ? !vm.reverse : false;
    vm.stores = orderBy(vm.stores, predicate, vm.reverse);
  };
  vm.deleteStore = function(id, index) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      $http["delete"]('/api/stores/' + id).then((function(response) {
        vm.stores.splice(index, 1);
        vm.flashSuccess = 'Store deleted!';
      }), function(error) {
        return vm.error = error;
      });
    }
  };
};

'use strict';

angular.module('app').controller('IndexStoreCtrl', IndexStoreCtrl);

var ShowStoreCtrl;

ShowStoreCtrl = function($http, $stateParams, $state) {
  var vm;
  vm = this;
  vm.id = $stateParams.id;
  $http.get('api/stores/' + vm.id).then(function(response) {
    vm.data = response.data;
  }, function(error) {
    vm.error = error.data;
  });
  vm.deleteStore = function(id) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      $http["delete"]('api/stores/' + id).then((function(response) {
        $state.go('stores', {
          flashSuccess: 'Store deleted!'
        });
      }));
    }
  };
};

'use strict';

angular.module('app').controller('ShowStoreCtrl', ShowStoreCtrl);

var ConfirmController;

ConfirmController = function($auth, $state, $http, $rootScope, $stateParams) {
  var vm;
  vm = this;
  vm.data = {
    confirmation_code: $stateParams.confirmation_code
  };
  $http.post('api/authenticate/confirm', vm.data).success(function(data, status, headers, config) {
    var user;
    $auth.setToken(data.token);
    user = JSON.stringify(data);
    localStorage.setItem('user', user);
    $rootScope.authenticated = true;
    $rootScope.currentUser = data;
    return $state.go('/');
  }).error(function(data, status, header, config) {
    return $state.go('sign_in');
  });
};

'use strict';

angular.module('app').controller('ConfirmController', ConfirmController);

var ForgotPasswordController;

ForgotPasswordController = function($http) {
  var vm;
  vm = this;
  vm.restorePassword = function() {
    var data;
    vm.spinnerDone = true;
    data = {
      email: vm.email
    };
    $http.post('api/authenticate/send_reset_code', data).success(function(data, status, headers, config) {
      vm.spinnerDone = false;
      if (data) {
        return vm.successSendingEmail = true;
      }
    }).error(function(error, status, header, config) {
      vm.error = error;
      return vm.spinnerDone = false;
    });
  };
};

'use strict';

angular.module('app').controller('ForgotPasswordController', ForgotPasswordController);

var ResetPasswordController;

ResetPasswordController = function($auth, $state, $http, $stateParams) {
  var vm;
  vm = this;
  vm.minlength = 8;
  vm.restorePassword = function(form) {
    var data;
    data = {
      reset_password_code: $stateParams.reset_password_code,
      password: vm.password,
      password_confirmation: vm.password_confirmation
    };
    $http.post('api/authenticate/reset_password', data).success(function(data, status, headers, config) {
      if (data) {
        return vm.successRestorePassword = true;
      }
    }).error(function(error, status, header, config) {
      console.log(error);
      return vm.error = error;
    });
  };
};

'use strict';

angular.module('app').controller('ResetPasswordController', ResetPasswordController);

var SignInController;

SignInController = function($auth, $state, $http, $rootScope) {
  var vm;
  vm = this;
  vm.login = function() {
    var credentials;
    credentials = {
      email: vm.email,
      password: vm.password
    };
    return $auth.login(credentials).then((function() {
      return $http.get('api/authenticate/get_user').then(function(response) {
        var user;
        user = JSON.stringify(response.data.user);
        localStorage.setItem('user', user);
        $rootScope.authenticated = true;
        $rootScope.currentUser = response.data.user;
        $state.go('/');
      });
    }), function(error) {
      vm.error = error.data;
      console.log(vm.error);
    });
  };
};

'use strict';

angular.module('app').controller('SignInController', SignInController);

var SignUpController;

SignUpController = function($auth, $state) {
  var vm;
  vm = this;
  vm.register = function() {
    var credentials;
    vm.spinnerDone = true;
    if (vm.user) {
      credentials = {
        name: vm.user.name,
        email: vm.user.email,
        password: vm.user.password,
        password_confirmation: vm.user.password_confirmation
      };
    }
    $auth.signup(credentials).then(function(response) {
      vm.spinnerDone = false;
      $state.go('sign_up_success');
    })["catch"](function(error) {
      vm.spinnerDone = false;
      vm.error = error.data;
    });
  };
};

'use strict';

angular.module('app').controller('SignUpController', SignUpController);

var UserController;

UserController = function($http, $state, $auth, $rootScope) {
  var vm;
  vm = this;
  vm.getUsers = function() {
    $http.get('api/authenticate').success(function(users) {
      vm.users = users;
    }).error(function(error) {
      vm.error = error;
    });
  };
  vm.logout = function() {
    $auth.logout().then(function() {
      localStorage.removeItem('user');
      $rootScope.authenticated = false;
      $rootScope.currentUser = null;
      $state.go('sign_in');
    });
  };
};

'use strict';

angular.module('app').controller('UserController', UserController);

var CreateUserCtrl;

CreateUserCtrl = function($http, $state, Upload, lodash) {
  var vm;
  vm = this;
  vm.chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
  $http.get('/api/users/create').then(function(response) {
    return vm.enums = response.data;
  }, function(error) {
    return vm.error = error.data;
  });
  vm.addUser = function() {
    vm.data = {
      name: vm.name,
      last_name: vm.last_name,
      initials: vm.initials,
      avatar: vm.avatar,
      bday: vm.bday,
      job_title: vm.job_title,
      user_group: vm.user_group,
      country: vm.country,
      city: vm.city,
      phone: vm.phone,
      email: vm.email,
      password: vm.password
    };
    Upload.upload({
      url: '/api/users',
      method: 'Post',
      data: vm.data
    }).then((function(resp) {
      $state.go('users', {
        flashSuccess: 'New user has been added!'
      });
    }), (function(error) {
      vm.error = error.data;
    }));
  };
  vm.generatePass = function() {
    var i, passLength, x;
    vm.password = '';
    passLength = lodash.random(8, 15);
    x = 0;
    while (x < passLength) {
      i = Math.floor(Math.random() * vm.chars.length);
      vm.password += vm.chars.charAt(i);
      x++;
    }
    return vm.password;
  };
};

'use strict';

angular.module('app').controller('CreateUserCtrl', CreateUserCtrl);

var IndexUserCtrl;

IndexUserCtrl = function($http, $filter, $rootScope, $stateParams) {
  var orderBy, vm;
  vm = this;
  vm.sortReverse = null;
  vm.pagiApiUrl = '/api/users';
  orderBy = $filter('orderBy');
  if ($stateParams.flashSuccess) {
    vm.flashSuccess = $stateParams.flashSuccess;
  }
  $http.get('api/users').then(function(response) {
    vm.users = response.data.data;
    vm.pagiArr = response.data;
  }, function(error) {
    vm.error = error.data;
  });
  vm.sortBy = function(predicate) {
    vm.sortReverse = !vm.sortReverse;
    $('.sort-link').each(function() {
      return $(this).removeClass().addClass('sort-link c-p');
    });
    if (vm.sortReverse) {
      $('#' + predicate).removeClass('active-asc').addClass('active-desc');
    } else {
      $('#' + predicate).removeClass('active-desc').addClass('active-asc');
    }
    vm.predicate = predicate;
    vm.reverse = vm.predicate === predicate ? !vm.reverse : false;
    vm.users = orderBy(vm.users, predicate, vm.reverse);
  };
  vm.deleteUser = function(id, index) {
    var confirmation;
    confirmation = confirm('Are you sure?');
    if (confirmation) {
      $http["delete"]('/api/users/' + id).then((function(response) {
        vm.users.splice(index, 1);
        vm.flashSuccess = 'User deleted!';
      }), function(error) {
        return vm.error = error;
      });
    }
  };
};

'use strict';

angular.module('app').controller('IndexUserCtrl', IndexUserCtrl);

var ShowUserCtrl;

ShowUserCtrl = function($http, $stateParams, $state) {
  var vm;
  vm = this;
  vm.id = $stateParams.id;
  vm.settings = {
    lineWidth: 5,
    trackColor: '#e8eff0',
    barColor: '#27c24c',
    scaleColor: false,
    color: '#3a3f51',
    size: 134,
    lineCap: 'butt',
    rotate: -90,
    animate: 1000
  };
  $http.get('api/users/' + vm.id).then(function(response) {
    vm.obj = response.data;
    if (vm.obj.avatar === 'default_avatar.jpg') {
      vm.obj.avatar = '/images/' + vm.obj.avatar;
    } else {
      vm.obj.avatar = 'uploads/avatars/' + vm.obj.avatar;
    }
    vm.obj.bday = moment(new Date(vm.obj.bday)).format('DD.MM.YYYY');
  }, function(error) {
    vm.error = error.data;
  });
};

'use strict';

angular.module('app').controller('ShowUserCtrl', ShowUserCtrl);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJtb2R1bGVzL3B1c2hlci1ub3RpZmljYXRpb25zLmNvZmZlZSIsImRpcmVjdGl2ZXMvY2hlY2tib3hfZmllbGQuY29mZmVlIiwiZGlyZWN0aXZlcy9kYXRldGltZXBpY2tlci5jb2ZmZWUiLCJkaXJlY3RpdmVzL2RlbGV0ZV9hdmF0YXIuY29mZmVlIiwiZGlyZWN0aXZlcy9maWxlX2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvcGFnaW5hdGlvbi5jb2ZmZWUiLCJkaXJlY3RpdmVzL3JhZGlvX2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvdGltZXBpY2tlci5jb2ZmZWUiLCJjb250cm9sbGVycy9tYXAvaW5kZXhfbWFwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvaG9tZS9pbmRleF9ob21lX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2NyZWF0ZV9yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3JvdXRlcy9lZGl0X3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2luZGV4X3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL3Nob3dfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9wcm9maWxlL2VkaXRfcHJvZmlsZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3Byb2ZpbGUvaW5kZXhfcHJvZmlsZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9jcmVhdGVfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvZWRpdF9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9pbmRleF9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9zaG93X3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9jb25maXJtX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9mb3Jnb3RfcGFzc3dvcmRfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2VyL3Jlc2V0X3Bhc3N3b3JkX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9zaWduX2luX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9zaWduX3VwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvY3JlYXRlX3VzZXJfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2Vycy9pbmRleF91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvc2hvd191c2VyX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBRUEsT0FDRSxDQUFDLE1BREgsQ0FDVSxLQURWLEVBQ2lCLENBQ2IseUJBRGEsRUFFYixXQUZhLEVBR2IsWUFIYSxFQUliLGNBSmEsRUFLYixVQUxhLEVBTWIsUUFOYSxFQU9iLGVBUGEsRUFRYixjQVJhLEVBU2IsY0FUYSxDQURqQixDQVdJLENBQUMsTUFYTCxDQVdZLFNBQ1IsY0FEUSxFQUVSLGtCQUZRLEVBR1IsYUFIUSxFQUlSLGlCQUpRO0VBTVIsaUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsSUFBNUI7RUFHQSxhQUFhLENBQUMsUUFBZCxHQUF5QjtFQUN6QixhQUFhLENBQUMsU0FBZCxHQUEwQjtFQUMxQixrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixlQUE3QjtFQUVBLGNBQ0UsQ0FBQyxLQURILENBQ1MsR0FEVCxFQUVJO0lBQUEsR0FBQSxFQUFLLEdBQUw7SUFDQSxXQUFBLEVBQWEsMEJBRGI7SUFFQSxVQUFBLEVBQVksdUJBRlo7R0FGSixDQVFFLENBQUMsS0FSSCxDQVFTLFNBUlQsRUFTSTtJQUFBLEdBQUEsRUFBSyxlQUFMO0lBQ0EsV0FBQSxFQUFhLDRCQURiO0lBRUEsVUFBQSxFQUFZLDBCQUZaO0dBVEosQ0FhRSxDQUFDLEtBYkgsQ0FhUyxTQWJULEVBY0k7SUFBQSxHQUFB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QUFHLENBQUMsT0FEdEM7S0FBQSxNQUFBO01BR0UsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFQLEdBQWdCLGtCQUFBLEdBQXFCLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FIOUM7O0lBSUEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFQLEdBQWMsTUFBQSxDQUFXLElBQUEsSUFBQSxDQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBWixDQUFYLENBQTZCLENBQUMsTUFBOUIsQ0FBcUMsWUFBckM7RUFObUIsQ0FBbkMsRUFRRSxTQUFDLEtBQUQ7SUFDQSxFQUFFLENBQUMsS0FBSCxHQUFXLEtBQUssQ0FBQztFQURqQixDQVJGO0FBZGE7O0FBNkJmOztBQUNBLE9BQ0UsQ0FBQyxNQURILENBQ1UsS0FEVixDQUVFLENBQUMsVUFGSCxDQUVjLGNBRmQsRUFFOEIsWUFGOUIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJywgW1xuICAgICdhcHAucHVzaGVyTm90aWZpY2F0aW9ucycsXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3NhdGVsbGl6ZXInLFxuICAgICd1aS5ib290c3RyYXAnLFxuICAgICduZ0xvZGFzaCcsXG4gICAgJ25nTWFzaycsXG4gICAgJ2FuZ3VsYXJNb21lbnQnLFxuICAgICdlYXN5cGllY2hhcnQnLFxuICAgICduZ0ZpbGVVcGxvYWQnLFxuICBdKS5jb25maWcoKFxuICAgICRzdGF0ZVByb3ZpZGVyLFxuICAgICR1cmxSb3V0ZXJQcm92aWRlcixcbiAgICAkYXV0aFByb3ZpZGVyLFxuICAgICRsb2NhdGlvblByb3ZpZGVyXG4gICkgLT5cbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUgdHJ1ZVxuICAgICMgU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICMgcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cbiAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlJ1xuICAgICRhdXRoUHJvdmlkZXIuc2lnbnVwVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL3JlZ2lzdGVyJ1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UgJy91c2VyL3NpZ25faW4nXG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCcvJyxcbiAgICAgICAgdXJsOiAnLydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9wYWdlcy9ob21lLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleEhvbWVDdHJsIGFzIGhvbWUnXG4gICAgICApXG5cbiAgICAgICMgVVNFUlxuICAgICAgLnN0YXRlKCdzaWduX2luJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvc2lnbl9pbidcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25faW4uaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25JbkNvbnRyb2xsZXIgYXMgYXV0aCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc2lnbl91cCcsXG4gICAgICAgIHVybDogJy91c2VyL3NpZ25fdXAnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9zaWduX3VwLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDb250cm9sbGVyIGFzIHJlZ2lzdGVyJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzaWduX3VwX3N1Y2Nlc3MnLFxuICAgICAgICB1cmw6ICcvdXNlci9zaWduX3VwX3N1Y2Nlc3MnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9zaWduX3VwX3N1Y2Nlc3MuaHRtbCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnZm9yZ290X3Bhc3N3b3JkJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvZm9yZ290X3Bhc3N3b3JkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvZm9yZ290X3Bhc3N3b3JkLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGb3Jnb3RQYXNzd29yZENvbnRyb2xsZXIgYXMgZm9yZ290UGFzc3dvcmQnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvcmVzZXRfcGFzc3dvcmQvOnJlc2V0X3Bhc3N3b3JkX2NvZGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9yZXNldF9wYXNzd29yZC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnUmVzZXRQYXNzd29yZENvbnRyb2xsZXIgYXMgcmVzZXRQYXNzd29yZCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnY29uZmlybScsXG4gICAgICAgIHVybDogJy91c2VyL2NvbmZpcm0vOmNvbmZpcm1hdGlvbl9jb2RlJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ29uZmlybUNvbnRyb2xsZXInXG4gICAgICApXG5cbiAgICAgICMgUHJvZmlsZVxuICAgICAgLnN0YXRlKCdwcm9maWxlJyxcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvcHJvZmlsZS9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhQcm9maWxlQ3RybCBhcyBwcm9maWxlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdwcm9maWxlX2VkaXQnLFxuICAgICAgICB1cmw6ICcvcHJvZmlsZS9lZGl0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3Byb2ZpbGUvZWRpdC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRWRpdFByb2ZpbGVDdHJsIGFzIHByb2ZpbGUnXG4gICAgICApXG5cbiAgICAgICMgU3RvcmVzXG4gICAgICAuc3RhdGUoJ3N0b3JlcycsXG4gICAgICAgIHVybDogJy9zdG9yZXMnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFN0b3JlQ3RybCBhcyBzdG9yZXMnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICBmbGFzaFN1Y2Nlc3M6IG51bGxcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc3RvcmVzX2NyZWF0ZScsXG4gICAgICAgIHVybDogJy9zdG9yZXMvY3JlYXRlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9jcmVhdGUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVN0b3JlQ3RybCBhcyBzdG9yZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc3RvcmVzX2VkaXQnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzLzppZC9lZGl0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9lZGl0Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0U3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfc2hvdycsXG4gICAgICAgIHVybDogJy9zdG9yZXMvOmlkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9zaG93Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaG93U3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuXG4gICAgICAjIFVzZXJzXG4gICAgICAuc3RhdGUoJ3VzZXJzJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXJzL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFVzZXJDdHJsIGFzIHVzZXJzJ1xuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgZmxhc2hTdWNjZXNzOiBudWxsXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3VzZXJzX2NyZWF0ZScsXG4gICAgICAgIHVybDogJy91c2Vycy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlcnMvY3JlYXRlLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVVc2VyQ3RybCBhcyB1c2VyJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCd1c2Vyc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLzppZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2Vycy9zaG93Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaG93VXNlckN0cmwgYXMgdXNlcidcbiAgICAgIClcblxuICAgICAgIyBSb3V0ZXNcbiAgICAgIC5zdGF0ZSgncm91dGVzJyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4Um91dGVDdHJsIGFzIHJvdXRlcydcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIGZsYXNoU3VjY2VzczogbnVsbFxuICAgICAgKVxuICAgICAgLnN0YXRlKCdyb3V0ZXNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL2NyZWF0ZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlUm91dGVDdHJsIGFzIHJvdXRlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdyb3V0ZXNfZWRpdCcsXG4gICAgICAgIHVybDogJy9yb3V0ZXMvOmlkL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL2VkaXQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0VkaXRSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy86aWQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG5cbiAgICAgICMgTWFwXG4gICAgICAuc3RhdGUoJ21hcCcsXG4gICAgICAgIHVybDogJy9tYXAnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvbWFwL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleE1hcEN0cmwgYXMgbWFwJ1xuICAgICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgKS5ydW4gKCRhdXRoLCAkaHR0cCwgJGxvY2F0aW9uLCAkcSwgJHJvb3RTY29wZSwgJHN0YXRlKSAtPlxuICAgIHB1YmxpY1JvdXRlcyA9IFtcbiAgICAgICdzaWduX3VwJyxcbiAgICAgICdjb25maXJtJyxcbiAgICAgICdmb3Jnb3RfcGFzc3dvcmQnLFxuICAgICAgJ3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICBdXG5cbiAgICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3RhcnQnLCAoZXZlbnQsIHRvU3RhdGUpIC0+XG4gICAgICBpZiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkgJiZcbiAgICAgIHB1YmxpY1JvdXRlcy5pbmRleE9mKHRvU3RhdGUubmFtZSkgPT0gLTFcbiAgICAgICAgJGxvY2F0aW9uLnBhdGggJ3VzZXIvc2lnbl9pbidcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGlmICRhdXRoLmlzQXV0aGVudGljYXRlZCgpICYmXG4gICAgICAocHVibGljUm91dGVzLmluZGV4T2YodG9TdGF0ZS5uYW1lKSA9PSAwIHx8XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRTdGF0ZSA9PSAnc2lnbl9pbicpXG4gICAgICAgICRsb2NhdGlvbi5wYXRoICcvJ1xuXG4gICAgICB1c2VyID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpKVxuXG4gICAgICBpZiB1c2VyICYmICRhdXRoLmlzQXV0aGVudGljYXRlZCgpXG4gICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXJcblxuICAgICAgICBpZiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gJy9pbWFnZXMvJyArXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhclxuICAgICAgICBlbHNlXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSAndXBsb2Fkcy9hdmF0YXJzLycgK1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXJcblxuICAgICAgJHJvb3RTY29wZS5sb2dvdXQgPSAtPlxuICAgICAgICAkYXV0aC5sb2dvdXQoKS50aGVuIC0+XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0gJ3VzZXInXG4gICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbFxuXG4gICAgICAgICAgJHN0YXRlLmdvICdzaWduX2luJ1xuXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICByZXR1cm5cbiIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wdXNoZXJOb3RpZmljYXRpb25zJywgW1xuICAgICdub3RpZmljYXRpb24nXG4gIF0pXG4gIC5ydW4gKCRub3RpZmljYXRpb24sICRyb290U2NvcGUpIC0+XG4gICAgbmV3Um91dGVNZXNzYWdlID0gJ1lPVSBIQVZFIEEgTkVXIFJPVVRFLidcbiAgICByZWRUcnVja0ljb24gPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuICAgIHB1c2hlciA9IG5ldyBQdXNoZXIoJzZiNThjMTI0M2RmODIwMjhhNzg4Jywge1xuICAgICAgY2x1c3RlcjogJ2V1JyxcbiAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICB9KVxuICAgIGNoYW5uZWwgPSBwdXNoZXIuc3Vic2NyaWJlKCduZXctcm91dGUtY2hhbm5lbCcpXG5cbiAgICBjaGFubmVsLmJpbmQoJ0FwcFxcXFxFdmVudHNcXFxcTmV3Um91dGUnLCAoZGF0YSkgLT5cblxuICAgICAgaWYgJHJvb3RTY29wZS5jdXJyZW50VXNlci5pZCA9PSBwYXJzZUludChkYXRhLnVzZXJJZClcbiAgICAgICAgJG5vdGlmaWNhdGlvbignTmV3IG1lc3NhZ2UhJywge1xuICAgICAgICAgIGJvZHk6IG5ld1JvdXRlTWVzc2FnZSxcbiAgICAgICAgICBpY29uOiByZWRUcnVja0ljb24sXG4gICAgICAgICAgdmlicmF0ZTogWzIwMCwgMTAwLCAyMDBdLFxuICAgICAgICB9KVxuICAgIClcblxuICAgIHJldHVyblxuIiwiY2hlY2tib3hGaWVsZCA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJyxcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBsYWJlbDogJz1sYWJlbCcsXG4gICAgICBhdHRyQ2xhc3M6ICc9P2F0dHJDbGFzcycsXG4gICAgICBuZ0NoZWNrZWQ6ICc9P25nQ2hlY2tlZCcsXG4gICAgICBtb2RlbDogJz1tb2RlbCcsXG4gICAgfSxcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBpZiBzY29wZS5tb2RlbCA9PSAnMSdcbiAgICAgICAgc2NvcGUubW9kZWwgPSB0cnVlXG4gICAgICBlbHNlIGlmIHNjb3BlLm1vZGVsID09ICcwJ1xuICAgICAgICBzY29wZS5tb2RlbCA9IGZhbHNlXG5cbiAgICAgIHJldHVyblxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdjaGVja2JveEZpZWxkJywgY2hlY2tib3hGaWVsZFxuIiwiZGF0ZXRpbWVwaWNrZXIgPSAoJHRpbWVvdXQpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2RhdGV0aW1lcGlja2VyLmh0bWwnLFxuICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICBzY29wZToge1xuICAgICAgbGFiZWw6IFwiPT9sYWJlbFwiLFxuICAgIH0sXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBuZ01vZGVsKSAtPlxuICAgICAgc2NvcGUub3BlbiA9ICgpIC0+XG4gICAgICAgIHNjb3BlLmRhdGVfb3BlbmVkID0gdHJ1ZVxuXG4gICAgICAkdGltZW91dChcbiAgICAgICAgKCgpIC0+XG4gICAgICAgICAgc2NvcGUubW9kZWwgPSBEYXRlLnBhcnNlKG5nTW9kZWwuJHZpZXdWYWx1ZSlcbiAgICAgICAgKSwgNDAwXG4gICAgICApXG5cbiAgICAgIHNjb3BlLnNlbGVjdERhdGUgPSAoKG1vZGVsKSAtPlxuICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobW9kZWwpXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2RhdGV0aW1lcGlja2VyJywgZGF0ZXRpbWVwaWNrZXJcbiIsImRlbGV0ZUF2YXRhciA9ICgkdGltZW91dCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvZGVsZXRlX2F2YXRhci5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgcmVtb3ZlQXZhdGFyOiAnPW5nTW9kZWwnLFxuICAgICAgZmlsZTogXCI9ZmlsZVwiLFxuICAgIH0sXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdpbWdOYW1lJywgKHZhbHVlKSAtPlxuICAgICAgICBzY29wZS5pbWdOYW1lID0gdmFsdWVcblxuICAgICAgICByZXR1cm5cblxuICAgICAgc2NvcGUucmVtb3ZlID0gKCkgLT5cbiAgICAgICAgJHRpbWVvdXQoKCkgLT5cbiAgICAgICAgICBzY29wZS5pbWdOYW1lID0gJ2ltYWdlcy9kZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgIClcblxuICAgICAgICBpZiBzY29wZS5maWxlICE9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICAgc2NvcGUucmVtb3ZlQXZhdGFyID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdkZWxldGVBdmF0YXInLCBkZWxldGVBdmF0YXJcbiIsImZpbGVGaWVsZCA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvZmlsZV9maWVsZC5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgYXR0cklkOiAnPScsXG4gICAgICBuZ01vZGVsOiAnPW5nTW9kZWwnLFxuICAgICAgcmVtb3ZlQXZhdGFyOiAnPT9yZW1vdmVkQXZhdGFyJyxcbiAgICB9LFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIGVsZW1lbnQuYmluZCAnY2hhbmdlJywgKGNoYW5nZUV2ZW50KSAtPlxuICAgICAgICBzY29wZS5uZ01vZGVsID0gZXZlbnQudGFyZ2V0LmZpbGVzXG4gICAgICAgIHNjb3BlLnJlbW92ZUF2YXRhciA9IGZhbHNlICMgZm9yIGRlbGV0ZV9hdmF0YXIgZGlyZWN0aXZlXG4gICAgICAgIGZpbGVzID0gZXZlbnQudGFyZ2V0LmZpbGVzXG4gICAgICAgIGZpbGVOYW1lID0gZmlsZXNbMF0ubmFtZVxuXG4gICAgICAgIGVsZW1lbnRbMF1cbiAgICAgICAgICAucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT10ZXh0XScpXG4gICAgICAgICAgLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBmaWxlTmFtZSlcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnZmlsZUZpZWxkJywgZmlsZUZpZWxkXG4iLCJwYWdpbmF0aW9uID0gKCRodHRwKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhZ2luYXRpb24uaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIHBhZ2lBcnI6ICc9JyxcbiAgICAgIGl0ZW1zOiAnPScsXG4gICAgICBwYWdpQXBpVXJsOiAnPScsXG4gICAgfSxcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBzY29wZS4kd2F0Y2ggKCgpIC0+XG4gICAgICAgIHNjb3BlLnBhZ2lBcnJcbiAgICAgICksICgobmV3VmFsdWUsIG9sZFZhbHVlKSAtPlxuICAgICAgICBpZiAhYW5ndWxhci5lcXVhbHMob2xkVmFsdWUsIG5ld1ZhbHVlKVxuICAgICAgICAgIHNjb3BlLnBhZ2lBcnIgPSBuZXdWYWx1ZVxuICAgICAgICAgIHNjb3BlLnRvdGFsUGFnZXMgPSBzY29wZS5wYWdpQXJyLmxhc3RfcGFnZVxuICAgICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gc2NvcGUucGFnaUFyci5jdXJyZW50X3BhZ2VcbiAgICAgICAgICBzY29wZS50b3RhbCA9IHNjb3BlLnBhZ2lBcnIudG90YWxcbiAgICAgICAgICBzY29wZS5wZXJQYWdlID0gc2NvcGUucGFnaUFyci5wZXJfcGFnZVxuXG4gICAgICAgICAgIyBQYWdpbmF0aW9uIFJhbmdlXG4gICAgICAgICAgc2NvcGUucGFpbmF0aW9uUmFuZ2Uoc2NvcGUudG90YWxQYWdlcylcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIHRydWVcblxuICAgICAgc2NvcGUuZ2V0UG9zdHMgPSAocGFnZU51bWJlcikgLT5cbiAgICAgICAgaWYgcGFnZU51bWJlciA9PSB1bmRlZmluZWRcbiAgICAgICAgICBwYWdlTnVtYmVyID0gJzEnXG5cbiAgICAgICAgJGh0dHAuZ2V0KHNjb3BlLnBhZ2lBcGlVcmwrJz9wYWdlPScgKyBwYWdlTnVtYmVyKS5zdWNjZXNzIChyZXNwb25zZSkgLT5cbiAgICAgICAgICBzY29wZS5pdGVtcyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICBzY29wZS50b3RhbFBhZ2VzID0gcmVzcG9uc2UubGFzdF9wYWdlXG4gICAgICAgICAgc2NvcGUuY3VycmVudFBhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2VcblxuICAgICAgICAgICMgUGFnaW5hdGlvbiBSYW5nZVxuICAgICAgICAgIHNjb3BlLnBhaW5hdGlvblJhbmdlKHNjb3BlLnRvdGFsUGFnZXMpXG5cbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICByZXR1cm5cblxuICAgICAgc2NvcGUucGFpbmF0aW9uUmFuZ2UgPSAodG90YWxQYWdlcykgLT5cbiAgICAgICAgcGFnZXMgPSBbXVxuICAgICAgICBpID0gMVxuXG4gICAgICAgIHdoaWxlIGkgPD0gdG90YWxQYWdlc1xuICAgICAgICAgIHBhZ2VzLnB1c2ggaVxuICAgICAgICAgIGkrK1xuXG4gICAgICAgIHNjb3BlLnJhbmdlID0gcGFnZXNcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAncGFnaW5hdGlvbicsIHBhZ2luYXRpb25cbiIsInJhZGlvRmllbGQgPSAoJGh0dHApIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJyxcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL3JhZGlvX2ZpZWxkLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBuZ01vZGVsOiBcIj1uZ01vZGVsXCIsXG4gICAgICBsYWJlbDogJz1sYWJlbCcsXG4gICAgICBhdHRyTmFtZTogJz1hdHRyTmFtZScsXG4gICAgICBhdHRyVmFsdWU6ICc9YXR0clZhbHVlJyxcbiAgICAgIG5nQ2hlY2tlZDogJz0/bmdDaGVja2VkJyxcbiAgICB9LFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIHNjb3BlLm5nTW9kZWwgPSBzY29wZS5hdHRyVmFsdWVcblxuICAgICAgZWxlbWVudC5iaW5kKCdjaGFuZ2UnLCAoKSAtPlxuICAgICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUuYXR0clZhbHVlXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ3JhZGlvRmllbGQnLCByYWRpb0ZpZWxkXG4iLCJ0aW1lcGlja2VyID0gKCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvdGltZXBpY2tlci5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgbW9kZWw6IFwiPW5nTW9kZWxcIixcbiAgICAgIGxhYmVsOiBcIj0/bGFiZWxcIixcbiAgICAgIGF0dHJOYW1lOiBcIkBcIixcbiAgICB9LFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIHNjb3BlLmhzdGVwID0gMVxuICAgICAgc2NvcGUubXN0ZXAgPSA1XG4gICAgICBzY29wZS5pc21lcmlkaWFuID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICd0aW1lcGlja2VyJywgdGltZXBpY2tlclxuIiwiSW5kZXhNYXBDdHJsID0gKCRodHRwKSAtPlxuICB2bSA9IHRoaXNcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnXG4gIHZtLm1hcmtlcnMgPSBbXVxuXG4gICMgR2V0IHBvaW50cyBKU09OXG4gICRodHRwKFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL2FwaS9tYXAnKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhXG5cbiAgICAgICMgSW5pdCBtYXBcbiAgICAgIGluaXRNYXAoKVxuXG4gICAgICByZXR1cm5cbiAgKVxuXG4gIGluaXRNYXAgPSAoKSAtPlxuICAgIG1hcE9wdGlvbnMgPSB7XG4gICAgICB6b29tOiAxMixcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczoge1xuICAgICAgICBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfQk9UVE9NLFxuICAgICAgfVxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTA3MzUwOSwgLTAuMTI3NzU4MyksXG4gICAgICBzdHlsZXM6IHZtLnN0eWxlc1xuICAgIH1cblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2VcblxuICAgICMgU2V0IGxvY2F0aW9uc1xuICAgIGFuZ3VsYXIuZm9yRWFjaCggdm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiICsgYWRkcmVzcyArXG4gICAgICAgIFwiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleVxuICAgICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgcmVxLm9ubG9hZCA9ICgpIC0+XG4gICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKVxuICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICBwb3NpdGlvbiA9IHJlc3BvbnNlLnJlc3VsdHNbMF0uZ2VvbWV0cnlcblxuICAgICAgICAgIGlmIHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMFxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcblxuICAgICAgICAgICAgIyBwb3B1cFxuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZylcblxuICAgICAgICAgICMgc2VsZWN0IGljb25zIGJ5IHN0YXR1cyAoZ3JlZW4gb3IgcmVkKVxuICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICBpY29uOiB2bS5iYWxvb25OYW1lLFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgIClcblxuICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAoKSAtPlxuICAgICAgICAgICAgaWYgcHJldkluZm9XaW5kb3dcbiAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcblxuICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5nZXRQb3NpdGlvbigpKSAjIGFuaW1hdGUgbW92ZSBiZXR3ZWVuIG1hcmtlcnNcbiAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbiBtYXAsIG1hcmtlclxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICApXG5cbiAgICAgICAgICAjIENsaWNrIGJ5IGVtcHR5IG1hcCBhcmVhXG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAoKSAtPlxuICAgICAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIClcblxuICAgICAgICAgICMgQWRkIG5ldyBtYXJrZXIgdG8gYXJyYXkgZm9yIG91dHNpZGUgbWFwIGxpbmtzIC1cbiAgICAgICAgICAjIC0gKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICB2bS5tYXJrZXJzLnB1c2gobWFya2VyKVxuXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpXG4gICAgICByZXEuc2VuZCgpXG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uc3R5bGVzID0gW1xuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd3YXRlcicsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5JyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDI5IH0sXG4gICAgICAgIHsgJ3dlaWdodCc6IDAuMiB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuYXJ0ZXJpYWwnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOCB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pLnBhcmsnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAndmlzaWJpbGl0eSc6ICdvbicgfSxcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfSxcbiAgICAgICAgeyAnY29sb3InOiAnIzMzMzMzMycgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogNDAgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMuaWNvbicsXG4gICAgICAnc3R5bGVycyc6IFsgeyAndmlzaWJpbGl0eSc6ICdvZmYnIH0gXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjJmMmYyJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH0sXG4gICAgICAgIHsgJ3dlaWdodCc6IDEuMiB9LFxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4TWFwQ3RybCcsIEluZGV4TWFwQ3RybClcbiIsIkluZGV4SG9tZUN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gICMgUm91dGVzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvaG9tZSdcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuXG4gICMgTWFwXG4gIGFwaUtleSA9ICdhMzAzZDNhNDRhMDFjOWY4YTVjYjAxMDdiMDMzZWZiZSdcbiAgdm0ubWFya2VycyA9IFtdXG5cbiAgIyMjICBST1VURVMgICMjI1xuICBpZiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJfZ3JvdXAgPT0gJ2FkbWluJ1xuICAgICRodHRwLmdldCgnL2FwaS9ob21lJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAgIHZtLnJvdXRlcyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgICAgcmV0dXJuXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gICMjIyAgTUFQICAjIyNcbiAgIyBHZXQgcG9pbnRzIEpTT05cbiAgJGh0dHAoXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvYXBpL2hvbWUvZ2V0cG9pbnRzJykudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YVxuICAgICAgaW5pdE1hcCgpXG5cbiAgICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpXG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnJvdXRlcyA9IG9yZGVyQnkodm0ucm91dGVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICBpbml0TWFwID0gKCkgLT5cbiAgICBtYXBPcHRpb25zID0ge1xuICAgICAgem9vbTogMTIsXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG4gICAgICB6b29tQ29udHJvbE9wdGlvbnM6IHtcbiAgICAgICAgcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTSxcbiAgICAgIH0sXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDczNTA5LCAtMC4xMjc3NTgzKSxcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzLFxuICAgIH1cblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2VcblxuICAgICMgU2V0IGxvY2F0aW9uc1xuICAgIGFuZ3VsYXIuZm9yRWFjaCggdm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiICsgYWRkcmVzcyArXG4gICAgICAgIFwiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleTtcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwKVxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcblxuICAgICAgICAgICAgIyBwb3B1cFxuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZylcblxuICAgICAgICAgICAgIyBzZWxlY3QgaWNvbnMgYnkgc3RhdHVzIChncmVlbiBvciByZWQpXG4gICAgICAgICAgICBpZiBwYXJzZUludCB2YWx1ZS5zdGF0dXNcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgaWNvbjogdm0uYmFsb29uTmFtZSxcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IG90aGVyIG1hcmtlclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAoKSAtPlxuICAgICAgICAgICAgICBpZiBwcmV2SW5mb1dpbmRvd1xuICAgICAgICAgICAgICAgIHByZXZJbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5nZXRQb3NpdGlvbigpKSAjIGFuaW1hdGUgbW92ZSBiZXR3ZWVuIG1hcmtlcnNcbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuIG1hcCwgbWFya2VyXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgZW1wdHkgbWFwIGFyZWFcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgKCkgLT5cbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQWRkIG5ldyBtYXJrZXIgdG8gYXJyYXkgZm9yIG91dHNpZGUgbWFwIGxpbmtzIC1cbiAgICAgICAgICAgICMgLShvcmRlcmVkIGJ5IGlkIGluIGJhY2tlbmQpXG4gICAgICAgICAgICB2bS5tYXJrZXJzLnB1c2gobWFya2VyKVxuXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpXG4gICAgICByZXEuc2VuZCgpXG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uc3R5bGVzID0gW1xuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd3YXRlcicsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCcsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyOSB9LFxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmFydGVyaWFsJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTggfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9LFxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pLnBhcmsnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2RlZGVkZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAndmlzaWJpbGl0eSc6ICdvbicgfVxuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnc2F0dXJhdGlvbic6IDM2IH1cbiAgICAgICAgeyAnY29sb3InOiAnIzMzMzMzMycgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMuaWNvbidcbiAgICAgICdzdHlsZXJzJzogWyB7ICd2aXNpYmlsaXR5JzogJ29mZicgfSBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd0cmFuc2l0J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmMmYyZjInIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMS4yIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICAjIEdvIHRvIHBvaW50IGFmdGVyIGNsaWNrIG91dHNpZGUgbWFwIGxpbmtcbiAgdm0uZ29Ub1BvaW50ID0gKGlkKSAtPlxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodm0ubWFya2Vyc1tpZF0sICdjbGljaycpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleEhvbWVDdHJsJywgSW5kZXhIb21lQ3RybClcbiIsIkNyZWF0ZVJvdXRlQ3RybCA9ICgkaHR0cCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0ucG9pbnRGb3JtcyA9IFtdXG5cbiAgJGh0dHAucG9zdCgnL2FwaS9yb3V0ZXMvZ2V0VXNlcnNBbmRTdG9yZXMnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLmNyZWF0ZVJvdXRlID0gKCkgLT5cbiAgICB2bS5yb3V0ZSA9IHtcbiAgICAgIHVzZXJfaWQ6IHZtLnVzZXJfaWQsXG4gICAgICBkYXRlOiB2bS5kYXRlLFxuICAgICAgcG9pbnRzOiB2bS5wb2ludEZvcm1zLFxuICAgIH1cblxuICAgICRodHRwLnBvc3QoJy9hcGkvcm91dGVzJywgdm0ucm91dGUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG5cbiAgICAgICAgJHN0YXRlLmdvICdyb3V0ZXMnLCB7IGZsYXNoU3VjY2VzczogJ05ldyByb3V0ZSBoYXMgYmVlbiBhZGRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpXG5cbiAgICByZXR1cm5cblxuICB2bS5hZGRQb2ludCA9ICgpIC0+XG4gICAgdm0ucG9pbnRGb3Jtcy5wdXNoKHt9KVxuXG4gIHZtLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgIHZtLnBvaW50Rm9ybXMuc3BsaWNlKGluZGV4LCAxKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlUm91dGVDdHJsJywgQ3JlYXRlUm91dGVDdHJsKVxuIiwiRWRpdFJvdXRlQ3RybCA9ICgkaHR0cCwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5pZCA9ICRzdGF0ZVBhcmFtcy5pZFxuICB2bS5jb3VudCA9IDFcblxuICAkaHR0cC5nZXQoJy9hcGkvcm91dGVzL2VkaXQvJysgdm0uaWQpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ub2JqID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgICByZXR1cm5cbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLnVwZGF0ZSA9ICgpIC0+XG4gICAgcm91dGUgPSB7XG4gICAgICB1c2VyX2lkOiB2bS5vYmoudXNlcl9pZCxcbiAgICAgIGRhdGU6IHZtLm9iai5kYXRlLFxuICAgICAgcG9pbnRzOiB2bS5vYmoucG9pbnRzLFxuICAgIH1cblxuICAgICRodHRwLnBhdGNoKCcvYXBpL3JvdXRlcy8nICsgdm0uaWQsIHJvdXRlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnUm91dGUgVXBkYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpXG5cbiAgdm0uYWRkUG9pbnQgPSAoKSAtPlxuICAgIHZtLm9iai5wb2ludHMucHVzaCh7XG4gICAgICBpZDogdm0uY291bnQgKyAnX25ldydcbiAgICB9KVxuXG4gICAgdm0uY291bnQrK1xuXG4gICAgcmV0dXJuXG5cbiAgdm0ucmVtb3ZlUG9pbnQgPSAoaW5kZXgpIC0+XG4gICAgdm0ub2JqLnBvaW50cy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdFZGl0Um91dGVDdHJsJywgRWRpdFJvdXRlQ3RybClcbiIsIkluZGV4Um91dGVDdHJsID0gKCRodHRwLCAkZmlsdGVyLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL3JvdXRlcydcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuXG4gICMgRmxhc2ggZnJvbSBvdGhlcnMgcGFnZXNcbiAgaWYgJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuICAgIHZtLmZsYXNoU3VjY2VzcyA9ICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcblxuICAkaHR0cC5nZXQoJy9hcGkvcm91dGVzJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0ucm91dGVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpXG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnJvdXRlcyA9IG9yZGVyQnkodm0ucm91dGVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICB2bS5kZWxldGVSb3V0ZSA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9yb3V0ZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0ucm91dGVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1JvdXRlIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleFJvdXRlQ3RybCcsIEluZGV4Um91dGVDdHJsKVxuIiwiU2hvd1JvdXRlQ3RybCA9ICgkaHR0cCwgJHN0YXRlUGFyYW1zLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5pZCA9ICRzdGF0ZVBhcmFtcy5pZFxuXG4gICMgTWFwXG4gIGFwaUtleSA9ICdhMzAzZDNhNDRhMDFjOWY4YTVjYjAxMDdiMDMzZWZiZSdcbiAgdm0ubWFya2VycyA9IFtdXG5cbiAgIyBHZXQgcG9pbnRzXG4gICRodHRwLmdldCgnL2FwaS9yb3V0ZXMvJyArIHZtLmlkKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnJvdXRlID0gcmVzcG9uc2UuZGF0YS5yb3V0ZVxuICAgICAgdm0uc3RvcmVzID0gcmVzcG9uc2UuZGF0YS5zdG9yZXNcbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGEucG9pbnRzXG4gICAgICB2bS5yb3V0ZS5kYXRlID0gbW9tZW50KG5ldyBEYXRlKHZtLnJvdXRlLmRhdGUpKS5mb3JtYXQoJ0RELk1NLllZWVknKVxuXG4gICAgICAjIEluaXQgbWFwXG4gICAgICBpbml0TWFwKClcblxuICAgICAgcmV0dXJuXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuXG4gIHZtLmRlbGV0ZVJvdXRlID0gKGlkKSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvcm91dGVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnUm91dGUgRGVsZXRlZCEnIH1cblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuXG4gICMgV2hlbiB0aGUgd2luZG93IGhhcyBmaW5pc2hlZCBsb2FkaW5nIGNyZWF0ZSBvdXIgZ29vZ2xlIG1hcCBiZWxvd1xuICBpbml0TWFwID0gKCkgLT5cbiAgICAjIEJhc2ljIG9wdGlvbnMgZm9yIGEgc2ltcGxlIEdvb2dsZSBNYXBcbiAgICBtYXBPcHRpb25zID0ge1xuICAgICAgem9vbTogMTIsXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG4gICAgICB6b29tQ29udHJvbE9wdGlvbnM6IHtcbiAgICAgICAgcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTSxcbiAgICAgIH0sXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDAxNTIsIC0wLjEyNjIzNiksXG4gICAgICBzdHlsZXM6dm0uc3R5bGVzLFxuICAgIH1cblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm91dGUtbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2VcblxuICAgICMgU2V0IGxvY2F0aW9uc1xuICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5wb2ludHMsICh2YWx1ZSwga2V5KSAtPlxuICAgICAgYWRkcmVzcyA9IHZhbHVlLnN0b3JlLmFkZHJlc3NcbiAgICAgICMgR2VvY29kZSBBZGRyZXNzZXMgYnkgYWRkcmVzcyBuYW1lXG4gICAgICBhcGlVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW5jYWdlZGF0YS5jb20vZ2VvY29kZS92MS9qc29uP3E9XCIgKyBhZGRyZXNzICtcbiAgICAgICAgXCImcHJldHR5PTEma2V5PVwiICsgYXBpS2V5XG4gICAgICByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICByZXEub25sb2FkID0gKCkgLT5cbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHBvc2l0aW9uID0gcmVzcG9uc2UucmVzdWx0c1swXS5nZW9tZXRyeVxuXG4gICAgICAgICAgaWYgcmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwXG4gICAgICAgICAgICBjb250ZW50U3RyaW5nID1cbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJtYXJrZXItY29udGVudFwiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdBZGRyZXNzOjwvc3Bhbj4gJyArIHZhbHVlLnN0b3JlLmFkZHJlc3MgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ1Bob25lOjwvc3Bhbj4gJyArIHZhbHVlLnN0b3JlLnBob25lICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgIyBwb3B1cFxuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZylcblxuICAgICAgICAgICAgIyBzZWxlY3QgaWNvbnMgYnkgc3RhdHVzIChncmVlbiBvciByZWQpXG4gICAgICAgICAgICBpZiBwYXJzZUludCB2YWx1ZS5zdGF0dXNcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgaWNvbjogdm0uYmFsb29uTmFtZSxcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IG90aGVyIG1hcmtlclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAoKSAtPlxuICAgICAgICAgICAgICBpZiBwcmV2SW5mb1dpbmRvd1xuICAgICAgICAgICAgICAgIHByZXZJbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5nZXRQb3NpdGlvbigpKSAjIGFuaW1hdGUgbW92ZSBiZXR3ZWVuIG1hcmtlcnNcbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuIG1hcCwgbWFya2VyXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgZW1wdHkgbWFwIGFyZWFcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgKCkgLT5cbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQWRkIG5ldyBtYXJrZXIgdG8gYXJyYXkgZm9yIG91dHNpZGUgbWFwIGxpbmtzIC1cbiAgICAgICAgICAgICMgLSAob3JkZXJlZCBieSBpZCBpbiBiYWNrZW5kKVxuICAgICAgICAgICAgdm0ubWFya2Vycy5wdXNoKG1hcmtlcilcblxuICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgYXBpVXJsLCB0cnVlKVxuICAgICAgcmVxLnNlbmQoKVxuICAgIClcblxuICAgIHJldHVyblxuXG4gIHZtLnN0eWxlcyA9IFtcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnd2F0ZXInLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZTllOWU5JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2xhbmRzY2FwZScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5JyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyOSB9LFxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmFydGVyaWFsJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTggfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaS5wYXJrJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2RlZGVkZScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3Zpc2liaWxpdHknOiAnb24nIH0sXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnc2F0dXJhdGlvbic6IDM2IH0sXG4gICAgICAgIHsgJ2NvbG9yJzogJyMzMzMzMzMnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLmljb24nLFxuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjJmMmYyJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9LFxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfSxcbiAgICAgICAgeyAnd2VpZ2h0JzogMS4yIH0sXG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgIyBHbyB0byBwb2ludCBhZnRlciBjbGljayBvdXRzaWRlIG1hcCBsaW5rXG4gIHZtLmdvVG9Qb2ludCA9IChpZCkgLT5cbiAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKHZtLm1hcmtlcnNbaWRdLCAnY2xpY2snKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1JvdXRlQ3RybCcsIFNob3dSb3V0ZUN0cmwpXG4iLCJFZGl0UHJvZmlsZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSwgVXBsb2FkLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICAkaHR0cC5nZXQoJy9hcGkvcHJvZmlsZS9lZGl0JylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS51c2VyID0gcmVzcG9uc2UuZGF0YVxuICAgICAgdm0udXNlci5yZW1vdmVfYXZhdGFyID0gZmFsc2VcblxuICAgICAgIyBmb3IgZGVsZXRlX2F2YXRhciBkaXJlY3RpdmVcbiAgICAgIHZtLmF2YXRhciA9IHZtLm1ha2VBdmF0YXJMaW5rKHZtLnVzZXIuYXZhdGFyKVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBhdmF0YXIgPSB2bS51c2VyLmF2YXRhclxuXG4gICAgaWYgdm0udXNlci5hdmF0YXIgPT0gJy9pbWFnZXMvZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0udXNlci5hdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJyAjIHRvZG8gaHogbWF5IGJlIGZvciBkZWxldGVcbiAgICAgIGF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG5cbiAgICB2bS5kYXRhIHtcbiAgICAgIGF2YXRhcjogYXZhdGFyLFxuICAgICAgcmVtb3ZlX2F2YXRhcjogdm0udXNlci5yZW1vdmVfYXZhdGFyLFxuICAgICAgbmFtZTogdm0udXNlci5uYW1lLFxuICAgICAgbGFzdF9uYW1lOiB2bS51c2VyLmxhc3RfbmFtZSxcbiAgICAgIGluaXRpYWxzOiB2bS51c2VyLmluaXRpYWxzLFxuICAgICAgYmRheTogdm0udXNlci5iZGF5LFxuICAgICAgZW1haWw6IHZtLnVzZXIuZW1haWwsXG4gICAgICBwaG9uZTogdm0udXNlci5waG9uZSxcbiAgICAgIGpvYl90aXRsZTogdm0udXNlci5qb2JfdGl0bGUsXG4gICAgICBjb3VudHJ5OiB2bS51c2VyLmNvdW50cnksXG4gICAgICBjaXR5OiB2bS51c2VyLmNpdHksXG4gICAgfVxuXG4gICAgVXBsb2FkLnVwbG9hZChcbiAgICAgIHVybDogJy9hcGkvcHJvZmlsZS8nICsgdm0udXNlci5pZCxcbiAgICAgIG1ldGhvZDogJ1Bvc3QnLFxuICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICApLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgIGZpbGVOYW1lID0gcmVzcG9uc2UuZGF0YVxuICAgICAgc3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJylcbiAgICAgIHN0b3JhZ2UgPSBKU09OLnBhcnNlKHN0b3JhZ2UpXG5cbiAgICAgICMgRGVmYXVsdCBhdmF0YXJcbiAgICAgIGlmICh0eXBlb2YgZmlsZU5hbWUgPT0gJ2Jvb2xlYW4nICYmIHZtLnVzZXIucmVtb3ZlX2F2YXRhcilcbiAgICAgICAgc3RvcmFnZS5hdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9ICAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgIyBVcGRhdGUgc3RvcmFnZVxuICAgICAgZWxzZSBpZiAodHlwZW9mIGZpbGVOYW1lID09ICdzdHJpbmcnICYmICF2bS51c2VyLnJlbW92ZV9hdmF0YXIpXG4gICAgICAgIHN0b3JhZ2UuYXZhdGFyID0gZmlsZU5hbWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSB2bS5tYWtlQXZhdGFyTGluayhzdG9yYWdlLmF2YXRhcilcbiAgICAgICAgc3RvcmFnZS5hdmF0YXIgPSBmaWxlTmFtZVxuXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2UpKVxuXG4gICAgICAkc3RhdGUuZ28gJ3Byb2ZpbGUnLCB7IGZsYXNoU3VjY2VzczogJ1Byb2ZpbGUgdXBkYXRlZCEnIH1cbiAgICApLCAoKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcilcblxuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gIHZtLm1ha2VBdmF0YXJMaW5rID0gKGF2YXRhck5hbWUpIC0+XG4gICAgaWYgYXZhdGFyTmFtZSA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgYXZhdGFyTmFtZSA9ICcvaW1hZ2VzLycgKyBhdmF0YXJOYW1lXG4gICAgZWxzZVxuICAgICAgYXZhdGFyTmFtZSA9ICcvdXBsb2Fkcy9hdmF0YXJzLycgKyBhdmF0YXJOYW1lXG5cbiAgICByZXR1cm4gYXZhdGFyTmFtZVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFByb2ZpbGVDdHJsJywgRWRpdFByb2ZpbGVDdHJsKVxuIiwiSW5kZXhQcm9maWxlQ3RybCA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3Byb2ZpbGUnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXJcbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGEucG9pbnRzXG5cbiAgICAgIGlmIHZtLnVzZXIuYXZhdGFyID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgIHZtLnVzZXIuYXZhdGFyID0gJy9pbWFnZXMvJyArIHZtLnVzZXIuYXZhdGFyXG4gICAgICBlbHNlXG4gICAgICAgIHZtLnVzZXIuYXZhdGFyID0gJ3VwbG9hZHMvYXZhdGFycy8nICsgdm0udXNlci5hdmF0YXJcblxuICAgICAgdm0udXNlci5iZGF5ID0gbW9tZW50KG5ldyBEYXRlKHZtLnVzZXIuYmRheSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICB2bS51cGRhdGVQb2ludHMgPSAoKSAtPlxuICAgICRodHRwLnB1dCgnL2FwaS9wcm9maWxlL3VwZGF0ZXBvaW50cycsIHZtLnBvaW50cylcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1BvaW50cyB1cGRhdGVkISdcbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4UHJvZmlsZUN0cmwnLCBJbmRleFByb2ZpbGVDdHJsKVxuIiwiQ3JlYXRlU3RvcmVDdHJsID0gKCRzY29wZSwgJGh0dHAsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0uY3JlYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5zdG9yZU5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLm93bmVyTmFtZVxuICAgICAgYWRkcmVzczogdm0uYWRkcmVzc1xuICAgICAgcGhvbmU6IHZtLnBob25lXG4gICAgICBlbWFpbDogdm0uZW1haWxcblxuICAgICRodHRwLnBvc3QoJy9hcGkvc3RvcmVzJywgc3RvcmUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAnc3RvcmVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdOZXcgc3RvcmUgY3JlYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlU3RvcmVDdHJsJywgQ3JlYXRlU3RvcmVDdHJsKVxuIiwiRWRpdFN0b3JlQ3RybCA9ICgkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5kYXRhLm5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLmRhdGEub3duZXJfbmFtZVxuICAgICAgYWRkcmVzczogdm0uZGF0YS5hZGRyZXNzXG4gICAgICBwaG9uZTogdm0uZGF0YS5waG9uZVxuICAgICAgZW1haWw6IHZtLmRhdGEuZW1haWxcblxuICAgICRodHRwLnBhdGNoKCcvYXBpL3N0b3Jlcy8nICsgdm0uaWQsIHN0b3JlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgVXBkYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFN0b3JlQ3RybCcsIEVkaXRTdG9yZUN0cmwpXG4iLCJJbmRleFN0b3JlQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9zdG9yZXMnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uc3RvcmVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJyk7XG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnN0b3JlcyA9IG9yZGVyQnkodm0uc3RvcmVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9zdG9yZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0uc3RvcmVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1N0b3JlIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhTdG9yZUN0cmwnLCBJbmRleFN0b3JlQ3RybClcbiIsIlNob3dTdG9yZUN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAkaHR0cC5nZXQoJ2FwaS9zdG9yZXMvJyt2bS5pZCkudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uZGF0YSA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCdhcGkvc3RvcmVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgZGVsZXRlZCEnIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICApXG5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1N0b3JlQ3RybCcsIFNob3dTdG9yZUN0cmwpIiwiQ29uZmlybUNvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmRhdGEgPVxuICAgIGNvbmZpcm1hdGlvbl9jb2RlOiAkc3RhdGVQYXJhbXMuY29uZmlybWF0aW9uX2NvZGVcblxuICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL2NvbmZpcm0nLCB2bS5kYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAjIFNhdmUgdG9rZW5cbiAgICAkYXV0aC5zZXRUb2tlbihkYXRhLnRva2VuKVxuXG4gICAgIyBTYXZlIHVzZXIgaW4gbG9jYWxTdG9yYWdlXG4gICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3VzZXInLCB1c2VyXG4gICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZVxuICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBkYXRhXG5cbiAgICAkc3RhdGUuZ28gJy8nXG4gICkuZXJyb3IgKGRhdGEsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgJHN0YXRlLmdvICdzaWduX2luJ1xuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NvbmZpcm1Db250cm9sbGVyJywgQ29uZmlybUNvbnRyb2xsZXIpXG5cbiIsIkZvcmdvdFBhc3N3b3JkQ29udHJvbGxlciA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVzdG9yZVBhc3N3b3JkID0gKCktPlxuICAgIHZtLnNwaW5uZXJEb25lID0gdHJ1ZVxuICAgIGRhdGEgPVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG5cbiAgICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL3NlbmRfcmVzZXRfY29kZScsIGRhdGEpLnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgICAgaWYoZGF0YSlcbiAgICAgICAgdm0uc3VjY2Vzc1NlbmRpbmdFbWFpbCA9IHRydWVcbiAgICApLmVycm9yIChlcnJvciwgc3RhdHVzLCBoZWFkZXIsIGNvbmZpZykgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRm9yZ290UGFzc3dvcmRDb250cm9sbGVyJywgRm9yZ290UGFzc3dvcmRDb250cm9sbGVyKVxuXG4iLCJSZXNldFBhc3N3b3JkQ29udHJvbGxlciA9ICgkYXV0aCwgJHN0YXRlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0ubWlubGVuZ3RoID0gOFxuXG4gIHZtLnJlc3RvcmVQYXNzd29yZCA9IChmb3JtKSAtPlxuICAgIGRhdGEgPSB7XG4gICAgICByZXNldF9wYXNzd29yZF9jb2RlOiAkc3RhdGVQYXJhbXMucmVzZXRfcGFzc3dvcmRfY29kZVxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG4gICAgICBwYXNzd29yZF9jb25maXJtYXRpb246IHZtLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuICAgIH1cblxuICAgICRodHRwLnBvc3QoJ2FwaS9hdXRoZW50aWNhdGUvcmVzZXRfcGFzc3dvcmQnLCBkYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAgIGlmKGRhdGEpXG4gICAgICAgIHZtLnN1Y2Nlc3NSZXN0b3JlUGFzc3dvcmQgPSB0cnVlXG4gICAgKS5lcnJvciAoZXJyb3IsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0UGFzc3dvcmRDb250cm9sbGVyJywgUmVzZXRQYXNzd29yZENvbnRyb2xsZXIpXG5cbiIsIlNpZ25JbkNvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmxvZ2luID0gKCkgLT5cbiAgICBjcmVkZW50aWFscyA9XG4gICAgICBlbWFpbDogdm0uZW1haWxcbiAgICAgIHBhc3N3b3JkOiB2bS5wYXNzd29yZFxuXG4gICAgJGF1dGgubG9naW4oY3JlZGVudGlhbHMpLnRoZW4gKC0+XG4gICAgICAjIFJldHVybiBhbiAkaHR0cCByZXF1ZXN0IGZvciB0aGUgbm93IGF1dGhlbnRpY2F0ZWRcbiAgICAgICMgdXNlciBzbyB0aGF0IHdlIGNhbiBmbGF0dGVuIHRoZSBwcm9taXNlIGNoYWluXG4gICAgICAkaHR0cC5nZXQoJ2FwaS9hdXRoZW50aWNhdGUvZ2V0X3VzZXInKS50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmRhdGEudXNlcilcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3VzZXInLCB1c2VyXG4gICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGEudXNlclxuXG4gICAgICAgICRzdGF0ZS5nbyAnLydcblxuICAgICAgICByZXR1cm5cblxuICAgICksIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpO1xuXG4gICAgICByZXR1cm5cblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaWduSW5Db250cm9sbGVyJywgU2lnbkluQ29udHJvbGxlcilcbiIsIlNpZ25VcENvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVnaXN0ZXIgPSAoKS0+XG4gICAgdm0uc3Bpbm5lckRvbmUgPSB0cnVlXG4gICAgaWYgdm0udXNlclxuICAgICAgY3JlZGVudGlhbHMgPVxuICAgICAgICBuYW1lOiB2bS51c2VyLm5hbWVcbiAgICAgICAgZW1haWw6IHZtLnVzZXIuZW1haWxcbiAgICAgICAgcGFzc3dvcmQ6IHZtLnVzZXIucGFzc3dvcmRcbiAgICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiB2bS51c2VyLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuXG4gICAgJGF1dGguc2lnbnVwKGNyZWRlbnRpYWxzKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICAgICRzdGF0ZS5nbyAnc2lnbl91cF9zdWNjZXNzJ1xuICAgICAgcmV0dXJuXG4gICAgKS5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1NpZ25VcENvbnRyb2xsZXInLCBTaWduVXBDb250cm9sbGVyKVxuIiwiVXNlckNvbnRyb2xsZXIgPSAoJGh0dHAsICRzdGF0ZSwgJGF1dGgsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmdldFVzZXJzID0gLT5cbiAgICAjIFRoaXMgcmVxdWVzdCB3aWxsIGhpdCB0aGUgaW5kZXggbWV0aG9kIGluIHRoZSBBdXRoZW50aWNhdGVDb250cm9sbGVyXG4gICAgIyBvbiB0aGUgTGFyYXZlbCBzaWRlIGFuZCB3aWxsIHJldHVybiB0aGUgbGlzdCBvZiB1c2Vyc1xuICAgICRodHRwLmdldCgnYXBpL2F1dGhlbnRpY2F0ZScpLnN1Y2Nlc3MoKHVzZXJzKSAtPlxuICAgICAgdm0udXNlcnMgPSB1c2Vyc1xuICAgICAgcmV0dXJuXG4gICAgKS5lcnJvciAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuICB2bS5sb2dvdXQgPSAtPlxuICAgICRhdXRoLmxvZ291dCgpLnRoZW4gLT5cbiAgICAgICMgUmVtb3ZlIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSAndXNlcidcbiAgICAgICMgRmxpcCBhdXRoZW50aWNhdGVkIHRvIGZhbHNlIHNvIHRoYXQgd2Ugbm8gbG9uZ2VyXG4gICAgICAjIHNob3cgVUkgZWxlbWVudHMgZGVwZW5kYW50IG9uIHRoZSB1c2VyIGJlaW5nIGxvZ2dlZCBpblxuICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICAgICMgUmVtb3ZlIHRoZSBjdXJyZW50IHVzZXIgaW5mbyBmcm9tIHJvb3RzY29wZVxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGxcbiAgICAgICRzdGF0ZS5nbyAnc2lnbl9pbidcblxuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignVXNlckNvbnRyb2xsZXInLCBVc2VyQ29udHJvbGxlcilcbiIsIkNyZWF0ZVVzZXJDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgbG9kYXNoKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXohQCMkJV4mKigpLSs8PkFCQ0RFRkdISUpLTE1OT1AxMjM0NTY3ODkwJ1xuXG4gICRodHRwLmdldCgnL2FwaS91c2Vycy9jcmVhdGUnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLmVudW1zID0gcmVzcG9uc2UuZGF0YVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0uYWRkVXNlciA9ICgpIC0+XG4gICAgdm0uZGF0YSA9XG4gICAgICBuYW1lOiB2bS5uYW1lXG4gICAgICBsYXN0X25hbWU6IHZtLmxhc3RfbmFtZVxuICAgICAgaW5pdGlhbHM6IHZtLmluaXRpYWxzXG4gICAgICBhdmF0YXI6IHZtLmF2YXRhclxuICAgICAgYmRheTogdm0uYmRheVxuICAgICAgam9iX3RpdGxlOiB2bS5qb2JfdGl0bGVcbiAgICAgIHVzZXJfZ3JvdXA6IHZtLnVzZXJfZ3JvdXBcbiAgICAgIGNvdW50cnk6IHZtLmNvdW50cnlcbiAgICAgIGNpdHk6IHZtLmNpdHlcbiAgICAgIHBob25lOiB2bS5waG9uZVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3VzZXJzJ1xuICAgICAgbWV0aG9kOiAnUG9zdCdcbiAgICAgIGRhdGE6IHZtLmRhdGFcbiAgICApLnRoZW4gKChyZXNwKSAtPlxuICAgICAgJHN0YXRlLmdvICd1c2VycycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHVzZXIgaGFzIGJlZW4gYWRkZWQhJyB9XG4gICAgICByZXR1cm5cbiAgICApLCAoKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5nZW5lcmF0ZVBhc3MgPSAoKSAtPlxuICAgIHZtLnBhc3N3b3JkID0gJydcbiAgICBwYXNzTGVuZ3RoID0gbG9kYXNoLnJhbmRvbSg4LDE1KVxuICAgIHggPSAwXG5cbiAgICB3aGlsZSB4IDwgcGFzc0xlbmd0aFxuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZtLmNoYXJzLmxlbmd0aClcbiAgICAgIHZtLnBhc3N3b3JkICs9IHZtLmNoYXJzLmNoYXJBdChpKVxuICAgICAgeCsrXG4gICAgcmV0dXJuIHZtLnBhc3N3b3JkXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlVXNlckN0cmwnLCBDcmVhdGVVc2VyQ3RybClcbiIsIkluZGV4VXNlckN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvdXNlcnMnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCdhcGkvdXNlcnMnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS51c2VycyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpO1xuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS51c2VycyA9IG9yZGVyQnkodm0udXNlcnMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG4gIHZtLmRlbGV0ZVVzZXIgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvdXNlcnMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0udXNlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnVXNlciBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4VXNlckN0cmwnLCBJbmRleFVzZXJDdHJsKVxuIiwiU2hvd1VzZXJDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG4gIHZtLnNldHRpbmdzID1cbiAgICBsaW5lV2lkdGg6IDUsXG4gICAgdHJhY2tDb2xvcjogJyNlOGVmZjAnLFxuICAgIGJhckNvbG9yOiAnIzI3YzI0YycsXG4gICAgc2NhbGVDb2xvcjogZmFsc2UsXG4gICAgY29sb3I6ICcjM2EzZjUxJyxcbiAgICBzaXplOiAxMzQsXG4gICAgbGluZUNhcDogJ2J1dHQnLFxuICAgIHJvdGF0ZTogLTkwLFxuICAgIGFuaW1hdGU6IDEwMDBcblxuICAkaHR0cC5nZXQoJ2FwaS91c2Vycy8nK3ZtLmlkKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgaWYgdm0ub2JqLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0ub2JqLmF2YXRhciA9ICcvaW1hZ2VzLycgKyB2bS5vYmouYXZhdGFyXG4gICAgZWxzZVxuICAgICAgdm0ub2JqLmF2YXRhciA9ICd1cGxvYWRzL2F2YXRhcnMvJyArIHZtLm9iai5hdmF0YXJcbiAgICB2bS5vYmouYmRheSA9IG1vbWVudChuZXcgRGF0ZSh2bS5vYmouYmRheSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1VzZXJDdHJsJywgU2hvd1VzZXJDdHJsKVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
