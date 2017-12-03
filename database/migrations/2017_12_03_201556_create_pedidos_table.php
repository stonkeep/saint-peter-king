<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePedidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('cliente_id');
            $table->integer('tipoEntrega');
            $table->integer('peso');
            $table->integer('formaDePagamento');
            $table->integer('impressaoDeComprovante');
            $table->integer('NF');
            $table->integer('status_id');
            $table->integer('pesoDeSaida');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pedidos');
    }
}
