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
    // Route::resource('users', 'UsersController');


    Route::get('stores', 'Stores\StoresController@index');
    Route::delete('stores/{id}', 'Stores\StoresController@destroy');
    // Route::get('stores/getstoreaddress/{id}', 'Stores\StoresController@getStoreAddress');
});

// Public
Route::get('users', function() { return view('index'); });

Route::get('user/sign_in', function() { return view('layouts.layout'); });
Route::get('user/sign_up', function() { return view('layouts.layout'); });
Route::get('user/sign_up_success', function() { return view('layouts.auth'); });
Route::get('user/confirm/{confirmation_code}', function() { return view('layouts.layout'); });
Route::get('user/forgot_password', function() { return view('layouts.layout'); });
Route::get('user/reset_password/{reset_password_code}', function() { return view('layouts.auth'); });

// // STORES
// Route::resource('stores', 'Stores\StoresController');
Route::get('stores/', function() { return view('layouts.layout'); });



Route::group(['middleware' => 'auth'], function () {
    // Route::get('/',  'HomeController@index');

    // // PROFILE
    // Route::get('profile/',  'Profile\ProfileController@index');
    // Route::get('profile/edit',  'Profile\ProfileController@edit');
    // Route::post('profile/update/{id}',  'Profile\ProfileController@update');
    // Route::put('profile/updatepoints', 'Profile\ProfileController@updatePoints');

    // // USERS
    // Route::get('users', 'Users\UsersController@index');
    // Route::post('users', 'Users\UsersController@store');
    // Route::get('users/create', 'Users\UsersController@create');
    // Route::get('users/{id}', 'Users\UsersController@show');
    // Route::delete('users/{id}', 'Users\UsersController@destroy');

    // // ROUTES
    // Route::get('routes/getpoints/{id}', 'Routes\RoutesController@getPoints');
    // Route::resource('routes', 'Routes\RoutesController');

    // // MAP
    // Route::get('map/getallpoints', 'MapController@getAllPoints');
    // Route::get('map/', 'MapController@index');
});
