@extends('layouts.layout')

@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-r-md inline media-middle font-thin h3">Routes</h1>
        @if (Auth::user()->user_group === 'admin')
            <a href="routes/create" class="btn btn-primary"><i class="fa fa-plus m-r-xs"></i>Add new route</a>
        @endif
    </div>

    <div class="wrapper-md" ng-controller="indexRouteCtrl">
        {{-- Flash message --}}
        @if(Session::has('flash_message'))
            <div class="row">
                <div class="col-xs-12">
                    <p class="alert alert-success">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>
                        <strong>{!! Session::get('flash_message') !!}</strong>
                    </p>
                </div>
            </div>
        @endif

        <div class="row">
            <div class="col-xs-12">
                <div class="panel panel-default">
                    <table class="table table-striped m-b-none table-layout-fixed">
                        <thead>
                            <tr>
                                <th class="sorting v-top">{!! orderLink('Id', 'id', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Driver name', '', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Date', 'date', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Progress', '', 'asc') !!}</th>
                                @if (Auth::user()->user_group === 'admin')
                                    <th class="text-right">Actions</th>
                                @endif
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($routes as $route)
                                <tr>
                                    <td><a class="text-info" href="routes/{{$route->id}}">{{ $route->id }}</a></td>
                                    <td>{{ $route->user_name }}</td>
                                    <td>{{ $route->date }}</td>
                                    <td>
                                        <div class="progress ng-isolate-scope" animate="false" value="dynamic" type="success">
                                          <div class="progress-bar progress-bar-success" ng-class="type &amp;&amp; 'progress-bar-' + type" role="progressbar" aria-valuenow="47" aria-valuemin="0" aria-valuemax="100" ng-style="{width: (percent < 100 ? percent : 100) + '%'}" aria-valuetext="47%" aria-labelledby="progressbar" ng-transclude="" style="transition: none; width: 47%;"><b class="ng-binding ng-scope">47%</b></div>
                                        </div>
                                    </td>
                                    @if (Auth::user()->user_group === 'admin')
                                        <td class="text-right">
                                            <a href="" ng-click="deleteRoute({{$route->id}})" target="_self" tooltip-placement="top-right" uib-tooltip="Delete route">
                                                <i class="fa fa-close c-p f-z-20 color-red"></i>
                                            </a>
                                        </td>
                                    @endif
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="text-right">
            {!! $routes->appends(Request::input())->render() !!}
        </div>

    </div>


@endsection
