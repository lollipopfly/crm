@include('layouts.header')
@include('layouts.sidebar')
<div id="content" ng-class="{'app-content': authenticated}" role="main">
    <div class="app-content-body">
      <div ui-view></div>
    </div>
</div>
@include('layouts.footer')