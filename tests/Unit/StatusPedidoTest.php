<?php

namespace Tests\Unit;

use App\StatusPedido;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class StatusPedidoTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp()
    {
        parent::setUp();

    }

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

    /**
     * @test
     */
    public function testeCrudFrontEnd()
    {
        //Cria Status de pedido fia POST
        $this->json('POST', 'admin/status', [
            'descricao' => 'pedido recebido'
        ]);

        //Testa GET
        $response = $this->json('GET', 'admin/status');

        //verifica se resgistro esta na tela
        $response->assertSee('pedido recebido');

        //Busca status no banco de dados para ver se gravou mesmo
        $status = StatusPedido::firstOrFail();

        //Verifica se não é nulo
        $this->assertNotNull($status);

        //Verifica se o dado gravado foi realmente o passado
        $this->assertEquals('pedido recebido', $status->descricao);

        //Atualiza pedido
        $this->json('PUT', "admin/status/{$status->id}", [
            'descricao' => 'Entregue'
        ]);

        //Busca status no banco de dados para ver se gravou mesmo
        $status = StatusPedido::firstOrFail();

        //verifica se o registro foi alterado
        $this->assertEquals('Entregue', $status->descricao);
        $this->assertNotEquals('pedido recebido', $status->descricao);

        //Testa delete
        $this->json('DELETE', "admin/status/{$status->id}");

        //Busca index da lista de status
        $response = $this->json('GET', 'admin/status');

        //Verifica se registro não aparece na tela
        $response->assertDontSee('Entregue');

        //Busca registro no banco de dados
        $status = StatusPedido::first();

        //Verifica se status esta nulo logo foi deletado
        $this->assertNull($status);

    }
    //TODO teste de validação

}
