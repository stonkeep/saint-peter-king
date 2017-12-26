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
}
