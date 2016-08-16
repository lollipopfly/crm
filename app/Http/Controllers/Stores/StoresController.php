<?php

namespace App\Http\Controllers\Stores;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Store;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Session;
use Auth;

class StoresController extends Controller
{
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
     * @return void
     */
    public function index(Request $request)
    {
        // if ordered table, get all except current user
        if($request->orderBy && $request->direction) {
            $stores = Store::orderBy($request->orderBy, $request->direction)->paginate(15);
        } else {
            $stores = Store::latest('created_at')->paginate(15);
        }

        return view('stores.index', compact('stores'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return void
     */
    public function create()
    {
        return view('stores.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return void
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'address' => 'required|unique:stores',
            'phone' => 'required||unique:stores',
            'email' => 'email||unique:stores'
        ]);

        Store::create($request->all());

        Session::flash('flash_message', 'Store added!');

        return redirect('stores');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     *
     * @return void
     */
    public function show($id)
    {
        $store = Store::findOrFail($id);

        return view('stores.show', compact('store'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     *
     * @return void
     */
    public function edit($id)
    {
        $store = Store::findOrFail($id);

        return view('stores.edit', compact('store'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     *
     * @return void
     */
    public function update($id, Request $request)
    {
        $this->validate($request, ['name' => 'required', 'address' => 'required', 'phone' => 'required', ]);

        $store = Store::findOrFail($id);
        $store->update($request->all());

        Session::flash('flash_message', 'Store updated!');

        return redirect('stores');
    }

    /**
     * Get Address by id
     *
     * @return string
     */
    public function getStoreAddress($id) {
        $storeAddress = Store::select('address')->where('id', $id)->first();

        return $storeAddress->address;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     *
     * @return void
     */
    public function destroy($id)
    {
        Store::destroy($id);

        Session::flash('flash_message', 'Store deleted!');

    }
}
