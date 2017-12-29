<?php

use App\TipoEntrega;
use Illuminate\Database\Seeder;

class TipoEntregaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TipoEntrega::create([
            'descricao' => 'Entrega em unico estabelecimento'
        ]);

        TipoEntrega::create([
            'descricao' => 'Entrega em vários estabelecimento'
        ]);
    }
}
