<?php

namespace App\Http\Controllers\Routes;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Route;
use App\User;
use App\Store;
use App\Point;
use DB;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Session;

class RoutesController extends Controller
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
    public function index()
    {
        $routes = Route::paginate(15);

        return view('routes.index', compact('routes'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return void
     */
    public function create()
    {
        $users = User::select('id', 'name', 'last_name')->get();
        $stores = Store::select('id', 'name')->get();

        return view('routes.create')->with(['users' => $users, 'stores' => $stores]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return void
     */
    public function store(Request $request)
    {
        $this->validate($request, ['user_id' => 'required', 'date' => 'required', ]);

        $pointsArr = Array();

        $collection = collect($request->all());
        $collection->forget(['_token', 'user_id', 'date']); // except this keys
        $collection->all();

        $n = 1;
        foreach($collection as $key => $value) {
            $date = date("Y-m-d H:i:s");
            if($key == 'store_id_'.$n) {
                $pointArr[] = [
                    'user_id'       => $request->user_id,
                    'store_id'      => $collection['store_id_'.$n],
                    'deadline_time' => $collection['deadline_time_'.$n],
                    'products'      => $collection['products_'.$n],
                    'created_at'    => $date,
                    'updated_at'    => $date
                ];
                $n++;
            }
        }

        // Create New Route
        $route = Route::create(['user_id' => $request->user_id, 'date' => $request->date]);

        // Add route id to the points
        foreach ($pointArr as $key => &$value) {
            $value['route_id'] = $route->id;
        }

        // Create new points
        DB::table('points')->insert($pointArr);

        Session::flash('flash_message', 'Route added!');

        return redirect('routes');
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
        $route = Route::findOrFail($id);

        return view('routes.show', compact('route'));
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
        $route = Route::findOrFail($id);
        $users = User::all();
        $stores = Store::all();

        return view('routes.edit', compact(['route', 'users', 'stores']));
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
        $this->validate($request, ['user_id' => 'required', 'date' => 'required', ]);

        $route = Route::findOrFail($id);
        $route->update($request->all());

        Session::flash('flash_message', 'Route updated!');

        return redirect('routes');
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
        Route::destroy($id);
        Point::where('route_id', $id)->delete();

        Session::flash('flash_message', 'Route deleted!');

    }

    public function getPoints($id) {
        $points = Point::where('route_id', $id)->get();

        return $points;
    }
}
