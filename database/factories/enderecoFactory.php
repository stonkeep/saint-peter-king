<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\Endereco::class, function (Faker $faker) {
    return [
        'nome' => $faker->name,
        'cidade' => $faker->city,
        'logradouro' => $faker->address,
        'cep' => 71900000,
        'numero' => 9,
        'Complemento' => $faker->company
    ];
});
