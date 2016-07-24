<?php

Route::auth();

Route::group(['middleware' => 'auth'], function () {
    Route::get('/',  'HomeController@index');

    // PROFILE
    Route::get('profile/',  'Profile\ProfileController@index');
    Route::get('profile/edit',  'Profile\ProfileController@edit');
    Route::post('profile/update/{id}',  'Profile\ProfileController@update');

    // USERS
    Route::get('users', 'Users\UsersController@index');
    Route::post('users', 'Users\UsersController@store');
    Route::get('users/create', 'Users\UsersController@create');
    Route::get('users/{id}', 'Users\UsersController@show');
    Route::delete('users/{id}', 'Users\UsersController@destroy');

    // STORES
    Route::resource('stores', 'Stores\StoresController');

    // ROUTES
    Route::resource('routes', 'Routes\RoutesController');
});


Route::get('register', function() {
   return view('auth.register');
});