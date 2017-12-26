<?php

use Illuminate\Database\Seeder;

class StatusPedidoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\StatusPedido::create([
            'descricao' => 'pedido recebido'
        ]);
        \App\StatusPedido::create([
            'descricao' => 'em montagem'
        ]);
        \App\StatusPedido::create([
            'descricao' => 'saiu para entrega'
        ]);
        \App\StatusPedido::create([
            'descricao' => 'entregue'
        ]);

    }
}
