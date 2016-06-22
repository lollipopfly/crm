@extends('layouts.layout')
@section('content')
    <div class="hbox hbox-auto-xs hbox-auto-sm">
        <div class="col">
            <div style="background:url({!! asset('images/profile-image.jpg') !!}) center center; background-size:cover">
                <div class="wrapper-lg bg-white-opacity">
                    <div class="row m-t">
                        <div class="col-sm-7">
                            <a href="" class="thumb-lg pull-left m-r">
                                <img src="/uploads/avatars/{!! $user->avatar !!}" class="img-circle">
                            </a>
                            <div class="clear m-b">
                                <div class="m-b m-t-sm">
                                    <span class="h3 text-black">{{ $user->initials }}</span>
                                    <small class="m-l">{{ $user->city }}, {{ $user->country }}</small>
                                </div>
                                <a href="profile/edit" class="btn btn-sm btn-success btn-rounded">Edit</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="wrapper-md">
        <div class="row">
            <div class="col-sm-6">
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
            <div class="col-sm-6">
                <div class="panel panel-default">
                    <table class="table table-striped m-b-none">
                        <tr>
                            <td><strong>Job title</strong></td>
                            <td>{{ $user->job_title }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        @if(Session::has('profile_updated'))
            <div class="row">
                <div class="col-xs-12">
                    <p class="alert alert-success">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>
                        <strong>{!! Session::get('profile_updated') !!}</strong>
                    </p>
                </div>
            </div>
        @endif
    </div>
@stop