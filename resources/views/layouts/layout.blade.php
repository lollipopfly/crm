@include('layouts.header')
@include('layouts.sidebar')
<div id="content" class="app-content" role="main">
    <div class="app-content-body">
        <div class="wrapper-md">
            @yield('content')
        </div>
    </div>
</div>
@include('layouts.footer')