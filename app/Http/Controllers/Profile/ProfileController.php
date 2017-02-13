<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App;
use App\Route;
use App\User;
use App\Point;
use App\Store;
use App\Http\Requests;
use JWTAuth;
use Image;
use File;
use Session;

class ProfileController extends Controller
{
  public $upload_path = 'uploads/avatars/';
  public $default_avatar = 'default_avatar.jpg';

  public function __construct()
  {
    if(!App::runningInConsole()) {
      $this->user = JWTAuth::parseToken()->authenticate();
      $this->middleware('jwt.auth')->only('index');
    }
  }

  /**
   * Get users and points to main profile page
   * @return JSON
   */
  public function index() {

    $points = Point::where('user_id', $this->user->id)->with('store')->get();

    return response()->json(['user' => $this->user, 'points' => $points]);
  }


  /**
   * Get current user to update profile page
   * @return JSON
   */
  public function edit()
  {
    return response()->json($this->user, 200);
  }


  /**
   * Update profile
   * @param  Request
   * @param  int
   * @return True
   */
  public function update(Request $request, $id) {
    $this->validate($request, [
      'name' => 'required',
      'initials' => 'required|unique:users,initials,' . $this->user->id,
      'email' => 'required|email|unique:users,email,'. $this->user->id,
      'phone' => 'unique:users,phone,' . $this->user->id,
    ]);

    $data = $request->all();
    // Update avatar image
    if($request->hasFile('avatar')) {
      $avatar = $request->file('avatar')[0];
      $filename = time() . '.' .   $avatar->getClientOriginalExtension();

      // Create uploads/avatar folder if not exists
      if( !File::exists(public_path($this->upload_path)) ) {
        File::makeDirectory(public_path($this->upload_path),  $mode = 0775, $recursive = true);
      }

      Image::make($avatar)->resize('125', '125')->save(public_path($this->upload_path . $filename));
      $data['avatar'] = $filename;

      // Delete old file if exist
      $this->deleteAvatarIfExist($this->user->avatar);
    }

    // Remove avatar if it was removed by directive
    if($data['remove_avatar'] == 'true') {
      $data['avatar'] = $this->default_avatar;

      // Delete old file if exist
      $this->deleteAvatarIfExist($this->user->avatar);
    }

    $this->user->update($data);

    if(isset($filename)) return response()->json($filename, 200);

    return response()->json(true, 200);
  }


  /**
   * Delete Avatar
   * @param  string
   * @return True
   */
  public function deleteAvatarIfExist($current_avatar)
  {
    if($current_avatar !== $this->default_avatar && File::exists($this->upload_path . $current_avatar)) {
      File::delete($this->upload_path . $current_avatar);
    }

    return true;
  }


  /**
   * Update points from profile
   *
   * @param Request
   * @return True
   */
  public function updatePoints(Request $request) {
    $user_id = $this->user->id;
    $points = $request->all();

    foreach ($points as $point) {
      Point::where(['user_id' => $user_id, 'id' => $point['id']])->update(['status' => $point['status']]);
    }

    return response()->json(true, 200);
  }
}