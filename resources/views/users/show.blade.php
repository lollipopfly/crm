@extends('layouts.layout')
@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-b-sm font-thin h3">{{ $user->name }}</h1>
        <a href="/users/" class="btn btn-default"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back</a>
    </div>

    <div class="wrapper-md">
        <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <label tooltip="Редактировать" class="i-switch bg-success pull-right" ng-init="showSpline=false">
                            <input type="checkbox" ng-model="showSpline" class="ng-valid ng-dirty ng-valid-parse ng-touched">
                            <i></i>
                        </label>
                        <div class="clearfix text-center m-t">
                            <div class="inline">
                                <div
                                    ui-jq="easyPieChart"
                                    ui-options="{
                                        percent: 75,
                                        lineWidth: 5,
                                        trackColor: '#e8eff0',
                                        barColor: '#27c24c',
                                        scaleColor: false,
                                        color: '#3a3f51',
                                        size: 134,
                                        lineCap: 'butt',
                                        rotate: -90,
                                        animate: 1000
                                        }"
                                    class="easyPieChart"
                                    style="width: 134px; height: 134px; line-height: 134px;">
                                    <div class="thumb-xl">
                                        <img src="/uploads/avatars/{!! $user->avatar !!}" class="img-circle w-full">
                                    </div>
                                </div>
                                <div class="h4 m-t m-b-xs">{{ $user->name }} @if($user->last_name) {{ $user->last_name }} @endif</div>
                                <small class="text-muted m-b">24.02.1983</small>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-user text"></i> Name:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($user->name)
                                        {{ $user->name }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-users text"></i> Last name:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($user->last_name)
                                        {{ $user->last_name }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-bag text"></i> Job title:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($user->job_title)
                                        {{ $user->job_title }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-direction text"></i> Country:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($user->country)
                                        {{ $user->country }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-home text"></i> City:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($user->city)
                                        {{ $user->city }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-screen-smartphone text"></i> Phone:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($user->phone)
                                        {{ $user->phone }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-envelope-letter text"></i> Email:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($user->email)
                                        {{ $user->email }}
                                    @endif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop