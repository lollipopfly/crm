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
    vm.data = {
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
    };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJkaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuY29mZmVlIiwiZGlyZWN0aXZlcy9kZWxldGVfYXZhdGFyLmNvZmZlZSIsImRpcmVjdGl2ZXMvZmlsZV9maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3BhZ2luYXRpb24uY29mZmVlIiwiZGlyZWN0aXZlcy9yYWRpb19maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3RpbWVwaWNrZXIuY29mZmVlIiwibW9kdWxlcy9wdXNoZXItbm90aWZpY2F0aW9ucy5jb2ZmZWUiLCJjb250cm9sbGVycy9ob21lL2luZGV4X2hvbWVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9tYXAvaW5kZXhfbWFwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcHJvZmlsZS9lZGl0X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9wcm9maWxlL2luZGV4X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvY3JlYXRlX3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2VkaXRfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvaW5kZXhfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvc2hvd19yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9jcmVhdGVfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvZWRpdF9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9pbmRleF9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9zaG93X3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9jb25maXJtX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9mb3Jnb3RfcGFzc3dvcmRfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2VyL3Jlc2V0X3Bhc3N3b3JkX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9zaWduX2luX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9zaWduX3VwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvY3JlYXRlX3VzZXJfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2Vycy9pbmRleF91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvc2hvd191c2VyX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBRUEsT0FDRSxDQUFDLE1BREgsQ0FDVSxLQURWLEVBQ2lCLENBQ2IseUJBRGEsRUFFYixXQUZhLEVBR2IsWUFIYSxFQUliLGNBSmEsRUFLYixVQUxhLEVBTWIsUUFOYSxFQU9iLGVBUGEsRUFRYixjQVJhLEVBU2IsY0FUYSxDQURqQixDQVdJLENBQUMsTUFYTCxDQVdZLFNBQ1IsY0FEUSxFQUVSLGtCQUZRLEVBR1IsYUFIUSxFQUlSLGlCQUpRO0VBTVIsaUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsSUFBNUI7RUFHQSxhQUFhLENBQUMsUUFBZCxHQUF5QjtFQUN6QixhQUFhLENBQUMsU0FBZCxHQUEwQjtFQUMxQixrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixlQUE3QjtFQUVBLGNBQ0UsQ0FBQyxLQURILENBQ1MsR0FEVCxFQUVJO0lBQUEsR0FBQSxFQUFLLEdBQUw7SUFDQSxXQUFBLEVBQWEsMEJBRGI7SUFFQSxVQUFBLEVBQVksdUJBRlo7R0FGSixDQVFFLENBQUMsS0FSSCxDQVFTLFNBUlQsRUFTSTtJQUFBLEdBQUEsRUFBSyxlQUFMO0lBQ0EsV0FBQSxFQUFhLDRCQURiO0lBRUEsVUFBQSxFQUFZLDBCQUZaO0dBVEosQ0FhRSxDQUFDLEtBYkgsQ0FhUyxTQWJULEVBY0k7SUFBQSxHQUFB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Q0FBQyxNQUFQLEdBQWdCLGtCQUFBLEdBQXFCLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FIOUM7O0lBSUEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFQLEdBQWMsTUFBQSxDQUFXLElBQUEsSUFBQSxDQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBWixDQUFYLENBQTZCLENBQUMsTUFBOUIsQ0FBcUMsWUFBckM7RUFObUIsQ0FBbkMsRUFRRSxTQUFDLEtBQUQ7SUFDQSxFQUFFLENBQUMsS0FBSCxHQUFXLEtBQUssQ0FBQztFQURqQixDQVJGO0FBZGE7O0FBNkJmOztBQUNBLE9BQ0UsQ0FBQyxNQURILENBQ1UsS0FEVixDQUVFLENBQUMsVUFGSCxDQUVjLGNBRmQsRUFFOEIsWUFGOUIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJywgW1xuICAgICdhcHAucHVzaGVyTm90aWZpY2F0aW9ucycsXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3NhdGVsbGl6ZXInLFxuICAgICd1aS5ib290c3RyYXAnLFxuICAgICduZ0xvZGFzaCcsXG4gICAgJ25nTWFzaycsXG4gICAgJ2FuZ3VsYXJNb21lbnQnLFxuICAgICdlYXN5cGllY2hhcnQnLFxuICAgICduZ0ZpbGVVcGxvYWQnLFxuICBdKS5jb25maWcoKFxuICAgICRzdGF0ZVByb3ZpZGVyLFxuICAgICR1cmxSb3V0ZXJQcm92aWRlcixcbiAgICAkYXV0aFByb3ZpZGVyLFxuICAgICRsb2NhdGlvblByb3ZpZGVyXG4gICkgLT5cbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUgdHJ1ZVxuICAgICMgU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICMgcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cbiAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlJ1xuICAgICRhdXRoUHJvdmlkZXIuc2lnbnVwVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL3JlZ2lzdGVyJ1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UgJy91c2VyL3NpZ25faW4nXG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCcvJyxcbiAgICAgICAgdXJsOiAnLydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9wYWdlcy9ob21lLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleEhvbWVDdHJsIGFzIGhvbWUnXG4gICAgICApXG5cbiAgICAgICMgVVNFUlxuICAgICAgLnN0YXRlKCdzaWduX2luJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvc2lnbl9pbidcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25faW4uaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25JbkNvbnRyb2xsZXIgYXMgYXV0aCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc2lnbl91cCcsXG4gICAgICAgIHVybDogJy91c2VyL3NpZ25fdXAnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9zaWduX3VwLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDb250cm9sbGVyIGFzIHJlZ2lzdGVyJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzaWduX3VwX3N1Y2Nlc3MnLFxuICAgICAgICB1cmw6ICcvdXNlci9zaWduX3VwX3N1Y2Nlc3MnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9zaWduX3VwX3N1Y2Nlc3MuaHRtbCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnZm9yZ290X3Bhc3N3b3JkJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvZm9yZ290X3Bhc3N3b3JkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvZm9yZ290X3Bhc3N3b3JkLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGb3Jnb3RQYXNzd29yZENvbnRyb2xsZXIgYXMgZm9yZ290UGFzc3dvcmQnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvcmVzZXRfcGFzc3dvcmQvOnJlc2V0X3Bhc3N3b3JkX2NvZGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9yZXNldF9wYXNzd29yZC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnUmVzZXRQYXNzd29yZENvbnRyb2xsZXIgYXMgcmVzZXRQYXNzd29yZCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnY29uZmlybScsXG4gICAgICAgIHVybDogJy91c2VyL2NvbmZpcm0vOmNvbmZpcm1hdGlvbl9jb2RlJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ29uZmlybUNvbnRyb2xsZXInXG4gICAgICApXG5cbiAgICAgICMgUHJvZmlsZVxuICAgICAgLnN0YXRlKCdwcm9maWxlJyxcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvcHJvZmlsZS9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhQcm9maWxlQ3RybCBhcyBwcm9maWxlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdwcm9maWxlX2VkaXQnLFxuICAgICAgICB1cmw6ICcvcHJvZmlsZS9lZGl0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3Byb2ZpbGUvZWRpdC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRWRpdFByb2ZpbGVDdHJsIGFzIHByb2ZpbGUnXG4gICAgICApXG5cbiAgICAgICMgU3RvcmVzXG4gICAgICAuc3RhdGUoJ3N0b3JlcycsXG4gICAgICAgIHVybDogJy9zdG9yZXMnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFN0b3JlQ3RybCBhcyBzdG9yZXMnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICBmbGFzaFN1Y2Nlc3M6IG51bGxcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc3RvcmVzX2NyZWF0ZScsXG4gICAgICAgIHVybDogJy9zdG9yZXMvY3JlYXRlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9jcmVhdGUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVN0b3JlQ3RybCBhcyBzdG9yZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc3RvcmVzX2VkaXQnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzLzppZC9lZGl0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9lZGl0Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0U3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfc2hvdycsXG4gICAgICAgIHVybDogJy9zdG9yZXMvOmlkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9zaG93Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaG93U3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuXG4gICAgICAjIFVzZXJzXG4gICAgICAuc3RhdGUoJ3VzZXJzJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXJzL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFVzZXJDdHJsIGFzIHVzZXJzJ1xuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgZmxhc2hTdWNjZXNzOiBudWxsXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3VzZXJzX2NyZWF0ZScsXG4gICAgICAgIHVybDogJy91c2Vycy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlcnMvY3JlYXRlLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVVc2VyQ3RybCBhcyB1c2VyJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCd1c2Vyc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLzppZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2Vycy9zaG93Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaG93VXNlckN0cmwgYXMgdXNlcidcbiAgICAgIClcblxuICAgICAgIyBSb3V0ZXNcbiAgICAgIC5zdGF0ZSgncm91dGVzJyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4Um91dGVDdHJsIGFzIHJvdXRlcydcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIGZsYXNoU3VjY2VzczogbnVsbFxuICAgICAgKVxuICAgICAgLnN0YXRlKCdyb3V0ZXNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL2NyZWF0ZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlUm91dGVDdHJsIGFzIHJvdXRlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdyb3V0ZXNfZWRpdCcsXG4gICAgICAgIHVybDogJy9yb3V0ZXMvOmlkL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL2VkaXQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0VkaXRSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy86aWQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG5cbiAgICAgICMgTWFwXG4gICAgICAuc3RhdGUoJ21hcCcsXG4gICAgICAgIHVybDogJy9tYXAnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvbWFwL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleE1hcEN0cmwgYXMgbWFwJ1xuICAgICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgKS5ydW4gKCRhdXRoLCAkaHR0cCwgJGxvY2F0aW9uLCAkcSwgJHJvb3RTY29wZSwgJHN0YXRlKSAtPlxuICAgIHB1YmxpY1JvdXRlcyA9IFtcbiAgICAgICdzaWduX3VwJyxcbiAgICAgICdjb25maXJtJyxcbiAgICAgICdmb3Jnb3RfcGFzc3dvcmQnLFxuICAgICAgJ3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICBdXG5cbiAgICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3RhcnQnLCAoZXZlbnQsIHRvU3RhdGUpIC0+XG4gICAgICBpZiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkgJiZcbiAgICAgIHB1YmxpY1JvdXRlcy5pbmRleE9mKHRvU3RhdGUubmFtZSkgPT0gLTFcbiAgICAgICAgJGxvY2F0aW9uLnBhdGggJ3VzZXIvc2lnbl9pbidcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGlmICRhdXRoLmlzQXV0aGVudGljYXRlZCgpICYmXG4gICAgICAocHVibGljUm91dGVzLmluZGV4T2YodG9TdGF0ZS5uYW1lKSA9PSAwIHx8XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRTdGF0ZSA9PSAnc2lnbl9pbicpXG4gICAgICAgICRsb2NhdGlvbi5wYXRoICcvJ1xuXG4gICAgICB1c2VyID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpKVxuXG4gICAgICBpZiB1c2VyICYmICRhdXRoLmlzQXV0aGVudGljYXRlZCgpXG4gICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXJcblxuICAgICAgICBpZiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gJy9pbWFnZXMvJyArXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhclxuICAgICAgICBlbHNlXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSAndXBsb2Fkcy9hdmF0YXJzLycgK1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXJcblxuICAgICAgJHJvb3RTY29wZS5sb2dvdXQgPSAtPlxuICAgICAgICAkYXV0aC5sb2dvdXQoKS50aGVuIC0+XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0gJ3VzZXInXG4gICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbFxuXG4gICAgICAgICAgJHN0YXRlLmdvICdzaWduX2luJ1xuXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICByZXR1cm5cbiIsImNoZWNrYm94RmllbGQgPSAoKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9jaGVja2JveF9maWVsZC5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgbGFiZWw6ICc9bGFiZWwnLFxuICAgICAgYXR0ckNsYXNzOiAnPT9hdHRyQ2xhc3MnLFxuICAgICAgbmdDaGVja2VkOiAnPT9uZ0NoZWNrZWQnLFxuICAgICAgbW9kZWw6ICc9bW9kZWwnLFxuICAgIH0sXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgaWYgc2NvcGUubW9kZWwgPT0gJzEnXG4gICAgICAgIHNjb3BlLm1vZGVsID0gdHJ1ZVxuICAgICAgZWxzZSBpZiBzY29wZS5tb2RlbCA9PSAnMCdcbiAgICAgICAgc2NvcGUubW9kZWwgPSBmYWxzZVxuXG4gICAgICByZXR1cm5cbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnY2hlY2tib3hGaWVsZCcsIGNoZWNrYm94RmllbGRcbiIsImRhdGV0aW1lcGlja2VyID0gKCR0aW1lb3V0KSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9kYXRldGltZXBpY2tlci5odG1sJyxcbiAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGxhYmVsOiBcIj0/bGFiZWxcIixcbiAgICB9LFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0ciwgbmdNb2RlbCkgLT5cbiAgICAgIHNjb3BlLm9wZW4gPSAoKSAtPlxuICAgICAgICBzY29wZS5kYXRlX29wZW5lZCA9IHRydWVcblxuICAgICAgJHRpbWVvdXQoXG4gICAgICAgICgoKSAtPlxuICAgICAgICAgIHNjb3BlLm1vZGVsID0gRGF0ZS5wYXJzZShuZ01vZGVsLiR2aWV3VmFsdWUpXG4gICAgICAgICksIDQwMFxuICAgICAgKVxuXG4gICAgICBzY29wZS5zZWxlY3REYXRlID0gKChtb2RlbCkgLT5cbiAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1vZGVsKVxuICAgICAgKVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdkYXRldGltZXBpY2tlcicsIGRhdGV0aW1lcGlja2VyXG4iLCJkZWxldGVBdmF0YXIgPSAoJHRpbWVvdXQpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJyxcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2RlbGV0ZV9hdmF0YXIuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIHJlbW92ZUF2YXRhcjogJz1uZ01vZGVsJyxcbiAgICAgIGZpbGU6IFwiPWZpbGVcIixcbiAgICB9LFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMpIC0+XG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnaW1nTmFtZScsICh2YWx1ZSkgLT5cbiAgICAgICAgc2NvcGUuaW1nTmFtZSA9IHZhbHVlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHNjb3BlLnJlbW92ZSA9ICgpIC0+XG4gICAgICAgICR0aW1lb3V0KCgpIC0+XG4gICAgICAgICAgc2NvcGUuaW1nTmFtZSA9ICdpbWFnZXMvZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgc2NvcGUuZmlsZSAhPSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICAgIHNjb3BlLnJlbW92ZUF2YXRhciA9IHRydWVcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnZGVsZXRlQXZhdGFyJywgZGVsZXRlQXZhdGFyXG4iLCJmaWxlRmllbGQgPSAoKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2ZpbGVfZmllbGQuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGF0dHJJZDogJz0nLFxuICAgICAgbmdNb2RlbDogJz1uZ01vZGVsJyxcbiAgICAgIHJlbW92ZUF2YXRhcjogJz0/cmVtb3ZlZEF2YXRhcicsXG4gICAgfSxcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBlbGVtZW50LmJpbmQgJ2NoYW5nZScsIChjaGFuZ2VFdmVudCkgLT5cbiAgICAgICAgc2NvcGUubmdNb2RlbCA9IGV2ZW50LnRhcmdldC5maWxlc1xuICAgICAgICBzY29wZS5yZW1vdmVBdmF0YXIgPSBmYWxzZSAjIGZvciBkZWxldGVfYXZhdGFyIGRpcmVjdGl2ZVxuICAgICAgICBmaWxlcyA9IGV2ZW50LnRhcmdldC5maWxlc1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGVzWzBdLm5hbWVcblxuICAgICAgICBlbGVtZW50WzBdXG4gICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9dGV4dF0nKVxuICAgICAgICAgIC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgZmlsZU5hbWUpXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2ZpbGVGaWVsZCcsIGZpbGVGaWVsZFxuIiwicGFnaW5hdGlvbiA9ICgkaHR0cCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYWdpbmF0aW9uLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBwYWdpQXJyOiAnPScsXG4gICAgICBpdGVtczogJz0nLFxuICAgICAgcGFnaUFwaVVybDogJz0nLFxuICAgIH0sXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgc2NvcGUuJHdhdGNoICgoKSAtPlxuICAgICAgICBzY29wZS5wYWdpQXJyXG4gICAgICApLCAoKG5ld1ZhbHVlLCBvbGRWYWx1ZSkgLT5cbiAgICAgICAgaWYgIWFuZ3VsYXIuZXF1YWxzKG9sZFZhbHVlLCBuZXdWYWx1ZSlcbiAgICAgICAgICBzY29wZS5wYWdpQXJyID0gbmV3VmFsdWVcbiAgICAgICAgICBzY29wZS50b3RhbFBhZ2VzID0gc2NvcGUucGFnaUFyci5sYXN0X3BhZ2VcbiAgICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IHNjb3BlLnBhZ2lBcnIuY3VycmVudF9wYWdlXG4gICAgICAgICAgc2NvcGUudG90YWwgPSBzY29wZS5wYWdpQXJyLnRvdGFsXG4gICAgICAgICAgc2NvcGUucGVyUGFnZSA9IHNjb3BlLnBhZ2lBcnIucGVyX3BhZ2VcblxuICAgICAgICAgICMgUGFnaW5hdGlvbiBSYW5nZVxuICAgICAgICAgIHNjb3BlLnBhaW5hdGlvblJhbmdlKHNjb3BlLnRvdGFsUGFnZXMpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCB0cnVlXG5cbiAgICAgIHNjb3BlLmdldFBvc3RzID0gKHBhZ2VOdW1iZXIpIC0+XG4gICAgICAgIGlmIHBhZ2VOdW1iZXIgPT0gdW5kZWZpbmVkXG4gICAgICAgICAgcGFnZU51bWJlciA9ICcxJ1xuXG4gICAgICAgICRodHRwLmdldChzY29wZS5wYWdpQXBpVXJsKyc/cGFnZT0nICsgcGFnZU51bWJlcikuc3VjY2VzcyAocmVzcG9uc2UpIC0+XG4gICAgICAgICAgc2NvcGUuaXRlbXMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgc2NvcGUudG90YWxQYWdlcyA9IHJlc3BvbnNlLmxhc3RfcGFnZVxuICAgICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlXG5cbiAgICAgICAgICAjIFBhZ2luYXRpb24gUmFuZ2VcbiAgICAgICAgICBzY29wZS5wYWluYXRpb25SYW5nZShzY29wZS50b3RhbFBhZ2VzKVxuXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHNjb3BlLnBhaW5hdGlvblJhbmdlID0gKHRvdGFsUGFnZXMpIC0+XG4gICAgICAgIHBhZ2VzID0gW11cbiAgICAgICAgaSA9IDFcblxuICAgICAgICB3aGlsZSBpIDw9IHRvdGFsUGFnZXNcbiAgICAgICAgICBwYWdlcy5wdXNoIGlcbiAgICAgICAgICBpKytcblxuICAgICAgICBzY29wZS5yYW5nZSA9IHBhZ2VzXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ3BhZ2luYXRpb24nLCBwYWdpbmF0aW9uXG4iLCJyYWRpb0ZpZWxkID0gKCRodHRwKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9yYWRpb19maWVsZC5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgbmdNb2RlbDogXCI9bmdNb2RlbFwiLFxuICAgICAgbGFiZWw6ICc9bGFiZWwnLFxuICAgICAgYXR0ck5hbWU6ICc9YXR0ck5hbWUnLFxuICAgICAgYXR0clZhbHVlOiAnPWF0dHJWYWx1ZScsXG4gICAgICBuZ0NoZWNrZWQ6ICc9P25nQ2hlY2tlZCcsXG4gICAgfSxcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUuYXR0clZhbHVlXG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2hhbmdlJywgKCkgLT5cbiAgICAgICAgc2NvcGUubmdNb2RlbCA9IHNjb3BlLmF0dHJWYWx1ZVxuICAgICAgKVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdyYWRpb0ZpZWxkJywgcmFkaW9GaWVsZFxuIiwidGltZXBpY2tlciA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL3RpbWVwaWNrZXIuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIG1vZGVsOiBcIj1uZ01vZGVsXCIsXG4gICAgICBsYWJlbDogXCI9P2xhYmVsXCIsXG4gICAgICBhdHRyTmFtZTogXCJAXCIsXG4gICAgfSxcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBzY29wZS5oc3RlcCA9IDFcbiAgICAgIHNjb3BlLm1zdGVwID0gNVxuICAgICAgc2NvcGUuaXNtZXJpZGlhbiA9IHRydWVcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAndGltZXBpY2tlcicsIHRpbWVwaWNrZXJcbiIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wdXNoZXJOb3RpZmljYXRpb25zJywgW1xuICAgICdub3RpZmljYXRpb24nXG4gIF0pXG4gIC5ydW4gKCRub3RpZmljYXRpb24sICRyb290U2NvcGUpIC0+XG4gICAgbmV3Um91dGVNZXNzYWdlID0gJ1lPVSBIQVZFIEEgTkVXIFJPVVRFLidcbiAgICByZWRUcnVja0ljb24gPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuICAgIHB1c2hlciA9IG5ldyBQdXNoZXIoJzZiNThjMTI0M2RmODIwMjhhNzg4Jywge1xuICAgICAgY2x1c3RlcjogJ2V1JyxcbiAgICAgIGVuY3J5cHRlZDogdHJ1ZSxcbiAgICB9KVxuICAgIGNoYW5uZWwgPSBwdXNoZXIuc3Vic2NyaWJlKCduZXctcm91dGUtY2hhbm5lbCcpXG5cbiAgICBjaGFubmVsLmJpbmQoJ0FwcFxcXFxFdmVudHNcXFxcTmV3Um91dGUnLCAoZGF0YSkgLT5cblxuICAgICAgaWYgJHJvb3RTY29wZS5jdXJyZW50VXNlci5pZCA9PSBwYXJzZUludChkYXRhLnVzZXJJZClcbiAgICAgICAgJG5vdGlmaWNhdGlvbignTmV3IG1lc3NhZ2UhJywge1xuICAgICAgICAgIGJvZHk6IG5ld1JvdXRlTWVzc2FnZSxcbiAgICAgICAgICBpY29uOiByZWRUcnVja0ljb24sXG4gICAgICAgICAgdmlicmF0ZTogWzIwMCwgMTAwLCAyMDBdLFxuICAgICAgICB9KVxuICAgIClcblxuICAgIHJldHVyblxuIiwiSW5kZXhIb21lQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgIyBSb3V0ZXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9ob21lJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBNYXBcbiAgYXBpS2V5ID0gJ2EzMDNkM2E0NGEwMWM5ZjhhNWNiMDEwN2IwMzNlZmJlJ1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIyMgIFJPVVRFUyAgIyMjXG4gIGlmICRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcl9ncm91cCA9PSAnYWRtaW4nXG4gICAgJGh0dHAuZ2V0KCcvYXBpL2hvbWUnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnJvdXRlcyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgICAgcmV0dXJuXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gICMjIyAgTUFQICAjIyNcbiAgIyBHZXQgcG9pbnRzIEpTT05cbiAgJGh0dHAoXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvYXBpL2hvbWUvZ2V0cG9pbnRzJykudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YVxuICAgICAgaW5pdE1hcCgpXG5cbiAgICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpXG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnJvdXRlcyA9IG9yZGVyQnkodm0ucm91dGVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICBpbml0TWFwID0gKCkgLT5cbiAgICBtYXBPcHRpb25zID0ge1xuICAgICAgem9vbTogMTIsXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG4gICAgICB6b29tQ29udHJvbE9wdGlvbnM6IHtcbiAgICAgICAgcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTSxcbiAgICAgIH0sXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDczNTA5LCAtMC4xMjc3NTgzKSxcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzLFxuICAgIH1cblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2VcblxuICAgICMgU2V0IGxvY2F0aW9uc1xuICAgIGFuZ3VsYXIuZm9yRWFjaCggdm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiICsgYWRkcmVzcyArXG4gICAgICAgIFwiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleTtcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwKVxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcblxuICAgICAgICAgICAgIyBwb3B1cFxuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZylcblxuICAgICAgICAgICAgIyBzZWxlY3QgaWNvbnMgYnkgc3RhdHVzIChncmVlbiBvciByZWQpXG4gICAgICAgICAgICBpZiBwYXJzZUludCB2YWx1ZS5zdGF0dXNcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgaWNvbjogdm0uYmFsb29uTmFtZSxcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IG90aGVyIG1hcmtlclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAoKSAtPlxuICAgICAgICAgICAgICBpZiBwcmV2SW5mb1dpbmRvd1xuICAgICAgICAgICAgICAgIHByZXZJbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5nZXRQb3NpdGlvbigpKSAjIGFuaW1hdGUgbW92ZSBiZXR3ZWVuIG1hcmtlcnNcbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuIG1hcCwgbWFya2VyXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgZW1wdHkgbWFwIGFyZWFcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgKCkgLT5cbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQWRkIG5ldyBtYXJrZXIgdG8gYXJyYXkgZm9yIG91dHNpZGUgbWFwIGxpbmtzIC1cbiAgICAgICAgICAgICMgLShvcmRlcmVkIGJ5IGlkIGluIGJhY2tlbmQpXG4gICAgICAgICAgICB2bS5tYXJrZXJzLnB1c2gobWFya2VyKVxuXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpXG4gICAgICByZXEuc2VuZCgpXG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uc3R5bGVzID0gW1xuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd3YXRlcicsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCcsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyOSB9LFxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmFydGVyaWFsJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTggfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9LFxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pLnBhcmsnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2RlZGVkZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAndmlzaWJpbGl0eSc6ICdvbicgfVxuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnc2F0dXJhdGlvbic6IDM2IH1cbiAgICAgICAgeyAnY29sb3InOiAnIzMzMzMzMycgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMuaWNvbidcbiAgICAgICdzdHlsZXJzJzogWyB7ICd2aXNpYmlsaXR5JzogJ29mZicgfSBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd0cmFuc2l0J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmMmYyZjInIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMS4yIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICAjIEdvIHRvIHBvaW50IGFmdGVyIGNsaWNrIG91dHNpZGUgbWFwIGxpbmtcbiAgdm0uZ29Ub1BvaW50ID0gKGlkKSAtPlxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodm0ubWFya2Vyc1tpZF0sICdjbGljaycpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleEhvbWVDdHJsJywgSW5kZXhIb21lQ3RybClcbiIsIkluZGV4TWFwQ3RybCA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgIyBNYXBcbiAgYXBpS2V5ID0gJ2EzMDNkM2E0NGEwMWM5ZjhhNWNiMDEwN2IwMzNlZmJlJ1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIEdldCBwb2ludHMgSlNPTlxuICAkaHR0cChcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIHVybDogJy9hcGkvbWFwJykudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgICAjIEluaXQgbWFwXG4gICAgICBpbml0TWFwKClcblxuICAgICAgcmV0dXJuXG4gIClcblxuICBpbml0TWFwID0gKCkgLT5cbiAgICBtYXBPcHRpb25zID0ge1xuICAgICAgem9vbTogMTIsXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG4gICAgICB6b29tQ29udHJvbE9wdGlvbnM6IHtcbiAgICAgICAgcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTSxcbiAgICAgIH1cbiAgICAgIGNlbnRlcjogbmV3IChnb29nbGUubWFwcy5MYXRMbmcpKDUxLjUwNzM1MDksIC0wLjEyNzc1ODMpLFxuICAgICAgc3R5bGVzOiB2bS5zdHlsZXNcbiAgICB9XG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlXG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2goIHZtLnBvaW50cywgKHZhbHVlLCBrZXkpIC0+XG4gICAgICBhZGRyZXNzID0gdmFsdWUuc3RvcmUuYWRkcmVzc1xuICAgICAgIyBHZW9jb2RlIEFkZHJlc3NlcyBieSBhZGRyZXNzIG5hbWVcbiAgICAgIGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmNhZ2VkYXRhLmNvbS9nZW9jb2RlL3YxL2pzb24/cT1cIiArIGFkZHJlc3MgK1xuICAgICAgICBcIiZwcmV0dHk9MSZrZXk9XCIgKyBhcGlLZXlcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiByZXNwb25zZS5zdGF0dXMuY29kZSA9PSAyMDBcbiAgICAgICAgICAgIGNvbnRlbnRTdHJpbmcgPVxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1hcmtlci1jb250ZW50XCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ0FkZHJlc3M6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUuYWRkcmVzcyArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnUGhvbmU6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUucGhvbmUgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nXG5cbiAgICAgICAgICAgICMgcG9wdXBcbiAgICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpXG5cbiAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICBpZiBwYXJzZUludCB2YWx1ZS5zdGF0dXNcbiAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb25fc2hpcGVkLnBuZydcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgICAgICAgIG1hcmtlciA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFya2VyKShcbiAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgaWNvbjogdm0uYmFsb29uTmFtZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICApXG5cbiAgICAgICAgICAjIENsaWNrIGJ5IG90aGVyIG1hcmtlclxuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgKCkgLT5cbiAgICAgICAgICAgIGlmIHByZXZJbmZvV2luZG93XG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgcHJldkluZm9XaW5kb3cgPSBpbmZvV2luZG93XG5cbiAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIuZ2V0UG9zaXRpb24oKSkgIyBhbmltYXRlIG1vdmUgYmV0d2VlbiBtYXJrZXJzXG4gICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgKCkgLT5cbiAgICAgICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICApXG5cbiAgICAgICAgICAjIEFkZCBuZXcgbWFya2VyIHRvIGFycmF5IGZvciBvdXRzaWRlIG1hcCBsaW5rcyAtXG4gICAgICAgICAgIyAtIChvcmRlcmVkIGJ5IGlkIGluIGJhY2tlbmQpXG4gICAgICAgICAgdm0ubWFya2Vycy5wdXNoKG1hcmtlcilcblxuICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgYXBpVXJsLCB0cnVlKVxuICAgICAgcmVxLnNlbmQoKVxuICAgIClcblxuICAgIHJldHVyblxuXG4gIHZtLnN0eWxlcyA9IFtcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnd2F0ZXInLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZTllOWU5JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2xhbmRzY2FwZScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5JyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyOSB9LFxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmFydGVyaWFsJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTggfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaS5wYXJrJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2RlZGVkZScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3Zpc2liaWxpdHknOiAnb24nIH0sXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCcsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnc2F0dXJhdGlvbic6IDM2IH0sXG4gICAgICAgIHsgJ2NvbG9yJzogJyMzMzMzMzMnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLmljb24nLFxuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd0cmFuc2l0JyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCcsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9LFxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfSxcbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICAjIEdvIHRvIHBvaW50IGFmdGVyIGNsaWNrIG91dHNpZGUgbWFwIGxpbmtcbiAgdm0uZ29Ub1BvaW50ID0gKGlkKSAtPlxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodm0ubWFya2Vyc1tpZF0sICdjbGljaycpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleE1hcEN0cmwnLCBJbmRleE1hcEN0cmwpXG4iLCJFZGl0UHJvZmlsZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSwgVXBsb2FkLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICAkaHR0cC5nZXQoJy9hcGkvcHJvZmlsZS9lZGl0JylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS51c2VyID0gcmVzcG9uc2UuZGF0YVxuICAgICAgdm0udXNlci5yZW1vdmVfYXZhdGFyID0gZmFsc2VcblxuICAgICAgIyBmb3IgZGVsZXRlX2F2YXRhciBkaXJlY3RpdmVcbiAgICAgIHZtLmF2YXRhciA9IHZtLm1ha2VBdmF0YXJMaW5rKHZtLnVzZXIuYXZhdGFyKVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBhdmF0YXIgPSB2bS51c2VyLmF2YXRhclxuXG4gICAgaWYgdm0udXNlci5hdmF0YXIgPT0gJy9pbWFnZXMvZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0udXNlci5hdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJyAjIHRvZG8gaHogbWF5IGJlIGZvciBkZWxldGVcbiAgICAgIGF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG5cbiAgICB2bS5kYXRhID0ge1xuICAgICAgYXZhdGFyOiBhdmF0YXIsXG4gICAgICByZW1vdmVfYXZhdGFyOiB2bS51c2VyLnJlbW92ZV9hdmF0YXIsXG4gICAgICBuYW1lOiB2bS51c2VyLm5hbWUsXG4gICAgICBsYXN0X25hbWU6IHZtLnVzZXIubGFzdF9uYW1lLFxuICAgICAgaW5pdGlhbHM6IHZtLnVzZXIuaW5pdGlhbHMsXG4gICAgICBiZGF5OiB2bS51c2VyLmJkYXksXG4gICAgICBlbWFpbDogdm0udXNlci5lbWFpbCxcbiAgICAgIHBob25lOiB2bS51c2VyLnBob25lLFxuICAgICAgam9iX3RpdGxlOiB2bS51c2VyLmpvYl90aXRsZSxcbiAgICAgIGNvdW50cnk6IHZtLnVzZXIuY291bnRyeSxcbiAgICAgIGNpdHk6IHZtLnVzZXIuY2l0eSxcbiAgICB9XG5cbiAgICBVcGxvYWQudXBsb2FkKFxuICAgICAgdXJsOiAnL2FwaS9wcm9maWxlLycgKyB2bS51c2VyLmlkLFxuICAgICAgbWV0aG9kOiAnUG9zdCcsXG4gICAgICBkYXRhOiB2bS5kYXRhLFxuICAgICkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgZmlsZU5hbWUgPSByZXNwb25zZS5kYXRhXG4gICAgICBzdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKVxuICAgICAgc3RvcmFnZSA9IEpTT04ucGFyc2Uoc3RvcmFnZSlcblxuICAgICAgIyBEZWZhdWx0IGF2YXRhclxuICAgICAgaWYgKHR5cGVvZiBmaWxlTmFtZSA9PSAnYm9vbGVhbicgJiYgdm0udXNlci5yZW1vdmVfYXZhdGFyKVxuICAgICAgICBzdG9yYWdlLmF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAjIFVwZGF0ZSBzdG9yYWdlXG4gICAgICBlbHNlIGlmICh0eXBlb2YgZmlsZU5hbWUgPT0gJ3N0cmluZycgJiYgIXZtLnVzZXIucmVtb3ZlX2F2YXRhcilcbiAgICAgICAgc3RvcmFnZS5hdmF0YXIgPSBmaWxlTmFtZVxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9IHZtLm1ha2VBdmF0YXJMaW5rKHN0b3JhZ2UuYXZhdGFyKVxuICAgICAgICBzdG9yYWdlLmF2YXRhciA9IGZpbGVOYW1lXG5cbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZSkpXG5cbiAgICAgICRzdGF0ZS5nbyAncHJvZmlsZScsIHsgZmxhc2hTdWNjZXNzOiAnUHJvZmlsZSB1cGRhdGVkIScgfVxuICAgICksICgoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIGNvbnNvbGUubG9nKHZtLmVycm9yKVxuXG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgdm0ubWFrZUF2YXRhckxpbmsgPSAoYXZhdGFyTmFtZSkgLT5cbiAgICBpZiBhdmF0YXJOYW1lID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICBhdmF0YXJOYW1lID0gJy9pbWFnZXMvJyArIGF2YXRhck5hbWVcbiAgICBlbHNlXG4gICAgICBhdmF0YXJOYW1lID0gJy91cGxvYWRzL2F2YXRhcnMvJyArIGF2YXRhck5hbWVcblxuICAgIHJldHVybiBhdmF0YXJOYW1lXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdFZGl0UHJvZmlsZUN0cmwnLCBFZGl0UHJvZmlsZUN0cmwpXG4iLCJJbmRleFByb2ZpbGVDdHJsID0gKCRodHRwKSAtPlxuICB2bSA9IHRoaXNcblxuICAkaHR0cC5nZXQoJy9hcGkvcHJvZmlsZScpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0udXNlciA9IHJlc3BvbnNlLmRhdGEudXNlclxuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YS5wb2ludHNcblxuICAgICAgaWYgdm0udXNlci5hdmF0YXIgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgdm0udXNlci5hdmF0YXIgPSAnL2ltYWdlcy8nICsgdm0udXNlci5hdmF0YXJcbiAgICAgIGVsc2VcbiAgICAgICAgdm0udXNlci5hdmF0YXIgPSAndXBsb2Fkcy9hdmF0YXJzLycgKyB2bS51c2VyLmF2YXRhclxuXG4gICAgICB2bS51c2VyLmJkYXkgPSBtb21lbnQobmV3IERhdGUodm0udXNlci5iZGF5KSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLnVwZGF0ZVBvaW50cyA9ICgpIC0+XG4gICAgJGh0dHAucHV0KCcvYXBpL3Byb2ZpbGUvdXBkYXRlcG9pbnRzJywgdm0ucG9pbnRzKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnUG9pbnRzIHVwZGF0ZWQhJ1xuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhQcm9maWxlQ3RybCcsIEluZGV4UHJvZmlsZUN0cmwpXG4iLCJDcmVhdGVSb3V0ZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnBvaW50Rm9ybXMgPSBbXVxuXG4gICRodHRwLnBvc3QoJy9hcGkvcm91dGVzL2dldFVzZXJzQW5kU3RvcmVzJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICB2bS5jcmVhdGVSb3V0ZSA9ICgpIC0+XG4gICAgdm0ucm91dGUgPSB7XG4gICAgICB1c2VyX2lkOiB2bS51c2VyX2lkLFxuICAgICAgZGF0ZTogdm0uZGF0ZSxcbiAgICAgIHBvaW50czogdm0ucG9pbnRGb3JtcyxcbiAgICB9XG5cbiAgICAkaHR0cC5wb3N0KCcvYXBpL3JvdXRlcycsIHZtLnJvdXRlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdOZXcgcm91dGUgaGFzIGJlZW4gYWRkZWQhJyB9XG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmVycm9yKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uYWRkUG9pbnQgPSAoKSAtPlxuICAgIHZtLnBvaW50Rm9ybXMucHVzaCh7fSlcblxuICB2bS5yZW1vdmVQb2ludCA9IChpbmRleCkgLT5cbiAgICB2bS5wb2ludEZvcm1zLnNwbGljZShpbmRleCwgMSlcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVJvdXRlQ3RybCcsIENyZWF0ZVJvdXRlQ3RybClcbiIsIkVkaXRSb3V0ZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcbiAgdm0uY291bnQgPSAxXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcy9lZGl0LycrIHZtLmlkKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcblxuICAgICAgcmV0dXJuXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICB2bS51cGRhdGUgPSAoKSAtPlxuICAgIHJvdXRlID0ge1xuICAgICAgdXNlcl9pZDogdm0ub2JqLnVzZXJfaWQsXG4gICAgICBkYXRlOiB2bS5vYmouZGF0ZSxcbiAgICAgIHBvaW50czogdm0ub2JqLnBvaW50cyxcbiAgICB9XG5cbiAgICAkaHR0cC5wYXRjaCgnL2FwaS9yb3V0ZXMvJyArIHZtLmlkLCByb3V0ZSlcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdyb3V0ZXMnLCB7IGZsYXNoU3VjY2VzczogJ1JvdXRlIFVwZGF0ZWQhJyB9XG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmVycm9yKVxuXG4gIHZtLmFkZFBvaW50ID0gKCkgLT5cbiAgICB2bS5vYmoucG9pbnRzLnB1c2goe1xuICAgICAgaWQ6IHZtLmNvdW50ICsgJ19uZXcnXG4gICAgfSlcblxuICAgIHZtLmNvdW50KytcblxuICAgIHJldHVyblxuXG4gIHZtLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgIHZtLm9iai5wb2ludHMuc3BsaWNlKGluZGV4LCAxKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFJvdXRlQ3RybCcsIEVkaXRSb3V0ZUN0cmwpXG4iLCJJbmRleFJvdXRlQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9yb3V0ZXMnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcycpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLnJvdXRlcyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcblxuICAgICQoJy5zb3J0LWxpbmsnKS5lYWNoICgpIC0+XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3NvcnQtbGluayBjLXAnKVxuXG4gICAgaWYgdm0uc29ydFJldmVyc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1hc2MnKS5hZGRDbGFzcygnYWN0aXZlLWRlc2MnKVxuICAgIGVsc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1kZXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1hc2MnKVxuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5yb3V0ZXMgPSBvcmRlckJ5KHZtLnJvdXRlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlUm91dGUgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvcm91dGVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAjIERlbGV0ZSBmcm9tIHNjb3BlXG4gICAgICAgIHZtLnJvdXRlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdSb3V0ZSBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhSb3V0ZUN0cmwnLCBJbmRleFJvdXRlQ3RybClcbiIsIlNob3dSb3V0ZUN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnXG4gIHZtLm1hcmtlcnMgPSBbXVxuXG4gICMgR2V0IHBvaW50c1xuICAkaHR0cC5nZXQoJy9hcGkvcm91dGVzLycgKyB2bS5pZClcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5yb3V0ZSA9IHJlc3BvbnNlLmRhdGEucm91dGVcbiAgICAgIHZtLnN0b3JlcyA9IHJlc3BvbnNlLmRhdGEuc3RvcmVzXG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhLnBvaW50c1xuICAgICAgdm0ucm91dGUuZGF0ZSA9IG1vbWVudChuZXcgRGF0ZSh2bS5yb3V0ZS5kYXRlKSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcblxuICAgICAgIyBJbml0IG1hcFxuICAgICAgaW5pdE1hcCgpXG5cbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcblxuICB2bS5kZWxldGVSb3V0ZSA9IChpZCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCcvYXBpL3JvdXRlcy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdyb3V0ZXMnLCB7IGZsYXNoU3VjY2VzczogJ1JvdXRlIERlbGV0ZWQhJyB9XG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3JcblxuICAjIFdoZW4gdGhlIHdpbmRvdyBoYXMgZmluaXNoZWQgbG9hZGluZyBjcmVhdGUgb3VyIGdvb2dsZSBtYXAgYmVsb3dcbiAgaW5pdE1hcCA9ICgpIC0+XG4gICAgIyBCYXNpYyBvcHRpb25zIGZvciBhIHNpbXBsZSBHb29nbGUgTWFwXG4gICAgbWFwT3B0aW9ucyA9IHtcbiAgICAgIHpvb206IDEyLFxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiB7XG4gICAgICAgIHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9CT1RUT00sXG4gICAgICB9LFxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTAwMTUyLCAtMC4xMjYyMzYpLFxuICAgICAgc3R5bGVzOnZtLnN0eWxlcyxcbiAgICB9XG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JvdXRlLW1hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlXG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2godm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiICsgYWRkcmVzcyArXG4gICAgICAgIFwiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleVxuICAgICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgcmVxLm9ubG9hZCA9ICgpIC0+XG4gICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKVxuICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICBwb3NpdGlvbiA9IHJlc3BvbnNlLnJlc3VsdHNbMF0uZ2VvbWV0cnlcblxuICAgICAgICAgIGlmIHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMFxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICMgcG9wdXBcbiAgICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpXG5cbiAgICAgICAgICAgICMgc2VsZWN0IGljb25zIGJ5IHN0YXR1cyAoZ3JlZW4gb3IgcmVkKVxuICAgICAgICAgICAgaWYgcGFyc2VJbnQgdmFsdWUuc3RhdHVzXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb25fc2hpcGVkLnBuZydcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbi5wbmcnXG5cbiAgICAgICAgICAgIG1hcmtlciA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFya2VyKShcbiAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWUsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBvdGhlciBtYXJrZXJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgKCkgLT5cbiAgICAgICAgICAgICAgaWYgcHJldkluZm9XaW5kb3dcbiAgICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cgPSBpbmZvV2luZG93XG4gICAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIuZ2V0UG9zaXRpb24oKSkgIyBhbmltYXRlIG1vdmUgYmV0d2VlbiBtYXJrZXJzXG4gICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbiBtYXAsIG1hcmtlclxuXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IGVtcHR5IG1hcCBhcmVhXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsICgpIC0+XG4gICAgICAgICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIEFkZCBuZXcgbWFya2VyIHRvIGFycmF5IGZvciBvdXRzaWRlIG1hcCBsaW5rcyAtXG4gICAgICAgICAgICAjIC0gKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG5cbiAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIGFwaVVybCwgdHJ1ZSlcbiAgICAgIHJlcS5zZW5kKClcbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2U5ZTllOScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdsYW5kc2NhcGUnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCcsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfSxcbiAgICAgICAgeyAnd2VpZ2h0JzogMC4yIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCcsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5sb2NhbCcsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaycsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNkZWRlZGUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuc3Ryb2tlJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9LFxuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3NhdHVyYXRpb24nOiAzNiB9LFxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJyxcbiAgICAgICdzdHlsZXJzJzogWyB7ICd2aXNpYmlsaXR5JzogJ29mZicgfSBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd0cmFuc2l0JyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfSxcbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH0sXG4gICAgICAgIHsgJ3dlaWdodCc6IDEuMiB9LFxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Nob3dSb3V0ZUN0cmwnLCBTaG93Um91dGVDdHJsKVxuIiwiQ3JlYXRlU3RvcmVDdHJsID0gKCRzY29wZSwgJGh0dHAsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0uY3JlYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5zdG9yZU5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLm93bmVyTmFtZVxuICAgICAgYWRkcmVzczogdm0uYWRkcmVzc1xuICAgICAgcGhvbmU6IHZtLnBob25lXG4gICAgICBlbWFpbDogdm0uZW1haWxcblxuICAgICRodHRwLnBvc3QoJy9hcGkvc3RvcmVzJywgc3RvcmUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAnc3RvcmVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdOZXcgc3RvcmUgY3JlYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlU3RvcmVDdHJsJywgQ3JlYXRlU3RvcmVDdHJsKVxuIiwiRWRpdFN0b3JlQ3RybCA9ICgkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5kYXRhLm5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLmRhdGEub3duZXJfbmFtZVxuICAgICAgYWRkcmVzczogdm0uZGF0YS5hZGRyZXNzXG4gICAgICBwaG9uZTogdm0uZGF0YS5waG9uZVxuICAgICAgZW1haWw6IHZtLmRhdGEuZW1haWxcblxuICAgICRodHRwLnBhdGNoKCcvYXBpL3N0b3Jlcy8nICsgdm0uaWQsIHN0b3JlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgVXBkYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFN0b3JlQ3RybCcsIEVkaXRTdG9yZUN0cmwpXG4iLCJJbmRleFN0b3JlQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9zdG9yZXMnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uc3RvcmVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJyk7XG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnN0b3JlcyA9IG9yZGVyQnkodm0uc3RvcmVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9zdG9yZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0uc3RvcmVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1N0b3JlIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhTdG9yZUN0cmwnLCBJbmRleFN0b3JlQ3RybClcbiIsIlNob3dTdG9yZUN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAkaHR0cC5nZXQoJ2FwaS9zdG9yZXMvJyt2bS5pZCkudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uZGF0YSA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCdhcGkvc3RvcmVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgZGVsZXRlZCEnIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICApXG5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1N0b3JlQ3RybCcsIFNob3dTdG9yZUN0cmwpIiwiQ29uZmlybUNvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmRhdGEgPVxuICAgIGNvbmZpcm1hdGlvbl9jb2RlOiAkc3RhdGVQYXJhbXMuY29uZmlybWF0aW9uX2NvZGVcblxuICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL2NvbmZpcm0nLCB2bS5kYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAjIFNhdmUgdG9rZW5cbiAgICAkYXV0aC5zZXRUb2tlbihkYXRhLnRva2VuKVxuXG4gICAgIyBTYXZlIHVzZXIgaW4gbG9jYWxTdG9yYWdlXG4gICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3VzZXInLCB1c2VyXG4gICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZVxuICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBkYXRhXG5cbiAgICAkc3RhdGUuZ28gJy8nXG4gICkuZXJyb3IgKGRhdGEsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgJHN0YXRlLmdvICdzaWduX2luJ1xuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NvbmZpcm1Db250cm9sbGVyJywgQ29uZmlybUNvbnRyb2xsZXIpXG5cbiIsIkZvcmdvdFBhc3N3b3JkQ29udHJvbGxlciA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVzdG9yZVBhc3N3b3JkID0gKCktPlxuICAgIHZtLnNwaW5uZXJEb25lID0gdHJ1ZVxuICAgIGRhdGEgPVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG5cbiAgICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL3NlbmRfcmVzZXRfY29kZScsIGRhdGEpLnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgICAgaWYoZGF0YSlcbiAgICAgICAgdm0uc3VjY2Vzc1NlbmRpbmdFbWFpbCA9IHRydWVcbiAgICApLmVycm9yIChlcnJvciwgc3RhdHVzLCBoZWFkZXIsIGNvbmZpZykgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRm9yZ290UGFzc3dvcmRDb250cm9sbGVyJywgRm9yZ290UGFzc3dvcmRDb250cm9sbGVyKVxuXG4iLCJSZXNldFBhc3N3b3JkQ29udHJvbGxlciA9ICgkYXV0aCwgJHN0YXRlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0ubWlubGVuZ3RoID0gOFxuXG4gIHZtLnJlc3RvcmVQYXNzd29yZCA9IChmb3JtKSAtPlxuICAgIGRhdGEgPSB7XG4gICAgICByZXNldF9wYXNzd29yZF9jb2RlOiAkc3RhdGVQYXJhbXMucmVzZXRfcGFzc3dvcmRfY29kZVxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG4gICAgICBwYXNzd29yZF9jb25maXJtYXRpb246IHZtLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuICAgIH1cblxuICAgICRodHRwLnBvc3QoJ2FwaS9hdXRoZW50aWNhdGUvcmVzZXRfcGFzc3dvcmQnLCBkYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAgIGlmKGRhdGEpXG4gICAgICAgIHZtLnN1Y2Nlc3NSZXN0b3JlUGFzc3dvcmQgPSB0cnVlXG4gICAgKS5lcnJvciAoZXJyb3IsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0UGFzc3dvcmRDb250cm9sbGVyJywgUmVzZXRQYXNzd29yZENvbnRyb2xsZXIpXG5cbiIsIlNpZ25JbkNvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmxvZ2luID0gKCkgLT5cbiAgICBjcmVkZW50aWFscyA9XG4gICAgICBlbWFpbDogdm0uZW1haWxcbiAgICAgIHBhc3N3b3JkOiB2bS5wYXNzd29yZFxuXG4gICAgJGF1dGgubG9naW4oY3JlZGVudGlhbHMpLnRoZW4gKC0+XG4gICAgICAjIFJldHVybiBhbiAkaHR0cCByZXF1ZXN0IGZvciB0aGUgbm93IGF1dGhlbnRpY2F0ZWRcbiAgICAgICMgdXNlciBzbyB0aGF0IHdlIGNhbiBmbGF0dGVuIHRoZSBwcm9taXNlIGNoYWluXG4gICAgICAkaHR0cC5nZXQoJ2FwaS9hdXRoZW50aWNhdGUvZ2V0X3VzZXInKS50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmRhdGEudXNlcilcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3VzZXInLCB1c2VyXG4gICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGEudXNlclxuXG4gICAgICAgICRzdGF0ZS5nbyAnLydcblxuICAgICAgICByZXR1cm5cblxuICAgICksIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpO1xuXG4gICAgICByZXR1cm5cblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaWduSW5Db250cm9sbGVyJywgU2lnbkluQ29udHJvbGxlcilcbiIsIlNpZ25VcENvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVnaXN0ZXIgPSAoKS0+XG4gICAgdm0uc3Bpbm5lckRvbmUgPSB0cnVlXG4gICAgaWYgdm0udXNlclxuICAgICAgY3JlZGVudGlhbHMgPVxuICAgICAgICBuYW1lOiB2bS51c2VyLm5hbWVcbiAgICAgICAgZW1haWw6IHZtLnVzZXIuZW1haWxcbiAgICAgICAgcGFzc3dvcmQ6IHZtLnVzZXIucGFzc3dvcmRcbiAgICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiB2bS51c2VyLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuXG4gICAgJGF1dGguc2lnbnVwKGNyZWRlbnRpYWxzKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICAgICRzdGF0ZS5nbyAnc2lnbl91cF9zdWNjZXNzJ1xuICAgICAgcmV0dXJuXG4gICAgKS5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1NpZ25VcENvbnRyb2xsZXInLCBTaWduVXBDb250cm9sbGVyKVxuIiwiVXNlckNvbnRyb2xsZXIgPSAoJGh0dHAsICRzdGF0ZSwgJGF1dGgsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmdldFVzZXJzID0gLT5cbiAgICAjIFRoaXMgcmVxdWVzdCB3aWxsIGhpdCB0aGUgaW5kZXggbWV0aG9kIGluIHRoZSBBdXRoZW50aWNhdGVDb250cm9sbGVyXG4gICAgIyBvbiB0aGUgTGFyYXZlbCBzaWRlIGFuZCB3aWxsIHJldHVybiB0aGUgbGlzdCBvZiB1c2Vyc1xuICAgICRodHRwLmdldCgnYXBpL2F1dGhlbnRpY2F0ZScpLnN1Y2Nlc3MoKHVzZXJzKSAtPlxuICAgICAgdm0udXNlcnMgPSB1c2Vyc1xuICAgICAgcmV0dXJuXG4gICAgKS5lcnJvciAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuICB2bS5sb2dvdXQgPSAtPlxuICAgICRhdXRoLmxvZ291dCgpLnRoZW4gLT5cbiAgICAgICMgUmVtb3ZlIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSAndXNlcidcbiAgICAgICMgRmxpcCBhdXRoZW50aWNhdGVkIHRvIGZhbHNlIHNvIHRoYXQgd2Ugbm8gbG9uZ2VyXG4gICAgICAjIHNob3cgVUkgZWxlbWVudHMgZGVwZW5kYW50IG9uIHRoZSB1c2VyIGJlaW5nIGxvZ2dlZCBpblxuICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICAgICMgUmVtb3ZlIHRoZSBjdXJyZW50IHVzZXIgaW5mbyBmcm9tIHJvb3RzY29wZVxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGxcbiAgICAgICRzdGF0ZS5nbyAnc2lnbl9pbidcblxuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignVXNlckNvbnRyb2xsZXInLCBVc2VyQ29udHJvbGxlcilcbiIsIkNyZWF0ZVVzZXJDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgbG9kYXNoKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXohQCMkJV4mKigpLSs8PkFCQ0RFRkdISUpLTE1OT1AxMjM0NTY3ODkwJ1xuXG4gICRodHRwLmdldCgnL2FwaS91c2Vycy9jcmVhdGUnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLmVudW1zID0gcmVzcG9uc2UuZGF0YVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0uYWRkVXNlciA9ICgpIC0+XG4gICAgdm0uZGF0YSA9IHtcbiAgICAgIG5hbWU6IHZtLm5hbWUsXG4gICAgICBsYXN0X25hbWU6IHZtLmxhc3RfbmFtZSxcbiAgICAgIGluaXRpYWxzOiB2bS5pbml0aWFscyxcbiAgICAgIGF2YXRhcjogdm0uYXZhdGFyLFxuICAgICAgYmRheTogdm0uYmRheSxcbiAgICAgIGpvYl90aXRsZTogdm0uam9iX3RpdGxlLFxuICAgICAgdXNlcl9ncm91cDogdm0udXNlcl9ncm91cCxcbiAgICAgIGNvdW50cnk6IHZtLmNvdW50cnksXG4gICAgICBjaXR5OiB2bS5jaXR5LFxuICAgICAgcGhvbmU6IHZtLnBob25lLFxuICAgICAgZW1haWw6IHZtLmVtYWlsLFxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkLFxuICAgIH1cblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3VzZXJzJyxcbiAgICAgIG1ldGhvZDogJ1Bvc3QnLFxuICAgICAgZGF0YTogdm0uZGF0YSxcbiAgICApLnRoZW4gKChyZXNwKSAtPlxuICAgICAgJHN0YXRlLmdvICd1c2VycycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHVzZXIgaGFzIGJlZW4gYWRkZWQhJyB9XG5cbiAgICAgIHJldHVyblxuICAgICksICgoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZ2VuZXJhdGVQYXNzID0gKCkgLT5cbiAgICB2bS5wYXNzd29yZCA9ICcnXG4gICAgcGFzc0xlbmd0aCA9IGxvZGFzaC5yYW5kb20oOCwxNSlcbiAgICB4ID0gMFxuXG4gICAgd2hpbGUgeCA8IHBhc3NMZW5ndGhcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2bS5jaGFycy5sZW5ndGgpXG4gICAgICB2bS5wYXNzd29yZCArPSB2bS5jaGFycy5jaGFyQXQoaSlcbiAgICAgIHgrK1xuXG4gICAgcmV0dXJuIHZtLnBhc3N3b3JkXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdDcmVhdGVVc2VyQ3RybCcsIENyZWF0ZVVzZXJDdHJsKVxuIiwiSW5kZXhVc2VyQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS91c2VycydcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuXG4gICMgRmxhc2ggZnJvbSBvdGhlcnMgcGFnZXNcbiAgaWYgJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuICAgIHZtLmZsYXNoU3VjY2VzcyA9ICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcblxuICAkaHR0cC5nZXQoJ2FwaS91c2VycycpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLnVzZXJzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJyk7XG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnVzZXJzID0gb3JkZXJCeSh2bS51c2VycywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlVXNlciA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS91c2Vycy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgIyBEZWxldGUgZnJvbSBzY29wZVxuICAgICAgICB2bS51c2Vycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdVc2VyIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhVc2VyQ3RybCcsIEluZGV4VXNlckN0cmwpXG4iLCJTaG93VXNlckN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcbiAgdm0uc2V0dGluZ3MgPVxuICAgIGxpbmVXaWR0aDogNSxcbiAgICB0cmFja0NvbG9yOiAnI2U4ZWZmMCcsXG4gICAgYmFyQ29sb3I6ICcjMjdjMjRjJyxcbiAgICBzY2FsZUNvbG9yOiBmYWxzZSxcbiAgICBjb2xvcjogJyMzYTNmNTEnLFxuICAgIHNpemU6IDEzNCxcbiAgICBsaW5lQ2FwOiAnYnV0dCcsXG4gICAgcm90YXRlOiAtOTAsXG4gICAgYW5pbWF0ZTogMTAwMFxuXG4gICRodHRwLmdldCgnYXBpL3VzZXJzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICBpZiB2bS5vYmouYXZhdGFyID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICB2bS5vYmouYXZhdGFyID0gJy9pbWFnZXMvJyArIHZtLm9iai5hdmF0YXJcbiAgICBlbHNlXG4gICAgICB2bS5vYmouYXZhdGFyID0gJ3VwbG9hZHMvYXZhdGFycy8nICsgdm0ub2JqLmF2YXRhclxuICAgIHZtLm9iai5iZGF5ID0gbW9tZW50KG5ldyBEYXRlKHZtLm9iai5iZGF5KSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaG93VXNlckN0cmwnLCBTaG93VXNlckN0cmwpXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
