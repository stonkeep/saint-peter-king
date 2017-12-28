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
            $table->integer('cliente_id')->unsigned();
            $table->foreign('cliente_id')->references('id')->on('pedidos');
            $table->integer('tipo_entregas_id')->unsigned();
            $table->foreign('tipo_entregas_id')->references('id')->on('tipo_entregas');
            $table->integer('forma_pagamentos_id')->unsigned()->nullable();
            $table->foreign('forma_pagamentos_id')->references('id')->on('forma_pagamentos');
            $table->boolean('impressaoDeComprovante');
            $table->integer('NF');
            $table->integer('status_id');
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
