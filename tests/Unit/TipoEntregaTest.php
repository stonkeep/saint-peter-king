<?php

namespace Tests\Unit;

use App\TipoEntrega;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TipoEntregaTest extends TestCase
{
    Use DatabaseMigrations;

    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function testaCrud()
    {
        //Cria tipo de entrega
        factory(TipoEntrega::class)->create();

        //Read o tipo de entrega no banco de dados
        $entrega = TipoEntrega::firstOrFail();

        //faz update
        $entrega->descricao = 'outro tipo';
        $entrega->save();

        //Verifica se foi gravado realmente no banco de dados
        $this->assertEquals(TipoEntrega::firstOrFail()->descricao, 'outro tipo');

        //Deleta registro
        $entrega->delete();
        //Verifica se registro foi mesmo deletado
        $this->assertEmpty(TipoEntrega::first());

    }
}
