<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */


$factory->define(App\Cliente::class, function (Faker $faker) {
    $faker = \Faker\Factory::create('pt_BR');
    return [
        'cpf_cnpj' => $faker->cpf(false),
        'nome' => $faker->name,
        'telefone' => 123456789,
        'user_id' => 1
    ];
});
