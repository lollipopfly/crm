@extends('layouts.layout')

@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-b-sm font-thin h3">Create new route</h1>
        <a href="{{ url('/routes/') }}" class="btn btn-default"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back</a>
    </div>

    <div class="wrapper-md" ng-controller="createRouteCtrl">
        <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
                <div class="panel panel-default">
                    <div class="panel-body">
                        {!! Form::open(['url' => '/routes', 'class' => 'form-horizontal']) !!}
                            @if ($users)
                                <div class="row">
                                    <div class="col-md-1"></div>
                                    <div class="col-md-3 m-t-xs">
                                        <span class="text"><i class="fa icon-user text"></i> User:</span>
                                    </div>
                                    <div class="col-md-7 {{ $errors->has('name') ? 'has-error' : '' }}">
                                        <select name="user_id" class="form-control m-b">
                                            <option selected="selected" value="">Select Driver...</option>
                                            @foreach ($users as $user)
                                                <option value="{{ $user->id }}">{{ $user->name }} {{ $user->last_name }}</option>
                                            @endforeach
                                        </select>
                                        {!! $errors->first('name', '<p class="help-block">:message</p>') !!}
                                    </div>
                                </div>
                                <div class="line line-dashed b-b line-lg pull-in"></div>
                            @endif

                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-calendar text"></i> Date:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('date') ? 'has-error' : '' }}">
                                    <datetimepicker
                                        attr-name="'date'">
                                    </datetimepicker>
                                    {!! $errors->first('date', '<p class="help-block">:message</p>') !!}
                                </div>
                            </div>
                            <div class="line line-dashed b-b line-lg pull-in"></div>

                            <div class="point-forms">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h3>Add new point</h3>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <label>Store</label>
                                        <select name="store_id_1" class="form-control m-b">
                                            <option selected="selected" value="">Select Store...</option>
                                            @foreach ($stores as $store)
                                                <option value="{{ $store->id }}">{{ $store->name }}</option>
                                            @endforeach
                                        </select>

                                        <timepicker
                                            label="'Deadline'"
                                            ng-model="time_1"
                                            attr-name="'time_1'"
                                        ></timepicker>
                                    </div>
                                    <div class="col-md-6">
                                        <label>Orders</label>
                                        {{ Form::textarea('orders_1', null, ['class' => 'form-control m-b-sm', 'rows' => '7'])}}
                                    </div>
                                </div>
                            </div> <!-- points-forms-->


                            <div class="line line-dashed b-b line-lg pull-in"></div>
                            <div class="row">
                                <div class="col-md-12 text-right">
                                    <button type="button" ng-click="addPoint(pointCount)" class="btn m-b-xs w-xs btn-info"><i class="fa fa-plus"></i> More</button>
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