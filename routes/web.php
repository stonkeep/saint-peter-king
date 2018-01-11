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
    Route::get('/clientes/delete/{cliente}', ['as' => 'clientes.delete', 'uses' => 'ClienteController@destroy']);


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

    //Route Status pedido
    Route::resource('status', 'StatusPedidoController');
    Route::get('/status/delete/{status}', ['as' => 'status.delete', 'uses' => 'StatusPedidoController@destroy']);

    //Permissões
    Route::resource('users', 'UserController');
    Route::resource('roles', 'RoleController');
    Route::resource('permissions', 'PermissionController');

   //Posts
    Route::get('posts', 'PostController@index')->name('indexPosts');
    // show new post form
    Route::get('new-post', 'PostController@create')->name('createPosts');
    // save new post
    Route::post('new-post', 'PostController@store')->name('storePosts');
    // edit post form
    Route::get('posts/edit/{slug}', 'PostController@edit')->name('editPosts');
    // update post
    Route::post('post/update/', 'PostController@update')->name('updatePosts');
    // delete post
    Route::get('posts/delete/{id}', 'PostController@destroy')->name('destroyPosts');
    // display user's all posts
    Route::get('my-all-posts', 'UserController@user_posts_all');
    // display user's drafts
    Route::get('my-drafts', 'UserController@user_posts_draft');

//    Posts Categoria
    Route::resource('post-categorias', 'PostCategoriaController');

});

//// display single post
Route::get('/posts/{slug}', ['as' => 'post', 'uses' => 'PostController@show'])->where('slug', '[A-Za-z0-9-_]+');





