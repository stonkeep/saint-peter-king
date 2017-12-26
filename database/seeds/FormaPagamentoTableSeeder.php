<?php

use Illuminate\Database\Seeder;

class FormaPagamentoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\FormaPagamento::class)->create();
        \App\FormaPagamento::create([
            'descricao' => 'cartão de débito'
        ]);

        \App\FormaPagamento::create([
            'descricao' => 'dinheiro'
        ]);
    }
}
