<?php

namespace Tests\Unit;

use App\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\ValidationsFields;

class UserTest extends TestCase
{
    use DatabaseMigrations;
    use ValidationsFields;

    /** @test */
    public function criarUsuario()
    {
        factory(User::class)->create();
        $user = User::first();
       $this->assertNotNull($user);
    }
}
