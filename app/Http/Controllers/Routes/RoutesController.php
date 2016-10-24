<?php

namespace App\Http\Controllers\Routes;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Route;
use App\User;
use App\Store;
use App\Point;
use Illuminate\Http\Request;
use App\Http\Requests\RoutesCreateRequest;
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
        $this->middleware('role', ['only' => 'getUsersAndStores|destroy|store|update|edit']);
    }


    /**
     * Display a listing of the resource.
     *
     * @return void
     */
    public function index()
    {
        $routes = Route::with('user')->paginate(15);
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
          if($percentCount > 0) {
            $progress = ($percentCount / $statusArrCount) * 100;
            $route->progress = round($progress);
          } else {
            $route->progress = 0;
          }
        }

        return response()->json($routes, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return void
     */
    public function store(RoutesCreateRequest $request)
    {
      $pointArr = $request->points;

      // Create New Route
      $route = Route::create(['user_id' => $request->user_id, 'date' => $request->date]);

      // After create new route, add new route id to the points
      foreach ($pointArr as $key => &$value) {
        $value['route_id'] = $route->id;
        $value['user_id'] = $request->user_id;

        // Create new points
        Point::create($value);
      }

      // Update availability of Driver
      User::where('id', $request->user_id)->update(['availability' => false]);

      return response()->json(true, 200);
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
      $route = Route::with('user')->findOrFail($id);
      $stores = Store::all();
      $points = Point::with('store')->where('route_id', $id)->get();

      return response()->json([
        'route' => $route,
        'stores' => $stores,
        'points' => $points
        ]);
    }

    /**
     * Get the form for editing the specified resource.
     *
     * @param  int  $id
     *
     * @return void
     */
    public function edit($id)
    {
      $route = Route::with('user')->findOrFail($id);

      $points = Point::select('id', 'store_id', 'deadline_time', 'products', 'status')->where('route_id', $id)->with(['store' => function($query) {
          $query->select('id', 'address');
      }])->orderBy('id', 'asc')->get();

      $users = User::select('id', 'name', 'last_name')->where([
        ['user_group', '!=', 'admin']
      ])->get();

      $stores = Store::all();

      $route['users'] = $users;
      $route['points'] = $points;
      $route['stores'] = $stores;

      return response()->json($route, 200);
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

      $pointArrIds = [];
      $pointArr = $request->points;

      // Get ids of poins for backend
      foreach ($pointArr as $value) {
        $pointArrIds[] = $value['id'];
      }

      // Get all points by route_id
      $points = Point::where('route_id', $id)->get();


      foreach ($points as $point) {
        // If backend point exist in frontend point
        if(in_array($point['id'], $pointArrIds)) {
          $founded_point = true;
        } else {
          $founded_point = false;
        }

        // Update point
        if($founded_point) {
          foreach ($pointArr as $key => $value) {
            if ($point['id'] == $value['id']) {
              $updatedPoint = [
                  'user_id'       => $request->user_id,
                  'store_id'      => $value['store_id'],
                  'deadline_time' => $value['deadline_time'],
                  'products'      => $value['products'],
              ];

              Point::where(['route_id' => $id, 'id' => $point['id']])->update($updatedPoint);
              continue 2;
            }
          }
        } else {
          Point::where('id', $point['id'])->delete();
        }
      }

      // If have new routes, create them
      if(!empty($pointArrIds)) {
        $n = 1;
        foreach($pointArr as $key => $value) {
          if($value['id'] == $n.'_new') {
            $newPointArr = [
              'route_id'      => $id,
              'user_id'       => $request->user_id,
              'store_id'      => $value['store_id'],
              'deadline_time' => $value['deadline_time'],
              'products'      => $value['products'],
            ];
          Point::create($newPointArr);
            $n++;
          }
        }
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

      return response()->json(true, 200);
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

      return response()->json(true, 200);

    }

    /**
     * Return users and stores
     *
     * @return void
     */
    public function getUsersAndStores()
    {
        $users = User::select('id', 'name', 'last_name')->where([
          ['availability', '!=', false],
          ['user_group', '!=', 'admin']
        ])->get();
        $stores = Store::select('id', 'name')->get();

        return response()->json(['users' => $users, 'stores' => $stores]);
    }
}