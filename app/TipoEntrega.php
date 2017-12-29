<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoEntrega extends Model
{
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    //Defini que campos serão protegidos de geração automatica
    protected $guarded = [];

    public function pedidos()
    {
        return $this->hasMany('App\Pedido');
    }

}
