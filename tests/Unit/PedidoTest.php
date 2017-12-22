<?php

namespace Tests\Unit;

use App\Cliente;
use App\Endereco;
use App\Pedido;
use App\Produto;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PedidoTest extends TestCase
{
    Use DatabaseMigrations;

    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function crudPedido()
    {

        //Tudo precisa de um usuário
        factory(User::class)->create();
        $user = User::first();

        //Para fazer pedido precisa de um cliente
        factory(Cliente::class)->create();
        $cliente = Cliente::first();

        //cria endereço e vincula a cliente
        $cliente->enderecos()->save(factory(Endereco::class)->make());

        factory(Produto::class, 2)->create();
        $produto = Produto::find(1);
        $produto2 = Produto::find(2);

        //$cliente cria um pedidp
        $cliente->pedidos()->create([
            'tipoEntrega' => 1,
            'formaDePagamento' => 1,
            'impressaoDeComprovante' => true,
            'NF' => 123456789,
            'status_id' => 1,
        ]);

        //Busca o pedido gravado
        $pedido = $cliente->pedidos()->first();

        //Acrescenta os produtos aos pedidos
        $pedido->produtos()->attach([
            1 => ['pesoSaida' => 10,'precoUnitario' => 10],
            2 => ['pesoSaida' => 10,'precoUnitario' => 10]
        ]);

        //Verifica se foi gravado o pedido
        $this->assertNotEmpty($cliente->pedidos()->first()->produtos);

        //TODO more asserts

    }
}
