@extends('layouts.layout')

@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-r-md inline media-middle font-thin h3">Routes</h1>
        @if (Auth::user()->user_group === 'admin')
            <a href="routes/create" class="btn btn-primary"><i class="fa fa-plus m-r-xs"></i>Add new route</a>
        @endif
    </div>

    <div class="wrapper-md">
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
                                    <td>{{ $route->user->name . ' ' . $route->user->last_name }}</td>
                                    <td>{{ $route->date }}</td>
                                    <td>
                                       <uib-progressbar class="progress-striped active" max="200" value="166" type="danger"><i>166 / 200</i></uib-progressbar>
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
