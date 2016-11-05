<?php

Route::get('/', function () {
    return view('layouts.layout');
});

// API
Route::group(['prefix' => 'api'], function()
{
  Route::resource('authenticate', 'AuthController', ['only' => ['index']]);
  Route::post('authenticate', 'AuthController@authenticate');

  Route::get('authenticate/get_user', 'AuthController@getAuthenticatedUser');
  Route::post('authenticate/register', 'AuthController@register');
  Route::post('authenticate/confirm', 'AuthController@confirm');
  Route::post('authenticate/send_reset_code', 'AuthController@sendResetCode');
  Route::post('authenticate/reset_password', 'AuthController@resetPassword');

  // Home
  Route::get('home', 'HomeController@index');
  Route::get('home/getpoints', 'HomeController@getPoints');

  // Profile
  Route::get('profile', 'Profile\ProfileController@index');
  Route::get('profile/edit', 'Profile\ProfileController@edit');
  Route::put('profile/updatepoints', 'Profile\ProfileController@updatePoints');
  Route::post('profile/{id}', 'Profile\ProfileController@update');

  // Stores
  Route::get('stores', 'Stores\StoresController@index');
  Route::delete('stores/{id}', 'Stores\StoresController@destroy');
  Route::get('stores/{id}', 'Stores\StoresController@show');
  Route::post('stores/', 'Stores\StoresController@store');
  Route::patch('stores/{id}', 'Stores\StoresController@update');

  // Users
  Route::get('users/create', 'Users\UsersController@create');
  Route::get('users', 'Users\UsersController@index');
  Route::delete('users/{id}', 'Users\UsersController@destroy');
  Route::get('users/{id}', 'Users\UsersController@show');
  Route::post('users/', 'Users\UsersController@store');

  // Routes
  Route::delete('routes/{id}', 'Routes\RoutesController@destroy');
  Route::get('routes', 'Routes\RoutesController@index');
  Route::get('routes/{id}', 'Routes\RoutesController@show');
  Route::get('routes/edit/{id}', 'Routes\RoutesController@edit');
  Route::post('routes/', 'Routes\RoutesController@store');
  Route::patch('routes/{id}', 'Routes\RoutesController@update');
  Route::post('routes/getUsersAndStores', 'Routes\RoutesController@getUsersAndStores');

  // Map
  Route::get('map/', 'MapController@index');
});

// PUBLIC
Route::get('user/sign_in', function() { return view('layouts.layout'); });
Route::get('user/sign_up', function() { return view('layouts.layout'); });
Route::get('user/sign_up_success', function() { return view('layouts.auth'); });
Route::get('user/confirm/{confirmation_code}', function() { return view('layouts.layout'); });
Route::get('user/forgot_password', function() { return view('layouts.layout'); });
Route::get('user/reset_password/{reset_password_code}', function() { return view('layouts.auth'); });

// Profile
Route::get('profile/', function() { return view('layouts.layout'); });
Route::get('profile/edit', function() { return view('layouts.layout'); });

// Stores
Route::get('stores/', function() { return view('layouts.layout'); });
Route::get('stores/{id}', function() { return view('layouts.layout'); });
Route::get('stores/create', function() { return view('layouts.layout'); });
Route::get('stores/{id}/edit/', function() { return view('layouts.layout'); });

// Users
Route::get('users/', function() { return view('layouts.layout'); });
Route::get('users/{id}', function() { return view('layouts.layout'); });
Route::get('users/create', function() { return view('layouts.layout'); });
Route::get('users/{id}/edit/', function() { return view('layouts.layout'); });

// Routes
Route::get('routes/', function() { return view('layouts.layout'); });
Route::get('routes/{id}', function() { return view('layouts.layout'); });
Route::get('routes/create', function() { return view('layouts.layout'); });
Route::get('routes/{id}/edit/', function() { return view('layouts.layout'); });

// Map
Route::get('map/', function() { return view('layouts.layout'); });
