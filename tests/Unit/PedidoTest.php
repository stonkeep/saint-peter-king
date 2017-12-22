<?php

namespace Tests\Unit;

use App\Cliente;
use App\Endereco;
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

        //$cliente cria um pedidp
        $cliente->pedidos()->create(factory());
    }
}
