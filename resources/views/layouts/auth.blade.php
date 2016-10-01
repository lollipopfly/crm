<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
    <base href="/" />
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel & Angular CRM</title>
    <link rel="stylesheet" href="{!! asset('build/css/style.css') !!}">

</head>
<body>
      <div ui-view></div>
    {{-- @yield('content') --}}
    <script src="{!! asset('build/js/global.min.js') !!}"></script>
    <script src="{!! asset('build/js/app.js') !!}"></script>
</body>
</html>
