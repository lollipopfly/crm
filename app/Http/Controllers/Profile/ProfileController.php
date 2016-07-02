<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\ProfileUpdateRequest;
use app\User;
use App\Http\Requests;
use Auth;
use Image;
use File;

class ProfileController extends Controller
{

    public $upload_path = 'uploads/avatars/';
    public $default_avatar = 'default.jpg';


    /**
     * @return view
     */
    public function index() {
        $user = Auth::user();
        return view('profile.index')->with('user', $user);
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
        $current_user = User::findOrFail($id);
        $data = $request->all();

        // Update avatar image
        if($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $filename = time() . '.' .   $avatar->getClientOriginalExtension();
            Image::make($avatar)->resize('125', '125')->save(public_path($this->upload_path . $filename));
            $data['avatar'] = $filename;

            // Delete old file if exist
            $this->deleteAvatarIfExist($current_user->avatar);
        }

        // Remove avatar if it was removed by directive
        if($data['remove_avatar']) {
            $data['avatar'] = $this->default_avatar;

            // Delete old file if exist
            $this->deleteAvatarIfExist($current_user->avatar);
        }

        $current_user->update($data);
        session()->flash('profile_updated', 'Profile updated.');
        return redirect('profile/');
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
}
