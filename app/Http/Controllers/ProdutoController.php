<?php

namespace App\Http\Controllers;

use App\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //TODO fazer esquema de paginação
        //busca todas os produtos na tabela
        $data = Produto::all();

        //Retorna a view com os dados necessários
        return view('admin.produtos.index', compact('data'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //Cria objeto em branco
        $produto = new Produto();

        //Retorna a view com os dados necessários
        return view('admin.produtos.create', compact('produto'));
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
        $this->validate($request,
            [
                "nome" => "required:string",
                "descricao" => "required:string",
                "peso_unitario" => "required:numeric",
                "preco_unitario" => "required:numeric",
            ]
        );

        try {
            //Grava novo produto na tabela
            Produto::create($request->all());

            //Mostra mensagem na tela
            flash('registro cadastrado com sucesso')->success();
        } catch (\Exception $e) {
            return response('Não foi possível gravar resgistro: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Produto  $produto
     * @return \Illuminate\Http\Response
     */
    public function show(Produto $produto)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Produto  $produto
     * @return \Illuminate\Http\Response
     */
    public function edit(Produto $produto)
    {
        //Retorna a view com os dados necessários
        return view('admin.produtos.edit', compact('produto'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Produto  $produto
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Produto $produto)
    {
        //Valida dados informados
        $this->validate(request(), [
            "nome" => "required:string",
            "descricao" => "required:string",
            "peso_unitario" => "required:numeric",
            "preco_unitario" => "required:numeric",
        ]);

        //Atualiza dado na tabela
        $produto->update($request->all());

        //Mostra mensagem na tela
        flash('Vigência atualizado com sucesso')->success();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Produto  $produto
     * @return \Illuminate\Http\Response
     */
    public function destroy(Produto $produto)
    {
        //Deleta registro na tabela
        $produto->delete();

        //Mostra mensagem na tela
        flash('Vigência deletado com sucesso')->success();

        //Redirect para a lista de produtos
        return redirect(route('produtos.index'));
    }
}
