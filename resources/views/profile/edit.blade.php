@extends('layouts.layout')
@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-n font-thin h3">Edit Profile</h1>
    </div>

    <div class="wrapper-md">
        <div class="row">
            {!! Form::open(array('action' => ['Profile\ProfileController@update', $user->id], 'method' => 'POST', 'files'=> true)) !!}
                <div class="col-sm-6">
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-xs-8 col-sm-6 col-md-8">
                                    <div class="form-group">
                                        {!! Form::label('avatar', 'Avatar') !!}
                                        <div
                                            file-field
                                            attr-name="'avatar'"
                                            attr-id="'filestyle-avatar'"
                                        ></div>
                                    </div>
                                </div>
                                <div class="col-xs-4 col-sm-6 col-md-4">
                                    <div class="thumb-md pull-right margin-top-10">
                                        <img src="/uploads/avatars/{!! $user->avatar !!}" class="img-circle">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                {!! Form::label('name', 'Name') !!}
                                {!! Form::text('name', $user->name, array('class' => 'form-control')); !!}
                            </div>
                            <div class="form-group">
                                {!! Form::label('last_name', 'Last name') !!}
                                {!! Form::text('last_name', $user->last_name, array('class' => 'form-control')); !!}
                            </div>
                            <div class="form-group {{ $errors->has('initials') ? ' has-error' : '' }}">
                                {!! Form::label('initials', 'Initials') !!}
                                {!! Form::text('initials', $user->initials, array('class' => 'form-control')); !!}
                                @if ($errors->has('initials'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('initials') }}</strong>
                                    </span>
                                @endif
                            </div>
                            <div class="form-group {{ $errors->has('email') ? ' has-error' : '' }}">
                                {!! Form::label('email', 'Email') !!}
                                {!! Form::email('email', $user->email, array('class' => 'form-control')); !!}
                                @if ($errors->has('email'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                            <div class="form-group">
                                {!! Form::label('phone', 'Phone') !!}
                                {!! Form::text('phone', $user->phone, array('class' => 'form-control')); !!}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <div class="form-group">
                                {!! Form::label('job_title', 'Job title') !!}
                                {!! Form::text('job_title', $user->job_title, array('class' => 'form-control')); !!}
                            </div>
                            <div class="form-group">
                                {!! Form::label('country', 'Country') !!}
                                {!! Form::text('country', $user->country, array('class' => 'form-control')); !!}
                            </div>
                            <div class="form-group">
                                {!! Form::label('city', 'City') !!}
                                {!! Form::text('city', $user->city, array('class' => 'form-control')); !!}
                            </div>
                            <div class="text-right">
                                {!! Form::submit('Update', array('class' => 'btn btn-primary')) !!}
                            </div>
                        </div>
                    </div>
                </div>
            {!! Form::close() !!}
        </div>
    </div>
@stop