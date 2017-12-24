<?php

use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Cria usuário padrão admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com.br',
            'password' => 123456
        ]);

        //Cria usuários genéricos
        factory(User::class, 30)->create();
    }
}
