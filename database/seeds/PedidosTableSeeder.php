<?php

use App\Cliente;
use App\FormaPagamento;
use App\Pedido;
use App\Produto;
use App\StatusPedido;
use App\TipoEntrega;
use Illuminate\Database\Seeder;

class PedidosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $clientes = Cliente::all();
        foreach ($clientes as $cliente){

            $cliente->pedidos()->create([
                'impressaoDeComprovante' => true,
                'NF' => 123456789,
            ]);

            $pedido =  $cliente->pedidos->first();

            $pedido->formaPagamento()->associate(FormaPagamento::find(rand(1,3)));
            $pedido->tipoEntrega()->associate(TipoEntrega::find(1));
            $pedido->status()->associate(StatusPedido::find(rand(1,4)));


            //Acrescenta os produtos aos pedidos
            $pedido->produtos()->attach([
                1 => ['pesoSaida' => 10,'precoTotal' => 100.00],
                2 => ['pesoSaida' => 10,'precoTotal' => 100.00]
            ]);

            $pedido->save();
        }
    }

}
