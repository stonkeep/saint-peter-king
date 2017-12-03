<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $guarded = [];


    public function enderecos()
    {
        return $this->belongsToMany('App\Endereco');
    }
}
