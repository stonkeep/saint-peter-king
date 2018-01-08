<?php

namespace App\Http\Controllers;

use App\StatusPedido;
use Doctrine\DBAL\Query\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        //Tenta fazer a criação no banco de dados
        try {

            DB::transaction(function () use ($request) {
                //Grava no forma de pagamento na tabela
                StatusPedido::create($request->all());
            });

        } catch (QueryException $e) {
//            return response()->json(['ok' => 'ok']);
            Log::error($e->getMessage());
            return response('Algo deu errado. Favor verificar', 500)->header('Content-Type', 'text/plain');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response('Algo deu errado. Favor verificar', 500)->header('Content-Type', 'text/plain');
//            return response()->json(['ok' => 'ok']);

        }

        //mostra mensagem na tela
        flash('Dados cadastrado com sucesso')->success();
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
        return view("admin.status.edit", compact('status'));
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
        //Valida os dados informados
        $request->validate([
            "descricao" => "required"
        ]);

        try {

            //Cria transaction para roolback automático
            DB::transaction(function () use ($status, $request) {

                //Faz update com as informaçõe enviadas
                $status->update($request->all());

            });

        } catch (QueryException $e) {
            //Se der erro mostra mensagem na tela
            return response('Não foi possível atualizar resgistro: ' . $e->getMessage(), 500);
        } catch (\Exception $e){
            //Se der erro mostra mensagem na tela
            return response('Não foi possível atualizar resgistro: ' . $e->getMessage(), 500);
        }
        //Se atualizou sem problema no banco de dadso mostra mensagem na tela
        flash('Registro atualizado com sucesso')->success();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\StatusPedido  $status
     * @return \Illuminate\Http\Response
     */
    public function destroy(StatusPedido $status)
    {
        try {

            DB::transaction(function () use ($status) {
                //deleta registro da tabela
                $status->delete();
            });

            flash('Registro deletado com sucesso')->success();

        } catch (QueryException $e) {
            //Se não foi possível fazer o delete apresenta uma mensagem de erro na tela
            flash('Não foi possível deletar o registro: ' . $e->getMessage())->error();
        } catch (\Exception $e) {
            //Se não foi possível fazer o delete apresenta uma mensagem de erro na tela
            flash('Não foi possível deletar o registro: ' . $e->getMessage())->error();
        }

        //De qualquer forma faz o redirect para a lista de pedidos
        return redirect()->route('status.index');

    }
}
