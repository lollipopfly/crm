pagination = ($http) ->
  directive = {
    restrict: 'EA'
    templateUrl: 'views/directives/pagination.html'
    controllerAs: 'vm',
    controller: '@'
    name: 'ctrl',
    bindToController: true
    scope: {
      pagiArr: '='
      items: '='
      pagiApiUrl: '='
    }
    link: (scope, element, attr) ->
      scope.$watch (->
        scope.vm.pagiArr
      ), ((newValue, oldValue) ->
        if !angular.equals(oldValue, newValue)
          scope.vm.pagiArr = newValue
          scope.vm.totalPages = scope.vm.pagiArr.last_page
          scope.vm.currentPage = scope.vm.pagiArr.current_page
          scope.vm.total = scope.vm.pagiArr.total
          scope.vm.perPage = scope.vm.pagiArr.per_page

          # Pagination Range
          scope.vm.painationRange(scope.vm.totalPages)

        return
      ), true

      scope.vm.getPosts = (pageNumber) ->
        if pageNumber == undefined
          pageNumber = '1'
        $http.get(scope.vm.pagiApiUrl+'?page=' + pageNumber).success (response) ->
          scope.vm.items = response.data
          scope.vm.totalPages = response.last_page
          scope.vm.currentPage = response.current_page

          # Pagination Range
          scope.vm.painationRange(scope.vm.totalPages)
          return
        return

      scope.vm.painationRange = (totalPages) ->
        pages = []
        i = 1
        while i <= totalPages
          pages.push i
          i++
        scope.vm.range = pages
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'pagination', pagination