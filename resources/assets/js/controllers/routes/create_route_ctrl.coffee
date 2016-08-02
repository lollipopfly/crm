app.controller 'createRouteCtrl', ($scope, $http, $compile) ->
  $scope.users = ''
  counter = 1
  $http.get('/stores/getallstores').then (response) ->
    $scope.stores = response.data

  $scope.pointForm = '<div class="point-forms__item">
    <div class="line line-dashed b-b line-lg pull-in"></div>
    <div class="row">
        <div class="col-md-6">
            <label>Store</label>
            <select name="store_id_'+counter+'" class="form-control m-b">
                <option selected="selected" value="">Select Store...</option>
                <option ng-repeat="store in stores" value="{{store.id}}">{{store.name}}</option>
            </select>

            <timepicker
                label="\'Deadline\'"
                ng-model="time_'+counter+'"
                attr-name="\'time_'+counter+'\'"
            ></timepicker>
        </div>
        <div class="col-md-6">
            <label>Orders</label>
            <textarea name="orders_'+counter+'" cols="50" rows="7" class="form-control m-b-sm"></textarea>
            <button class="btn pull-right btn-danger" type="button" ng-click="removePoint($event)">Delete</button>
        </div>
    </div>
    </div>'

  $scope.addPoint = () ->
      compiledeHTML = $compile($scope.pointForm)($scope)
      elem = angular.element(document.querySelector('.point-forms'))
      elem.append(compiledeHTML)
      counter++

  $scope.removePoint = ($event) ->
    elem = angular.element($event.target)
    $($event.target).closest('.point-forms__item').remove()


