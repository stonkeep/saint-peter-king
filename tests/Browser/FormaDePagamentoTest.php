<?php

namespace Tests\Browser;

use App\FormaPagamento;
use App\User;
use Tests\DuskTestCase;
use Laravel\Dusk\Browser;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class FormaDePagamentoTest extends DuskTestCase
{
    use DatabaseMigrations;

    public function setUp()
    {
        parent::setUp();

        User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com.br',
            'password' => 123456
        ]);
    }


    /**
     * A Dusk test example.
     *
     * @return void
     */
    public function testeCRUDFormaDePagamento()
    {
        $formaDePagamentoTexto = 'pagamento1';
        $this->browse(function (Browser $browser) use ($formaDePagamentoTexto) {
            //Inicia teste com login de usuário criado no SetUp()
            $browser->loginAs(User::find(1))
                ->visit('/admin')
                //Espera pagina carregar
                ->waitForText('Dashboard')
                //Verifica se link existe
                ->assertSee('Formas de pagamento')
                //Clica no link
                ->clickLink('Formas de pagamento')

                //Crud para criação de nova forma de pagamento
                ->clickLink('NOVO')
                ->waitFor('#descricao')
                ->assertPathIs('/admin/pagamentos/create')
                ->type('#descricao', $formaDePagamentoTexto)
                ->press('Enviar')
                ->waitForLocation('/admin/pagamentos')
                ->assertSee($formaDePagamentoTexto);


                //CRUD update
            $browser->visit('/admin/pagamentos')
                ->click('@editar4')
                ->waitFor('#descricao')
                ->clear('descricao')
                ->type('#descricao', 'pagamento2')
                ->press('Enviar')
                ->waitForLocation('/admin/pagamentos')
                ->assertSee('pagamento2');


                //CRUD delete
                $browser->visit('/admin/pagamentos')
                ->click('@excluir4')
                ->waitForLocation('/admin/pagamentos')
                ->assertDontSee('pagamento2')
                ->assertDontSee($formaDePagamentoTexto)
            ;
        });
    }
}
