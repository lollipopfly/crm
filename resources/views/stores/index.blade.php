@extends('layouts.layout')

@section('content')
    <div class="bg-light lter b-b wrapper-md">
        <h1 class="m-r-md inline media-middle font-thin h3">Stores</h1>
        @if (Auth::user()->user_group === 'admin')
            <a href="{{ url('/stores/create') }}" class="btn btn-primary"><i class="fa fa-plus m-r-xs"></i>Add new store</a>
        @endif
    </div>

    <div class="wrapper-md" ng-controller="indexStoreCtrl">
        {{-- Id updated --}}
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
                            <th class="sorting v-top">{!! orderLink('Owner name', 'owner_name', 'asc') !!}</th>
                            <th class="sorting v-top">{!! orderLink('Address', 'address', 'asc') !!}</th>
                            <th class="sorting v-top">{!! orderLink('Phone', 'phone', 'asc') !!}</th>
                            @if (Auth::user()->user_group === 'admin')
                                <th class="text-right">Actions</th>
                            @endif
                        </tr>
                        </thead>
                        <tbody>
                            @foreach($stores as $store)
                                <tr>
                                    <td><a class="text-info" href="stores/{{$store->id}}">{{ $store->id }}</a></td>

                                    <td>{{ $store->name }}</td>
                                    <td>{{ $store->owner_name }}</td>
                                    <td>{{ $store->address }}</td>
                                    <td>{{ $store->phone }}</td>
                                    @if (Auth::user()->user_group === 'admin')
                                        <td class="text-right">
                                            <a href="{{ url('/stores/'.$store->id.'/edit/') }}" class="v-middle" tooltip-placement="top-right" uib-tooltip="Edit store">
                                                <i class="icon-pencil c-p f-z-15 color-green"></i>
                                            </a>
                                            <a href="" class="v-middle" ng-click="deleteStore({{$store->id}})" target="_self" tooltip-placement="top-right" uib-tooltip="Delete store">
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
            {!! $stores->appends(Request::input())->render() !!}
        </div>

        {{-- Confirm modal --}}
        <confirm_modal></confirm_modal>
    </div>


@endsection
