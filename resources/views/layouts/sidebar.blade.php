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
                            <a href="/profile/">Profile</a>
                        </li>
                        <li>
                            <a href="/profile/edit">Edit</a>
                        </li>
                        <li>
                            <a href>
                                <span class="badge bg-danger pull-right">3</span>
                                Notifications
                            </a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="/logout/">Logout</a>
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
                        <a href class="auto">
                  <span class="pull-right text-muted">
                    <i class="fa fa-fw fa-angle-right text"></i>
                    <i class="fa fa-fw fa-angle-down text-active"></i>
                  </span>
                            <b class="badge bg-info pull-right">3</b>
                            <i class="glyphicon glyphicon-th"></i>
                            <span>Layout</span>
                        </a>
                        <ul class="nav nav-sub dk">
                            <li class="nav-sub-header">
                                <a href>
                                    <span>Layout</span>
                                </a>
                            </li>
                            <li>
                                <a href="layout_app.html">
                                    <span>Application</span>
                                </a>
                            </li>
                            <li>
                                <a href="layout_fullwidth.html">
                                    <span>Full width</span>
                                </a>
                            </li>
                            <li>
                                <a href="layout_boxed.html">
                                    <span>Boxed layout</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href class="auto">
                  <span class="pull-right text-muted">
                    <i class="fa fa-fw fa-angle-right text"></i>
                    <i class="fa fa-fw fa-angle-down text-active"></i>
                  </span>
                            <i class="glyphicon glyphicon-briefcase icon"></i>
                            <span>UI Kits</span>
                        </a>
                        <ul class="nav nav-sub dk">
                            <li class="nav-sub-header">
                                <a href>
                                    <span>UI Kits</span>
                                </a>
                            </li>
                            <li>
                                <a href="ui_button.html">
                                    <span>Buttons</span>
                                </a>
                            </li>
                            <li>
                                <a href="ui_icon.html">
                                    <b class="badge bg-info pull-right">3</b>
                                    <span>Icons</span>
                                </a>
                            </li>
                            <li>
                                <a href="ui_grid.html">
                                    <span>Grid</span>
                                </a>
                            </li>
                            <li>
                                <a href="ui_widget.html">
                                    <b class="badge bg-success pull-right">13</b>
                                    <span>Widgets</span>
                                </a>
                            </li>
                            <li>
                                <a href="ui_sortable.html">
                                    <span>Sortable</span>
                                </a>
                            </li>
                            <li>
                                <a href="ui_portlet.html">
                                    <span>Portlet</span>
                                </a>
                            </li>
                            <li>
                                <a href="ui_timeline.html">
                                    <span>Timeline</span>
                                </a>
                            </li>
                            <li>
                                <a href="ui_jvectormap.html">
                                    <span>Vector Map</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href class="auto">
                  <span class="pull-right text-muted">
                    <i class="fa fa-fw fa-angle-right text"></i>
                    <i class="fa fa-fw fa-angle-down text-active"></i>
                  </span>
                            <b class="label bg-primary pull-right">2</b>
                            <i class="glyphicon glyphicon-list"></i>
                            <span>Table</span>
                        </a>
                        <ul class="nav nav-sub dk">
                            <li class="nav-sub-header">
                                <a href>
                                    <span>Table</span>
                                </a>
                            </li>
                            <li>
                                <a href="table_static.html">
                                    <span>Table static</span>
                                </a>
                            </li>
                            <li>
                                <a href="table_datatable.html">
                                    <span>Datatable</span>
                                </a>
                            </li>
                            <li>
                                <a href="table_footable.html">
                                    <span>Footable</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href class="auto">
                  <span class="pull-right text-muted">
                    <i class="fa fa-fw fa-angle-right text"></i>
                    <i class="fa fa-fw fa-angle-down text-active"></i>
                  </span>
                            <i class="glyphicon glyphicon-edit"></i>
                            <span>Form</span>
                        </a>
                        <ul class="nav nav-sub dk">
                            <li class="nav-sub-header">
                                <a href>
                                    <span>Form</span>
                                </a>
                            </li>
                            <li>
                                <a href="form_element.html">
                                    <span>Form elements</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="ui_chart.html">
                            <i class="glyphicon glyphicon-signal"></i>
                            <span>Chart</span>
                        </a>
                    </li>
                    <li>
                        <a href class="auto">
                  <span class="pull-right text-muted">
                    <i class="fa fa-fw fa-angle-right text"></i>
                    <i class="fa fa-fw fa-angle-down text-active"></i>
                  </span>
                            <i class="glyphicon glyphicon-file icon"></i>
                            <span>Pages</span>
                        </a>
                        <ul class="nav nav-sub dk">
                            <li class="nav-sub-header">
                                <a href>
                                    <span>Pages</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_profile.html">
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_post.html">
                                    <span>Post</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_search.html">
                                    <span>Search</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_invoice.html">
                                    <span>Invoice</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_price.html">
                                    <span>Price</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_lockme.html">
                                    <span>Lock screen</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_signin.html">
                                    <span>Signin</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_signup.html">
                                    <span>Signup</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_forgotpwd.html">
                                    <span>Forgot password</span>
                                </a>
                            </li>
                            <li>
                                <a href="page_404.html">
                                    <span>404</span>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="line dk hidden-folded"></li>
                </ul>
            </nav>
            <!-- nav -->
        </div>
    </div>
</aside>
<!-- / aside -->