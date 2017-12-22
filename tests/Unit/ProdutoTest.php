<?php

namespace Tests\Unit;

use App\Produto;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProdutoTest extends TestCase
{
    use DatabaseMigrations;


    /** @test */
    public function testaCRUD()
    {
        $this->json('POST', "/admin/produtos/", [
            'nome' => "Tilápia",
            'descricao' => "tilápia fresca",
            'peso_unitario' => 1,
            'preco_unitario' => 10,
        ]);

        $produto = Produto::firstOrFail();

        $this->assertEquals("Tilápia", $produto->nome);
        $this->assertEquals("tilápia fresca", $produto->descricao);

        //testa Index
        $response = $this->json('GET', "/admin/produtos");
        $response->assertSee("Tilápia");

        //Testa update
        $response = $this->json('PUT', "admin/produtos/{$produto->id}", [
            'nome' => "Peixe qualquer",
            'descricao' => "tilápia fresca",
            'peso_unitario' => 1,
            'preco_unitario' => 10,
        ]);
        //Verifica se update foi feito
        $response = $this->json('GET', "/admin/produtos");
        $response->assertSee("Peixe qualquer");

        //testa DELETE
        $this->json('GET', "admin/produtos/delete/$produto->id");
        //Verifica se delete foi feito
        $response = $this->json('GET', "/admin/produtos");
        $response->assertDontSee("Peixe qualquer");
    }

}
