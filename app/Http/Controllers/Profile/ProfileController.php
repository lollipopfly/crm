<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use app\User;
use App\Http\Requests;
use Auth;
use Image;
use File;

class ProfileController extends Controller
{

    public $upload_path = 'uploads/avatars/';

    public function index() {
        $user = Auth::user();
        return view('profile.index')->with('user', $user);
    }

    public function edit()
    {
        $user = Auth::user();
        return view('profile.edit')->with('user', $user);
    }

    public function update(Request $request, $id) {
        $current_user = User::findOrFail($id);
        $data = $request->all();

        if($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $filename = time() . '.' .   $avatar->getClientOriginalExtension();
            Image::make($avatar)->resize('125', '125')->save(public_path($this->upload_path . $filename));
            $data['avatar'] = $filename;

            // Delete old file if exist
            if($current_user->avatar !== 'default.jpg' && File::exists($this->upload_path . $current_user->avatar)) {
                $this->deleteAvatar($current_user->avatar);
            }
        }

        $current_user->update($data);
        return redirect('profile/edit');
    }


    public function deleteAvatar($current_avatar)
    {
        File::delete($this->upload_path . $current_avatar);
    }
}
