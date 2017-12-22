<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\Produto::class, function (Faker $faker) {
    return [
        'nome' => $faker->company,
        'descricao' => $faker->catchPhrase,
        'pesoUnitario' => 1,
        'precoUnitario' => 10,
    ];
});
