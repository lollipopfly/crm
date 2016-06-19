<?php

Route::get('/', function () {
    return view('pages.home');
});

Route::get('about', function () {
    return view('pages.about');
});