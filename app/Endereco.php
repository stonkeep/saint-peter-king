<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Endereco
 *
 * @property int $id
 * @property string $nome
 * @property string $cidade
 * @property string $logradouro
 * @property int $cep
 * @property int $numero
 * @property string $complemento
 * @property int $addressable_id
 * @property string $addressable_type
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $addressable
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Pedido[] $pedidos
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereAddressableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereAddressableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereCep($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereCidade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereComplemento($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereLogradouro($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereNumero($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Endereco whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Endereco extends Model
{
    use SoftDeletes; //When models are soft deleted, they are not actually removed from your database.

    protected $guarded = [];


    public function pedidos()
    {
        return $this->belongsToMany('App\Pedido');
    }

    public function addressable()
    {
        return $this->morphTo();
    }

    //SoftDeletes
    protected $dates = ['deleted_at'];
}
