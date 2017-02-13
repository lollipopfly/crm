<!DOCTYPE html>
<html lang="en" class="">
    <head>
        <meta charset="utf-8" />
        <title>Laravel & Angular CRM</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="stylesheet" href="{!! asset('build/css/style.css') !!}">
    </head>
    <body>
        <div class="app app-header-fixed ">
            <div class="container w-xxl w-auto-xs" ng-init="app.settings.container = false;">
                <div class="text-center m-b-lg">
                    <h1 class="text-shadow text-white">404</h1>
                </div>
                <div class="list-group bg-info auto m-b-sm m-b-lg">
                    <a href="/" class="list-group-item">
                        <i class="fa fa-chevron-right text-muted"></i>
                        <i class="fa fa-fw fa-mail-forward m-r-xs"></i> Goto application
                    </a>
                    <a href="/user/sign_in" class="list-group-item">
                        <i class="fa fa-chevron-right text-muted"></i>
                        <i class="fa fa-fw fa-sign-in m-r-xs"></i> Sign in
                    </a>
                    <a href="/user/sign_up" class="list-group-item">
                        <i class="fa fa-chevron-right text-muted"></i>
                        <i class="fa fa-fw fa-unlock-alt m-r-xs"></i> Sign up
                    </a>
                </div>
                <div class="text-center">
                    <p>
                        <small class="text-muted">Web app base on Laravel and AngularJS<br>&copy; 2016</small>
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
