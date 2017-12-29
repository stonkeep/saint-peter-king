<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         $this->call(UsersTableSeeder::class);
         $this->call(StatusPedidoTableSeeder::class);
         $this->call(TipoEntregaTableSeeder::class);
         $this->call(FormaPagamentoTableSeeder::class);
         $this->call(ProdutosTableSeeder::class);
         $this->call(ClientesTableSeeder::class);
    }
}
