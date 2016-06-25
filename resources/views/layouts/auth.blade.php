<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel & Angular CRM</title>
    <link rel="stylesheet" href="{!! asset('build/css/style.css') !!}">

</head>
<body>
    @yield('content')
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js"></script>
    <script src="{!! asset('build/js/global.min.js') !!}"></script>
    <script src="{!! asset('build/js/app.js') !!}"></script>
</body>
</html>
