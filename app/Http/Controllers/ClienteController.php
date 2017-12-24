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
        $data = Cliente::all();

        return view('admin.clientes.index', compact('data'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $cliente = new Cliente();
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
        $this->validate($request, [
//            'cpf_cnpj' => 'required',
            'cpf_cnpj' => 'required|unique:clientes',
            'nome' => 'required',
            'telefone' => 'required',
        ]);

        $cliente = Cliente::make($request->all());

        $user = Auth::user();
        $user->cliente()->save($cliente);


        $data = Cliente::all();
        flash('Cliente gravado com sucesso')->success();

        return view('admin.clientes.index', compact('data'));
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\cliente  $empresa
     * @return \Illuminate\Http\Response
     */
    public function destroy(cliente $empresa)
    {
        //
    }
}
