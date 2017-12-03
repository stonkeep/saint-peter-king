<?php

namespace Tests\Unit;

use App\Endereco;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EnderecoTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic test example.
     *
     * @return void
     * @test
     */
    public function criaEndereco()
    {
        factory(Endereco::class)->create();
        $end = Endereco::first();

        //Assertions
        $this->assertNotNull($end);
    }
}
