@extends('layouts.layout')
@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-r-md inline media-middle font-thin h3">Users</h1>
        @if (Auth::user()->user_group === 'admin')
            <a href="users/create" class="btn btn-primary"><i class="fa fa-plus m-r-xs"></i>Add new user</a>
        @endif
    </div>

    <div class="wrapper-md" ng-controller="indexUserCtrl">
        {{-- Id updated --}}
        @if(Session::has('user_added'))
            <div class="row">
                <div class="col-xs-12">
                    <p class="alert alert-success">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>
                        <strong>{!! Session::get('user_added') !!}</strong>
                    </p>
                </div>
            </div>
        @endif

        {{-- If deleted --}}
        @if(Session::has('user_deleted'))
            <div class="row">
                <div class="col-xs-12">
                    <p class="alert alert-success">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>
                        <strong>{!! Session::get('user_deleted') !!}</strong>
                    </p>
                </div>
            </div>
        @endif

        <div class="row">
            <div class="col-xs-12">
                <div class="panel panel-default">
                    <table class="table table-striped m-b-none">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Last Name</th>
                                <th>Birthday</th>
                                <th>Job title</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Country</th>
                                <th>City</th>
                                 @if (Auth::user()->user_group === 'admin')
                                    <th></th>
                                @endif
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($users as $user)
                                <tr>
                                    <td><a class="text-info" href="users/{{$user->id}}">{{ $user->id }}</a></td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->last_name }}</td>
                                    <td>{{ $user->bday }}</td>
                                    <td>{{ $user->job_title }}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->phone }}</td>
                                    <td>{{ $user->country }}</td>
                                    <td>{{ $user->city }}</td>
                                     @if (Auth::user()->user_group === 'admin')
                                        <td>
                                            <a href="" ng-click="deleteUser({{$user->id}})" target="_self" tooltip-placement="top" uib-tooltip="Delete user">
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
            {!! $users->render() !!}
        </div>

        {{-- Confirm modal --}}
        <confirm_modal></confirm_modal>
    </div>
@stop