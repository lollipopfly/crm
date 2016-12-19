'use strict';
angular.module('app', ['ui.router', 'satellizer', "ui.bootstrap", "ngLodash", "ngMask", "angularMoment", "easypiechart", "ngFileUpload"]).config(function($stateProvider, $urlRouterProvider, $authProvider, $locationProvider) {
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
  $rootScope.currentState = $state.current.name;
  if (!$auth.isAuthenticated() && publicRoutes.indexOf($rootScope.currentState) === -1) {
    $location.path('user/sign_in');
  }
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    var user;
    user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      $location.path('user/sign_in');
    }
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
    console.log(vm.date);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJkaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuY29mZmVlIiwiZGlyZWN0aXZlcy9kZWxldGVfYXZhdGFyLmNvZmZlZSIsImRpcmVjdGl2ZXMvZmlsZV9maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3BhZ2luYXRpb24uY29mZmVlIiwiZGlyZWN0aXZlcy9yYWRpb19maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3RpbWVwaWNrZXIuY29mZmVlIiwiY29udHJvbGxlcnMvaG9tZS9pbmRleF9ob21lX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvbWFwL2luZGV4X21hcF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3Byb2ZpbGUvZWRpdF9wcm9maWxlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcHJvZmlsZS9pbmRleF9wcm9maWxlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2NyZWF0ZV9yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3JvdXRlcy9lZGl0X3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2luZGV4X3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL3Nob3dfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvY3JlYXRlX3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvc3RvcmVzL2VkaXRfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvaW5kZXhfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvc2hvd19zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvY29uZmlybV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvZm9yZ290X3Bhc3N3b3JkX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9yZXNldF9wYXNzd29yZF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvc2lnbl9pbl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvc2lnbl91cF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvdXNlcl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXJzL2NyZWF0ZV91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvaW5kZXhfdXNlcl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXJzL3Nob3dfdXNlcl9jdHJsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUVBLE9BQ0UsQ0FBQyxNQURILENBQ1UsS0FEVixFQUNpQixDQUNiLFdBRGEsRUFFYixZQUZhLEVBR2IsY0FIYSxFQUliLFVBSmEsRUFLYixRQUxhLEVBTWIsZUFOYSxFQU9iLGNBUGEsRUFRYixjQVJhLENBRGpCLENBVUksQ0FBQyxNQVZMLENBVVksU0FBQyxjQUFELEVBQWlCLGtCQUFqQixFQUFxQyxhQUFyQyxFQUFvRCxpQkFBcEQ7RUFDUixpQkFBaUIsQ0FBQyxTQUFsQixDQUE0QixJQUE1QjtFQUlBLGFBQWEsQ0FBQyxRQUFkLEdBQXlCO0VBQ3pCLGFBQWEsQ0FBQyxTQUFkLEdBQTBCO0VBQzFCLGtCQUFrQixDQUFDLFNBQW5CLENBQTZCLGVBQTdCO0VBRUEsY0FDRSxDQUFDLEtBREgsQ0FDUyxHQURULEVBRUk7SUFBQSxHQUFBLEVBQUssR0FBTDtJQUNBLFdBQUEsRUFBYSwwQkFEYjtJQUVBLFVBQUEsRUFBWSx1QkFGWjtHQUZKLENBUUUsQ0FBQyxLQVJILENBUVMsU0FSVCxFQVNJO0lBQUEsR0FBQSxFQUFLLGVBQUw7SUFDQSxXQUFBLEVBQWEsNEJBRGI7SUFFQSxVQUFBLEVBQVksMEJBRlo7R0FUSixDQWFFLENBQUMsS0FiSCxDQWFTLFNBYlQsRUFjSTtJQUFBLEdBQUEsRUFBSyxlQUFMO0lBQ0EsV0FBQSxFQUFhLDRCQURiO0lBRUEsVUFBQSxF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LEVBQU8sU0FKUDtJQUtBLElBQUEsRUFBTSxHQUxOO0lBTUEsT0FBQSxFQUFTLE1BTlQ7SUFPQSxNQUFBLEVBQVEsQ0FBQyxFQVBUO0lBUUEsT0FBQSxFQUFTLElBUlQ7O0VBVUYsS0FBSyxDQUFDLEdBQU4sQ0FBVSxZQUFBLEdBQWEsRUFBRSxDQUFDLEVBQTFCLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsU0FBQyxRQUFEO0lBQ2pDLEVBQUUsQ0FBQyxHQUFILEdBQVMsUUFBUSxDQUFDO0lBQ2xCLElBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFQLEtBQWlCLG9CQUFwQjtNQUNFLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBUCxHQUFnQixVQUFBLEdBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUR0QztLQUFBLE1BQUE7TUFHRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQVAsR0FBZ0Isa0JBQUEsR0FBcUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUg5Qzs7SUFJQSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQVAsR0FBYyxNQUFBLENBQVcsSUFBQSxJQUFBLENBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFaLENBQVgsQ0FBNkIsQ0FBQyxNQUE5QixDQUFxQyxZQUFyQztFQU5tQixDQUFuQyxFQVFFLFNBQUMsS0FBRDtJQUNBLEVBQUUsQ0FBQyxLQUFILEdBQVcsS0FBSyxDQUFDO0VBRGpCLENBUkY7QUFkYTs7QUE2QmY7O0FBQ0EsT0FDRSxDQUFDLE1BREgsQ0FDVSxLQURWLENBRUUsQ0FBQyxVQUZILENBRWMsY0FGZCxFQUU4QixZQUY5QiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnLCBbXG4gICAgJ3VpLnJvdXRlcidcbiAgICAnc2F0ZWxsaXplcidcbiAgICBcInVpLmJvb3RzdHJhcFwiXG4gICAgXCJuZ0xvZGFzaFwiXG4gICAgXCJuZ01hc2tcIlxuICAgIFwiYW5ndWxhck1vbWVudFwiXG4gICAgXCJlYXN5cGllY2hhcnRcIlxuICAgIFwibmdGaWxlVXBsb2FkXCJcbiAgXSkuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikgLT5cbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUgdHJ1ZVxuXG4gICAgIyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXG4gICAgIyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUnXG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvcmVnaXN0ZXInXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSAnL3VzZXIvc2lnbl9pbidcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAuc3RhdGUoJy8nLFxuICAgICAgICB1cmw6ICcvJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3BhZ2VzL2hvbWUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4SG9tZUN0cmwgYXMgaG9tZSdcbiAgICAgIClcblxuICAgICAgIyBVU0VSXG4gICAgICAuc3RhdGUoJ3NpZ25faW4nLFxuICAgICAgICB1cmw6ICcvdXNlci9zaWduX2luJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvc2lnbl9pbi5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2lnbkluQ29udHJvbGxlciBhcyBhdXRoJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzaWduX3VwJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvc2lnbl91cCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25fdXAuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25VcENvbnRyb2xsZXIgYXMgcmVnaXN0ZXInXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3NpZ25fdXBfc3VjY2VzcycsXG4gICAgICAgIHVybDogJy91c2VyL3NpZ25fdXBfc3VjY2VzcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25fdXBfc3VjY2Vzcy5odG1sJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdmb3Jnb3RfcGFzc3dvcmQnLFxuICAgICAgICB1cmw6ICcvdXNlci9mb3Jnb3RfcGFzc3dvcmQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9mb3Jnb3RfcGFzc3dvcmQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0ZvcmdvdFBhc3N3b3JkQ29udHJvbGxlciBhcyBmb3Jnb3RQYXNzd29yZCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncmVzZXRfcGFzc3dvcmQnLFxuICAgICAgICB1cmw6ICcvdXNlci9yZXNldF9wYXNzd29yZC86cmVzZXRfcGFzc3dvcmRfY29kZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3Jlc2V0X3Bhc3N3b3JkLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdSZXNldFBhc3N3b3JkQ29udHJvbGxlciBhcyByZXNldFBhc3N3b3JkJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdjb25maXJtJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvY29uZmlybS86Y29uZmlybWF0aW9uX2NvZGUnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb25maXJtQ29udHJvbGxlcidcbiAgICAgIClcblxuICAgICAgIyBQcm9maWxlXG4gICAgICAuc3RhdGUoJ3Byb2ZpbGUnLFxuICAgICAgICB1cmw6ICcvcHJvZmlsZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9wcm9maWxlL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFByb2ZpbGVDdHJsIGFzIHByb2ZpbGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3Byb2ZpbGVfZWRpdCcsXG4gICAgICAgIHVybDogJy9wcm9maWxlL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvcHJvZmlsZS9lZGl0Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0UHJvZmlsZUN0cmwgYXMgcHJvZmlsZSdcbiAgICAgIClcblxuICAgICAgIyBTdG9yZXNcbiAgICAgIC5zdGF0ZSgnc3RvcmVzJyxcbiAgICAgICAgdXJsOiAnL3N0b3JlcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4U3RvcmVDdHJsIGFzIHN0b3JlcydcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIGZsYXNoU3VjY2VzczogbnVsbFxuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3N0b3Jlcy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2NyZWF0ZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlU3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfZWRpdCcsXG4gICAgICAgIHVybDogJy9zdG9yZXMvOmlkL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2VkaXQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0VkaXRTdG9yZUN0cmwgYXMgc3RvcmUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3N0b3Jlc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3N0b3Jlcy86aWQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dTdG9yZUN0cmwgYXMgc3RvcmUnXG4gICAgICApXG5cbiAgICAgICMgVXNlcnNcbiAgICAgIC5zdGF0ZSgndXNlcnMnLFxuICAgICAgICB1cmw6ICcvdXNlcnMnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlcnMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4VXNlckN0cmwgYXMgdXNlcnMnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICBmbGFzaFN1Y2Nlc3M6IG51bGxcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgndXNlcnNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzL2NyZWF0ZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2Vycy9jcmVhdGUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVVzZXJDdHJsIGFzIHVzZXInXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3VzZXJzX3Nob3cnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvOmlkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXJzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dVc2VyQ3RybCBhcyB1c2VyJ1xuICAgICAgKVxuXG4gICAgICAjIFJvdXRlc1xuICAgICAgLnN0YXRlKCdyb3V0ZXMnLFxuICAgICAgICB1cmw6ICcvcm91dGVzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhSb3V0ZUN0cmwgYXMgcm91dGVzJ1xuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgZmxhc2hTdWNjZXNzOiBudWxsXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19jcmVhdGUnLFxuICAgICAgICB1cmw6ICcvcm91dGVzL2NyZWF0ZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvY3JlYXRlLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19lZGl0JyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy86aWQvZWRpdCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvZWRpdC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRWRpdFJvdXRlQ3RybCBhcyByb3V0ZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncm91dGVzX3Nob3cnLFxuICAgICAgICB1cmw6ICcvcm91dGVzLzppZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvc2hvdy5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2hvd1JvdXRlQ3RybCBhcyByb3V0ZSdcbiAgICAgIClcblxuICAgICAgIyBNYXBcbiAgICAgIC5zdGF0ZSgnbWFwJyxcbiAgICAgICAgdXJsOiAnL21hcCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9tYXAvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4TWFwQ3RybCBhcyBtYXAnXG4gICAgICApXG5cbiAgICByZXR1cm5cbiAgKS5ydW4gKCRhdXRoLCAkaHR0cCwgJGxvY2F0aW9uLCAkcSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkdGltZW91dCkgLT5cbiAgICBwdWJsaWNSb3V0ZXMgPSBbXG4gICAgICAnc2lnbl91cCdcbiAgICAgICdjb25maXJtJ1xuICAgICAgJ2ZvcmdvdF9wYXNzd29yZCdcbiAgICAgICdyZXNldF9wYXNzd29yZCcsXG4gICAgXVxuXG4gICAgIyBpZiBub3QgbG9nZ2VkXG4gICAgJHJvb3RTY29wZS5jdXJyZW50U3RhdGUgPSAkc3RhdGUuY3VycmVudC5uYW1lXG5cbiAgICBpZiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkgJiYgcHVibGljUm91dGVzLmluZGV4T2YoJHJvb3RTY29wZS5jdXJyZW50U3RhdGUpID09IC0xXG4gICAgICAkbG9jYXRpb24ucGF0aCAndXNlci9zaWduX2luJ1xuXG4gICAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGV2ZW50LCB0b1N0YXRlKSAtPlxuICAgICAgdXNlciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKSlcblxuICAgICAgIyBJZiBsb2NhbFN0b3JhZ2Ugb2YgdXNlciBkZWxldGVkXG4gICAgICBpZiAhdXNlclxuICAgICAgICAkbG9jYXRpb24ucGF0aCAndXNlci9zaWduX2luJ1xuXG5cbiAgICAgIGlmIHVzZXIgJiYgJGF1dGguaXNBdXRoZW50aWNhdGVkKClcbiAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZVxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlclxuICAgICAgICBpZiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gJy9pbWFnZXMvJyArICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9ICd1cGxvYWRzL2F2YXRhcnMvJyArICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyXG5cbiAgICAgICRyb290U2NvcGUubG9nb3V0ID0gLT5cbiAgICAgICAgJGF1dGgubG9nb3V0KCkudGhlbiAtPlxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtICd1c2VyJ1xuICAgICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IGZhbHNlXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGxcbiAgICAgICAgICAkc3RhdGUuZ28gJ3NpZ25faW4nXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIHJldHVyblxuICAgIHJldHVybiIsImNoZWNrYm94RmllbGQgPSAoKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQSdcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIGxhYmVsOiAnPWxhYmVsJ1xuICAgICAgYXR0ckNsYXNzOiAnPT9hdHRyQ2xhc3MnXG4gICAgICBuZ0NoZWNrZWQ6ICc9P25nQ2hlY2tlZCdcbiAgICAgIG1vZGVsOiAnPW1vZGVsJ1xuICAgIH1cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpLT5cbiAgICAgIGlmIHNjb3BlLm1vZGVsID09ICcxJ1xuICAgICAgICBzY29wZS5tb2RlbCA9IHRydWVcbiAgICAgIGVsc2UgaWYgc2NvcGUubW9kZWwgPT0gJzAnXG4gICAgICAgIHNjb3BlLm1vZGVsID0gZmFsc2VcbiAgICAgIHJldHVyblxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnY2hlY2tib3hGaWVsZCcsIGNoZWNrYm94RmllbGQiLCJkYXRldGltZXBpY2tlciA9ICgkdGltZW91dCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnQUUnXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9kYXRldGltZXBpY2tlci5odG1sJ1xuICAgIHJlcXVpcmU6ICduZ01vZGVsJ1xuICAgIHNjb3BlOiB7XG4gICAgICBsYWJlbDogXCI9P2xhYmVsXCJcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBuZ01vZGVsKSAtPlxuICAgICAgc2NvcGUub3BlbiA9ICgpIC0+XG4gICAgICAgIHNjb3BlLmRhdGVfb3BlbmVkID0gdHJ1ZVxuXG4gICAgICAkdGltZW91dChcbiAgICAgICAgKCgpIC0+XG4gICAgICAgICAgc2NvcGUubW9kZWwgPSBEYXRlLnBhcnNlKG5nTW9kZWwuJHZpZXdWYWx1ZSlcbiAgICAgICAgKSwgNDAwXG4gICAgICApXG5cbiAgICAgIHNjb3BlLnNlbGVjdERhdGUgPSAoKG1vZGVsKSAtPlxuICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShtb2RlbClcbiAgICAgIClcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2RhdGV0aW1lcGlja2VyJywgZGF0ZXRpbWVwaWNrZXIiLCJkZWxldGVBdmF0YXIgPSAoJHRpbWVvdXQpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvZGVsZXRlX2F2YXRhci5odG1sJ1xuICAgIHNjb3BlOlxuICAgICAgcmVtb3ZlQXZhdGFyOiAnPW5nTW9kZWwnXG4gICAgICBmaWxlOiBcIj1maWxlXCJcbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSAtPlxuICAgICAgYXR0cnMuJG9ic2VydmUgJ2ltZ05hbWUnLCAodmFsdWUpIC0+XG4gICAgICAgIHNjb3BlLmltZ05hbWUgPSB2YWx1ZVxuICAgICAgICByZXR1cm5cblxuICAgICAgc2NvcGUucmVtb3ZlID0gKCkgLT5cbiAgICAgICAgJHRpbWVvdXQoKCktPlxuICAgICAgICAgIHNjb3BlLmltZ05hbWUgPSAnaW1hZ2VzL2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIHNjb3BlLmZpbGUgIT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgICBzY29wZS5yZW1vdmVBdmF0YXIgPSB0cnVlXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdkZWxldGVBdmF0YXInLCBkZWxldGVBdmF0YXIiLCJmaWxlRmllbGQgPSAoKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdBRSdcbiAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvZmlsZV9maWVsZC5odG1sJ1xuICAgIHNjb3BlOiB7XG4gICAgICBhdHRySWQ6ICc9J1xuICAgICAgbmdNb2RlbDogJz1uZ01vZGVsJ1xuICAgICAgcmVtb3ZlQXZhdGFyOiAnPT9yZW1vdmVkQXZhdGFyJ1xuICAgIH1cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBlbGVtZW50LmJpbmQgJ2NoYW5nZScsIChjaGFuZ2VFdmVudCkgLT5cbiAgICAgICAgc2NvcGUubmdNb2RlbCA9IGV2ZW50LnRhcmdldC5maWxlcztcbiAgICAgICAgc2NvcGUucmVtb3ZlQXZhdGFyID0gZmFsc2UgIyBmb3IgZGVsZXRlX2F2YXRhciBkaXJlY3RpdmVcbiAgICAgICAgZmlsZXMgPSBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgICAgIGZpbGVOYW1lID0gZmlsZXNbMF0ubmFtZTtcbiAgICAgICAgZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPXRleHRdJykuc2V0QXR0cmlidXRlKCd2YWx1ZScsIGZpbGVOYW1lKVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnZmlsZUZpZWxkJywgZmlsZUZpZWxkIiwicGFnaW5hdGlvbiA9ICgkaHR0cCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUEnXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL3BhZ2luYXRpb24uaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgcGFnaUFycjogJz0nXG4gICAgICBpdGVtczogJz0nXG4gICAgICBwYWdpQXBpVXJsOiAnPSdcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgc2NvcGUuJHdhdGNoICgtPlxuICAgICAgICBzY29wZS5wYWdpQXJyXG4gICAgICApLCAoKG5ld1ZhbHVlLCBvbGRWYWx1ZSkgLT5cbiAgICAgICAgaWYgIWFuZ3VsYXIuZXF1YWxzKG9sZFZhbHVlLCBuZXdWYWx1ZSlcbiAgICAgICAgICBzY29wZS5wYWdpQXJyID0gbmV3VmFsdWVcbiAgICAgICAgICBzY29wZS50b3RhbFBhZ2VzID0gc2NvcGUucGFnaUFyci5sYXN0X3BhZ2VcbiAgICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IHNjb3BlLnBhZ2lBcnIuY3VycmVudF9wYWdlXG4gICAgICAgICAgc2NvcGUudG90YWwgPSBzY29wZS5wYWdpQXJyLnRvdGFsXG4gICAgICAgICAgc2NvcGUucGVyUGFnZSA9IHNjb3BlLnBhZ2lBcnIucGVyX3BhZ2VcblxuICAgICAgICAgICMgUGFnaW5hdGlvbiBSYW5nZVxuICAgICAgICAgIHNjb3BlLnBhaW5hdGlvblJhbmdlKHNjb3BlLnRvdGFsUGFnZXMpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCB0cnVlXG5cbiAgICAgIHNjb3BlLmdldFBvc3RzID0gKHBhZ2VOdW1iZXIpIC0+XG4gICAgICAgIGlmIHBhZ2VOdW1iZXIgPT0gdW5kZWZpbmVkXG4gICAgICAgICAgcGFnZU51bWJlciA9ICcxJ1xuICAgICAgICAkaHR0cC5nZXQoc2NvcGUucGFnaUFwaVVybCsnP3BhZ2U9JyArIHBhZ2VOdW1iZXIpLnN1Y2Nlc3MgKHJlc3BvbnNlKSAtPlxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICBzY29wZS5pdGVtcyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICBzY29wZS50b3RhbFBhZ2VzID0gcmVzcG9uc2UubGFzdF9wYWdlXG4gICAgICAgICAgc2NvcGUuY3VycmVudFBhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2VcblxuICAgICAgICAgICMgUGFnaW5hdGlvbiBSYW5nZVxuICAgICAgICAgIHNjb3BlLnBhaW5hdGlvblJhbmdlKHNjb3BlLnRvdGFsUGFnZXMpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIHJldHVyblxuXG4gICAgICBzY29wZS5wYWluYXRpb25SYW5nZSA9ICh0b3RhbFBhZ2VzKSAtPlxuICAgICAgICBwYWdlcyA9IFtdXG4gICAgICAgIGkgPSAxXG4gICAgICAgIHdoaWxlIGkgPD0gdG90YWxQYWdlc1xuICAgICAgICAgIHBhZ2VzLnB1c2ggaVxuICAgICAgICAgIGkrK1xuICAgICAgICBzY29wZS5yYW5nZSA9IHBhZ2VzXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdwYWdpbmF0aW9uJywgcGFnaW5hdGlvbiIsInJhZGlvRmllbGQgPSAoJGh0dHApIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvcmFkaW9fZmllbGQuaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgbmdNb2RlbDogXCI9bmdNb2RlbFwiXG4gICAgICBsYWJlbDogJz1sYWJlbCdcbiAgICAgIGF0dHJOYW1lOiAnPWF0dHJOYW1lJ1xuICAgICAgYXR0clZhbHVlOiAnPWF0dHJWYWx1ZSdcbiAgICAgIG5nQ2hlY2tlZDogJz0/bmdDaGVja2VkJ1xuICAgIH1cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpLT5cbiAgICAgIHNjb3BlLm5nTW9kZWwgPSBzY29wZS5hdHRyVmFsdWVcblxuICAgICAgZWxlbWVudC5iaW5kKCdjaGFuZ2UnLCAoKS0+XG4gICAgICAgIHNjb3BlLm5nTW9kZWwgPSBzY29wZS5hdHRyVmFsdWVcbiAgICAgIClcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ3JhZGlvRmllbGQnLCByYWRpb0ZpZWxkIiwidGltZXBpY2tlciA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvdGltZXBpY2tlci5odG1sJ1xuICAgIHNjb3BlOiB7XG4gICAgICBtb2RlbDogXCI9bmdNb2RlbFwiXG4gICAgICBsYWJlbDogXCI9P2xhYmVsXCJcbiAgICAgIGF0dHJOYW1lOiBcIkBcIlxuICAgIH1cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBzY29wZS5oc3RlcCA9IDFcbiAgICAgIHNjb3BlLm1zdGVwID0gNVxuICAgICAgc2NvcGUuaXNtZXJpZGlhbiA9IHRydWVcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ3RpbWVwaWNrZXInLCB0aW1lcGlja2VyIiwiSW5kZXhIb21lQ3RybCA9ICgkaHR0cCwgJHRpbWVvdXQsICRmaWx0ZXIsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gICMgUm91dGVzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvaG9tZSdcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuXG4gICMgTWFwXG4gIGFwaUtleSA9ICdhMzAzZDNhNDRhMDFjOWY4YTVjYjAxMDdiMDMzZWZiZSc7XG4gIHZtLm1hcmtlcnMgPSBbXVxuXG5cbiAgIyMjICBST1VURVMgICMjI1xuICBpZiAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJfZ3JvdXAgPT0gJ2FkbWluJ1xuICAgICRodHRwLmdldCgnL2FwaS9ob21lJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgICB2bS5yb3V0ZXMgPSByZXNwb25zZS5kYXRhLmRhdGFcbiAgICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgICAgIHJldHVyblxuICAgIClcblxuICAjIyMgIE1BUCAgIyMjXG4gICMgR2V0IHBvaW50cyBKU09OXG4gICRodHRwKFxuICAgIG1ldGhvZDogJ0dFVCdcbiAgICB1cmw6ICcvYXBpL2hvbWUvZ2V0cG9pbnRzJykudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YVxuICAgICAgaW5pdE1hcCgpXG5cbiAgICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuICAgICQoJy5zb3J0LWxpbmsnKS5lYWNoICgpIC0+XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3NvcnQtbGluayBjLXAnKVxuXG4gICAgaWYgdm0uc29ydFJldmVyc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1hc2MnKS5hZGRDbGFzcygnYWN0aXZlLWRlc2MnKVxuICAgIGVsc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1kZXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1hc2MnKVxuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5yb3V0ZXMgPSBvcmRlckJ5KHZtLnJvdXRlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cblxuICBpbml0TWFwID0gLT5cbiAgICBtYXBPcHRpb25zID1cbiAgICAgIHpvb206IDEyXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZVxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfQk9UVE9NXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDczNTA5LCAtMC4xMjc3NTgzKVxuICAgICAgc3R5bGVzOiB2bS5zdHlsZXNcblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2VcblxuICAgICMgU2V0IGxvY2F0aW9uc1xuICAgIGFuZ3VsYXIuZm9yRWFjaCggdm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiK2FkZHJlc3MrXCImcHJldHR5PTEma2V5PVwiICsgYXBpS2V5O1xuICAgICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwKVxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9XG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdj48c3BhbiBjbGFzcz1cIm1ha2VyLWNvbnRlbnRfX3RpdGxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAnQWRkcmVzczo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5hZGRyZXNzICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdQaG9uZTo8L3NwYW4+ICcgKyB2YWx1ZS5zdG9yZS5waG9uZSArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PidcblxuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZykgIyBwb3B1cFxuXG4gICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWVcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIC0+XG4gICAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuICAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpO1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaydcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfVxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJ1xuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleEhvbWVDdHJsJywgSW5kZXhIb21lQ3RybCkiLCJJbmRleE1hcEN0cmwgPSAoJGh0dHAsICR0aW1lb3V0KSAtPlxuICB2bSA9IHRoaXNcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnO1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIEdldCBwb2ludHMgSlNPTlxuICAkaHR0cChcbiAgICBtZXRob2Q6ICdHRVQnXG4gICAgdXJsOiAnL2FwaS9tYXAnKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhXG4gICAgICAjIEluaXQgbWFwXG4gICAgICBpbml0TWFwKClcbiAgICAgIHJldHVyblxuICApXG5cbiAgaW5pdE1hcCA9IC0+XG4gICAgbWFwT3B0aW9ucyA9XG4gICAgICB6b29tOiAxMlxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2VcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczogcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTVxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTA3MzUwOSwgLTAuMTI3NzU4MylcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzXG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlO1xuXG4gICAgIyBTZXQgbG9jYXRpb25zXG4gICAgYW5ndWxhci5mb3JFYWNoKCB2bS5wb2ludHMsICh2YWx1ZSwga2V5KSAtPlxuICAgICAgYWRkcmVzcyA9IHZhbHVlLnN0b3JlLmFkZHJlc3NcbiAgICAgICMgR2VvY29kZSBBZGRyZXNzZXMgYnkgYWRkcmVzcyBuYW1lXG4gICAgICBhcGlVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW5jYWdlZGF0YS5jb20vZ2VvY29kZS92MS9qc29uP3E9XCIrYWRkcmVzcytcIiZwcmV0dHk9MSZrZXk9XCIgKyBhcGlLZXk7XG4gICAgICByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgcmVxLm9ubG9hZCA9ICgpIC0+XG4gICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKVxuICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICBwb3NpdGlvbiA9IHJlc3BvbnNlLnJlc3VsdHNbMF0uZ2VvbWV0cnlcblxuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMuY29kZSA9PSAyMDApXG4gICAgICAgICAgICBjb250ZW50U3RyaW5nID1cbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJtYXJrZXItY29udGVudFwiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdBZGRyZXNzOjwvc3Bhbj4gJyArIHZhbHVlLnN0b3JlLmFkZHJlc3MgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ1Bob25lOjwvc3Bhbj4gJyArIHZhbHVlLnN0b3JlLnBob25lICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPC9kaXY+J1xuXG4gICAgICAgICAgICBpbmZvV2luZG93ID0gbmV3IChnb29nbGUubWFwcy5JbmZvV2luZG93KShjb250ZW50OiBjb250ZW50U3RyaW5nKSAjIHBvcHVwXG5cbiAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICBpZiBwYXJzZUludCB2YWx1ZS5zdGF0dXNcbiAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb25fc2hpcGVkLnBuZydcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uLnBuZydcblxuICAgICAgICAgIG1hcmtlciA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFya2VyKShcbiAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICBpY29uOiB2bS5iYWxvb25OYW1lXG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb25cbiAgICAgICAgICApXG5cbiAgICAgICAgICAjIENsaWNrIGJ5IG90aGVyIG1hcmtlclxuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgLT5cbiAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgcHJldkluZm9XaW5kb3cgPSBpbmZvV2luZG93XG4gICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuIG1hcCwgbWFya2VyXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIClcblxuICAgICAgICAgICMgQ2xpY2sgYnkgZW1wdHkgbWFwIGFyZWFcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsIC0+XG4gICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICB2bS5tYXJrZXJzLnB1c2gobWFya2VyKVxuICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgYXBpVXJsLCB0cnVlKTtcbiAgICAgIHJlcS5zZW5kKCk7XG4gICAgKVxuICAgIHJldHVyblxuXG4gIHZtLnN0eWxlcyA9IFtcbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnd2F0ZXInXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2U5ZTllOScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdsYW5kc2NhcGUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyOSB9XG4gICAgICAgIHsgJ3dlaWdodCc6IDAuMiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmFydGVyaWFsJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTggfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5sb2NhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3BvaS5wYXJrJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNkZWRlZGUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3Zpc2liaWxpdHknOiAnb24nIH1cbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ3NhdHVyYXRpb24nOiAzNiB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyMzMzMzMzMnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogNDAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLmljb24nXG4gICAgICAnc3R5bGVycyc6IFsgeyAndmlzaWJpbGl0eSc6ICdvZmYnIH0gXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAndHJhbnNpdCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjJmMmYyJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE5IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZlZmVmZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICAgIHsgJ3dlaWdodCc6IDEuMiB9XG4gICAgICBdXG4gICAgfVxuICBdXG5cbiAgIyBHbyB0byBwb2ludCBhZnRlciBjbGljayBvdXRzaWRlIG1hcCBsaW5rXG4gIHZtLmdvVG9Qb2ludCA9IChpZCkgLT5cbiAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKHZtLm1hcmtlcnNbaWRdLCAnY2xpY2snKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4TWFwQ3RybCcsIEluZGV4TWFwQ3RybCkiLCJFZGl0UHJvZmlsZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSwgVXBsb2FkLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICAkaHR0cC5nZXQoJy9hcGkvcHJvZmlsZS9lZGl0JylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS51c2VyID0gcmVzcG9uc2UuZGF0YVxuICAgICAgdm0udXNlci5yZW1vdmVfYXZhdGFyID0gZmFsc2VcblxuICAgICAgdm0uYXZhdGFyID0gdm0ubWFrZUF2YXRhckxpbmsodm0udXNlci5hdmF0YXIpICMgZm9yIGRlbGV0ZV9hdmF0YXIgZGlyZWN0aXZlXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICB2bS51cGRhdGUgPSAoKSAtPlxuICAgIGF2YXRhciA9IHZtLnVzZXIuYXZhdGFyXG5cbiAgICBpZiB2bS51c2VyLmF2YXRhciA9PSAnL2ltYWdlcy9kZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICB2bS51c2VyLmF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnICMgdG9kbyBoeiBtYXkgYmUgZm9yIGRlbGV0ZVxuICAgICAgYXZhdGFyID0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICB2bS5kYXRhID1cbiAgICAgIGF2YXRhcjogYXZhdGFyXG4gICAgICByZW1vdmVfYXZhdGFyOiB2bS51c2VyLnJlbW92ZV9hdmF0YXJcbiAgICAgIG5hbWU6IHZtLnVzZXIubmFtZVxuICAgICAgbGFzdF9uYW1lOiB2bS51c2VyLmxhc3RfbmFtZVxuICAgICAgaW5pdGlhbHM6IHZtLnVzZXIuaW5pdGlhbHNcbiAgICAgIGJkYXk6IHZtLnVzZXIuYmRheVxuICAgICAgZW1haWw6IHZtLnVzZXIuZW1haWxcbiAgICAgIHBob25lOiB2bS51c2VyLnBob25lXG4gICAgICBqb2JfdGl0bGU6IHZtLnVzZXIuam9iX3RpdGxlXG4gICAgICBjb3VudHJ5OiB2bS51c2VyLmNvdW50cnlcbiAgICAgIGNpdHk6IHZtLnVzZXIuY2l0eVxuXG4gICAgVXBsb2FkLnVwbG9hZChcbiAgICAgIHVybDogJy9hcGkvcHJvZmlsZS8nICsgdm0udXNlci5pZFxuICAgICAgbWV0aG9kOiAnUG9zdCdcbiAgICAgIGRhdGE6IHZtLmRhdGFcbiAgICApLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgIGZpbGVOYW1lID0gcmVzcG9uc2UuZGF0YVxuICAgICAgc3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJylcbiAgICAgIHN0b3JhZ2UgPSBKU09OLnBhcnNlKHN0b3JhZ2UpXG5cbiAgICAgICMgRGVmYXVsdCBhdmF0YXJcbiAgICAgIGlmIHR5cGVvZiBmaWxlTmFtZSA9PSAnYm9vbGVhbicgJiYgdm0udXNlci5yZW1vdmVfYXZhdGFyXG4gICAgICAgIHN0b3JhZ2UuYXZhdGFyID0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSAgJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICMgVXBkYXRlIHN0b3JhZ2VcbiAgICAgIGVsc2UgaWYgdHlwZW9mIGZpbGVOYW1lID09ICdzdHJpbmcnICYmICF2bS51c2VyLnJlbW92ZV9hdmF0YXJcbiAgICAgICAgc3RvcmFnZS5hdmF0YXIgPSBmaWxlTmFtZVxuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9IHZtLm1ha2VBdmF0YXJMaW5rKHN0b3JhZ2UuYXZhdGFyKVxuICAgICAgICBzdG9yYWdlLmF2YXRhciA9IGZpbGVOYW1lXG5cbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZSkpXG5cbiAgICAgICRzdGF0ZS5nbyAncHJvZmlsZScsIHsgZmxhc2hTdWNjZXNzOiAnUHJvZmlsZSB1cGRhdGVkIScgfVxuICAgICksICgoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIGNvbnNvbGUubG9nKHZtLmVycm9yKTtcbiAgICAgIHJldHVyblxuICAgIClcblxuICB2bS5tYWtlQXZhdGFyTGluayA9IChhdmF0YXJOYW1lKSAtPlxuICAgIGlmIGF2YXRhck5hbWUgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgIGF2YXRhck5hbWUgPSAnL2ltYWdlcy8nICsgYXZhdGFyTmFtZVxuICAgIGVsc2VcbiAgICAgIGF2YXRhck5hbWUgPSAnL3VwbG9hZHMvYXZhdGFycy8nICsgYXZhdGFyTmFtZVxuXG4gICAgcmV0dXJuIGF2YXRhck5hbWVcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdFZGl0UHJvZmlsZUN0cmwnLCBFZGl0UHJvZmlsZUN0cmwpIiwiSW5kZXhQcm9maWxlQ3RybCA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3Byb2ZpbGUnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXJcbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGEucG9pbnRzXG4gICAgICBpZiB2bS51c2VyLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICB2bS51c2VyLmF2YXRhciA9ICcvaW1hZ2VzLycgKyB2bS51c2VyLmF2YXRhclxuICAgICAgZWxzZVxuICAgICAgICB2bS51c2VyLmF2YXRhciA9ICd1cGxvYWRzL2F2YXRhcnMvJyArIHZtLnVzZXIuYXZhdGFyXG5cbiAgICAgIHZtLnVzZXIuYmRheSA9IG1vbWVudChuZXcgRGF0ZSh2bS51c2VyLmJkYXkpKS5mb3JtYXQoJ0RELk1NLllZWVknKVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlUG9pbnRzID0gKCkgLT5cbiAgICAkaHR0cC5wdXQoJy9hcGkvcHJvZmlsZS91cGRhdGVwb2ludHMnLCB2bS5wb2ludHMpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdQb2ludHMgdXBkYXRlZCEnXG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhQcm9maWxlQ3RybCcsIEluZGV4UHJvZmlsZUN0cmwpIiwiQ3JlYXRlUm91dGVDdHJsID0gKCRodHRwLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5wb2ludEZvcm1zID0gW11cblxuICAkaHR0cC5wb3N0KCcvYXBpL3JvdXRlcy9nZXRVc2Vyc0FuZFN0b3JlcycpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ub2JqID0gcmVzcG9uc2UuZGF0YVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0uY3JlYXRlUm91dGUgPSAoKSAtPlxuICAgIGNvbnNvbGUubG9nKHZtLmRhdGUpXG5cbiAgICB2bS5yb3V0ZSA9XG4gICAgICB1c2VyX2lkOiB2bS51c2VyX2lkXG4gICAgICBkYXRlOiB2bS5kYXRlXG4gICAgICBwb2ludHM6IHZtLnBvaW50Rm9ybXNcblxuICAgICRodHRwLnBvc3QoJy9hcGkvcm91dGVzJywgdm0ucm91dGUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdOZXcgcm91dGUgaGFzIGJlZW4gYWRkZWQhJyB9XG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmVycm9yKTtcblxuICAgIHJldHVyblxuXG4gIHZtLmFkZFBvaW50ID0gKCkgLT5cbiAgICB2bS5wb2ludEZvcm1zLnB1c2goe30pXG5cbiAgdm0ucmVtb3ZlUG9pbnQgPSAoaW5kZXgpIC0+XG4gICAgdm0ucG9pbnRGb3Jtcy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlUm91dGVDdHJsJywgQ3JlYXRlUm91dGVDdHJsKSIsIkVkaXRSb3V0ZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcbiAgdm0uY291bnQgPSAxXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcy9lZGl0LycrIHZtLmlkKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICByb3V0ZSA9XG4gICAgICB1c2VyX2lkOiB2bS5vYmoudXNlcl9pZFxuICAgICAgZGF0ZTogdm0ub2JqLmRhdGVcbiAgICAgIHBvaW50czogdm0ub2JqLnBvaW50c1xuXG4gICAgJGh0dHAucGF0Y2goJy9hcGkvcm91dGVzLycgKyB2bS5pZCwgcm91dGUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdSb3V0ZSBVcGRhdGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcilcblxuXG4gIHZtLmFkZFBvaW50ID0gKCkgLT5cbiAgICB2bS5vYmoucG9pbnRzLnB1c2goe1xuICAgICAgaWQ6IHZtLmNvdW50ICsgJ19uZXcnXG4gICAgfSlcbiAgICB2bS5jb3VudCsrXG4gICAgcmV0dXJuXG5cbiAgdm0ucmVtb3ZlUG9pbnQgPSAoaW5kZXgpIC0+XG4gICAgdm0ub2JqLnBvaW50cy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFJvdXRlQ3RybCcsIEVkaXRSb3V0ZUN0cmwpIiwiSW5kZXhSb3V0ZUN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvcm91dGVzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBGbGFzaCBmcm9tIG90aGVycyBwYWdlc1xuICBpZiAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG4gICAgdm0uZmxhc2hTdWNjZXNzID0gJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuXG4gICRodHRwLmdldCgnL2FwaS9yb3V0ZXMnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5yb3V0ZXMgPSByZXNwb25zZS5kYXRhLmRhdGFcbiAgICB2bS5wYWdpQXJyID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpXG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnJvdXRlcyA9IG9yZGVyQnkodm0ucm91dGVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICB2bS5kZWxldGVSb3V0ZSA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9yb3V0ZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0ucm91dGVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1JvdXRlIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhSb3V0ZUN0cmwnLCBJbmRleFJvdXRlQ3RybCkiLCJTaG93Um91dGVDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICR0aW1lb3V0LCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5pZCA9ICRzdGF0ZVBhcmFtcy5pZFxuXG4gICMgTWFwXG4gIGFwaUtleSA9ICdhMzAzZDNhNDRhMDFjOWY4YTVjYjAxMDdiMDMzZWZiZSc7XG4gIHZtLm1hcmtlcnMgPSBbXVxuXG4gICMgR2V0IHBvaW50c1xuICAkaHR0cC5nZXQoJy9hcGkvcm91dGVzLycgKyB2bS5pZClcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5yb3V0ZSA9IHJlc3BvbnNlLmRhdGEucm91dGVcbiAgICAgIHZtLnN0b3JlcyA9IHJlc3BvbnNlLmRhdGEuc3RvcmVzXG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhLnBvaW50c1xuICAgICAgdm0ucm91dGUuZGF0ZSA9IG1vbWVudChuZXcgRGF0ZSh2bS5yb3V0ZS5kYXRlKSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcblxuICAgICAgIyBJbml0IG1hcFxuICAgICAgaW5pdE1hcCgpXG5cbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG5cbiAgdm0uZGVsZXRlUm91dGUgPSAoaWQpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9yb3V0ZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdSb3V0ZSBEZWxldGVkIScgfVxuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG5cbiAgIyBXaGVuIHRoZSB3aW5kb3cgaGFzIGZpbmlzaGVkIGxvYWRpbmcgY3JlYXRlIG91ciBnb29nbGUgbWFwIGJlbG93XG4gIGluaXRNYXAgPSAtPlxuICAgICMgQmFzaWMgb3B0aW9ucyBmb3IgYSBzaW1wbGUgR29vZ2xlIE1hcFxuICAgIG1hcE9wdGlvbnMgPVxuICAgICAgem9vbTogMTJcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZVxuICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlXG4gICAgICB6b29tQ29udHJvbE9wdGlvbnM6IHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9CT1RUT01cbiAgICAgIGNlbnRlcjogbmV3IChnb29nbGUubWFwcy5MYXRMbmcpKDUxLjUwMDE1MiwgLTAuMTI2MjM2KVxuICAgICAgc3R5bGVzOnZtLnN0eWxlc1xuXG4gICAgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb3V0ZS1tYXAnKVxuICAgIG1hcCA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFwKShtYXBFbGVtZW50LCBtYXBPcHRpb25zKVxuICAgIHByZXZJbmZvV2luZG93ID1mYWxzZTtcblxuICAgICMgU2V0IGxvY2F0aW9uc1xuICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5wb2ludHMsICh2YWx1ZSwga2V5KSAtPlxuICAgICAgYWRkcmVzcyA9IHZhbHVlLnN0b3JlLmFkZHJlc3NcbiAgICAgICMgR2VvY29kZSBBZGRyZXNzZXMgYnkgYWRkcmVzcyBuYW1lXG4gICAgICBhcGlVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW5jYWdlZGF0YS5jb20vZ2VvY29kZS92MS9qc29uP3E9XCIrYWRkcmVzcytcIiZwcmV0dHk9MSZrZXk9XCIgKyBhcGlLZXk7XG4gICAgICByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgcmVxLm9ubG9hZCA9ICgpIC0+XG4gICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKVxuICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICBwb3NpdGlvbiA9IHJlc3BvbnNlLnJlc3VsdHNbMF0uZ2VvbWV0cnlcblxuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMuY29kZSA9PSAyMDApXG4gICAgICAgICAgICBjb250ZW50U3RyaW5nID1cbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJtYXJrZXItY29udGVudFwiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2PjxzcGFuIGNsYXNzPVwibWFrZXItY29udGVudF9fdGl0bGVcIj4nICtcbiAgICAgICAgICAgICAgICAgICdBZGRyZXNzOjwvc3Bhbj4gJyArIHZhbHVlLnN0b3JlLmFkZHJlc3MgKyAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXY+PHNwYW4gY2xhc3M9XCJtYWtlci1jb250ZW50X190aXRsZVwiPicgK1xuICAgICAgICAgICAgICAgICAgJ1Bob25lOjwvc3Bhbj4gJyArIHZhbHVlLnN0b3JlLnBob25lICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZykgIyBwb3B1cFxuXG4gICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWVcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIC0+XG4gICAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuICAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpO1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICApXG4gICAgcmV0dXJuXG5cbiAgdm0uc3R5bGVzID0gW1xuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd3YXRlcidcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZTllOWU5JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2xhbmRzY2FwZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDI5IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMC4yIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuYXJ0ZXJpYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pLnBhcmsnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2RlZGVkZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAndmlzaWJpbGl0eSc6ICdvbicgfVxuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnc2F0dXJhdGlvbic6IDM2IH1cbiAgICAgICAgeyAnY29sb3InOiAnIzMzMzMzMycgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMuaWNvbidcbiAgICAgICdzdHlsZXJzJzogWyB7ICd2aXNpYmlsaXR5JzogJ29mZicgfSBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd0cmFuc2l0J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmMmYyZjInIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMS4yIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICAjIEdvIHRvIHBvaW50IGFmdGVyIGNsaWNrIG91dHNpZGUgbWFwIGxpbmtcbiAgdm0uZ29Ub1BvaW50ID0gKGlkKSAtPlxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodm0ubWFya2Vyc1tpZF0sICdjbGljaycpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1JvdXRlQ3RybCcsIFNob3dSb3V0ZUN0cmwpIiwiQ3JlYXRlU3RvcmVDdHJsID0gKCRzY29wZSwgJGh0dHAsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0uY3JlYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5zdG9yZU5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLm93bmVyTmFtZVxuICAgICAgYWRkcmVzczogdm0uYWRkcmVzc1xuICAgICAgcGhvbmU6IHZtLnBob25lXG4gICAgICBlbWFpbDogdm0uZW1haWxcblxuICAgICRodHRwLnBvc3QoJy9hcGkvc3RvcmVzJywgc3RvcmUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAnc3RvcmVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdOZXcgc3RvcmUgY3JlYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlU3RvcmVDdHJsJywgQ3JlYXRlU3RvcmVDdHJsKSIsIkVkaXRTdG9yZUN0cmwgPSAoJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5pZCA9ICRzdGF0ZVBhcmFtcy5pZFxuXG4gICRodHRwLmdldCgnYXBpL3N0b3Jlcy8nK3ZtLmlkKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YVxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnVwZGF0ZSA9ICgpIC0+XG4gICAgc3RvcmUgPVxuICAgICAgbmFtZTogdm0uZGF0YS5uYW1lXG4gICAgICBvd25lcl9uYW1lOiB2bS5kYXRhLm93bmVyX25hbWVcbiAgICAgIGFkZHJlc3M6IHZtLmRhdGEuYWRkcmVzc1xuICAgICAgcGhvbmU6IHZtLmRhdGEucGhvbmVcbiAgICAgIGVtYWlsOiB2bS5kYXRhLmVtYWlsXG5cbiAgICAkaHR0cC5wYXRjaCgnL2FwaS9zdG9yZXMvJyArIHZtLmlkLCBzdG9yZSlcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdzdG9yZXMnLCB7IGZsYXNoU3VjY2VzczogJ1N0b3JlIFVwZGF0ZWQhJyB9XG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgJHNjb3BlLmdldExvY2F0aW9uID0gKGFkZHJlc3MpIC0+XG4gICAgJGh0dHAuZ2V0KCcvL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uJyxcbiAgICAgIHBhcmFtczpcbiAgICAgICAgYWRkcmVzczogYWRkcmVzc1xuICAgICAgICBsYW5ndWFnZTogJ2VuJ1xuICAgICAgICBjb21wb25lbnRzOiAnY291bnRyeTpVS3xhZG1pbmlzdHJhdGl2ZV9hcmVhOkxvbmRvbidcbiAgICAgIHNraXBBdXRob3JpemF0aW9uOiB0cnVlICMgZm9yIGVycm9lIG9mIC4uIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcbiAgICApLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgcmVzcG9uc2UuZGF0YS5yZXN1bHRzLm1hcCAoaXRlbSkgLT5cbiAgICAgICAgaXRlbS5mb3JtYXR0ZWRfYWRkcmVzc1xuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0VkaXRTdG9yZUN0cmwnLCBFZGl0U3RvcmVDdHJsKSIsIkluZGV4U3RvcmVDdHJsID0gKCRodHRwLCAkZmlsdGVyLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL3N0b3JlcydcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuXG4gICMgRmxhc2ggZnJvbSBvdGhlcnMgcGFnZXNcbiAgaWYgJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuICAgIHZtLmZsYXNoU3VjY2VzcyA9ICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcblxuICAkaHR0cC5nZXQoJ2FwaS9zdG9yZXMnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5zdG9yZXMgPSByZXNwb25zZS5kYXRhLmRhdGFcbiAgICB2bS5wYWdpQXJyID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuICAgICQoJy5zb3J0LWxpbmsnKS5lYWNoICgpIC0+XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3NvcnQtbGluayBjLXAnKVxuXG4gICAgaWYgdm0uc29ydFJldmVyc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1hc2MnKS5hZGRDbGFzcygnYWN0aXZlLWRlc2MnKVxuICAgIGVsc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1kZXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1hc2MnKTtcblxuICAgIHZtLnByZWRpY2F0ZSA9IHByZWRpY2F0ZVxuICAgIHZtLnJldmVyc2UgPSBpZiAodm0ucHJlZGljYXRlID09IHByZWRpY2F0ZSkgdGhlbiAhdm0ucmV2ZXJzZSBlbHNlIGZhbHNlXG4gICAgdm0uc3RvcmVzID0gb3JkZXJCeSh2bS5zdG9yZXMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG4gIHZtLmRlbGV0ZVN0b3JlID0gKGlkLCBpbmRleCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCcvYXBpL3N0b3Jlcy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgIyBEZWxldGUgZnJvbSBzY29wZVxuICAgICAgICB2bS5zdG9yZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnU3RvcmUgZGVsZXRlZCEnXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICByZXR1cm5cblxuICByZXR1cm5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhTdG9yZUN0cmwnLCBJbmRleFN0b3JlQ3RybCkiLCJTaG93U3RvcmVDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0uZGVsZXRlU3RvcmUgPSAoaWQpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnYXBpL3N0b3Jlcy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdzdG9yZXMnLCB7IGZsYXNoU3VjY2VzczogJ1N0b3JlIGRlbGV0ZWQhJyB9XG4gICAgICAgIHJldHVyblxuICAgICAgKVxuXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Nob3dTdG9yZUN0cmwnLCBTaG93U3RvcmVDdHJsKSIsIkNvbmZpcm1Db250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUsICRodHRwLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5kYXRhID1cbiAgICBjb25maXJtYXRpb25fY29kZTogJHN0YXRlUGFyYW1zLmNvbmZpcm1hdGlvbl9jb2RlXG5cbiAgJGh0dHAucG9zdCgnYXBpL2F1dGhlbnRpY2F0ZS9jb25maXJtJywgdm0uZGF0YSkuc3VjY2VzcygoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG4gICAgIyBTYXZlIHRva2VuXG4gICAgJGF1dGguc2V0VG9rZW4oZGF0YS50b2tlbilcblxuICAgICMgU2F2ZSB1c2VyIGluIGxvY2FsU3RvcmFnZVxuICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtICd1c2VyJywgdXNlclxuICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gZGF0YVxuXG4gICAgJHN0YXRlLmdvICcvJ1xuICApLmVycm9yIChkYXRhLCBzdGF0dXMsIGhlYWRlciwgY29uZmlnKSAtPlxuICAgICRzdGF0ZS5nbyAnc2lnbl9pbidcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdDb25maXJtQ29udHJvbGxlcicsIENvbmZpcm1Db250cm9sbGVyKSIsIkZvcmdvdFBhc3N3b3JkQ29udHJvbGxlciA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVzdG9yZVBhc3N3b3JkID0gKCktPlxuICAgIHZtLnNwaW5uZXJEb25lID0gdHJ1ZVxuICAgIGRhdGEgPVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG5cbiAgICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL3NlbmRfcmVzZXRfY29kZScsIGRhdGEpLnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgICAgaWYoZGF0YSlcbiAgICAgICAgdm0uc3VjY2Vzc1NlbmRpbmdFbWFpbCA9IHRydWVcbiAgICApLmVycm9yIChlcnJvciwgc3RhdHVzLCBoZWFkZXIsIGNvbmZpZykgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRm9yZ290UGFzc3dvcmRDb250cm9sbGVyJywgRm9yZ290UGFzc3dvcmRDb250cm9sbGVyKSIsIlJlc2V0UGFzc3dvcmRDb250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUsICRodHRwLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5taW5sZW5ndGggPSA4XG5cbiAgdm0ucmVzdG9yZVBhc3N3b3JkID0gKGZvcm0pIC0+XG4gICAgZGF0YSA9IHtcbiAgICAgIHJlc2V0X3Bhc3N3b3JkX2NvZGU6ICRzdGF0ZVBhcmFtcy5yZXNldF9wYXNzd29yZF9jb2RlXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcbiAgICAgIHBhc3N3b3JkX2NvbmZpcm1hdGlvbjogdm0ucGFzc3dvcmRfY29uZmlybWF0aW9uXG4gICAgfVxuXG4gICAgJGh0dHAucG9zdCgnYXBpL2F1dGhlbnRpY2F0ZS9yZXNldF9wYXNzd29yZCcsIGRhdGEpLnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICAgaWYoZGF0YSlcbiAgICAgICAgdm0uc3VjY2Vzc1Jlc3RvcmVQYXNzd29yZCA9IHRydWVcbiAgICApLmVycm9yIChlcnJvciwgc3RhdHVzLCBoZWFkZXIsIGNvbmZpZykgLT5cbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignUmVzZXRQYXNzd29yZENvbnRyb2xsZXInLCBSZXNldFBhc3N3b3JkQ29udHJvbGxlcikiLCJTaWduSW5Db250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUsICRodHRwLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5sb2dpbiA9ICgpIC0+XG4gICAgY3JlZGVudGlhbHMgPVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcblxuICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuICgtPlxuICAgICAgIyBSZXR1cm4gYW4gJGh0dHAgcmVxdWVzdCBmb3IgdGhlIG5vdyBhdXRoZW50aWNhdGVkXG4gICAgICAjIHVzZXIgc28gdGhhdCB3ZSBjYW4gZmxhdHRlbiB0aGUgcHJvbWlzZSBjaGFpblxuICAgICAgJGh0dHAuZ2V0KCdhcGkvYXV0aGVudGljYXRlL2dldF91c2VyJykudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5kYXRhLnVzZXIpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtICd1c2VyJywgdXNlclxuICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXJcblxuICAgICAgICAkc3RhdGUuZ28gJy8nXG4gICAgICAgIHJldHVyblxuICAgICksIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpO1xuICAgICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1NpZ25JbkNvbnRyb2xsZXInLCBTaWduSW5Db250cm9sbGVyKSIsIlNpZ25VcENvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVnaXN0ZXIgPSAoKS0+XG4gICAgdm0uc3Bpbm5lckRvbmUgPSB0cnVlXG4gICAgaWYgdm0udXNlclxuICAgICAgY3JlZGVudGlhbHMgPVxuICAgICAgICBuYW1lOiB2bS51c2VyLm5hbWVcbiAgICAgICAgZW1haWw6IHZtLnVzZXIuZW1haWxcbiAgICAgICAgcGFzc3dvcmQ6IHZtLnVzZXIucGFzc3dvcmRcbiAgICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiB2bS51c2VyLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuXG4gICAgJGF1dGguc2lnbnVwKGNyZWRlbnRpYWxzKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICAgICRzdGF0ZS5nbyAnc2lnbl91cF9zdWNjZXNzJ1xuICAgICAgcmV0dXJuXG4gICAgKS5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaWduVXBDb250cm9sbGVyJywgU2lnblVwQ29udHJvbGxlcikiLCJVc2VyQ29udHJvbGxlciA9ICgkaHR0cCwgJHN0YXRlLCAkYXV0aCwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0uZ2V0VXNlcnMgPSAtPlxuICAgICMgVGhpcyByZXF1ZXN0IHdpbGwgaGl0IHRoZSBpbmRleCBtZXRob2QgaW4gdGhlIEF1dGhlbnRpY2F0ZUNvbnRyb2xsZXJcbiAgICAjIG9uIHRoZSBMYXJhdmVsIHNpZGUgYW5kIHdpbGwgcmV0dXJuIHRoZSBsaXN0IG9mIHVzZXJzXG4gICAgJGh0dHAuZ2V0KCdhcGkvYXV0aGVudGljYXRlJykuc3VjY2VzcygodXNlcnMpIC0+XG4gICAgICB2bS51c2VycyA9IHVzZXJzXG4gICAgICByZXR1cm5cbiAgICApLmVycm9yIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG4gIHZtLmxvZ291dCA9IC0+XG4gICAgJGF1dGgubG9nb3V0KCkudGhlbiAtPlxuICAgICAgIyBSZW1vdmUgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtICd1c2VyJ1xuICAgICAgIyBGbGlwIGF1dGhlbnRpY2F0ZWQgdG8gZmFsc2Ugc28gdGhhdCB3ZSBubyBsb25nZXJcbiAgICAgICMgc2hvdyBVSSBlbGVtZW50cyBkZXBlbmRhbnQgb24gdGhlIHVzZXIgYmVpbmcgbG9nZ2VkIGluXG4gICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZVxuICAgICAgIyBSZW1vdmUgdGhlIGN1cnJlbnQgdXNlciBpbmZvIGZyb20gcm9vdHNjb3BlXG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbFxuICAgICAgJHN0YXRlLmdvICdzaWduX2luJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignVXNlckNvbnRyb2xsZXInLCBVc2VyQ29udHJvbGxlcikiLCJDcmVhdGVVc2VyQ3RybCA9ICgkaHR0cCwgJHN0YXRlLCBVcGxvYWQsIGxvZGFzaCkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmNoYXJzID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6IUAjJCVeJiooKS0rPD5BQkNERUZHSElKS0xNTk9QMTIzNDU2Nzg5MCdcblxuICAkaHR0cC5nZXQoJy9hcGkvdXNlcnMvY3JlYXRlJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5lbnVtcyA9IHJlc3BvbnNlLmRhdGFcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLmFkZFVzZXIgPSAoKSAtPlxuICAgIHZtLmRhdGEgPVxuICAgICAgbmFtZTogdm0ubmFtZVxuICAgICAgbGFzdF9uYW1lOiB2bS5sYXN0X25hbWVcbiAgICAgIGluaXRpYWxzOiB2bS5pbml0aWFsc1xuICAgICAgYXZhdGFyOiB2bS5hdmF0YXJcbiAgICAgIGJkYXk6IHZtLmJkYXlcbiAgICAgIGpvYl90aXRsZTogdm0uam9iX3RpdGxlXG4gICAgICB1c2VyX2dyb3VwOiB2bS51c2VyX2dyb3VwXG4gICAgICBjb3VudHJ5OiB2bS5jb3VudHJ5XG4gICAgICBjaXR5OiB2bS5jaXR5XG4gICAgICBwaG9uZTogdm0ucGhvbmVcbiAgICAgIGVtYWlsOiB2bS5lbWFpbFxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG5cbiAgICBVcGxvYWQudXBsb2FkKFxuICAgICAgdXJsOiAnL2FwaS91c2VycydcbiAgICAgIG1ldGhvZDogJ1Bvc3QnXG4gICAgICBkYXRhOiB2bS5kYXRhXG4gICAgKS50aGVuICgocmVzcCkgLT5cbiAgICAgICRzdGF0ZS5nbyAndXNlcnMnLCB7IGZsYXNoU3VjY2VzczogJ05ldyB1c2VyIGhhcyBiZWVuIGFkZGVkIScgfVxuICAgICAgcmV0dXJuXG4gICAgKSwgKChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZ2VuZXJhdGVQYXNzID0gKCkgLT5cbiAgICB2bS5wYXNzd29yZCA9ICcnXG4gICAgcGFzc0xlbmd0aCA9IGxvZGFzaC5yYW5kb20oOCwxNSlcbiAgICB4ID0gMFxuXG4gICAgd2hpbGUgeCA8IHBhc3NMZW5ndGhcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2bS5jaGFycy5sZW5ndGgpXG4gICAgICB2bS5wYXNzd29yZCArPSB2bS5jaGFycy5jaGFyQXQoaSlcbiAgICAgIHgrK1xuICAgIHJldHVybiB2bS5wYXNzd29yZFxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVVzZXJDdHJsJywgQ3JlYXRlVXNlckN0cmwpIiwiSW5kZXhVc2VyQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS91c2VycydcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCdhcGkvdXNlcnMnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS51c2VycyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpO1xuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS51c2VycyA9IG9yZGVyQnkodm0udXNlcnMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG4gIHZtLmRlbGV0ZVVzZXIgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvdXNlcnMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0udXNlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnVXNlciBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4VXNlckN0cmwnLCBJbmRleFVzZXJDdHJsKVxuIiwiU2hvd1VzZXJDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG4gIHZtLnNldHRpbmdzID1cbiAgICBsaW5lV2lkdGg6IDUsXG4gICAgdHJhY2tDb2xvcjogJyNlOGVmZjAnLFxuICAgIGJhckNvbG9yOiAnIzI3YzI0YycsXG4gICAgc2NhbGVDb2xvcjogZmFsc2UsXG4gICAgY29sb3I6ICcjM2EzZjUxJyxcbiAgICBzaXplOiAxMzQsXG4gICAgbGluZUNhcDogJ2J1dHQnLFxuICAgIHJvdGF0ZTogLTkwLFxuICAgIGFuaW1hdGU6IDEwMDBcblxuICAkaHR0cC5nZXQoJ2FwaS91c2Vycy8nK3ZtLmlkKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgaWYgdm0ub2JqLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0ub2JqLmF2YXRhciA9ICcvaW1hZ2VzLycgKyB2bS5vYmouYXZhdGFyXG4gICAgZWxzZVxuICAgICAgdm0ub2JqLmF2YXRhciA9ICd1cGxvYWRzL2F2YXRhcnMvJyArIHZtLm9iai5hdmF0YXJcbiAgICB2bS5vYmouYmRheSA9IG1vbWVudChuZXcgRGF0ZSh2bS5vYmouYmRheSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1VzZXJDdHJsJywgU2hvd1VzZXJDdHJsKSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
