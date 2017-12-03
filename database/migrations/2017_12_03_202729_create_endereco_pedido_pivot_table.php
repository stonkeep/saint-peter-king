<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateenderecoPedidoPivotTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('endereco_pedido', function (Blueprint $table) {
            $table->integer('endereco_id')->unsigned()->index();
            $table->foreign('endereco_id')->references('id')->on('enderecos')->onDelete('cascade');
            $table->integer('pedido_id')->unsigned()->index();
            $table->foreign('pedido_id')->references('id')->on('pedidos')->onDelete('cascade');
            $table->primary(['endereco_id', 'pedido_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('endereco_pedido');
    }
}
