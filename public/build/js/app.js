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
  $timeout(function() {
    $rootScope.currentState = $state.current.name;
    if (!$auth.isAuthenticated() && publicRoutes.indexOf($rootScope.currentState) === -1) {
      return $location.path('user/sign_in');
    }
  });
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

  /*  MAP */
  $http({
    method: 'GET',
    url: '/api/home/getpoints'
  }).then((function(response) {
    vm.points = response.data;
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
  $timeout((function() {
    initMap();
  }), 500);
};

'use strict';

angular.module('app').controller('IndexHomeCtrl', IndexHomeCtrl);

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
  $timeout((function() {
    initMap();
  }), 500);
};

'use strict';

angular.module('app').controller('IndexMapCtrl', IndexMapCtrl);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJkaXJlY3RpdmVzL2NoZWNrYm94X2ZpZWxkLmNvZmZlZSIsImRpcmVjdGl2ZXMvZGF0ZXRpbWVwaWNrZXIuY29mZmVlIiwiZGlyZWN0aXZlcy9kZWxldGVfYXZhdGFyLmNvZmZlZSIsImRpcmVjdGl2ZXMvZmlsZV9maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3BhZ2luYXRpb24uY29mZmVlIiwiZGlyZWN0aXZlcy9yYWRpb19maWVsZC5jb2ZmZWUiLCJkaXJlY3RpdmVzL3RpbWVwaWNrZXIuY29mZmVlIiwiY29udHJvbGxlcnMvaG9tZS9pbmRleF9ob21lX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcHJvZmlsZS9lZGl0X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9wcm9maWxlL2luZGV4X3Byb2ZpbGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9tYXAvaW5kZXhfbWFwX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvc3RvcmVzL2NyZWF0ZV9zdG9yZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3N0b3Jlcy9lZGl0X3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvc3RvcmVzL2luZGV4X3N0b3JlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvc3RvcmVzL3Nob3dfc3RvcmVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvY3JlYXRlX3JvdXRlX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvcm91dGVzL2VkaXRfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvaW5kZXhfcm91dGVfY3RybC5jb2ZmZWUiLCJjb250cm9sbGVycy9yb3V0ZXMvc2hvd19yb3V0ZV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvY29uZmlybV9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvZm9yZ290X3Bhc3N3b3JkX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlci9yZXNldF9wYXNzd29yZF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvc2lnbl9pbl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvc2lnbl91cF9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXIvdXNlcl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXJzL2NyZWF0ZV91c2VyX2N0cmwuY29mZmVlIiwiY29udHJvbGxlcnMvdXNlcnMvaW5kZXhfdXNlcl9jdHJsLmNvZmZlZSIsImNvbnRyb2xsZXJzL3VzZXJzL3Nob3dfdXNlcl9jdHJsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUVBLE9BQ0UsQ0FBQyxNQURILENBQ1UsS0FEVixFQUNpQixDQUNiLFdBRGEsRUFFYixZQUZhLEVBR2IsY0FIYSxFQUliLFVBSmEsRUFLYixRQUxhLEVBTWIsZUFOYSxFQU9iLGNBUGEsRUFRYixjQVJhLENBRGpCLENBVUksQ0FBQyxNQVZMLENBVVksU0FBQyxjQUFELEVBQWlCLGtCQUFqQixFQUFxQyxhQUFyQyxFQUFvRCxpQkFBcEQ7RUFDUixpQkFBaUIsQ0FBQyxTQUFsQixDQUE0QixJQUE1QjtFQUlBLGFBQWEsQ0FBQyxRQUFkLEdBQXlCO0VBQ3pCLGFBQWEsQ0FBQyxTQUFkLEdBQTBCO0VBQzFCLGtCQUFrQixDQUFDLFNBQW5CLENBQTZCLGVBQTdCO0VBRUEsY0FDRSxDQUFDLEtBREgsQ0FDUyxHQURULEVBRUk7SUFBQSxHQUFBLEVBQUssR0FBTDtJQUNBLFdBQUEsRUFBYSwwQkFEYjtJQUVBLFVBQUEsRUFBWSx1QkFGWjtHQUZKLENBUUUsQ0FBQyxLQVJILENBUVMsU0FSVCxFQVNJO0lBQUEsR0FBQSxFQUFLLGVBQUw7SUFDQSxXQUFBLEVBQWEsNEJBRGI7SUFFQSxVQUFBLEVBQVksMEJBRlo7R0FUSixDQWFFLENBQUMsS0FiSCxDQWFTLFNBYlQsRUFjSTtJQUFBLEdBQUEsRUFBSyxlQUFMO0lBQ0EsV0FBQSxFQUFhLDRCQURiO0lBRUEsVUFBQSxF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QUNqQyxFQUFFLENBQUMsR0FBSCxHQUFTLFFBQVEsQ0FBQztJQUNsQixJQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBUCxLQUFpQixvQkFBcEI7TUFDRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQVAsR0FBZ0IsVUFBQSxHQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FEdEM7S0FBQSxNQUFBO01BR0UsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFQLEdBQWdCLGtCQUFBLEdBQXFCLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FIOUM7O0lBSUEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFQLEdBQWMsTUFBQSxDQUFXLElBQUEsSUFBQSxDQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBWixDQUFYLENBQTZCLENBQUMsTUFBOUIsQ0FBcUMsWUFBckM7RUFObUIsQ0FBbkMsRUFRRSxTQUFDLEtBQUQ7SUFDQSxFQUFFLENBQUMsS0FBSCxHQUFXLEtBQUssQ0FBQztFQURqQixDQVJGO0FBZGE7O0FBNkJmOztBQUNBLE9BQ0UsQ0FBQyxNQURILENBQ1UsS0FEVixDQUVFLENBQUMsVUFGSCxDQUVjLGNBRmQsRUFFOEIsWUFGOUIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJywgW1xuICAgICd1aS5yb3V0ZXInXG4gICAgJ3NhdGVsbGl6ZXInXG4gICAgXCJ1aS5ib290c3RyYXBcIlxuICAgIFwibmdMb2Rhc2hcIlxuICAgIFwibmdNYXNrXCJcbiAgICBcImFuZ3VsYXJNb21lbnRcIlxuICAgIFwiZWFzeXBpZWNoYXJ0XCJcbiAgICBcIm5nRmlsZVVwbG9hZFwiXG4gIF0pLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGF1dGhQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIC0+XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlIHRydWVcblxuICAgICMgU2F0ZWxsaXplciBjb25maWd1cmF0aW9uIHRoYXQgc3BlY2lmaWVzIHdoaWNoIEFQSVxuICAgICMgcm91dGUgdGhlIEpXVCBzaG91bGQgYmUgcmV0cmlldmVkIGZyb21cbiAgICAkYXV0aFByb3ZpZGVyLmxvZ2luVXJsID0gJy9hcGkvYXV0aGVudGljYXRlJ1xuICAgICRhdXRoUHJvdmlkZXIuc2lnbnVwVXJsID0gJy9hcGkvYXV0aGVudGljYXRlL3JlZ2lzdGVyJ1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UgJy91c2VyL3NpZ25faW4nXG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCcvJyxcbiAgICAgICAgdXJsOiAnLydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9wYWdlcy9ob21lLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleEhvbWVDdHJsIGFzIGhvbWUnXG4gICAgICApXG5cbiAgICAgICMgVVNFUlxuICAgICAgLnN0YXRlKCdzaWduX2luJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvc2lnbl9pbidcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2VyL3NpZ25faW4uaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25JbkNvbnRyb2xsZXIgYXMgYXV0aCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc2lnbl91cCcsXG4gICAgICAgIHVybDogJy91c2VyL3NpZ25fdXAnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9zaWduX3VwLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDb250cm9sbGVyIGFzIHJlZ2lzdGVyJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzaWduX3VwX3N1Y2Nlc3MnLFxuICAgICAgICB1cmw6ICcvdXNlci9zaWduX3VwX3N1Y2Nlc3MnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9zaWduX3VwX3N1Y2Nlc3MuaHRtbCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnZm9yZ290X3Bhc3N3b3JkJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvZm9yZ290X3Bhc3N3b3JkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXIvZm9yZ290X3Bhc3N3b3JkLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGb3Jnb3RQYXNzd29yZENvbnRyb2xsZXIgYXMgZm9yZ290UGFzc3dvcmQnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3Jlc2V0X3Bhc3N3b3JkJyxcbiAgICAgICAgdXJsOiAnL3VzZXIvcmVzZXRfcGFzc3dvcmQvOnJlc2V0X3Bhc3N3b3JkX2NvZGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlci9yZXNldF9wYXNzd29yZC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnUmVzZXRQYXNzd29yZENvbnRyb2xsZXIgYXMgcmVzZXRQYXNzd29yZCdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnY29uZmlybScsXG4gICAgICAgIHVybDogJy91c2VyL2NvbmZpcm0vOmNvbmZpcm1hdGlvbl9jb2RlJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ29uZmlybUNvbnRyb2xsZXInXG4gICAgICApXG5cbiAgICAgICMgUHJvZmlsZVxuICAgICAgLnN0YXRlKCdwcm9maWxlJyxcbiAgICAgICAgdXJsOiAnL3Byb2ZpbGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvcHJvZmlsZS9pbmRleC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnSW5kZXhQcm9maWxlQ3RybCBhcyBwcm9maWxlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdwcm9maWxlX2VkaXQnLFxuICAgICAgICB1cmw6ICcvcHJvZmlsZS9lZGl0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3Byb2ZpbGUvZWRpdC5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnRWRpdFByb2ZpbGVDdHJsIGFzIHByb2ZpbGUnXG4gICAgICApXG5cbiAgICAgICMgU3RvcmVzXG4gICAgICAuc3RhdGUoJ3N0b3JlcycsXG4gICAgICAgIHVybDogJy9zdG9yZXMnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvc3RvcmVzL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFN0b3JlQ3RybCBhcyBzdG9yZXMnXG4gICAgICAgIHBhcmFtczpcbiAgICAgICAgICBmbGFzaFN1Y2Nlc3M6IG51bGxcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc3RvcmVzX2NyZWF0ZScsXG4gICAgICAgIHVybDogJy9zdG9yZXMvY3JlYXRlJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9jcmVhdGUuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVN0b3JlQ3RybCBhcyBzdG9yZSdcbiAgICAgIClcbiAgICAgIC5zdGF0ZSgnc3RvcmVzX2VkaXQnLFxuICAgICAgICB1cmw6ICcvc3RvcmVzLzppZC9lZGl0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9lZGl0Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0U3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdzdG9yZXNfc2hvdycsXG4gICAgICAgIHVybDogJy9zdG9yZXMvOmlkJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3N0b3Jlcy9zaG93Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaG93U3RvcmVDdHJsIGFzIHN0b3JlJ1xuICAgICAgKVxuXG4gICAgICAjIFVzZXJzXG4gICAgICAuc3RhdGUoJ3VzZXJzJyxcbiAgICAgICAgdXJsOiAnL3VzZXJzJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL3ZpZXdzL3VzZXJzL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleFVzZXJDdHJsIGFzIHVzZXJzJ1xuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgZmxhc2hTdWNjZXNzOiBudWxsXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3VzZXJzX2NyZWF0ZScsXG4gICAgICAgIHVybDogJy91c2Vycy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvdXNlcnMvY3JlYXRlLmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVVc2VyQ3RybCBhcyB1c2VyJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCd1c2Vyc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3VzZXJzLzppZCdcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy91c2Vycy9zaG93Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaG93VXNlckN0cmwgYXMgdXNlcidcbiAgICAgIClcblxuICAgICAgIyBSb3V0ZXNcbiAgICAgIC5zdGF0ZSgncm91dGVzJyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcydcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi92aWV3cy9yb3V0ZXMvaW5kZXguaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0luZGV4Um91dGVDdHJsIGFzIHJvdXRlcydcbiAgICAgICAgcGFyYW1zOlxuICAgICAgICAgIGZsYXNoU3VjY2VzczogbnVsbFxuICAgICAgKVxuICAgICAgLnN0YXRlKCdyb3V0ZXNfY3JlYXRlJyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy9jcmVhdGUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL2NyZWF0ZS5odG1sJ1xuICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlUm91dGVDdHJsIGFzIHJvdXRlJ1xuICAgICAgKVxuICAgICAgLnN0YXRlKCdyb3V0ZXNfZWRpdCcsXG4gICAgICAgIHVybDogJy9yb3V0ZXMvOmlkL2VkaXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL2VkaXQuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ0VkaXRSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG4gICAgICAuc3RhdGUoJ3JvdXRlc19zaG93JyxcbiAgICAgICAgdXJsOiAnL3JvdXRlcy86aWQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3Mvcm91dGVzL3Nob3cuaHRtbCdcbiAgICAgICAgY29udHJvbGxlcjogJ1Nob3dSb3V0ZUN0cmwgYXMgcm91dGUnXG4gICAgICApXG5cbiAgICAgICMgTWFwXG4gICAgICAuc3RhdGUoJ21hcCcsXG4gICAgICAgIHVybDogJy9tYXAnXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdmlld3MvbWFwL2luZGV4Lmh0bWwnXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbmRleE1hcEN0cmwgYXMgbWFwJ1xuICAgICAgKVxuXG4gICAgcmV0dXJuXG4gICkucnVuICgkcSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgJGxvY2F0aW9uLCAkdGltZW91dCkgLT5cbiAgICBwdWJsaWNSb3V0ZXMgPSBbXG4gICAgICAnc2lnbl91cCdcbiAgICAgICdjb25maXJtJ1xuICAgICAgJ2ZvcmdvdF9wYXNzd29yZCdcbiAgICAgICdyZXNldF9wYXNzd29yZCcsXG4gICAgXVxuXG4gICAgIyBpZiBub3QgbG9nZ2VkXG4gICAgJHRpbWVvdXQoKCkgLT5cbiAgICAgICRyb290U2NvcGUuY3VycmVudFN0YXRlID0gJHN0YXRlLmN1cnJlbnQubmFtZVxuXG4gICAgICBpZiAhJGF1dGguaXNBdXRoZW50aWNhdGVkKCkgJiYgcHVibGljUm91dGVzLmluZGV4T2YoJHJvb3RTY29wZS5jdXJyZW50U3RhdGUpID09IC0xXG4gICAgICAgICRsb2NhdGlvbi5wYXRoICd1c2VyL3NpZ25faW4nXG4gICAgKVxuXG4gICAgJHJvb3RTY29wZS4kb24gJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGV2ZW50LCB0b1N0YXRlKSAtPlxuICAgICAgdXNlciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKSlcblxuICAgICAgaWYgdXNlciAmJiAkYXV0aC5pc0F1dGhlbnRpY2F0ZWQoKVxuICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAgIGlmICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXIgPSAnL2ltYWdlcy8nICsgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gJ3VwbG9hZHMvYXZhdGFycy8nICsgJHJvb3RTY29wZS5jdXJyZW50VXNlci5hdmF0YXJcblxuICAgICAgJHJvb3RTY29wZS5sb2dvdXQgPSAtPlxuICAgICAgICAkYXV0aC5sb2dvdXQoKS50aGVuIC0+XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0gJ3VzZXInXG4gICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2VcbiAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbFxuICAgICAgICAgICRzdGF0ZS5nbyAnc2lnbl9pbidcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgcmV0dXJuXG4gICAgcmV0dXJuIiwiY2hlY2tib3hGaWVsZCA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VBJ1xuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2RpcmVjdGl2ZXMvY2hlY2tib3hfZmllbGQuaHRtbCdcbiAgICBzY29wZToge1xuICAgICAgbGFiZWw6ICc9bGFiZWwnXG4gICAgICBhdHRyQ2xhc3M6ICc9P2F0dHJDbGFzcydcbiAgICAgIG5nQ2hlY2tlZDogJz0/bmdDaGVja2VkJ1xuICAgICAgbW9kZWw6ICc9bW9kZWwnXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0ciktPlxuICAgICAgaWYgc2NvcGUubW9kZWwgPT0gJzEnXG4gICAgICAgIHNjb3BlLm1vZGVsID0gdHJ1ZVxuICAgICAgZWxzZSBpZiBzY29wZS5tb2RlbCA9PSAnMCdcbiAgICAgICAgc2NvcGUubW9kZWwgPSBmYWxzZVxuICAgICAgcmV0dXJuXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdjaGVja2JveEZpZWxkJywgY2hlY2tib3hGaWVsZCIsImRhdGV0aW1lcGlja2VyID0gKCR0aW1lb3V0KSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdBRSdcbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kaXJlY3RpdmVzL2RhdGV0aW1lcGlja2VyLmh0bWwnXG4gICAgcmVxdWlyZTogJ25nTW9kZWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIGxhYmVsOiBcIj0/bGFiZWxcIlxuICAgIH1cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIG5nTW9kZWwpIC0+XG4gICAgICBzY29wZS5vcGVuID0gKCkgLT5cbiAgICAgICAgc2NvcGUuZGF0ZV9vcGVuZWQgPSB0cnVlXG5cbiAgICAgICR0aW1lb3V0KFxuICAgICAgICAoKCkgLT5cbiAgICAgICAgICBzY29wZS5tb2RlbCA9IERhdGUucGFyc2UobmdNb2RlbC4kdmlld1ZhbHVlKVxuICAgICAgICApLCA0MDBcbiAgICAgIClcblxuICAgICAgc2NvcGUuc2VsZWN0RGF0ZSA9ICgobW9kZWwpIC0+XG4gICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1vZGVsKVxuICAgICAgKVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAnZGF0ZXRpbWVwaWNrZXInLCBkYXRldGltZXBpY2tlciIsImRlbGV0ZUF2YXRhciA9ICgkdGltZW91dCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUEnXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9kZWxldGVfYXZhdGFyLmh0bWwnXG4gICAgc2NvcGU6XG4gICAgICByZW1vdmVBdmF0YXI6ICc9bmdNb2RlbCdcbiAgICAgIGZpbGU6IFwiPWZpbGVcIlxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMpIC0+XG4gICAgICBhdHRycy4kb2JzZXJ2ZSAnaW1nTmFtZScsICh2YWx1ZSkgLT5cbiAgICAgICAgc2NvcGUuaW1nTmFtZSA9IHZhbHVlXG4gICAgICAgIHJldHVyblxuXG4gICAgICBzY29wZS5yZW1vdmUgPSAoKSAtPlxuICAgICAgICAkdGltZW91dCgoKS0+XG4gICAgICAgICAgc2NvcGUuaW1nTmFtZSA9ICdpbWFnZXMvZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICApXG5cbiAgICAgICAgaWYgc2NvcGUuZmlsZSAhPSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICAgIHNjb3BlLnJlbW92ZUF2YXRhciA9IHRydWVcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ2RlbGV0ZUF2YXRhcicsIGRlbGV0ZUF2YXRhciIsImZpbGVGaWVsZCA9ICgpIC0+XG4gIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0FFJ1xuICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZGlyZWN0aXZlcy9maWxlX2ZpZWxkLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIGF0dHJJZDogJz0nXG4gICAgICBuZ01vZGVsOiAnPW5nTW9kZWwnXG4gICAgICByZW1vdmVBdmF0YXI6ICc9P3JlbW92ZWRBdmF0YXInXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIGVsZW1lbnQuYmluZCAnY2hhbmdlJywgKGNoYW5nZUV2ZW50KSAtPlxuICAgICAgICBzY29wZS5uZ01vZGVsID0gZXZlbnQudGFyZ2V0LmZpbGVzO1xuICAgICAgICBzY29wZS5yZW1vdmVBdmF0YXIgPSBmYWxzZSAjIGZvciBkZWxldGVfYXZhdGFyIGRpcmVjdGl2ZVxuICAgICAgICBmaWxlcyA9IGV2ZW50LnRhcmdldC5maWxlcztcbiAgICAgICAgZmlsZU5hbWUgPSBmaWxlc1swXS5uYW1lO1xuICAgICAgICBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9dGV4dF0nKS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgZmlsZU5hbWUpXG4gIH1cblxuICByZXR1cm4gZGlyZWN0aXZlXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuZGlyZWN0aXZlICdmaWxlRmllbGQnLCBmaWxlRmllbGQiLCJwYWdpbmF0aW9uID0gKCRodHRwKSAtPlxuICBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQSdcbiAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2RpcmVjdGl2ZXMvcGFnaW5hdGlvbi5odG1sJ1xuICAgIHNjb3BlOiB7XG4gICAgICBwYWdpQXJyOiAnPSdcbiAgICAgIGl0ZW1zOiAnPSdcbiAgICAgIHBhZ2lBcGlVcmw6ICc9J1xuICAgIH1cbiAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIC0+XG4gICAgICBzY29wZS4kd2F0Y2ggKC0+XG4gICAgICAgIHNjb3BlLnBhZ2lBcnJcbiAgICAgICksICgobmV3VmFsdWUsIG9sZFZhbHVlKSAtPlxuICAgICAgICBpZiAhYW5ndWxhci5lcXVhbHMob2xkVmFsdWUsIG5ld1ZhbHVlKVxuICAgICAgICAgIHNjb3BlLnBhZ2lBcnIgPSBuZXdWYWx1ZVxuICAgICAgICAgIHNjb3BlLnRvdGFsUGFnZXMgPSBzY29wZS5wYWdpQXJyLmxhc3RfcGFnZVxuICAgICAgICAgIHNjb3BlLmN1cnJlbnRQYWdlID0gc2NvcGUucGFnaUFyci5jdXJyZW50X3BhZ2VcbiAgICAgICAgICBzY29wZS50b3RhbCA9IHNjb3BlLnBhZ2lBcnIudG90YWxcbiAgICAgICAgICBzY29wZS5wZXJQYWdlID0gc2NvcGUucGFnaUFyci5wZXJfcGFnZVxuXG4gICAgICAgICAgIyBQYWdpbmF0aW9uIFJhbmdlXG4gICAgICAgICAgc2NvcGUucGFpbmF0aW9uUmFuZ2Uoc2NvcGUudG90YWxQYWdlcylcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIHRydWVcblxuICAgICAgc2NvcGUuZ2V0UG9zdHMgPSAocGFnZU51bWJlcikgLT5cbiAgICAgICAgaWYgcGFnZU51bWJlciA9PSB1bmRlZmluZWRcbiAgICAgICAgICBwYWdlTnVtYmVyID0gJzEnXG4gICAgICAgICRodHRwLmdldChzY29wZS5wYWdpQXBpVXJsKyc/cGFnZT0nICsgcGFnZU51bWJlcikuc3VjY2VzcyAocmVzcG9uc2UpIC0+XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgIHNjb3BlLml0ZW1zID0gcmVzcG9uc2UuZGF0YVxuICAgICAgICAgIHNjb3BlLnRvdGFsUGFnZXMgPSByZXNwb25zZS5sYXN0X3BhZ2VcbiAgICAgICAgICBzY29wZS5jdXJyZW50UGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZVxuXG4gICAgICAgICAgIyBQYWdpbmF0aW9uIFJhbmdlXG4gICAgICAgICAgc2NvcGUucGFpbmF0aW9uUmFuZ2Uoc2NvcGUudG90YWxQYWdlcylcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHNjb3BlLnBhaW5hdGlvblJhbmdlID0gKHRvdGFsUGFnZXMpIC0+XG4gICAgICAgIHBhZ2VzID0gW11cbiAgICAgICAgaSA9IDFcbiAgICAgICAgd2hpbGUgaSA8PSB0b3RhbFBhZ2VzXG4gICAgICAgICAgcGFnZXMucHVzaCBpXG4gICAgICAgICAgaSsrXG4gICAgICAgIHNjb3BlLnJhbmdlID0gcGFnZXNcbiAgfVxuXG4gIHJldHVybiBkaXJlY3RpdmVcblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5kaXJlY3RpdmUgJ3BhZ2luYXRpb24nLCBwYWdpbmF0aW9uIiwicmFkaW9GaWVsZCA9ICgkaHR0cCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUEnXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy9yYWRpb19maWVsZC5odG1sJ1xuICAgIHNjb3BlOiB7XG4gICAgICBuZ01vZGVsOiBcIj1uZ01vZGVsXCJcbiAgICAgIGxhYmVsOiAnPWxhYmVsJ1xuICAgICAgYXR0ck5hbWU6ICc9YXR0ck5hbWUnXG4gICAgICBhdHRyVmFsdWU6ICc9YXR0clZhbHVlJ1xuICAgICAgbmdDaGVja2VkOiAnPT9uZ0NoZWNrZWQnXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0ciktPlxuICAgICAgc2NvcGUubmdNb2RlbCA9IHNjb3BlLmF0dHJWYWx1ZVxuXG4gICAgICBlbGVtZW50LmJpbmQoJ2NoYW5nZScsICgpLT5cbiAgICAgICAgc2NvcGUubmdNb2RlbCA9IHNjb3BlLmF0dHJWYWx1ZVxuICAgICAgKVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAncmFkaW9GaWVsZCcsIHJhZGlvRmllbGQiLCJ0aW1lcGlja2VyID0gKCkgLT5cbiAgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnQUUnXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGlyZWN0aXZlcy90aW1lcGlja2VyLmh0bWwnXG4gICAgc2NvcGU6IHtcbiAgICAgIG1vZGVsOiBcIj1uZ01vZGVsXCJcbiAgICAgIGxhYmVsOiBcIj0/bGFiZWxcIlxuICAgICAgYXR0ck5hbWU6IFwiQFwiXG4gICAgfVxuICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgLT5cbiAgICAgIHNjb3BlLmhzdGVwID0gMVxuICAgICAgc2NvcGUubXN0ZXAgPSA1XG4gICAgICBzY29wZS5pc21lcmlkaWFuID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZVxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmRpcmVjdGl2ZSAndGltZXBpY2tlcicsIHRpbWVwaWNrZXIiLCJJbmRleEhvbWVDdHJsID0gKCRodHRwLCAkdGltZW91dCwgJGZpbHRlciwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgIyBSb3V0ZXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS9ob21lJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBNYXBcbiAgYXBpS2V5ID0gJ2EzMDNkM2E0NGEwMWM5ZjhhNWNiMDEwN2IwMzNlZmJlJztcbiAgdm0ubWFya2VycyA9IFtdXG5cblxuICAjIyMgIFJPVVRFUyAgIyMjXG4gIGlmICRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcl9ncm91cCA9PSAnYWRtaW4nXG4gICAgJGh0dHAuZ2V0KCcvYXBpL2hvbWUnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnJvdXRlcyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgICAgdm0ucGFnaUFyciA9IHJlc3BvbnNlLmRhdGFcblxuICAgICAgcmV0dXJuXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gIHZtLnNvcnRCeSA9IChwcmVkaWNhdGUpIC0+XG4gICAgdm0uc29ydFJldmVyc2UgPSAhdm0uc29ydFJldmVyc2VcbiAgICAkKCcuc29ydC1saW5rJykuZWFjaCAoKSAtPlxuICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygpLmFkZENsYXNzKCdzb3J0LWxpbmsgYy1wJylcblxuICAgIGlmIHZtLnNvcnRSZXZlcnNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtYXNjJykuYWRkQ2xhc3MoJ2FjdGl2ZS1kZXNjJylcbiAgICBlbHNlXG4gICAgICAkKCcjJytwcmVkaWNhdGUpLnJlbW92ZUNsYXNzKCdhY3RpdmUtZGVzYycpLmFkZENsYXNzKCdhY3RpdmUtYXNjJylcblxuICAgIHZtLnByZWRpY2F0ZSA9IHByZWRpY2F0ZVxuICAgIHZtLnJldmVyc2UgPSBpZiAodm0ucHJlZGljYXRlID09IHByZWRpY2F0ZSkgdGhlbiAhdm0ucmV2ZXJzZSBlbHNlIGZhbHNlXG4gICAgdm0ucm91dGVzID0gb3JkZXJCeSh2bS5yb3V0ZXMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG4gICMjIyAgTUFQICAjIyNcbiAgIyBHZXQgcG9pbnRzIEpTT05cbiAgJGh0dHAoXG4gICAgbWV0aG9kOiAnR0VUJ1xuICAgIHVybDogJy9hcGkvaG9tZS9nZXRwb2ludHMnKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhXG5cbiAgICAgIHJldHVyblxuICApXG5cbiAgaW5pdE1hcCA9IC0+XG4gICAgbWFwT3B0aW9ucyA9XG4gICAgICB6b29tOiAxMlxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2VcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczogcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTVxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTA3MzUwOSwgLTAuMTI3NzU4MylcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzXG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlXG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2goIHZtLnBvaW50cywgKHZhbHVlLCBrZXkpIC0+XG4gICAgICBhZGRyZXNzID0gdmFsdWUuc3RvcmUuYWRkcmVzc1xuICAgICAgIyBHZW9jb2RlIEFkZHJlc3NlcyBieSBhZGRyZXNzIG5hbWVcbiAgICAgIGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmNhZ2VkYXRhLmNvbS9nZW9jb2RlL3YxL2pzb24/cT1cIithZGRyZXNzK1wiJnByZXR0eT0xJmtleT1cIiArIGFwaUtleTtcbiAgICAgIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICByZXEub25sb2FkID0gKCkgLT5cbiAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVxuICAgICAgICAgIHBvc2l0aW9uID0gcmVzcG9uc2UucmVzdWx0c1swXS5nZW9tZXRyeVxuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMClcbiAgICAgICAgICAgIGNvbnRlbnRTdHJpbmcgPSAnPGRpdiBjbGFzcz1cIm1hcmtlci1jb250ZW50XCI+JyArIHZhbHVlLnN0b3JlLmFkZHJlc3MgKyAnPC9kaXY+J1xuICAgICAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyAoZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdykoY29udGVudDogY29udGVudFN0cmluZykgIyBwb3B1cFxuXG4gICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgIGlmIHBhcnNlSW50IHZhbHVlLnN0YXR1c1xuICAgICAgICAgICAgICB2bS5iYWxvb25OYW1lID0gJ2ltYWdlcy9iYWxsb29uX3NoaXBlZC5wbmcnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb24ucG5nJ1xuXG4gICAgICAgICAgICBtYXJrZXIgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcmtlcikoXG4gICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgIGljb246IHZtLmJhbG9vbk5hbWVcbiAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgICMgQ2xpY2sgYnkgb3RoZXIgbWFya2VyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIC0+XG4gICAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHByZXZJbmZvV2luZG93ID0gaW5mb1dpbmRvd1xuICAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4gbWFwLCBtYXJrZXJcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBlbXB0eSBtYXAgYXJlYVxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgIHZtLm1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICByZXEub3BlbihcIkdFVFwiLCBhcGlVcmwsIHRydWUpO1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICApXG5cbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaydcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfVxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJ1xuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICAjIEluaXQgbWFwXG4gICR0aW1lb3V0ICgoKS0+XG4gICAgaW5pdE1hcCgpXG4gICAgcmV0dXJuXG4gICksIDUwMFxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4SG9tZUN0cmwnLCBJbmRleEhvbWVDdHJsKSIsIkVkaXRQcm9maWxlQ3RybCA9ICgkaHR0cCwgJHN0YXRlLCBVcGxvYWQsICRyb290U2NvcGUpIC0+XG4gIHZtID0gdGhpc1xuXG4gICRodHRwLmdldCgnL2FwaS9wcm9maWxlL2VkaXQnKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnVzZXIgPSByZXNwb25zZS5kYXRhXG4gICAgICB2bS51c2VyLnJlbW92ZV9hdmF0YXIgPSBmYWxzZVxuXG4gICAgICB2bS5hdmF0YXIgPSB2bS5tYWtlQXZhdGFyTGluayh2bS51c2VyLmF2YXRhcikgIyBmb3IgZGVsZXRlX2F2YXRhciBkaXJlY3RpdmVcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLnVwZGF0ZSA9ICgpIC0+XG4gICAgYXZhdGFyID0gdm0udXNlci5hdmF0YXJcblxuICAgIGlmIHZtLnVzZXIuYXZhdGFyID09ICcvaW1hZ2VzL2RlZmF1bHRfYXZhdGFyLmpwZydcbiAgICAgIHZtLnVzZXIuYXZhdGFyID0gJ2RlZmF1bHRfYXZhdGFyLmpwZycgIyB0b2RvIGh6IG1heSBiZSBmb3IgZGVsZXRlXG4gICAgICBhdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgIHZtLmRhdGEgPVxuICAgICAgYXZhdGFyOiBhdmF0YXJcbiAgICAgIHJlbW92ZV9hdmF0YXI6IHZtLnVzZXIucmVtb3ZlX2F2YXRhclxuICAgICAgbmFtZTogdm0udXNlci5uYW1lXG4gICAgICBsYXN0X25hbWU6IHZtLnVzZXIubGFzdF9uYW1lXG4gICAgICBpbml0aWFsczogdm0udXNlci5pbml0aWFsc1xuICAgICAgYmRheTogdm0udXNlci5iZGF5XG4gICAgICBlbWFpbDogdm0udXNlci5lbWFpbFxuICAgICAgcGhvbmU6IHZtLnVzZXIucGhvbmVcbiAgICAgIGpvYl90aXRsZTogdm0udXNlci5qb2JfdGl0bGVcbiAgICAgIGNvdW50cnk6IHZtLnVzZXIuY291bnRyeVxuICAgICAgY2l0eTogdm0udXNlci5jaXR5XG5cbiAgICBVcGxvYWQudXBsb2FkKFxuICAgICAgdXJsOiAnL2FwaS9wcm9maWxlLycgKyB2bS51c2VyLmlkXG4gICAgICBtZXRob2Q6ICdQb3N0J1xuICAgICAgZGF0YTogdm0uZGF0YVxuICAgICkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgZmlsZU5hbWUgPSByZXNwb25zZS5kYXRhXG4gICAgICBzdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKVxuICAgICAgc3RvcmFnZSA9IEpTT04ucGFyc2Uoc3RvcmFnZSlcblxuICAgICAgIyBEZWZhdWx0IGF2YXRhclxuICAgICAgaWYgdHlwZW9mIGZpbGVOYW1lID09ICdib29sZWFuJyAmJiB2bS51c2VyLnJlbW92ZV9hdmF0YXJcbiAgICAgICAgc3RvcmFnZS5hdmF0YXIgPSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLmF2YXRhciA9ICAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgIyBVcGRhdGUgc3RvcmFnZVxuICAgICAgZWxzZSBpZiB0eXBlb2YgZmlsZU5hbWUgPT0gJ3N0cmluZycgJiYgIXZtLnVzZXIucmVtb3ZlX2F2YXRhclxuICAgICAgICBzdG9yYWdlLmF2YXRhciA9IGZpbGVOYW1lXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIuYXZhdGFyID0gdm0ubWFrZUF2YXRhckxpbmsoc3RvcmFnZS5hdmF0YXIpXG4gICAgICAgIHN0b3JhZ2UuYXZhdGFyID0gZmlsZU5hbWVcblxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCBKU09OLnN0cmluZ2lmeShzdG9yYWdlKSlcblxuICAgICAgJHN0YXRlLmdvICdwcm9maWxlJywgeyBmbGFzaFN1Y2Nlc3M6ICdQcm9maWxlIHVwZGF0ZWQhJyB9XG4gICAgKSwgKChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpO1xuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gIHZtLm1ha2VBdmF0YXJMaW5rID0gKGF2YXRhck5hbWUpIC0+XG4gICAgaWYgYXZhdGFyTmFtZSA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgYXZhdGFyTmFtZSA9ICcvaW1hZ2VzLycgKyBhdmF0YXJOYW1lXG4gICAgZWxzZVxuICAgICAgYXZhdGFyTmFtZSA9ICcvdXBsb2Fkcy9hdmF0YXJzLycgKyBhdmF0YXJOYW1lXG5cbiAgICByZXR1cm4gYXZhdGFyTmFtZVxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0VkaXRQcm9maWxlQ3RybCcsIEVkaXRQcm9maWxlQ3RybCkiLCJJbmRleFByb2ZpbGVDdHJsID0gKCRodHRwKSAtPlxuICB2bSA9IHRoaXNcblxuICAkaHR0cC5nZXQoJy9hcGkvcHJvZmlsZScpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0udXNlciA9IHJlc3BvbnNlLmRhdGEudXNlclxuICAgICAgdm0ucG9pbnRzID0gcmVzcG9uc2UuZGF0YS5wb2ludHNcbiAgICAgIGlmIHZtLnVzZXIuYXZhdGFyID09ICdkZWZhdWx0X2F2YXRhci5qcGcnXG4gICAgICAgIHZtLnVzZXIuYXZhdGFyID0gJy9pbWFnZXMvJyArIHZtLnVzZXIuYXZhdGFyXG4gICAgICBlbHNlXG4gICAgICAgIHZtLnVzZXIuYXZhdGFyID0gJ3VwbG9hZHMvYXZhdGFycy8nICsgdm0udXNlci5hdmF0YXJcblxuICAgICAgdm0udXNlci5iZGF5ID0gbW9tZW50KG5ldyBEYXRlKHZtLnVzZXIuYmRheSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG4gICAgLCAoZXJyb3IpIC0+XG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICB2bS51cGRhdGVQb2ludHMgPSAoKSAtPlxuICAgICRodHRwLnB1dCgnL2FwaS9wcm9maWxlL3VwZGF0ZXBvaW50cycsIHZtLnBvaW50cylcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1BvaW50cyB1cGRhdGVkISdcbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleFByb2ZpbGVDdHJsJywgSW5kZXhQcm9maWxlQ3RybCkiLCJJbmRleE1hcEN0cmwgPSAoJGh0dHAsICR0aW1lb3V0KSAtPlxuICB2bSA9IHRoaXNcblxuICAjIE1hcFxuICBhcGlLZXkgPSAnYTMwM2QzYTQ0YTAxYzlmOGE1Y2IwMTA3YjAzM2VmYmUnO1xuICB2bS5tYXJrZXJzID0gW11cblxuICAjIEdldCBwb2ludHMgSlNPTlxuICAkaHR0cChcbiAgICBtZXRob2Q6ICdHRVQnXG4gICAgdXJsOiAnL2FwaS9tYXAnKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhXG5cbiAgICAgIHJldHVyblxuICApXG5cbiAgaW5pdE1hcCA9IC0+XG4gICAgbWFwT3B0aW9ucyA9XG4gICAgICB6b29tOiAxMlxuICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXG4gICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2VcbiAgICAgIHpvb21Db250cm9sT3B0aW9uczogcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0JPVFRPTVxuICAgICAgY2VudGVyOiBuZXcgKGdvb2dsZS5tYXBzLkxhdExuZykoNTEuNTA3MzUwOSwgLTAuMTI3NzU4MylcbiAgICAgIHN0eWxlczogdm0uc3R5bGVzXG5cbiAgICBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpXG4gICAgbWFwID0gbmV3IChnb29nbGUubWFwcy5NYXApKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpXG4gICAgcHJldkluZm9XaW5kb3cgPWZhbHNlO1xuXG4gICAgIyBTZXQgbG9jYXRpb25zXG4gICAgYW5ndWxhci5mb3JFYWNoKCB2bS5wb2ludHMsICh2YWx1ZSwga2V5KSAtPlxuICAgICAgYWRkcmVzcyA9IHZhbHVlLnN0b3JlLmFkZHJlc3NcbiAgICAgICMgR2VvY29kZSBBZGRyZXNzZXMgYnkgYWRkcmVzcyBuYW1lXG4gICAgICBhcGlVcmwgPSBcImh0dHBzOi8vYXBpLm9wZW5jYWdlZGF0YS5jb20vZ2VvY29kZS92MS9qc29uP3E9XCIrYWRkcmVzcytcIiZwcmV0dHk9MSZrZXk9XCIgKyBhcGlLZXk7XG4gICAgICByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgcmVxLm9ubG9hZCA9ICgpIC0+XG4gICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApXG4gICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICBwb3NpdGlvbiA9IHJlc3BvbnNlLnJlc3VsdHNbMF0uZ2VvbWV0cnlcblxuICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cy5jb2RlID09IDIwMClcbiAgICAgICAgICAgY29udGVudFN0cmluZyA9ICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICsgdmFsdWUuc3RvcmUuYWRkcmVzcyArICc8L2Rpdj4nXG4gICAgICAgICAgIGluZm9XaW5kb3cgPSBuZXcgKGdvb2dsZS5tYXBzLkluZm9XaW5kb3cpKGNvbnRlbnQ6IGNvbnRlbnRTdHJpbmcpICMgcG9wdXBcblxuICAgICAgICAgICAjIHNlbGVjdCBpY29ucyBieSBzdGF0dXMgKGdyZWVuIG9yIHJlZClcbiAgICAgICAgICAgaWYgcGFyc2VJbnQgdmFsdWUuc3RhdHVzXG4gICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbl9zaGlwZWQucG5nJ1xuICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbi5wbmcnXG5cbiAgICAgICAgICAgbWFya2VyID0gbmV3IChnb29nbGUubWFwcy5NYXJrZXIpKFxuICAgICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgICAgICAgaWNvbjogdm0uYmFsb29uTmFtZVxuICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvblxuICAgICAgICAgICApXG5cbiAgICAgICAgICAgIyBDbGljayBieSBvdGhlciBtYXJrZXJcbiAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgIGlmKCBwcmV2SW5mb1dpbmRvdyApXG4gICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdyA9IGluZm9XaW5kb3dcbiAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLmdldFBvc2l0aW9uKCkpICMgYW5pbWF0ZSBtb3ZlIGJldHdlZW4gbWFya2Vyc1xuICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbiBtYXAsIG1hcmtlclxuXG4gICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgIClcblxuICAgICAgICAgICAjIENsaWNrIGJ5IGVtcHR5IG1hcCBhcmVhXG4gICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgLT5cbiAgICAgICAgICAgICBpbmZvV2luZG93LmNsb3NlKClcblxuICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICApXG5cbiAgICAgICAgICAgIyBBZGQgbmV3IG1hcmtlciB0byBhcnJheSBmb3Igb3V0c2lkZSBtYXAgbGlua3MgKG9yZGVyZWQgYnkgaWQgaW4gYmFja2VuZClcbiAgICAgICAgICAgdm0ubWFya2Vycy5wdXNoKG1hcmtlcilcbiAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIGFwaVVybCwgdHJ1ZSk7XG4gICAgICByZXEuc2VuZCgpO1xuICAgIClcbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaydcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfVxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJ1xuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICAjIEluaXQgbWFwXG4gICR0aW1lb3V0ICgoKS0+XG4gICAgaW5pdE1hcCgpXG4gICAgcmV0dXJuXG4gICksIDUwMFxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4TWFwQ3RybCcsIEluZGV4TWFwQ3RybCkiLCJDcmVhdGVTdG9yZUN0cmwgPSAoJHNjb3BlLCAkaHR0cCwgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5jcmVhdGUgPSAoKSAtPlxuICAgIHN0b3JlID1cbiAgICAgIG5hbWU6IHZtLnN0b3JlTmFtZVxuICAgICAgb3duZXJfbmFtZTogdm0ub3duZXJOYW1lXG4gICAgICBhZGRyZXNzOiB2bS5hZGRyZXNzXG4gICAgICBwaG9uZTogdm0ucGhvbmVcbiAgICAgIGVtYWlsOiB2bS5lbWFpbFxuXG4gICAgJGh0dHAucG9zdCgnL2FwaS9zdG9yZXMnLCBzdG9yZSlcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgJHN0YXRlLmdvICdzdG9yZXMnLCB7IGZsYXNoU3VjY2VzczogJ05ldyBzdG9yZSBjcmVhdGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gICRzY29wZS5nZXRMb2NhdGlvbiA9IChhZGRyZXNzKSAtPlxuICAgICRodHRwLmdldCgnLy9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbicsXG4gICAgICBwYXJhbXM6XG4gICAgICAgIGFkZHJlc3M6IGFkZHJlc3NcbiAgICAgICAgbGFuZ3VhZ2U6ICdlbidcbiAgICAgICAgY29tcG9uZW50czogJ2NvdW50cnk6VUt8YWRtaW5pc3RyYXRpdmVfYXJlYTpMb25kb24nXG4gICAgICBza2lwQXV0aG9yaXphdGlvbjogdHJ1ZSAjIGZvciBlcnJvZSBvZiAuLiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXG4gICAgKS50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHJlc3BvbnNlLmRhdGEucmVzdWx0cy5tYXAgKGl0ZW0pIC0+XG4gICAgICAgIGl0ZW0uZm9ybWF0dGVkX2FkZHJlc3NcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdDcmVhdGVTdG9yZUN0cmwnLCBDcmVhdGVTdG9yZUN0cmwpIiwiRWRpdFN0b3JlQ3RybCA9ICgkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG5cbiAgJGh0dHAuZ2V0KCdhcGkvc3RvcmVzLycrdm0uaWQpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICBzdG9yZSA9XG4gICAgICBuYW1lOiB2bS5kYXRhLm5hbWVcbiAgICAgIG93bmVyX25hbWU6IHZtLmRhdGEub3duZXJfbmFtZVxuICAgICAgYWRkcmVzczogdm0uZGF0YS5hZGRyZXNzXG4gICAgICBwaG9uZTogdm0uZGF0YS5waG9uZVxuICAgICAgZW1haWw6IHZtLmRhdGEuZW1haWxcblxuICAgICRodHRwLnBhdGNoKCcvYXBpL3N0b3Jlcy8nICsgdm0uaWQsIHN0b3JlKVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgVXBkYXRlZCEnIH1cbiAgICAgICwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcblxuICAkc2NvcGUuZ2V0TG9jYXRpb24gPSAoYWRkcmVzcykgLT5cbiAgICAkaHR0cC5nZXQoJy8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgcGFyYW1zOlxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzXG4gICAgICAgIGxhbmd1YWdlOiAnZW4nXG4gICAgICAgIGNvbXBvbmVudHM6ICdjb3VudHJ5OlVLfGFkbWluaXN0cmF0aXZlX2FyZWE6TG9uZG9uJ1xuICAgICAgc2tpcEF1dGhvcml6YXRpb246IHRydWUgIyBmb3IgZXJyb2Ugb2YgLi4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1xuICAgICkudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICByZXNwb25zZS5kYXRhLnJlc3VsdHMubWFwIChpdGVtKSAtPlxuICAgICAgICBpdGVtLmZvcm1hdHRlZF9hZGRyZXNzXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFN0b3JlQ3RybCcsIEVkaXRTdG9yZUN0cmwpIiwiSW5kZXhTdG9yZUN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvc3RvcmVzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBGbGFzaCBmcm9tIG90aGVycyBwYWdlc1xuICBpZiAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG4gICAgdm0uZmxhc2hTdWNjZXNzID0gJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuXG4gICRodHRwLmdldCgnYXBpL3N0b3JlcycpLnRoZW4oKHJlc3BvbnNlKSAtPlxuICAgIHZtLnN0b3JlcyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpO1xuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS5zdG9yZXMgPSBvcmRlckJ5KHZtLnN0b3JlcywgcHJlZGljYXRlLCB2bS5yZXZlcnNlKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZGVsZXRlU3RvcmUgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvc3RvcmVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAjIERlbGV0ZSBmcm9tIHNjb3BlXG4gICAgICAgIHZtLnN0b3Jlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIHZtLmZsYXNoU3VjY2VzcyA9ICdTdG9yZSBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdJbmRleFN0b3JlQ3RybCcsIEluZGV4U3RvcmVDdHJsKSIsIlNob3dTdG9yZUN0cmwgPSAoJGh0dHAsICRzdGF0ZVBhcmFtcywgJHN0YXRlKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcblxuICAkaHR0cC5nZXQoJ2FwaS9zdG9yZXMvJyt2bS5pZCkudGhlbigocmVzcG9uc2UpIC0+XG4gICAgdm0uZGF0YSA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5kZWxldGVTdG9yZSA9IChpZCkgLT5cbiAgICBjb25maXJtYXRpb24gPSBjb25maXJtKCdBcmUgeW91IHN1cmU/JylcblxuICAgIGlmIGNvbmZpcm1hdGlvblxuICAgICAgJGh0dHAuZGVsZXRlKCdhcGkvc3RvcmVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3N0b3JlcycsIHsgZmxhc2hTdWNjZXNzOiAnU3RvcmUgZGVsZXRlZCEnIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICApXG5cbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1N0b3JlQ3RybCcsIFNob3dTdG9yZUN0cmwpIiwiQ3JlYXRlUm91dGVDdHJsID0gKCRodHRwLCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5wb2ludEZvcm1zID0gW11cblxuICAkaHR0cC5wb3N0KCcvYXBpL3JvdXRlcy9nZXRVc2Vyc0FuZFN0b3JlcycpXG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgdm0ub2JqID0gcmVzcG9uc2UuZGF0YVxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0uY3JlYXRlUm91dGUgPSAoKSAtPlxuICAgIGNvbnNvbGUubG9nKHZtLmRhdGUpXG5cbiAgICB2bS5yb3V0ZSA9XG4gICAgICB1c2VyX2lkOiB2bS51c2VyX2lkXG4gICAgICBkYXRlOiB2bS5kYXRlXG4gICAgICBwb2ludHM6IHZtLnBvaW50Rm9ybXNcblxuICAgICRodHRwLnBvc3QoJy9hcGkvcm91dGVzJywgdm0ucm91dGUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHZtLmRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdOZXcgcm91dGUgaGFzIGJlZW4gYWRkZWQhJyB9XG4gICAgICAsIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgICAgIGNvbnNvbGUubG9nKHZtLmVycm9yKTtcblxuICAgIHJldHVyblxuXG4gIHZtLmFkZFBvaW50ID0gKCkgLT5cbiAgICB2bS5wb2ludEZvcm1zLnB1c2goe30pXG5cbiAgdm0ucmVtb3ZlUG9pbnQgPSAoaW5kZXgpIC0+XG4gICAgdm0ucG9pbnRGb3Jtcy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignQ3JlYXRlUm91dGVDdHJsJywgQ3JlYXRlUm91dGVDdHJsKSIsIkVkaXRSb3V0ZUN0cmwgPSAoJGh0dHAsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uaWQgPSAkc3RhdGVQYXJhbXMuaWRcbiAgdm0uY291bnQgPSAxXG5cbiAgJGh0dHAuZ2V0KCcvYXBpL3JvdXRlcy9lZGl0LycrIHZtLmlkKVxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIHZtLm9iaiA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIHJldHVyblxuICAgICwgKGVycm9yKSAtPlxuICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG5cbiAgdm0udXBkYXRlID0gKCkgLT5cbiAgICByb3V0ZSA9XG4gICAgICB1c2VyX2lkOiB2bS5vYmoudXNlcl9pZFxuICAgICAgZGF0ZTogdm0ub2JqLmRhdGVcbiAgICAgIHBvaW50czogdm0ub2JqLnBvaW50c1xuXG4gICAgJGh0dHAucGF0Y2goJy9hcGkvcm91dGVzLycgKyB2bS5pZCwgcm91dGUpXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICRzdGF0ZS5nbyAncm91dGVzJywgeyBmbGFzaFN1Y2Nlc3M6ICdSb3V0ZSBVcGRhdGVkIScgfVxuICAgICAgLCAoZXJyb3IpIC0+XG4gICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgICBjb25zb2xlLmxvZyh2bS5lcnJvcilcblxuXG4gIHZtLmFkZFBvaW50ID0gKCkgLT5cbiAgICB2bS5vYmoucG9pbnRzLnB1c2goe1xuICAgICAgaWQ6IHZtLmNvdW50ICsgJ19uZXcnXG4gICAgfSlcbiAgICB2bS5jb3VudCsrXG4gICAgcmV0dXJuXG5cbiAgdm0ucmVtb3ZlUG9pbnQgPSAoaW5kZXgpIC0+XG4gICAgdm0ub2JqLnBvaW50cy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRWRpdFJvdXRlQ3RybCcsIEVkaXRSb3V0ZUN0cmwpIiwiSW5kZXhSb3V0ZUN0cmwgPSAoJGh0dHAsICRmaWx0ZXIsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcykgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLnNvcnRSZXZlcnNlID0gbnVsbFxuICB2bS5wYWdpQXBpVXJsID0gJy9hcGkvcm91dGVzJ1xuICBvcmRlckJ5ID0gJGZpbHRlcignb3JkZXJCeScpXG5cbiAgIyBGbGFzaCBmcm9tIG90aGVycyBwYWdlc1xuICBpZiAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG4gICAgdm0uZmxhc2hTdWNjZXNzID0gJHN0YXRlUGFyYW1zLmZsYXNoU3VjY2Vzc1xuXG4gICRodHRwLmdldCgnL2FwaS9yb3V0ZXMnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5yb3V0ZXMgPSByZXNwb25zZS5kYXRhLmRhdGFcbiAgICB2bS5wYWdpQXJyID0gcmVzcG9uc2UuZGF0YVxuXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpXG5cbiAgICB2bS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB2bS5yZXZlcnNlID0gaWYgKHZtLnByZWRpY2F0ZSA9PSBwcmVkaWNhdGUpIHRoZW4gIXZtLnJldmVyc2UgZWxzZSBmYWxzZVxuICAgIHZtLnJvdXRlcyA9IG9yZGVyQnkodm0ucm91dGVzLCBwcmVkaWNhdGUsIHZtLnJldmVyc2UpXG5cbiAgICByZXR1cm5cblxuICB2bS5kZWxldGVSb3V0ZSA9IChpZCwgaW5kZXgpIC0+XG4gICAgY29uZmlybWF0aW9uID0gY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG5cbiAgICBpZiBjb25maXJtYXRpb25cbiAgICAgICRodHRwLmRlbGV0ZSgnL2FwaS9yb3V0ZXMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0ucm91dGVzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgdm0uZmxhc2hTdWNjZXNzID0gJ1JvdXRlIGRlbGV0ZWQhJ1xuXG4gICAgICAgIHJldHVyblxuICAgICAgKSwgKGVycm9yKSAtPlxuICAgICAgICB2bS5lcnJvciA9IGVycm9yXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignSW5kZXhSb3V0ZUN0cmwnLCBJbmRleFJvdXRlQ3RybCkiLCJTaG93Um91dGVDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICR0aW1lb3V0LCAkc3RhdGUpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5pZCA9ICRzdGF0ZVBhcmFtcy5pZFxuXG4gICMgTWFwXG4gIGFwaUtleSA9ICdhMzAzZDNhNDRhMDFjOWY4YTVjYjAxMDdiMDMzZWZiZSc7XG4gIHZtLm1hcmtlcnMgPSBbXVxuXG4gICMgR2V0IHBvaW50c1xuICAkaHR0cC5nZXQoJy9hcGkvcm91dGVzLycgKyB2bS5pZClcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5yb3V0ZSA9IHJlc3BvbnNlLmRhdGEucm91dGVcbiAgICAgIHZtLnN0b3JlcyA9IHJlc3BvbnNlLmRhdGEuc3RvcmVzXG4gICAgICB2bS5wb2ludHMgPSByZXNwb25zZS5kYXRhLnBvaW50c1xuICAgICAgdm0ucm91dGUuZGF0ZSA9IG1vbWVudChuZXcgRGF0ZSh2bS5yb3V0ZS5kYXRlKSkuZm9ybWF0KCdERC5NTS5ZWVlZJylcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuXG4gIHZtLmRlbGV0ZVJvdXRlID0gKGlkKSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvcm91dGVzLycgKyBpZCkudGhlbiAoKHJlc3BvbnNlKSAtPlxuICAgICAgICAkc3RhdGUuZ28gJ3JvdXRlcycsIHsgZmxhc2hTdWNjZXNzOiAnUm91dGUgRGVsZXRlZCEnIH1cblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuXG4gICMgV2hlbiB0aGUgd2luZG93IGhhcyBmaW5pc2hlZCBsb2FkaW5nIGNyZWF0ZSBvdXIgZ29vZ2xlIG1hcCBiZWxvd1xuICBpbml0TWFwID0gLT5cbiAgICAjIEJhc2ljIG9wdGlvbnMgZm9yIGEgc2ltcGxlIEdvb2dsZSBNYXBcbiAgICBtYXBPcHRpb25zID1cbiAgICAgIHpvb206IDEyXG4gICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcbiAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZVxuICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfQk9UVE9NXG4gICAgICBjZW50ZXI6IG5ldyAoZ29vZ2xlLm1hcHMuTGF0TG5nKSg1MS41MDAxNTIsIC0wLjEyNjIzNilcbiAgICAgIHN0eWxlczp2bS5zdHlsZXNcblxuICAgIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm91dGUtbWFwJylcbiAgICBtYXAgPSBuZXcgKGdvb2dsZS5tYXBzLk1hcCkobWFwRWxlbWVudCwgbWFwT3B0aW9ucylcbiAgICBwcmV2SW5mb1dpbmRvdyA9ZmFsc2U7XG5cbiAgICAjIFNldCBsb2NhdGlvbnNcbiAgICBhbmd1bGFyLmZvckVhY2godm0ucG9pbnRzLCAodmFsdWUsIGtleSkgLT5cbiAgICAgIGFkZHJlc3MgPSB2YWx1ZS5zdG9yZS5hZGRyZXNzXG4gICAgICAjIEdlb2NvZGUgQWRkcmVzc2VzIGJ5IGFkZHJlc3MgbmFtZVxuICAgICAgYXBpVXJsID0gXCJodHRwczovL2FwaS5vcGVuY2FnZWRhdGEuY29tL2dlb2NvZGUvdjEvanNvbj9xPVwiK2FkZHJlc3MrXCImcHJldHR5PTEma2V5PVwiICsgYXBpS2V5O1xuICAgICAgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHJlcS5vbmxvYWQgPSAoKSAtPlxuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMClcbiAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpXG4gICAgICAgICAgcG9zaXRpb24gPSByZXNwb25zZS5yZXN1bHRzWzBdLmdlb21ldHJ5XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzLmNvZGUgPT0gMjAwKVxuICAgICAgICAgICAgY29udGVudFN0cmluZyA9ICc8ZGl2IGNsYXNzPVwibWFya2VyLWNvbnRlbnRcIj4nICsgdmFsdWUuc3RvcmUuYWRkcmVzcyArICc8L2Rpdj4nXG4gICAgICAgICAgICBpbmZvV2luZG93ID0gbmV3IChnb29nbGUubWFwcy5JbmZvV2luZG93KShjb250ZW50OiBjb250ZW50U3RyaW5nKSAjIHBvcHVwXG5cbiAgICAgICAgICAgICMgc2VsZWN0IGljb25zIGJ5IHN0YXR1cyAoZ3JlZW4gb3IgcmVkKVxuICAgICAgICAgICAgaWYgcGFyc2VJbnQgdmFsdWUuc3RhdHVzXG4gICAgICAgICAgICAgIHZtLmJhbG9vbk5hbWUgPSAnaW1hZ2VzL2JhbGxvb25fc2hpcGVkLnBuZydcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgdm0uYmFsb29uTmFtZSA9ICdpbWFnZXMvYmFsbG9vbi5wbmcnXG5cbiAgICAgICAgICAgIG1hcmtlciA9IG5ldyAoZ29vZ2xlLm1hcHMuTWFya2VyKShcbiAgICAgICAgICAgICAgbWFwOiBtYXBcbiAgICAgICAgICAgICAgaWNvbjogdm0uYmFsb29uTmFtZVxuICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb25cbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBDbGljayBieSBvdGhlciBtYXJrZXJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgLT5cbiAgICAgICAgICAgICAgaWYoIHByZXZJbmZvV2luZG93IClcbiAgICAgICAgICAgICAgICBwcmV2SW5mb1dpbmRvdy5jbG9zZSgpXG5cbiAgICAgICAgICAgICAgcHJldkluZm9XaW5kb3cgPSBpbmZvV2luZG93XG4gICAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIuZ2V0UG9zaXRpb24oKSkgIyBhbmltYXRlIG1vdmUgYmV0d2VlbiBtYXJrZXJzXG4gICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbiBtYXAsIG1hcmtlclxuXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIENsaWNrIGJ5IGVtcHR5IG1hcCBhcmVhXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsIC0+XG4gICAgICAgICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKVxuXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIEFkZCBuZXcgbWFya2VyIHRvIGFycmF5IGZvciBvdXRzaWRlIG1hcCBsaW5rcyAob3JkZXJlZCBieSBpZCBpbiBiYWNrZW5kKVxuICAgICAgICAgICAgdm0ubWFya2Vycy5wdXNoKG1hcmtlcilcbiAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIGFwaVVybCwgdHJ1ZSk7XG4gICAgICByZXEuc2VuZCgpO1xuICAgIClcbiAgICByZXR1cm5cblxuICB2bS5zdHlsZXMgPSBbXG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3dhdGVyJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNlOWU5ZTknIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnbGFuZHNjYXBlJ1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5J1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmNWY1ZjUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5oaWdod2F5J1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2dlb21ldHJ5LmZpbGwnXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNyB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdyb2FkLmhpZ2h3YXknXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjkgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAwLjIgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAncm9hZC5hcnRlcmlhbCdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZmZmZmZmJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDE4IH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3JvYWQubG9jYWwnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2ZmZmZmZicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxNiB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2knXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2Y1ZjVmNScgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAyMSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdwb2kucGFyaydcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdjb2xvcic6ICcjZGVkZWRlJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDIxIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy50ZXh0LnN0cm9rZSdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICd2aXNpYmlsaXR5JzogJ29uJyB9XG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZmZmZmYnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTYgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZWxlbWVudFR5cGUnOiAnbGFiZWxzLnRleHQuZmlsbCdcbiAgICAgICdzdHlsZXJzJzogW1xuICAgICAgICB7ICdzYXR1cmF0aW9uJzogMzYgfVxuICAgICAgICB7ICdjb2xvcic6ICcjMzMzMzMzJyB9XG4gICAgICAgIHsgJ2xpZ2h0bmVzcyc6IDQwIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgJ2VsZW1lbnRUeXBlJzogJ2xhYmVscy5pY29uJ1xuICAgICAgJ3N0eWxlcnMnOiBbIHsgJ3Zpc2liaWxpdHknOiAnb2ZmJyB9IF1cbiAgICB9XG4gICAge1xuICAgICAgJ2ZlYXR1cmVUeXBlJzogJ3RyYW5zaXQnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnknXG4gICAgICAnc3R5bGVycyc6IFtcbiAgICAgICAgeyAnY29sb3InOiAnI2YyZjJmMicgfVxuICAgICAgICB7ICdsaWdodG5lc3MnOiAxOSB9XG4gICAgICBdXG4gICAgfVxuICAgIHtcbiAgICAgICdmZWF0dXJlVHlwZSc6ICdhZG1pbmlzdHJhdGl2ZSdcbiAgICAgICdlbGVtZW50VHlwZSc6ICdnZW9tZXRyeS5maWxsJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMjAgfVxuICAgICAgXVxuICAgIH1cbiAgICB7XG4gICAgICAnZmVhdHVyZVR5cGUnOiAnYWRtaW5pc3RyYXRpdmUnXG4gICAgICAnZWxlbWVudFR5cGUnOiAnZ2VvbWV0cnkuc3Ryb2tlJ1xuICAgICAgJ3N0eWxlcnMnOiBbXG4gICAgICAgIHsgJ2NvbG9yJzogJyNmZWZlZmUnIH1cbiAgICAgICAgeyAnbGlnaHRuZXNzJzogMTcgfVxuICAgICAgICB7ICd3ZWlnaHQnOiAxLjIgfVxuICAgICAgXVxuICAgIH1cbiAgXVxuXG4gICMgR28gdG8gcG9pbnQgYWZ0ZXIgY2xpY2sgb3V0c2lkZSBtYXAgbGlua1xuICB2bS5nb1RvUG9pbnQgPSAoaWQpIC0+XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcih2bS5tYXJrZXJzW2lkXSwgJ2NsaWNrJylcblxuICAjIEluaXQgbWFwXG4gICR0aW1lb3V0ICgoKS0+XG4gICAgaW5pdE1hcCgpXG4gICAgcmV0dXJuXG4gICksIDUwMFxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1Nob3dSb3V0ZUN0cmwnLCBTaG93Um91dGVDdHJsKSIsIkNvbmZpcm1Db250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUsICRodHRwLCAkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5kYXRhID1cbiAgICBjb25maXJtYXRpb25fY29kZTogJHN0YXRlUGFyYW1zLmNvbmZpcm1hdGlvbl9jb2RlXG5cbiAgJGh0dHAucG9zdCgnYXBpL2F1dGhlbnRpY2F0ZS9jb25maXJtJywgdm0uZGF0YSkuc3VjY2VzcygoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIC0+XG4gICAgIyBTYXZlIHRva2VuXG4gICAgJGF1dGguc2V0VG9rZW4oZGF0YS50b2tlbilcblxuICAgICMgU2F2ZSB1c2VyIGluIGxvY2FsU3RvcmFnZVxuICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtICd1c2VyJywgdXNlclxuICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWVcbiAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gZGF0YVxuXG4gICAgJHN0YXRlLmdvICcvJ1xuICApLmVycm9yIChkYXRhLCBzdGF0dXMsIGhlYWRlciwgY29uZmlnKSAtPlxuICAgICRzdGF0ZS5nbyAnc2lnbl9pbidcblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdDb25maXJtQ29udHJvbGxlcicsIENvbmZpcm1Db250cm9sbGVyKSIsIkZvcmdvdFBhc3N3b3JkQ29udHJvbGxlciA9ICgkaHR0cCkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVzdG9yZVBhc3N3b3JkID0gKCktPlxuICAgIHZtLnNwaW5uZXJEb25lID0gdHJ1ZVxuICAgIGRhdGEgPVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG5cbiAgICAkaHR0cC5wb3N0KCdhcGkvYXV0aGVudGljYXRlL3NlbmRfcmVzZXRfY29kZScsIGRhdGEpLnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICAgdm0uc3Bpbm5lckRvbmUgPSBmYWxzZVxuICAgICAgaWYoZGF0YSlcbiAgICAgICAgdm0uc3VjY2Vzc1NlbmRpbmdFbWFpbCA9IHRydWVcbiAgICApLmVycm9yIChlcnJvciwgc3RhdHVzLCBoZWFkZXIsIGNvbmZpZykgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignRm9yZ290UGFzc3dvcmRDb250cm9sbGVyJywgRm9yZ290UGFzc3dvcmRDb250cm9sbGVyKSIsIlJlc2V0UGFzc3dvcmRDb250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUsICRodHRwLCAkc3RhdGVQYXJhbXMpIC0+XG4gIHZtID0gdGhpc1xuICB2bS5taW5sZW5ndGggPSA4XG5cbiAgdm0ucmVzdG9yZVBhc3N3b3JkID0gKGZvcm0pIC0+XG4gICAgZGF0YSA9IHtcbiAgICAgIHJlc2V0X3Bhc3N3b3JkX2NvZGU6ICRzdGF0ZVBhcmFtcy5yZXNldF9wYXNzd29yZF9jb2RlXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcbiAgICAgIHBhc3N3b3JkX2NvbmZpcm1hdGlvbjogdm0ucGFzc3dvcmRfY29uZmlybWF0aW9uXG4gICAgfVxuXG4gICAgJGh0dHAucG9zdCgnYXBpL2F1dGhlbnRpY2F0ZS9yZXNldF9wYXNzd29yZCcsIGRhdGEpLnN1Y2Nlc3MoKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSAtPlxuICAgICAgaWYoZGF0YSlcbiAgICAgICAgdm0uc3VjY2Vzc1Jlc3RvcmVQYXNzd29yZCA9IHRydWVcbiAgICApLmVycm9yIChlcnJvciwgc3RhdHVzLCBoZWFkZXIsIGNvbmZpZykgLT5cbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICByZXR1cm5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignUmVzZXRQYXNzd29yZENvbnRyb2xsZXInLCBSZXNldFBhc3N3b3JkQ29udHJvbGxlcikiLCJTaWduSW5Db250cm9sbGVyID0gKCRhdXRoLCAkc3RhdGUsICRodHRwLCAkcm9vdFNjb3BlKSAtPlxuICB2bSA9IHRoaXNcblxuICB2bS5sb2dpbiA9ICgpIC0+XG4gICAgY3JlZGVudGlhbHMgPVxuICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcblxuICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuICgtPlxuICAgICAgIyBSZXR1cm4gYW4gJGh0dHAgcmVxdWVzdCBmb3IgdGhlIG5vdyBhdXRoZW50aWNhdGVkXG4gICAgICAjIHVzZXIgc28gdGhhdCB3ZSBjYW4gZmxhdHRlbiB0aGUgcHJvbWlzZSBjaGFpblxuICAgICAgJGh0dHAuZ2V0KCdhcGkvYXV0aGVudGljYXRlL2dldF91c2VyJykudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5kYXRhLnVzZXIpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtICd1c2VyJywgdXNlclxuICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlXG4gICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXJcblxuICAgICAgICAkc3RhdGUuZ28gJy8nXG4gICAgICAgIHJldHVyblxuICAgICksIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgY29uc29sZS5sb2codm0uZXJyb3IpO1xuICAgICAgcmV0dXJuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ1NpZ25JbkNvbnRyb2xsZXInLCBTaWduSW5Db250cm9sbGVyKSIsIlNpZ25VcENvbnRyb2xsZXIgPSAoJGF1dGgsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0ucmVnaXN0ZXIgPSAoKS0+XG4gICAgdm0uc3Bpbm5lckRvbmUgPSB0cnVlXG4gICAgaWYgdm0udXNlclxuICAgICAgY3JlZGVudGlhbHMgPVxuICAgICAgICBuYW1lOiB2bS51c2VyLm5hbWVcbiAgICAgICAgZW1haWw6IHZtLnVzZXIuZW1haWxcbiAgICAgICAgcGFzc3dvcmQ6IHZtLnVzZXIucGFzc3dvcmRcbiAgICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiB2bS51c2VyLnBhc3N3b3JkX2NvbmZpcm1hdGlvblxuXG4gICAgJGF1dGguc2lnbnVwKGNyZWRlbnRpYWxzKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICAgIHZtLnNwaW5uZXJEb25lID0gZmFsc2VcbiAgICAgICRzdGF0ZS5nbyAnc2lnbl91cF9zdWNjZXNzJ1xuICAgICAgcmV0dXJuXG4gICAgKS5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICB2bS5zcGlubmVyRG9uZSA9IGZhbHNlXG4gICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuICByZXR1cm5cblxuJ3VzZSBzdHJpY3QnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcCcpXG4gIC5jb250cm9sbGVyKCdTaWduVXBDb250cm9sbGVyJywgU2lnblVwQ29udHJvbGxlcikiLCJVc2VyQ29udHJvbGxlciA9ICgkaHR0cCwgJHN0YXRlLCAkYXV0aCwgJHJvb3RTY29wZSkgLT5cbiAgdm0gPSB0aGlzXG5cbiAgdm0uZ2V0VXNlcnMgPSAtPlxuICAgICMgVGhpcyByZXF1ZXN0IHdpbGwgaGl0IHRoZSBpbmRleCBtZXRob2QgaW4gdGhlIEF1dGhlbnRpY2F0ZUNvbnRyb2xsZXJcbiAgICAjIG9uIHRoZSBMYXJhdmVsIHNpZGUgYW5kIHdpbGwgcmV0dXJuIHRoZSBsaXN0IG9mIHVzZXJzXG4gICAgJGh0dHAuZ2V0KCdhcGkvYXV0aGVudGljYXRlJykuc3VjY2VzcygodXNlcnMpIC0+XG4gICAgICB2bS51c2VycyA9IHVzZXJzXG4gICAgICByZXR1cm5cbiAgICApLmVycm9yIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3JcbiAgICAgIHJldHVyblxuICAgIHJldHVyblxuXG4gIHZtLmxvZ291dCA9IC0+XG4gICAgJGF1dGgubG9nb3V0KCkudGhlbiAtPlxuICAgICAgIyBSZW1vdmUgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtICd1c2VyJ1xuICAgICAgIyBGbGlwIGF1dGhlbnRpY2F0ZWQgdG8gZmFsc2Ugc28gdGhhdCB3ZSBubyBsb25nZXJcbiAgICAgICMgc2hvdyBVSSBlbGVtZW50cyBkZXBlbmRhbnQgb24gdGhlIHVzZXIgYmVpbmcgbG9nZ2VkIGluXG4gICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZVxuICAgICAgIyBSZW1vdmUgdGhlIGN1cnJlbnQgdXNlciBpbmZvIGZyb20gcm9vdHNjb3BlXG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbFxuICAgICAgJHN0YXRlLmdvICdzaWduX2luJ1xuICAgICAgcmV0dXJuXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignVXNlckNvbnRyb2xsZXInLCBVc2VyQ29udHJvbGxlcikiLCJDcmVhdGVVc2VyQ3RybCA9ICgkaHR0cCwgJHN0YXRlLCBVcGxvYWQsIGxvZGFzaCkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmNoYXJzID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6IUAjJCVeJiooKS0rPD5BQkNERUZHSElKS0xNTk9QMTIzNDU2Nzg5MCdcblxuICAkaHR0cC5nZXQoJy9hcGkvdXNlcnMvY3JlYXRlJylcbiAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICB2bS5lbnVtcyA9IHJlc3BvbnNlLmRhdGFcbiAgICAsIChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuXG4gIHZtLmFkZFVzZXIgPSAoKSAtPlxuICAgIHZtLmRhdGEgPVxuICAgICAgbmFtZTogdm0ubmFtZVxuICAgICAgbGFzdF9uYW1lOiB2bS5sYXN0X25hbWVcbiAgICAgIGluaXRpYWxzOiB2bS5pbml0aWFsc1xuICAgICAgYXZhdGFyOiB2bS5hdmF0YXJcbiAgICAgIGJkYXk6IHZtLmJkYXlcbiAgICAgIGpvYl90aXRsZTogdm0uam9iX3RpdGxlXG4gICAgICB1c2VyX2dyb3VwOiB2bS51c2VyX2dyb3VwXG4gICAgICBjb3VudHJ5OiB2bS5jb3VudHJ5XG4gICAgICBjaXR5OiB2bS5jaXR5XG4gICAgICBwaG9uZTogdm0ucGhvbmVcbiAgICAgIGVtYWlsOiB2bS5lbWFpbFxuICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG5cbiAgICBVcGxvYWQudXBsb2FkKFxuICAgICAgdXJsOiAnL2FwaS91c2VycydcbiAgICAgIG1ldGhvZDogJ1Bvc3QnXG4gICAgICBkYXRhOiB2bS5kYXRhXG4gICAgKS50aGVuICgocmVzcCkgLT5cbiAgICAgICRzdGF0ZS5nbyAndXNlcnMnLCB7IGZsYXNoU3VjY2VzczogJ05ldyB1c2VyIGhhcyBiZWVuIGFkZGVkIScgfVxuICAgICAgcmV0dXJuXG4gICAgKSwgKChlcnJvcikgLT5cbiAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgICAgcmV0dXJuXG4gICAgKVxuXG4gICAgcmV0dXJuXG5cbiAgdm0uZ2VuZXJhdGVQYXNzID0gKCkgLT5cbiAgICB2bS5wYXNzd29yZCA9ICcnXG4gICAgcGFzc0xlbmd0aCA9IGxvZGFzaC5yYW5kb20oOCwxNSlcbiAgICB4ID0gMFxuXG4gICAgd2hpbGUgeCA8IHBhc3NMZW5ndGhcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2bS5jaGFycy5sZW5ndGgpXG4gICAgICB2bS5wYXNzd29yZCArPSB2bS5jaGFycy5jaGFyQXQoaSlcbiAgICAgIHgrK1xuICAgIHJldHVybiB2bS5wYXNzd29yZFxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVVzZXJDdHJsJywgQ3JlYXRlVXNlckN0cmwpIiwiSW5kZXhVc2VyQ3RybCA9ICgkaHR0cCwgJGZpbHRlciwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zKSAtPlxuICB2bSA9IHRoaXNcbiAgdm0uc29ydFJldmVyc2UgPSBudWxsXG4gIHZtLnBhZ2lBcGlVcmwgPSAnL2FwaS91c2VycydcbiAgb3JkZXJCeSA9ICRmaWx0ZXIoJ29yZGVyQnknKVxuICAjIEZsYXNoIGZyb20gb3RoZXJzIHBhZ2VzXG4gIGlmICRzdGF0ZVBhcmFtcy5mbGFzaFN1Y2Nlc3NcbiAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAkc3RhdGVQYXJhbXMuZmxhc2hTdWNjZXNzXG5cbiAgJGh0dHAuZ2V0KCdhcGkvdXNlcnMnKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS51c2VycyA9IHJlc3BvbnNlLmRhdGEuZGF0YVxuICAgIHZtLnBhZ2lBcnIgPSByZXNwb25zZS5kYXRhXG5cbiAgICByZXR1cm5cbiAgLCAoZXJyb3IpIC0+XG4gICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhXG4gICAgcmV0dXJuXG4gIClcblxuICB2bS5zb3J0QnkgPSAocHJlZGljYXRlKSAtPlxuICAgIHZtLnNvcnRSZXZlcnNlID0gIXZtLnNvcnRSZXZlcnNlXG4gICAgJCgnLnNvcnQtbGluaycpLmVhY2ggKCkgLT5cbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygnc29ydC1saW5rIGMtcCcpXG5cbiAgICBpZiB2bS5zb3J0UmV2ZXJzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWFzYycpLmFkZENsYXNzKCdhY3RpdmUtZGVzYycpXG4gICAgZWxzZVxuICAgICAgJCgnIycrcHJlZGljYXRlKS5yZW1vdmVDbGFzcygnYWN0aXZlLWRlc2MnKS5hZGRDbGFzcygnYWN0aXZlLWFzYycpO1xuXG4gICAgdm0ucHJlZGljYXRlID0gcHJlZGljYXRlXG4gICAgdm0ucmV2ZXJzZSA9IGlmICh2bS5wcmVkaWNhdGUgPT0gcHJlZGljYXRlKSB0aGVuICF2bS5yZXZlcnNlIGVsc2UgZmFsc2VcbiAgICB2bS51c2VycyA9IG9yZGVyQnkodm0udXNlcnMsIHByZWRpY2F0ZSwgdm0ucmV2ZXJzZSlcblxuICAgIHJldHVyblxuXG4gIHZtLmRlbGV0ZVVzZXIgPSAoaWQsIGluZGV4KSAtPlxuICAgIGNvbmZpcm1hdGlvbiA9IGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuXG4gICAgaWYgY29uZmlybWF0aW9uXG4gICAgICAkaHR0cC5kZWxldGUoJy9hcGkvdXNlcnMvJyArIGlkKS50aGVuICgocmVzcG9uc2UpIC0+XG4gICAgICAgICMgRGVsZXRlIGZyb20gc2NvcGVcbiAgICAgICAgdm0udXNlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB2bS5mbGFzaFN1Y2Nlc3MgPSAnVXNlciBkZWxldGVkISdcblxuICAgICAgICByZXR1cm5cbiAgICAgICksIChlcnJvcikgLT5cbiAgICAgICAgdm0uZXJyb3IgPSBlcnJvclxuICAgIHJldHVyblxuXG4gIHJldHVyblxuXG4ndXNlIHN0cmljdCdcbmFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwJylcbiAgLmNvbnRyb2xsZXIoJ0luZGV4VXNlckN0cmwnLCBJbmRleFVzZXJDdHJsKVxuIiwiU2hvd1VzZXJDdHJsID0gKCRodHRwLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSkgLT5cbiAgdm0gPSB0aGlzXG4gIHZtLmlkID0gJHN0YXRlUGFyYW1zLmlkXG4gIHZtLnNldHRpbmdzID1cbiAgICBsaW5lV2lkdGg6IDUsXG4gICAgdHJhY2tDb2xvcjogJyNlOGVmZjAnLFxuICAgIGJhckNvbG9yOiAnIzI3YzI0YycsXG4gICAgc2NhbGVDb2xvcjogZmFsc2UsXG4gICAgY29sb3I6ICcjM2EzZjUxJyxcbiAgICBzaXplOiAxMzQsXG4gICAgbGluZUNhcDogJ2J1dHQnLFxuICAgIHJvdGF0ZTogLTkwLFxuICAgIGFuaW1hdGU6IDEwMDBcblxuICAkaHR0cC5nZXQoJ2FwaS91c2Vycy8nK3ZtLmlkKS50aGVuKChyZXNwb25zZSkgLT5cbiAgICB2bS5vYmogPSByZXNwb25zZS5kYXRhXG4gICAgaWYgdm0ub2JqLmF2YXRhciA9PSAnZGVmYXVsdF9hdmF0YXIuanBnJ1xuICAgICAgdm0ub2JqLmF2YXRhciA9ICcvaW1hZ2VzLycgKyB2bS5vYmouYXZhdGFyXG4gICAgZWxzZVxuICAgICAgdm0ub2JqLmF2YXRhciA9ICd1cGxvYWRzL2F2YXRhcnMvJyArIHZtLm9iai5hdmF0YXJcbiAgICB2bS5vYmouYmRheSA9IG1vbWVudChuZXcgRGF0ZSh2bS5vYmouYmRheSkpLmZvcm1hdCgnREQuTU0uWVlZWScpXG4gICAgcmV0dXJuXG4gICwgKGVycm9yKSAtPlxuICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YVxuICAgIHJldHVyblxuICApXG5cbiAgcmV0dXJuXG5cbid1c2Ugc3RyaWN0J1xuYW5ndWxhclxuICAubW9kdWxlKCdhcHAnKVxuICAuY29udHJvbGxlcignU2hvd1VzZXJDdHJsJywgU2hvd1VzZXJDdHJsKSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
