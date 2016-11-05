pagination = ($http) ->
  directive = {
    restrict: 'EA'
    templateUrl: 'views/directives/pagination.html'
    scope: {
      pagiArr: '='
      items: '='
      pagiApiUrl: '='
    }
    link: (scope, element, attr) ->
      scope.$watch (->
        scope.pagiArr
      ), ((newValue, oldValue) ->
        if !angular.equals(oldValue, newValue)
          scope.pagiArr = newValue
          scope.totalPages = scope.pagiArr.last_page
          scope.currentPage = scope.pagiArr.current_page
          scope.total = scope.pagiArr.total
          scope.perPage = scope.pagiArr.per_page

          # Pagination Range
          scope.painationRange(scope.totalPages)

        return
      ), true

      scope.getPosts = (pageNumber) ->
        if pageNumber == undefined
          pageNumber = '1'
        $http.get(scope.pagiApiUrl+'?page=' + pageNumber).success (response) ->
          console.log(response);
          scope.items = response.data
          scope.totalPages = response.last_page
          scope.currentPage = response.current_page

          # Pagination Range
          scope.painationRange(scope.totalPages)
          return
        return

      scope.painationRange = (totalPages) ->
        pages = []
        i = 1
        while i <= totalPages
          pages.push i
          i++
        scope.range = pages
  }

  return directive

'use strict'
angular
  .module('app')
  .directive 'pagination', pagination