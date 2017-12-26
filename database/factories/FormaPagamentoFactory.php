<?php

use Faker\Generator as Faker;

/* @var Illuminate\Database\Eloquent\Factory $factory */

$factory->define(App\FormaPagamento::class, function (Faker $faker) {
    return [
        'descricao' => 'cartão de crédito'
    ];
});
