<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    //


    public function enderecos()
    {
        return $this->belongsToMany('App\Endereco');
    }
}
