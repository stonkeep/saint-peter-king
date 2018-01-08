<?php

namespace Tests\Unit;

use App\Produto;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EstoqueTest extends TestCase
{
    use DatabaseTransactions;
    use DatabaseMigrations;

    protected function setUp()
    {
        parent::setUp();

        factory(Produto::class, 10)->create();
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testeCrud()
    {
        //Busca produto para acidionar estoque
        $produto = Produto::firstOrFail();


        $produto->estoque()->create([
            'quantidade' => 10,
        ]);

    }
}
