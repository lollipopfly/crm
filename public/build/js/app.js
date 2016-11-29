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
}).run(function($q, $rootScope, $state, $auth, $location, $timeout) {
  var publicRoutes;
  publicRoutes = ['sign_up', 'confirm', 'forgot_password', 'reset_password'];
  $rootScope.currentState = $state.current.name;
  if (!$auth.isAuthenticated() && publicRoutes.indexOf($rootScope.currentState) === -1) {
    $location.path('user/sign_in');
  }
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
            contentString = '<div class="marker-content">' + value.store.address + '</div>';
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
            contentString = '<div class="marker-content">' + value.store.address + '</div>';
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
    return vm.route.date = moment(new Date(vm.route.date)).format('DD.MM.YYYY');
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
            contentString = '<div class="marker-content">' + value.store.address + '</div>';
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
  $timeout((function() {
    initMap();
  }), 500);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJkaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuY29mZmVlIiwiZGlyZWN0aXZlcy9kZWxldGVfYXZhdGFyLmNvZmZlZSIsImRpcmVjdGl2ZXMvZmlsZV9maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3BhZ2luYXRpb24uY29mZmVlIiwiZGlyZWN0aXZlcy9yYWRpb19maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3RpbWVwaWNrZXIuY29mZmVlIiwiY29udHJvbGxlcnMvaG9tZS9pbmRleF9ob21lX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvbWFwL2luZGV4X21hcF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3Byb2ZpbGUvZWRpdF9wcm9maWxlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcHJvZmlsZS9pbmRleF9wcm9maWxlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2NyZWF0ZV9yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3JvdXRlcy9lZGl0X3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2luZGV4X3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL3Nob3dfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvY3JlYXRlX3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvc3RvcmVzL2VkaXRfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvaW5kZXhfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9zdG9yZXMvc2hvd19zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvY29uZmlybV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvZm9yZ290X3Bhc3N3b3JkX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9yZXNldF9wYXNzd29yZF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvc2lnbl9pbl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvc2lnbl91cF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvdXNlcl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXJzL2NyZWF0ZV91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvaW5kZXhfdXNlcl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXJzL3Nob3dfdXNlcl9jdHJsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUVBLE9BQ0UsQ0FBQyxNQURILENBQ1UsS0FEVixFQUNpQixDQUNiLFdBRGEsRUFFYixZQUZhLEVBR2IsY0FIYSxFQUliLFVBSmEsRUFLYixRQUxhLEVBTWIsZUFOYSxFQU9iLGNBUGEsRUFRYixjQVJhLENBRGpCLENBVUksQ0FBQyxNQVZMLENBVVksU0FBQyxjQUFELEVBQWlCLGtCQUFqQixFQUFxQyxhQUFyQyxFQUFvRCxpQkFBcEQ7RUFDUixpQkFBaUIsQ0FBQyxTQUFsQixDQUE0QixJQUE1QjtFQUlBLGFBQWEsQ0FBQyxRQUFkLEdBQXlCO0VBQ3pCLGFBQWEsQ0FBQyxTQUFkLEdBQTBCO0VBQzFCLGtCQUFrQixDQUFDLFNBQW5CLENBQTZCLGVBQTdCO0VBRUEsY0FDRSxDQUFDLEtBREgsQ0FDUyxHQURULEVBRUk7SUFBQSxHQUFBLEVBQUssR0FBTDtJQUNBLFdBQUEsRUFBYSwwQkFEYjtJQUVBLFVBQUEsRUFBWSx1QkFGWjtHQUZKLENBUUUsQ0FBQyxLQVJILENBUVMsU0FSVCxFQVNJO0lBQUEsR0FBQSxFQUFLLGVBQUw7SUFDQSxXQUFBLEVBQWEsNEJBRGI7SUFFQSxVQUFBLEVBQVksMEJBRlo7R0FUSixDQWFFLENBQUMsS0FiSCxDQWFTLFNBYlQsRUFjSTtJQUFBLEdBQUEsRUFBSyxlQUFMO0lBQ0EsV0FBQSxFQUFhLDRCQURiO0lBRUEsVUFBQSxF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QWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUR0QztLQUFBLE1BQUE7TUFHRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQVAsR0FBZ0Isa0JBQUEsR0FBcUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUg5Qzs7SUFJQSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQVAsR0FBYyxNQUFBLENBQVcsSUFBQSxJQUFBLENBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFaLENBQVgsQ0FBNkIsQ0FBQyxNQUE5QixDQUFxQyxZQUFyQztFQU5tQixDQUFuQyxFQVFFLFNBQUMsS0FBRDtJQUNBLEVBQUUsQ0FBQyxLQUFILEdBQVcsS0FBSyxDQUFDO0VBRGpCLENBUkY7QUFkYTs7QUE2QmY7O0FBQ0EsT0FDRSxDQUFDLE1BREgsQ0FDVSxLQURWLENBRUUsQ0FBQyxVQUZILENBRWMsY0FGZCxFQUU4QixZQUY5QiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnLCBbXG4gICAgJ3VpLnJvdXRlcidcbiAgICAnc2F0ZWxsaXplcidcbiAgICBcInVpLmJvb3RzdHJhcFwiXG4gICAgXCJuZ0xvZGFzaFwiXG4gICAgXCJuZ01hc2tcIlxuICAgIFwiYW5ndWxhck1vbWVudFwiXG4gICAgXCJlYXN5cGllY2hhcnRcIlxuICAgIFwibmdGaWxlVXBsb2FkXCJcbiAgXSkuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikgLT5cbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUgdHJ1ZVxuXG4gICAgIyBTYXRlbGxpemVyIGNvbmZpZ3VyYXRpb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggQVBJXG4gICAgIyByb3V0ZSB0aGUgSldUIHNob3VsZCBiZSByZXRyaWV2ZWQgZnJvbVxuICAgICRhdXRoUHJvdmlkZXIubG9naW5VcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUnXG4gICAgJGF1dGhQcm92aWRlci5zaWdudXBVcmwgPSAnL2FwaS9hdXRoZW50aWNhdGUvcmVnaXN0ZXInXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSAnL3VzZXIvc2lnbl9pbidcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAuc3RhdGUoJy8nLFxuICAgICAgICB1cmw6ICcvJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3BhZ2VzL2hvbWUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4SG9tZUN0cmwgYXMgaG9tZSdcbiAgICAgIClcblxuICAgICAgIyBVU0VSXG4gICAgICAuc3RhdGUoJ3NpZ25faW4nLFxuICAgICAgICB1cmw6ICcvdXNlci9zaWduX2luJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvc2lnbl9pbi5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2lnbkluQ29udHJvbGxlciBhcyBhdXRoJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzaWduX3VwJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvc2lnbl91cCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25fdXAuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25VcENvbnRyb2xsZXIgYXMgcmVnaXN0ZXInXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3NpZ25fdXBfc3VjY2VzcycsXG4gICAgICAgIHVybDogJy91c2VyL3NpZ25fdXBfc3VjY2VzcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25fdXBfc3VjY2Vzcy5odG1sJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdmb3Jnb3RfcGFzc3dvcmQnLFxuICAgICAgICB1cmw6ICcvdXNlci9mb3Jnb3RfcGFzc3dvcmQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9mb3Jnb3RfcGFzc3dvcmQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0ZvcmdvdFBhc3N3b3JkQ29udHJvbGxlciBhcyBmb3Jnb3RQYXNzd29yZCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncmVzZXRfcGFzc3dvcmQnLFxuICAgICAgICB1cmw6ICcvdXNlci9yZXNldF9wYXNzd29yZC86cmVzZXRfcGFzc3dvcmRfY29kZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3Jlc2V0X3Bhc3N3b3JkLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdSZXNldFBhc3N3b3JkQ29udHJvbGxlciBhcyByZXNldFBhc3N3b3JkJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdjb25maXJtJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvY29uZmlybS86Y29uZmlybWF0aW9uX2NvZGUnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb25maXJtQ29udHJvbGxlcidcbiAgICAgIClcblxuICAgICAgIyBQcm9maWxlXG4gICAgICAuc3RhdGUoJ3Byb2ZpbGUnLFxuICAgICAgICB1cmw6ICcvcHJvZmlsZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9wcm9maWxlL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFByb2ZpbGVDdHJsIGFzIHByb2ZpbGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3Byb2ZpbGVfZWRpdCcsXG4gICAgICAgIHVybDogJy9wcm9maWxlL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvcHJvZmlsZS9lZGl0Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0UHJvZmlsZUN0cmwgYXMgcHJvZmlsZSdcbiAgICAgIClcblxuICAgICAgIyBTdG9yZXNcbiAgICAgIC5zdGF0ZSgnc3RvcmVzJyxcbiAgICAgICAgdXJsOiAnL3N0b3JlcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9zdG9yZXMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4U3RvcmVDdHJsIGFzIHN0b3JlcydcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIGZsYXNoU3VjY2VzczogbnVsbFxuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3N0b3Jlcy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2NyZWF0ZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlU3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfZWRpdCcsXG4gICAgICAgIHVybDogJy9zdG9yZXMvOmlkL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2VkaXQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0VkaXRTdG9yZUN0cmwgYXMgc3RvcmUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3N0b3Jlc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3N0b3Jlcy86aWQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dTdG9yZUN0cmwgYXMgc3RvcmUnXG4gICAgICApXG5cbiAgICAgICMgVXNlcnNcbiAgICAgIC5zdGF0ZSgndXNlcnMnLFxuICAgICAgICB1cmw6ICcvdXNlcnMnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlcnMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4VXNlckN0cmwgYXMgdXNlcnMnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICBmbGFzaFN1Y2Nlc3M6IG51bGxcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgndXNlcnNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzL2NyZWF0ZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2Vycy9jcmVhdGUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVVzZXJDdHJsIGFzIHVzZXInXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3VzZXJzX3Nob3cnLFxuICAgICAgICB1cmw6ICcvdXNlcnMvOmlkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXJzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dVc2VyQ3RybCBhcyB1c2VyJ1xuICAgICAgKVxuXG4gICAgICAjIFJvdXRlc1xuICAgICAgLnN0YXRlKCdyb3V0ZXMnLFxuICAgICAgICB1cmw6ICcvcm91dGVzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3JvdXRlcy9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhSb3V0ZUN0cmwgYXMgcm91dGVzJ1xuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgZmxhc2hTdWNjZXNzOiBudWxsXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19jcmVhdGUnLFxuICAgICAgICB1cmw6ICcvcm91dGVzL2NyZWF0ZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvY3JlYXRlLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19lZGl0JyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy86aWQvZWRpdCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvZWRpdC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRWRpdFJvdXRlQ3RybCBhcyByb3V0ZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgncm91dGVzX3Nob3cnLFxuICAgICAgICB1cmw6ICcvcm91dGVzLzppZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvc2hvdy5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnU2hvd1JvdXRlQ3RybCBhcyByb3V0ZSdcbiAgICAgIClcblxuICAgICAgIyBNYXBcbiAgICAgIC5zdGF0ZSgnbWFwJyxcbiAgICAgICAgdXJsOiAnL21hcCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9tYXAvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4TWFwQ3RybCBhcyBtYXAnXG4gICAgICApXG5cbiAgICByZXR1cm5cbiAgKS5ydW4gKCRxLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhdXRoLCAkbG9jYXRpb24sICR0aW1lb3V0KSAtPlxuICAgIHB1YmxpY1JvdXRlcyA9IFtcbiAgICAgICdzaWduX3VwJ1xuICAgICAgJ2NvbmZpcm0nXG4gICAgICAnZm9yZ290X3Bhc3N3b3JkJ1xuICAgICAgJ3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICBdXG5cbiAgICAjIGlmIG5vdCBsb2dnZWRcbiAgICAkcm9vdFNjb3BlLmN1cnJlbnRTdGF0ZSA9ICRzdGF0ZS5jdXJyZW50Lm5hbWVcblxuICAgIGlmICEkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKSAmJiBwdWJsaWNSb3V0ZXMuaW5kZXhPZigkcm9vdFNjb3BlLmN1cnJlbnRTdGF0ZSkgPT0gLTFcbiAgICAgICRsb2NhdGlvbi5wYXRoICd1c2VyL3NpZ25faW4nXG5cbiAgICAkcm9vdFNjb3BlLiRvbiAnJHN0YXRlQ2hhbmdlU3RhcnQnLCAoZXZlbnQsIHRvU3RhdGUpIC0+XG4gICAgICB1c2VyID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpKVxuXG4gICAgICBpZiB1c2VyICYmICRhdXRoLmlzQXV0aGVudGljYXRlZCgpXG4gICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXJcbiAgICAgICAgaWYgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9ICcvaW1hZ2VzLycgKyAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhclxuICAgICAgICBlbHNlXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSAndXBsb2Fkcy9hdmF0YXJzLycgKyAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhclxuXG4gICAgICAkcm9vdFNjb3BlLmxvZ291dCA9IC0+XG4gICAgICAgICRhdXRoLmxvZ291dCgpLnRoZW4gLT5cbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSAndXNlcidcbiAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZVxuICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsXG4gICAgICAgICAgJHN0YXRlLmdvICdzaWduX2luJ1xuICAgICAgICAgIHJldHVyblxuICAgICAgICByZXR1cm5cbiAgICByZXR1cm4iLCJjaGVja2JveEZpZWxkID0gKCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUEnXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9jaGVja2JveF9maWVsZC5odG1sJ1xuICAgIHNjb3BlOiB7XG4gICAgICBsYWJlbDogJz1sYWJlbCdcbiAgICAgIGF0dHJDbGFzczogJz0/YXR0ckNsYXNzJ1xuICAgICAgbmdDaGVja2VkOiAnPT9uZ0NoZWNrZWQnXG4gICAgICBtb2RlbDogJz1tb2RlbCdcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKS0+XG4gICAgICBpZiBzY29wZS5tb2RlbCA9PSAnMSdcbiAgICAgICAgc2NvcGUubW9kZWwgPSB0cnVlXG4gICAgICBlbHNlIGlmIHNjb3BlLm1vZGVsID09ICcwJ1xuICAgICAgICBzY29wZS5tb2RlbCA9IGZhbHNlXG4gICAgICByZXR1cm5cbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2NoZWNrYm94RmllbGQnLCBjaGVja2JveEZpZWxkIiwiZGF0ZXRpbWVwaWNrZXIgPSAoJHRpbWVvdXQpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuaHRtbCdcbiAgICByZXF1aXJlOiAnbmdNb2RlbCdcbiAgICBzY29wZToge1xuICAgICAgbGFiZWw6IFwiPT9sYWJlbFwiXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0ciwgbmdNb2RlbCkgLT5cbiAgICAgIHNjb3BlLm9wZW4gPSAoKSAtPlxuICAgICAgICBzY29wZS5kYXRlX29wZW5lZCA9IHRydWVcblxuICAgICAgJHRpbWVvdXQoXG4gICAgICAgICgoKSAtPlxuICAgICAgICAgIHNjb3BlLm1vZGVsID0gRGF0ZS5wYXJzZShuZ01vZGVsLiR2aWV3VmFsdWUpXG4gICAgICAgICksIDQwMFxuICAgICAgKVxuXG4gICAgICBzY29wZS5zZWxlY3REYXRlID0gKChtb2RlbCkgLT5cbiAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobW9kZWwpXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdkYXRldGltZXBpY2tlcicsIGRhdGV0aW1lcGlja2VyIiwiZGVsZXRlQXZhdGFyID0gKCR0aW1lb3V0KSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQSdcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2RlbGV0ZV9hdmF0YXIuaHRtbCdcbiAgICBzY29wZTpcbiAgICAgIHJlbW92ZUF2YXRhcjogJz1uZ01vZGVsJ1xuICAgICAgZmlsZTogXCI9ZmlsZVwiXG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycykgLT5cbiAgICAgIGF0dHJzLiRvYnNlcnZlICdpbWdOYW1lJywgKHZhbHVlKSAtPlxuICAgICAgICBzY29wZS5pbWdOYW1lID0gdmFsdWVcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHNjb3BlLnJlbW92ZSA9ICgpIC0+XG4gICAgICAgICR0aW1lb3V0KCgpLT5cbiAgICAgICAgICBzY29wZS5pbWdOYW1lID0gJ2ltYWdlcy9kZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgIClcblxuICAgICAgICBpZiBzY29wZS5maWxlICE9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICAgc2NvcGUucmVtb3ZlQXZhdGFyID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnZGVsZXRlQXZhdGFyJywgZGVsZXRlQXZhdGFyIiwiZmlsZUZpZWxkID0gKCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnQUUnXG4gICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9kaXJlY3RpdmVzL2ZpbGVfZmllbGQuaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgYXR0cklkOiAnPSdcbiAgICAgIG5nTW9kZWw6ICc9bmdNb2RlbCdcbiAgICAgIHJlbW92ZUF2YXRhcjogJz0/cmVtb3ZlZEF2YXRhcidcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgZWxlbWVudC5iaW5kICdjaGFuZ2UnLCAoY2hhbmdlRXZlbnQpIC0+XG4gICAgICAgIHNjb3BlLm5nTW9kZWwgPSBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgICAgIHNjb3BlLnJlbW92ZUF2YXRhciA9IGZhbHNlICMgZm9yIGRlbGV0ZV9hdmF0YXIgZGlyZWN0aXZlXG4gICAgICAgIGZpbGVzID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGVzWzBdLm5hbWU7XG4gICAgICAgIGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT10ZXh0XScpLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBmaWxlTmFtZSlcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2ZpbGVGaWVsZCcsIGZpbGVGaWVsZCIsInBhZ2luYXRpb24gPSAoJGh0dHApIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9wYWdpbmF0aW9uLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIHBhZ2lBcnI6ICc9J1xuICAgICAgaXRlbXM6ICc9J1xuICAgICAgcGFnaUFwaVVybDogJz0nXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIHNjb3BlLiR3YXRjaCAoLT5cbiAgICAgICAgc2NvcGUucGFnaUFyclxuICAgICAgKSwgKChuZXdWYWx1ZSwgb2xkVmFsdWUpIC0+XG4gICAgICAgIGlmICFhbmd1bGFyLmVxdWFscyhvbGRWYWx1ZSwgbmV3VmFsdWUpXG4gICAgICAgICAgc2NvcGUucGFnaUFyciA9IG5ld1ZhbHVlXG4gICAgICAgICAgc2NvcGUudG90YWxQYWdlcyA9IHNjb3BlLnBhZ2lBcnIubGFzdF9wYWdlXG4gICAgICAgICAgc2NvcGUuY3VycmVudFBhZ2UgPSBzY29wZS5wYWdpQXJyLmN1cnJlbnRfcGFnZVxuICAgICAgICAgIHNjb3BlLnRvdGFsID0gc2NvcGUucGFnaUFyci50b3RhbFxuICAgICAgICAgIHNjb3BlLnBlclBhZ2UgPSBzY29wZS5wYWdpQXJyLnBlcl9wYWdlXG5cbiAgICAgICAgICAjIFBhZ2luYXRpb24gUmFuZ2VcbiAgICAgICAgICBzY29wZS5wYWluYXRpb25SYW5nZShzY29wZS50b3RhbFBhZ2VzKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgdHJ1ZVxuXG4gICAgICBzY29wZS5nZXRQb3N0cyA9IChwYWdlTnVtYmVyKSAtPlxuICAgICAgICBpZiBwYWdlTnVtYmVyID09IHVuZGVmaW5lZFxuICAgICAgICAgIHBhZ2VOdW1iZXIgPSAnMSdcbiAgICAgICAgJGh0dHAuZ2V0KHNjb3BlLnBhZ2lBcGlVcmwrJz9wYWdlPScgKyBwYWdlTnVtYmVyKS5zdWNjZXNzIChyZXNwb25zZSkgLT5cbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgc2NvcGUuaXRlbXMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgc2NvcGUudG90YWxQYWdlcyA9IHJlc3BvbnNlLmxhc3RfcGFnZVxuICAgICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlXG5cbiAgICAgICAgICAjIFBhZ2luYXRpb24gUmFuZ2VcbiAgICAgICAgICBzY29wZS5wYWluYXRpb25SYW5nZShzY29wZS50b3RhbFBhZ2VzKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICByZXR1cm5cblxuICAgICAgc2NvcGUucGFpbmF0aW9uUmFuZ2UgPSAodG90YWxQYWdlcykgLT5cbiAgICAgICAgcGFnZXMgPSBbXVxuICAgICAgICBpID0gMVxuICAgICAgICB3aGlsZSBpIDw9IHRvdGFsUGFnZXNcbiAgICAgICAgICBwYWdlcy5wdXNoIGlcbiAgICAgICAgICBpKytcbiAgICAgICAgc2NvcGUucmFuZ2UgPSBwYWdlc1xuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAncGFnaW5hdGlvbicsIHBhZ2luYXRpb24iLCJyYWRpb0ZpZWxkID0gKCRodHRwKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQSdcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL3JhZGlvX2ZpZWxkLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIG5nTW9kZWw6IFwiPW5nTW9kZWxcIlxuICAgICAgbGFiZWw6ICc9bGFiZWwnXG4gICAgICBhdHRyTmFtZTogJz1hdHRyTmFtZSdcbiAgICAgIGF0dHJWYWx1ZTogJz1hdHRyVmFsdWUnXG4gICAgICBuZ0NoZWNrZWQ6ICc9P25nQ2hlY2tlZCdcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKS0+XG4gICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUuYXR0clZhbHVlXG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2hhbmdlJywgKCktPlxuICAgICAgICBzY29wZS5uZ01vZGVsID0gc2NvcGUuYXR0clZhbHVlXG4gICAgICApXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdyYWRpb0ZpZWxkJywgcmFkaW9GaWVsZCIsInRpbWVwaWNrZXIgPSAoKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdBRSdcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL3RpbWVwaWNrZXIuaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgbW9kZWw6IFwiPW5nTW9kZWxcIlxuICAgICAgbGFiZWw6IFwiPT9sYWJlbFwiXG4gICAgICBhdHRyTmFtZTogXCJAXCJcbiAgICB9XG4gICAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRyKSAtPlxuICAgICAgc2NvcGUuaHN0ZXAgPSAxXG4gICAgICBzY29wZS5tc3RlcCA9IDVcbiAgICAgIHNjb3BlLmlzbWVyaWRpYW4gPSB0cnVlXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICd0aW1lcGlja2VyJywgdGltZXBpY2tlciIsIkluZGV4SG9tZUN0cmwgPSAoJGh0dHAsICR0aW1lb3V0LCAkZmlsdGVyLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICAjIFJvdXRlc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL2hvbWUnXG4gIG9yZGVyQnkgPSAkZmlsdGVyKCdvcmRlckJ5JylcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnO1xuICB2bS5tYXJrZXJzID0gW11cblxuXG4gICMjIyAgUk9VVEVTICAjIyNcbiAgaWYgJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VyX2dyb3VwID09ICdhZG1pbidcbiAgICAkaHR0cC5nZXQoJy9hcGkvaG9tZScpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucm91dGVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgICB2bS5wYWdpQXJyID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgICByZXR1cm5cbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgIyMjICBNQVAgICMjI1xuICAjIEdldCBwb2ludHMgSlNPTlxuICAkaHR0cChcbiAgICBtZXRob2Q6ICdHRVQnXG4gICAgdXJsOiAnL2FwaS9ob21lL2dldHBvaW50cycpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnBvaW50cyA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIGluaXRNYXAoKVxuXG4gICAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJylcblxuICAgIHZtLnByZWRpY2F0ZSA9IHByZWRpY2F0ZVxuICAgIHZtLnJldmVyc2UgPSBpZiAodm0ucHJlZGljYXRlID09IHByZWRpY2F0ZSkgdGhlbiAhdm0ucmV2ZXJzZSBlbHNlIGZhbHNlXG4gICAgdm0ucm91dGVzID0gb3JkZXJCeSh2bS5yb3V0ZXMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG5cbiAgaW5pdE1hcCA9IC0+XG4gICAgbWFwT3B0aW9ucyA9XG4gICAgICB6b29tOiAxMlxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2VcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczogcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTVxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTA3MzUwOSwgLTAuMTI3NzU4MylcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzXG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlXG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2goIHZtLnBvaW50cywgKHZhbHVlLCBrZXkpIC0+XG4gICAgICBhZGRyZXNzID0gdmFsdWUuc3RvcmUuYWRkcmVzc1xuICAgICAgIyBHZW9jb2RlIEFkZHJlc3NlcyBieSBhZGRyZXNzIG5hbWVcbiAgICAgIGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmNhZ2VkYXRhLmNvbS9nZW9jb2RlL3YxL2pzb24/cT1cIithZGRyZXNzK1wiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleTtcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICByZXEub25sb2FkID0gKCkgLT5cbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHBvc2l0aW9uID0gcmVzcG9uc2UucmVzdWx0c1swXS5nZW9tZXRyeVxuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMClcbiAgICAgICAgICAgIGNvbnRlbnRTdHJpbmcgPSAnPGRpdiBjbGFzcz1cIm1hcmtlci1jb250ZW50XCI+JyArIHZhbHVlLnN0b3JlLmFkZHJlc3MgKyAnPC9kaXY+J1xuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZykgIyBwb3B1cFxuXG4gICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWVcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIC0+XG4gICAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuICAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpO1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaydcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfVxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJ1xuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleEhvbWVDdHJsJywgSW5kZXhIb21lQ3RybCkiLCJJbmRleE1hcEN0cmwgPSAoJGh0dHAsICR0aW1lb3V0KSAtPlxuICB2bSA9IHRoaXNcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnO1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIEdldCBwb2ludHMgSlNPTlxuICAkaHR0cChcbiAgICBtZXRob2Q6ICdHRVQnXG4gICAgdXJsOiAnL2FwaS9tYXAnKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhXG4gICAgICAjIEluaXQgbWFwXG4gICAgICBpbml0TWFwKClcbiAgICAgIHJldHVyblxuICApXG5cbiAgaW5pdE1hcCA9IC0+XG4gICAgbWFwT3B0aW9ucyA9XG4gICAgICB6b29tOiAxMlxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2VcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczogcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTVxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTA3MzUwOSwgLTAuMTI3NzU4MylcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzXG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlO1xuXG4gICAgIyBTZXQgbG9jYXRpb25zXG4gICAgYW5ndWxhci5mb3JFYWNoKCB2bS5wb2ludHMsICh2YWx1ZSwga2V5KSAtPlxuICAgICAgYWRkcmVzcyA9IHZhbHVlLnN0b3JlLmFkZHJlc3NcbiAgICAgICMgR2VvY29kZSBBZGRyZXNzZXMgYnkgYWRkcmVzcyBuYW1lXG4gICAgICBhcGlVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW5jYWdlZGF0YS5jb20vZ2VvY29kZS92MS9qc29uP3E9XCIrYWRkcmVzcytcIiZwcmV0dHk9MSZrZXk9XCIgKyBhcGlLZXk7XG4gICAgICByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgcmVxLm9ubG9hZCA9ICgpIC0+XG4gICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICBwb3NpdGlvbiA9IHJlc3BvbnNlLnJlc3VsdHNbMF0uZ2VvbWV0cnlcblxuICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMClcbiAgICAgICAgICAgY29udGVudFN0cmluZyA9ICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICsgdmFsdWUuc3RvcmUuYWRkcmVzcyArICc8L2Rpdj4nXG4gICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpICMgcG9wdXBcblxuICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgaWYgcGFyc2VJbnQgdmFsdWUuc3RhdHVzXG4gICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbi5wbmcnXG5cbiAgICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgaWNvbjogdm0uYmFsb29uTmFtZVxuICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvblxuICAgICAgICAgICApXG5cbiAgICAgICAgICAgIyBDbGljayBieSBvdGhlciBtYXJrZXJcbiAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbiBtYXAsIG1hcmtlclxuXG4gICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgIClcblxuICAgICAgICAgICAjIENsaWNrIGJ5IGVtcHR5IG1hcCBhcmVhXG4gICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgLT5cbiAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICApXG5cbiAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgdm0ubWFya2Vycy5wdXNoKG1hcmtlcilcbiAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIGFwaVVybCwgdHJ1ZSk7XG4gICAgICByZXEuc2VuZCgpO1xuICAgIClcbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaydcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfVxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJ1xuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleE1hcEN0cmwnLCBJbmRleE1hcEN0cmwpIiwiRWRpdFByb2ZpbGVDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3Byb2ZpbGUvZWRpdCcpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0udXNlciA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHZtLnVzZXIucmVtb3ZlX2F2YXRhciA9IGZhbHNlXG5cbiAgICAgIHZtLmF2YXRhciA9IHZtLm1ha2VBdmF0YXJMaW5rKHZtLnVzZXIuYXZhdGFyKSAjIGZvciBkZWxldGVfYXZhdGFyIGRpcmVjdGl2ZVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBhdmF0YXIgPSB2bS51c2VyLmF2YXRhclxuXG4gICAgaWYgdm0udXNlci5hdmF0YXIgPT0gJy9pbWFnZXMvZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0udXNlci5hdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJyAjIHRvZG8gaHogbWF5IGJlIGZvciBkZWxldGVcbiAgICAgIGF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgdm0uZGF0YSA9XG4gICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgcmVtb3ZlX2F2YXRhcjogdm0udXNlci5yZW1vdmVfYXZhdGFyXG4gICAgICBuYW1lOiB2bS51c2VyLm5hbWVcbiAgICAgIGxhc3RfbmFtZTogdm0udXNlci5sYXN0X25hbWVcbiAgICAgIGluaXRpYWxzOiB2bS51c2VyLmluaXRpYWxzXG4gICAgICBiZGF5OiB2bS51c2VyLmJkYXlcbiAgICAgIGVtYWlsOiB2bS51c2VyLmVtYWlsXG4gICAgICBwaG9uZTogdm0udXNlci5waG9uZVxuICAgICAgam9iX3RpdGxlOiB2bS51c2VyLmpvYl90aXRsZVxuICAgICAgY291bnRyeTogdm0udXNlci5jb3VudHJ5XG4gICAgICBjaXR5OiB2bS51c2VyLmNpdHlcblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3Byb2ZpbGUvJyArIHZtLnVzZXIuaWRcbiAgICAgIG1ldGhvZDogJ1Bvc3QnXG4gICAgICBkYXRhOiB2bS5kYXRhXG4gICAgKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICBmaWxlTmFtZSA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpXG4gICAgICBzdG9yYWdlID0gSlNPTi5wYXJzZShzdG9yYWdlKVxuXG4gICAgICAjIERlZmF1bHQgYXZhdGFyXG4gICAgICBpZiB0eXBlb2YgZmlsZU5hbWUgPT0gJ2Jvb2xlYW4nICYmIHZtLnVzZXIucmVtb3ZlX2F2YXRhclxuICAgICAgICBzdG9yYWdlLmF2YXRhciA9ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAjIFVwZGF0ZSBzdG9yYWdlXG4gICAgICBlbHNlIGlmIHR5cGVvZiBmaWxlTmFtZSA9PSAnc3RyaW5nJyAmJiAhdm0udXNlci5yZW1vdmVfYXZhdGFyXG4gICAgICAgIHN0b3JhZ2UuYXZhdGFyID0gZmlsZU5hbWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSB2bS5tYWtlQXZhdGFyTGluayhzdG9yYWdlLmF2YXRhcilcbiAgICAgICAgc3RvcmFnZS5hdmF0YXIgPSBmaWxlTmFtZVxuXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2UpKVxuXG4gICAgICAkc3RhdGUuZ28gJ3Byb2ZpbGUnLCB7IGZsYXNoU3VjY2VzczogJ1Byb2ZpbGUgdXBkYXRlZCEnIH1cbiAgICApLCAoKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcik7XG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgdm0ubWFrZUF2YXRhckxpbmsgPSAoYXZhdGFyTmFtZSkgLT5cbiAgICBpZiBhdmF0YXJOYW1lID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICBhdmF0YXJOYW1lID0gJy9pbWFnZXMvJyArIGF2YXRhck5hbWVcbiAgICBlbHNlXG4gICAgICBhdmF0YXJOYW1lID0gJy91cGxvYWRzL2F2YXRhcnMvJyArIGF2YXRhck5hbWVcblxuICAgIHJldHVybiBhdmF0YXJOYW1lXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFByb2ZpbGVDdHJsJywgRWRpdFByb2ZpbGVDdHJsKSIsIkluZGV4UHJvZmlsZUN0cmwgPSAoJGh0dHApIC0+XG4gIHZtID0gdGhpc1xuXG4gICRodHRwLmdldCgnL2FwaS9wcm9maWxlJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS51c2VyID0gcmVzcG9uc2UuZGF0YS51c2VyXG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhLnBvaW50c1xuICAgICAgaWYgdm0udXNlci5hdmF0YXIgPT0gJ2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgICAgdm0udXNlci5hdmF0YXIgPSAnL2ltYWdlcy8nICsgdm0udXNlci5hdmF0YXJcbiAgICAgIGVsc2VcbiAgICAgICAgdm0udXNlci5hdmF0YXIgPSAndXBsb2Fkcy9hdmF0YXJzLycgKyB2bS51c2VyLmF2YXRhclxuXG4gICAgICB2bS51c2VyLmJkYXkgPSBtb21lbnQobmV3IERhdGUodm0udXNlci5iZGF5KSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLnVwZGF0ZVBvaW50cyA9ICgpIC0+XG4gICAgJGh0dHAucHV0KCcvYXBpL3Byb2ZpbGUvdXBkYXRlcG9pbnRzJywgdm0ucG9pbnRzKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnUG9pbnRzIHVwZGF0ZWQhJ1xuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4UHJvZmlsZUN0cmwnLCBJbmRleFByb2ZpbGVDdHJsKSIsIkNyZWF0ZVJvdXRlQ3RybCA9ICgkaHR0cCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0ucG9pbnRGb3JtcyA9IFtdXG5cbiAgJGh0dHAucG9zdCgnL2FwaS9yb3V0ZXMvZ2V0VXNlcnNBbmRTdG9yZXMnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLmNyZWF0ZVJvdXRlID0gKCkgLT5cbiAgICBjb25zb2xlLmxvZyh2bS5kYXRlKVxuXG4gICAgdm0ucm91dGUgPVxuICAgICAgdXNlcl9pZDogdm0udXNlcl9pZFxuICAgICAgZGF0ZTogdm0uZGF0ZVxuICAgICAgcG9pbnRzOiB2bS5wb2ludEZvcm1zXG5cbiAgICAkaHR0cC5wb3N0KCcvYXBpL3JvdXRlcycsIHZtLnJvdXRlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICB2bS5kYXRhID0gcmVzcG9uc2UuZGF0YVxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHJvdXRlIGhhcyBiZWVuIGFkZGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcik7XG5cbiAgICByZXR1cm5cblxuICB2bS5hZGRQb2ludCA9ICgpIC0+XG4gICAgdm0ucG9pbnRGb3Jtcy5wdXNoKHt9KVxuXG4gIHZtLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgIHZtLnBvaW50Rm9ybXMuc3BsaWNlKGluZGV4LCAxKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVJvdXRlQ3RybCcsIENyZWF0ZVJvdXRlQ3RybCkiLCJFZGl0Um91dGVDdHJsID0gKCRodHRwLCAkc3RhdGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG4gIHZtLmNvdW50ID0gMVxuXG4gICRodHRwLmdldCgnL2FwaS9yb3V0ZXMvZWRpdC8nKyB2bS5pZClcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgICByZXR1cm5cbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLnVwZGF0ZSA9ICgpIC0+XG4gICAgcm91dGUgPVxuICAgICAgdXNlcl9pZDogdm0ub2JqLnVzZXJfaWRcbiAgICAgIGRhdGU6IHZtLm9iai5kYXRlXG4gICAgICBwb2ludHM6IHZtLm9iai5wb2ludHNcblxuICAgICRodHRwLnBhdGNoKCcvYXBpL3JvdXRlcy8nICsgdm0uaWQsIHJvdXRlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnUm91dGUgVXBkYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpXG5cblxuICB2bS5hZGRQb2ludCA9ICgpIC0+XG4gICAgdm0ub2JqLnBvaW50cy5wdXNoKHtcbiAgICAgIGlkOiB2bS5jb3VudCArICdfbmV3J1xuICAgIH0pXG4gICAgdm0uY291bnQrK1xuICAgIHJldHVyblxuXG4gIHZtLnJlbW92ZVBvaW50ID0gKGluZGV4KSAtPlxuICAgIHZtLm9iai5wb2ludHMuc3BsaWNlKGluZGV4LCAxKVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0VkaXRSb3V0ZUN0cmwnLCBFZGl0Um91dGVDdHJsKSIsIkluZGV4Um91dGVDdHJsID0gKCRodHRwLCAkZmlsdGVyLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL3JvdXRlcydcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuXG4gICMgRmxhc2ggZnJvbSBvdGhlcnMgcGFnZXNcbiAgaWYgJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuICAgIHZtLmZsYXNoU3VjY2VzcyA9ICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcblxuICAkaHR0cC5nZXQoJy9hcGkvcm91dGVzJykudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0ucm91dGVzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAgIHJldHVyblxuICApXG5cbiAgdm0uc29ydEJ5ID0gKHByZWRpY2F0ZSkgLT5cbiAgICB2bS5zb3J0UmV2ZXJzZSA9ICF2bS5zb3J0UmV2ZXJzZVxuICAgICQoJy5zb3J0LWxpbmsnKS5lYWNoICgpIC0+XG4gICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3NvcnQtbGluayBjLXAnKVxuXG4gICAgaWYgdm0uc29ydFJldmVyc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1hc2MnKS5hZGRDbGFzcygnYWN0aXZlLWRlc2MnKVxuICAgIGVsc2VcbiAgICAgICQoJyMnK3ByZWRpY2F0ZSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1kZXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1hc2MnKVxuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5yb3V0ZXMgPSBvcmRlckJ5KHZtLnJvdXRlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlUm91dGUgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvcm91dGVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAjIERlbGV0ZSBmcm9tIHNjb3BlXG4gICAgICAgIHZtLnJvdXRlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdSb3V0ZSBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4Um91dGVDdHJsJywgSW5kZXhSb3V0ZUN0cmwpIiwiU2hvd1JvdXRlQ3RybCA9ICgkaHR0cCwgJHN0YXRlUGFyYW1zLCAkdGltZW91dCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnO1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIEdldCBwb2ludHNcbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcy8nICsgdm0uaWQpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ucm91dGUgPSByZXNwb25zZS5kYXRhLnJvdXRlXG4gICAgICB2bS5zdG9yZXMgPSByZXNwb25zZS5kYXRhLnN0b3Jlc1xuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YS5wb2ludHNcbiAgICAgIHZtLnJvdXRlLmRhdGUgPSBtb21lbnQobmV3IERhdGUodm0ucm91dGUuZGF0ZSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcblxuICB2bS5kZWxldGVSb3V0ZSA9IChpZCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCcvYXBpL3JvdXRlcy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdyb3V0ZXMnLCB7IGZsYXNoU3VjY2VzczogJ1JvdXRlIERlbGV0ZWQhJyB9XG5cbiAgICAgICAgcmV0dXJuXG4gICAgICApLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3JcblxuICAjIFdoZW4gdGhlIHdpbmRvdyBoYXMgZmluaXNoZWQgbG9hZGluZyBjcmVhdGUgb3VyIGdvb2dsZSBtYXAgYmVsb3dcbiAgaW5pdE1hcCA9IC0+XG4gICAgIyBCYXNpYyBvcHRpb25zIGZvciBhIHNpbXBsZSBHb29nbGUgTWFwXG4gICAgbWFwT3B0aW9ucyA9XG4gICAgICB6b29tOiAxMlxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2VcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczogcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTVxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTAwMTUyLCAtMC4xMjYyMzYpXG4gICAgICBzdHlsZXM6dm0uc3R5bGVzXG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JvdXRlLW1hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlO1xuXG4gICAgIyBTZXQgbG9jYXRpb25zXG4gICAgYW5ndWxhci5mb3JFYWNoKHZtLnBvaW50cywgKHZhbHVlLCBrZXkpIC0+XG4gICAgICBhZGRyZXNzID0gdmFsdWUuc3RvcmUuYWRkcmVzc1xuICAgICAgIyBHZW9jb2RlIEFkZHJlc3NlcyBieSBhZGRyZXNzIG5hbWVcbiAgICAgIGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmNhZ2VkYXRhLmNvbS9nZW9jb2RlL3YxL2pzb24/cT1cIithZGRyZXNzK1wiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleTtcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICByZXEub25sb2FkID0gKCkgLT5cbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHBvc2l0aW9uID0gcmVzcG9uc2UucmVzdWx0c1swXS5nZW9tZXRyeVxuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMClcbiAgICAgICAgICAgIGNvbnRlbnRTdHJpbmcgPSAnPGRpdiBjbGFzcz1cIm1hcmtlci1jb250ZW50XCI+JyArIHZhbHVlLnN0b3JlLmFkZHJlc3MgKyAnPC9kaXY+J1xuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZykgIyBwb3B1cFxuXG4gICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWVcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIC0+XG4gICAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuICAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpO1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICApXG4gICAgcmV0dXJuXG5cbiAgdm0uc3R5bGVzID0gW1xuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd3YXRlcidcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZTllOWU5JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2xhbmRzY2FwZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZjVmNWY1JyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuaGlnaHdheSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDI5IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMC4yIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQuYXJ0ZXJpYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmxvY2FsJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjEgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncG9pLnBhcmsnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2RlZGVkZScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMudGV4dC5zdHJva2UnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAndmlzaWJpbGl0eSc6ICdvbicgfVxuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE2IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnc2F0dXJhdGlvbic6IDM2IH1cbiAgICAgICAgeyAnY29sb3InOiAnIzMzMzMzMycgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiA0MCB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdlbGVtZW50VHlwZSc6ICdsYWJlbHMuaWNvbidcbiAgICAgICdzdHlsZXJzJzogWyB7ICd2aXNpYmlsaXR5JzogJ29mZicgfSBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICd0cmFuc2l0J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmMmYyZjInIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTkgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ2FkbWluaXN0cmF0aXZlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmVmZWZlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE3IH1cbiAgICAgICAgeyAnd2VpZ2h0JzogMS4yIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxuICAjIEdvIHRvIHBvaW50IGFmdGVyIGNsaWNrIG91dHNpZGUgbWFwIGxpbmtcbiAgdm0uZ29Ub1BvaW50ID0gKGlkKSAtPlxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIodm0ubWFya2Vyc1tpZF0sICdjbGljaycpXG5cbiAgIyBJbml0IG1hcFxuICAkdGltZW91dCAoKCktPlxuICAgIGluaXRNYXAoKVxuICAgIHJldHVyblxuICApLCA1MDBcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaG93Um91dGVDdHJsJywgU2hvd1JvdXRlQ3RybCkiLCJDcmVhdGVTdG9yZUN0cmwgPSAoJHNjb3BlLCAkaHR0cCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5jcmVhdGUgPSAoKSAtPlxuICAgIHN0b3JlID1cbiAgICAgIG5hbWU6IHZtLnN0b3JlTmFtZVxuICAgICAgb3duZXJfbmFtZTogdm0ub3duZXJOYW1lXG4gICAgICBhZGRyZXNzOiB2bS5hZGRyZXNzXG4gICAgICBwaG9uZTogdm0ucGhvbmVcbiAgICAgIGVtYWlsOiB2bS5lbWFpbFxuXG4gICAgJGh0dHAucG9zdCgnL2FwaS9zdG9yZXMnLCBzdG9yZSlcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdzdG9yZXMnLCB7IGZsYXNoU3VjY2VzczogJ05ldyBzdG9yZSBjcmVhdGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gICRzY29wZS5nZXRMb2NhdGlvbiA9IChhZGRyZXNzKSAtPlxuICAgICRodHRwLmdldCgnLy9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbicsXG4gICAgICBwYXJhbXM6XG4gICAgICAgIGFkZHJlc3M6IGFkZHJlc3NcbiAgICAgICAgbGFuZ3VhZ2U6ICdlbidcbiAgICAgICAgY29tcG9uZW50czogJ2NvdW50cnk6VUt8YWRtaW5pc3RyYXRpdmVfYXJlYTpMb25kb24nXG4gICAgICBza2lwQXV0aG9yaXphdGlvbjogdHJ1ZSAjIGZvciBlcnJvZSBvZiAuLiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXG4gICAgKS50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHJlc3BvbnNlLmRhdGEucmVzdWx0cy5tYXAgKGl0ZW0pIC0+XG4gICAgICAgIGl0ZW0uZm9ybWF0dGVkX2FkZHJlc3NcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdDcmVhdGVTdG9yZUN0cmwnLCBDcmVhdGVTdG9yZUN0cmwpIiwiRWRpdFN0b3JlQ3RybCA9ICgkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5kYXRhLm5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLmRhdGEub3duZXJfbmFtZVxuICAgICAgYWRkcmVzczogdm0uZGF0YS5hZGRyZXNzXG4gICAgICBwaG9uZTogdm0uZGF0YS5waG9uZVxuICAgICAgZW1haWw6IHZtLmRhdGEuZW1haWxcblxuICAgICRodHRwLnBhdGNoKCcvYXBpL3N0b3Jlcy8nICsgdm0uaWQsIHN0b3JlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgVXBkYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFN0b3JlQ3RybCcsIEVkaXRTdG9yZUN0cmwpIiwiSW5kZXhTdG9yZUN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvc3RvcmVzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBGbGFzaCBmcm9tIG90aGVycyBwYWdlc1xuICBpZiAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG4gICAgdm0uZmxhc2hTdWNjZXNzID0gJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuXG4gICRodHRwLmdldCgnYXBpL3N0b3JlcycpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLnN0b3JlcyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpO1xuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5zdG9yZXMgPSBvcmRlckJ5KHZtLnN0b3JlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlU3RvcmUgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvc3RvcmVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAjIERlbGV0ZSBmcm9tIHNjb3BlXG4gICAgICAgIHZtLnN0b3Jlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdTdG9yZSBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleFN0b3JlQ3RybCcsIEluZGV4U3RvcmVDdHJsKSIsIlNob3dTdG9yZUN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAkaHR0cC5nZXQoJ2FwaS9zdG9yZXMvJyt2bS5pZCkudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uZGF0YSA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCdhcGkvc3RvcmVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgZGVsZXRlZCEnIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICApXG5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1N0b3JlQ3RybCcsIFNob3dTdG9yZUN0cmwpIiwiQ29uZmlybUNvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmRhdGEgPVxuICAgIGNvbmZpcm1hdGlvbl9jb2RlOiAkc3RhdGVQYXJhbXMuY29uZmlybWF0aW9uX2NvZGVcblxuICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL2NvbmZpcm0nLCB2bS5kYXRhKS5zdWNjZXNzKChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykgLT5cbiAgICAjIFNhdmUgdG9rZW5cbiAgICAkYXV0aC5zZXRUb2tlbihkYXRhLnRva2VuKVxuXG4gICAgIyBTYXZlIHVzZXIgaW4gbG9jYWxTdG9yYWdlXG4gICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3VzZXInLCB1c2VyXG4gICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZVxuICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBkYXRhXG5cbiAgICAkc3RhdGUuZ28gJy8nXG4gICkuZXJyb3IgKGRhdGEsIHN0YXR1cywgaGVhZGVyLCBjb25maWcpIC0+XG4gICAgJHN0YXRlLmdvICdzaWduX2luJ1xuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NvbmZpcm1Db250cm9sbGVyJywgQ29uZmlybUNvbnRyb2xsZXIpIiwiRm9yZ290UGFzc3dvcmRDb250cm9sbGVyID0gKCRodHRwKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5yZXN0b3JlUGFzc3dvcmQgPSAoKS0+XG4gICAgdm0uc3Bpbm5lckRvbmUgPSB0cnVlXG4gICAgZGF0YSA9XG4gICAgICBlbWFpbDogdm0uZW1haWxcblxuICAgICRodHRwLnBvc3QoJ2FwaS9hdXRoZW50aWNhdGUvc2VuZF9yZXNldF9jb2RlJywgZGF0YSkuc3VjY2VzcygoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgICBpZihkYXRhKVxuICAgICAgICB2bS5zdWNjZXNzU2VuZGluZ0VtYWlsID0gdHJ1ZVxuICAgICkuZXJyb3IgKGVycm9yLCBzdGF0dXMsIGhlYWRlciwgY29uZmlnKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdGb3Jnb3RQYXNzd29yZENvbnRyb2xsZXInLCBGb3Jnb3RQYXNzd29yZENvbnRyb2xsZXIpIiwiUmVzZXRQYXNzd29yZENvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLm1pbmxlbmd0aCA9IDhcblxuICB2bS5yZXN0b3JlUGFzc3dvcmQgPSAoZm9ybSkgLT5cbiAgICBkYXRhID0ge1xuICAgICAgcmVzZXRfcGFzc3dvcmRfY29kZTogJHN0YXRlUGFyYW1zLnJlc2V0X3Bhc3N3b3JkX2NvZGVcbiAgICAgIHBhc3N3b3JkOiB2bS5wYXNzd29yZFxuICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiB2bS5wYXNzd29yZF9jb25maXJtYXRpb25cbiAgICB9XG5cbiAgICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL3Jlc2V0X3Bhc3N3b3JkJywgZGF0YSkuc3VjY2VzcygoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG4gICAgICBpZihkYXRhKVxuICAgICAgICB2bS5zdWNjZXNzUmVzdG9yZVBhc3N3b3JkID0gdHJ1ZVxuICAgICkuZXJyb3IgKGVycm9yLCBzdGF0dXMsIGhlYWRlciwgY29uZmlnKSAtPlxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdSZXNldFBhc3N3b3JkQ29udHJvbGxlcicsIFJlc2V0UGFzc3dvcmRDb250cm9sbGVyKSIsIlNpZ25JbkNvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSwgJGh0dHAsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gIHZtLmxvZ2luID0gKCkgLT5cbiAgICBjcmVkZW50aWFscyA9XG4gICAgICBlbWFpbDogdm0uZW1haWxcbiAgICAgIHBhc3N3b3JkOiB2bS5wYXNzd29yZFxuXG4gICAgJGF1dGgubG9naW4oY3JlZGVudGlhbHMpLnRoZW4gKC0+XG4gICAgICAjIFJldHVybiBhbiAkaHR0cCByZXF1ZXN0IGZvciB0aGUgbm93IGF1dGhlbnRpY2F0ZWRcbiAgICAgICMgdXNlciBzbyB0aGF0IHdlIGNhbiBmbGF0dGVuIHRoZSBwcm9taXNlIGNoYWluXG4gICAgICAkaHR0cC5nZXQoJ2FwaS9hdXRoZW50aWNhdGUvZ2V0X3VzZXInKS50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmRhdGEudXNlcilcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3VzZXInLCB1c2VyXG4gICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGEudXNlclxuXG4gICAgICAgICRzdGF0ZS5nbyAnLydcbiAgICAgICAgcmV0dXJuXG4gICAgKSwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcik7XG4gICAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2lnbkluQ29udHJvbGxlcicsIFNpZ25JbkNvbnRyb2xsZXIpIiwiU2lnblVwQ29udHJvbGxlciA9ICgkYXV0aCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5yZWdpc3RlciA9ICgpLT5cbiAgICB2bS5zcGlubmVyRG9uZSA9IHRydWVcbiAgICBpZiB2bS51c2VyXG4gICAgICBjcmVkZW50aWFscyA9XG4gICAgICAgIG5hbWU6IHZtLnVzZXIubmFtZVxuICAgICAgICBlbWFpbDogdm0udXNlci5lbWFpbFxuICAgICAgICBwYXNzd29yZDogdm0udXNlci5wYXNzd29yZFxuICAgICAgICBwYXNzd29yZF9jb25maXJtYXRpb246IHZtLnVzZXIucGFzc3dvcmRfY29uZmlybWF0aW9uXG5cbiAgICAkYXV0aC5zaWdudXAoY3JlZGVudGlhbHMpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgICAgJHN0YXRlLmdvICdzaWduX3VwX3N1Y2Nlc3MnXG4gICAgICByZXR1cm5cbiAgICApLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1NpZ25VcENvbnRyb2xsZXInLCBTaWduVXBDb250cm9sbGVyKSIsIlVzZXJDb250cm9sbGVyID0gKCRodHRwLCAkc3RhdGUsICRhdXRoLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5nZXRVc2VycyA9IC0+XG4gICAgIyBUaGlzIHJlcXVlc3Qgd2lsbCBoaXQgdGhlIGluZGV4IG1ldGhvZCBpbiB0aGUgQXV0aGVudGljYXRlQ29udHJvbGxlclxuICAgICMgb24gdGhlIExhcmF2ZWwgc2lkZSBhbmQgd2lsbCByZXR1cm4gdGhlIGxpc3Qgb2YgdXNlcnNcbiAgICAkaHR0cC5nZXQoJ2FwaS9hdXRoZW50aWNhdGUnKS5zdWNjZXNzKCh1c2VycykgLT5cbiAgICAgIHZtLnVzZXJzID0gdXNlcnNcbiAgICAgIHJldHVyblxuICAgICkuZXJyb3IgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgdm0ubG9nb3V0ID0gLT5cbiAgICAkYXV0aC5sb2dvdXQoKS50aGVuIC0+XG4gICAgICAjIFJlbW92ZSB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGZyb20gbG9jYWwgc3RvcmFnZVxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0gJ3VzZXInXG4gICAgICAjIEZsaXAgYXV0aGVudGljYXRlZCB0byBmYWxzZSBzbyB0aGF0IHdlIG5vIGxvbmdlclxuICAgICAgIyBzaG93IFVJIGVsZW1lbnRzIGRlcGVuZGFudCBvbiB0aGUgdXNlciBiZWluZyBsb2dnZWQgaW5cbiAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IGZhbHNlXG4gICAgICAjIFJlbW92ZSB0aGUgY3VycmVudCB1c2VyIGluZm8gZnJvbSByb290c2NvcGVcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsXG4gICAgICAkc3RhdGUuZ28gJ3NpZ25faW4nXG4gICAgICByZXR1cm5cbiAgICByZXR1cm5cblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdVc2VyQ29udHJvbGxlcicsIFVzZXJDb250cm9sbGVyKSIsIkNyZWF0ZVVzZXJDdHJsID0gKCRodHRwLCAkc3RhdGUsIFVwbG9hZCwgbG9kYXNoKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXohQCMkJV4mKigpLSs8PkFCQ0RFRkdISUpLTE1OT1AxMjM0NTY3ODkwJ1xuXG4gICRodHRwLmdldCgnL2FwaS91c2Vycy9jcmVhdGUnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLmVudW1zID0gcmVzcG9uc2UuZGF0YVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0uYWRkVXNlciA9ICgpIC0+XG4gICAgdm0uZGF0YSA9XG4gICAgICBuYW1lOiB2bS5uYW1lXG4gICAgICBsYXN0X25hbWU6IHZtLmxhc3RfbmFtZVxuICAgICAgaW5pdGlhbHM6IHZtLmluaXRpYWxzXG4gICAgICBhdmF0YXI6IHZtLmF2YXRhclxuICAgICAgYmRheTogdm0uYmRheVxuICAgICAgam9iX3RpdGxlOiB2bS5qb2JfdGl0bGVcbiAgICAgIHVzZXJfZ3JvdXA6IHZtLnVzZXJfZ3JvdXBcbiAgICAgIGNvdW50cnk6IHZtLmNvdW50cnlcbiAgICAgIGNpdHk6IHZtLmNpdHlcbiAgICAgIHBob25lOiB2bS5waG9uZVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcblxuICAgIFVwbG9hZC51cGxvYWQoXG4gICAgICB1cmw6ICcvYXBpL3VzZXJzJ1xuICAgICAgbWV0aG9kOiAnUG9zdCdcbiAgICAgIGRhdGE6IHZtLmRhdGFcbiAgICApLnRoZW4gKChyZXNwKSAtPlxuICAgICAgJHN0YXRlLmdvICd1c2VycycsIHsgZmxhc2hTdWNjZXNzOiAnTmV3IHVzZXIgaGFzIGJlZW4gYWRkZWQhJyB9XG4gICAgICByZXR1cm5cbiAgICApLCAoKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICByZXR1cm5cbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5nZW5lcmF0ZVBhc3MgPSAoKSAtPlxuICAgIHZtLnBhc3N3b3JkID0gJydcbiAgICBwYXNzTGVuZ3RoID0gbG9kYXNoLnJhbmRvbSg4LDE1KVxuICAgIHggPSAwXG5cbiAgICB3aGlsZSB4IDwgcGFzc0xlbmd0aFxuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZtLmNoYXJzLmxlbmd0aClcbiAgICAgIHZtLnBhc3N3b3JkICs9IHZtLmNoYXJzLmNoYXJBdChpKVxuICAgICAgeCsrXG4gICAgcmV0dXJuIHZtLnBhc3N3b3JkXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlVXNlckN0cmwnLCBDcmVhdGVVc2VyQ3RybCkiLCJJbmRleFVzZXJDdHJsID0gKCRodHRwLCAkZmlsdGVyLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5zb3J0UmV2ZXJzZSA9IG51bGxcbiAgdm0ucGFnaUFwaVVybCA9ICcvYXBpL3VzZXJzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG4gICMgRmxhc2ggZnJvbSBvdGhlcnMgcGFnZXNcbiAgaWYgJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuICAgIHZtLmZsYXNoU3VjY2VzcyA9ICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcblxuICAkaHR0cC5nZXQoJ2FwaS91c2VycycpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLnVzZXJzID0gcmVzcG9uc2UuZGF0YS5kYXRhXG4gICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgIHJldHVyblxuICAsIChlcnJvcikgLT5cbiAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICByZXR1cm5cbiAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJyk7XG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnVzZXJzID0gb3JkZXJCeSh2bS51c2VycywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlVXNlciA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS91c2Vycy8nICsgaWQpLnRoZW4gKChyZXNwb25zZSkgLT5cbiAgICAgICAgIyBEZWxldGUgZnJvbSBzY29wZVxuICAgICAgICB2bS51c2Vycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdVc2VyIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhVc2VyQ3RybCcsIEluZGV4VXNlckN0cmwpXG4iLCJTaG93VXNlckN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcbiAgdm0uc2V0dGluZ3MgPVxuICAgIGxpbmVXaWR0aDogNSxcbiAgICB0cmFja0NvbG9yOiAnI2U4ZWZmMCcsXG4gICAgYmFyQ29sb3I6ICcjMjdjMjRjJyxcbiAgICBzY2FsZUNvbG9yOiBmYWxzZSxcbiAgICBjb2xvcjogJyMzYTNmNTEnLFxuICAgIHNpemU6IDEzNCxcbiAgICBsaW5lQ2FwOiAnYnV0dCcsXG4gICAgcm90YXRlOiAtOTAsXG4gICAgYW5pbWF0ZTogMTAwMFxuXG4gICRodHRwLmdldCgnYXBpL3VzZXJzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICBpZiB2bS5vYmouYXZhdGFyID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICB2bS5vYmouYXZhdGFyID0gJy9pbWFnZXMvJyArIHZtLm9iai5hdmF0YXJcbiAgICBlbHNlXG4gICAgICB2bS5vYmouYXZhdGFyID0gJ3VwbG9hZHMvYXZhdGFycy8nICsgdm0ub2JqLmF2YXRhclxuICAgIHZtLm9iai5iZGF5ID0gbW9tZW50KG5ldyBEYXRlKHZtLm9iai5iZGF5KSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaG93VXNlckN0cmwnLCBTaG93VXNlckN0cmwpIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
