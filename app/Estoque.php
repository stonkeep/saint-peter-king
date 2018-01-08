<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
    use SoftDeletes;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    protected $guarded = [];

    public function produto()
    {
        return $this->belongsTo("App\Produto");
    }
}
