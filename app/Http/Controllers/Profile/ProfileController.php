<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Route;
use App\Http\Requests\ProfileUpdateRequest;
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
    public $default_avatar = 'default.jpg';

    public function __construct()
    {
      $this->user = JWTAuth::parseToken()->authenticate();
      $this->middleware('jwt.auth')->only('index');
    }

    /**
     * @return view
     */
    public function index() {

      $points = Point::where('user_id', $this->user->id)->with('store')->get();

      return response()->json(['user' => $this->user, 'points' => $points]);
    }


    /**
     * @return view
     */
    public function edit()
    {
        $user = Auth::user();
        return view('profile.edit')->with('user', $user);
    }


    /**
     * @param  Request
     * @param  int
     * @return view
     */
    public function update(ProfileUpdateRequest $request, $id) {
        $this->user = User::findOrFail($id);
        $data = $request->all();

        // Update avatar image
        if($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $filename = time() . '.' .   $avatar->getClientOriginalExtension();
            Image::make($avatar)->resize('125', '125')->save(public_path($this->upload_path . $filename));
            $data['avatar'] = $filename;

            // Delete old file if exist
            $this->deleteAvatarIfExist($this->user->avatar);
        }

        // Remove avatar if it was removed by directive
        if($data['remove_avatar']) {
            $data['avatar'] = $this->default_avatar;

            // Delete old file if exist
            $this->deleteAvatarIfExist($this->user->avatar);
        }

        $this->user->update($data);
        Session::flash('flash_message', 'Profile updated.');

        return response()->json(true, 200);

        // return redirect('profile/');
    }


    /**
     * @param  string
     * @return true
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
     * @return view
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
