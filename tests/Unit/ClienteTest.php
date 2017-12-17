<?php

namespace Tests\Unit;

use App\Cliente;
use App\Endereco;
use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Symfony\Component\VarDumper\Dumper\DataDumperInterface;
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

        //Verificação
        $this->assertNotNull($cliente);
    }

    /** @test */
    public function testaRelationamentoEndereco()
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

    /** @test */
    public function testaCrudComUsuario()
    {
        //Cria Usuáiro
        factory(User::class)->create();
        //Recupera usuário criado
        $user = User::first();
        //Verifica se o usuário existe mesmo
        $this->assertNotNull($user);

        //Cria um cliente para o novo usuário
        $user->cliente()->create([
            'cpf_cnpj' => 11111111111,
            'nome' => "Jose",
            'telefone' => 123456789,
        ]);

        $cliente = Cliente::first();

        $this->assertEquals($user->name, $cliente->user->name);

        //Testa UPDATE
        $cliente->nome = "Arthur";
        $cliente->save();
        $cliente = Cliente::first();
        //verifica
        $this->assertEquals("Arthur", $cliente->nome);

        //Testa Delete
        $user->cliente()->delete();
        //Tenta achar o cliente no banco de dados
        $cliente = Cliente::first();
        //Assert que não achou
        $this->assertNull($cliente);
    }
}
