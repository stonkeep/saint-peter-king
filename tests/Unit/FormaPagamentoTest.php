<?php

namespace Tests\Unit;

use App\FormaPagamento;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FormaPagamentoTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function testeCrud()
    {
        //Cria forma de pagamento
        factory(FormaPagamento::class)->create();

        //Read se foi mesmo gravado no banco de dados
        $formaPagamento = FormaPagamento::firstOrFail();
        //Verifica se foi o mesmo que estava no factory
        $this->assertEquals(factory(FormaPagamento::class)->make()->descricao, $formaPagamento->descricao);

        //UPDATE
        $formaPagamento->descricao = 'Cartão de Débito';
        $formaPagamento->save();
        //Verifica se foi mesmo atualizado no banco de dados
        $this->assertEquals(FormaPagamento::first()->descricao, 'Cartão de Débito');

        //DELETE
        $formaPagamento->delete();
        //Verifica se foi mesmo deletado
        $formaPagamento = FormaPagamento::first();
        $this->assertEmpty($formaPagamento);
    }

    /**
     * @test
     */
    public function testeCrudComRout()
    {
        //Chama url com metodo post para testar a gravação
        $this->json('POST', route('pagamentos.index'), factory(FormaPagamento::class)->make()->toArray());
        //Verifica se foi gravado no banco de dados
        $pagamento = FormaPagamento::firstOrFail();
        $this->assertNotEmpty($pagamento);

        //Chama get para testar se foi gravado
        $response = $this->json('GET', route('pagamentos.index'));
        //Verifica se viasualisa
        $response->assertSee($pagamento->descricao);

        //Chama update
        $this->json('PUT', route('pagamentos.update', [$pagamento->id]), [
            'descricao' => 'débito',
        ]);
        //Verifica se foi atualizado
        $pagamentoAtualizado = FormaPagamento::firstOrFail();
        $this->assertNotEquals($pagamento, $pagamentoAtualizado);
        $this->assertEquals("débito", $pagamentoAtualizado->descricao);

        //Testa delete
        $this->json('DELETE', route('pagamentos.destroy', [$pagamentoAtualizado->id]));
        //Tenta buscar no banco de dados e verifica se foi mesmo deletado
        $pagamentoDeletado = FormaPagamento::first();
        $this->assertEmpty($pagamentoDeletado);
    }
}
