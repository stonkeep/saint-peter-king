<?php

use App\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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
        $user = \App\User::create([
            'name'           => 'admin',
            'email'          => 'admin@admin.com.br',
            'password'       => $password = '123456',
            'remember_token' => str_random(10),
        ]);

        $user->assignRole('Admin');
        //Cria usuários genéricos
        factory(User::class, 10)->create();
    }
}
