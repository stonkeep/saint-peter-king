<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Endereco extends Model
{



    public function pedidos()
    {
        return $this->belongsToMany('App\Pedido');
    }
}
