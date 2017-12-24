<?php

use App\Cliente;
use App\User;
use Illuminate\Database\Seeder;

class ClientesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();

        foreach ($users as $user) {
            $cliente = factory(Cliente::class)->make();
            $user->cliente()->save($cliente);
        }
    }
}
