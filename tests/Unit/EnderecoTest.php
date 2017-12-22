<?php

namespace Tests\Unit;

use App\Endereco;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EnderecoTest extends TestCase
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
    public function criaEndereco()
    {
        $this->assertTrue(true);
    }
}
