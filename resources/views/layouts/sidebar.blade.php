<!-- aside -->
<aside id="aside" class="app-aside hidden-xs bg-dark" ng-if="authenticated">
  <div class="aside-wrap">
    <div class="navi-wrap">
      <!-- user -->
      <div class="clearfix hidden-xs text-center hide" id="aside-user">
        <div class="dropdown wrapper">
          <a href="app.page.profile">
            <span class="thumb-lg w-auto-folded avatar m-t-sm">
              <img ng-src="@{{ currentUser.avatar }}" class="img-full">
            </span>
          </a>
          <a href="#" data-toggle="dropdown" class="dropdown-toggle hidden-folded">
        <span class="clear">
         <span class="block m-t-sm">
          <strong ng-if="currentUser.name" class="font-bold text-lt">@{{ currentUser.name }}.@{{ currentUser.last_name }}</strong>
          <b class="caret"></b>
         </span>
         <span ng-if="currentUser.job_title" class="text-muted text-xs block">@{{ currentUser.job_title }}</span>
        </span>
          </a>
          <!-- dropdown -->
          <ul class="dropdown-menu animated fadeInRight w hidden-folded">
            <li>
              <a href="{{ url('/profile/') }}">Profile</a>
            </li>
            <li>
              <a href="{{ url('/profile/edit/') }}">Edit</a>
            </li>
            <li class="divider"></li>
            <li>
              <a href="#" ng-click="logout()">Logout</a>
            </li>
          </ul>
          <!-- / dropdown -->
        </div>
        <div class="line dk hidden-folded"></div>
      </div>
      <!-- / user -->

      <!-- nav -->
      <nav ui-nav class="navi clearfix">
        <ul class="nav">
          <li class="hidden-folded padder m-t m-b-sm text-muted text-xs">
            <span>Navigation</span>
          </li>
          <li>
            <a href="{{ url('/routes/') }}" class="auto">
              <i class="glyphicon glyphicon-road icon"></i>
              <span>Routes</span>
            </a>
          </li>
          <li>
            <a href="{{ url('/stores/') }}" class="auto">
              <i class="glyphicon glyphicon-shopping-cart icon"></i>
              <span>Stores</span>
            </a>
          </li>
          <li>
            <a href="{{ url('/users/') }}" class="auto">
              <i class="glyphicon glyphicon-user icon"></i>
              <span>Users</span>
            </a>
          </li>
          <li>
            <a href="{{ url('/map/') }}" class="auto">
              <i class="glyphicon glyphicon-map-marker icon"></i>
              <span>Map</span>
            </a>
          </li>
          <li class="line dk hidden-folded"></li>
        </ul>
      </nav>
      <!-- nav -->
    </div>
  </div>
</aside>
<!-- / aside -->
