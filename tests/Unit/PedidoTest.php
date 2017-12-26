<?php

namespace Tests\Unit;

use App\Cliente;
use App\Endereco;
use App\Pedido;
use App\Produto;
use App\TipoEntrega;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PedidoTest extends TestCase
{
    Use DatabaseMigrations;

    public function setUp()
    {
        parent::setUp();
        factory(TipoEntrega::class)->create();
    }

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

        //$cliente cria um pedido
        $cliente->pedidos()->create([
            'tipoEntrega' => TipoEntrega::first(),
            'formaDePagamento' => 1,
            'impressaoDeComprovante' => true,
            'NF' => 123456789,
            'status_id' => 1,
        ]);

        //TODO criar tabela com o formas de pagamentos
        //TODO criar tabela com os status do pedido

        //Busca o pedido gravado
        $pedido = $cliente->pedidos()->first();

        //Acrescenta os produtos aos pedidos
        $pedido->produtos()->attach([
            1 => ['pesoSaida' => 10,'precoUnitario' => 10],
            2 => ['pesoSaida' => 10,'precoUnitario' => 10]
        ]);

        //Verifica se foi gravado o pedido
        $this->assertNotEmpty($cliente->pedidos()->first()->produtos);

        //Faz update no status da entrega
        $pedido = $cliente->pedidos()->first();
        $pedido->status_id = 2;
        $pedido->save();
        //Verifica se foi mesmo atualizado no banco de dados
        $this->assertEquals(Pedido::first()->status_id, 2);


        //Deleta o pedido
        $pedido->delete();

        //Verifica se op pedido foi realmente deletado
        $this->assertEmpty(Pedido::first());

    }
}
