<?php

Route::get('about', function () {
    return view('pages.about');
});


Route::auth();

Route::group(['middleware' => 'auth'], function () {
    Route::get('/',  'HomeController@index');

});