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

EditRouteCtrl = function($scope, $http, $state, $stateParams) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJtb2R1bGVzL3B1c2hlci1ub3RpZmljYXRpb25zLmNvZmZlZSIsImRpcmVjdGl2ZXMvY2hlY2tib3hfZmllbGQuY29mZmVlIiwiZGlyZWN0aXZlcy9kYXRldGltZXBpY2tlci5jb2ZmZWUiLCJkaXJlY3RpdmVzL2RlbGV0ZV9hdmF0YXIuY29mZmVlIiwiZGlyZWN0aXZlcy9maWxlX2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvcGFnaW5hdGlvbi5jb2ZmZWUiLCJkaXJlY3RpdmVzL3JhZGlvX2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvdGltZXBpY2tlci5jb2ZmZWUiLCJjb250cm9sbGVycy9ob21lL2luZGV4X2hvbWVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9tYXAvaW5kZXhfbWFwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcHJvZmlsZS9lZGl0X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9wcm9maWxlL2luZGV4X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvY3JlYXRlX3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2VkaXRfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvaW5kZXhfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvc2hvd19yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9jcmVhdGVfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvZWRpdF9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9pbmRleF9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9zaG93X3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9jb25maXJtX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9mb3Jnb3RfcGFzc3dvcmRfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2VyL3Jlc2V0X3Bhc3N3b3JkX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9zaWduX2luX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9zaWduX3VwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvY3JlYXRlX3VzZXJfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2Vycy9pbmRleF91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvc2hvd191c2VyX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBRUEsT0FDRSxDQUFDLE1BREgsQ0FDVSxLQURWLEVBQ2lCLENBQ2IseUJBRGEsRUFFYixXQUZhLEVBR2IsWUFIYSxFQUliLGNBSmEsRUFLYixVQUxhLEVBTWIsUUFOYSxFQU9iLGVBUGEsRUFRYixjQVJhLEVBU2IsY0FUYSxDQURqQixDQVdJLENBQUMsTUFYTCxDQVdZLFNBQ1IsY0FEUSxFQUVSLGtCQUZRLEVBR1IsYUFIUSxFQUlSLGlCQUpRO0VBTVIsaUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsSUFBNUI7RUFHQSxhQUFhLENBQUMsUUFBZCxHQUF5QjtFQUN6QixhQUFhLENBQUMsU0FBZCxHQUEwQjtFQUMxQixrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixlQUE3QjtFQUVBLGNBQ0UsQ0FBQyxLQURILENBQ1MsR0FEVCxFQUVJO0lBQUEsR0FBQSxFQUFLLEdBQUw7SUFDQSxXQUFBLEVBQWEsMEJBRGI7SUFFQSxVQUFBLEVBQVksdUJBRlo7R0FGSixDQVFFLENBQUMsS0FSSCxDQVFTLFNBUlQsRUFTSTtJQUFBLEdBQUEsRUFBSyxlQUFMO0lBQ0EsV0FBQSxFQUFhLDRCQURiO0lBRUEsVUFBQSxFQUFZLDBCQUZaO0dBVEosQ0FhRSxDQUFDLEtBYkgsQ0FhUyxTQWJULEVBY0k7SUFBQSxHQUFB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LEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBUCxHQUFnQixrQkFBQSxHQUFxQixFQUFFLENBQUMsR0FBRyxDQUFDLE9BSDlDOztJQUlBLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBUCxHQUFjLE1BQUEsQ0FBVyxJQUFBLElBQUEsQ0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQVosQ0FBWCxDQUE2QixDQUFDLE1BQTlCLENBQXFDLFlBQXJDO0VBTm1CLENBQW5DLEVBUUUsU0FBQyxLQUFEO0lBQ0EsRUFBRSxDQUFDLEtBQUgsR0FBVyxLQUFLLENBQUM7RUFEakIsQ0FSRjtBQWRhOztBQTZCZjs7QUFDQSxPQUNFLENBQUMsTUFESCxDQUNVLEtBRFYsQ0FFRSxDQUFDLFVBRkgsQ0FFYyxjQUZkLEVBRThCLFlBRjlCIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcsIFtcbiAgICAnYXBwLnB1c2hlck5vdGlmaWNhdGlvbnMnLFxuICAgICd1aS5yb3V0ZXInLFxuICAgICdzYXRlbGxpemVyJyxcbiAgICAndWkuYm9vdHN0cmFwJyxcbiAgICAnbmdMb2Rhc2gnLFxuICAgICduZ01hc2snLFxuICAgICdhbmd1bGFyTW9tZW50JyxcbiAgICAnZWFzeXBpZWNoYXJ0JyxcbiAgICAnbmdGaWxlVXBsb2FkJyxcbiAgXSkuY29uZmlnKChcbiAgICAkc3RhdGVQcm92aWRlcixcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIsXG4gICAgJGF1dGhQcm92aWRlcixcbiAgICAkbG9jYXRpb25Qcm92aWRlclxuICApIC0+XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlIHRydWVcbiAgICAjIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcbiAgICAjIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXG4gICAgJGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZSdcbiAgICAkYXV0aFByb3ZpZGVyLnNpZ251cFVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9yZWdpc3RlcidcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlICcvdXNlci9zaWduX2luJ1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgIC5zdGF0ZSgnLycsXG4gICAgICAgIHVybDogJy8nXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvcGFnZXMvaG9tZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhIb21lQ3RybCBhcyBob21lJ1xuICAgICAgKVxuXG4gICAgICAjIFVTRVJcbiAgICAgIC5zdGF0ZSgnc2lnbl9pbicsXG4gICAgICAgIHVybDogJy91c2VyL3NpZ25faW4nXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9zaWduX2luLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduSW5Db250cm9sbGVyIGFzIGF1dGgnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3NpZ25fdXAnLFxuICAgICAgICB1cmw6ICcvdXNlci9zaWduX3VwJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvc2lnbl91cC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2lnblVwQ29udHJvbGxlciBhcyByZWdpc3RlcidcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc2lnbl91cF9zdWNjZXNzJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvc2lnbl91cF9zdWNjZXNzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvc2lnbl91cF9zdWNjZXNzLmh0bWwnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ2ZvcmdvdF9wYXNzd29yZCcsXG4gICAgICAgIHVybDogJy91c2VyL2ZvcmdvdF9wYXNzd29yZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL2ZvcmdvdF9wYXNzd29yZC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRm9yZ290UGFzc3dvcmRDb250cm9sbGVyIGFzIGZvcmdvdFBhc3N3b3JkJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdyZXNldF9wYXNzd29yZCcsXG4gICAgICAgIHVybDogJy91c2VyL3Jlc2V0X3Bhc3N3b3JkLzpyZXNldF9wYXNzd29yZF9jb2RlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvcmVzZXRfcGFzc3dvcmQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0UGFzc3dvcmRDb250cm9sbGVyIGFzIHJlc2V0UGFzc3dvcmQnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ2NvbmZpcm0nLFxuICAgICAgICB1cmw6ICcvdXNlci9jb25maXJtLzpjb25maXJtYXRpb25fY29kZSdcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbmZpcm1Db250cm9sbGVyJ1xuICAgICAgKVxuXG4gICAgICAjIFByb2ZpbGVcbiAgICAgIC5zdGF0ZSgncHJvZmlsZScsXG4gICAgICAgIHVybDogJy9wcm9maWxlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3Byb2ZpbGUvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4UHJvZmlsZUN0cmwgYXMgcHJvZmlsZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncHJvZmlsZV9lZGl0JyxcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUvZWRpdCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9wcm9maWxlL2VkaXQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0VkaXRQcm9maWxlQ3RybCBhcyBwcm9maWxlJ1xuICAgICAgKVxuXG4gICAgICAjIFN0b3Jlc1xuICAgICAgLnN0YXRlKCdzdG9yZXMnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhTdG9yZUN0cmwgYXMgc3RvcmVzJ1xuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgZmxhc2hTdWNjZXNzOiBudWxsXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3N0b3Jlc19jcmVhdGUnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzL2NyZWF0ZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvY3JlYXRlLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVTdG9yZUN0cmwgYXMgc3RvcmUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3N0b3Jlc19lZGl0JyxcbiAgICAgICAgdXJsOiAnL3N0b3Jlcy86aWQvZWRpdCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvZWRpdC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRWRpdFN0b3JlQ3RybCBhcyBzdG9yZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc3RvcmVzX3Nob3cnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzLzppZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvc2hvdy5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2hvd1N0b3JlQ3RybCBhcyBzdG9yZSdcbiAgICAgIClcblxuICAgICAgIyBVc2Vyc1xuICAgICAgLnN0YXRlKCd1c2VycycsXG4gICAgICAgIHVybDogJy91c2VycydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2Vycy9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhVc2VyQ3RybCBhcyB1c2VycydcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIGZsYXNoU3VjY2VzczogbnVsbFxuICAgICAgKVxuICAgICAgLnN0YXRlKCd1c2Vyc19jcmVhdGUnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvY3JlYXRlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXJzL2NyZWF0ZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlVXNlckN0cmwgYXMgdXNlcidcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgndXNlcnNfc2hvdycsXG4gICAgICAgIHVybDogJy91c2Vycy86aWQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlcnMvc2hvdy5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2hvd1VzZXJDdHJsIGFzIHVzZXInXG4gICAgICApXG5cbiAgICAgICMgUm91dGVzXG4gICAgICAuc3RhdGUoJ3JvdXRlcycsXG4gICAgICAgIHVybDogJy9yb3V0ZXMnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFJvdXRlQ3RybCBhcyByb3V0ZXMnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICBmbGFzaFN1Y2Nlc3M6IG51bGxcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncm91dGVzX2NyZWF0ZScsXG4gICAgICAgIHVybDogJy9yb3V0ZXMvY3JlYXRlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9jcmVhdGUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVJvdXRlQ3RybCBhcyByb3V0ZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncm91dGVzX2VkaXQnLFxuICAgICAgICB1cmw6ICcvcm91dGVzLzppZC9lZGl0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9lZGl0Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0Um91dGVDdHJsIGFzIHJvdXRlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdyb3V0ZXNfc2hvdycsXG4gICAgICAgIHVybDogJy9yb3V0ZXMvOmlkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9zaG93Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaG93Um91dGVDdHJsIGFzIHJvdXRlJ1xuICAgICAgKVxuXG4gICAgICAjIE1hcFxuICAgICAgLnN0YXRlKCdtYXAnLFxuICAgICAgICB1cmw6ICcvbWFwJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL21hcC9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhNYXBDdHJsIGFzIG1hcCdcbiAgICAgIClcblxuICAgIHJldHVyblxuXG4gICkucnVuICgkYXV0aCwgJGh0dHAsICRsb2NhdGlvbiwgJHEsICRyb290U2NvcGUsICRzdGF0ZSkgLT5cbiAgICBwdWJsaWNSb3V0ZXMgPSBbXG4gICAgICAnc2lnbl91cCcsXG4gICAgICAnY29uZmlybScsXG4gICAgICAnZm9yZ290X3Bhc3N3b3JkJyxcbiAgICAgICdyZXNldF9wYXNzd29yZCcsXG4gICAgXVxuXG4gICAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGV2ZW50LCB0b1N0YXRlKSAtPlxuICAgICAgaWYgISRhdXRoLmlzQXV0aGVudGljYXRlZCgpICYmXG4gICAgICBwdWJsaWNSb3V0ZXMuaW5kZXhPZih0b1N0YXRlLm5hbWUpID09IC0xXG4gICAgICAgICRsb2NhdGlvbi5wYXRoICd1c2VyL3NpZ25faW4nXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBpZiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSAmJlxuICAgICAgKHB1YmxpY1JvdXRlcy5pbmRleE9mKHRvU3RhdGUubmFtZSkgPT0gMCB8fFxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50U3RhdGUgPT0gJ3NpZ25faW4nKVxuICAgICAgICAkbG9jYXRpb24ucGF0aCAnLydcblxuICAgICAgdXNlciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKSlcblxuICAgICAgaWYgdXNlciAmJiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKVxuICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG5cbiAgICAgICAgaWYgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9ICcvaW1hZ2VzLycgK1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gJ3VwbG9hZHMvYXZhdGFycy8nICtcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyXG5cbiAgICAgICRyb290U2NvcGUubG9nb3V0ID0gLT5cbiAgICAgICAgJGF1dGgubG9nb3V0KCkudGhlbiAtPlxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtICd1c2VyJ1xuICAgICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IGZhbHNlXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGxcblxuICAgICAgICAgICRzdGF0ZS5nbyAnc2lnbl9pbidcblxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuXG4gICAgcmV0dXJuXG4iLCIndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAucHVzaGVyTm90aWZpY2F0aW9ucycsIFtcbiAgICAnbm90aWZpY2F0aW9uJ1xuICBdKVxuICAucnVuICgkbm90aWZpY2F0aW9uLCAkcm9vdFNjb3BlKSAtPlxuICAgIG5ld1JvdXRlTWVzc2FnZSA9ICdZT1UgSEFWRSBBIE5FVyBST1VURS4nXG4gICAgcmVkVHJ1Y2tJY29uID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcbiAgICBwdXNoZXIgPSBuZXcgUHVzaGVyKCc2YjU4YzEyNDNkZjgyMDI4YTc4OCcsIHtcbiAgICAgIGNsdXN0ZXI6ICdldScsXG4gICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgfSlcbiAgICBjaGFubmVsID0gcHVzaGVyLnN1YnNjcmliZSgnbmV3LXJvdXRlLWNoYW5uZWwnKVxuXG4gICAgY2hhbm5lbC5iaW5kKCdBcHBcXFxcRXZlbnRzXFxcXE5ld1JvdXRlJywgKGRhdGEpIC0+XG5cbiAgICAgIGlmICRyb290U2NvcGUuY3VycmVudFVzZXIuaWQgPT0gcGFyc2VJbnQoZGF0YS51c2VySWQpXG4gICAgICAgICRub3RpZmljYXRpb24oJ05ldyBtZXNzYWdlIScsIHtcbiAgICAgICAgICBib2R5OiBuZXdSb3V0ZU1lc3NhZ2UsXG4gICAgICAgICAgaWNvbjogcmVkVHJ1Y2tJY29uLFxuICAgICAgICAgIHZpYnJhdGU6IFsyMDAsIDEwMCwgMjAwXSxcbiAgICAgICAgfSlcbiAgICApXG5cbiAgICByZXR1cm5cbiIsImNoZWNrYm94RmllbGQgPSAoKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9jaGVja2JveF9maWVsZC5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgbGFiZWw6ICc9bGFiZWwnLFxuICAgICAgYXR0ckNsYXNzOiAnPT9hdHRyQ2xhc3MnLFxuICAgICAgbmdDaGVja2VkOiAnPT9uZ0NoZWNrZWQnLFxuICAgICAgbW9kZWw6ICc9bW9kZWwnLFxuICAgIH0sXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgaWYgc2NvcGUubW9kZWwgPT0gJzEnXG4gICAgICAgIHNjb3BlLm1vZGVsID0gdHJ1ZVxuICAgICAgZWxzZSBpZiBzY29wZS5tb2RlbCA9PSAnMCdcbiAgICAgICAgc2NvcGUubW9kZWwgPSBmYWxzZVxuXG4gICAgICByZXR1cm5cbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnY2hlY2tib3hGaWVsZCcsIGNoZWNrYm94RmllbGRcbiIsImRhdGV0aW1lcGlja2VyID0gKCR0aW1lb3V0KSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9kYXRldGltZXBpY2tlci5odG1sJyxcbiAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGxhYmVsOiBcIj0/bGFiZWxcIixcbiAgICB9LFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0ciwgbmdNb2RlbCkgLT5cbiAgICAgIHNjb3BlLm9wZW4gPSAoKSAtPlxuICAgICAgICBzY29wZS5kYXRlX29wZW5lZCA9IHRydWVcblxuICAgICAgJHRpbWVvdXQoXG4gICAgICAgICgoKSAtPlxuICAgICAgICAgIHNjb3BlLm1vZGVsID0gRGF0ZS5wYXJzZShuZ01vZGVsLiR2aWV3VmFsdWUpXG4gICAgICAgICksIDQwMFxuICAgICAgKVxuXG4gICAgICBzY29wZS5zZWxlY3REYXRlID0gKChtb2RlbCkgLT5cbiAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1vZGVsKVxuICAgICAgKVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdkYXRldGltZXBpY2tlcicsIGRhdGV0aW1lcGlja2VyXG4iLCJkZWxldGVBdmF0YXIgPSAoJHRpbWVvdXQpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJyxcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2RlbGV0ZV9hdmF0YXIuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIHJlbW92ZUF2YXRhcjogJz1uZ01vZGVsJyxcbiAgICAgIGZpbGU6IFwiPWZpbGVcIixcbiAgICB9LFxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMpIC0+XG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnaW1nTmFtZScsICh2YWx1ZSkgLT5cbiAgICAgICAgc2NvcGUuaW1nTmFtZSA9IHZhbHVlXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHNjb3BlLnJlbW92ZSA9ICgpIC0+XG4gICAgICAgICR0aW1lb3V0KCgpIC0+XG4gICAgICAgICAgc2NvcGUuaW1nTmFtZSA9ICdpbWFnZXMvZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgc2NvcGUuZmlsZSAhPSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICAgIHNjb3BlLnJlbW92ZUF2YXRhciA9IHRydWVcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnZGVsZXRlQXZhdGFyJywgZGVsZXRlQXZhdGFyXG4iLCJmaWxlRmllbGQgPSAoKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2ZpbGVfZmllbGQuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGF0dHJJZDogJz0nLFxuICAgICAgbmdNb2RlbDogJz1uZ01vZGVsJyxcbiAgICAgIHJlbW92ZUF2YXRhcjogJz0/cmVtb3ZlZEF2YXRhcicsXG4gICAgfSxcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBlbGVtZW50LmJpbmQgJ2NoYW5nZScsIChjaGFuZ2VFdmVudCkgLT5cbiAgICAgICAgc2NvcGUubmdNb2RlbCA9IGV2ZW50LnRhcmdldC5maWxlc1xuICAgICAgICBzY29wZS5yZW1vdmVBdmF0YXIgPSBmYWxzZSAjIGZvciBkZWxldGVfYXZhdGFyIGRpcmVjdGl2ZVxuICAgICAgICBmaWxlcyA9IGV2ZW50LnRhcmdldC5maWxlc1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGVzWzBdLm5hbWVcblxuICAgICAgICBlbGVtZW50WzBdXG4gICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9dGV4dF0nKVxuICAgICAgICAgIC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgZmlsZU5hbWUpXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2ZpbGVGaWVsZCcsIGZpbGVGaWVsZFxuIiwicGFnaW5hdGlvbiA9ICgkaHR0cCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYWdpbmF0aW9uLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBwYWdpQXJyOiAnPScsXG4gICAgICBpdGVtczogJz0nLFxuICAgICAgcGFnaUFwaVVybDogJz0nLFxuICAgIH0sXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgc2NvcGUuJHdhdGNoICgoKSAtPlxuICAgICAgICBzY29wZS5wYWdpQXJyXG4gICAgICApLCAoKG5ld1ZhbHVlLCBvbGRWYWx1ZSkgLT5cbiAgICAgICAgaWYgIWFuZ3VsYXIuZXF1YWxzKG9sZFZhbHVlLCBuZXdWYWx1ZSlcbiAgICAgICAgICBzY29wZS5wYWdpQXJyID0gbmV3VmFsdWVcbiAgICAgICAgICBzY29wZS50b3RhbFBhZ2VzID0gc2NvcGUucGFnaUFyci5sYXN0X3BhZ2VcbiAgICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IHNjb3BlLnBhZ2lBcnIuY3VycmVudF9wYWdlXG4gICAgICAgICAgc2NvcGUudG90YWwgPSBzY29wZS5wYWdpQXJyLnRvdGFsXG4gICAgICAgICAgc2NvcGUucGVyUGFnZSA9IHNjb3BlLnBhZ2lBcnIucGVyX3BhZ2VcblxuICAgICAgICAgICMgUGFnaW5hdGlvbiBSYW5nZVxuICAgICAgICAgIHNjb3BlLnBhaW5hdGlvblJhbmdlKHNjb3BlLnRvdGFsUGFnZXMpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCB0cnVlXG5cbiAgICAgIHNjb3BlLmdldFBvc3RzID0gKHBhZ2VOdW1iZXIpIC0+XG4gICAgICAgIGlmIHBhZ2VOdW1iZXIgPT0gdW5kZWZpbmVkXG4gICAgICAgICAgcGFnZU51bWJlciA9ICcxJ1xuXG4gICAgICAgICRodHRwLmdldChzY29wZS5wYWdpQXBpVXJsKyc/cGFnZT0nICsgcGFnZU51bWJlcikuc3VjY2VzcyAocmVzcG9uc2UpIC0+XG4gICAgICAgICAgc2NvcGUuaXRlbXMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgc2NvcGUudG90YWxQYWdlcyA9IHJlc3BvbnNlLmxhc3RfcGFnZVxuICAgICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlXG5cbiAgICAgICAgICAjIFBhZ2luYXRpb24gUmFuZ2VcbiAgICAgICAgICBzY29wZS5wYWluYXRpb25SYW5nZShzY29wZS50b3RhbFBhZ2VzKVxuXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHNjb3BlLnBhaW5hdGlvblJhbmdlID0gKHRvdGFsUGFnZXMpIC0+XG4gICAgICAgIHBhZ2VzID0gW11cbiAgICAgICAgaSA9IDFcblxuICAgICAgICB3aGlsZSBpIDw9IHRvdGFsUGFnZXNcbiAgICAgICAgICBwYWdlcy5wdXNoIGlcbiAgICAgICAgICBpKytcblxuICAgICAgICBzY29wZS5yYW5nZSA9IHBhZ2VzXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ3BhZ2luYXRpb24nLCBwYWdpbmF0aW9uXG4iLCJyYWRpb0ZpZWxkID0gKCRodHRwKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9yYWRpb19maWVsZC5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgbmdNb2RlbDogXCI9bmdNb2RlbFwiLFxuICAgICAgbGFiZWw6ICc9bGFiZWwnLFxuICAgICAgYXR0ck5hbWU6ICc9YXR0ck5hbWUnLFxuICAgICAgYXR0clZhbHVlOiAnPWF0dHJWYWx1ZScsXG4gICAgICBuZ0NoZWNrZWQ6ICc9P25nQ2hlY2tlZCcsXG4gICAgfSxcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUuYXR0clZhbHVlXG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2hhbmdlJywgKCkgLT5cbiAgICAgICAgc2NvcGUubmdNb2RlbCA9IHNjb3BlLmF0dHJWYWx1ZVxuICAgICAgKVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdyYWRpb0ZpZWxkJywgcmFkaW9GaWVsZFxuIiwidGltZXBpY2tlciA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL3RpbWVwaWNrZXIuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIG1vZGVsOiBcIj1uZ01vZGVsXCIsXG4gICAgICBsYWJlbDogXCI9P2xhYmVsXCIsXG4gICAgICBhdHRyTmFtZTogXCJAXCIsXG4gICAgfSxcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBzY29wZS5oc3RlcCA9IDFcbiAgICAgIHNjb3BlLm1zdGVwID0gNVxuICAgICAgc2NvcGUuaXNtZXJpZGlhbiA9IHRydWVcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAndGltZXBpY2tlcicsIHRpbWVwaWNrZXJcbiIsIkluZGV4SG9tZUN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gICMgUm91dGVzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvaG9tZSdcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuXG4gICMgTWFwXG4gIGFwaUtleSA9ICdhMzAzZDNhNDRhMDFjOWY4YTVjYjAxMDdiMDMzZWZiZSdcbiAgdm0ubWFya2VycyA9IFtdXG5cbiAgIyMjICBST1VURVMgICMjI1xuICBpZiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJfZ3JvdXAgPT0gJ2FkbWluJ1xuICAgICRodHRwLmdldCgnL2FwaS9ob21lJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgICB2bS5yb3V0ZXMgPSByZXNwb25zZS5kYXRhLmRhdGFcbiAgICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgICAgIHJldHVyblxuICAgIClcblxuICAjIyMgIE1BUCAgIyMjXG4gICMgR2V0IHBvaW50cyBKU09OXG4gICRodHRwKFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnL2FwaS9ob21lL2dldHBvaW50cycpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIGluaXRNYXAoKVxuXG4gICAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcblxuICAgICQoJy5zb3J0LWxpbmsnKS5lYWNoICgpIC0+XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3NvcnQtbGluayBjLXAnKVxuXG4gICAgaWYgdm0uc29ydFJldmVyc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1hc2MnKS5hZGRDbGFzcygnYWN0aXZlLWRlc2MnKVxuICAgIGVsc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1kZXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1hc2MnKVxuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5yb3V0ZXMgPSBvcmRlckJ5KHZtLnJvdXRlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgaW5pdE1hcCA9ICgpIC0+XG4gICAgbWFwT3B0aW9ucyA9IHtcbiAgICAgIHpvb206IDEyLFxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiB7XG4gICAgICAgIHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9CT1RUT00sXG4gICAgICB9LFxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTA3MzUwOSwgLTAuMTI3NzU4MyksXG4gICAgICBzdHlsZXM6IHZtLnN0eWxlcyxcbiAgICB9XG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlXG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2goIHZtLnBvaW50cywgKHZhbHVlLCBrZXkpIC0+XG4gICAgICBhZGRyZXNzID0gdmFsdWUuc3RvcmUuYWRkcmVzc1xuICAgICAgIyBHZW9jb2RlIEFkZHJlc3NlcyBieSBhZGRyZXNzIG5hbWVcbiAgICAgIGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmNhZ2VkYXRhLmNvbS9nZW9jb2RlL3YxL2pzb24/cT1cIiArIGFkZHJlc3MgK1xuICAgICAgICBcIiZwcmV0dHk9MSZrZXk9XCIgKyBhcGlLZXk7XG4gICAgICByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICByZXEub25sb2FkID0gKCkgLT5cbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHBvc2l0aW9uID0gcmVzcG9uc2UucmVzdWx0c1swXS5nZW9tZXRyeVxuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMClcbiAgICAgICAgICAgIGNvbnRlbnRTdHJpbmcgPVxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1hcmtlci1jb250ZW50XCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ0FkZHJlc3M6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUuYWRkcmVzcyArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnUGhvbmU6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUucGhvbmUgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nXG5cbiAgICAgICAgICAgICMgcG9wdXBcbiAgICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpXG5cbiAgICAgICAgICAgICMgc2VsZWN0IGljb25zIGJ5IHN0YXR1cyAoZ3JlZW4gb3IgcmVkKVxuICAgICAgICAgICAgaWYgcGFyc2VJbnQgdmFsdWUuc3RhdHVzXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb25fc2hpcGVkLnBuZydcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbi5wbmcnXG5cbiAgICAgICAgICAgIG1hcmtlciA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFya2VyKShcbiAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWUsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBvdGhlciBtYXJrZXJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgKCkgLT5cbiAgICAgICAgICAgICAgaWYgcHJldkluZm9XaW5kb3dcbiAgICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cgPSBpbmZvV2luZG93XG4gICAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIuZ2V0UG9zaXRpb24oKSkgIyBhbmltYXRlIG1vdmUgYmV0d2VlbiBtYXJrZXJzXG4gICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbiBtYXAsIG1hcmtlclxuXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IGVtcHR5IG1hcCBhcmVhXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsICgpIC0+XG4gICAgICAgICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIEFkZCBuZXcgbWFya2VyIHRvIGFycmF5IGZvciBvdXRzaWRlIG1hcCBsaW5rcyAtXG4gICAgICAgICAgICAjIC0ob3JkZXJlZCBieSBpZCBpbiBiYWNrZW5kKVxuICAgICAgICAgICAgdm0ubWFya2Vycy5wdXNoKG1hcmtlcilcblxuICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgYXBpVXJsLCB0cnVlKVxuICAgICAgcmVxLnNlbmQoKVxuICAgIClcblxuICAgIHJldHVyblxuXG4gIHZtLnN0eWxlcyA9IFtcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnd2F0ZXInLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZTllOWU5JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2xhbmRzY2FwZScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfSxcbiAgICAgICAgeyAnd2VpZ2h0JzogMC4yIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCcsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5sb2NhbCcsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfSxcbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaS5wYXJrJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNkZWRlZGUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3Zpc2liaWxpdHknOiAnb24nIH1cbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3NhdHVyYXRpb24nOiAzNiB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyMzMzMzMzMnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogNDAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLmljb24nXG4gICAgICAnc3R5bGVycyc6IFsgeyAndmlzaWJpbGl0eSc6ICdvZmYnIH0gXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAndHJhbnNpdCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjJmMmYyJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE5IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICAgIHsgJ3dlaWdodCc6IDEuMiB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgIyBHbyB0byBwb2ludCBhZnRlciBjbGljayBvdXRzaWRlIG1hcCBsaW5rXG4gIHZtLmdvVG9Qb2ludCA9IChpZCkgLT5cbiAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKHZtLm1hcmtlcnNbaWRdLCAnY2xpY2snKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhIb21lQ3RybCcsIEluZGV4SG9tZUN0cmwpXG4iLCJJbmRleE1hcEN0cmwgPSAoJGh0dHApIC0+XG4gIHZtID0gdGhpc1xuXG4gICMgTWFwXG4gIGFwaUtleSA9ICdhMzAzZDNhNDRhMDFjOWY4YTVjYjAxMDdiMDMzZWZiZSdcbiAgdm0ubWFya2VycyA9IFtdXG5cbiAgIyBHZXQgcG9pbnRzIEpTT05cbiAgJGh0dHAoXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICB1cmw6ICcvYXBpL21hcCcpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGFcblxuICAgICAgIyBJbml0IG1hcFxuICAgICAgaW5pdE1hcCgpXG5cbiAgICAgIHJldHVyblxuICApXG5cbiAgaW5pdE1hcCA9ICgpIC0+XG4gICAgbWFwT3B0aW9ucyA9IHtcbiAgICAgIHpvb206IDEyLFxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiB7XG4gICAgICAgIHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9CT1RUT00sXG4gICAgICB9XG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDczNTA5LCAtMC4xMjc3NTgzKSxcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzXG4gICAgfVxuXG4gICAgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKVxuICAgIG1hcCA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFwKShtYXBFbGVtZW50LCBtYXBPcHRpb25zKVxuICAgIHByZXZJbmZvV2luZG93ID1mYWxzZVxuXG4gICAgIyBTZXQgbG9jYXRpb25zXG4gICAgYW5ndWxhci5mb3JFYWNoKCB2bS5wb2ludHMsICh2YWx1ZSwga2V5KSAtPlxuICAgICAgYWRkcmVzcyA9IHZhbHVlLnN0b3JlLmFkZHJlc3NcbiAgICAgICMgR2VvY29kZSBBZGRyZXNzZXMgYnkgYWRkcmVzcyBuYW1lXG4gICAgICBhcGlVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW5jYWdlZGF0YS5jb20vZ2VvY29kZS92MS9qc29uP3E9XCIgKyBhZGRyZXNzICtcbiAgICAgICAgXCImcHJldHR5PTEma2V5PVwiICsgYXBpS2V5XG4gICAgICByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gICAgICByZXEub25sb2FkID0gKCkgLT5cbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHBvc2l0aW9uID0gcmVzcG9uc2UucmVzdWx0c1swXS5nZW9tZXRyeVxuXG4gICAgICAgICAgaWYgcmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwXG4gICAgICAgICAgICBjb250ZW50U3RyaW5nID1cbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJtYXJrZXItY29udGVudFwiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdBZGRyZXNzOjwvc3Bhbj4gJyArIHZhbHVlLnN0b3JlLmFkZHJlc3MgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ1Bob25lOjwvc3Bhbj4gJyArIHZhbHVlLnN0b3JlLnBob25lICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPC9kaXY+J1xuXG4gICAgICAgICAgICAjIHBvcHVwXG4gICAgICAgICAgICBpbmZvV2luZG93ID0gbmV3IChnb29nbGUubWFwcy5JbmZvV2luZG93KShjb250ZW50OiBjb250ZW50U3RyaW5nKVxuXG4gICAgICAgICAgIyBzZWxlY3QgaWNvbnMgYnkgc3RhdHVzIChncmVlbiBvciByZWQpXG4gICAgICAgICAgaWYgcGFyc2VJbnQgdmFsdWUuc3RhdHVzXG4gICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbi5wbmcnXG5cbiAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWUsXG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgIyBDbGljayBieSBvdGhlciBtYXJrZXJcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsICgpIC0+XG4gICAgICAgICAgICBpZiBwcmV2SW5mb1dpbmRvd1xuICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuXG4gICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuIG1hcCwgbWFya2VyXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIClcblxuICAgICAgICAgICMgQ2xpY2sgYnkgZW1wdHkgbWFwIGFyZWFcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsICgpIC0+XG4gICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgLVxuICAgICAgICAgICMgLSAob3JkZXJlZCBieSBpZCBpbiBiYWNrZW5kKVxuICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG5cbiAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIGFwaVVybCwgdHJ1ZSlcbiAgICAgIHJlcS5zZW5kKClcbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2U5ZTllOScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdsYW5kc2NhcGUnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCcsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfSxcbiAgICAgICAgeyAnd2VpZ2h0JzogMC4yIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCcsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5sb2NhbCcsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaycsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNkZWRlZGUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuc3Ryb2tlJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9LFxuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LmZpbGwnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3NhdHVyYXRpb24nOiAzNiB9LFxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJyxcbiAgICAgICdzdHlsZXJzJzogWyB7ICd2aXNpYmlsaXR5JzogJ29mZicgfSBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAndHJhbnNpdCcsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmMmYyZjInIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE5IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfSxcbiAgICAgICAgeyAnd2VpZ2h0JzogMS4yIH0sXG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgIyBHbyB0byBwb2ludCBhZnRlciBjbGljayBvdXRzaWRlIG1hcCBsaW5rXG4gIHZtLmdvVG9Qb2ludCA9IChpZCkgLT5cbiAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKHZtLm1hcmtlcnNbaWRdLCAnY2xpY2snKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhNYXBDdHJsJywgSW5kZXhNYXBDdHJsKVxuIiwiRWRpdFByb2ZpbGVDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3Byb2ZpbGUvZWRpdCcpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0udXNlciA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHZtLnVzZXIucmVtb3ZlX2F2YXRhciA9IGZhbHNlXG5cbiAgICAgICMgZm9yIGRlbGV0ZV9hdmF0YXIgZGlyZWN0aXZlXG4gICAgICB2bS5hdmF0YXIgPSB2bS5tYWtlQXZhdGFyTGluayh2bS51c2VyLmF2YXRhcilcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLnVwZGF0ZSA9ICgpIC0+XG4gICAgYXZhdGFyID0gdm0udXNlci5hdmF0YXJcblxuICAgIGlmIHZtLnVzZXIuYXZhdGFyID09ICcvaW1hZ2VzL2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgIHZtLnVzZXIuYXZhdGFyID0gJ2RlZmF1bHRfYXZhdGFyLmpwZycgIyB0b2RvIGh6IG1heSBiZSBmb3IgZGVsZXRlXG4gICAgICBhdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuXG4gICAgdm0uZGF0YSB7XG4gICAgICBhdmF0YXI6IGF2YXRhcixcbiAgICAgIHJlbW92ZV9hdmF0YXI6IHZtLnVzZXIucmVtb3ZlX2F2YXRhcixcbiAgICAgIG5hbWU6IHZtLnVzZXIubmFtZSxcbiAgICAgIGxhc3RfbmFtZTogdm0udXNlci5sYXN0X25hbWUsXG4gICAgICBpbml0aWFsczogdm0udXNlci5pbml0aWFscyxcbiAgICAgIGJkYXk6IHZtLnVzZXIuYmRheSxcbiAgICAgIGVtYWlsOiB2bS51c2VyLmVtYWlsLFxuICAgICAgcGhvbmU6IHZtLnVzZXIucGhvbmUsXG4gICAgICBqb2JfdGl0bGU6IHZtLnVzZXIuam9iX3RpdGxlLFxuICAgICAgY291bnRyeTogdm0udXNlci5jb3VudHJ5LFxuICAgICAgY2l0eTogdm0udXNlci5jaXR5LFxuICAgIH1cblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3Byb2ZpbGUvJyArIHZtLnVzZXIuaWQsXG4gICAgICBtZXRob2Q6ICdQb3N0JyxcbiAgICAgIGRhdGE6IHZtLmRhdGEsXG4gICAgKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICBmaWxlTmFtZSA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpXG4gICAgICBzdG9yYWdlID0gSlNPTi5wYXJzZShzdG9yYWdlKVxuXG4gICAgICAjIERlZmF1bHQgYXZhdGFyXG4gICAgICBpZiAodHlwZW9mIGZpbGVOYW1lID09ICdib29sZWFuJyAmJiB2bS51c2VyLnJlbW92ZV9hdmF0YXIpXG4gICAgICAgIHN0b3JhZ2UuYXZhdGFyID0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSAgJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICMgVXBkYXRlIHN0b3JhZ2VcbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBmaWxlTmFtZSA9PSAnc3RyaW5nJyAmJiAhdm0udXNlci5yZW1vdmVfYXZhdGFyKVxuICAgICAgICBzdG9yYWdlLmF2YXRhciA9IGZpbGVOYW1lXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gdm0ubWFrZUF2YXRhckxpbmsoc3RvcmFnZS5hdmF0YXIpXG4gICAgICAgIHN0b3JhZ2UuYXZhdGFyID0gZmlsZU5hbWVcblxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCBKU09OLnN0cmluZ2lmeShzdG9yYWdlKSlcblxuICAgICAgJHN0YXRlLmdvICdwcm9maWxlJywgeyBmbGFzaFN1Y2Nlc3M6ICdQcm9maWxlIHVwZGF0ZWQhJyB9XG4gICAgKSwgKChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpXG5cbiAgICAgIHJldHVyblxuICAgIClcblxuICB2bS5tYWtlQXZhdGFyTGluayA9IChhdmF0YXJOYW1lKSAtPlxuICAgIGlmIGF2YXRhck5hbWUgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgIGF2YXRhck5hbWUgPSAnL2ltYWdlcy8nICsgYXZhdGFyTmFtZVxuICAgIGVsc2VcbiAgICAgIGF2YXRhck5hbWUgPSAnL3VwbG9hZHMvYXZhdGFycy8nICsgYXZhdGFyTmFtZVxuXG4gICAgcmV0dXJuIGF2YXRhck5hbWVcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0VkaXRQcm9maWxlQ3RybCcsIEVkaXRQcm9maWxlQ3RybClcbiIsIkluZGV4UHJvZmlsZUN0cmwgPSAoJGh0dHApIC0+XG4gIHZtID0gdGhpc1xuXG4gICRodHRwLmdldCgnL2FwaS9wcm9maWxlJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS51c2VyID0gcmVzcG9uc2UuZGF0YS51c2VyXG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhLnBvaW50c1xuXG4gICAgICBpZiB2bS51c2VyLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICB2bS51c2VyLmF2YXRhciA9ICcvaW1hZ2VzLycgKyB2bS51c2VyLmF2YXRhclxuICAgICAgZWxzZVxuICAgICAgICB2bS51c2VyLmF2YXRhciA9ICd1cGxvYWRzL2F2YXRhcnMvJyArIHZtLnVzZXIuYXZhdGFyXG5cbiAgICAgIHZtLnVzZXIuYmRheSA9IG1vbWVudChuZXcgRGF0ZSh2bS51c2VyLmJkYXkpKS5mb3JtYXQoJ0RELk1NLllZWVknKVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlUG9pbnRzID0gKCkgLT5cbiAgICAkaHR0cC5wdXQoJy9hcGkvcHJvZmlsZS91cGRhdGVwb2ludHMnLCB2bS5wb2ludHMpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdQb2ludHMgdXBkYXRlZCEnXG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleFByb2ZpbGVDdHJsJywgSW5kZXhQcm9maWxlQ3RybClcbiIsIkNyZWF0ZVJvdXRlQ3RybCA9ICgkaHR0cCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0ucG9pbnRGb3JtcyA9IFtdXG5cbiAgJGh0dHAucG9zdCgnL2FwaS9yb3V0ZXMvZ2V0VXNlcnNBbmRTdG9yZXMnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLmNyZWF0ZVJvdXRlID0gKCkgLT5cbiAgICB2bS5yb3V0ZSA9IHtcbiAgICAgIHVzZXJfaWQ6IHZtLnVzZXJfaWQsXG4gICAgICBkYXRlOiB2bS5kYXRlLFxuICAgICAgcG9pbnRzOiB2bS5wb2ludEZvcm1zLFxuICAgIH1cblxuICAgICRodHRwLnBvc3QoJy9hcGkvcm91dGVzJywgdm0ucm91dGUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG5cbiAgICAgICAgJHN0YXRlLmdvICdyb3V0ZXMnLCB7IGZsYXNoU3VjY2VzczogJ05ldyByb3V0ZSBoYXMgYmVlbiBhZGRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpXG5cbiAgICByZXR1cm5cblxuICB2bS5hZGRQb2ludCA9ICgpIC0+XG4gICAgdm0ucG9pbnRGb3Jtcy5wdXNoKHt9KVxuXG4gIHZtLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgIHZtLnBvaW50Rm9ybXMuc3BsaWNlKGluZGV4LCAxKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlUm91dGVDdHJsJywgQ3JlYXRlUm91dGVDdHJsKVxuIiwiRWRpdFJvdXRlQ3RybCA9ICgkc2NvcGUsICRodHRwLCAkc3RhdGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG4gIHZtLmNvdW50ID0gMVxuXG4gICRodHRwLmdldCgnL2FwaS9yb3V0ZXMvZWRpdC8nKyB2bS5pZClcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG5cbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICByb3V0ZSA9IHtcbiAgICAgIHVzZXJfaWQ6IHZtLm9iai51c2VyX2lkLFxuICAgICAgZGF0ZTogdm0ub2JqLmRhdGUsXG4gICAgICBwb2ludHM6IHZtLm9iai5wb2ludHMsXG4gICAgfVxuXG4gICAgJGh0dHAucGF0Y2goJy9hcGkvcm91dGVzLycgKyB2bS5pZCwgcm91dGUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdSb3V0ZSBVcGRhdGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcilcblxuICB2bS5hZGRQb2ludCA9ICgpIC0+XG4gICAgdm0ub2JqLnBvaW50cy5wdXNoKHtcbiAgICAgIGlkOiB2bS5jb3VudCArICdfbmV3J1xuICAgIH0pXG5cbiAgICB2bS5jb3VudCsrXG5cbiAgICByZXR1cm5cblxuICB2bS5yZW1vdmVQb2ludCA9IChpbmRleCkgLT5cbiAgICB2bS5vYmoucG9pbnRzLnNwbGljZShpbmRleCwgMSlcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0VkaXRSb3V0ZUN0cmwnLCBFZGl0Um91dGVDdHJsKVxuIiwiSW5kZXhSb3V0ZUN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvcm91dGVzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBGbGFzaCBmcm9tIG90aGVycyBwYWdlc1xuICBpZiAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG4gICAgdm0uZmxhc2hTdWNjZXNzID0gJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuXG4gICRodHRwLmdldCgnL2FwaS9yb3V0ZXMnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5yb3V0ZXMgPSByZXNwb25zZS5kYXRhLmRhdGFcbiAgICB2bS5wYWdpQXJyID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG5cbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJylcblxuICAgIHZtLnByZWRpY2F0ZSA9IHByZWRpY2F0ZVxuICAgIHZtLnJldmVyc2UgPSBpZiAodm0ucHJlZGljYXRlID09IHByZWRpY2F0ZSkgdGhlbiAhdm0ucmV2ZXJzZSBlbHNlIGZhbHNlXG4gICAgdm0ucm91dGVzID0gb3JkZXJCeSh2bS5yb3V0ZXMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG4gIHZtLmRlbGV0ZVJvdXRlID0gKGlkLCBpbmRleCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCcvYXBpL3JvdXRlcy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgIyBEZWxldGUgZnJvbSBzY29wZVxuICAgICAgICB2bS5yb3V0ZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnUm91dGUgZGVsZXRlZCEnXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICByZXR1cm5cblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4Um91dGVDdHJsJywgSW5kZXhSb3V0ZUN0cmwpXG4iLCJTaG93Um91dGVDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG5cbiAgIyBNYXBcbiAgYXBpS2V5ID0gJ2EzMDNkM2E0NGEwMWM5ZjhhNWNiMDEwN2IwMzNlZmJlJ1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIEdldCBwb2ludHNcbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcy8nICsgdm0uaWQpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucm91dGUgPSByZXNwb25zZS5kYXRhLnJvdXRlXG4gICAgICB2bS5zdG9yZXMgPSByZXNwb25zZS5kYXRhLnN0b3Jlc1xuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YS5wb2ludHNcbiAgICAgIHZtLnJvdXRlLmRhdGUgPSBtb21lbnQobmV3IERhdGUodm0ucm91dGUuZGF0ZSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG5cbiAgICAgICMgSW5pdCBtYXBcbiAgICAgIGluaXRNYXAoKVxuXG4gICAgICByZXR1cm5cbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG5cbiAgdm0uZGVsZXRlUm91dGUgPSAoaWQpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9yb3V0ZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdSb3V0ZSBEZWxldGVkIScgfVxuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG5cbiAgIyBXaGVuIHRoZSB3aW5kb3cgaGFzIGZpbmlzaGVkIGxvYWRpbmcgY3JlYXRlIG91ciBnb29nbGUgbWFwIGJlbG93XG4gIGluaXRNYXAgPSAoKSAtPlxuICAgICMgQmFzaWMgb3B0aW9ucyBmb3IgYSBzaW1wbGUgR29vZ2xlIE1hcFxuICAgIG1hcE9wdGlvbnMgPSB7XG4gICAgICB6b29tOiAxMixcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczoge1xuICAgICAgICBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfQk9UVE9NLFxuICAgICAgfSxcbiAgICAgIGNlbnRlcjogbmV3IChnb29nbGUubWFwcy5MYXRMbmcpKDUxLjUwMDE1MiwgLTAuMTI2MjM2KSxcbiAgICAgIHN0eWxlczp2bS5zdHlsZXMsXG4gICAgfVxuXG4gICAgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3V0ZS1tYXAnKVxuICAgIG1hcCA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFwKShtYXBFbGVtZW50LCBtYXBPcHRpb25zKVxuICAgIHByZXZJbmZvV2luZG93ID1mYWxzZVxuXG4gICAgIyBTZXQgbG9jYXRpb25zXG4gICAgYW5ndWxhci5mb3JFYWNoKHZtLnBvaW50cywgKHZhbHVlLCBrZXkpIC0+XG4gICAgICBhZGRyZXNzID0gdmFsdWUuc3RvcmUuYWRkcmVzc1xuICAgICAgIyBHZW9jb2RlIEFkZHJlc3NlcyBieSBhZGRyZXNzIG5hbWVcbiAgICAgIGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmNhZ2VkYXRhLmNvbS9nZW9jb2RlL3YxL2pzb24/cT1cIiArIGFkZHJlc3MgK1xuICAgICAgICBcIiZwcmV0dHk9MSZrZXk9XCIgKyBhcGlLZXlcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiByZXNwb25zZS5zdGF0dXMuY29kZSA9PSAyMDBcbiAgICAgICAgICAgIGNvbnRlbnRTdHJpbmcgPVxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1hcmtlci1jb250ZW50XCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ0FkZHJlc3M6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUuYWRkcmVzcyArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnUGhvbmU6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUucGhvbmUgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAjIHBvcHVwXG4gICAgICAgICAgICBpbmZvV2luZG93ID0gbmV3IChnb29nbGUubWFwcy5JbmZvV2luZG93KShjb250ZW50OiBjb250ZW50U3RyaW5nKVxuXG4gICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICBpY29uOiB2bS5iYWxvb25OYW1lLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsICgpIC0+XG4gICAgICAgICAgICAgIGlmIHByZXZJbmZvV2luZG93XG4gICAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuICAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAoKSAtPlxuICAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgLVxuICAgICAgICAgICAgIyAtIChvcmRlcmVkIGJ5IGlkIGluIGJhY2tlbmQpXG4gICAgICAgICAgICB2bS5tYXJrZXJzLnB1c2gobWFya2VyKVxuXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpXG4gICAgICByZXEuc2VuZCgpXG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uc3R5bGVzID0gW1xuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd3YXRlcicsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5JyxcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDI5IH0sXG4gICAgICAgIHsgJ3dlaWdodCc6IDAuMiB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuYXJ0ZXJpYWwnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOCB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH0sXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pLnBhcmsnLFxuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5JyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9LFxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZScsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAndmlzaWJpbGl0eSc6ICdvbicgfSxcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5maWxsJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfSxcbiAgICAgICAgeyAnY29sb3InOiAnIzMzMzMzMycgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogNDAgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMuaWNvbicsXG4gICAgICAnc3R5bGVycyc6IFsgeyAndmlzaWJpbGl0eSc6ICdvZmYnIH0gXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAndHJhbnNpdCcsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknLFxuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmMmYyZjInIH0sXG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE5IH0sXG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCcsXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfSxcbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfSxcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZScsXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJyxcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9LFxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9LFxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfSxcbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICAjIEdvIHRvIHBvaW50IGFmdGVyIGNsaWNrIG91dHNpZGUgbWFwIGxpbmtcbiAgdm0uZ29Ub1BvaW50ID0gKGlkKSAtPlxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodm0ubWFya2Vyc1tpZF0sICdjbGljaycpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaG93Um91dGVDdHJsJywgU2hvd1JvdXRlQ3RybClcbiIsIkNyZWF0ZVN0b3JlQ3RybCA9ICgkc2NvcGUsICRodHRwLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmNyZWF0ZSA9ICgpIC0+XG4gICAgc3RvcmUgPVxuICAgICAgbmFtZTogdm0uc3RvcmVOYW1lXG4gICAgICBvd25lcl9uYW1lOiB2bS5vd25lck5hbWVcbiAgICAgIGFkZHJlc3M6IHZtLmFkZHJlc3NcbiAgICAgIHBob25lOiB2bS5waG9uZVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG5cbiAgICAkaHR0cC5wb3N0KCcvYXBpL3N0b3JlcycsIHN0b3JlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHN0b3JlIGNyZWF0ZWQhJyB9XG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgJHNjb3BlLmdldExvY2F0aW9uID0gKGFkZHJlc3MpIC0+XG4gICAgJGh0dHAuZ2V0KCcvL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uJyxcbiAgICAgIHBhcmFtczpcbiAgICAgICAgYWRkcmVzczogYWRkcmVzc1xuICAgICAgICBsYW5ndWFnZTogJ2VuJ1xuICAgICAgICBjb21wb25lbnRzOiAnY291bnRyeTpVS3xhZG1pbmlzdHJhdGl2ZV9hcmVhOkxvbmRvbidcbiAgICAgIHNraXBBdXRob3JpemF0aW9uOiB0cnVlICMgZm9yIGVycm9lIG9mIC4uIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcbiAgICApLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgcmVzcG9uc2UuZGF0YS5yZXN1bHRzLm1hcCAoaXRlbSkgLT5cbiAgICAgICAgaXRlbS5mb3JtYXR0ZWRfYWRkcmVzc1xuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVN0b3JlQ3RybCcsIENyZWF0ZVN0b3JlQ3RybClcbiIsIkVkaXRTdG9yZUN0cmwgPSAoJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5pZCA9ICRzdGF0ZVBhcmFtcy5pZFxuXG4gICRodHRwLmdldCgnYXBpL3N0b3Jlcy8nK3ZtLmlkKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YVxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnVwZGF0ZSA9ICgpIC0+XG4gICAgc3RvcmUgPVxuICAgICAgbmFtZTogdm0uZGF0YS5uYW1lXG4gICAgICBvd25lcl9uYW1lOiB2bS5kYXRhLm93bmVyX25hbWVcbiAgICAgIGFkZHJlc3M6IHZtLmRhdGEuYWRkcmVzc1xuICAgICAgcGhvbmU6IHZtLmRhdGEucGhvbmVcbiAgICAgIGVtYWlsOiB2bS5kYXRhLmVtYWlsXG5cbiAgICAkaHR0cC5wYXRjaCgnL2FwaS9zdG9yZXMvJyArIHZtLmlkLCBzdG9yZSlcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdzdG9yZXMnLCB7IGZsYXNoU3VjY2VzczogJ1N0b3JlIFVwZGF0ZWQhJyB9XG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgJHNjb3BlLmdldExvY2F0aW9uID0gKGFkZHJlc3MpIC0+XG4gICAgJGh0dHAuZ2V0KCcvL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uJyxcbiAgICAgIHBhcmFtczpcbiAgICAgICAgYWRkcmVzczogYWRkcmVzc1xuICAgICAgICBsYW5ndWFnZTogJ2VuJ1xuICAgICAgICBjb21wb25lbnRzOiAnY291bnRyeTpVS3xhZG1pbmlzdHJhdGl2ZV9hcmVhOkxvbmRvbidcbiAgICAgIHNraXBBdXRob3JpemF0aW9uOiB0cnVlICMgZm9yIGVycm9lIG9mIC4uIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcbiAgICApLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgcmVzcG9uc2UuZGF0YS5yZXN1bHRzLm1hcCAoaXRlbSkgLT5cbiAgICAgICAgaXRlbS5mb3JtYXR0ZWRfYWRkcmVzc1xuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0VkaXRTdG9yZUN0cmwnLCBFZGl0U3RvcmVDdHJsKVxuIiwiSW5kZXhTdG9yZUN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvc3RvcmVzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBGbGFzaCBmcm9tIG90aGVycyBwYWdlc1xuICBpZiAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG4gICAgdm0uZmxhc2hTdWNjZXNzID0gJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuXG4gICRodHRwLmdldCgnYXBpL3N0b3JlcycpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLnN0b3JlcyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpO1xuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5zdG9yZXMgPSBvcmRlckJ5KHZtLnN0b3JlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlU3RvcmUgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvc3RvcmVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAjIERlbGV0ZSBmcm9tIHNjb3BlXG4gICAgICAgIHZtLnN0b3Jlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdTdG9yZSBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4U3RvcmVDdHJsJywgSW5kZXhTdG9yZUN0cmwpXG4iLCJTaG93U3RvcmVDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0uZGVsZXRlU3RvcmUgPSAoaWQpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnYXBpL3N0b3Jlcy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdzdG9yZXMnLCB7IGZsYXNoU3VjY2VzczogJ1N0b3JlIGRlbGV0ZWQhJyB9XG4gICAgICAgIHJldHVyblxuICAgICAgKVxuXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Nob3dTdG9yZUN0cmwnLCBTaG93U3RvcmVDdHJsKSIsIkNvbmZpcm1Db250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUsICRodHRwLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5kYXRhID1cbiAgICBjb25maXJtYXRpb25fY29kZTogJHN0YXRlUGFyYW1zLmNvbmZpcm1hdGlvbl9jb2RlXG5cbiAgJGh0dHAucG9zdCgnYXBpL2F1dGhlbnRpY2F0ZS9jb25maXJtJywgdm0uZGF0YSkuc3VjY2VzcygoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG4gICAgIyBTYXZlIHRva2VuXG4gICAgJGF1dGguc2V0VG9rZW4oZGF0YS50b2tlbilcblxuICAgICMgU2F2ZSB1c2VyIGluIGxvY2FsU3RvcmFnZVxuICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtICd1c2VyJywgdXNlclxuICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gZGF0YVxuXG4gICAgJHN0YXRlLmdvICcvJ1xuICApLmVycm9yIChkYXRhLCBzdGF0dXMsIGhlYWRlciwgY29uZmlnKSAtPlxuICAgICRzdGF0ZS5nbyAnc2lnbl9pbidcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdDb25maXJtQ29udHJvbGxlcicsIENvbmZpcm1Db250cm9sbGVyKVxuXG4iLCJGb3Jnb3RQYXNzd29yZENvbnRyb2xsZXIgPSAoJGh0dHApIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLnJlc3RvcmVQYXNzd29yZCA9ICgpLT5cbiAgICB2bS5zcGlubmVyRG9uZSA9IHRydWVcbiAgICBkYXRhID1cbiAgICAgIGVtYWlsOiB2bS5lbWFpbFxuXG4gICAgJGh0dHAucG9zdCgnYXBpL2F1dGhlbnRpY2F0ZS9zZW5kX3Jlc2V0X2NvZGUnLCBkYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICAgIGlmKGRhdGEpXG4gICAgICAgIHZtLnN1Y2Nlc3NTZW5kaW5nRW1haWwgPSB0cnVlXG4gICAgKS5lcnJvciAoZXJyb3IsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0ZvcmdvdFBhc3N3b3JkQ29udHJvbGxlcicsIEZvcmdvdFBhc3N3b3JkQ29udHJvbGxlcilcblxuIiwiUmVzZXRQYXNzd29yZENvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLm1pbmxlbmd0aCA9IDhcblxuICB2bS5yZXN0b3JlUGFzc3dvcmQgPSAoZm9ybSkgLT5cbiAgICBkYXRhID0ge1xuICAgICAgcmVzZXRfcGFzc3dvcmRfY29kZTogJHN0YXRlUGFyYW1zLnJlc2V0X3Bhc3N3b3JkX2NvZGVcbiAgICAgIHBhc3N3b3JkOiB2bS5wYXNzd29yZFxuICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiB2bS5wYXNzd29yZF9jb25maXJtYXRpb25cbiAgICB9XG5cbiAgICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL3Jlc2V0X3Bhc3N3b3JkJywgZGF0YSkuc3VjY2VzcygoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG4gICAgICBpZihkYXRhKVxuICAgICAgICB2bS5zdWNjZXNzUmVzdG9yZVBhc3N3b3JkID0gdHJ1ZVxuICAgICkuZXJyb3IgKGVycm9yLCBzdGF0dXMsIGhlYWRlciwgY29uZmlnKSAtPlxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdSZXNldFBhc3N3b3JkQ29udHJvbGxlcicsIFJlc2V0UGFzc3dvcmRDb250cm9sbGVyKVxuXG4iLCJTaWduSW5Db250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUsICRodHRwLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5sb2dpbiA9ICgpIC0+XG4gICAgY3JlZGVudGlhbHMgPVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcblxuICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuICgtPlxuICAgICAgIyBSZXR1cm4gYW4gJGh0dHAgcmVxdWVzdCBmb3IgdGhlIG5vdyBhdXRoZW50aWNhdGVkXG4gICAgICAjIHVzZXIgc28gdGhhdCB3ZSBjYW4gZmxhdHRlbiB0aGUgcHJvbWlzZSBjaGFpblxuICAgICAgJGh0dHAuZ2V0KCdhcGkvYXV0aGVudGljYXRlL2dldF91c2VyJykudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5kYXRhLnVzZXIpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtICd1c2VyJywgdXNlclxuICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXJcblxuICAgICAgICAkc3RhdGUuZ28gJy8nXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICApLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIGNvbnNvbGUubG9nKHZtLmVycm9yKTtcblxuICAgICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2lnbkluQ29udHJvbGxlcicsIFNpZ25JbkNvbnRyb2xsZXIpXG4iLCJTaWduVXBDb250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLnJlZ2lzdGVyID0gKCktPlxuICAgIHZtLnNwaW5uZXJEb25lID0gdHJ1ZVxuICAgIGlmIHZtLnVzZXJcbiAgICAgIGNyZWRlbnRpYWxzID1cbiAgICAgICAgbmFtZTogdm0udXNlci5uYW1lXG4gICAgICAgIGVtYWlsOiB2bS51c2VyLmVtYWlsXG4gICAgICAgIHBhc3N3b3JkOiB2bS51c2VyLnBhc3N3b3JkXG4gICAgICAgIHBhc3N3b3JkX2NvbmZpcm1hdGlvbjogdm0udXNlci5wYXNzd29yZF9jb25maXJtYXRpb25cblxuICAgICRhdXRoLnNpZ251cChjcmVkZW50aWFscykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgICAkc3RhdGUuZ28gJ3NpZ25fdXBfc3VjY2VzcydcbiAgICAgIHJldHVyblxuICAgICkuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaWduVXBDb250cm9sbGVyJywgU2lnblVwQ29udHJvbGxlcilcbiIsIlVzZXJDb250cm9sbGVyID0gKCRodHRwLCAkc3RhdGUsICRhdXRoLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5nZXRVc2VycyA9IC0+XG4gICAgIyBUaGlzIHJlcXVlc3Qgd2lsbCBoaXQgdGhlIGluZGV4IG1ldGhvZCBpbiB0aGUgQXV0aGVudGljYXRlQ29udHJvbGxlclxuICAgICMgb24gdGhlIExhcmF2ZWwgc2lkZSBhbmQgd2lsbCByZXR1cm4gdGhlIGxpc3Qgb2YgdXNlcnNcbiAgICAkaHR0cC5nZXQoJ2FwaS9hdXRoZW50aWNhdGUnKS5zdWNjZXNzKCh1c2VycykgLT5cbiAgICAgIHZtLnVzZXJzID0gdXNlcnNcbiAgICAgIHJldHVyblxuICAgICkuZXJyb3IgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgdm0ubG9nb3V0ID0gLT5cbiAgICAkYXV0aC5sb2dvdXQoKS50aGVuIC0+XG4gICAgICAjIFJlbW92ZSB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGZyb20gbG9jYWwgc3RvcmFnZVxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0gJ3VzZXInXG4gICAgICAjIEZsaXAgYXV0aGVudGljYXRlZCB0byBmYWxzZSBzbyB0aGF0IHdlIG5vIGxvbmdlclxuICAgICAgIyBzaG93IFVJIGVsZW1lbnRzIGRlcGVuZGFudCBvbiB0aGUgdXNlciBiZWluZyBsb2dnZWQgaW5cbiAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IGZhbHNlXG4gICAgICAjIFJlbW92ZSB0aGUgY3VycmVudCB1c2VyIGluZm8gZnJvbSByb290c2NvcGVcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsXG4gICAgICAkc3RhdGUuZ28gJ3NpZ25faW4nXG5cbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1VzZXJDb250cm9sbGVyJywgVXNlckNvbnRyb2xsZXIpXG4iLCJDcmVhdGVVc2VyQ3RybCA9ICgkaHR0cCwgJHN0YXRlLCBVcGxvYWQsIGxvZGFzaCkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmNoYXJzID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6IUAjJCVeJiooKS0rPD5BQkNERUZHSElKS0xNTk9QMTIzNDU2Nzg5MCdcblxuICAkaHR0cC5nZXQoJy9hcGkvdXNlcnMvY3JlYXRlJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5lbnVtcyA9IHJlc3BvbnNlLmRhdGFcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLmFkZFVzZXIgPSAoKSAtPlxuICAgIHZtLmRhdGEgPVxuICAgICAgbmFtZTogdm0ubmFtZVxuICAgICAgbGFzdF9uYW1lOiB2bS5sYXN0X25hbWVcbiAgICAgIGluaXRpYWxzOiB2bS5pbml0aWFsc1xuICAgICAgYXZhdGFyOiB2bS5hdmF0YXJcbiAgICAgIGJkYXk6IHZtLmJkYXlcbiAgICAgIGpvYl90aXRsZTogdm0uam9iX3RpdGxlXG4gICAgICB1c2VyX2dyb3VwOiB2bS51c2VyX2dyb3VwXG4gICAgICBjb3VudHJ5OiB2bS5jb3VudHJ5XG4gICAgICBjaXR5OiB2bS5jaXR5XG4gICAgICBwaG9uZTogdm0ucGhvbmVcbiAgICAgIGVtYWlsOiB2bS5lbWFpbFxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG5cbiAgICBVcGxvYWQudXBsb2FkKFxuICAgICAgdXJsOiAnL2FwaS91c2VycydcbiAgICAgIG1ldGhvZDogJ1Bvc3QnXG4gICAgICBkYXRhOiB2bS5kYXRhXG4gICAgKS50aGVuICgocmVzcCkgLT5cbiAgICAgICRzdGF0ZS5nbyAndXNlcnMnLCB7IGZsYXNoU3VjY2VzczogJ05ldyB1c2VyIGhhcyBiZWVuIGFkZGVkIScgfVxuICAgICAgcmV0dXJuXG4gICAgKSwgKChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZ2VuZXJhdGVQYXNzID0gKCkgLT5cbiAgICB2bS5wYXNzd29yZCA9ICcnXG4gICAgcGFzc0xlbmd0aCA9IGxvZGFzaC5yYW5kb20oOCwxNSlcbiAgICB4ID0gMFxuXG4gICAgd2hpbGUgeCA8IHBhc3NMZW5ndGhcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2bS5jaGFycy5sZW5ndGgpXG4gICAgICB2bS5wYXNzd29yZCArPSB2bS5jaGFycy5jaGFyQXQoaSlcbiAgICAgIHgrK1xuICAgIHJldHVybiB2bS5wYXNzd29yZFxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVVzZXJDdHJsJywgQ3JlYXRlVXNlckN0cmwpXG4iLCJJbmRleFVzZXJDdHJsID0gKCRodHRwLCAkZmlsdGVyLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL3VzZXJzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBGbGFzaCBmcm9tIG90aGVycyBwYWdlc1xuICBpZiAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG4gICAgdm0uZmxhc2hTdWNjZXNzID0gJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuXG4gICRodHRwLmdldCgnYXBpL3VzZXJzJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0udXNlcnMgPSByZXNwb25zZS5kYXRhLmRhdGFcbiAgICB2bS5wYWdpQXJyID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuICAgICQoJy5zb3J0LWxpbmsnKS5lYWNoICgpIC0+XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3NvcnQtbGluayBjLXAnKVxuXG4gICAgaWYgdm0uc29ydFJldmVyc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1hc2MnKS5hZGRDbGFzcygnYWN0aXZlLWRlc2MnKVxuICAgIGVsc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1kZXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1hc2MnKTtcblxuICAgIHZtLnByZWRpY2F0ZSA9IHByZWRpY2F0ZVxuICAgIHZtLnJldmVyc2UgPSBpZiAodm0ucHJlZGljYXRlID09IHByZWRpY2F0ZSkgdGhlbiAhdm0ucmV2ZXJzZSBlbHNlIGZhbHNlXG4gICAgdm0udXNlcnMgPSBvcmRlckJ5KHZtLnVzZXJzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICB2bS5kZWxldGVVc2VyID0gKGlkLCBpbmRleCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCcvYXBpL3VzZXJzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAjIERlbGV0ZSBmcm9tIHNjb3BlXG4gICAgICAgIHZtLnVzZXJzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1VzZXIgZGVsZXRlZCEnXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICByZXR1cm5cblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleFVzZXJDdHJsJywgSW5kZXhVc2VyQ3RybClcbiIsIlNob3dVc2VyQ3RybCA9ICgkaHR0cCwgJHN0YXRlUGFyYW1zLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5pZCA9ICRzdGF0ZVBhcmFtcy5pZFxuICB2bS5zZXR0aW5ncyA9XG4gICAgbGluZVdpZHRoOiA1LFxuICAgIHRyYWNrQ29sb3I6ICcjZThlZmYwJyxcbiAgICBiYXJDb2xvcjogJyMyN2MyNGMnLFxuICAgIHNjYWxlQ29sb3I6IGZhbHNlLFxuICAgIGNvbG9yOiAnIzNhM2Y1MScsXG4gICAgc2l6ZTogMTM0LFxuICAgIGxpbmVDYXA6ICdidXR0JyxcbiAgICByb3RhdGU6IC05MCxcbiAgICBhbmltYXRlOiAxMDAwXG5cbiAgJGh0dHAuZ2V0KCdhcGkvdXNlcnMvJyt2bS5pZCkudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0ub2JqID0gcmVzcG9uc2UuZGF0YVxuICAgIGlmIHZtLm9iai5hdmF0YXIgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgIHZtLm9iai5hdmF0YXIgPSAnL2ltYWdlcy8nICsgdm0ub2JqLmF2YXRhclxuICAgIGVsc2VcbiAgICAgIHZtLm9iai5hdmF0YXIgPSAndXBsb2Fkcy9hdmF0YXJzLycgKyB2bS5vYmouYXZhdGFyXG4gICAgdm0ub2JqLmJkYXkgPSBtb21lbnQobmV3IERhdGUodm0ub2JqLmJkYXkpKS5mb3JtYXQoJ0RELk1NLllZWVknKVxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Nob3dVc2VyQ3RybCcsIFNob3dVc2VyQ3RybClcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
