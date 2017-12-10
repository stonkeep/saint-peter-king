<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\Produto::class, function (Faker $faker) {
    return [
        'id' => 1,
        'nome' => "Tilápia",
        'descricao' => "tilápia fresca",
        'peso_unitario' => 1,
        'preco_unitario' => 10,
    ];
});
