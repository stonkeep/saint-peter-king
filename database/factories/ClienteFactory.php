<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\Cliente::class, function (Faker $faker) {
    return [
        'cpf_cnpj' => 11111111111,
        'nome' => $faker->name,
        'telefone' => 123456789,
        'user_id' => 1
    ];
});
