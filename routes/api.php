<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//TODO Cadastramento de usuário
//TODO login
//TODO lista fazer pedido
//TODO lista produtos
//TODO lista pedidos
//TODO realiza pedido
//TODO Busca pedido específico
//TODO Cancelar pedido
// TODO push status do pedido quando alterar? (notificação)

