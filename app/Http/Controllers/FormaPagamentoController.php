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
        $data = FormaPagamento::all();
        return view('admin.pagamentos.index', compact("data"));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $pagamento = new FormaPagamento();
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
        $request->validate([
            "descricao" => "required"
        ]);

        try {
            FormaPagamento::create($request->all());
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
            $pagamento->update($request->all());
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
            $pagamento->delete();
        } catch (\Exception $exception) {
            flash('Não foi possível deletar o registro: '. $exception->getMessage())->error();
        }

        flash('registro apagado com sucesso')->success();
        return redirect()->route('pagamentos.index');
    }
}
