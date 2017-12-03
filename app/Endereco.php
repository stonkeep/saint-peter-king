<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Endereco extends Model
{

    protected $guarded = [];


    public function pedidos()
    {
        return $this->belongsToMany('App\Pedido');
    }

    public function addressable()
    {
        return $this->morphTo();
    }
}
