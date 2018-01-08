<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Produto
 *
 * @property int $id
 * @property string $nome
 * @property string $descricao
 * @property float $peso_unitario
 * @property float $preco_unitario
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Produto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Produto whereDescricao($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Produto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Produto whereNome($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Produto wherePesoUnitario($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Produto wherePrecoUnitario($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Produto whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Produto extends Model
{

    protected $guarded = [];

    public function estoque()
    {
       return $this->hasMany("App\Estoque");
    }

}
