<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\StatusPedido::class, function (Faker $faker) {
    return [
        'descricao' => 'pedido recebido'
    ];
});
