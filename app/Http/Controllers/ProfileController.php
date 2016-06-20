<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;

class ProfileController extends Controller
{
    public function index() {
        $user = Auth::user();
        return view('profile.index')->with('user', $user);
    }
}
