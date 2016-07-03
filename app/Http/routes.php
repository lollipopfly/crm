<?php

Route::auth();

Route::group(['middleware' => 'auth'], function () {
    Route::get('/',  'HomeController@index');

    // PROFILE
    Route::get('profile/',  'Profile\ProfileController@index');
    Route::get('profile/edit',  'Profile\ProfileController@edit');
    Route::post('profile/update/{id}',  'Profile\ProfileController@update');

    // USERS
    Route::resource('users', 'Users\UsersController');
});


// Route::get('register', function() {
//    // return redirect('login');
//    return view('auth.register');
// });