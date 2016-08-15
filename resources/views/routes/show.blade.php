@extends('layouts.layout')

@section('content')
<div ng-controller="showRouteCtrl">
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-b-sm font-thin h3">Route #{{ $route->id }}</h1>
        <a href="{{ url('/routes/') }}" class="btn btn-default"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back</a>
        @if (Auth::user()->user_group === 'admin')
            <a href="{{ url('routes/' . $route->id . '/edit') }}" class="btn btn-primary">Edit</a>
            <a href="#" class="btn btn-danger" ng-click="deleteRoute({{ $route->id }})">Delete</a>
        @endif
    </div>

    <div class="wrapper-md">
        <div class="row">
            <div class="col-lg-6">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-user text"></i> Driver:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($route->user->name)
                                        {{ $route->user->name }} {{ $route->user->last_name }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-calendar text"></i> Date:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($route->date)
                                        {{ $route->date }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <table class="table table-striped b-a" ng-if="pointForms">
                            <thead>
                                <tr>
                                    <th class="text-u-c">#</th>
                                    <th class="text-u-c">Store</th>
                                    <th class="text-u-c">Deadline Time</th>
                                    <th class="text-u-c">Products</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr ng-repeat="form in pointForms">
                                    <td>@{{ $index+1 }}</td>
                                    <td>
                                        @foreach ($stores as $store)
                                            <a href="{{ url('stores/'.$store->id) }}" ng-if="form.store_id == <?=$store->id?>" class="text-info">{{ $store->name }}</a>
                                        @endforeach
                                    </td>
                                    <td>@{{ form.deadline_time | amDateFormat:'hh:mm:ss a' }}</td>
                                    <td>@{{ form.products }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <div id="route-map"></div>
            </div>
        </div>

    </div>
</div>
@endsection