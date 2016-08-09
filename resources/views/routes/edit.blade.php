@extends('layouts.layout')

@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-b-sm font-thin h3">Edit route</h1>
        <a href="{{ url('/routes/') }}" class="btn btn-default"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back</a>
    </div>

    <div class="wrapper-md" ng-controller="editRouteCtrl">
        <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8">
                <div class="panel panel-default">
                    <div class="panel-body">
                        {!! Form::model($route, [
                            'method' => 'PATCH',
                            'url' => ['/routes', $route->id],
                            'class' => 'form-horizontal'
                        ]) !!}
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-user text"></i> User:</span>
                                </div>

                                <div class="col-md-7 {{ $errors->has('user_id') ? 'has-error' : '' }}">
                                    <select name="user_id" class="form-control m-b">
                                        <option value="">Select Driver...</option>
                                        @foreach ($users as $user)
                                            @if ($route->user->id === $user->id)
                                                <? $selected = 'selected'; ?>
                                            @else
                                                <? $selected = '';?>
                                            @endif

                                            <option {{ $selected }} value="{{ $user->id }}">{{ $user->name }} {{ $user->last_name }}</option>
                                        @endforeach
                                    </select>
                                    {!! $errors->first('user_id', '<p class="help-block">:message</p>') !!}
                                </div>
                            </div>
                            <div class="line line-dashed b-b line-lg pull-in"></div>

                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-3 m-t-xs">
                                    <span class="text"><i class="fa icon-calendar text"></i> Date:</span>
                                </div>
                                <div class="col-md-7 {{ $errors->has('date') ? 'has-error' : '' }}">
                                    <datetimepicker
                                        attr-name="'date'"
                                        attr-value="'{{ $route->date }}'">
                                    </datetimepicker>
                                    {!! $errors->first('date', '<p class="help-block">:message</p>') !!}
                                </div>
                            </div>
                            <div class="line line-dashed b-b line-lg pull-in"></div>

                            <div class="row" ng-repeat="form in pointForms">
                                <input type="hidden" name="id_@{{ form.id }}" value="@{{ form.id }}">
                                <div class="col-md-6" >
                                    <label>Store</label>
                                    <select name="store_id_@{{form.id}}" class="form-control m-b" ng-model="form.store" required>
                                        <option value="">Select Store...</option>
                                        @foreach ($stores as $store)
                                            <option ng-selected="form.store_id == <?=$store->id?>" value="{{ $store->id }}">{{ $store->name }}</option>
                                        @endforeach
                                    </select>

                                    <timepicker
                                        label="'Deadline'"
                                        ng-model="form.deadline_time"
                                        attr-name="deadline_time_@{{form.id}}"
                                    ></timepicker>
                                </div>
                                <div class="col-md-6">
                                    <label>Orders</label>
                                    <textarea class="form-control m-b-sm" rows="7" name="products_@{{form.id}}" cols="50" required>@{{ form.products }}</textarea>
                                </div>
                                <div class="col-md-12 m-b-sm">
                                    <button class="btn pull-right btn-danger" type="button" ng-click="removePoint($index)">Delete</button>
                                </div>
                                <div class="col-md-12">
                                    <div class="line line-dashed b-b line-lg pull-in"></div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12 text-right">
                                    <button type="button" ng-click="addPoint(pointCount)" class="btn m-b-xs btn-info text-u-c "><i class="fa fa-plus m-r-xs"></i>Add point</button>
                                </div>
                            </div>

                            <div class="row padding-top-10">
                            <div class="col-md-4"></div>
                                <div class="col-xs-7 text-right">
                                    {!! Form::submit('Update', ['class' => 'btn btn-primary text-u-c btn-md']) !!}
                                </div>
                            </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection