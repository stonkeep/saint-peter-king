<?php

namespace Tests\Unit;

use App\StatusPedido;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class StatusPedidoTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function crudBancoDeDados()
    {
        //Cria status de pedido
        factory(StatusPedido::class)->create();

        //Le o status do banco de dados
        $status = StatusPedido::firstOrFail();
        //Verifica se a descricao é a esperada
        $this->assertEquals(factory(StatusPedido::class)->make()->descricao, $status->descricao);

        //UPDATE
        $status->update([
            'descricao' => 'problema no pagamento'
        ]);
        //Verifica se foi gravado no banco de dados corretamente
        $this->assertEquals(StatusPedido::first()->descricao, "problema no pagamento");

        //DELETE
        $status->delete();
        //Verifica se foi deletado mesmo
        $this->assertEmpty(StatusPedido::first());
    }
}
