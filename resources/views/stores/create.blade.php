@extends('layouts.layout')

@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-b-sm font-thin h3">Create new store</h1>
        <a href="{{ url('/stores/') }}" class="btn btn-default"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back</a>
    </div>

    <div class="wrapper-md" ng-controller="createUserCtrl">
        <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
                <div class="panel panel-default">
                    <div class="panel-body">
                        {!! Form::open(['url' => '/stores', 'class' => 'form-horizontal']) !!}
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa fa-building-o text"></i> Name:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('name') ? 'has-error' : '' }}">
                                    {!! Form::text('name', null, ['class' => 'form-control', 'required' => 'required']) !!}
                                    {{-- @if ($errors->has('name'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('name') }}</strong>
                                        </span>
                                    @endif --}}
                                    {!! $errors->first('name', '<p class="help-block">:message</p>') !!}
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-map text"></i> Address:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('address') ? 'has-error' : '' }}">
                                    {!! Form::text('address', null, ['class' => 'form-control', 'required' => 'required']) !!}
                                    {!! $errors->first('address', '<p class="help-block">:message</p>') !!}
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-screen-smartphone text"></i> Phone:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('phone') ? 'has-error' : '' }}">
                                    {!! Form::text('phone', null, ['class' => 'form-control', 'required' => 'required']) !!}
                                    {!! $errors->first('phone', '<p class="help-block">:message</p>') !!}
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-envelope-open text"></i> Email:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('email') ? 'has-error' : '' }}">
                                    {!! Form::text('email', null, ['class' => 'form-control']) !!}
                                    {!! $errors->first('email', '<p class="help-block">:message</p>') !!}
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-user text"></i> Owner name:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('owner_name') ? 'has-error' : '' }}">
                                    {!! Form::text('owner_name', null, ['class' => 'form-control']) !!}
                                    {!! $errors->first('owner_name', '<p class="help-block">:message</p>') !!}
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                            <div class="col-md-4"></div>
                                <div class="col-xs-7 text-right">
                                    {!! Form::submit('create', ['class' => 'btn btn-primary text-u-c']) !!}
                                </div>
                            </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection