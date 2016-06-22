<?php

Route::get('about', function () {
    return view('pages.about');
});


Route::auth();

Route::group(['middleware' => 'auth'], function () {
    Route::get('/',  'HomeController@index');

    // PROFILE
    Route::get('profile/',  'ProfileController@index');
    Route::get('profile/edit',  'ProfileController@edit');
    Route::post('profile/update/{id}',  'ProfileController@update');
});

//Route::get('register', function() {
//    return redirect('login');
//});