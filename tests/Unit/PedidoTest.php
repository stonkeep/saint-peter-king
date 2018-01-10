<?php

namespace Tests\Unit;

use App\Cliente;
use App\Endereco;
use App\FormaPagamento;
use App\Pedido;
use App\Produto;
use App\StatusPedido;
use App\TipoEntrega;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PedidoTest extends TestCase
{
    Use DatabaseMigrations;
    Use DatabaseTransactions;

    //Aqui cria-se os dados comuns que serão utilizados em todos os teste
    public function setUp()
    {
        parent::setUp();
        //Cria dois produtos
        factory(Produto::class, 2)->create();

        //Para fazer pedido precisa de um cliente
        factory(Cliente::class)->create();
        $cliente = Cliente::first();

        //Tudo precisa de um usuário
        factory(User::class)->create();
        $user = User::first();

        //cria endereço e vincula a cliente

        $cliente->enderecos()->save(factory(Endereco::class)->make());

        //Cria o tipo de entrega
        factory(TipoEntrega::class)->create();
        TipoEntrega::create([
            'descricao' => 'rapida'
        ]);

        //Cria forma de pagamento 1
        factory(FormaPagamento::class)->create();

        //Cria forma de pagamento 2
        FormaPagamento::create([
            'descricao' => 'cartão de débito'
        ]);

        //Cria o primeiro status do pedido
        factory(StatusPedido::class)->create();

        //Cria-se mais um status do pedido para estar a alteração do mesmo
        \App\StatusPedido::create([
            'descricao' => 'entregue'
        ]);
    }

    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function crudPedido()
    {

        //$cliente cria um pedido
        $cliente = Cliente::first();

        $cliente->pedidos()->create([
//            'tipo_entregas_id' => TipoEntrega::first()->id,
//            'forma_pagamentos_id' => FormaPagamento::firstOrFail()->id,
            'impressaoDeComprovante' => true,
            'NF' => 123456789,
//            'status_id' => 1,
        ]);




        //Busca o pedido gravado
        $pedido = Pedido::firstOrFail();
        $pedido->formaPagamento()->associate(FormaPagamento::find(1));
        $pedido->tipoEntrega()->associate(TipoEntrega::find(1));
        $pedido->status()->associate(StatusPedido::find(1));

        //Acrescenta os produtos aos pedidos
        $pedido->produtos()->attach([
            1 => ['pesoSaida' => 10,'precoUnitario' => 10],
            2 => ['pesoSaida' => 10,'precoUnitario' => 10]
        ]);

        //Verifica se foi gravado o pedido
        $this->assertNotEmpty($cliente->pedidos()->first()->produtos);
        $this->assertEquals($pedido->formaPagamento, FormaPagamento::find(1));
        $this->assertEquals($pedido->tipoEntrega, TipoEntrega::find(1));
        $this->assertEquals($pedido->status, StatusPedido::find(1));

        //testa update na forma de pagamento
        $pedido = $cliente->pedidos()->first();
        $pedido->formaPagamento()->associate(FormaPagamento::find(2));
        $pedido->save();

        //Verifica se a forma de pagamento foi atualizada
        $this->assertEquals(Pedido::firstOrFail()->formaPagamento->id, 2);
        $this->assertEquals(Pedido::firstOrFail()->formaPagamento->descricao, FormaPagamento::find(2)->descricao);


        //Testa tipo de entrega
        $pedido = $cliente->pedidos()->first();
        $pedido->tipoEntrega()->associate(TipoEntrega::find(2));
        $pedido->save();


        //Verifica se a forma de pagamento foi atualizada
        $this->assertEquals(Pedido::firstOrFail()->tipoEntrega->id, 2);
        $this->assertEquals(Pedido::firstOrFail()->tipoEntrega->descricao, TipoEntrega::find(2)->descricao);


        //Testa alteração no status do pedido
        //Busca pedido na base
        $pedido = $cliente->pedidos()->first();

        //Altera
        $pedido->status()->associate(StatusPedido::find(2));
        $pedido->save();

        //verifica se a alteração funcionou
        $this->assertEquals('entregue', $pedido->status->descricao);

        //Deleta o pedido
        $pedido->delete();
        //Verifica se op pedido foi realmente deletado
        $this->assertEmpty(Pedido::first());
    }

    //TODO fazer o front end e testar
    //TODO teste de validação

}
