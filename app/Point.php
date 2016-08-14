<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'points';

    /**
    * The database primary key value.
    *
    * @var string
    */
    protected $primaryKey = 'id';

    /**
     * Attributes that should be mass-assignable.
     *
     * @var array
     */
    protected $fillable = ['route_id', 'store_id', 'user_id', 'products', 'status'];

    /**
     * Make relationship with Stores table
     */
    public function store()
    {
        return $this->belongsTo('App\Store');
    }

}
