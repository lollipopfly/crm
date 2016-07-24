<!-- aside -->
<aside id="aside" class="app-aside hidden-xs bg-dark">
    <div class="aside-wrap">
        <div class="navi-wrap">
            <!-- user -->
            <div class="clearfix hidden-xs text-center hide" id="aside-user">
                <div class="dropdown wrapper">
                    <a href="app.page.profile">
                        <span class="thumb-lg w-auto-folded avatar m-t-sm">
                            <img src="/uploads/avatars/{!! Auth::user()->avatar !!}" class="img-full">
                        </span>
                    </a>
                    <a href="#" data-toggle="dropdown" class="dropdown-toggle hidden-folded">
                <span class="clear">
                  <span class="block m-t-sm">
                      @if(Auth::user()->name)
                        <strong class="font-bold text-lt">{!! Auth::user()->name !!}.{!! Auth::user()->last_name !!}</strong>
                      @endif
                    <b class="caret"></b>
                  </span>
                    @if(Auth::user()->job_titile)
                        <span class="text-muted text-xs block">{!! Auth::user()->job_title !!}</span>
                    @endif
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
                        <li>
                            <a href>
                                <span class="badge bg-danger pull-right">3</span>
                                Notifications
                            </a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="{{ url('/logout/') }}">Logout</a>
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
                        <a href class="auto">
                  <span class="pull-right text-muted">
                    <i class="fa fa-fw fa-angle-right text"></i>
                    <i class="fa fa-fw fa-angle-down text-active"></i>
                  </span>
                            <i class="glyphicon glyphicon-stats icon text-primary-dker"></i>
                            <span class="font-bold">Dashboard</span>
                        </a>
                        <ul class="nav nav-sub dk">
                            <li class="nav-sub-header">
                                <a href>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="index.html">
                                    <span>Dashboard v1</span>
                                </a>
                            </li>
                            <li>
                                <a href="dashboard.html">
                                    <b class="label bg-info pull-right">N</b>
                                    <span>Dashboard v2</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="mail.html">
                            <b class="badge bg-info pull-right">9</b>
                            <i class="glyphicon glyphicon-envelope icon text-info-lter"></i>
                            <span class="font-bold">Email</span>
                        </a>
                    </li>
                    <li class="line dk"></li>

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
                    <li class="line dk hidden-folded"></li>
                </ul>
            </nav>
            <!-- nav -->
        </div>
    </div>
</aside>
<!-- / aside -->