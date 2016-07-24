@extends('layouts.app')

@section('content')
<div class="container">

    <h1>Route {{ $route->id }}
        <a href="{{ url('routes/' . $route->id . '/edit') }}" class="btn btn-primary btn-xs" title="Edit Route"><span class="glyphicon glyphicon-pencil" aria-hidden="true"/></a>
        {!! Form::open([
            'method'=>'DELETE',
            'url' => ['routes', $route->id],
            'style' => 'display:inline'
        ]) !!}
            {!! Form::button('<span class="glyphicon glyphicon-trash" aria-hidden="true"/>', array(
                    'type' => 'submit',
                    'class' => 'btn btn-danger btn-xs',
                    'title' => 'Delete Route',
                    'onclick'=>'return confirm("Confirm delete?")'
            ));!!}
        {!! Form::close() !!}
    </h1>
    <div class="table-responsive">
        <table class="table table-bordered table-striped table-hover">
            <tbody>
                <tr>
                    <th>ID</th><td>{{ $route->id }}</td>
                </tr>
                <tr><th> User Id </th><td> {{ $route->user_id }} </td></tr><tr><th> Date </th><td> {{ $route->date }} </td></tr>
            </tbody>
        </table>
    </div>

</div>
@endsection
