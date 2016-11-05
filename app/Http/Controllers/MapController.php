<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Point;

class MapController extends Controller
{
  /**
   * Get all points of route in JSON Format
   *
   * @return JSON
   */
  public function index() {
    $points = Point::select('id', 'status', 'store_id')->with(['store' => function($query) {
       $query->select('id', 'address');
   }])->get();

   return response()->json($points, 200);
  }
}
