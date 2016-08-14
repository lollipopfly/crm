@extends('layouts.layout')
@section('content')
    <div class="hbox hbox-auto-xs hbox-auto-sm">
        <div class="col">
            <div style="background:url({!! asset('images/profile-image.jpg') !!}) center center; background-size:cover">
                <div class="wrapper-lg bg-white-opacity">
                    <div class="row m-t">
                        <div class="col-xs-6">
                            <a href="" class="thumb-lg pull-left m-r">
                                <img src="/uploads/avatars/{!! $user->avatar !!}" class="img-circle">
                            </a>
                            <div class="clear m-b">
                                <div class="m-b m-t-sm">
                                    @if ($user->initials)
                                        <span class="h3 text-black">{{ $user->initials }}</span>
                                    @endif
                                        <small class="m-l">
                                            @if ($user->city)
                                                    {{ $user->city }},
                                            @endif
                                            @if ($user->country)
                                                {{ $user->country }}
                                            @endif
                                        </small>
                                </div>
                                <a href="profile/edit" class="btn btn-sm btn-success btn-rounded">Edit</a>
                                @if($user->user_group === 'admin')
                                    <a href="users/create" class="btn btn-sm btn-primary btn-rounded">Add new user</a>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="wrapper-md">
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
            <div class="col-md-6 col-xs-12">
                 <div class="panel panel-default">
                    <table class="table table-striped m-b-none">
                        <tr>
                            <td><strong>Name</strong></td>
                            <td>{{ $user->name }}</td>
                        </tr>
                        <tr>
                            <td><strong>Last name</strong></td>
                            <td>{{ $user->last_name }}</td>
                        </tr>
                        <tr>
                        <tr>
                            <td><strong>Job title</strong></td>
                            <td>{{ $user->job_title }}</td>
                        </tr>
                            <td><strong>Birthday</strong></td>
                            <td>{{ $user->bday }}</td>
                        </tr>
                        <tr>
                            <td><strong>Email</strong></td>
                            <td>{{ $user->email }}</td>
                        </tr>
                        <tr>
                            <td><strong>Phone</strong></td>
                            <td>{{ $user->phone }}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="col-md-6 col-xs-12 ">
                @if ($points)
                    <div class="panel no-border">
                        <div class="panel-heading wrapper b-b b-light">
                        <a href="{{ url('routes/') }}" class="pull-right text-info">Go to route page</a>
                            <h4 class="m-t-none m-b-none">Current routes</h4>
                        </div>
                        {!! Form::open(['url' => 'profile/updatepoints', 'method' => 'put']) !!}
                            <table class="table table-striped m-b-none">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Store</th>
                                        <th>Address</th>
                                        <th class="text-right">Complete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($points as $point)
                                        <tr>
                                            <td>{{ $point->id }}</td>
                                            <td>{{ $point->store->name }}</td>
                                            <td>{{ $point->store->address }}</td>
                                            <td>
                                                <checkbox_field
                                                    class="pull-right"
                                                    attr-class="'m-t-none m-b-none'"
                                                    attr-name="'point_{{ $point->id }}'"
                                                    checked="{{ $point->status }}">
                                                </checkbox_field>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                            <div class="panel-footer clearfix">
                                <input type="submit" value="Update" class="btn btn-primary pull-right">
                            </div>
                        {!! Form::close() !!}
                    </div>
                @else
                    <div class="panel no-border">
                        <div class="panel-heading wrapper b-b b-light">
                            <h4 class="m-t-none m-b-none">You have no route...</h4>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>
@stop