@include('layouts.header')
@include('layouts.sidebar')
<div id="content" class="app-content" role="main">
    <div class="app-content-body">
        @yield('content')
    </div>
</div>
@include('layouts.footer')