<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
  <base href="/">
  <meta charset="utf-8" />
  <title>Laravel & Angular CRM</title>
  <meta name="description" content="Crm system" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="stylesheet" href="{!! asset('build/css/style.css') !!}">
  <link rel="icon" type="image/png" href="{!! asset('favicon.png') !!}" />
</head>
<body ng-cloak>
<div class="app app-header-fixed ">
  <!-- header -->
  <header id="header" class="app-header navbar" role="menu" ng-if="authenticated">
    <!-- navbar header -->
    <div class="navbar-header bg-dark">
      <button class="pull-right visible-xs dk" ui-toggle-class="show" target=".navbar-collapse">
        <i class="glyphicon glyphicon-cog"></i>
      </button>
      <button class="pull-right visible-xs" ui-toggle-class="off-screen" target=".app-aside" ui-scroll="app">
        <i class="glyphicon glyphicon-align-justify"></i>
      </button>
      <!-- brand -->
      <a href="/" class="navbar-brand text-lt">
        <div class="logo"></div>
        <span class="hidden-folded m-l-xs logo-text">Ice Road</span>
      </a>
      <!-- / brand -->
    </div>
    <!-- / navbar header -->

    <!-- navbar collapse -->
    <div class="collapse pos-rlt navbar-collapse box-shadow bg-white-only">
      <!-- buttons -->
      <div class="nav navbar-nav hidden-xs">
        <a href="#" class="btn no-shadow navbar-btn" ui-toggle-class="app-aside-folded" target=".app">
          <i class="fa fa-dedent fa-fw text"></i>
          <i class="fa fa-indent fa-fw text-active"></i>
        </a>
        <a href="#" class="btn no-shadow navbar-btn" ui-toggle-class="show" target="#aside-user">
          <i class="icon-user fa-fw"></i>
        </a>
      </div>
      <!-- / buttons -->

      <!-- link and dropdown -->
      <ul class="nav navbar-nav hidden-sm">
        <li class="dropdown">
          <a href="#" data-toggle="dropdown" class="dropdown-toggle">
            <i class="fa fa-fw fa-plus visible-xs-inline-block"></i>
            <span translate="header.navbar.new.NEW">New</span> <span class="caret"></span>
          </a>
          <ul class="dropdown-menu" role="menu">
           <li ng-if="currentUser.user_group == 'admin'">
             <a href="{{ url('/routes/create') }}">
               <i class="f-z-12 glyphicon glyphicon-road color-gray mr-3"></i>
               <span>Route</span>
             </a>
           </li>
           <li ng-if="currentUser.user_group == 'admin'"><a href="{{ url('/stores/create') }}">
            <i class="f-z-12 glyphicon glyphicon-shopping-cart color-gray mr-3"></i>
           Store</a></li>
           <li ng-if="currentUser.user_group == 'admin'"><a href="{{ url('/users/create') }}" > <i class="f-z-12 glyphicon glyphicon-user color-gray mr-5"></i>User</a></li>
          </ul>
        </li>
      </ul>
      <!-- / link and dropdown -->

      <!-- nabar right -->
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a href="#" data-toggle="dropdown" class="dropdown-toggle clear" data-toggle="dropdown">
           <span class="thumb-sm avatar pull-right m-t-n-sm m-b-n-sm m-l-sm">
            <img ng-src="@{{ currentUser.avatar }}">
            <i class="on md b-white bottom"></i>
           </span>
           <span class="hidden-sm hidden-md">@{{ currentUser.name }}</span> <b class="caret"></b>
          </a>
          <!-- dropdown -->
          <ul class="dropdown-menu animated fadeInRight w">
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="/profile/edit">
                <span>Edit</span>
              </a>
            </li>
            <li class="divider"></li>
            <li><a href="#" ng-click="logout()">Logout</a></li>
          </ul>
          <!-- / dropdown -->
        </li>
      </ul>
      <!-- / navbar right -->
    </div>
    <!-- / navbar collapse -->
  </header>
  <!-- / header -->
