<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/admin', 'HomeController@index')->name('admin');

Route::prefix('admin')->group(function () {

    //Rora Clientes
    Route::resource('clientes', 'ClienteController');
    Route::get('/clientes/delete/{cliente}', ['as' => 'clientes.delete', 'uses' => 'ClienteController@destroy']); //TODO testar essa parte


//    Route Produtos
    Route::resource('produtos', 'ProdutoController');
    Route::get('/produtos/delete/{produto}', ['as' => 'produtos.delete', 'uses' => 'ProdutoController@destroy']);


    Route::resource('permissions', 'PermissionController');
    Route::resource('roles', 'RoleController');
    Route::resource('estoques', 'EstoqueController');

    //Route Formas de pagamento
    Route::resource('pagamentos', 'FormaPagamentoController');
    Route::get('/pagamentos/delete/{pagamento}', ['as' => 'pagamentos.delete', 'uses' => 'FormaPagamentoController@destroy']);
//    Route::resource('users', 'UserController');


    //Route Pedidos
    Route::resource('pedidos', 'PedidoController');
    Route::get('/pedidos/delete/{pedido}', ['as' => 'pedidos.delete', 'uses' => 'PedidoController@destroy']);
});
