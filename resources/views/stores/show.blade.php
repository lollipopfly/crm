@extends('layouts.layout')

@section('content')
<div class="container">

    <h1>Store {{ $store->id }}
        <a href="{{ url('stores/' . $store->id . '/edit') }}" class="btn btn-primary btn-xs" title="Edit Store"><span class="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
        {!! Form::open([
            'method'=>'DELETE',
            'url' => ['stores', $store->id],
            'style' => 'display:inline'
        ]) !!}
            {!! Form::button('<span class="glyphicon glyphicon-trash" aria-hidden="true"/>', array(
                    'type' => 'submit',
                    'class' => 'btn btn-danger btn-xs',
                    'title' => 'Delete Store',
                    'onclick'=>'return confirm("Confirm delete?")'
            ));!!}
        {!! Form::close() !!}
    </h1>
    <div class="table-responsive">
        <table class="table table-bordered table-striped table-hover">
            <tbody>
                <tr>
                    <th>ID</th><td>{{ $store->id }}</td>
                </tr>
                <tr><th> Name </th><td> {{ $store->name }} </td></tr><tr><th> Address </th><td> {{ $store->address }} </td></tr><tr><th> Phone </th><td> {{ $store->phone }} </td></tr>
            </tbody>
        </table>
    </div>

</div>
@endsection
