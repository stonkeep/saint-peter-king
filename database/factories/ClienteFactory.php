<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\Cliente::class, function (Faker $faker) {
    return [
        'cpf_cnpj' => 11111111111,
        'nome' => $faker->name,
        'telefone' => $faker->phoneNumber,
    ];
});
