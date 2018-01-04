<?php

namespace App\Http\Controllers;

use App\StatusPedido;
use Illuminate\Http\Request;

class StatusPedidoController extends Controller
{
    //TODO fazer o CRUD
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //busca todos os status da tabela
        $data = StatusPedido::all();

        //Retorna a view com os dados necessários
        return view('admin.status.index', compact("data"));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //Cria um objeto vazio para não dar problema no componente
        $status = new StatusPedido();

        //Retorna a view com os dados necessários
        return view("admin.status.create", compact('status'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //Valida os dados informados
        $request->validate([
            "descricao" => "required"
        ]);


        //TEnta fazer a criação no banco de dados
        try {
            //Grava no forma de pagamento na tabela
            StatusPedido::create($request->all());

            //mostra mensagem na tela
            flash('Dados cadastrado com sucesso');

        } catch (\Exception $e) {
            //Se de erro mostra na tela a mensagem
            flash($e->getMessage())->error();
            return response('Algo deu errado. Favor verificar', 500)->header('Content-Type', 'text/plain');
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\StatusPedido  $statusPedido
     * @return \Illuminate\Http\Response
     */
    public function show(StatusPedido $statusPedido)
    {
        //Retorna a view com os dados necessários
        return view('admin.pagamentos.edit', compact('pagamento'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\StatusPedido  $statusPedido
     * @return \Illuminate\Http\Response
     */
    public function edit(StatusPedido $status)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\StatusPedido  $status
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, StatusPedido $status)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\StatusPedido  $status
     * @return \Illuminate\Http\Response
     */
    public function destroy(StatusPedido $status)
    {
        //
    }
}
