<?php

namespace App;

// use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

// class User extends Model
class User extends Authenticatable
{
  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'name',
    'last_name',
    'bday',
    'email',
    'password',
    'confirmed',
    'initials',
    'job_title',
    'user_group',
    'country',
    'city',
    'phone',
    'avatar',
    'confirmation_code',
    'reset_password_code',
  ];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [
      'password', 'remember_token', 'confirmation_code', 'reset_password_code'
  ];
}
