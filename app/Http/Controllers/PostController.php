<?php

namespace App\Http\Controllers;


use App\Post;
use App\PostCategoria;
use Auth;
use Illuminate\Http\Request;

class PostController extends Controller
{

    private $autorizado = true;


    public function __construct()
    {
        $user = Auth::user();
        if ($user) {
            if ( ! $user->can('Post')) {
                flash('Você não tem acesso suficiente')->error();
                $this->autorizado = false;
            }
        }
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if ( ! $this->autorizado) {
            return back();
        }

        $data = Post::with('categoria')->where('active', 1)->orderBy('created_at', 'desc')->get();
        //$data = Post::where('active', 1)->orderBy('created_at', 'desc');

        //return home.blade.php template from resources/views folder
        return view('admin.posts.list', compact('data'));
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        if ( ! $this->autorizado) {
            return back();
        }
        $categorias = PostCategoria::pluck('descricao', 'id');

        return view('admin.posts.create', compact('categorias'));

    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|unique:posts',
            'body' => 'required',
            'categoria' => 'required',
        ]);

        $post = new Post();
        $post->title = $request->get('title');
        $post->body = $request->get('body');
        $post->categoria_id = $request->get('categoria');
        $post->slug = str_slug($post->title);
        $post->author_id = $request->user()->id;
        if ($request->has('save')) {
            $post->active = 0;
            $message = 'Post saved successfully';
        } else {
            $post->active = 1;
            $message = 'Post published successfully';
        }
        $post->save();

        return redirect('admin/posts/edit/'.$post->slug)->withMessage($message);
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Post $post
     *
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $post = Post::where('slug', $slug)->first();
        if ( ! $post) {
            return redirect('/')->withErrors('requested page not found');
        }

        return view('admin.posts.show')->withPost($post);
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Post $post
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $slug)
    {
        if ( ! $this->autorizado) {
            return back();
        }
        $categorias = PostCategoria::pluck('descricao', 'id');

        $post = Post::where('slug', $slug)->first();
        return view('admin.posts.edit', compact('post', 'categorias'));

    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Post                $post
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        //TODO criar campo alterado por....
        $this->validate($request, [
            'title' => 'required',
            'body' => 'required',
            'categoria' => 'required'
            //'author_id' => 'required|exists:users,id',
        ]);

        $post_id = $request->input('post_id');
        $post = Post::find($post_id);
        if ($post) {

            $title = $request->input('title');
            $categoria = $request->input('categoria');
            $slug = str_slug($title);
            $duplicate = Post::where('slug', $slug)->first();
            if ($duplicate) {
                if ($duplicate->id != $post_id) {
                    return redirect('admin/posts/edit/'.$post->slug)->withErrors('Title already exists.')->withInput();
                } else {
                    $post->slug = $slug;
                }
            }
            $post->title = $title;
            $post->categoria_id = $categoria;
            $post->body = $request->input('body');
            if ($request->has('save')) {
                $post->active = 0;
                flash('Post saved successfully')->success();
                $landing = 'admin/posts/edit/'.$post->slug;
            } else {
                $post->active = 1;
                flash('Post updated successfully')->success();
                $landing = 'posts/'.$post->slug;
            }
            $post->save();

            return redirect()->route('indexPosts');
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Post $post
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        //
        $post = Post::find($id);
        if ($post && ($post->author_id == $request->user()->id || $request->user()->is_admin())) {
            $post->delete();
            $data['message'] = 'Post deleted Successfully';
            flash('Post deletado com sucesso')->success();
        } else {
            $data['errors'] = 'Invalid Operation. You have not sufficient permissions';
        }

        return redirect('/admin/posts')->with($data);
    }
}