<?php

namespace Tests\Unit;

use App\Cliente;
use App\Endereco;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ClienteTest extends TestCase
{
    use DatabaseMigrations;

    public function setUp()
    {
        parent::setUp();
    }

    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function criaCliente()
    {
        factory(Cliente::class)->create();
        $cliente = Cliente::first();
        var_dump($cliente->nome);

        //Verificação
        $this->assertNotNull($cliente);
    }

    /** @test */
    public function testaRelationamento()
    {
        factory(Cliente::class)->create();

        $cli1 = Cliente::first();
        $cli1->enderecos()->create([
            'nome' => 'Endereco1',
            'cidade' => 'Brasilia',
            'logradouro' => 'Endereco',
            'cep' => 71900000,
            'numero' => 9,
            'Complemento' => 'Complemento',
//            'addressable_id' => 1,
//            'addressable_type' => 'App\Cliente'
        ]);

        //Verificações
        $this->assertEquals("Endereco1", $cli1->enderecos->first()->nome);
    }

    //TODO CRUD
}
