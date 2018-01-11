{{-- resources/views/admin/dashboard.blade.php --}}

@extends('adminlte::page')

@section('title', 'Regiões')

@section('content_header')
    <h1>Cargo</h1>
@stop

@section('content')

    @include('admin.layouts.erros')
    <div id="app">
        {{ csrf_field() }}
         <post-categoria id="{{$postCategoria->id}}" descricao="{{$postCategoria->descricao}}"></post-categoria>
    </div>

@stop


@section('css')
    <link rel="stylesheet" href="/css/admin_custom.css">
@stop

@section('js')
    <!-- Scripts -->
    <script src="/js/app.js"></script>
@stop