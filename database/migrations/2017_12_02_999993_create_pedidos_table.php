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
            $table->integer('tipo_entrega_id')->unsigned()->nullable();
            $table->foreign('tipo_entrega_id')->references('id')->on('tipo_entregas');
            $table->integer('forma_pagamento_id')->unsigned()->nullable();
            $table->foreign('forma_pagamento_id')->references('id')->on('forma_pagamentos');
            $table->boolean('impressaoDeComprovante');
            $table->integer('NF');
            $table->integer('status_id')->unsigned()->nullable();
            $table->foreign('status_id')->references('id')->on('status_pedidos');
            $table->timestamps();
            $table->softDeletes();
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
