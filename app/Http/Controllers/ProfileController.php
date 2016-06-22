<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use app\User;
use App\Http\Requests;
use Auth;
use Image;
use File;

class ProfileController extends Controller
{
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
        $user = User::findOrFail($id);
        $data = $request->all();

        if($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $filename = time() . '.' .   $avatar->getClientOriginalExtension();
            Image::make($avatar)->resize('125', '125')->save(public_path('uploads/avatars/' . $filename));
            $data['avatar'] = $filename;

            // delete old file if exist
            if($user->avatar !== 'default.jpg' && File::exists('uploads/avatars/'.$user->avatar)) {
                File::delete('uploads/avatars/'.$user->avatar);
            }
        }

        $user->update($data);

        return redirect('profile/edit');
    }

    public function deleteFile()
    {

    }
}
