<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Point;

class MapController extends Controller
{
    public function index() {
        return view('pages/map');
    }

    /**
     * Get all points of route in JSON Format by route id
     *
     * @return JSON
     */
    public function getAllPoints() {
        $points = Point::select('id', 'status', 'store_id')->with(['store' => function($query) {
            $query->select('id', 'address');
        }])->get();

        return $points->toJSON();
    }
}
