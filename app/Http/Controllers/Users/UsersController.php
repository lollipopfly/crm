<?php

namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use app\User;
use Image;
use Hash;
use Auth;
use DB;

class UsersController extends Controller
{

    public $upload_path = 'uploads/avatars/';


    /**
     * Role Middleware
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct() {
        $this->middleware('role', ['only' => 'create|destroy|store|update|edit']);
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // if ordered table get all except current user
        if($request->orderBy && $request->direction) {
           $users = User::orderBy($request->orderBy, $request->direction)->where('id', '!=', Auth::user()->id)->paginate(10);
        } else {
            $users = User::latest('created_at')->where('id', '!=', Auth::user()->id)->paginate(10);
        }

        return view('users.index')->with('users', $users);
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $userGroupEnums = $this->getPossibleEnumValues('user_group');
        return view('users.create')->with('userGroupEnums', $userGroupEnums);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validation
        $this->validate($request, [
            'name' => 'required',
            'initials' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $user = new User;
        $data = $request->all();

        // Upload avatar image
        if($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $filename = time() . '.' .   $avatar->getClientOriginalExtension();
            Image::make($avatar)->resize('125', '125')->save(public_path($this->upload_path . $filename));
            $data['avatar'] = $filename;
        }

        // Hashing password
        $data['password'] = Hash::make($data['password']);

        $user->create($data);
        session()->flash('user_added', 'New user has been added.');

        return redirect('users/');
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return view('users.show')->with('user', $user);
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);

        $user->delete();
        session()->flash('user_deleted', 'User has been deleted.');
    }


    /**
     * Get enum field values of table
     *
     * @param string $name
     * @return array
     */
    public function getPossibleEnumValues($name){
        $user = new User;
        $type = DB::select( DB::raw('SHOW COLUMNS FROM '.$user->getTable().' WHERE Field = "'.$name.'"') )[0]->Type;
        preg_match('/^enum\((.*)\)$/', $type, $matches);
        $enum = array();
        foreach(explode(',', $matches[1]) as $value){
            $v = trim( $value, "'" );
            $enum[] = $v;
        }
        return $enum;
    }
}
