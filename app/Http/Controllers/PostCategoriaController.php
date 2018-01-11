<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\PostCategoria;
use Auth;
use Illuminate\Http\Request;

class PostCategoriaController extends Controller
{
    private $autorizado = true;
//    public function __construct()
//    {
//        $user = Auth::user();
//        if ($user) {
//            if ( ! $user->can('Cargos')) {
//                flash('Você não tem acesso suficiente')->error();
//                $this->autorizado = false;
//            }
//        }
//    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
//        if (!$user->hasPermissionTo('Post')) {
//            flash('Você não tem acesso suficiente')->error();
//            return redirect('/');
//        }

        $data = PostCategoria::all();
        return view('admin.post-categorias.show', compact('data'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.post-categorias.create');
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
            'descricao' => 'required|unique:post_categorias',
        ]);

        try {
            PostCategoria::create($request->all());
            flash('Categoria de posts atualizada com sucesso')->success();
        } catch (\Exception $e) {
            flash('Erro '.$e->getCode().' ocorreu. Favor verificar com a administração do sistema')->error();
        }
        return redirect(route('indexPostCategorias'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\PostCategoria  $postCategoria
     * @return \Illuminate\Http\Response
     */
    public function show(PostCategoria $postCategoria)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\PostCategoria  $postCategoria
     * @return \Illuminate\Http\Response
     */
    public function edit(PostCategoria $postCategoria)
    {
        $user = Auth::user();
        if (!$user->can('Post')) {
            flash('Você não tem acesso suficiente')->error();
            return redirect('/');
        }

        return view('admin.post-categorias.edit', compact('postCategoria'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\PostCategoria  $postCategoria
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $postCategoria = PostCategoria::find($id);
        $this->validate($request, [
            'descricao' => 'required',
        ]);

        try {
            $postCategoria->update($request->all());
            flash('Categoria atualizada com sucesso')->success();
        } catch (\Exception $e) {
            flash('Erro '.$e->getCode().' ocorreu. Favor verificar com a administração do sistema')->error();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\PostCategoria  $postCategoria
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            PostCategoria::find($id)->delete();
            flash('Categoria deletado com sucesso')->success();
        } catch (\Exception $e) {
            flash('Erro '.$e->getCode().' ocorreu. Favor verificar com a administração do sistema')->error();
        }
        return redirect(route('indexPostCategorias'));
    }
}
