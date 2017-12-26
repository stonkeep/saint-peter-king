<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\TipoEntrega::class, function (Faker $faker) {
    return [
        'descricao' => 'Pessoal'
    ];
});
