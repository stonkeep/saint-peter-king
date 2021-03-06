<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Pedido
 *
 * @property int $id
 * @property int $cliente_id
 * @property int $tipoEntrega
 * @property int $peso
 * @property int $formaDePagamento
 * @property int $impressaoDeComprovante
 * @property int $NF
 * @property int $status_id
 * @property int $pesoDeSaida
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Endereco[] $enderecos
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereClienteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereFormaDePagamento($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereImpressaoDeComprovante($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereNF($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido wherePeso($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido wherePesoDeSaida($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereTipoEntrega($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Pedido whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Pedido extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $guarded = [];


    public function enderecos()
    {
        return $this->belongsToMany('App\Endereco');
    }

    public function cliente()
    {
        return $this->belongsTo('App\Cliente');
    }

    public function produtos()
    {
        return $this->belongsToMany('App\Produto')->withPivot('pesoSaida', 'precoTotal');
    }

    public function formaPagamento()
    {
        return $this->belongsTo('App\FormaPagamento');
    }

    public function tipoEntrega()
    {
        return $this->belongsTo('App\TipoEntrega');
    }

    public function status()
    {
        return $this->belongsTo('App\StatusPedido');
    }

}
