<?php

namespace App\Http\Controllers;

use App;
use App\Http\Requests;
use App\Route;
use App\Point;
use JWTAuth;
use Illuminate\Http\Request;

class HomeController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
    if(!App::runningInConsole()) {
      $this->middleware('role', ['only' => 'index']);
      $this->user = JWTAuth::parseToken()->authenticate();
    }
  }

  /**
   * Get Routes
   *
   * @return JSON
   */
  public function index()
  {
    $routes = Route::with('user')->paginate(8);
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
   * Get all points of route in JSON Format
   *
   * @return JSON
   */
  public function getPoints() {
    $user = $this->user;
    $where = [];

    if($user->user_group == 'user') {
      $where = ['user_id' => $user->id];
    }

    $points = Point::select('id', 'status', 'store_id')->with(['store' => function($query) {
       $query->select('id', 'address', 'phone');
    }])->where($where)->get();

   return response()->json($points, 200);
  }
}