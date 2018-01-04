<?php

namespace App\Http\Controllers;

use App\cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //Busca todos os clientes da base
        $data = Cliente::all();

        //Retorna view com os dados necessárioss
        return view('admin.clientes.index', compact('data'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //Cria objeto em branco para não dar problema no componente
        $cliente = new Cliente();

        //Retorna view com os dados necessárioss
        return view('admin.clientes.create', compact('cliente'));
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
        $this->validate($request, [
            //CPF ou CPNJ é obrigatório e tem que ser unico na tabela
            'cpf_cnpj' => 'required|unique:clientes',
            'nome' => 'required',
            'telefone' => 'required',
        ]);

        //Cria cliente mas ainda não grava no banco de dados
        $cliente = Cliente::make($request->all());

        //Busca usuário logado no sistema
        $user = Auth::user();

        //Vincula dados do cliente com o usuário
        $user->cliente()->save($cliente);

        //Se chegou até aqui e não deu problema mostra mensagem na tela
        flash('Cliente gravado com sucesso')->success();

        //Chama a lista de clientes
        redirect()->route('clientes.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\cliente  $empresa
     * @return \Illuminate\Http\Response
     */
    public function show(cliente $empresa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\cliente  $empresa
     * @return \Illuminate\Http\Response
     */
    public function edit(cliente $cliente)
    {
        //Retorna a view com dados necessários
        return view('admin.clientes.edit', compact('cliente'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\cliente  $empresa
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, cliente $empresa)
    {
        //TODO falta fazer
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\cliente  $empresa
     * @return \Illuminate\Http\Response
     */
    public function destroy(cliente $empresa)
    {
        //TODO falta fazer
    }
}
