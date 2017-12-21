<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Cliente
 *
 * @property int $id
 * @property int $cpf_cnpj
 * @property string $nome
 * @property int $telefone
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Endereco[] $enderecos
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cliente whereCpfCnpj($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cliente whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cliente whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cliente whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cliente whereTelefone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Cliente whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Cliente extends Model
{
    protected $guarded = [];

    public function enderecos()
    {
        return $this->morphMany('App\Endereco', 'addressable');
    }

    public function pedidos()
    {
        return $this->hasMany('App\Pedido');
    }

    /**
     * Get the phone record associated with the user.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
