<?php

namespace Tests\Unit;

use App\Cliente;
use App\Endereco;
use App\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    private $user;

    public function criaUsuario()
    {
        //Cria Usuáiro
        factory(User::class)->create();
        //Recupera usuário criado
        $this->user = User::first();
        //Loga usuário no sistema
        Auth::login($this->user);
        //Verifica se o usuário existe mesmo
        $this->assertNotNull($this->user);
    }


    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function testaCriaCliente()
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

    /** @test */
    public function testaCrudComUsuario()
    {
        $this->criaUsuario();

        //Cria um cliente para o novo usuário
        $this->user->cliente()->create([
            'cpf_cnpj' => 11111111111,
            'nome' => "Jose",
            'telefone' => 123456789,
        ]);

        $cliente = Cliente::first();

        $this->assertEquals( $this->user->name, $cliente->user->name);

        //Testa UPDATE

        $cliente = Cliente::first();
        $cliente->nome = "Arthur";
        //verifica
        $this->assertEquals("Arthur", $cliente->nome);



        //Testa Delete

         $this->user->cliente()->delete();
        //Tenta achar o cliente no banco de dados
        $cliente = Cliente::first();
        //Assert que não achou
        $this->assertNull($cliente);
    }


    /**
     * @test
    */

    public function testaCrudComEndereco()
    {
        //Cria Usuáiro
        factory(User::class)->create();
        //Recupera usuário criado
         $this->user = User::first();
        //Verifica se o usuário existe mesmo
        $this->assertNotNull( $this->user);


        //Cria um cliente para o novo usuário
        $this->user->cliente()->create([
            'cpf_cnpj' => 11111111111,
            'nome' => "Jose",
            'telefone' => 123456789,
        ]);
        $cliente = Cliente::first();

        //Verifica se nome do usuário vinculado ao cliente é o mesmo
        $this->assertEquals( $this->user->name, $cliente->user->name);

        //Crio um endereço novo vinculando o mesmo ao novo cliente
        $cliente->enderecos()->create([
            'nome' => "Endereço 1",
            'cidade' => "Brasília",
            'logradouro' => "Quadra 111",
            'cep' => 71900000,
            'numero' => 9,
            'Complemento' => "perto de alguma coisa"
        ]);

        //Busca novamente o cliente no banco de dados para ter certeza
        $cliente = Cliente::first();
        //Como o relacionamento retorna um array de objeto, chamo somente um registro retornando assim somente o objeto
        $this->assertEquals($cliente->enderecos->find(1)->nome, "Endereço 1");

        //Aqui verificase se o endereço gravado no banco de dados é o mesmo que esta com o cliente
        $endereco = Endereco::first();
        $this->assertEquals($cliente->enderecos->find(1)->id, $endereco->id);

        //UPDATE do endereço gravado no banco
        $endereco->nome = "Endereço 2";
        $endereco->save();

        //Valida se o endereço foi mesmo alterado
        $endereco = Endereco::first();
        $this->assertEquals($endereco->nome, "Endereço 2");

        //DELETE do endereço do cliente
        $endereco->delete();

        //Valida se o endereço foi corretamente deletado
        $this->assertTrue($endereco->trashed());

        //Busca endereços que não estão deletados
        $endereco = Endereco::all();

        //Valida se não foi achado nada
        $this->assertEmpty($endereco);

        //Agora busca endereços que foram deletados com softdelete
        $endereco = Endereco::withTrashed();

        //Valida a existencia do endereço no banco
        $this->assertNotEmpty($endereco);

    }

    /**
     * @test
     */
    public function testeCrudFrontEnd()
    {
        //Cria usuário para vincular o cliente
        $this->criaUsuario();

        //Chama post para criar cliente
        $this->json('POST', 'admin/clientes', [
            'cpf_cnpj' => 11111111111,
            'nome' => "Jose",
            'telefone' => 123456789,
        ]);

        //Testa o GET para verificar se cliente existe
        $response = $this->json('GET', 'admin/clientes');

        //Verifica se cliente foi criado
        $response->assertSee("Jose");

        //Busca cliente no banco de dados
        $cliente = Cliente::firstOrFail();

        $cliente->nome = "Mateus o lindo";
        $response = $this->json('PUT', "admin/clientes/{$cliente->id}", $cliente->toArray());

        //Verifica se retornou ok
        $response->assertStatus(200);

        //Veriica se cliente foi alterado
        $this->assertEquals($cliente->nome, Cliente::firstOrFail()->nome);

        //Deleta resgistro da tabela
        $response = $this->json('DELETE', "admin/clientes/{$cliente->id}");

        //Verifica se a resposta vai ser um redirecionamento
        $response->assertStatus(302);

        //busca registro no banco de dados
        $cliente = Cliente::first();

        //Verifica se não foi mesmo achado o registro
        $this->assertNull($cliente);
    }

    //TODO teste de validação
}
