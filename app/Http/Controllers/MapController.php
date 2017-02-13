<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Point;
use Illuminate\Http\Request;

class MapController extends Controller
{
  /**
   * Get all points of route in JSON Format
   * @return JSON
   */
  public function index() {
    $points = Point::select('id', 'status', 'store_id')
                   ->with(['store' => function($query) {
       $query->select('id', 'address', 'phone');
    }])->get();

   return response()->json($points, 200);
  }
}
