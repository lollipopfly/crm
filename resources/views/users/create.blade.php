@extends('layouts.layout')
@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-b-sm font-thin h3">Create user</h1>
        <a href="/users/" class="btn btn-default"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back</a>
    </div>

    <div class="wrapper-md">
        <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
                <div class="panel panel-default">
                    <div class="panel-body">
                        {!! Form::open(['url' => 'users', 'files' => true, 'method' => 'POST']) !!}
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3">
                                    <div class="col text-left w-sm">
                                      <div class="thumb-lg avatar inline">
                                        <img class="" src="{{ asset('uploads/avatars/default.jpg') }}">
                                      </div>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <div class="margin-top-25"
                                        file_field
                                        attr-name="avatar"
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-user text"></i> Name:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('name') ? 'has-error' : '' }}">
                                    {!! Form::text('name', old('name'), array('class' => 'form-control'));!!}
                                    @if ($errors->has('name'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('name') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-users text"></i> Last name:</span>
                                </div>
                                <div class="col-md-7">
                                    {!! Form::text('last_name', old('last_name'), array('class' => 'form-control'));!!}
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-heart text"></i> Initials:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('initials') ? 'has-error' : '' }}">
                                    {!! Form::text('initials', old('initials'), array('class' => 'form-control'));!!}
                                    @if ($errors->has('initials'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('initials') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-calendar text"></i> Birthday:</span>
                                </div>
                                <div class="col-md-7">
                                    <datetimepicker
                                        attr-name="'bday'">
                                    </datetimepicker>
                                </div>
                            </div>

                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-bag text"></i> Job title:</span>
                                </div>
                                <div class="col-md-7">
                                    {!! Form::text('job_title', old('job_title'), array('class' => 'form-control'));!!}
                                </div>
                            </div>
                            <div class="line line-dashed b-b line-lg pull-in"></div>

                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-map text"></i> Country:</span>
                                </div>
                                <div class="col-md-7">
                                    {!! Form::text('country', old('country'), array('class' => 'form-control'));!!}
                                </div>
                            </div>
                            <div class="line line-dashed b-b line-lg pull-in"></div>

                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-direction text"></i> City:</span>
                                </div>
                                <div class="col-md-7">
                                    {!! Form::text('city', old('city'), array('class' => 'form-control'));!!}
                                </div>
                            </div>
                            <div class="line line-dashed b-b line-lg pull-in"></div>

                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-screen-smartphone text"></i> Phone:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('phone') ? 'has-error' : '' }}">
                                    {!! Form::text('phone', old('phone'), array('class' => 'form-control'));!!}
                                    @if ($errors->has('phone'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('phone') }}</strong>
                                        </span>
                                    @endif
                                </div>
                            </div>
                            <div class="line line-dashed b-b line-lg pull-in"></div>

                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-envelope-letter text"></i> Email:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('email') ? 'has-error' : '' }}">
                                    {!! Form::text('email', old('email'), array('class' => 'form-control'));!!}
                                    @if ($errors->has('email'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('email') }}</strong>
                                        </span>
                                    @endif
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
@stop