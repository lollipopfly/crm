<?php

namespace App\Http\Controllers\Routes;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Route;
use App\User;
use App\Store;
use App\Point;
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
        $points = Point::select('route_id', 'status')->get();

        // GET PROGRESS OF ROUTE
        foreach ($routes as &$route) {
            // Filter points by route id
            $filteredPoints = $points->filter(function ($value, $key) use ($route){
                return $value->route_id == $route->id;
            });

            $filteredPoints->all();

            $statusArr = Array();
            $percentCount = 0;

            // Get count of completed routes
            foreach ($filteredPoints as $point) {
                $statusArr[] = $point->status;

                if($point->status == 1) {
                    $percentCount++;
                }
            }
            $statusArrCount = count($statusArr);

            // Calculate percentage & Add progress to Route
            $progress = ($percentCount / $statusArrCount) * 100;
            $route->progress = round($progress);
        }

        return view('routes.index')->withRoutes($routes);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return void
     */
    public function create()
    {
        $users = User::select('id', 'name', 'last_name')->where('availability', '!=', false)->get();
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

        $pointArr = Array();

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
        Point::insert($pointArr);

        // Update availability of Driver
        User::where('id', $request->user_id)->update(['availability' => false]);

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
        $stores = Store::all();
        return view('routes.show', compact(['route', 'stores']));
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
        $users = User::select('id', 'name', 'last_name')->where('availability', '!=', false)->orWhere('id', $route->user_id)->get();
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

        $pointArr = Array();
        $collection = collect($request->all());
        $collection->forget(['_token', 'user_id', 'date', '_method']); // except this keys
        $collection->all();

        // Get all routes by route_id
        $points = Point::where('route_id', $id)->get();

        foreach ($points as $key => $value) {
            // find route by id
            $search_point = $collection->search($value['id']);

            // If found point, update it
            if($search_point) {
                $pointArr = [
                    'user_id'       => $request->user_id,
                    'store_id'      => $collection['store_id_'.$value['id']],
                    'deadline_time' => $collection['deadline_time_'.$value['id']],
                    'products'      => $collection['products_'.$value['id']],
                ];

                Point::where(['route_id' => $id, 'id' => $value['id']])->update($pointArr);
            } else {
                // Delete point
                Point::where('id', $value['id'])->delete();
            }
            // except values from collection. It is for creating new points
            $collection->forget(['id_'.$value["id"], 'store_id_'.$value["id"], 'deadline_time_'.$value["id"], 'products_'.$value["id"]]);
        }

        // If have new routes, create its
        if(!$collection->isEmpty()) {
            $n = 1;
            foreach($collection as $key => $value) {
                $date = date("Y-m-d H:i:s");
                if($key == 'id_'.$n.'_new') {
                    $newPointArr[] = [
                        'route_id'      => $id,
                        'user_id'       => $request->user_id,
                        'store_id'      => $collection['store_id_'.$n.'_new'],
                        'deadline_time' => $collection['deadline_time_'.$n.'_new'],
                        'products'      => $collection['products_'.$n.'_new'],
                        'created_at'    => $date,
                        'updated_at'    => $date
                    ];
                    $n++;
                }
            }

            // Create new points
            Point::insert($newPointArr);
        }

        // Update Route
        $route = Route::findOrFail($id);
        $old_user_id = $route->user_id;
        $route->update(["user_id" => $request->user_id, "date" => $request->date]);

        // Update current and new User availability if user was changed
        if($old_user_id !== $request->user_id) {
            User::where('id', $old_user_id)->update(['availability' => true]); // update old user
            User::where('id', $request->user_id)->update(['availability' => false]);//update news user
        }

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
        $route = Route::findOrFail($id);
        Route::destroy($id);
        Point::where('route_id', $id)->delete();
        User::where('id', $route->user_id)->update(['availability' => true]); // update availabillity

        Session::flash('flash_message', 'Route deleted!');

    }

    /**
     * Get all points of route
     *
     * @return array
     */
    public function getPoints($id) {
        $points = Point::where('route_id', $id)->get();

        return $points;
    }
}
