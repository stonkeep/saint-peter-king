<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Estoque
 *
 * @property int $id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Estoque whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Estoque whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Estoque whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Estoque extends Model
{
    protected $guarded = [];
}
