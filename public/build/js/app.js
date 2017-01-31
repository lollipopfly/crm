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
  $timeout(function() {
    $rootScope.currentState = $state.current.name;
    if (!$auth.isAuthenticated() && publicRoutes.indexOf($rootScope.currentState) === -1) {
      $location.path('user/sign_in');
    }
    if ($auth.isAuthenticated && (publicRoutes.indexOf($rootScope.currentState) === 0 || $rootScope.currentState === 'sign_in')) {
      return $location.path('/');
    }
  }, 0);
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    var user;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJkaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuY29mZmVlIiwiZGlyZWN0aXZlcy9kZWxldGVfYXZhdGFyLmNvZmZlZSIsImRpcmVjdGl2ZXMvZmlsZV9maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3BhZ2luYXRpb24uY29mZmVlIiwiZGlyZWN0aXZlcy9yYWRpb19maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3RpbWVwaWNrZXIuY29mZmVlIiwibW9kdWxlcy9wdXNoZXItbm90aWZpY2F0aW9ucy5jb2ZmZWUiLCJjb250cm9sbGVycy9ob21lL2luZGV4X2hvbWVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9tYXAvaW5kZXhfbWFwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcHJvZmlsZS9lZGl0X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9wcm9maWxlL2luZGV4X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvY3JlYXRlX3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvc3RvcmVzL2VkaXRfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvaW5kZXhfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvc2hvd19zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvY29uZmlybV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvZm9yZ290X3Bhc3N3b3JkX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9yZXNldF9wYXNzd29yZF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvc2lnbl9pbl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvc2lnbl91cF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvdXNlcl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3JvdXRlcy9jcmVhdGVfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvZWRpdF9yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3JvdXRlcy9pbmRleF9yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3JvdXRlcy9zaG93X3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvY3JlYXRlX3VzZXJfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy91c2Vycy9pbmRleF91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvc2hvd191c2VyX2N0cmwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBRUEsT0FDRSxDQUFDLE1BREgsQ0FDVSxLQURWLEVBQ2lCLENBQ2IseUJBRGEsRUFFYixXQUZhLEVBR2IsWUFIYSxFQUliLGNBSmEsRUFLYixVQUxhLEVBTWIsUUFOYSxFQU9iLGVBUGEsRUFRYixjQVJhLEVBU2IsY0FUYSxDQURqQixDQVdJLENBQUMsTUFYTCxDQVdZLFNBQ1IsY0FEUSxFQUVSLGtCQUZRLEVBR1IsYUFIUSxFQUlSLGlCQUpRO0VBTVIsaUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsSUFBNUI7RUFJQSxhQUFhLENBQUMsUUFBZCxHQUF5QjtFQUN6QixhQUFhLENBQUMsU0FBZCxHQUEwQjtFQUMxQixrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixlQUE3QjtFQUVBLGNBQ0UsQ0FBQyxLQURILENBQ1MsR0FEVCxFQUVJO0lBQUEsR0FBQSxFQUFLLEdBQUw7SUFDQSxXQUFBLEVBQWEsMEJBRGI7SUFFQSxVQUFBLEVBQVksdUJBRlo7R0FGSixDQVFFLENBQUMsS0FSSCxDQVFTLFNBUlQsRUFTSTtJQUFBLEdBQUEsRUFBSyxlQUFMO0lBQ0EsV0FBQSxFQUFhLDRCQURiO0lBRUEsVUFBQSxFQUFZLDBCQUZaO0dBVEosQ0FhRSxDQUFDLEtBYkgsQ0FhUyxTQWJULEVBY0k7SUFBQSxHQUFB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USxDQUFDO0lBQ2xCLElBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFQLEtBQWlCLG9CQUFwQjtNQUNFLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBUCxHQUFnQixVQUFBLEdBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUR0QztLQUFBLE1BQUE7TUFHRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQVAsR0FBZ0Isa0JBQUEsR0FBcUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUg5Qzs7SUFJQSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQVAsR0FBYyxNQUFBLENBQVcsSUFBQSxJQUFBLENBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFaLENBQVgsQ0FBNkIsQ0FBQyxNQUE5QixDQUFxQyxZQUFyQztFQU5tQixDQUFuQyxFQVFFLFNBQUMsS0FBRDtJQUNBLEVBQUUsQ0FBQyxLQUFILEdBQVcsS0FBSyxDQUFDO0VBRGpCLENBUkY7QUFkYTs7QUE2QmY7O0FBQ0EsT0FDRSxDQUFDLE1BREgsQ0FDVSxLQURWLENBRUUsQ0FBQyxVQUZILENBRWMsY0FGZCxFQUU4QixZQUY5QiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnLCBbXG4gICAgJ2FwcC5wdXNoZXJOb3RpZmljYXRpb25zJyxcbiAgICAndWkucm91dGVyJyxcbiAgICAnc2F0ZWxsaXplcicsXG4gICAgJ3VpLmJvb3RzdHJhcCcsXG4gICAgJ25nTG9kYXNoJyxcbiAgICAnbmdNYXNrJyxcbiAgICAnYW5ndWxhck1vbWVudCcsXG4gICAgJ2Vhc3lwaWVjaGFydCcsXG4gICAgJ25nRmlsZVVwbG9hZCcsXG4gIF0pLmNvbmZpZygoXG4gICAgJHN0YXRlUHJvdmlkZXIsXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLFxuICAgICRhdXRoUHJvdmlkZXIsXG4gICAgJGxvY2F0aW9uUHJvdmlkZXJcbiAgKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG5cbiAgICAjIFNhdGVsbGl6ZXIgY29uZmlndXJhdGlvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBBUElcbiAgICAjIHJvdXRlIHRoZSBKV1Qgc2hvdWxkIGJlIHJldHJpZXZlZCBmcm9tXG4gICAgJGF1dGhQcm92aWRlci5sb2dpblVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZSdcbiAgICAkYXV0aFByb3ZpZGVyLnNpZ251cFVybCA9ICcvYXBpL2F1dGhlbnRpY2F0ZS9yZWdpc3RlcidcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlICcvdXNlci9zaWduX2luJ1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgIC5zdGF0ZSgnLycsXG4gICAgICAgIHVybDogJy8nXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvcGFnZXMvaG9tZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhIb21lQ3RybCBhcyBob21lJ1xuICAgICAgKVxuXG4gICAgICAjIFVTRVJcbiAgICAgIC5zdGF0ZSgnc2lnbl9pbicsXG4gICAgICAgIHVybDogJy91c2VyL3NpZ25faW4nXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9zaWduX2luLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduSW5Db250cm9sbGVyIGFzIGF1dGgnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3NpZ25fdXAnLFxuICAgICAgICB1cmw6ICcvdXNlci9zaWduX3VwJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvc2lnbl91cC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2lnblVwQ29udHJvbGxlciBhcyByZWdpc3RlcidcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc2lnbl91cF9zdWNjZXNzJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvc2lnbl91cF9zdWNjZXNzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvc2lnbl91cF9zdWNjZXNzLmh0bWwnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ2ZvcmdvdF9wYXNzd29yZCcsXG4gICAgICAgIHVybDogJy91c2VyL2ZvcmdvdF9wYXNzd29yZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL2ZvcmdvdF9wYXNzd29yZC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRm9yZ290UGFzc3dvcmRDb250cm9sbGVyIGFzIGZvcmdvdFBhc3N3b3JkJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdyZXNldF9wYXNzd29yZCcsXG4gICAgICAgIHVybDogJy91c2VyL3Jlc2V0X3Bhc3N3b3JkLzpyZXNldF9wYXNzd29yZF9jb2RlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvcmVzZXRfcGFzc3dvcmQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0UGFzc3dvcmRDb250cm9sbGVyIGFzIHJlc2V0UGFzc3dvcmQnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ2NvbmZpcm0nLFxuICAgICAgICB1cmw6ICcvdXNlci9jb25maXJtLzpjb25maXJtYXRpb25fY29kZSdcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbmZpcm1Db250cm9sbGVyJ1xuICAgICAgKVxuXG4gICAgICAjIFByb2ZpbGVcbiAgICAgIC5zdGF0ZSgncHJvZmlsZScsXG4gICAgICAgIHVybDogJy9wcm9maWxlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3Byb2ZpbGUvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4UHJvZmlsZUN0cmwgYXMgcHJvZmlsZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncHJvZmlsZV9lZGl0JyxcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUvZWRpdCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9wcm9maWxlL2VkaXQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0VkaXRQcm9maWxlQ3RybCBhcyBwcm9maWxlJ1xuICAgICAgKVxuXG4gICAgICAjIFN0b3Jlc1xuICAgICAgLnN0YXRlKCdzdG9yZXMnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhTdG9yZUN0cmwgYXMgc3RvcmVzJ1xuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgZmxhc2hTdWNjZXNzOiBudWxsXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3N0b3Jlc19jcmVhdGUnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzL2NyZWF0ZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvY3JlYXRlLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVTdG9yZUN0cmwgYXMgc3RvcmUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3N0b3Jlc19lZGl0JyxcbiAgICAgICAgdXJsOiAnL3N0b3Jlcy86aWQvZWRpdCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvZWRpdC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRWRpdFN0b3JlQ3RybCBhcyBzdG9yZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc3RvcmVzX3Nob3cnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzLzppZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvc2hvdy5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2hvd1N0b3JlQ3RybCBhcyBzdG9yZSdcbiAgICAgIClcblxuICAgICAgIyBVc2Vyc1xuICAgICAgLnN0YXRlKCd1c2VycycsXG4gICAgICAgIHVybDogJy91c2VycydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2Vycy9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhVc2VyQ3RybCBhcyB1c2VycydcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIGZsYXNoU3VjY2VzczogbnVsbFxuICAgICAgKVxuICAgICAgLnN0YXRlKCd1c2Vyc19jcmVhdGUnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvY3JlYXRlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXJzL2NyZWF0ZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlVXNlckN0cmwgYXMgdXNlcidcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgndXNlcnNfc2hvdycsXG4gICAgICAgIHVybDogJy91c2Vycy86aWQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlcnMvc2hvdy5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2hvd1VzZXJDdHJsIGFzIHVzZXInXG4gICAgICApXG5cbiAgICAgICMgUm91dGVzXG4gICAgICAuc3RhdGUoJ3JvdXRlcycsXG4gICAgICAgIHVybDogJy9yb3V0ZXMnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFJvdXRlQ3RybCBhcyByb3V0ZXMnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICBmbGFzaFN1Y2Nlc3M6IG51bGxcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncm91dGVzX2NyZWF0ZScsXG4gICAgICAgIHVybDogJy9yb3V0ZXMvY3JlYXRlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9jcmVhdGUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVJvdXRlQ3RybCBhcyByb3V0ZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncm91dGVzX2VkaXQnLFxuICAgICAgICB1cmw6ICcvcm91dGVzLzppZC9lZGl0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9lZGl0Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0Um91dGVDdHJsIGFzIHJvdXRlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdyb3V0ZXNfc2hvdycsXG4gICAgICAgIHVybDogJy9yb3V0ZXMvOmlkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9zaG93Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaG93Um91dGVDdHJsIGFzIHJvdXRlJ1xuICAgICAgKVxuXG4gICAgICAjIE1hcFxuICAgICAgLnN0YXRlKCdtYXAnLFxuICAgICAgICB1cmw6ICcvbWFwJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL21hcC9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhNYXBDdHJsIGFzIG1hcCdcbiAgICAgIClcblxuICAgIHJldHVyblxuXG4gICkucnVuICgkYXV0aCwgJGh0dHAsICRsb2NhdGlvbiwgJHEsICRyb290U2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQpIC0+XG4gICAgcHVibGljUm91dGVzID0gW1xuICAgICAgJ3NpZ25fdXAnLFxuICAgICAgJ2NvbmZpcm0nLFxuICAgICAgJ2ZvcmdvdF9wYXNzd29yZCcsXG4gICAgICAncmVzZXRfcGFzc3dvcmQnXG4gICAgXVxuXG4gICAgIyBpZiBub3QgbG9nZ2VkXG4gICAgJHRpbWVvdXQoKCktPlxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50U3RhdGUgPSAkc3RhdGUuY3VycmVudC5uYW1lXG5cbiAgICAgIGlmICEkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSAmJlxuICAgICAgcHVibGljUm91dGVzLmluZGV4T2YoJHJvb3RTY29wZS5jdXJyZW50U3RhdGUpID09IC0xXG4gICAgICAgICRsb2NhdGlvbi5wYXRoICd1c2VyL3NpZ25faW4nXG5cbiAgICAgIGlmICRhdXRoLmlzQXV0aGVudGljYXRlZCAmJlxuICAgICAgKHB1YmxpY1JvdXRlcy5pbmRleE9mKCRyb290U2NvcGUuY3VycmVudFN0YXRlKSA9PSAwIHx8XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRTdGF0ZSA9PSAnc2lnbl9pbicpXG4gICAgICAgICRsb2NhdGlvbi5wYXRoICcvJ1xuICAgICwgMClcblxuICAgICRyb290U2NvcGUuJG9uICckc3RhdGVDaGFuZ2VTdGFydCcsIChldmVudCwgdG9TdGF0ZSkgLT5cbiAgICAgIHVzZXIgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJykpXG5cbiAgICAgIGlmIHVzZXIgJiYgJGF1dGguaXNBdXRoZW50aWNhdGVkKClcbiAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZVxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlclxuXG4gICAgICAgIGlmICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSAnL2ltYWdlcy8nICsgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gJ3VwbG9hZHMvYXZhdGFycy8nICsgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXJcblxuICAgICAgJHJvb3RTY29wZS5sb2dvdXQgPSAtPlxuICAgICAgICAkYXV0aC5sb2dvdXQoKS50aGVuIC0+XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0gJ3VzZXInXG4gICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbFxuXG4gICAgICAgICAgJHN0YXRlLmdvICdzaWduX2luJ1xuXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG5cbiAgICByZXR1cm4iLCJjaGVja2JveEZpZWxkID0gKCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUEnXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9jaGVja2JveF9maWVsZC5odG1sJ1xuICAgIHNjb3BlOiB7XG4gICAgICBsYWJlbDogJz1sYWJlbCdcbiAgICAgIGF0dHJDbGFzczogJz0/YXR0ckNsYXNzJ1xuICAgICAgbmdDaGVja2VkOiAnPT9uZ0NoZWNrZWQnXG4gICAgICBtb2RlbDogJz1tb2RlbCdcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKS0+XG4gICAgICBpZiBzY29wZS5tb2RlbCA9PSAnMSdcbiAgICAgICAgc2NvcGUubW9kZWwgPSB0cnVlXG4gICAgICBlbHNlIGlmIHNjb3BlLm1vZGVsID09ICcwJ1xuICAgICAgICBzY29wZS5tb2RlbCA9IGZhbHNlXG4gICAgICByZXR1cm5cbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2NoZWNrYm94RmllbGQnLCBjaGVja2JveEZpZWxkIiwiZGF0ZXRpbWVwaWNrZXIgPSAoJHRpbWVvdXQpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuaHRtbCdcbiAgICByZXF1aXJlOiAnbmdNb2RlbCdcbiAgICBzY29wZToge1xuICAgICAgbGFiZWw6IFwiPT9sYWJlbFwiXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0ciwgbmdNb2RlbCkgLT5cbiAgICAgIHNjb3BlLm9wZW4gPSAoKSAtPlxuICAgICAgICBzY29wZS5kYXRlX29wZW5lZCA9IHRydWVcblxuICAgICAgJHRpbWVvdXQoXG4gICAgICAgICgoKSAtPlxuICAgICAgICAgIHNjb3BlLm1vZGVsID0gRGF0ZS5wYXJzZShuZ01vZGVsLiR2aWV3VmFsdWUpXG4gICAgICAgICksIDQwMFxuICAgICAgKVxuXG4gICAgICBzY29wZS5zZWxlY3REYXRlID0gKChtb2RlbCkgLT5cbiAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobW9kZWwpXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdkYXRldGltZXBpY2tlcicsIGRhdGV0aW1lcGlja2VyIiwiZGVsZXRlQXZhdGFyID0gKCR0aW1lb3V0KSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQSdcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2RlbGV0ZV9hdmF0YXIuaHRtbCdcbiAgICBzY29wZTpcbiAgICAgIHJlbW92ZUF2YXRhcjogJz1uZ01vZGVsJ1xuICAgICAgZmlsZTogXCI9ZmlsZVwiXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdpbWdOYW1lJywgKHZhbHVlKSAtPlxuICAgICAgICBzY29wZS5pbWdOYW1lID0gdmFsdWVcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHNjb3BlLnJlbW92ZSA9ICgpIC0+XG4gICAgICAgICR0aW1lb3V0KCgpLT5cbiAgICAgICAgICBzY29wZS5pbWdOYW1lID0gJ2ltYWdlcy9kZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgIClcblxuICAgICAgICBpZiBzY29wZS5maWxlICE9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICAgc2NvcGUucmVtb3ZlQXZhdGFyID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnZGVsZXRlQXZhdGFyJywgZGVsZXRlQXZhdGFyIiwiZmlsZUZpZWxkID0gKCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnQUUnXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2ZpbGVfZmllbGQuaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgYXR0cklkOiAnPSdcbiAgICAgIG5nTW9kZWw6ICc9bmdNb2RlbCdcbiAgICAgIHJlbW92ZUF2YXRhcjogJz0/cmVtb3ZlZEF2YXRhcidcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgZWxlbWVudC5iaW5kICdjaGFuZ2UnLCAoY2hhbmdlRXZlbnQpIC0+XG4gICAgICAgIHNjb3BlLm5nTW9kZWwgPSBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgICAgIHNjb3BlLnJlbW92ZUF2YXRhciA9IGZhbHNlICMgZm9yIGRlbGV0ZV9hdmF0YXIgZGlyZWN0aXZlXG4gICAgICAgIGZpbGVzID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGVzWzBdLm5hbWU7XG4gICAgICAgIGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT10ZXh0XScpLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBmaWxlTmFtZSlcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2ZpbGVGaWVsZCcsIGZpbGVGaWVsZCIsInBhZ2luYXRpb24gPSAoJGh0dHApIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYWdpbmF0aW9uLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIHBhZ2lBcnI6ICc9J1xuICAgICAgaXRlbXM6ICc9J1xuICAgICAgcGFnaUFwaVVybDogJz0nXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIHNjb3BlLiR3YXRjaCAoLT5cbiAgICAgICAgc2NvcGUucGFnaUFyclxuICAgICAgKSwgKChuZXdWYWx1ZSwgb2xkVmFsdWUpIC0+XG4gICAgICAgIGlmICFhbmd1bGFyLmVxdWFscyhvbGRWYWx1ZSwgbmV3VmFsdWUpXG4gICAgICAgICAgc2NvcGUucGFnaUFyciA9IG5ld1ZhbHVlXG4gICAgICAgICAgc2NvcGUudG90YWxQYWdlcyA9IHNjb3BlLnBhZ2lBcnIubGFzdF9wYWdlXG4gICAgICAgICAgc2NvcGUuY3VycmVudFBhZ2UgPSBzY29wZS5wYWdpQXJyLmN1cnJlbnRfcGFnZVxuICAgICAgICAgIHNjb3BlLnRvdGFsID0gc2NvcGUucGFnaUFyci50b3RhbFxuICAgICAgICAgIHNjb3BlLnBlclBhZ2UgPSBzY29wZS5wYWdpQXJyLnBlcl9wYWdlXG5cbiAgICAgICAgICAjIFBhZ2luYXRpb24gUmFuZ2VcbiAgICAgICAgICBzY29wZS5wYWluYXRpb25SYW5nZShzY29wZS50b3RhbFBhZ2VzKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgdHJ1ZVxuXG4gICAgICBzY29wZS5nZXRQb3N0cyA9IChwYWdlTnVtYmVyKSAtPlxuICAgICAgICBpZiBwYWdlTnVtYmVyID09IHVuZGVmaW5lZFxuICAgICAgICAgIHBhZ2VOdW1iZXIgPSAnMSdcbiAgICAgICAgJGh0dHAuZ2V0KHNjb3BlLnBhZ2lBcGlVcmwrJz9wYWdlPScgKyBwYWdlTnVtYmVyKS5zdWNjZXNzIChyZXNwb25zZSkgLT5cbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgc2NvcGUuaXRlbXMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgc2NvcGUudG90YWxQYWdlcyA9IHJlc3BvbnNlLmxhc3RfcGFnZVxuICAgICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlXG5cbiAgICAgICAgICAjIFBhZ2luYXRpb24gUmFuZ2VcbiAgICAgICAgICBzY29wZS5wYWluYXRpb25SYW5nZShzY29wZS50b3RhbFBhZ2VzKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICByZXR1cm5cblxuICAgICAgc2NvcGUucGFpbmF0aW9uUmFuZ2UgPSAodG90YWxQYWdlcykgLT5cbiAgICAgICAgcGFnZXMgPSBbXVxuICAgICAgICBpID0gMVxuICAgICAgICB3aGlsZSBpIDw9IHRvdGFsUGFnZXNcbiAgICAgICAgICBwYWdlcy5wdXNoIGlcbiAgICAgICAgICBpKytcbiAgICAgICAgc2NvcGUucmFuZ2UgPSBwYWdlc1xuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAncGFnaW5hdGlvbicsIHBhZ2luYXRpb24iLCJyYWRpb0ZpZWxkID0gKCRodHRwKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQSdcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL3JhZGlvX2ZpZWxkLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIG5nTW9kZWw6IFwiPW5nTW9kZWxcIlxuICAgICAgbGFiZWw6ICc9bGFiZWwnXG4gICAgICBhdHRyTmFtZTogJz1hdHRyTmFtZSdcbiAgICAgIGF0dHJWYWx1ZTogJz1hdHRyVmFsdWUnXG4gICAgICBuZ0NoZWNrZWQ6ICc9P25nQ2hlY2tlZCdcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKS0+XG4gICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUuYXR0clZhbHVlXG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2hhbmdlJywgKCktPlxuICAgICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUuYXR0clZhbHVlXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdyYWRpb0ZpZWxkJywgcmFkaW9GaWVsZCIsInRpbWVwaWNrZXIgPSAoKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdBRSdcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL3RpbWVwaWNrZXIuaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgbW9kZWw6IFwiPW5nTW9kZWxcIlxuICAgICAgbGFiZWw6IFwiPT9sYWJlbFwiXG4gICAgICBhdHRyTmFtZTogXCJAXCJcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgc2NvcGUuaHN0ZXAgPSAxXG4gICAgICBzY29wZS5tc3RlcCA9IDVcbiAgICAgIHNjb3BlLmlzbWVyaWRpYW4gPSB0cnVlXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICd0aW1lcGlja2VyJywgdGltZXBpY2tlciIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wdXNoZXJOb3RpZmljYXRpb25zJywgW1xuICAgICdub3RpZmljYXRpb24nXG4gIF0pXG4gIC5ydW4gKCRub3RpZmljYXRpb24sICRyb290U2NvcGUpIC0+XG4gICAgIyBjb25zb2xlLmxvZygncnVuJyk7XG4gICAgIyBQdXNoZXIubG9nID0gKG1zZykgLT5cbiAgICAjICAgY29uc29sZS5sb2cobXNnKVxuICAgIG5ld1JvdXRlTWVzc2FnZSA9ICdZT1UgSEFWRSBBIE5FVyBST1VURS4nXG4gICAgcmVkVHJ1Y2tJY29uID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgIHB1c2hlciA9IG5ldyBQdXNoZXIoJzZiNThjMTI0M2RmODIwMjhhNzg4Jywge1xuICAgICAgY2x1c3RlcjogJ2V1JyxcbiAgICAgIGVuY3J5cHRlZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgY2hhbm5lbCA9IHB1c2hlci5zdWJzY3JpYmUoJ25ldy1yb3V0ZS1jaGFubmVsJyk7XG5cbiAgICBjaGFubmVsLmJpbmQoJ0FwcFxcXFxFdmVudHNcXFxcTmV3Um91dGUnLCAoZGF0YSktPlxuICAgICAgaWYgKCRyb290U2NvcGUuY3VycmVudFVzZXIuaWQgPT0gZGF0YS51c2VySWQpXG4gICAgICAgICRub3RpZmljYXRpb24oJ05ldyBtZXNzYWdlIScsIHtcbiAgICAgICAgICBib2R5OiBuZXdSb3V0ZU1lc3NhZ2VcbiAgICAgICAgICBpY29uOiByZWRUcnVja0ljb25cbiAgICAgICAgICB2aWJyYXRlOiBbMjAwLCAxMDAsIDIwMF1cbiAgICAgICAgfSlcbiAgICApO1xuXG4gICAgcmV0dXJuXG4iLCJJbmRleEhvbWVDdHJsID0gKCRodHRwLCAkdGltZW91dCwgJGZpbHRlciwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgIyBSb3V0ZXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9ob21lJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBNYXBcbiAgYXBpS2V5ID0gJ2EzMDNkM2E0NGEwMWM5ZjhhNWNiMDEwN2IwMzNlZmJlJ1xuICB2bS5tYXJrZXJzID0gW11cblxuXG4gICMjIyAgUk9VVEVTICAjIyNcbiAgaWYgJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VyX2dyb3VwID09ICdhZG1pbidcbiAgICAkaHR0cC5nZXQoJy9hcGkvaG9tZScpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucm91dGVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgICB2bS5wYWdpQXJyID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgICByZXR1cm5cbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgIyMjICBNQVAgICMjI1xuICAjIEdldCBwb2ludHMgSlNPTlxuICAkaHR0cChcbiAgICBtZXRob2Q6ICdHRVQnXG4gICAgdXJsOiAnL2FwaS9ob21lL2dldHBvaW50cycpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIGluaXRNYXAoKVxuXG4gICAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJylcblxuICAgIHZtLnByZWRpY2F0ZSA9IHByZWRpY2F0ZVxuICAgIHZtLnJldmVyc2UgPSBpZiAodm0ucHJlZGljYXRlID09IHByZWRpY2F0ZSkgdGhlbiAhdm0ucmV2ZXJzZSBlbHNlIGZhbHNlXG4gICAgdm0ucm91dGVzID0gb3JkZXJCeSh2bS5yb3V0ZXMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG5cbiAgaW5pdE1hcCA9IC0+XG4gICAgbWFwT3B0aW9ucyA9XG4gICAgICB6b29tOiAxMlxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2VcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczogcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTVxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTA3MzUwOSwgLTAuMTI3NzU4MylcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzXG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlXG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2goIHZtLnBvaW50cywgKHZhbHVlLCBrZXkpIC0+XG4gICAgICBhZGRyZXNzID0gdmFsdWUuc3RvcmUuYWRkcmVzc1xuICAgICAgIyBHZW9jb2RlIEFkZHJlc3NlcyBieSBhZGRyZXNzIG5hbWVcbiAgICAgIGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmNhZ2VkYXRhLmNvbS9nZW9jb2RlL3YxL2pzb24/cT1cIithZGRyZXNzK1wiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleTtcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICByZXEub25sb2FkID0gKCkgLT5cbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHBvc2l0aW9uID0gcmVzcG9uc2UucmVzdWx0c1swXS5nZW9tZXRyeVxuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMClcbiAgICAgICAgICAgIGNvbnRlbnRTdHJpbmcgPVxuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1hcmtlci1jb250ZW50XCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ0FkZHJlc3M6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUuYWRkcmVzcyArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnUGhvbmU6PC9zcGFuPiAnICsgdmFsdWUuc3RvcmUucGhvbmUgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nXG5cbiAgICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpICMgcG9wdXBcblxuICAgICAgICAgICAgIyBzZWxlY3QgaWNvbnMgYnkgc3RhdHVzIChncmVlbiBvciByZWQpXG4gICAgICAgICAgICBpZiBwYXJzZUludCB2YWx1ZS5zdGF0dXNcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICAgICAgICBpY29uOiB2bS5iYWxvb25OYW1lXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IG90aGVyIG1hcmtlclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpZiggcHJldkluZm9XaW5kb3cgKVxuICAgICAgICAgICAgICAgIHByZXZJbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5nZXRQb3NpdGlvbigpKSAjIGFuaW1hdGUgbW92ZSBiZXR3ZWVuIG1hcmtlcnNcbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuIG1hcCwgbWFya2VyXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgZW1wdHkgbWFwIGFyZWFcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgLT5cbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQWRkIG5ldyBtYXJrZXIgdG8gYXJyYXkgZm9yIG91dHNpZGUgbWFwIGxpbmtzIChvcmRlcmVkIGJ5IGlkIGluIGJhY2tlbmQpXG4gICAgICAgICAgICB2bS5tYXJrZXJzLnB1c2gobWFya2VyKVxuICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgYXBpVXJsLCB0cnVlKTtcbiAgICAgIHJlcS5zZW5kKCk7XG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uc3R5bGVzID0gW1xuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd3YXRlcidcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZTllOWU5JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2xhbmRzY2FwZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDI5IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMC4yIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuYXJ0ZXJpYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pLnBhcmsnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2RlZGVkZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAndmlzaWJpbGl0eSc6ICdvbicgfVxuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnc2F0dXJhdGlvbic6IDM2IH1cbiAgICAgICAgeyAnY29sb3InOiAnIzMzMzMzMycgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMuaWNvbidcbiAgICAgICdzdHlsZXJzJzogWyB7ICd2aXNpYmlsaXR5JzogJ29mZicgfSBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd0cmFuc2l0J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmMmYyZjInIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMS4yIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICAjIEdvIHRvIHBvaW50IGFmdGVyIGNsaWNrIG91dHNpZGUgbWFwIGxpbmtcbiAgdm0uZ29Ub1BvaW50ID0gKGlkKSAtPlxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodm0ubWFya2Vyc1tpZF0sICdjbGljaycpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhIb21lQ3RybCcsIEluZGV4SG9tZUN0cmwpIiwiSW5kZXhNYXBDdHJsID0gKCRodHRwLCAkdGltZW91dCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgIyBNYXBcbiAgYXBpS2V5ID0gJ2EzMDNkM2E0NGEwMWM5ZjhhNWNiMDEwN2IwMzNlZmJlJztcbiAgdm0ubWFya2VycyA9IFtdXG5cbiAgIyBHZXQgcG9pbnRzIEpTT05cbiAgJGh0dHAoXG4gICAgbWV0aG9kOiAnR0VUJ1xuICAgIHVybDogJy9hcGkvbWFwJykudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YVxuICAgICAgIyBJbml0IG1hcFxuICAgICAgaW5pdE1hcCgpXG4gICAgICByZXR1cm5cbiAgKVxuXG4gIGluaXRNYXAgPSAtPlxuICAgIG1hcE9wdGlvbnMgPVxuICAgICAgem9vbTogMTJcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZVxuICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlXG4gICAgICB6b29tQ29udHJvbE9wdGlvbnM6IHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9CT1RUT01cbiAgICAgIGNlbnRlcjogbmV3IChnb29nbGUubWFwcy5MYXRMbmcpKDUxLjUwNzM1MDksIC0wLjEyNzc1ODMpXG4gICAgICBzdHlsZXM6IHZtLnN0eWxlc1xuXG4gICAgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKVxuICAgIG1hcCA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFwKShtYXBFbGVtZW50LCBtYXBPcHRpb25zKVxuICAgIHByZXZJbmZvV2luZG93ID1mYWxzZTtcblxuICAgICMgU2V0IGxvY2F0aW9uc1xuICAgIGFuZ3VsYXIuZm9yRWFjaCggdm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiK2FkZHJlc3MrXCImcHJldHR5PTEma2V5PVwiICsgYXBpS2V5O1xuICAgICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwKVxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcblxuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZykgIyBwb3B1cFxuXG4gICAgICAgICAgIyBzZWxlY3QgaWNvbnMgYnkgc3RhdHVzIChncmVlbiBvciByZWQpXG4gICAgICAgICAgaWYgcGFyc2VJbnQgdmFsdWUuc3RhdHVzXG4gICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbi5wbmcnXG5cbiAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICAgICAgaWNvbjogdm0uYmFsb29uTmFtZVxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgIyBDbGljayBieSBvdGhlciBtYXJrZXJcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIC0+XG4gICAgICAgICAgICBpZiggcHJldkluZm9XaW5kb3cgKVxuICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5nZXRQb3NpdGlvbigpKSAjIGFuaW1hdGUgbW92ZSBiZXR3ZWVuIG1hcmtlcnNcbiAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbiBtYXAsIG1hcmtlclxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICApXG5cbiAgICAgICAgICAjIENsaWNrIGJ5IGVtcHR5IG1hcCBhcmVhXG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIClcblxuICAgICAgICAgICMgQWRkIG5ldyBtYXJrZXIgdG8gYXJyYXkgZm9yIG91dHNpZGUgbWFwIGxpbmtzIChvcmRlcmVkIGJ5IGlkIGluIGJhY2tlbmQpXG4gICAgICAgICAgdm0ubWFya2Vycy5wdXNoKG1hcmtlcilcbiAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIGFwaVVybCwgdHJ1ZSk7XG4gICAgICByZXEuc2VuZCgpO1xuICAgIClcbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaydcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfVxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJ1xuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleE1hcEN0cmwnLCBJbmRleE1hcEN0cmwpIiwiRWRpdFByb2ZpbGVDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3Byb2ZpbGUvZWRpdCcpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0udXNlciA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHZtLnVzZXIucmVtb3ZlX2F2YXRhciA9IGZhbHNlXG5cbiAgICAgIHZtLmF2YXRhciA9IHZtLm1ha2VBdmF0YXJMaW5rKHZtLnVzZXIuYXZhdGFyKSAjIGZvciBkZWxldGVfYXZhdGFyIGRpcmVjdGl2ZVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBhdmF0YXIgPSB2bS51c2VyLmF2YXRhclxuXG4gICAgaWYgdm0udXNlci5hdmF0YXIgPT0gJy9pbWFnZXMvZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0udXNlci5hdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJyAjIHRvZG8gaHogbWF5IGJlIGZvciBkZWxldGVcbiAgICAgIGF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgdm0uZGF0YSA9XG4gICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgcmVtb3ZlX2F2YXRhcjogdm0udXNlci5yZW1vdmVfYXZhdGFyXG4gICAgICBuYW1lOiB2bS51c2VyLm5hbWVcbiAgICAgIGxhc3RfbmFtZTogdm0udXNlci5sYXN0X25hbWVcbiAgICAgIGluaXRpYWxzOiB2bS51c2VyLmluaXRpYWxzXG4gICAgICBiZGF5OiB2bS51c2VyLmJkYXlcbiAgICAgIGVtYWlsOiB2bS51c2VyLmVtYWlsXG4gICAgICBwaG9uZTogdm0udXNlci5waG9uZVxuICAgICAgam9iX3RpdGxlOiB2bS51c2VyLmpvYl90aXRsZVxuICAgICAgY291bnRyeTogdm0udXNlci5jb3VudHJ5XG4gICAgICBjaXR5OiB2bS51c2VyLmNpdHlcblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3Byb2ZpbGUvJyArIHZtLnVzZXIuaWRcbiAgICAgIG1ldGhvZDogJ1Bvc3QnXG4gICAgICBkYXRhOiB2bS5kYXRhXG4gICAgKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICBmaWxlTmFtZSA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpXG4gICAgICBzdG9yYWdlID0gSlNPTi5wYXJzZShzdG9yYWdlKVxuXG4gICAgICAjIERlZmF1bHQgYXZhdGFyXG4gICAgICBpZiB0eXBlb2YgZmlsZU5hbWUgPT0gJ2Jvb2xlYW4nICYmIHZtLnVzZXIucmVtb3ZlX2F2YXRhclxuICAgICAgICBzdG9yYWdlLmF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAjIFVwZGF0ZSBzdG9yYWdlXG4gICAgICBlbHNlIGlmIHR5cGVvZiBmaWxlTmFtZSA9PSAnc3RyaW5nJyAmJiAhdm0udXNlci5yZW1vdmVfYXZhdGFyXG4gICAgICAgIHN0b3JhZ2UuYXZhdGFyID0gZmlsZU5hbWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSB2bS5tYWtlQXZhdGFyTGluayhzdG9yYWdlLmF2YXRhcilcbiAgICAgICAgc3RvcmFnZS5hdmF0YXIgPSBmaWxlTmFtZVxuXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2UpKVxuXG4gICAgICAkc3RhdGUuZ28gJ3Byb2ZpbGUnLCB7IGZsYXNoU3VjY2VzczogJ1Byb2ZpbGUgdXBkYXRlZCEnIH1cbiAgICApLCAoKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcik7XG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgdm0ubWFrZUF2YXRhckxpbmsgPSAoYXZhdGFyTmFtZSkgLT5cbiAgICBpZiBhdmF0YXJOYW1lID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICBhdmF0YXJOYW1lID0gJy9pbWFnZXMvJyArIGF2YXRhck5hbWVcbiAgICBlbHNlXG4gICAgICBhdmF0YXJOYW1lID0gJy91cGxvYWRzL2F2YXRhcnMvJyArIGF2YXRhck5hbWVcblxuICAgIHJldHVybiBhdmF0YXJOYW1lXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFByb2ZpbGVDdHJsJywgRWRpdFByb2ZpbGVDdHJsKSIsIkluZGV4UHJvZmlsZUN0cmwgPSAoJGh0dHApIC0+XG4gIHZtID0gdGhpc1xuXG4gICRodHRwLmdldCgnL2FwaS9wcm9maWxlJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS51c2VyID0gcmVzcG9uc2UuZGF0YS51c2VyXG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhLnBvaW50c1xuICAgICAgaWYgdm0udXNlci5hdmF0YXIgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgdm0udXNlci5hdmF0YXIgPSAnL2ltYWdlcy8nICsgdm0udXNlci5hdmF0YXJcbiAgICAgIGVsc2VcbiAgICAgICAgdm0udXNlci5hdmF0YXIgPSAndXBsb2Fkcy9hdmF0YXJzLycgKyB2bS51c2VyLmF2YXRhclxuXG4gICAgICB2bS51c2VyLmJkYXkgPSBtb21lbnQobmV3IERhdGUodm0udXNlci5iZGF5KSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLnVwZGF0ZVBvaW50cyA9ICgpIC0+XG4gICAgJGh0dHAucHV0KCcvYXBpL3Byb2ZpbGUvdXBkYXRlcG9pbnRzJywgdm0ucG9pbnRzKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnUG9pbnRzIHVwZGF0ZWQhJ1xuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4UHJvZmlsZUN0cmwnLCBJbmRleFByb2ZpbGVDdHJsKSIsIkNyZWF0ZVN0b3JlQ3RybCA9ICgkc2NvcGUsICRodHRwLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmNyZWF0ZSA9ICgpIC0+XG4gICAgc3RvcmUgPVxuICAgICAgbmFtZTogdm0uc3RvcmVOYW1lXG4gICAgICBvd25lcl9uYW1lOiB2bS5vd25lck5hbWVcbiAgICAgIGFkZHJlc3M6IHZtLmFkZHJlc3NcbiAgICAgIHBob25lOiB2bS5waG9uZVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG5cbiAgICAkaHR0cC5wb3N0KCcvYXBpL3N0b3JlcycsIHN0b3JlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHN0b3JlIGNyZWF0ZWQhJyB9XG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgJHNjb3BlLmdldExvY2F0aW9uID0gKGFkZHJlc3MpIC0+XG4gICAgJGh0dHAuZ2V0KCcvL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uJyxcbiAgICAgIHBhcmFtczpcbiAgICAgICAgYWRkcmVzczogYWRkcmVzc1xuICAgICAgICBsYW5ndWFnZTogJ2VuJ1xuICAgICAgICBjb21wb25lbnRzOiAnY291bnRyeTpVS3xhZG1pbmlzdHJhdGl2ZV9hcmVhOkxvbmRvbidcbiAgICAgIHNraXBBdXRob3JpemF0aW9uOiB0cnVlICMgZm9yIGVycm9lIG9mIC4uIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcbiAgICApLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgcmVzcG9uc2UuZGF0YS5yZXN1bHRzLm1hcCAoaXRlbSkgLT5cbiAgICAgICAgaXRlbS5mb3JtYXR0ZWRfYWRkcmVzc1xuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVN0b3JlQ3RybCcsIENyZWF0ZVN0b3JlQ3RybCkiLCJFZGl0U3RvcmVDdHJsID0gKCRzY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAkaHR0cC5nZXQoJ2FwaS9zdG9yZXMvJyt2bS5pZCkudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uZGF0YSA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS51cGRhdGUgPSAoKSAtPlxuICAgIHN0b3JlID1cbiAgICAgIG5hbWU6IHZtLmRhdGEubmFtZVxuICAgICAgb3duZXJfbmFtZTogdm0uZGF0YS5vd25lcl9uYW1lXG4gICAgICBhZGRyZXNzOiB2bS5kYXRhLmFkZHJlc3NcbiAgICAgIHBob25lOiB2bS5kYXRhLnBob25lXG4gICAgICBlbWFpbDogdm0uZGF0YS5lbWFpbFxuXG4gICAgJGh0dHAucGF0Y2goJy9hcGkvc3RvcmVzLycgKyB2bS5pZCwgc3RvcmUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAnc3RvcmVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdTdG9yZSBVcGRhdGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gICRzY29wZS5nZXRMb2NhdGlvbiA9IChhZGRyZXNzKSAtPlxuICAgICRodHRwLmdldCgnLy9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbicsXG4gICAgICBwYXJhbXM6XG4gICAgICAgIGFkZHJlc3M6IGFkZHJlc3NcbiAgICAgICAgbGFuZ3VhZ2U6ICdlbidcbiAgICAgICAgY29tcG9uZW50czogJ2NvdW50cnk6VUt8YWRtaW5pc3RyYXRpdmVfYXJlYTpMb25kb24nXG4gICAgICBza2lwQXV0aG9yaXphdGlvbjogdHJ1ZSAjIGZvciBlcnJvZSBvZiAuLiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXG4gICAgKS50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHJlc3BvbnNlLmRhdGEucmVzdWx0cy5tYXAgKGl0ZW0pIC0+XG4gICAgICAgIGl0ZW0uZm9ybWF0dGVkX2FkZHJlc3NcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdFZGl0U3RvcmVDdHJsJywgRWRpdFN0b3JlQ3RybCkiLCJJbmRleFN0b3JlQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9zdG9yZXMnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uc3RvcmVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJyk7XG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnN0b3JlcyA9IG9yZGVyQnkodm0uc3RvcmVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9zdG9yZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0uc3RvcmVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1N0b3JlIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4U3RvcmVDdHJsJywgSW5kZXhTdG9yZUN0cmwpIiwiU2hvd1N0b3JlQ3RybCA9ICgkaHR0cCwgJHN0YXRlUGFyYW1zLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5pZCA9ICRzdGF0ZVBhcmFtcy5pZFxuXG4gICRodHRwLmdldCgnYXBpL3N0b3Jlcy8nK3ZtLmlkKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YVxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLmRlbGV0ZVN0b3JlID0gKGlkKSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJ2FwaS9zdG9yZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAnc3RvcmVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdTdG9yZSBkZWxldGVkIScgfVxuICAgICAgICByZXR1cm5cbiAgICAgIClcblxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaG93U3RvcmVDdHJsJywgU2hvd1N0b3JlQ3RybCkiLCJDb25maXJtQ29udHJvbGxlciA9ICgkYXV0aCwgJHN0YXRlLCAkaHR0cCwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uZGF0YSA9XG4gICAgY29uZmlybWF0aW9uX2NvZGU6ICRzdGF0ZVBhcmFtcy5jb25maXJtYXRpb25fY29kZVxuXG4gICRodHRwLnBvc3QoJ2FwaS9hdXRoZW50aWNhdGUvY29uZmlybScsIHZtLmRhdGEpLnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICMgU2F2ZSB0b2tlblxuICAgICRhdXRoLnNldFRva2VuKGRhdGEudG9rZW4pXG5cbiAgICAjIFNhdmUgdXNlciBpbiBsb2NhbFN0b3JhZ2VcbiAgICB1c2VyID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSAndXNlcicsIHVzZXJcbiAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG4gICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IGRhdGFcblxuICAgICRzdGF0ZS5nbyAnLydcbiAgKS5lcnJvciAoZGF0YSwgc3RhdHVzLCBoZWFkZXIsIGNvbmZpZykgLT5cbiAgICAkc3RhdGUuZ28gJ3NpZ25faW4nXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ29uZmlybUNvbnRyb2xsZXInLCBDb25maXJtQ29udHJvbGxlcikiLCJGb3Jnb3RQYXNzd29yZENvbnRyb2xsZXIgPSAoJGh0dHApIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLnJlc3RvcmVQYXNzd29yZCA9ICgpLT5cbiAgICB2bS5zcGlubmVyRG9uZSA9IHRydWVcbiAgICBkYXRhID1cbiAgICAgIGVtYWlsOiB2bS5lbWFpbFxuXG4gICAgJGh0dHAucG9zdCgnYXBpL2F1dGhlbnRpY2F0ZS9zZW5kX3Jlc2V0X2NvZGUnLCBkYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICAgIGlmKGRhdGEpXG4gICAgICAgIHZtLnN1Y2Nlc3NTZW5kaW5nRW1haWwgPSB0cnVlXG4gICAgKS5lcnJvciAoZXJyb3IsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0ZvcmdvdFBhc3N3b3JkQ29udHJvbGxlcicsIEZvcmdvdFBhc3N3b3JkQ29udHJvbGxlcikiLCJSZXNldFBhc3N3b3JkQ29udHJvbGxlciA9ICgkYXV0aCwgJHN0YXRlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0ubWlubGVuZ3RoID0gOFxuXG4gIHZtLnJlc3RvcmVQYXNzd29yZCA9IChmb3JtKSAtPlxuICAgIGRhdGEgPSB7XG4gICAgICByZXNldF9wYXNzd29yZF9jb2RlOiAkc3RhdGVQYXJhbXMucmVzZXRfcGFzc3dvcmRfY29kZVxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG4gICAgICBwYXNzd29yZF9jb25maXJtYXRpb246IHZtLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuICAgIH1cblxuICAgICRodHRwLnBvc3QoJ2FwaS9hdXRoZW50aWNhdGUvcmVzZXRfcGFzc3dvcmQnLCBkYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAgIGlmKGRhdGEpXG4gICAgICAgIHZtLnN1Y2Nlc3NSZXN0b3JlUGFzc3dvcmQgPSB0cnVlXG4gICAgKS5lcnJvciAoZXJyb3IsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0UGFzc3dvcmRDb250cm9sbGVyJywgUmVzZXRQYXNzd29yZENvbnRyb2xsZXIpIiwiU2lnbkluQ29udHJvbGxlciA9ICgkYXV0aCwgJHN0YXRlLCAkaHR0cCwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ubG9naW4gPSAoKSAtPlxuICAgIGNyZWRlbnRpYWxzID1cbiAgICAgIGVtYWlsOiB2bS5lbWFpbFxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG5cbiAgICAkYXV0aC5sb2dpbihjcmVkZW50aWFscykudGhlbiAoLT5cbiAgICAgICMgUmV0dXJuIGFuICRodHRwIHJlcXVlc3QgZm9yIHRoZSBub3cgYXV0aGVudGljYXRlZFxuICAgICAgIyB1c2VyIHNvIHRoYXQgd2UgY2FuIGZsYXR0ZW4gdGhlIHByb21pc2UgY2hhaW5cbiAgICAgICRodHRwLmdldCgnYXBpL2F1dGhlbnRpY2F0ZS9nZXRfdXNlcicpLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICB1c2VyID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZGF0YS51c2VyKVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSAndXNlcicsIHVzZXJcbiAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZVxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gcmVzcG9uc2UuZGF0YS51c2VyXG5cbiAgICAgICAgJHN0YXRlLmdvICcvJ1xuICAgICAgICByZXR1cm5cbiAgICApLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIGNvbnNvbGUubG9nKHZtLmVycm9yKTtcbiAgICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaWduSW5Db250cm9sbGVyJywgU2lnbkluQ29udHJvbGxlcikiLCJTaWduVXBDb250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLnJlZ2lzdGVyID0gKCktPlxuICAgIHZtLnNwaW5uZXJEb25lID0gdHJ1ZVxuICAgIGlmIHZtLnVzZXJcbiAgICAgIGNyZWRlbnRpYWxzID1cbiAgICAgICAgbmFtZTogdm0udXNlci5uYW1lXG4gICAgICAgIGVtYWlsOiB2bS51c2VyLmVtYWlsXG4gICAgICAgIHBhc3N3b3JkOiB2bS51c2VyLnBhc3N3b3JkXG4gICAgICAgIHBhc3N3b3JkX2NvbmZpcm1hdGlvbjogdm0udXNlci5wYXNzd29yZF9jb25maXJtYXRpb25cblxuICAgICRhdXRoLnNpZ251cChjcmVkZW50aWFscykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgICAkc3RhdGUuZ28gJ3NpZ25fdXBfc3VjY2VzcydcbiAgICAgIHJldHVyblxuICAgICkuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2lnblVwQ29udHJvbGxlcicsIFNpZ25VcENvbnRyb2xsZXIpXG4iLCJVc2VyQ29udHJvbGxlciA9ICgkaHR0cCwgJHN0YXRlLCAkYXV0aCwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0uZ2V0VXNlcnMgPSAtPlxuICAgICMgVGhpcyByZXF1ZXN0IHdpbGwgaGl0IHRoZSBpbmRleCBtZXRob2QgaW4gdGhlIEF1dGhlbnRpY2F0ZUNvbnRyb2xsZXJcbiAgICAjIG9uIHRoZSBMYXJhdmVsIHNpZGUgYW5kIHdpbGwgcmV0dXJuIHRoZSBsaXN0IG9mIHVzZXJzXG4gICAgJGh0dHAuZ2V0KCdhcGkvYXV0aGVudGljYXRlJykuc3VjY2VzcygodXNlcnMpIC0+XG4gICAgICB2bS51c2VycyA9IHVzZXJzXG4gICAgICByZXR1cm5cbiAgICApLmVycm9yIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG4gIHZtLmxvZ291dCA9IC0+XG4gICAgJGF1dGgubG9nb3V0KCkudGhlbiAtPlxuICAgICAgIyBSZW1vdmUgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtICd1c2VyJ1xuICAgICAgIyBGbGlwIGF1dGhlbnRpY2F0ZWQgdG8gZmFsc2Ugc28gdGhhdCB3ZSBubyBsb25nZXJcbiAgICAgICMgc2hvdyBVSSBlbGVtZW50cyBkZXBlbmRhbnQgb24gdGhlIHVzZXIgYmVpbmcgbG9nZ2VkIGluXG4gICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZVxuICAgICAgIyBSZW1vdmUgdGhlIGN1cnJlbnQgdXNlciBpbmZvIGZyb20gcm9vdHNjb3BlXG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbFxuICAgICAgJHN0YXRlLmdvICdzaWduX2luJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignVXNlckNvbnRyb2xsZXInLCBVc2VyQ29udHJvbGxlcikiLCJDcmVhdGVSb3V0ZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnBvaW50Rm9ybXMgPSBbXVxuXG4gICRodHRwLnBvc3QoJy9hcGkvcm91dGVzL2dldFVzZXJzQW5kU3RvcmVzJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICB2bS5jcmVhdGVSb3V0ZSA9ICgpIC0+XG4gICAgdm0ucm91dGUgPVxuICAgICAgdXNlcl9pZDogdm0udXNlcl9pZFxuICAgICAgZGF0ZTogdm0uZGF0ZVxuICAgICAgcG9pbnRzOiB2bS5wb2ludEZvcm1zXG5cbiAgICAkaHR0cC5wb3N0KCcvYXBpL3JvdXRlcycsIHZtLnJvdXRlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YVxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHJvdXRlIGhhcyBiZWVuIGFkZGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcik7XG5cbiAgICByZXR1cm5cblxuICB2bS5hZGRQb2ludCA9ICgpIC0+XG4gICAgdm0ucG9pbnRGb3Jtcy5wdXNoKHt9KVxuXG4gIHZtLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgIHZtLnBvaW50Rm9ybXMuc3BsaWNlKGluZGV4LCAxKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVJvdXRlQ3RybCcsIENyZWF0ZVJvdXRlQ3RybCkiLCJFZGl0Um91dGVDdHJsID0gKCRodHRwLCAkc3RhdGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG4gIHZtLmNvdW50ID0gMVxuXG4gICRodHRwLmdldCgnL2FwaS9yb3V0ZXMvZWRpdC8nKyB2bS5pZClcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgICByZXR1cm5cbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLnVwZGF0ZSA9ICgpIC0+XG4gICAgcm91dGUgPVxuICAgICAgdXNlcl9pZDogdm0ub2JqLnVzZXJfaWRcbiAgICAgIGRhdGU6IHZtLm9iai5kYXRlXG4gICAgICBwb2ludHM6IHZtLm9iai5wb2ludHNcblxuICAgICRodHRwLnBhdGNoKCcvYXBpL3JvdXRlcy8nICsgdm0uaWQsIHJvdXRlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnUm91dGUgVXBkYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpXG5cblxuICB2bS5hZGRQb2ludCA9ICgpIC0+XG4gICAgdm0ub2JqLnBvaW50cy5wdXNoKHtcbiAgICAgIGlkOiB2bS5jb3VudCArICdfbmV3J1xuICAgIH0pXG4gICAgdm0uY291bnQrK1xuICAgIHJldHVyblxuXG4gIHZtLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgIHZtLm9iai5wb2ludHMuc3BsaWNlKGluZGV4LCAxKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0VkaXRSb3V0ZUN0cmwnLCBFZGl0Um91dGVDdHJsKSIsIkluZGV4Um91dGVDdHJsID0gKCRodHRwLCAkZmlsdGVyLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL3JvdXRlcydcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuXG4gICMgRmxhc2ggZnJvbSBvdGhlcnMgcGFnZXNcbiAgaWYgJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuICAgIHZtLmZsYXNoU3VjY2VzcyA9ICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcblxuICAkaHR0cC5nZXQoJy9hcGkvcm91dGVzJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0ucm91dGVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuICAgICQoJy5zb3J0LWxpbmsnKS5lYWNoICgpIC0+XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3NvcnQtbGluayBjLXAnKVxuXG4gICAgaWYgdm0uc29ydFJldmVyc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1hc2MnKS5hZGRDbGFzcygnYWN0aXZlLWRlc2MnKVxuICAgIGVsc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1kZXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1hc2MnKVxuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5yb3V0ZXMgPSBvcmRlckJ5KHZtLnJvdXRlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlUm91dGUgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvcm91dGVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAjIERlbGV0ZSBmcm9tIHNjb3BlXG4gICAgICAgIHZtLnJvdXRlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdSb3V0ZSBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4Um91dGVDdHJsJywgSW5kZXhSb3V0ZUN0cmwpIiwiU2hvd1JvdXRlQ3RybCA9ICgkaHR0cCwgJHN0YXRlUGFyYW1zLCAkdGltZW91dCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnO1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIEdldCBwb2ludHNcbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcy8nICsgdm0uaWQpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucm91dGUgPSByZXNwb25zZS5kYXRhLnJvdXRlXG4gICAgICB2bS5zdG9yZXMgPSByZXNwb25zZS5kYXRhLnN0b3Jlc1xuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YS5wb2ludHNcbiAgICAgIHZtLnJvdXRlLmRhdGUgPSBtb21lbnQobmV3IERhdGUodm0ucm91dGUuZGF0ZSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG5cbiAgICAgICMgSW5pdCBtYXBcbiAgICAgIGluaXRNYXAoKVxuXG4gICAgICByZXR1cm5cbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuXG4gIHZtLmRlbGV0ZVJvdXRlID0gKGlkKSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvcm91dGVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnUm91dGUgRGVsZXRlZCEnIH1cblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuXG4gICMgV2hlbiB0aGUgd2luZG93IGhhcyBmaW5pc2hlZCBsb2FkaW5nIGNyZWF0ZSBvdXIgZ29vZ2xlIG1hcCBiZWxvd1xuICBpbml0TWFwID0gLT5cbiAgICAjIEJhc2ljIG9wdGlvbnMgZm9yIGEgc2ltcGxlIEdvb2dsZSBNYXBcbiAgICBtYXBPcHRpb25zID1cbiAgICAgIHpvb206IDEyXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZVxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfQk9UVE9NXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDAxNTIsIC0wLjEyNjIzNilcbiAgICAgIHN0eWxlczp2bS5zdHlsZXNcblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm91dGUtbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2U7XG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2godm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiK2FkZHJlc3MrXCImcHJldHR5PTEma2V5PVwiICsgYXBpS2V5O1xuICAgICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwKVxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpICMgcG9wdXBcblxuICAgICAgICAgICAgIyBzZWxlY3QgaWNvbnMgYnkgc3RhdHVzIChncmVlbiBvciByZWQpXG4gICAgICAgICAgICBpZiBwYXJzZUludCB2YWx1ZS5zdGF0dXNcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICAgICAgICBpY29uOiB2bS5iYWxvb25OYW1lXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IG90aGVyIG1hcmtlclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpZiggcHJldkluZm9XaW5kb3cgKVxuICAgICAgICAgICAgICAgIHByZXZJbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5nZXRQb3NpdGlvbigpKSAjIGFuaW1hdGUgbW92ZSBiZXR3ZWVuIG1hcmtlcnNcbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuIG1hcCwgbWFya2VyXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgZW1wdHkgbWFwIGFyZWFcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgLT5cbiAgICAgICAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQWRkIG5ldyBtYXJrZXIgdG8gYXJyYXkgZm9yIG91dHNpZGUgbWFwIGxpbmtzIChvcmRlcmVkIGJ5IGlkIGluIGJhY2tlbmQpXG4gICAgICAgICAgICB2bS5tYXJrZXJzLnB1c2gobWFya2VyKVxuICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgYXBpVXJsLCB0cnVlKTtcbiAgICAgIHJlcS5zZW5kKCk7XG4gICAgKVxuICAgIHJldHVyblxuXG4gIHZtLnN0eWxlcyA9IFtcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnd2F0ZXInXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2U5ZTllOScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdsYW5kc2NhcGUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyOSB9XG4gICAgICAgIHsgJ3dlaWdodCc6IDAuMiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmFydGVyaWFsJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTggfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5sb2NhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaS5wYXJrJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNkZWRlZGUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3Zpc2liaWxpdHknOiAnb24nIH1cbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3NhdHVyYXRpb24nOiAzNiB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyMzMzMzMzMnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogNDAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLmljb24nXG4gICAgICAnc3R5bGVycyc6IFsgeyAndmlzaWJpbGl0eSc6ICdvZmYnIH0gXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAndHJhbnNpdCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjJmMmYyJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE5IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICAgIHsgJ3dlaWdodCc6IDEuMiB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgIyBHbyB0byBwb2ludCBhZnRlciBjbGljayBvdXRzaWRlIG1hcCBsaW5rXG4gIHZtLmdvVG9Qb2ludCA9IChpZCkgLT5cbiAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKHZtLm1hcmtlcnNbaWRdLCAnY2xpY2snKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Nob3dSb3V0ZUN0cmwnLCBTaG93Um91dGVDdHJsKSIsIkNyZWF0ZVVzZXJDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgbG9kYXNoKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXohQCMkJV4mKigpLSs8PkFCQ0RFRkdISUpLTE1OT1AxMjM0NTY3ODkwJ1xuXG4gICRodHRwLmdldCgnL2FwaS91c2Vycy9jcmVhdGUnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLmVudW1zID0gcmVzcG9uc2UuZGF0YVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0uYWRkVXNlciA9ICgpIC0+XG4gICAgdm0uZGF0YSA9XG4gICAgICBuYW1lOiB2bS5uYW1lXG4gICAgICBsYXN0X25hbWU6IHZtLmxhc3RfbmFtZVxuICAgICAgaW5pdGlhbHM6IHZtLmluaXRpYWxzXG4gICAgICBhdmF0YXI6IHZtLmF2YXRhclxuICAgICAgYmRheTogdm0uYmRheVxuICAgICAgam9iX3RpdGxlOiB2bS5qb2JfdGl0bGVcbiAgICAgIHVzZXJfZ3JvdXA6IHZtLnVzZXJfZ3JvdXBcbiAgICAgIGNvdW50cnk6IHZtLmNvdW50cnlcbiAgICAgIGNpdHk6IHZtLmNpdHlcbiAgICAgIHBob25lOiB2bS5waG9uZVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3VzZXJzJ1xuICAgICAgbWV0aG9kOiAnUG9zdCdcbiAgICAgIGRhdGE6IHZtLmRhdGFcbiAgICApLnRoZW4gKChyZXNwKSAtPlxuICAgICAgJHN0YXRlLmdvICd1c2VycycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHVzZXIgaGFzIGJlZW4gYWRkZWQhJyB9XG4gICAgICByZXR1cm5cbiAgICApLCAoKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5nZW5lcmF0ZVBhc3MgPSAoKSAtPlxuICAgIHZtLnBhc3N3b3JkID0gJydcbiAgICBwYXNzTGVuZ3RoID0gbG9kYXNoLnJhbmRvbSg4LDE1KVxuICAgIHggPSAwXG5cbiAgICB3aGlsZSB4IDwgcGFzc0xlbmd0aFxuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZtLmNoYXJzLmxlbmd0aClcbiAgICAgIHZtLnBhc3N3b3JkICs9IHZtLmNoYXJzLmNoYXJBdChpKVxuICAgICAgeCsrXG4gICAgcmV0dXJuIHZtLnBhc3N3b3JkXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlVXNlckN0cmwnLCBDcmVhdGVVc2VyQ3RybCkiLCJJbmRleFVzZXJDdHJsID0gKCRodHRwLCAkZmlsdGVyLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL3VzZXJzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG4gICMgRmxhc2ggZnJvbSBvdGhlcnMgcGFnZXNcbiAgaWYgJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuICAgIHZtLmZsYXNoU3VjY2VzcyA9ICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcblxuICAkaHR0cC5nZXQoJ2FwaS91c2VycycpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLnVzZXJzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJyk7XG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnVzZXJzID0gb3JkZXJCeSh2bS51c2VycywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlVXNlciA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS91c2Vycy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgIyBEZWxldGUgZnJvbSBzY29wZVxuICAgICAgICB2bS51c2Vycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdVc2VyIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhVc2VyQ3RybCcsIEluZGV4VXNlckN0cmwpXG4iLCJTaG93VXNlckN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcbiAgdm0uc2V0dGluZ3MgPVxuICAgIGxpbmVXaWR0aDogNSxcbiAgICB0cmFja0NvbG9yOiAnI2U4ZWZmMCcsXG4gICAgYmFyQ29sb3I6ICcjMjdjMjRjJyxcbiAgICBzY2FsZUNvbG9yOiBmYWxzZSxcbiAgICBjb2xvcjogJyMzYTNmNTEnLFxuICAgIHNpemU6IDEzNCxcbiAgICBsaW5lQ2FwOiAnYnV0dCcsXG4gICAgcm90YXRlOiAtOTAsXG4gICAgYW5pbWF0ZTogMTAwMFxuXG4gICRodHRwLmdldCgnYXBpL3VzZXJzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICBpZiB2bS5vYmouYXZhdGFyID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICB2bS5vYmouYXZhdGFyID0gJy9pbWFnZXMvJyArIHZtLm9iai5hdmF0YXJcbiAgICBlbHNlXG4gICAgICB2bS5vYmouYXZhdGFyID0gJ3VwbG9hZHMvYXZhdGFycy8nICsgdm0ub2JqLmF2YXRhclxuICAgIHZtLm9iai5iZGF5ID0gbW9tZW50KG5ldyBEYXRlKHZtLm9iai5iZGF5KSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaG93VXNlckN0cmwnLCBTaG93VXNlckN0cmwpIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
