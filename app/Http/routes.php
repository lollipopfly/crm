<?php

Route::get('/', function () {
    return view('layouts.layout');
});

// api
Route::group(['prefix' => 'api'], function()
{
    Route::resource('authenticate', 'AuthController', ['only' => ['index']]);
    Route::post('authenticate', 'AuthController@authenticate');

    Route::get('authenticate/get_user', 'AuthController@getAuthenticatedUser');
    Route::post('authenticate/register', 'AuthController@register');
    Route::post('authenticate/confirm', 'AuthController@confirm');
    Route::post('authenticate/send_reset_code', 'AuthController@sendResetCode');
    Route::post('authenticate/reset_password', 'AuthController@resetPassword');

    // Stores
    Route::get('stores', 'Stores\StoresController@index');
    Route::delete('stores/{id}', 'Stores\StoresController@destroy');
    Route::get('stores/{id}', 'Stores\StoresController@show');
    Route::post('stores/', 'Stores\StoresController@store');
    Route::patch('stores/{id}', 'Stores\StoresController@update');

    // Users
    Route::get('users', 'Users\UsersController@index');
    Route::delete('users/{id}', 'Users\UsersController@destroy');
    Route::get('users/{id}', 'Users\UsersController@show');
    Route::post('users/', 'Users\UsersController@store');
    Route::patch('users/{id}', 'Users\UsersController@update');
});

// Public


Route::get('user/sign_in', function() { return view('layouts.layout'); });
Route::get('user/sign_up', function() { return view('layouts.layout'); });
Route::get('user/sign_up_success', function() { return view('layouts.auth'); });
Route::get('user/confirm/{confirmation_code}', function() { return view('layouts.layout'); });
Route::get('user/forgot_password', function() { return view('layouts.layout'); });
Route::get('user/reset_password/{reset_password_code}', function() { return view('layouts.auth'); });

// STORES
Route::get('stores/', function() { return view('layouts.layout'); });
Route::get('stores/{id}', function() { return view('layouts.layout'); });
Route::get('stores/create', function() { return view('layouts.layout'); });
Route::get('stores/{id}/edit/', function() { return view('layouts.layout'); });

Route::get('users/', function() { return view('layouts.layout'); });
Route::get('users/{id}', function() { return view('layouts.layout'); });
Route::get('users/create', function() { return view('layouts.layout'); });
Route::get('users/{id}/edit/', function() { return view('layouts.layout'); });

// Route::group(['middleware' => 'auth'], function () {

    // // PROFILE
    // Route::get('profile/',  'Profile\ProfileController@index');
    // Route::get('profile/edit',  'Profile\ProfileController@edit');
    // Route::post('profile/update/{id}',  'Profile\ProfileController@update');
    // Route::put('profile/updatepoints', 'Profile\ProfileController@updatePoints');


    // // ROUTES
    // Route::get('routes/getpoints/{id}', 'Routes\RoutesController@getPoints');
    // Route::resource('routes', 'Routes\RoutesController');

    // // MAP
    // Route::get('map/getallpoints', 'MapController@getAllPoints');
    // Route::get('map/', 'MapController@index');
// });
