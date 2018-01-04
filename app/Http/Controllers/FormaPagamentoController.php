<?php

namespace App\Http\Controllers;

use App\FormaPagamento;
use Illuminate\Http\Request;
use Mockery\Exception;

class FormaPagamentoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //busca todas as formas de pagamento
        $data = FormaPagamento::all();

        //Retorna a view com os dados necessários
        return view('admin.pagamentos.index', compact("data"));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //Cria um objeto vazio para não dar problema no componente
        $pagamento = new FormaPagamento();

        //Retorna a view com os dados necessários
        return view("admin.pagamentos.create", compact('pagamento'));
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
            FormaPagamento::create($request->all());

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
     * @param  \App\FormaPagamento  $formaPagamento
     * @return \Illuminate\Http\Response
     */
    public function show(FormaPagamento $formaPagamento)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\FormaPagamento  $formaPagamento
     * @return \Illuminate\Http\Response
     */
    public function edit(FormaPagamento $pagamento)
    {
        //Retorna a view com os dados necessários
        return view('admin.pagamentos.edit', compact('pagamento'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\FormaPagamento  $formaPagamento
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, FormaPagamento $pagamento)
    {
        $request->validate([
            "descricao" => "required"
        ]);

        try {
            //Atualiza dados na tabela
            $pagamento->update($request->all());

            //Mostra mensagem na tela
            flash('Dados gravados com sucesso');

        } catch (\Exception $exception) {
            return response('Não foi possível fazer o update: ' . $exception->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\FormaPagamento  $formaPagamento
     * @return \Illuminate\Http\Response
     */
    public function destroy(FormaPagamento $pagamento)
    {
        try {
            //Faz delete na tabela
            $pagamento->delete();

            //Mostra mensagem na tela
            flash('registro apagado com sucesso')->success();

        } catch (\Exception $exception) {
            flash('Não foi possível deletar o registro: '. $exception->getMessage())->error();
        }

        //redirect para a lista de pagamentos mesmo se o mesmo não deu certo
        return redirect()->route('pagamentos.index');
    }
}
