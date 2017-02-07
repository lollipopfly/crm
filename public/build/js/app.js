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
}).run(function($auth, $http, $location, $q, $rootScope, $state, $timeout) {
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
          console.log(response);
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
    if ($rootScope.currentUser.id === data.userId) {
      return $notification('New message!', {
        body: newRouteMessage,
        icon: redTruckIcon,
        vibrate: [200, 100, 200]
      });
    }
  });
});

var IndexHomeCtrl;

IndexHomeCtrl = function($http, $timeout, $filter, $rootScope) {
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

IndexMapCtrl = function($http, $timeout) {
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

IndexRouteCtrl = function($http, $filter, $rootScope, $stateParams) {
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

ShowRouteCtrl = function($http, $stateParams, $timeout, $state) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJkaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuY29mZmVlIiwiZGlyZWN0aXZlcy9kZWxldGVfYXZhdGFyLmNvZmZlZSIsImRpcmVjdGl2ZXMvZmlsZV9maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3BhZ2luYXRpb24uY29mZmVlIiwiZGlyZWN0aXZlcy9yYWRpb19maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3RpbWVwaWNrZXIuY29mZmVlIiwibW9kdWxlcy9wdXNoZXItbm90aWZpY2F0aW9ucy5jb2ZmZWUiLCJjb250cm9sbGVycy9ob21lL2luZGV4X2hvbWVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9tYXAvaW5kZXhfbWFwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcHJvZmlsZS9lZGl0X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9wcm9maWxlL2luZGV4X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvY3JlYXRlX3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2VkaXRfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvaW5kZXhfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvc2hvd19yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9jcmVhdGVfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvZWRpdF9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9pbmRleF9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9zaG93X3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9jb25maXJtX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9mb3Jnb3RfcGFzc3dvcmRfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2VyL3Jlc2V0X3Bhc3N3b3JkX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9zaWduX2luX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9zaWduX3VwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvY3JlYXRlX3VzZXJfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2Vycy9pbmRleF91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvc2hvd191c2VyX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsT0FDRSxDQUFDLE1BREgsQ0FDVSxLQURWLEVBQ2lCLENBQ2IseUJBRGEsRUFFYixXQUZhLEVBR2IsWUFIYSxFQUliLGNBSmEsRUFLYixVQUxhLEVBTWIsUUFOYSxFQU9iLGVBUGEsRUFRYixjQVJhLEVBU2IsY0FUYSxDQURqQixDQVdJLENBQUMsTUFYTCxDQVdZLFNBQ1IsY0FEUSxFQUVSLGtCQUZRLEVBR1IsYUFIUSxFQUlSLGlCQUpRO0VBTVIsaUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsSUFBNUI7RUFHQSxhQUFhLENBQUMsUUFBZCxHQUF5QjtFQUN6QixhQUFhLENBQUMsU0FBZCxHQUEwQjtFQUMxQixrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixlQUE3QjtFQUVBLGNBQ0UsQ0FBQyxLQURILENBQ1MsR0FEVCxFQUVJO0lBQUEsR0FBQSxFQUFLLEdBQUw7SUFDQSxXQUFBLEVBQWEsMEJBRGI7SUFFQSxVQUFBLEVBQVksdUJBRlo7R0FGSixDQVFFLENBQUMsS0FSSCxDQVFTLFNBUlQsRUFTSTtJQUFBLEdBQUEsRUFBSyxlQUFMO0lBQ0EsV0FBQSxFQUFhLDRCQURiO0lBRUEsVUFBQSxFQUFZLDBCQUZaO0dBVEosQ0FhRSxDQUFDLEtBYkgsQ0FhUyxTQWJULEVBY0k7SUFBQSxHQUFB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QUFDLEdBQUcsQ0FBQyxNQUFQLEdBQWdCLFVBQUEsR0FBYSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BRHRDO0tBQUEsTUFBQTtNQUdFLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBUCxHQUFnQixrQkFBQSxHQUFxQixFQUFFLENBQUMsR0FBRyxDQUFDLE9BSDlDOztJQUlBLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBUCxHQUFjLE1BQUEsQ0FBVyxJQUFBLElBQUEsQ0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQVosQ0FBWCxDQUE2QixDQUFDLE1BQTlCLENBQXFDLFlBQXJDO0VBTm1CLENBQW5DLEVBUUUsU0FBQyxLQUFEO0lBQ0EsRUFBRSxDQUFDLEtBQUgsR0FBVyxLQUFLLENBQUM7RUFEakIsQ0FSRjtBQWRhOztBQTZCZjs7QUFDQSxPQUNFLENBQUMsTUFESCxDQUNVLEtBRFYsQ0FFRSxDQUFDLFVBRkgsQ0FFYyxjQUZkLEVBRThCLFlBRjlCIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnLCBbXG4gICAgJ2FwcC5wdXNoZXJOb3RpZmljYXRpb25zJyxcbiAgICAndWkucm91dGVyJyxcbiAgICAnc2F0ZWxsaXplcicsXG4gICAgJ3VpLmJvb3RzdHJhcCcsXG4gICAgJ25nTG9kYXNoJyxcbiAgICAnbmdNYXNrJyxcbiAgICAnYW5ndWxhck1vbWVudCcsXG4gICAgJ2Vhc3lwaWVjaGFydCcsXG4gICAgJ25nRmlsZVVwbG9hZCcsXG4gIF0pLmNvbmZpZygoXG4gICAgJHN0YXRlUHJvdmlkZXIsXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLFxuICAgICRhdXRoUHJvdmlkZXIsXG4gICAgJGxvY2F0aW9uUHJvdmlkZXJcbiAgKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG4gICAgIyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXG4gICAgIyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUnXG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvcmVnaXN0ZXInXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSAnL3VzZXIvc2lnbl9pbidcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAuc3RhdGUoJy8nLFxuICAgICAgICB1cmw6ICcvJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3BhZ2VzL2hvbWUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4SG9tZUN0cmwgYXMgaG9tZSdcbiAgICAgIClcblxuICAgICAgIyBVU0VSXG4gICAgICAuc3RhdGUoJ3NpZ25faW4nLFxuICAgICAgICB1cmw6ICcvdXNlci9zaWduX2luJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvc2lnbl9pbi5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2lnbkluQ29udHJvbGxlciBhcyBhdXRoJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzaWduX3VwJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvc2lnbl91cCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25fdXAuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25VcENvbnRyb2xsZXIgYXMgcmVnaXN0ZXInXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3NpZ25fdXBfc3VjY2VzcycsXG4gICAgICAgIHVybDogJy91c2VyL3NpZ25fdXBfc3VjY2VzcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25fdXBfc3VjY2Vzcy5odG1sJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdmb3Jnb3RfcGFzc3dvcmQnLFxuICAgICAgICB1cmw6ICcvdXNlci9mb3Jnb3RfcGFzc3dvcmQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9mb3Jnb3RfcGFzc3dvcmQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0ZvcmdvdFBhc3N3b3JkQ29udHJvbGxlciBhcyBmb3Jnb3RQYXNzd29yZCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncmVzZXRfcGFzc3dvcmQnLFxuICAgICAgICB1cmw6ICcvdXNlci9yZXNldF9wYXNzd29yZC86cmVzZXRfcGFzc3dvcmRfY29kZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3Jlc2V0X3Bhc3N3b3JkLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdSZXNldFBhc3N3b3JkQ29udHJvbGxlciBhcyByZXNldFBhc3N3b3JkJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdjb25maXJtJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvY29uZmlybS86Y29uZmlybWF0aW9uX2NvZGUnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb25maXJtQ29udHJvbGxlcidcbiAgICAgIClcblxuICAgICAgIyBQcm9maWxlXG4gICAgICAuc3RhdGUoJ3Byb2ZpbGUnLFxuICAgICAgICB1cmw6ICcvcHJvZmlsZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9wcm9maWxlL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFByb2ZpbGVDdHJsIGFzIHByb2ZpbGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3Byb2ZpbGVfZWRpdCcsXG4gICAgICAgIHVybDogJy9wcm9maWxlL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvcHJvZmlsZS9lZGl0Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0UHJvZmlsZUN0cmwgYXMgcHJvZmlsZSdcbiAgICAgIClcblxuICAgICAgIyBTdG9yZXNcbiAgICAgIC5zdGF0ZSgnc3RvcmVzJyxcbiAgICAgICAgdXJsOiAnL3N0b3JlcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4U3RvcmVDdHJsIGFzIHN0b3JlcydcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIGZsYXNoU3VjY2VzczogbnVsbFxuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3N0b3Jlcy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2NyZWF0ZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlU3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfZWRpdCcsXG4gICAgICAgIHVybDogJy9zdG9yZXMvOmlkL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2VkaXQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0VkaXRTdG9yZUN0cmwgYXMgc3RvcmUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3N0b3Jlc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3N0b3Jlcy86aWQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dTdG9yZUN0cmwgYXMgc3RvcmUnXG4gICAgICApXG5cbiAgICAgICMgVXNlcnNcbiAgICAgIC5zdGF0ZSgndXNlcnMnLFxuICAgICAgICB1cmw6ICcvdXNlcnMnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlcnMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4VXNlckN0cmwgYXMgdXNlcnMnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICBmbGFzaFN1Y2Nlc3M6IG51bGxcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgndXNlcnNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzL2NyZWF0ZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2Vycy9jcmVhdGUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVVzZXJDdHJsIGFzIHVzZXInXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3VzZXJzX3Nob3cnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvOmlkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXJzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dVc2VyQ3RybCBhcyB1c2VyJ1xuICAgICAgKVxuXG4gICAgICAjIFJvdXRlc1xuICAgICAgLnN0YXRlKCdyb3V0ZXMnLFxuICAgICAgICB1cmw6ICcvcm91dGVzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhSb3V0ZUN0cmwgYXMgcm91dGVzJ1xuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgZmxhc2hTdWNjZXNzOiBudWxsXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19jcmVhdGUnLFxuICAgICAgICB1cmw6ICcvcm91dGVzL2NyZWF0ZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvY3JlYXRlLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19lZGl0JyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy86aWQvZWRpdCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvZWRpdC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRWRpdFJvdXRlQ3RybCBhcyByb3V0ZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncm91dGVzX3Nob3cnLFxuICAgICAgICB1cmw6ICcvcm91dGVzLzppZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvc2hvdy5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2hvd1JvdXRlQ3RybCBhcyByb3V0ZSdcbiAgICAgIClcblxuICAgICAgIyBNYXBcbiAgICAgIC5zdGF0ZSgnbWFwJyxcbiAgICAgICAgdXJsOiAnL21hcCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9tYXAvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4TWFwQ3RybCBhcyBtYXAnXG4gICAgICApXG5cbiAgICByZXR1cm5cblxuICApLnJ1biAoJGF1dGgsICRodHRwLCAkbG9jYXRpb24sICRxLCAkcm9vdFNjb3BlLCAkc3RhdGUsICR0aW1lb3V0KSAtPlxuICAgIHB1YmxpY1JvdXRlcyA9IFtcbiAgICAgICdzaWduX3VwJyxcbiAgICAgICdjb25maXJtJyxcbiAgICAgICdmb3Jnb3RfcGFzc3dvcmQnLFxuICAgICAgJ3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICBdXG5cbiAgICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3RhcnQnLCAoZXZlbnQsIHRvU3RhdGUpIC0+XG4gICAgICBpZiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkgJiZcbiAgICAgIHB1YmxpY1JvdXRlcy5pbmRleE9mKHRvU3RhdGUubmFtZSkgPT0gLTFcbiAgICAgICAgJGxvY2F0aW9uLnBhdGggJ3VzZXIvc2lnbl9pbidcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBpZiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSAmJlxuICAgICAgKHB1YmxpY1JvdXRlcy5pbmRleE9mKHRvU3RhdGUubmFtZSkgPT0gMCB8fFxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50U3RhdGUgPT0gJ3NpZ25faW4nKVxuICAgICAgICAkbG9jYXRpb24ucGF0aCAnLydcblxuICAgICAgdXNlciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKSlcblxuICAgICAgaWYgdXNlciAmJiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKVxuICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG5cbiAgICAgICAgaWYgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9ICcvaW1hZ2VzLycgKyAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhclxuICAgICAgICBlbHNlXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSAndXBsb2Fkcy9hdmF0YXJzLycgKyAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhclxuXG4gICAgICAkcm9vdFNjb3BlLmxvZ291dCA9IC0+XG4gICAgICAgICRhdXRoLmxvZ291dCgpLnRoZW4gLT5cbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSAndXNlcidcbiAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZVxuICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsXG5cbiAgICAgICAgICAkc3RhdGUuZ28gJ3NpZ25faW4nXG5cbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICByZXR1cm5cblxuICAgIHJldHVyblxuIiwiY2hlY2tib3hGaWVsZCA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvY2hlY2tib3hfZmllbGQuaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgbGFiZWw6ICc9bGFiZWwnXG4gICAgICBhdHRyQ2xhc3M6ICc9P2F0dHJDbGFzcydcbiAgICAgIG5nQ2hlY2tlZDogJz0/bmdDaGVja2VkJ1xuICAgICAgbW9kZWw6ICc9bW9kZWwnXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0ciktPlxuICAgICAgaWYgc2NvcGUubW9kZWwgPT0gJzEnXG4gICAgICAgIHNjb3BlLm1vZGVsID0gdHJ1ZVxuICAgICAgZWxzZSBpZiBzY29wZS5tb2RlbCA9PSAnMCdcbiAgICAgICAgc2NvcGUubW9kZWwgPSBmYWxzZVxuICAgICAgcmV0dXJuXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdjaGVja2JveEZpZWxkJywgY2hlY2tib3hGaWVsZFxuIiwiZGF0ZXRpbWVwaWNrZXIgPSAoJHRpbWVvdXQpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuaHRtbCdcbiAgICByZXF1aXJlOiAnbmdNb2RlbCdcbiAgICBzY29wZToge1xuICAgICAgbGFiZWw6IFwiPT9sYWJlbFwiXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0ciwgbmdNb2RlbCkgLT5cbiAgICAgIHNjb3BlLm9wZW4gPSAoKSAtPlxuICAgICAgICBzY29wZS5kYXRlX29wZW5lZCA9IHRydWVcblxuICAgICAgJHRpbWVvdXQoXG4gICAgICAgICgoKSAtPlxuICAgICAgICAgIHNjb3BlLm1vZGVsID0gRGF0ZS5wYXJzZShuZ01vZGVsLiR2aWV3VmFsdWUpXG4gICAgICAgICksIDQwMFxuICAgICAgKVxuXG4gICAgICBzY29wZS5zZWxlY3REYXRlID0gKChtb2RlbCkgLT5cbiAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobW9kZWwpXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdkYXRldGltZXBpY2tlcicsIGRhdGV0aW1lcGlja2VyXG4iLCJkZWxldGVBdmF0YXIgPSAoJHRpbWVvdXQpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvZGVsZXRlX2F2YXRhci5odG1sJ1xuICAgIHNjb3BlOlxuICAgICAgcmVtb3ZlQXZhdGFyOiAnPW5nTW9kZWwnXG4gICAgICBmaWxlOiBcIj1maWxlXCJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSAtPlxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2ltZ05hbWUnLCAodmFsdWUpIC0+XG4gICAgICAgIHNjb3BlLmltZ05hbWUgPSB2YWx1ZVxuICAgICAgICByZXR1cm5cblxuICAgICAgc2NvcGUucmVtb3ZlID0gKCkgLT5cbiAgICAgICAgJHRpbWVvdXQoKCktPlxuICAgICAgICAgIHNjb3BlLmltZ05hbWUgPSAnaW1hZ2VzL2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIHNjb3BlLmZpbGUgIT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgICBzY29wZS5yZW1vdmVBdmF0YXIgPSB0cnVlXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdkZWxldGVBdmF0YXInLCBkZWxldGVBdmF0YXJcbiIsImZpbGVGaWVsZCA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJ1xuICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9maWxlX2ZpZWxkLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIGF0dHJJZDogJz0nXG4gICAgICBuZ01vZGVsOiAnPW5nTW9kZWwnXG4gICAgICByZW1vdmVBdmF0YXI6ICc9P3JlbW92ZWRBdmF0YXInXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIGVsZW1lbnQuYmluZCAnY2hhbmdlJywgKGNoYW5nZUV2ZW50KSAtPlxuICAgICAgICBzY29wZS5uZ01vZGVsID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgICAgICBzY29wZS5yZW1vdmVBdmF0YXIgPSBmYWxzZSAjIGZvciBkZWxldGVfYXZhdGFyIGRpcmVjdGl2ZVxuICAgICAgICBmaWxlcyA9IGV2ZW50LnRhcmdldC5maWxlcztcbiAgICAgICAgZmlsZU5hbWUgPSBmaWxlc1swXS5uYW1lO1xuICAgICAgICBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9dGV4dF0nKS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgZmlsZU5hbWUpXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdmaWxlRmllbGQnLCBmaWxlRmllbGRcbiIsInBhZ2luYXRpb24gPSAoJGh0dHApIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYWdpbmF0aW9uLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIHBhZ2lBcnI6ICc9J1xuICAgICAgaXRlbXM6ICc9J1xuICAgICAgcGFnaUFwaVVybDogJz0nXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIHNjb3BlLiR3YXRjaCAoLT5cbiAgICAgICAgc2NvcGUucGFnaUFyclxuICAgICAgKSwgKChuZXdWYWx1ZSwgb2xkVmFsdWUpIC0+XG4gICAgICAgIGlmICFhbmd1bGFyLmVxdWFscyhvbGRWYWx1ZSwgbmV3VmFsdWUpXG4gICAgICAgICAgc2NvcGUucGFnaUFyciA9IG5ld1ZhbHVlXG4gICAgICAgICAgc2NvcGUudG90YWxQYWdlcyA9IHNjb3BlLnBhZ2lBcnIubGFzdF9wYWdlXG4gICAgICAgICAgc2NvcGUuY3VycmVudFBhZ2UgPSBzY29wZS5wYWdpQXJyLmN1cnJlbnRfcGFnZVxuICAgICAgICAgIHNjb3BlLnRvdGFsID0gc2NvcGUucGFnaUFyci50b3RhbFxuICAgICAgICAgIHNjb3BlLnBlclBhZ2UgPSBzY29wZS5wYWdpQXJyLnBlcl9wYWdlXG5cbiAgICAgICAgICAjIFBhZ2luYXRpb24gUmFuZ2VcbiAgICAgICAgICBzY29wZS5wYWluYXRpb25SYW5nZShzY29wZS50b3RhbFBhZ2VzKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgdHJ1ZVxuXG4gICAgICBzY29wZS5nZXRQb3N0cyA9IChwYWdlTnVtYmVyKSAtPlxuICAgICAgICBpZiBwYWdlTnVtYmVyID09IHVuZGVmaW5lZFxuICAgICAgICAgIHBhZ2VOdW1iZXIgPSAnMSdcbiAgICAgICAgJGh0dHAuZ2V0KHNjb3BlLnBhZ2lBcGlVcmwrJz9wYWdlPScgKyBwYWdlTnVtYmVyKS5zdWNjZXNzIChyZXNwb25zZSkgLT5cbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgc2NvcGUuaXRlbXMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgc2NvcGUudG90YWxQYWdlcyA9IHJlc3BvbnNlLmxhc3RfcGFnZVxuICAgICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlXG5cbiAgICAgICAgICAjIFBhZ2luYXRpb24gUmFuZ2VcbiAgICAgICAgICBzY29wZS5wYWluYXRpb25SYW5nZShzY29wZS50b3RhbFBhZ2VzKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICByZXR1cm5cblxuICAgICAgc2NvcGUucGFpbmF0aW9uUmFuZ2UgPSAodG90YWxQYWdlcykgLT5cbiAgICAgICAgcGFnZXMgPSBbXVxuICAgICAgICBpID0gMVxuICAgICAgICB3aGlsZSBpIDw9IHRvdGFsUGFnZXNcbiAgICAgICAgICBwYWdlcy5wdXNoIGlcbiAgICAgICAgICBpKytcbiAgICAgICAgc2NvcGUucmFuZ2UgPSBwYWdlc1xuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAncGFnaW5hdGlvbicsIHBhZ2luYXRpb25cbiIsInJhZGlvRmllbGQgPSAoJGh0dHApIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvcmFkaW9fZmllbGQuaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgbmdNb2RlbDogXCI9bmdNb2RlbFwiXG4gICAgICBsYWJlbDogJz1sYWJlbCdcbiAgICAgIGF0dHJOYW1lOiAnPWF0dHJOYW1lJ1xuICAgICAgYXR0clZhbHVlOiAnPWF0dHJWYWx1ZSdcbiAgICAgIG5nQ2hlY2tlZDogJz0/bmdDaGVja2VkJ1xuICAgIH1cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpLT5cbiAgICAgIHNjb3BlLm5nTW9kZWwgPSBzY29wZS5hdHRyVmFsdWVcblxuICAgICAgZWxlbWVudC5iaW5kKCdjaGFuZ2UnLCAoKS0+XG4gICAgICAgIHNjb3BlLm5nTW9kZWwgPSBzY29wZS5hdHRyVmFsdWVcbiAgICAgIClcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ3JhZGlvRmllbGQnLCByYWRpb0ZpZWxkXG4iLCJ0aW1lcGlja2VyID0gKCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnQUUnXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy90aW1lcGlja2VyLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIG1vZGVsOiBcIj1uZ01vZGVsXCJcbiAgICAgIGxhYmVsOiBcIj0/bGFiZWxcIlxuICAgICAgYXR0ck5hbWU6IFwiQFwiXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIHNjb3BlLmhzdGVwID0gMVxuICAgICAgc2NvcGUubXN0ZXAgPSA1XG4gICAgICBzY29wZS5pc21lcmlkaWFuID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAndGltZXBpY2tlcicsIHRpbWVwaWNrZXJcbiIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wdXNoZXJOb3RpZmljYXRpb25zJywgW1xuICAgICdub3RpZmljYXRpb24nXG4gIF0pXG4gIC5ydW4gKCRub3RpZmljYXRpb24sICRyb290U2NvcGUpIC0+XG4gICAgbmV3Um91dGVNZXNzYWdlID0gJ1lPVSBIQVZFIEEgTkVXIFJPVVRFLidcbiAgICByZWRUcnVja0ljb24gPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgcHVzaGVyID0gbmV3IFB1c2hlcignNmI1OGMxMjQzZGY4MjAyOGE3ODgnLCB7XG4gICAgICBjbHVzdGVyOiAnZXUnLFxuICAgICAgZW5jcnlwdGVkOiB0cnVlXG4gICAgfSk7XG5cbiAgICBjaGFubmVsID0gcHVzaGVyLnN1YnNjcmliZSgnbmV3LXJvdXRlLWNoYW5uZWwnKTtcblxuICAgIGNoYW5uZWwuYmluZCgnQXBwXFxcXEV2ZW50c1xcXFxOZXdSb3V0ZScsIChkYXRhKS0+XG4gICAgICBpZiAoJHJvb3RTY29wZS5jdXJyZW50VXNlci5pZCA9PSBkYXRhLnVzZXJJZClcbiAgICAgICAgJG5vdGlmaWNhdGlvbignTmV3IG1lc3NhZ2UhJywge1xuICAgICAgICAgIGJvZHk6IG5ld1JvdXRlTWVzc2FnZVxuICAgICAgICAgIGljb246IHJlZFRydWNrSWNvblxuICAgICAgICAgIHZpYnJhdGU6IFsyMDAsIDEwMCwgMjAwXVxuICAgICAgICB9KVxuICAgICk7XG5cbiAgICByZXR1cm5cbiIsIkluZGV4SG9tZUN0cmwgPSAoJGh0dHAsICR0aW1lb3V0LCAkZmlsdGVyLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICAjIFJvdXRlc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL2hvbWUnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnXG4gIHZtLm1hcmtlcnMgPSBbXVxuXG5cbiAgIyMjICBST1VURVMgICMjI1xuICBpZiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJfZ3JvdXAgPT0gJ2FkbWluJ1xuICAgICRodHRwLmdldCgnL2FwaS9ob21lJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgICB2bS5yb3V0ZXMgPSByZXNwb25zZS5kYXRhLmRhdGFcbiAgICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgICAgIHJldHVyblxuICAgIClcblxuICAjIyMgIE1BUCAgIyMjXG4gICMgR2V0IHBvaW50cyBKU09OXG4gICRodHRwKFxuICAgIG1ldGhvZDogJ0dFVCdcbiAgICB1cmw6ICcvYXBpL2hvbWUvZ2V0cG9pbnRzJykudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YVxuICAgICAgaW5pdE1hcCgpXG5cbiAgICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuICAgICQoJy5zb3J0LWxpbmsnKS5lYWNoICgpIC0+XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3NvcnQtbGluayBjLXAnKVxuXG4gICAgaWYgdm0uc29ydFJldmVyc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1hc2MnKS5hZGRDbGFzcygnYWN0aXZlLWRlc2MnKVxuICAgIGVsc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1kZXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1hc2MnKVxuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5yb3V0ZXMgPSBvcmRlckJ5KHZtLnJvdXRlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cblxuICBpbml0TWFwID0gLT5cbiAgICBtYXBPcHRpb25zID1cbiAgICAgIHpvb206IDEyXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZVxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfQk9UVE9NXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDczNTA5LCAtMC4xMjc3NTgzKVxuICAgICAgc3R5bGVzOiB2bS5zdHlsZXNcblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2VcblxuICAgICMgU2V0IGxvY2F0aW9uc1xuICAgIGFuZ3VsYXIuZm9yRWFjaCggdm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiK2FkZHJlc3MrXCImcHJldHR5PTEma2V5PVwiICsgYXBpS2V5O1xuICAgICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwKVxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcblxuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZykgIyBwb3B1cFxuXG4gICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWVcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIC0+XG4gICAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuICAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpO1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaydcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfVxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJ1xuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleEhvbWVDdHJsJywgSW5kZXhIb21lQ3RybClcbiIsIkluZGV4TWFwQ3RybCA9ICgkaHR0cCwgJHRpbWVvdXQpIC0+XG4gIHZtID0gdGhpc1xuXG4gICMgTWFwXG4gIGFwaUtleSA9ICdhMzAzZDNhNDRhMDFjOWY4YTVjYjAxMDdiMDMzZWZiZSc7XG4gIHZtLm1hcmtlcnMgPSBbXVxuXG4gICMgR2V0IHBvaW50cyBKU09OXG4gICRodHRwKFxuICAgIG1ldGhvZDogJ0dFVCdcbiAgICB1cmw6ICcvYXBpL21hcCcpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICMgSW5pdCBtYXBcbiAgICAgIGluaXRNYXAoKVxuICAgICAgcmV0dXJuXG4gIClcblxuICBpbml0TWFwID0gLT5cbiAgICBtYXBPcHRpb25zID1cbiAgICAgIHpvb206IDEyXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZVxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfQk9UVE9NXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDczNTA5LCAtMC4xMjc3NTgzKVxuICAgICAgc3R5bGVzOiB2bS5zdHlsZXNcblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2U7XG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2goIHZtLnBvaW50cywgKHZhbHVlLCBrZXkpIC0+XG4gICAgICBhZGRyZXNzID0gdmFsdWUuc3RvcmUuYWRkcmVzc1xuICAgICAgIyBHZW9jb2RlIEFkZHJlc3NlcyBieSBhZGRyZXNzIG5hbWVcbiAgICAgIGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmNhZ2VkYXRhLmNvbS9nZW9jb2RlL3YxL2pzb24/cT1cIithZGRyZXNzK1wiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleTtcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICByZXEub25sb2FkID0gKCkgLT5cbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHBvc2l0aW9uID0gcmVzcG9uc2UucmVzdWx0c1swXS5nZW9tZXRyeVxuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMClcbiAgICAgICAgICAgIGNvbnRlbnRTdHJpbmcgPVxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1hcmtlci1jb250ZW50XCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ0FkZHJlc3M6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUuYWRkcmVzcyArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnUGhvbmU6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUucGhvbmUgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nXG5cbiAgICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpICMgcG9wdXBcblxuICAgICAgICAgICMgc2VsZWN0IGljb25zIGJ5IHN0YXR1cyAoZ3JlZW4gb3IgcmVkKVxuICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgbWFwOiBtYXBcbiAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWVcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvblxuICAgICAgICAgIClcblxuICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgaWYoIHByZXZJbmZvV2luZG93IClcbiAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIuZ2V0UG9zaXRpb24oKSkgIyBhbmltYXRlIG1vdmUgYmV0d2VlbiBtYXJrZXJzXG4gICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgLT5cbiAgICAgICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICApXG5cbiAgICAgICAgICAjIEFkZCBuZXcgbWFya2VyIHRvIGFycmF5IGZvciBvdXRzaWRlIG1hcCBsaW5rcyAob3JkZXJlZCBieSBpZCBpbiBiYWNrZW5kKVxuICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpO1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICApXG4gICAgcmV0dXJuXG5cbiAgdm0uc3R5bGVzID0gW1xuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd3YXRlcidcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZTllOWU5JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2xhbmRzY2FwZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDI5IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMC4yIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuYXJ0ZXJpYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pLnBhcmsnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2RlZGVkZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAndmlzaWJpbGl0eSc6ICdvbicgfVxuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnc2F0dXJhdGlvbic6IDM2IH1cbiAgICAgICAgeyAnY29sb3InOiAnIzMzMzMzMycgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMuaWNvbidcbiAgICAgICdzdHlsZXJzJzogWyB7ICd2aXNpYmlsaXR5JzogJ29mZicgfSBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd0cmFuc2l0J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmMmYyZjInIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMS4yIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICAjIEdvIHRvIHBvaW50IGFmdGVyIGNsaWNrIG91dHNpZGUgbWFwIGxpbmtcbiAgdm0uZ29Ub1BvaW50ID0gKGlkKSAtPlxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodm0ubWFya2Vyc1tpZF0sICdjbGljaycpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhNYXBDdHJsJywgSW5kZXhNYXBDdHJsKVxuIiwiRWRpdFByb2ZpbGVDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3Byb2ZpbGUvZWRpdCcpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0udXNlciA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHZtLnVzZXIucmVtb3ZlX2F2YXRhciA9IGZhbHNlXG5cbiAgICAgIHZtLmF2YXRhciA9IHZtLm1ha2VBdmF0YXJMaW5rKHZtLnVzZXIuYXZhdGFyKSAjIGZvciBkZWxldGVfYXZhdGFyIGRpcmVjdGl2ZVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBhdmF0YXIgPSB2bS51c2VyLmF2YXRhclxuXG4gICAgaWYgdm0udXNlci5hdmF0YXIgPT0gJy9pbWFnZXMvZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0udXNlci5hdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJyAjIHRvZG8gaHogbWF5IGJlIGZvciBkZWxldGVcbiAgICAgIGF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgdm0uZGF0YSA9XG4gICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgcmVtb3ZlX2F2YXRhcjogdm0udXNlci5yZW1vdmVfYXZhdGFyXG4gICAgICBuYW1lOiB2bS51c2VyLm5hbWVcbiAgICAgIGxhc3RfbmFtZTogdm0udXNlci5sYXN0X25hbWVcbiAgICAgIGluaXRpYWxzOiB2bS51c2VyLmluaXRpYWxzXG4gICAgICBiZGF5OiB2bS51c2VyLmJkYXlcbiAgICAgIGVtYWlsOiB2bS51c2VyLmVtYWlsXG4gICAgICBwaG9uZTogdm0udXNlci5waG9uZVxuICAgICAgam9iX3RpdGxlOiB2bS51c2VyLmpvYl90aXRsZVxuICAgICAgY291bnRyeTogdm0udXNlci5jb3VudHJ5XG4gICAgICBjaXR5OiB2bS51c2VyLmNpdHlcblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3Byb2ZpbGUvJyArIHZtLnVzZXIuaWRcbiAgICAgIG1ldGhvZDogJ1Bvc3QnXG4gICAgICBkYXRhOiB2bS5kYXRhXG4gICAgKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICBmaWxlTmFtZSA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpXG4gICAgICBzdG9yYWdlID0gSlNPTi5wYXJzZShzdG9yYWdlKVxuXG4gICAgICAjIERlZmF1bHQgYXZhdGFyXG4gICAgICBpZiB0eXBlb2YgZmlsZU5hbWUgPT0gJ2Jvb2xlYW4nICYmIHZtLnVzZXIucmVtb3ZlX2F2YXRhclxuICAgICAgICBzdG9yYWdlLmF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAjIFVwZGF0ZSBzdG9yYWdlXG4gICAgICBlbHNlIGlmIHR5cGVvZiBmaWxlTmFtZSA9PSAnc3RyaW5nJyAmJiAhdm0udXNlci5yZW1vdmVfYXZhdGFyXG4gICAgICAgIHN0b3JhZ2UuYXZhdGFyID0gZmlsZU5hbWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSB2bS5tYWtlQXZhdGFyTGluayhzdG9yYWdlLmF2YXRhcilcbiAgICAgICAgc3RvcmFnZS5hdmF0YXIgPSBmaWxlTmFtZVxuXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2UpKVxuXG4gICAgICAkc3RhdGUuZ28gJ3Byb2ZpbGUnLCB7IGZsYXNoU3VjY2VzczogJ1Byb2ZpbGUgdXBkYXRlZCEnIH1cbiAgICApLCAoKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcik7XG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgdm0ubWFrZUF2YXRhckxpbmsgPSAoYXZhdGFyTmFtZSkgLT5cbiAgICBpZiBhdmF0YXJOYW1lID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICBhdmF0YXJOYW1lID0gJy9pbWFnZXMvJyArIGF2YXRhck5hbWVcbiAgICBlbHNlXG4gICAgICBhdmF0YXJOYW1lID0gJy91cGxvYWRzL2F2YXRhcnMvJyArIGF2YXRhck5hbWVcblxuICAgIHJldHVybiBhdmF0YXJOYW1lXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFByb2ZpbGVDdHJsJywgRWRpdFByb2ZpbGVDdHJsKVxuIiwiSW5kZXhQcm9maWxlQ3RybCA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3Byb2ZpbGUnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXJcbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGEucG9pbnRzXG4gICAgICBpZiB2bS51c2VyLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICB2bS51c2VyLmF2YXRhciA9ICcvaW1hZ2VzLycgKyB2bS51c2VyLmF2YXRhclxuICAgICAgZWxzZVxuICAgICAgICB2bS51c2VyLmF2YXRhciA9ICd1cGxvYWRzL2F2YXRhcnMvJyArIHZtLnVzZXIuYXZhdGFyXG5cbiAgICAgIHZtLnVzZXIuYmRheSA9IG1vbWVudChuZXcgRGF0ZSh2bS51c2VyLmJkYXkpKS5mb3JtYXQoJ0RELk1NLllZWVknKVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlUG9pbnRzID0gKCkgLT5cbiAgICAkaHR0cC5wdXQoJy9hcGkvcHJvZmlsZS91cGRhdGVwb2ludHMnLCB2bS5wb2ludHMpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdQb2ludHMgdXBkYXRlZCEnXG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhQcm9maWxlQ3RybCcsIEluZGV4UHJvZmlsZUN0cmwpXG4iLCJDcmVhdGVSb3V0ZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnBvaW50Rm9ybXMgPSBbXVxuXG4gICRodHRwLnBvc3QoJy9hcGkvcm91dGVzL2dldFVzZXJzQW5kU3RvcmVzJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICB2bS5jcmVhdGVSb3V0ZSA9ICgpIC0+XG4gICAgdm0ucm91dGUgPVxuICAgICAgdXNlcl9pZDogdm0udXNlcl9pZFxuICAgICAgZGF0ZTogdm0uZGF0ZVxuICAgICAgcG9pbnRzOiB2bS5wb2ludEZvcm1zXG5cbiAgICAkaHR0cC5wb3N0KCcvYXBpL3JvdXRlcycsIHZtLnJvdXRlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YVxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHJvdXRlIGhhcyBiZWVuIGFkZGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcik7XG5cbiAgICByZXR1cm5cblxuICB2bS5hZGRQb2ludCA9ICgpIC0+XG4gICAgdm0ucG9pbnRGb3Jtcy5wdXNoKHt9KVxuXG4gIHZtLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgIHZtLnBvaW50Rm9ybXMuc3BsaWNlKGluZGV4LCAxKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVJvdXRlQ3RybCcsIENyZWF0ZVJvdXRlQ3RybClcbiIsIkVkaXRSb3V0ZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcbiAgdm0uY291bnQgPSAxXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcy9lZGl0LycrIHZtLmlkKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICByb3V0ZSA9XG4gICAgICB1c2VyX2lkOiB2bS5vYmoudXNlcl9pZFxuICAgICAgZGF0ZTogdm0ub2JqLmRhdGVcbiAgICAgIHBvaW50czogdm0ub2JqLnBvaW50c1xuXG4gICAgJGh0dHAucGF0Y2goJy9hcGkvcm91dGVzLycgKyB2bS5pZCwgcm91dGUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdSb3V0ZSBVcGRhdGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcilcblxuXG4gIHZtLmFkZFBvaW50ID0gKCkgLT5cbiAgICB2bS5vYmoucG9pbnRzLnB1c2goe1xuICAgICAgaWQ6IHZtLmNvdW50ICsgJ19uZXcnXG4gICAgfSlcbiAgICB2bS5jb3VudCsrXG4gICAgcmV0dXJuXG5cbiAgdm0ucmVtb3ZlUG9pbnQgPSAoaW5kZXgpIC0+XG4gICAgdm0ub2JqLnBvaW50cy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFJvdXRlQ3RybCcsIEVkaXRSb3V0ZUN0cmwpXG4iLCJJbmRleFJvdXRlQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9yb3V0ZXMnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcycpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLnJvdXRlcyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJylcblxuICAgIHZtLnByZWRpY2F0ZSA9IHByZWRpY2F0ZVxuICAgIHZtLnJldmVyc2UgPSBpZiAodm0ucHJlZGljYXRlID09IHByZWRpY2F0ZSkgdGhlbiAhdm0ucmV2ZXJzZSBlbHNlIGZhbHNlXG4gICAgdm0ucm91dGVzID0gb3JkZXJCeSh2bS5yb3V0ZXMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG4gIHZtLmRlbGV0ZVJvdXRlID0gKGlkLCBpbmRleCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCcvYXBpL3JvdXRlcy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgIyBEZWxldGUgZnJvbSBzY29wZVxuICAgICAgICB2bS5yb3V0ZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnUm91dGUgZGVsZXRlZCEnXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICByZXR1cm5cblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleFJvdXRlQ3RybCcsIEluZGV4Um91dGVDdHJsKVxuIiwiU2hvd1JvdXRlQ3RybCA9ICgkaHR0cCwgJHN0YXRlUGFyYW1zLCAkdGltZW91dCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnO1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIEdldCBwb2ludHNcbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcy8nICsgdm0uaWQpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucm91dGUgPSByZXNwb25zZS5kYXRhLnJvdXRlXG4gICAgICB2bS5zdG9yZXMgPSByZXNwb25zZS5kYXRhLnN0b3Jlc1xuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YS5wb2ludHNcbiAgICAgIHZtLnJvdXRlLmRhdGUgPSBtb21lbnQobmV3IERhdGUodm0ucm91dGUuZGF0ZSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG5cbiAgICAgICMgSW5pdCBtYXBcbiAgICAgIGluaXRNYXAoKVxuXG4gICAgICByZXR1cm5cbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuXG4gIHZtLmRlbGV0ZVJvdXRlID0gKGlkKSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvcm91dGVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnUm91dGUgRGVsZXRlZCEnIH1cblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuXG4gICMgV2hlbiB0aGUgd2luZG93IGhhcyBmaW5pc2hlZCBsb2FkaW5nIGNyZWF0ZSBvdXIgZ29vZ2xlIG1hcCBiZWxvd1xuICBpbml0TWFwID0gLT5cbiAgICAjIEJhc2ljIG9wdGlvbnMgZm9yIGEgc2ltcGxlIEdvb2dsZSBNYXBcbiAgICBtYXBPcHRpb25zID1cbiAgICAgIHpvb206IDEyXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZVxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfQk9UVE9NXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDAxNTIsIC0wLjEyNjIzNilcbiAgICAgIHN0eWxlczp2bS5zdHlsZXNcblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm91dGUtbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2U7XG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2godm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiK2FkZHJlc3MrXCImcHJldHR5PTEma2V5PVwiICsgYXBpS2V5O1xuICAgICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwKVxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpICMgcG9wdXBcblxuICAgICAgICAgICAgIyBzZWxlY3QgaWNvbnMgYnkgc3RhdHVzIChncmVlbiBvciByZWQpXG4gICAgICAgICAgICBpZiBwYXJzZUludCB2YWx1ZS5zdGF0dXNcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICAgICAgICBpY29uOiB2bS5iYWxvb25OYW1lXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IG90aGVyIG1hcmtlclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpZiggcHJldkluZm9XaW5kb3cgKVxuICAgICAgICAgICAgICAgIHByZXZJbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5nZXRQb3NpdGlvbigpKSAjIGFuaW1hdGUgbW92ZSBiZXR3ZWVuIG1hcmtlcnNcbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuIG1hcCwgbWFya2VyXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgZW1wdHkgbWFwIGFyZWFcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgLT5cbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQWRkIG5ldyBtYXJrZXIgdG8gYXJyYXkgZm9yIG91dHNpZGUgbWFwIGxpbmtzIChvcmRlcmVkIGJ5IGlkIGluIGJhY2tlbmQpXG4gICAgICAgICAgICB2bS5tYXJrZXJzLnB1c2gobWFya2VyKVxuICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgYXBpVXJsLCB0cnVlKTtcbiAgICAgIHJlcS5zZW5kKCk7XG4gICAgKVxuICAgIHJldHVyblxuXG4gIHZtLnN0eWxlcyA9IFtcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnd2F0ZXInXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2U5ZTllOScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdsYW5kc2NhcGUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyOSB9XG4gICAgICAgIHsgJ3dlaWdodCc6IDAuMiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmFydGVyaWFsJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTggfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5sb2NhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaS5wYXJrJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNkZWRlZGUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3Zpc2liaWxpdHknOiAnb24nIH1cbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3NhdHVyYXRpb24nOiAzNiB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyMzMzMzMzMnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogNDAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLmljb24nXG4gICAgICAnc3R5bGVycyc6IFsgeyAndmlzaWJpbGl0eSc6ICdvZmYnIH0gXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAndHJhbnNpdCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjJmMmYyJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE5IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICAgIHsgJ3dlaWdodCc6IDEuMiB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgIyBHbyB0byBwb2ludCBhZnRlciBjbGljayBvdXRzaWRlIG1hcCBsaW5rXG4gIHZtLmdvVG9Qb2ludCA9IChpZCkgLT5cbiAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKHZtLm1hcmtlcnNbaWRdLCAnY2xpY2snKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Nob3dSb3V0ZUN0cmwnLCBTaG93Um91dGVDdHJsKVxuIiwiQ3JlYXRlU3RvcmVDdHJsID0gKCRzY29wZSwgJGh0dHAsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0uY3JlYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5zdG9yZU5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLm93bmVyTmFtZVxuICAgICAgYWRkcmVzczogdm0uYWRkcmVzc1xuICAgICAgcGhvbmU6IHZtLnBob25lXG4gICAgICBlbWFpbDogdm0uZW1haWxcblxuICAgICRodHRwLnBvc3QoJy9hcGkvc3RvcmVzJywgc3RvcmUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAnc3RvcmVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdOZXcgc3RvcmUgY3JlYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlU3RvcmVDdHJsJywgQ3JlYXRlU3RvcmVDdHJsKVxuIiwiRWRpdFN0b3JlQ3RybCA9ICgkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5kYXRhLm5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLmRhdGEub3duZXJfbmFtZVxuICAgICAgYWRkcmVzczogdm0uZGF0YS5hZGRyZXNzXG4gICAgICBwaG9uZTogdm0uZGF0YS5waG9uZVxuICAgICAgZW1haWw6IHZtLmRhdGEuZW1haWxcblxuICAgICRodHRwLnBhdGNoKCcvYXBpL3N0b3Jlcy8nICsgdm0uaWQsIHN0b3JlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgVXBkYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFN0b3JlQ3RybCcsIEVkaXRTdG9yZUN0cmwpXG4iLCJJbmRleFN0b3JlQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9zdG9yZXMnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uc3RvcmVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJyk7XG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnN0b3JlcyA9IG9yZGVyQnkodm0uc3RvcmVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9zdG9yZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0uc3RvcmVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1N0b3JlIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhTdG9yZUN0cmwnLCBJbmRleFN0b3JlQ3RybClcbiIsIlNob3dTdG9yZUN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAkaHR0cC5nZXQoJ2FwaS9zdG9yZXMvJyt2bS5pZCkudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uZGF0YSA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCdhcGkvc3RvcmVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgZGVsZXRlZCEnIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICApXG5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1N0b3JlQ3RybCcsIFNob3dTdG9yZUN0cmwpIiwiQ29uZmlybUNvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmRhdGEgPVxuICAgIGNvbmZpcm1hdGlvbl9jb2RlOiAkc3RhdGVQYXJhbXMuY29uZmlybWF0aW9uX2NvZGVcblxuICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL2NvbmZpcm0nLCB2bS5kYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAjIFNhdmUgdG9rZW5cbiAgICAkYXV0aC5zZXRUb2tlbihkYXRhLnRva2VuKVxuXG4gICAgIyBTYXZlIHVzZXIgaW4gbG9jYWxTdG9yYWdlXG4gICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3VzZXInLCB1c2VyXG4gICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZVxuICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBkYXRhXG5cbiAgICAkc3RhdGUuZ28gJy8nXG4gICkuZXJyb3IgKGRhdGEsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgJHN0YXRlLmdvICdzaWduX2luJ1xuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NvbmZpcm1Db250cm9sbGVyJywgQ29uZmlybUNvbnRyb2xsZXIpXG5cbiIsIkZvcmdvdFBhc3N3b3JkQ29udHJvbGxlciA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVzdG9yZVBhc3N3b3JkID0gKCktPlxuICAgIHZtLnNwaW5uZXJEb25lID0gdHJ1ZVxuICAgIGRhdGEgPVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG5cbiAgICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL3NlbmRfcmVzZXRfY29kZScsIGRhdGEpLnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgICAgaWYoZGF0YSlcbiAgICAgICAgdm0uc3VjY2Vzc1NlbmRpbmdFbWFpbCA9IHRydWVcbiAgICApLmVycm9yIChlcnJvciwgc3RhdHVzLCBoZWFkZXIsIGNvbmZpZykgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRm9yZ290UGFzc3dvcmRDb250cm9sbGVyJywgRm9yZ290UGFzc3dvcmRDb250cm9sbGVyKVxuXG4iLCJSZXNldFBhc3N3b3JkQ29udHJvbGxlciA9ICgkYXV0aCwgJHN0YXRlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0ubWlubGVuZ3RoID0gOFxuXG4gIHZtLnJlc3RvcmVQYXNzd29yZCA9IChmb3JtKSAtPlxuICAgIGRhdGEgPSB7XG4gICAgICByZXNldF9wYXNzd29yZF9jb2RlOiAkc3RhdGVQYXJhbXMucmVzZXRfcGFzc3dvcmRfY29kZVxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG4gICAgICBwYXNzd29yZF9jb25maXJtYXRpb246IHZtLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuICAgIH1cblxuICAgICRodHRwLnBvc3QoJ2FwaS9hdXRoZW50aWNhdGUvcmVzZXRfcGFzc3dvcmQnLCBkYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAgIGlmKGRhdGEpXG4gICAgICAgIHZtLnN1Y2Nlc3NSZXN0b3JlUGFzc3dvcmQgPSB0cnVlXG4gICAgKS5lcnJvciAoZXJyb3IsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0UGFzc3dvcmRDb250cm9sbGVyJywgUmVzZXRQYXNzd29yZENvbnRyb2xsZXIpXG5cbiIsIlNpZ25JbkNvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmxvZ2luID0gKCkgLT5cbiAgICBjcmVkZW50aWFscyA9XG4gICAgICBlbWFpbDogdm0uZW1haWxcbiAgICAgIHBhc3N3b3JkOiB2bS5wYXNzd29yZFxuXG4gICAgJGF1dGgubG9naW4oY3JlZGVudGlhbHMpLnRoZW4gKC0+XG4gICAgICAjIFJldHVybiBhbiAkaHR0cCByZXF1ZXN0IGZvciB0aGUgbm93IGF1dGhlbnRpY2F0ZWRcbiAgICAgICMgdXNlciBzbyB0aGF0IHdlIGNhbiBmbGF0dGVuIHRoZSBwcm9taXNlIGNoYWluXG4gICAgICAkaHR0cC5nZXQoJ2FwaS9hdXRoZW50aWNhdGUvZ2V0X3VzZXInKS50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmRhdGEudXNlcilcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3VzZXInLCB1c2VyXG4gICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGEudXNlclxuXG4gICAgICAgICRzdGF0ZS5nbyAnLydcblxuICAgICAgICByZXR1cm5cblxuICAgICksIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpO1xuXG4gICAgICByZXR1cm5cblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaWduSW5Db250cm9sbGVyJywgU2lnbkluQ29udHJvbGxlcilcbiIsIlNpZ25VcENvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVnaXN0ZXIgPSAoKS0+XG4gICAgdm0uc3Bpbm5lckRvbmUgPSB0cnVlXG4gICAgaWYgdm0udXNlclxuICAgICAgY3JlZGVudGlhbHMgPVxuICAgICAgICBuYW1lOiB2bS51c2VyLm5hbWVcbiAgICAgICAgZW1haWw6IHZtLnVzZXIuZW1haWxcbiAgICAgICAgcGFzc3dvcmQ6IHZtLnVzZXIucGFzc3dvcmRcbiAgICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiB2bS51c2VyLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuXG4gICAgJGF1dGguc2lnbnVwKGNyZWRlbnRpYWxzKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICAgICRzdGF0ZS5nbyAnc2lnbl91cF9zdWNjZXNzJ1xuICAgICAgcmV0dXJuXG4gICAgKS5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1NpZ25VcENvbnRyb2xsZXInLCBTaWduVXBDb250cm9sbGVyKVxuIiwiVXNlckNvbnRyb2xsZXIgPSAoJGh0dHAsICRzdGF0ZSwgJGF1dGgsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmdldFVzZXJzID0gLT5cbiAgICAjIFRoaXMgcmVxdWVzdCB3aWxsIGhpdCB0aGUgaW5kZXggbWV0aG9kIGluIHRoZSBBdXRoZW50aWNhdGVDb250cm9sbGVyXG4gICAgIyBvbiB0aGUgTGFyYXZlbCBzaWRlIGFuZCB3aWxsIHJldHVybiB0aGUgbGlzdCBvZiB1c2Vyc1xuICAgICRodHRwLmdldCgnYXBpL2F1dGhlbnRpY2F0ZScpLnN1Y2Nlc3MoKHVzZXJzKSAtPlxuICAgICAgdm0udXNlcnMgPSB1c2Vyc1xuICAgICAgcmV0dXJuXG4gICAgKS5lcnJvciAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuICB2bS5sb2dvdXQgPSAtPlxuICAgICRhdXRoLmxvZ291dCgpLnRoZW4gLT5cbiAgICAgICMgUmVtb3ZlIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSAndXNlcidcbiAgICAgICMgRmxpcCBhdXRoZW50aWNhdGVkIHRvIGZhbHNlIHNvIHRoYXQgd2Ugbm8gbG9uZ2VyXG4gICAgICAjIHNob3cgVUkgZWxlbWVudHMgZGVwZW5kYW50IG9uIHRoZSB1c2VyIGJlaW5nIGxvZ2dlZCBpblxuICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICAgICMgUmVtb3ZlIHRoZSBjdXJyZW50IHVzZXIgaW5mbyBmcm9tIHJvb3RzY29wZVxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGxcbiAgICAgICRzdGF0ZS5nbyAnc2lnbl9pbidcblxuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignVXNlckNvbnRyb2xsZXInLCBVc2VyQ29udHJvbGxlcilcbiIsIkNyZWF0ZVVzZXJDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgbG9kYXNoKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXohQCMkJV4mKigpLSs8PkFCQ0RFRkdISUpLTE1OT1AxMjM0NTY3ODkwJ1xuXG4gICRodHRwLmdldCgnL2FwaS91c2Vycy9jcmVhdGUnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLmVudW1zID0gcmVzcG9uc2UuZGF0YVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0uYWRkVXNlciA9ICgpIC0+XG4gICAgdm0uZGF0YSA9XG4gICAgICBuYW1lOiB2bS5uYW1lXG4gICAgICBsYXN0X25hbWU6IHZtLmxhc3RfbmFtZVxuICAgICAgaW5pdGlhbHM6IHZtLmluaXRpYWxzXG4gICAgICBhdmF0YXI6IHZtLmF2YXRhclxuICAgICAgYmRheTogdm0uYmRheVxuICAgICAgam9iX3RpdGxlOiB2bS5qb2JfdGl0bGVcbiAgICAgIHVzZXJfZ3JvdXA6IHZtLnVzZXJfZ3JvdXBcbiAgICAgIGNvdW50cnk6IHZtLmNvdW50cnlcbiAgICAgIGNpdHk6IHZtLmNpdHlcbiAgICAgIHBob25lOiB2bS5waG9uZVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3VzZXJzJ1xuICAgICAgbWV0aG9kOiAnUG9zdCdcbiAgICAgIGRhdGE6IHZtLmRhdGFcbiAgICApLnRoZW4gKChyZXNwKSAtPlxuICAgICAgJHN0YXRlLmdvICd1c2VycycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHVzZXIgaGFzIGJlZW4gYWRkZWQhJyB9XG4gICAgICByZXR1cm5cbiAgICApLCAoKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5nZW5lcmF0ZVBhc3MgPSAoKSAtPlxuICAgIHZtLnBhc3N3b3JkID0gJydcbiAgICBwYXNzTGVuZ3RoID0gbG9kYXNoLnJhbmRvbSg4LDE1KVxuICAgIHggPSAwXG5cbiAgICB3aGlsZSB4IDwgcGFzc0xlbmd0aFxuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZtLmNoYXJzLmxlbmd0aClcbiAgICAgIHZtLnBhc3N3b3JkICs9IHZtLmNoYXJzLmNoYXJBdChpKVxuICAgICAgeCsrXG4gICAgcmV0dXJuIHZtLnBhc3N3b3JkXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlVXNlckN0cmwnLCBDcmVhdGVVc2VyQ3RybClcbiIsIkluZGV4VXNlckN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvdXNlcnMnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCdhcGkvdXNlcnMnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS51c2VycyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpO1xuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS51c2VycyA9IG9yZGVyQnkodm0udXNlcnMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG4gIHZtLmRlbGV0ZVVzZXIgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvdXNlcnMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0udXNlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnVXNlciBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4VXNlckN0cmwnLCBJbmRleFVzZXJDdHJsKVxuIiwiU2hvd1VzZXJDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG4gIHZtLnNldHRpbmdzID1cbiAgICBsaW5lV2lkdGg6IDUsXG4gICAgdHJhY2tDb2xvcjogJyNlOGVmZjAnLFxuICAgIGJhckNvbG9yOiAnIzI3YzI0YycsXG4gICAgc2NhbGVDb2xvcjogZmFsc2UsXG4gICAgY29sb3I6ICcjM2EzZjUxJyxcbiAgICBzaXplOiAxMzQsXG4gICAgbGluZUNhcDogJ2J1dHQnLFxuICAgIHJvdGF0ZTogLTkwLFxuICAgIGFuaW1hdGU6IDEwMDBcblxuICAkaHR0cC5nZXQoJ2FwaS91c2Vycy8nK3ZtLmlkKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgaWYgdm0ub2JqLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0ub2JqLmF2YXRhciA9ICcvaW1hZ2VzLycgKyB2bS5vYmouYXZhdGFyXG4gICAgZWxzZVxuICAgICAgdm0ub2JqLmF2YXRhciA9ICd1cGxvYWRzL2F2YXRhcnMvJyArIHZtLm9iai5hdmF0YXJcbiAgICB2bS5vYmouYmRheSA9IG1vbWVudChuZXcgRGF0ZSh2bS5vYmouYmRheSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1VzZXJDdHJsJywgU2hvd1VzZXJDdHJsKVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
