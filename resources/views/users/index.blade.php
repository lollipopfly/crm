@extends('layouts.layout')
@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-r-md inline media-middle font-thin h3">Users</h1>
        @if (Auth::user()->user_group === 'admin')
            <a href="users/create" class="btn btn-primary"><i class="fa fa-plus m-r-xs"></i>Add new user</a>
        @endif
    </div>

    <div class="wrapper-md" ng-controller="indexUserCtrl">
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
                                <th class="sorting v-top">{!! orderLink('Name', 'name', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Last Name', 'last_name', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Birthday', 'bday', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Job title', 'job_title', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Email', 'email', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Phone', 'phone', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('Country', 'country', 'asc') !!}</th>
                                <th class="sorting v-top">{!! orderLink('City', 'city', 'asc') !!}</th>
                                @if (Auth::user()->user_group === 'admin')
                                    <th class="text-right">Actions</th>
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
                                        <td class="text-right">
                                            <a href="" ng-click="deleteUser({{$user->id}})" target="_self" tooltip-placement="top-right" uib-tooltip="Delete user">
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
            {!! $users->appends(Request::input())->render() !!}
        </div>
    </div>

@stop