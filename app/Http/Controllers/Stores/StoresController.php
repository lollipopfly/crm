<?php

namespace App\Http\Controllers\Stores;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Store;
use Illuminate\Http\Request;

class StoresController extends Controller
{
  /**
   * Role Middleware
   *
   * @return \Illuminate\Http\Response
   */
  public function __construct() {
    $this->middleware('role', ['only' => 'destroy|store|update|edit']);
  }


  /**
   * Display a listing of the resource.
   *
   * @return Object
   */
  public function index(Request $request)
  {
    $stores = Store::latest('created_at')->paginate(15);

    return $stores;
  }


  /**
   * Store a newly created resource in storage.
   *
   * @return True
   */
  public function store(Request $request)
  {
    $this->validate($request, [
        'name' => 'required',
        'address' => 'required|unique:stores',
        'phone' => 'required||unique:stores',
        'email' => 'email|unique:stores'
    ]);

    Store::create($request->all());

    return response()->json(true);
  }


  /**
   * Display the specified resource.
   *
   * @param  int  $id
   *
   * @return Object
   */
  public function show($id)
  {
    $store = Store::findOrFail($id);

    return $store;
  }


  /**
   * Update the specified resource in storage.
   *
   * @param  int  $id
   *
   * @return True
   */
  public function update($id, Request $request)
  {
    $this->validate($request, [
      'name' => 'required',
      'address' => 'required',
      'phone' => 'required',
      'email' => 'email'
    ]);

    $store = Store::findOrFail($id);
    $store->update($request->all());

    return response()->json(true);
  }


  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   *
   * @return True
   */
  public function destroy($id)
  {
    Store::destroy($id);

    return response()->json(true, 200);
  }
}