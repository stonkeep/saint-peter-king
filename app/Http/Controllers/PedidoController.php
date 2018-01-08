<?php

namespace App\Http\Controllers;

use App\Pedido;
use App\StatusPedido;
use App\TipoEntrega;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{

    private $status;
    private $tipoEntregas;


    public function __construct()
    {
        //Busca os tipos de status na tabela - Vai ser nescessário no front end
        $this->status = StatusPedido::all();

        //Busca os tipos de entrega na tabela - Vai ser nescessário no front end
        $this->tipoEntregas = TipoEntrega::all();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //Usado aqui o Eager loading do Laravel para trazer já os dados do cliente e o status do pedido
        $data = Pedido::with(['cliente', 'status'])->get();

        return view('admin.pedidos.index', compact('data'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //Cria um objeto pedido em braco para não dar problema na view
        $pedido = new Pedido();

        //Carrega tipos de estatus e tipos de entregas
        $status = $this->status;
        $tipoEntregas = $this->tipoEntregas;

        //Chama a view de create com as variaveis nescessárias
        return view('admin.pedidos.create', compact('pedido', 'status', 'tipoEntregas'));
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
            'NF' => 'required',
            'impressaoDeComprovante' => 'required',
            'status' => 'required',
            'tipoEntrega' => 'required',
        ]);

        $idRetorn = DB::transaction(function () use ($request) {
            //Busca o cliente que esta logado
            $cliente = \Auth::user()->cliente;

            //Make pedido para esse cliente
            $pedido = $cliente->pedidos()->make([
                'NF' =>  $request->NF,
                'impressaoDeComprovante' => $request->impressaoDeComprovante
            ]);

            //Associa tipo de entrega informado com o pedido
            $pedido->tipoEntrega()->associate(TipoEntrega::find($request->tipoEntrega));
            //Associa status informado com o pedido
            $pedido->status()->associate(StatusPedido::find($request->status));

            //Salva as alterações
            $pedido->save();

            //Aqui retorna o id para a função
            return $pedido->id;
        });

        /**
         * Retorna a id que oi gravada no banco
         * O componente precisa dessa informação para saber se o registro foi mesmo gravado no banco de dados
        */
        return response()->json([
            'id' => $idRetorn
        ]);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\pedido  $pedido
     * @return \Illuminate\Http\Response
     */
    public function show(pedido $pedido)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\pedido  $pedido
     * @return \Illuminate\Http\Response
     */
    public function edit(pedido $pedido)
    {
        //Carrega tipos de estatus e tipos de entregas
        $status = $this->status;
        $tipoEntregas = $this->tipoEntregas;

        //retorna view da tela de edição com os dados nescessários
        return view('admin.pedidos.edit', compact('pedido', 'status', 'tipoEntregas'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\pedido  $pedido
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, pedido $pedido)
    {
        try {
            //Abre DB:transaction se não conseguir fazer algum comando no DB faz o rollback automático
            DB::transaction(function () use ($request, $pedido) {

                //Atualiza NF
                $pedido ->NF =  $request->NF;

                //Atualiza impressaoDeComprovante
                $pedido ->impressaoDeComprovante = $request->impressaoDeComprovante;

                //Associa tipo de entrega informado com o pedido
                $pedido->tipoEntrega()->associate(TipoEntrega::find($request->tipoEntrega));

                //Associa status informado com o pedido
                $pedido->status()->associate(StatusPedido::find($request->status));

                //Salva as alterações
                $pedido->save();

                //OBS: Como pedido não pode mudar de lciente não fiz essa atualização

            });
            //Se atualizou sem problema no banco de dadso mostra mensagem na tela
            flash('Registro atualizado com sucesso')->success();

        } catch (\Exception $e) {
            //Se der erro mostra mensagem na tela
            flash('Registro não pode ser atualizado: ' . $e->getMessage())->error();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\pedido  $pedido
     * @return \Illuminate\Http\Response
     */
    public function destroy(pedido $pedido)
    {
        //Tenta fazer o delete do pedido
        try {
            //Faz o delete
            $pedido->delete();

            //Se o delete deu certo apresenta mensagem na tela
            flash('Registro deletado com sucesso')->success();

        } catch (QueryException $e) {
            //Se não foi possível fazer o delete apresenta uma mensagem de erro na tela
            flash('Não foi possível deletar o registro: ' . $e->getMessage())->error();
        } catch (\Exception $e) {
                //Se não foi possível fazer o delete apresenta uma mensagem de erro na tela
            flash('Não foi possível deletar o registro: ' . $e->getMessage())->error();
        }

        //De qualquer forma faz o redirect para a lista de pedidos
        return redirect()->route('pedidos.index');
    }
}
