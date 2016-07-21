@extends('layouts.layout')

@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-b-sm font-thin h3">{{ $store->name }}</h1>
        <a href="{{ url('/stores/') }}" class="btn btn-default"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back</a>
        <a href="{{ url('stores/' . $store->id . '/edit') }}" class="btn btn-primary">Edit</a>
        {!! Form::open([
            'method'=>'DELETE',
            'url' => ['stores', $store->id],
            'style' => 'display:inline'
        ]) !!}
            {!! Form::button('Delete', array(
                    'type' => 'submit',
                    'class' => 'btn btn-danger',
                    'title' => 'Delete Store',
                    'onclick'=>'return confirm("Confirm delete?")'
            ));!!}
        {!! Form::close() !!}
    </div>

    <div class="wrapper-md">
        <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa fa-building-o text"></i> Name:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($store->name)
                                        {{ $store->name }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-user text"></i> Owner name:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($store->owner_name)
                                        {{ $store->owner_name }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-map text"></i> Address:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($store->address)
                                        {{ $store->address }}
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
                                    @if ($store->phone)
                                        {{ $store->phone }}
                                    @endif
                                </span>
                            </div>
                        </div>
                        <div class="line line-dashed b-b line-lg pull-in"></div>

                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-3">
                                <span class="text"><i class="fa icon-envelope-open text"></i> Email:</span>
                            </div>
                            <div class="col-md-7">
                                <span class="text">
                                    @if ($store->email)
                                        {{ $store->email }}
                                    @endif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
