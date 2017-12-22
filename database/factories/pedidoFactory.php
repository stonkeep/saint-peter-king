<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\pedido::class, function (Faker $faker) {
    return [
        'tipoEntrega' => 1,
        'peso' => 12,
        'formaDePagamento' => 1,
        'impressaoDeComprovante' => true,
        'NF' => 123456789,
        'status_id' => 1,
        'pesoDeSaida' => 1,
    ];
});
