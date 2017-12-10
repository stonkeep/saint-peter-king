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
    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function crud()
    {
        factory(Produto::class)->create();
        $produto = Produto::first();
        $this->assertNotNull($produto);
    }

    /** @test */
    public function criaProduto()
    {
        $this->json('POST', "/admin/produtos/", [
            'nome' => "Tilápia",
            'descricao' => "tilápia fresca",
            'peso_unitario' => 1,
            'preco_unitario' => 10,
        ]);

        $produto = Produto::first();

        $this->assertEquals("Tilápia", $produto->nome);
        $this->assertEquals("tilápia fresca", $produto->descricao);

        $response = $this->json('GET', "/admin/produtos");

        $response->assertSee("Tilápia");

    }

}
