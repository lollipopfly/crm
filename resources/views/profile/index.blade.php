@extends('layouts.layout')
@section('content')
    <div class="hbox hbox-auto-xs hbox-auto-sm">
        <div class="col">
            <div style="background:url({!! asset('images/profile-image.jpg') !!}) center center; background-size:cover">
                <div class="wrapper-lg bg-white-opacity">
                    <div class="row m-t">
                        <div class="col-sm-7">
                            <a href="" class="thumb-lg pull-left m-r">
                                <img src="{!! asset('images/avatar.jpg') !!}" class="img-circle">
                            </a>
                            <div class="clear m-b">
                                <div class="m-b m-t-sm">
                                    <span class="h3 text-black">{{ $user->name }}</span>
                                    <small class="m-l">London, UK</small>
                                </div>
                                <a href="" class="btn btn-sm btn-success btn-rounded">Follow</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop